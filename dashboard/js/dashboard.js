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
          } else {
            statusEl.textContent = '模拟数据 (连接失败)';
            statusEl.style.color = '#f85149';
            toggle.checked = false;
          }
        });
      } else {
        statusEl.textContent = '模拟数据';
        statusEl.style.color = '#8b949e';
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
