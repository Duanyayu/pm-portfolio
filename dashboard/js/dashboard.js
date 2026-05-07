/**
 * dashboard.js — 主控脚本
 * 标签页导航、事件总线、模块初始化
 */
(function(global) {
  var D = global.Dashboard;

  // ---- Event Bus ----
  var listeners = {};

  D.on = function(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  };

  D.emit = function(event, data) {
    (listeners[event] || []).forEach(function(cb) { cb(data); });
  };

  // ---- Tab Navigation ----
  function initTabs() {
    var tabs = document.querySelectorAll('.tab-btn');
    var contents = document.querySelectorAll('.tab-content');

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        contents.forEach(function(c) { c.classList.remove('active'); });
        tab.classList.add('active');
        var target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add('active');

        // Re-render certain views on tab switch (to handle any state changes)
        if (tab.dataset.tab === 'tab-kanban' && D.Kanban && D.Kanban.render) {
          D.Kanban.render();
        }
        if (tab.dataset.tab === 'tab-sync' && D.SyncLog && D.SyncLog.render) {
          D.SyncLog.render();
        }
      });
    });
  }

  // ---- Jira Live Toggle ----
  function initJiraToggle() {
    var toggle = document.getElementById('jira-live-toggle');
    var statusEl = document.getElementById('jira-status');
    if (!toggle || !statusEl) return;

    toggle.addEventListener('change', function() {
      if (this.checked) {
        statusEl.textContent = '连接中...';
        statusEl.style.color = '#d2991b';

        D.JiraConnector.testConnection().then(function(result) {
          if (result.success) {
            statusEl.textContent = '实时数据 (' + result.user + ')';
            statusEl.style.color = '#238636';
            D.JiraConnector.fetchIssues();
            return;
          }

          // Specific error messages
          var errMsg;
          switch (result.error) {
            case 'URL_NOT_CONFIGURED':
              errMsg = '请先在 data.js 中配置 jira.baseUrl';
              break;
            case 'CORS_OR_NETWORK':
              errMsg = '浏览器 CORS 限制 (需本地代理)';
              break;
            case 'AUTH_FAILED':
              errMsg = '认证失败，请检查邮箱和 Token';
              break;
            case 'AUTH_CANCELLED':
              errMsg = '已取消认证';
              break;
            default:
              errMsg = '连接失败: ' + (result.error || '未知错误');
          }
          statusEl.textContent = errMsg;
          statusEl.style.color = '#f85149';
          statusEl.style.cursor = 'pointer';
          statusEl.title = '点击查看详情';
          statusEl.onclick = function() {
            var tips = {
              'URL_NOT_CONFIGURED': '需要配置 Jira Cloud 地址。\n\n打开 dashboard/js/data.js，\n找到 jira 配置块，\n将 baseUrl 改为你的 Jira 地址\n(如 https://your-company.atlassian.net)',
              'CORS_OR_NETWORK': '这是浏览器安全策略限制，不是你的配置问题。\n\nJira Cloud 不允许从本地 HTML 文件\n直接调用其 API。\n\n解决方案：需要启动一个本地 HTTP 代理\n将请求转发到 Jira。\n详见 docs/jira/jira-api-setup-guide.md\n\n当前将使用模拟数据运行。',
              'AUTH_FAILED': 'API Token 可能已过期或邮箱不匹配。\n请重新生成 Token:\nhttps://id.atlassian.com/manage-profile/security/api-tokens'
            }[result.error];
            if (tips) alert(tips);
          };
          toggle.checked = false;
        });
      } else {
        statusEl.textContent = '模拟数据';
        statusEl.style.color = '#8b949e';
        statusEl.style.cursor = 'default';
        statusEl.onclick = null;
      }
    });
  }

  // ---- Init All ----
  document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initJiraToggle();

    // Initialize all modules
    if (D.Burndown && D.Burndown.init)     D.Burndown.init('burndown-container');
    if (D.Kanban && D.Kanban.init)          D.Kanban.init('kanban-container');
    if (D.RiskMatrix && D.RiskMatrix.init)  D.RiskMatrix.init('risk-matrix-container');
    if (D.Workload && D.Workload.init)      D.Workload.init('workload-container');
    if (D.Calendar && D.Calendar.init)      D.Calendar.init('calendar-container');
    if (D.SyncLog && D.SyncLog.init)        D.SyncLog.init('sync-log-container');
    if (D.Decisions && D.Decisions.init)    D.Decisions.init('decisions-container');

    // Render milestones in overview tab
    renderMilestones();
    renderProjectStatus();

    // Listen for kanban changes to update counts
    D.on('kanbanChanged', function() {
      renderMilestones();
    });
  });

  // ---- Render Milestones (Overview Tab) ----
  function renderMilestones() {
    var container = document.getElementById('milestone-container');
    if (!container) return;

    var milestones = D.Data.getMilestones();
    var project = D.Data.getProject();

    var html = '<div class="progress-bar"><div class="progress-fill" style="width:' + project.progress + '%;"></div></div>';
    html += '<div class="milestone-timeline">';

    var statusIcon = { done: '✅', active: '🟡', pending: '⚪' };
    var dotClass = { done: 'done', active: 'active', pending: '' };

    milestones.forEach(function(ms) {
      html += '<div class="milestone">' +
        '<span class="milestone-dot ' + (dotClass[ms.status] || '') + '"></span>' +
        '<span class="milestone-label">' + (statusIcon[ms.status] || '') + ' ' + ms.name + '</span>' +
        '<span class="milestone-date">(' + ms.date + ')</span>' +
        '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderProjectStatus() {
    var container = document.getElementById('project-status');
    if (!container) return;
    var project = D.Data.getProject();
    container.innerHTML =
      '<span class="badge badge-active">进行中</span>' +
      '<div style="font-size:12px;color:#8b949e;margin-top:8px;">最后更新：' + project.lastUpdated + '</div>';
  }

})(window);
