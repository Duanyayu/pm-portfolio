/**
 * sync-log.js — 跨团队同步记录
 * 结构化展示会议纪要，支持按团队过滤、展开详情
 */
(function(global) {
  global.Dashboard = global.Dashboard || {};
  var Data = global.Dashboard.Data;

  global.Dashboard.SyncLog = {
    init: function(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.render();
    },

    render: function(filterTeam) {
      var entries = Data.getSyncLog();
      var self = this;
      this.container.innerHTML = '';

      // Filter buttons
      var teams = ['all', 'hardware', 'firmware', 'structure', 'testing', 'supply', 'pm'];
      var teamLabels = { all: '全部', hardware: '硬件', firmware: '固件', structure: '结构', testing: '测试', supply: '供应链', pm: '产品' };

      var filterDiv = document.createElement('div');
      filterDiv.className = 'sync-filter';
      teams.forEach(function(t) {
        var btn = document.createElement('button');
        btn.className = 'sync-filter-btn' + (t === (filterTeam || 'all') ? ' active' : '');
        btn.textContent = teamLabels[t];
        btn.addEventListener('click', function() {
          self.render(t === 'all' ? undefined : t);
        });
        filterDiv.appendChild(btn);
      });
      this.container.appendChild(filterDiv);

      // Filter entries
      var filtered = entries;
      if (filterTeam) {
        filtered = entries.filter(function(e) { return e.teams.indexOf(filterTeam) !== -1; });
      }

      if (filtered.length === 0) {
        this.container.appendChild(document.createTextNode('没有匹配的同步记录。'));
        return;
      }

      // Render entries
      filtered.forEach(function(entry) {
        var div = document.createElement('div');
        div.className = 'sync-entry';

        var html =
          '<div class="sync-meta">' +
          '<span><strong>' + entry.date + ' ' + entry.time + '</strong> ' + entry.title + '</span>' +
          '<span>与会: ' + entry.attendees.join(', ') + '</span>' +
          '</div>' +
          '<div style="margin-bottom:8px;"><strong>关键结论:</strong></div>';

        entry.decisions.forEach(function(d, i) {
          html += '<div style="margin-bottom:2px;font-size:13px;">' + (i + 1) + '. ' + d + '</div>';
        });

        html += '<div style="margin-top:8px;"><strong>待办事项:</strong></div>';

        entry.actionItems.forEach(function(ai) {
          var statusIcon = ai.status === 'done' ? '✅' : '⏳';
          var statusColor = ai.status === 'done' ? '#238636' : '#d2991b';
          html += '<div class="action-item" style="font-size:13px;color:' + statusColor + ';">' +
            statusIcon + ' ' + ai.item + ' — <strong>' + ai.owner + '</strong> (截止: ' + ai.due + ')' +
            '</div>';
        });

        html += '<div style="margin-top:8px;font-size:12px;color:#8b949e;">' +
          '<strong>下次同步:</strong> ' + entry.nextSync + ' — 聚焦: ' + entry.nextFocus +
          '</div>';

        div.innerHTML = html;
        self.container.appendChild(div);
      });
    }
  };
})(window);
