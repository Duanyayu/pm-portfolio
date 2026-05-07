/**
 * jira-connector.js — Jira Cloud REST API 连接器（可选）
 * 默认关闭。启用时从 Jira 拉取实时数据，失败则回退模拟数据。
 *
 * 重要限制：Jira Cloud API 不支持浏览器 CORS 跨域请求。
 * 从 file:// 或 localhost 打开的页面无法直接调用 Jira API。
 * 要启用实时数据，需要通过本地 HTTP 代理转发请求。
 *
 * 用法：
 *   1. 在 data.js 中设置 jira.baseUrl（如 https://your-domain.atlassian.net）
 *   2. 打开页面后切换"Jira 实时"开关
 *   3. 输入邮箱和 API Token（仅存 sessionStorage，关闭即清除）
 */
(function(global) {
  global.Dashboard = global.Dashboard || {};
  var Data = global.Dashboard.Data;

  global.Dashboard.JiraConnector = {

    _getAuth: function() {
      var auth = sessionStorage.getItem('jira-auth');
      if (auth) return JSON.parse(auth);
      return null;
    },

    _promptAuth: function() {
      var email = prompt('Jira Cloud 登录邮箱:');
      if (!email) return null;
      var token = prompt('Jira API Token\n(在 https://id.atlassian.com/manage-profile/security/api-tokens 创建):');
      if (!token) return null;
      var auth = { email: email, token: token };
      sessionStorage.setItem('jira-auth', JSON.stringify(auth));
      return auth;
    },

    _fetch: function(endpoint) {
      var config = Data.getJiraConfig();
      var baseUrl = config.baseUrl.replace(/\/$/, '');

      // Pre-check: empty or placeholder URL
      if (!baseUrl || baseUrl === 'https://your-domain.atlassian.net') {
        return Promise.reject(new Error('URL_NOT_CONFIGURED'));
      }

      var auth = this._getAuth();
      if (!auth) {
        auth = this._promptAuth();
        if (!auth) return Promise.reject(new Error('AUTH_CANCELLED'));
      }

      var headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(auth.email + ':' + auth.token));
      headers.set('Accept', 'application/json');

      // Direct browser requests from file:// to Jira Cloud WILL fail due to CORS.
      // Jira Cloud does NOT return Access-Control-Allow-Origin headers.
      // Workaround: serve dashboard via local HTTP proxy, see docs/jira/jira-api-setup-guide.md
      return fetch(baseUrl + endpoint, { headers: headers })
        .then(function(res) {
          if (!res.ok) {
            if (res.status === 401) {
              sessionStorage.removeItem('jira-auth');
              throw new Error('AUTH_FAILED');
            }
            throw new Error('HTTP_' + res.status);
          }
          return res.json();
        })
        .catch(function(err) {
          // Re-throw typed errors as-is
          if (err.message === 'AUTH_FAILED' || err.message === 'AUTH_CANCELLED' ||
              err.message === 'URL_NOT_CONFIGURED' || err.message.indexOf('HTTP_') === 0) {
            throw err;
          }
          // All other errors (CORS, network, DNS) → uniform type
          throw new Error('CORS_OR_NETWORK');
        });
    },

    /**
     * 尝试从 Jira 获取项目 Issues
     */
    fetchIssues: function() {
      var config = Data.getJiraConfig();
      var endpoint = '/rest/api/3/search?jql=project%3D' + encodeURIComponent(config.projectKey) + '&maxResults=50';
      console.log('[Jira] Connecting to ' + config.baseUrl + ' ...');

      return this._fetch(endpoint)
        .then(function(data) {
          console.log('[Jira] Connected! Got ' + data.issues.length + ' issues.');
          return { success: true, count: data.issues.length };
        })
        .catch(function(err) {
          console.warn('[Jira] Connection failed: ' + err.message);
          return { success: false, error: err.message };
        });
    },

    /**
     * 测试 Jira 连接是否可用
     */
    testConnection: function() {
      return this._fetch('/rest/api/3/myself')
        .then(function(user) {
          return { success: true, user: user.displayName };
        })
        .catch(function(err) {
          return { success: false, error: err.message };
        });
    }
  };
})(window);
