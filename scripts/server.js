/**
 * Mars 5 Ultra 仪表盘 — 本地演示服务器
 *
 * 功能:
 *   1. 静态文件服务 (dashboard/)
 *   2. Jira API 代理 (/api/jira/* → Jira Cloud)
 *   3. 零外部依赖，仅使用 Node.js 内置模块
 *
 * 用法:
 *   node scripts/server.js
 *   浏览器打开 http://localhost:3000
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DASHBOARD_DIR = path.join(__dirname, '..', 'dashboard');
const JIRA_HOST = '424592383.atlassian.net';

// MIME types for static files
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function serveStatic(reqPath, res) {
  // Map / -> /index.html, /css/* -> /css/*, /js/* -> /js/*
  let filePath = reqPath;
  if (filePath === '/' || filePath === '') filePath = '/index.html';

  // Security: prevent directory traversal
  const normalized = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(DASHBOARD_DIR, normalized);

  // Ensure the resolved path is within dashboard/
  if (!fullPath.startsWith(DASHBOARD_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA fallback: serve index.html for unknown paths
        fs.readFile(path.join(DASHBOARD_DIR, 'index.html'), (err2, indexData) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(indexData);
          }
        });
      } else {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function proxyJira(reqPath, reqMethod, reqHeaders, reqBody, res) {
  // Strip /api/jira prefix
  const jiraPath = reqPath.replace(/^\/api\/jira/, '') || '/';
  const targetUrl = `https://${JIRA_HOST}${jiraPath}`;

  console.log(`[proxy] ${reqMethod} ${targetUrl}`);

  const parsed = url.parse(targetUrl);
  const options = {
    hostname: parsed.hostname,
    port: 443,
    path: parsed.path,
    method: reqMethod,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    timeout: 20000
  };

  // Forward Authorization header from the browser request
  if (reqHeaders['authorization']) {
    options.headers['Authorization'] = reqHeaders['authorization'];
    console.log('[proxy] Auth header forwarded');
  }

  const proxyReq = https.request(options, (proxyRes) => {
    // Forward CORS headers so localhost can read the response
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type'
    };

    res.writeHead(proxyRes.statusCode, {
      ...corsHeaders,
      'Content-Type': proxyRes.headers['content-type'] || 'application/json'
    });

    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    console.error(`[proxy] Error: ${e.message}`);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error', detail: e.message }));
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    res.writeHead(504, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Gateway timeout' }));
  });

  if (reqBody) {
    proxyReq.write(reqBody);
  }
  proxyReq.end();
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url);
  const reqPath = parsed.pathname;

  // Handle OPTIONS preflight for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type'
    });
    res.end();
    return;
  }

  // Proxy Jira API requests
  if (reqPath.startsWith('/api/jira/')) {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      proxyJira(reqPath, req.method, req.headers, body || null, res);
    });
    return;
  }

  // Serve static dashboard files
  serveStatic(reqPath, res);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ============================================');
  console.log('  Mars 5 Ultra 散热优化 — 项目仪表盘');
  console.log('  ============================================');
  console.log('');
  console.log(`  Local:  http://localhost:${PORT}`);
  console.log(`  Proxy:  /api/jira/* → ${JIRA_HOST}`);
  console.log('');
  console.log('  按 Ctrl+C 停止服务器');
  console.log('');
});
