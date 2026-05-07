/**
 * workload.js — 团队负载/资源分配视图
 * 横向柱状图展示每个成员的任务负载和容量占用
 */
(function(global) {
  global.Dashboard = global.Dashboard || {};
  var Data = global.Dashboard.Data;

  global.Dashboard.Workload = {
    init: function(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.render();
    },

    render: function() {
      var team = Data.getTeam();
      this.container.innerHTML = '';

      var table = document.createElement('table');
      table.className = 'workload-table';
      table.innerHTML =
        '<thead><tr>' +
        '<th>成员</th><th>职能</th><th>当前任务</th><th>已承诺点数</th><th>负载率</th><th>状态</th>' +
        '</tr></thead><tbody></tbody>';

      var tbody = table.querySelector('tbody');
      team.forEach(function(member) {
        var tr = document.createElement('tr');

        var barClass = member.risk === 'over' ? 'wl-over' : member.risk === 'warn' ? 'wl-warn' : 'wl-ok';
        var statusText = member.risk === 'over' ? '超载' : member.risk === 'warn' ? '偏高' : '正常';
        var statusColor = member.risk === 'over' ? '#f85149' : member.risk === 'warn' ? '#d2991b' : '#238636';

        tr.innerHTML =
          '<td><strong>' + member.name + '</strong></td>' +
          '<td>' + member.role + '</td>' +
          '<td>' + member.tasks + '</td>' +
          '<td>' + member.pointsCommitted + ' pts</td>' +
          '<td>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div class="workload-bar-bg"><div class="workload-bar-fill ' + barClass + '" style="width:' + member.capacity + '%;"></div></div>' +
          '<span style="font-size:12px;">' + member.capacity + '%</span>' +
          '</div></td>' +
          '<td><span style="color:' + statusColor + ';font-size:12px;font-weight:600;">' + statusText + '</span></td>';

        tbody.appendChild(tr);
      });

      this.container.appendChild(table);

      // Summary
      var summary = document.createElement('div');
      summary.style.cssText = 'margin-top:12px;font-size:12px;color:#8b949e;display:flex;gap:16px;';
      var totalTasks = team.reduce(function(s, m) { return s + m.tasks; }, 0);
      var totalPoints = team.reduce(function(s, m) { return s + m.pointsCommitted; }, 0);
      var avgCapacity = Math.round(team.reduce(function(s, m) { return s + m.capacity; }, 0) / team.length);
      summary.innerHTML =
        '<span>总任务数: <strong style="color:#c9d1d9;">' + totalTasks + '</strong></span>' +
        '<span>总承诺点数: <strong style="color:#c9d1d9;">' + totalPoints + ' pts</strong></span>' +
        '<span>平均负载: <strong style="color:#c9d1d9;">' + avgCapacity + '%</strong></span>' +
        '<span style="color:#d2991b;">注意: 赵工负载偏高，建议关注 Sprint 3 资源安排</span>';
      this.container.appendChild(summary);
    }
  };
})(window);
