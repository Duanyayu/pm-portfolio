/**
 * decisions.js — "待决策"提醒横幅
 * 在仪表盘顶部展示需要产品经理决策的事项、截止倒计时
 */
(function(global) {
  global.Dashboard = global.Dashboard || {};
  var Data = global.Dashboard.Data;

  global.Dashboard.Decisions = {
    init: function(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this._dismissed = JSON.parse(localStorage.getItem('dashboard-dismissed-decisions') || '[]');
      this.render();
    },

    render: function() {
      var decisions = Data.getDecisions();
      var self = this;
      var activeDecisions = decisions.filter(function(d) {
        return self._dismissed.indexOf(d.id) === -1;
      });

      this.container.innerHTML = '';

      if (activeDecisions.length === 0) {
        this.container.innerHTML = '<div style="font-size:13px;color:#8b949e;">暂无待决策事项。</div>';
        return;
      }

      activeDecisions.forEach(function(decision) {
        var banner = document.createElement('div');
        banner.className = 'decisions-banner';

        // Countdown
        var daysLeft = self._daysUntil(decision.deadline);
        var countdownText = daysLeft < 0 ? '已逾期' : daysLeft === 0 ? '今天截止' : daysLeft + ' 天剩余';
        var countdownColor = daysLeft < 0 ? '#f85149' : daysLeft <= 2 ? '#f85149' : daysLeft <= 5 ? '#d2991b' : '#8b949e';

        banner.innerHTML =
          '<div class="icon">⚠️</div>' +
          '<div class="content">' +
          '<div class="title">待决策: ' + decision.title + '</div>' +
          '<div style="font-size:13px;margin-bottom:6px;">' + decision.context + '</div>' +
          decision.options.map(function(o) { return '<div class="decision-item">• ' + o + '</div>'; }).join('') +
          '<div style="margin-top:6px;font-size:12px;">' +
          '<strong>推荐:</strong> ' + decision.recommendation +
          ' | <strong>负责人:</strong> ' + decision.owner +
          ' | <span style="color:' + countdownColor + ';">截止: ' + decision.deadline + ' (' + countdownText + ')</span>' +
          '</div></div>';

        // Dismiss button: only in edit mode
        if (global.Dashboard && global.Dashboard.editMode) {
          var dismissBtn = document.createElement('button');
          dismissBtn.className = 'dismiss';
          dismissBtn.title = '暂时关闭';
          dismissBtn.textContent = '✕';
          dismissBtn.addEventListener('click', function() {
            self._dismissed.push(decision.id);
            localStorage.setItem('dashboard-dismissed-decisions', JSON.stringify(self._dismissed));
            banner.remove();
            if (self.container.querySelectorAll('.decisions-banner').length === 0) {
              self.container.innerHTML = '<div style="font-size:13px;color:#8b949e;">所有决策已处理。</div>';
            }
          });
          banner.appendChild(dismissBtn);
        }

        self.container.appendChild(banner);
      });
    },

    _daysUntil: function(dateStr) {
      var now = new Date();
      var deadline = new Date(dateStr);
      return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    }
  };
})(window);
