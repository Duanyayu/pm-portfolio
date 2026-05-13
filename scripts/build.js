/**
 * build-portfolio.js — md → HTML Portfolio Generator
 *
 * Reads md files from deliverables/career-transition/, generates:
 *   1. site/index.html (homepage with document index)
 *   2. site/docs/*.html (individual document pages)
 *
 * Usage:
 *   node scripts/build.js          # HTML only
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// ── Config ──
const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const OUT_DIR = path.join(ROOT, 'site');
const DOCS_OUT = path.join(OUT_DIR, 'docs');
const ASSETS_DIR = path.join(ROOT, 'assets');

const SITE_TITLE = 'Duanyanyu · PM Portfolio';
const SITE_URL = 'https://duanyayu.github.io/pm-portfolio';
const REPO_URL = 'https://github.com/Duanyayu/pm-portfolio';

// ── Document metadata ──
const DOC_META = {
  'ELEGOO-customized-brief': {
    group: 'a', title: 'ELEGOO 公司速览',
    desc: '三个90后从华强北起家，2026年营收23-25亿，10余款产品覆盖FDM和光固化全线。',
  },
  'A4-capability-matrix': {
    group: 'a', title: 'JD能力对齐：8项要求×我的证据',
    desc: '将ELEGOO硬件PM的8项JD要求逐一映射到我的实际工作经历，用TU36案例自证核心能力。',
  },
  'B5-behavioral-qa': {
    group: 'a', title: '面试高频题：我的回答策略',
    desc: '6个最高频PM行为面试题的标准回答，全部锚定TU36电源柜案例，不提术语，提行为。',
  },
  'A2-prd-from-test-report': {
    group: 'a', title: '从测试报告到PRD的视角转换',
    desc: '以TU36故障为案例，展示测试思维和产品思维的关键区别——写PRD需要的不是新内容，是新视角。',
  },
  'A3-wbs-breakdown': {
    group: 'a', title: 'PRD拆解：4个Epic×12个Story',
    desc: '将TU36电源柜兼容性PRD拆为4个Epic和12个Story，每个Story含验收标准、优先级、估时和依赖。',
  },
  'B3-isomorphic-analogy': {
    group: 'a', title: '电网设备与3D打印：同一套系统思维',
    desc: '建立电网设备测试与3D打印之间的同构类比——两个行业共享五层物理系统的误差溯源逻辑。',
  },
  'A7-elegoo-deep-research': {
    group: 'a', title: 'ELEGOO深度研究：三个核心问题与我的方案',
    desc: '诊断ELEGOO的三大核心问题（用户信任、质量一致性、生态差距），并提出具体的产品改进方案。',
  },
  'competitor-analysis': {
    group: 'a', title: '竞品地图：四小龙谁在赚什么钱',
    desc: '分析拓竹、创想三维、纵维立方、ELEGOO的利润模式差异和致命弱点，判断真正的护城河在哪。',
  },
  'independent-views': {
    group: 'a', title: '四个战略判断：多色、耗材、生态、可靠性',
    desc: '四问竞品格局——ELEGOO不应在多色参数上卷，应在可靠性和耗材开放策略上建立差异化。',
  },
  'ecosystem-expansion': {
    group: 'a', title: '把蛋糕做大：从卖打印机到硬件基础设施',
    desc: '提出ELEGOO与嘉立创深度整合的愿景——让硬件工程师画完PCB就自动生成外壳，重新定义行业边界。',
  },
  'resume-cn': {
    group: 'resource', title: '简历（中文版）',
    desc: '段彦羽 — 硬件产品经理',
  },
  'resume-en': {
    group: 'resource', title: 'Resume (English)',
    desc: 'Duanyanyu — Hardware Product Manager',
  },
};

// ── Templates ──
function t_html(head, body, extraClass) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${head.title} | ${SITE_TITLE}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${head.cssPath || 'css/style.css'}">
</head>
<body class="${extraClass || ''}">
${body}
<script src="${head.jsPath || 'js/main.js'}"></script>
</body>
</html>`;
}

function t_nav(isIndex) {
  const prefix = isIndex ? '' : '../index.html';
  const links = [
    { href: isIndex ? 'index.html' : '../index.html', label: '首页' },
    { href: prefix + '#resources', label: '简历' },
    { href: prefix + '#elegoo', label: 'ELEGOO' },
    { href: prefix + '#evidence', label: '能力证据' },
  ];
  const linkHtml = links.map(l =>
    `<li><a href="${l.href}">${l.label}</a></li>`
  ).join('');

  return `<nav class="nav" id="nav">
  <a href="${isIndex ? 'index.html' : '../index.html'}" class="nav-logo">Duanyanyu<span>PM Portfolio</span></a>
  <ul class="nav-links">${linkHtml}</ul>
</nav>`;
}

function t_hero(title, subtitle, badge) {
  return `<section class="hero"><div class="hero-grid"></div><div class="hero-inner">
  <div class="hero-badge reveal">${badge}</div>
  <h1 class="reveal d1">${title}</h1>
  <p class="lede reveal d2">${subtitle}</p>
  <div class="hero-btns reveal d3">
    <a href="#evidence" class="btn btn-primary">浏览文档</a>
    <a href="../reference/mars5-dashboard.html" class="btn btn-outline" style="border-color:rgba(255,255,255,0.25);color:#fff">基于Mars 5 Ultra用户反馈的产品从0-1仪表盘模拟</a>
    <a href="../tools/converter.html" class="btn btn-outline" style="border-color:rgba(255,255,255,0.25);color:#fff">md格式转换PDF工具</a>
  </div>
</div></section>`;
}

function t_stats(docCount, evidenceCount) {
  return `<div class="stats-bar reveal" style="grid-template-columns:repeat(2,1fr);max-width:560px;margin-left:auto;margin-right:auto">
  <div class="stat-card"><div class="stat-num" data-target="${docCount}">0</div><div class="stat-lbl">思考文档</div></div>
  <div class="stat-card"><div class="stat-num" data-target="${evidenceCount}">0</div><div class="stat-lbl">能力证据</div></div>
</div>`;
}

function t_footer() {
  return `<footer class="footer">
<div class="ft-links">
  <a href="${REPO_URL}" target="_blank">GitHub</a>
  <a href="${SITE_URL}" target="_blank">在线浏览</a>
</div>
</footer>`;
}

function t_doc_header(title, pdfUrl) {
  // PDF download button (pre-generated PDF, if exists)
  let pdfBtn = '';
  if (pdfUrl) {
    pdfBtn = `<a href="${pdfUrl}" class="btn-pdf" download>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      下载 PDF
    </a>`;
  }
  // Print button (always present, uses browser print → Save as PDF)
  const printBtn = `<a href="#" class="btn-pdf" onclick="window.print();return false" title="点击后选择「另存为PDF」即可保存">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    打印导出 PDF
  </a>`;
  return `<div class="doc-header">
    <div class="doc-action-bar">${printBtn}${pdfBtn}</div>
    <p class="doc-pdf-hint">点击「打印导出 PDF」→ 在打印对话框中选择「另存为 PDF」→ 即可获得带专业排版的 PDF 文件</p>
  </div>`;
}

// ── Markdown → HTML with heading IDs ──
function renderMd(mdContent) {
  // Configure marked to add IDs to headings
  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  // Custom renderer to add IDs to headings
  const renderer = new marked.Renderer();
  renderer.heading = function({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    // Generate ID from plain text
    const plainText = text.replace(/<[^>]+>/g, '').trim();
    const id = plainText
      .toLowerCase()
      .replace(/[^一-鿿\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 60);
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };

  return marked.parse(mdContent, { renderer });
}

// ── Build TOC from rendered HTML ──
function buildToc(html) {
  const headingRe = /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h[23]>/gi;
  const items = [];
  let match;
  while ((match = headingRe.exec(html)) !== null) {
    items.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ''),
    });
  }
  if (items.length === 0) return '';
  return `<ul class="doc-toc">${items.map(h =>
    `<li><a href="#${h.id}" class="toc-h${h.level}">${h.text}</a></li>`
  ).join('')}</ul>`;
}

// ── Generate document detail page ──
function generateDocPage(filename, mdContent, meta, allDocs) {
  const htmlBody = renderMd(mdContent);
  const toc = buildToc(htmlBody);
  const pdfPath = null; // PDF generation not yet configured

  // Build prev/next navigation
  let docNav = '';
  if (allDocs && allDocs.length > 1) {
    const idx = allDocs.findIndex(d => d.filename === filename);
    const prev = idx > 0 ? allDocs[idx - 1] : null;
    const next = idx < allDocs.length - 1 ? allDocs[idx + 1] : null;
    docNav = '<nav class="doc-nav">';
    if (prev) {
      docNav += `<div><div class="doc-nav-label">← 上一篇</div><a href="${prev.filename}.html">${prev.meta.title}</a></div>`;
    } else {
      docNav += '<div></div>';
    }
    if (next) {
      docNav += `<div style="text-align:right"><div class="doc-nav-label">下一篇 →</div><a href="${next.filename}.html">${next.meta.title}</a></div>`;
    } else {
      docNav += '<div></div>';
    }
    docNav += '</nav>';
  }

  const body = `
${t_nav(false)}
<div class="doc-layout">
  <aside class="doc-sidebar">
    <h4>目录</h4>
    ${toc}
  </aside>
  <main class="doc-content">
    ${t_doc_header(meta.title, pdfPath)}
    ${htmlBody}
    ${docNav}
  </main>
</div>
${t_footer()}`;

  const head = {
    title: meta.title,
    cssPath: '../../assets/css/style.css',
    jsPath: '../../assets/js/main.js',
  };

  return t_html(head, body, 'doc-page');
}

// ── Build Index Page ──
function generateIndex(docs) {
  const evidenceGroup = docs.filter(d => d.meta.group === 'a');

  // Evidence cards with sequential numbering 01-10
  const evidenceCards = evidenceGroup.map((d, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `<a href="docs/${d.filename}.html" class="doc-card reveal d1">
      <div class="doc-card-num">${num}</div>
      <div class="doc-card-body">
        <span class="doc-card-badge badge-evidence">证据</span>
        <h3>${d.meta.title}</h3>
        <p>${d.meta.desc}</p>
      </div>
    </a>`;
  }).join('');

  // Resources — resume cards only
  const resumeCards = [
    `<a href="docs/resume-cn.html" class="doc-resource-card reveal d1">
      <div class="doc-resource-icon">&#128196;</div>
      <div class="doc-card-body">
        <h3>简历（中文版）</h3>
        <p>段彦羽 — 硬件产品经理</p>
      </div>
    </a>`,
    `<a href="docs/resume-en.html" class="doc-resource-card reveal d1">
      <div class="doc-resource-icon">&#128196;</div>
      <div class="doc-card-body">
        <h3>Resume (English)</h3>
        <p>Duanyanyu — Hardware Product Manager</p>
      </div>
    </a>`,
    `<a href="../assets/resume-duanyayu.docx" class="doc-resource-card reveal d1" style="border-color:var(--green);border-style:solid" download>
      <div class="doc-resource-icon" style="background:rgba(79,154,116,0.1)">&#128196;</div>
      <div class="doc-card-body">
        <h3>简历下载 (.docx)</h3>
        <p>可直接打印的 Word 格式简历</p>
      </div>
    </a>`,
  ].join('');

  // ELEGOO inline content (chapters 一至四)
  const elegooInline = `
    <div class="elegoo-inline">
      <h3>一、ELEGOO 2026 最新快照</h3>
      <p>ELEGOO（智能派）由三位90后——陈波、洪英杰、欧阳翔——于2015年在深圳华强北创立。从 Arduino 开源电子套件起家，2018年转型3D打印机。创始人陈波的核心产品哲学是"中国制造，降维打击"——用深圳供应链把光固化做到299美元，扩大用户基数而不是提高单价。</p>
      <p>2026年，ELEGOO年营收23-25亿元，年增长约30%，员工超1000人。产品线覆盖 Mars（入门LCD）、Saturn（中大型LCD）、Jupiter（超大尺寸）、Neptune（FDM）四大系列共10余款在售机型。耗材年出货近5000吨，是公司实际上的现金牛业务。B轮和B+轮累计融资数亿元，投资方包括大疆、美团、高瓴资本。</p>

      <h3>二、ELEGOO 痛点地图（按紧急度×影响度排列）</h3>
      <div class="pain-grid">
        <div class="pain-card p0"><span class="pain-chip p0">P0 · 最高优先</span><h4>用户信任裂缝</h4><p>取消 Mars 5 Ultra 的 AMS（自动材料系统）承诺后，Kickstarter 支持者和早期用户的信任受损。这是品牌信用的核心问题——在消费电子行业，一次交付承诺的失信需要三次超额交付来修复。ELEGOO目前的回应相对沉默，缺少正式的补救方案公告。</p></div>
        <div class="pain-card p1"><span class="pain-chip p1">P1 · 重要</span><h4>硬件质量一致性</h4><p>多型号、多批次之间的品控波动是快速迭代策略的代价。用户社区中反复出现的问题包括了轴精度下降、LCD屏寿命不稳定、WiFi模块批次差异。这本质上是"新品节奏 vs 供应链质量体系"的张力——需要在PM层面建立标准化的质量门禁。</p></div>
        <div class="pain-card p2"><span class="pain-chip p2">P2 · 长期</span><h4>生态差距</h4><p>拓竹通过 MakerWorld 建立了"内容→耗材→机器"的闭环：用户在MakerWorld下载模型→一键打印→推荐官方耗材。ELEGOO的Nexprint平台在体量和活跃度上仍有显著差距。硬件可以快速迭代，但生态需要时间沉淀——这是最需要前瞻性战略投入的地方。</p></div>
      </div>

      <h3>三、我的价值匹配表</h3>
      <table class="elegoo-table">
        <tr><th>ELEGOO 痛点</th><th>我的能力</th><th>面试中可提出的具体方案</th></tr>
        <tr><td>用户信任修复</td><td>在电网设备行业经历过"型式试验合格但现场出问题"的信任危机处理</td><td>提出"承诺兜底框架"——一旦承诺了功能/时间，就必须有兜底方案；如果兜底也做不到，就在承诺前说清楚边界</td></tr>
        <tr><td>质量一致性</td><td>TU36事件就是多批次设备兼容性的诊断——从"不同电源柜、不同表型、不同接线方式"中定位规律</td><td>建立"新产品量产前的兼容性矩阵测试"制度——不只是测同型号，而是测它在真实使用环境中与各种外围设备的配合</td></tr>
        <tr><td>生态建设</td><td>理解"标准定义了产品的最低门槛"——在电网行业，国网/南网标准就是生态的游戏规则</td><td>提出耗材开放兼容策略——不是把耗材做成锁死的配件，而是做成"谁都能用，但用我的效果最好"的行业标准</td></tr>
      </table>

      <h3>四、我在面试中准备好的 PM 决策框架</h3>
      <div class="framework-grid">
        <div class="framework-card">
          <h4>框架 1：承诺兜底框架</h4>
          <p>任何对外承诺的功能，在PRD阶段必须定义"如果这个功能在截止日期前达不到验收标准怎么办"。电网设备的型式试验教会我：对外的承诺必须有三层——理想目标、可接受目标、底线目标。</p>
        </div>
        <div class="framework-card">
          <h4>框架 2：可靠性工程视角</h4>
          <p>复杂度每增加一层，至少需要两倍的测试用例来覆盖新的故障模式。这是我在电网设备测试中学到的第一条原则——也适用于3D打印机的多色系统、RFID耗材识别等新增复杂度的评估。</p>
        </div>
        <div class="framework-card">
          <h4>框架 3：生产力工具逻辑</h4>
          <p>3D打印机不是家电，是生产力工具。生产力工具的PM核心KPI不是"用户喜欢什么功能"，而是"什么让用户更快从A到B"——从"我想打印一个零件"到"零件在我手里"的时间越短越好。</p>
        </div>
      </div>
    </div>`;

  const body = `
${t_nav(true)}
${t_hero(
  '从电网设备测试<br><em>到3D打印PM</em>',
  '在无PM岗位的行业环境中自驱完成了需求分析、跨部门协同、问题闭环推动——本质上承担了硬件PM的核心职能。这里记录了关于我的能力展示。',
  '段彦羽的硬件产品经理作品集展示'
)}
${t_stats(docs.length, evidenceGroup.length)}

<section class="section" id="resources">
  <div class="divider"></div>
  <div class="section-kicker reveal">简历</div>
  <h2 class="section-heading reveal d1">我的简历</h2>
  <p class="section-sub reveal d2">中文简历、英文简历，以及可直接打印的 Word 格式文件。</p>
  <div class="doc-resource-grid" style="margin-top:28px">${resumeCards}</div>
</section>

<section class="section" id="elegoo">
  <div class="divider"></div>
  <div class="section-kicker reveal">ELEGOO 研究</div>
  <h2 class="section-heading reveal d1">我对 ELEGOO 的深度理解</h2>
  <p class="section-sub reveal d2">从公司速览到痛点诊断，从价值匹配到决策框架——展示如果我做ELEGOO的PM，我会从哪里开始思考。</p>
  ${elegooInline}
</section>

<section class="section" id="evidence">
  <div class="divider"></div>
  <div class="section-kicker reveal">能力证据</div>
  <h2 class="section-heading reveal d1">从基础认知到战略洞察</h2>
  <p class="section-sub reveal d2" style="max-width:720px">10篇思考文档，从公司速览到生态扩张，展示完整的认知深度演进。</p>
  <div class="doc-grid" style="margin-top:28px">${evidenceCards}</div>
</section>

${t_footer()}`;

  return t_html(
    { title: 'Home', cssPath: '../assets/css/style.css', jsPath: '../assets/js/main.js' },
    body
  );
}

// ── Main ──
function main() {
  // Ensure output directories exist
  [OUT_DIR, DOCS_OUT].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // Read all md files
  const files = fs.readdirSync(SRC_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => ({
      filename: f.replace('.md', ''),
      path: path.join(SRC_DIR, f),
      meta: DOC_META[f.replace('.md', '')] || {
        group: 'other',
        title: f.replace('.md', ''),
        desc: '',
        use: '',
      },
    }))
    .filter(f => f.meta.group !== 'meta'); // Exclude README from listing

  // Copy resume docx from assets to site for direct download
  const resumeDocxSrc = path.join(ASSETS_DIR, 'resume-duanyayu.docx');
  if (fs.existsSync(resumeDocxSrc)) {
    fs.copyFileSync(resumeDocxSrc, path.join(OUT_DIR, 'resume-duanyayu.docx'));
    console.log('Copied: resume-duanyayu.docx');
  }

  // Sort evidence files by DOC_META order (implicit from object definition)
  const metaOrder = Object.keys(DOC_META);
  files.sort((a, b) => {
    const ai = metaOrder.indexOf(a.filename);
    const bi = metaOrder.indexOf(b.filename);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  console.log(`Found ${files.length} thinking documents`);
  console.log('');

  // Generate index
  const indexHtml = generateIndex(files);
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexHtml, 'utf-8');
  console.log('Generated: site/index.html');

  // Generate individual doc pages
  let generated = 0;
  files.forEach(f => {
    // For HTML source files (A5 dashboard), skip markdown parsing — already copied above
    if (f.meta.isHtml) {
      generated++;
      return;
    }
    const mdContent = fs.readFileSync(f.path, 'utf-8');
    const html = generateDocPage(f.filename, mdContent, f.meta, files);
    fs.writeFileSync(path.join(DOCS_OUT, `${f.filename}.html`), html, 'utf-8');
    generated++;
    console.log(`  ${f.filename}.html`);
  });

  console.log(`\nDone: ${generated} HTML pages generated in site/`);

  console.log('\nOpen site/index.html in a browser to preview.');
}

main();
