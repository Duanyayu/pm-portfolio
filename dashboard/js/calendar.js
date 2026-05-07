/**
 * calendar.js — Sprint 发布日历
 * Gantt 风格时间线，展示各 Sprint 的起止日期和里程碑
 */
(function(global) {
  global.Dashboard = global.Dashboard || {};
  var Data = global.Dashboard.Data;

  global.Dashboard.Calendar = {
    init: function(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.render();
    },

    render: function() {
      var sprints = Data.getSprints();
      var milestones = Data.getMilestones();
      this.container.innerHTML = '';

      // Calculate date range
      var allStart = sprints[0].start;
      var allEnd = sprints[sprints.length - 1].end;
      var totalDays = this._daysBetween(allStart, allEnd);

      var timeline = document.createElement('div');
      timeline.className = 'sprint-timeline';

      // Month header
      var monthHeader = document.createElement('div');
      monthHeader.style.cssText = 'display:flex;align-items:center;gap:12px;font-size:11px;color:#8b949e;margin-bottom:8px;padding-left:92px;';
      monthHeader.innerHTML = '<span>4月</span><span style="margin-left:auto;">5月</span><span style="margin-right:20px;">6月</span>';
      timeline.appendChild(monthHeader);

      sprints.forEach(function(sprint) {
        var row = document.createElement('div');
        row.className = 'sprint-row';

        var nameEl = document.createElement('div');
        nameEl.className = 'sprint-name';
        nameEl.innerHTML = sprint.name + '<br><span style="font-size:11px;color:#8b949e;font-weight:400;">' + sprint.start + '</span>';
        row.appendChild(nameEl);

        var track = document.createElement('div');
        track.className = 'sprint-bar-track';

        var startOffset = global.Dashboard.Calendar._daysBetween(allStart, sprint.start);
        var sprintDays = global.Dashboard.Calendar._daysBetween(sprint.start, sprint.end);
        var leftPct = (startOffset / totalDays) * 100;
        var widthPct = (sprintDays / totalDays) * 100;

        var bar = document.createElement('div');
        bar.className = 'sprint-bar-fill ' + sprint.status;
        bar.style.cssText = 'left:' + leftPct + '%;width:' + widthPct + '%;';
        bar.textContent = sprint.goal;
        bar.style.cssText += 'display:flex;align-items:center;padding-left:8px;font-size:11px;overflow:hidden;white-space:nowrap;';
        track.appendChild(bar);

        // Milestone markers on this sprint
        milestones.forEach(function(ms) {
          var msDate = ms.date;
          var msOffset = global.Dashboard.Calendar._daysBetween(allStart, msDate);
          if (msOffset < 0 || msOffset > totalDays) return;
          var msLeftPct = (msOffset / totalDays) * 100;
          var marker = document.createElement('div');
          marker.className = 'sprint-milestone';
          marker.style.left = msLeftPct + '%';
          marker.title = ms.name + ' (' + ms.date + ')';
          if (ms.status === 'done') marker.style.background = '#238636';
          if (ms.status === 'active') marker.style.background = '#d2991b';
          track.appendChild(marker);
        });

        row.appendChild(track);
        timeline.appendChild(row);
      });

      this.container.appendChild(timeline);

      // Legend
      var legend = document.createElement('div');
      legend.style.cssText = 'display:flex;gap:16px;margin-top:12px;font-size:11px;color:#8b949e;';
      legend.innerHTML =
        '<span><span style="display:inline-block;width:12px;height:12px;background:#238636;border-radius:2px;margin-right:4px;vertical-align:middle;"></span>已完成</span>' +
        '<span><span style="display:inline-block;width:12px;height:12px;background:#1f6feb;border-radius:2px;margin-right:4px;vertical-align:middle;"></span>当前 Sprint</span>' +
        '<span><span style="display:inline-block;width:12px;height:12px;border:1px dashed #30363d;border-radius:2px;margin-right:4px;vertical-align:middle;"></span>即将到来</span>' +
        '<span><span style="display:inline-block;width:2px;height:12px;background:#d2991b;margin-right:4px;vertical-align:middle;"></span>里程碑</span>';
      this.container.appendChild(legend);
    },

    _daysBetween: function(d1, d2) {
      return Math.round((new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24));
    }
  };
})(window);
