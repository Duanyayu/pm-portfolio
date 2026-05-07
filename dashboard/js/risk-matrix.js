/**
 * risk-matrix.js — 5×5 概率×影响 风险矩阵热力图
 * X 轴：影响程度 (1-5)，Y 轴：发生概率 (1-5)
 * 气泡位置 = (影响, 概率)，气泡大小 = 严重程度
 */
(function(global) {
  global.Dashboard = global.Dashboard || {};
  var Data = global.Dashboard.Data;

  global.Dashboard.RiskMatrix = {
    init: function(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.render();
    },

    render: function() {
      var risks = Data.getRisks();
      var self = this;
      this.container.innerHTML = '';

      // Color scale for cells (green → yellow → red)
      var colors = [
        ['#0d3320', '#1a4a2e', '#1f5a35', '#2d6b3f', '#3a7d4a'],
        ['#2a4a1a', '#3d5a25', '#5a6b30', '#7a7d3a', '#9a8f45'],
        ['#4a4a0a', '#6b5a15', '#8a6a20', '#a87a2a', '#c48a35'],
        ['#4a2a0a', '#6b3515', '#8a4020', '#a84b2a', '#c45635'],
        ['#4a0a0a', '#6b1515', '#8a2020', '#a82a2a', '#c43535']
      ];

      // Main grid
      var grid = document.createElement('div');
      grid.className = 'risk-matrix-grid';
      grid.style.cssText = 'display:grid;grid-template-columns:80px repeat(5,1fr);grid-template-rows:auto repeat(5,70px);gap:3px;font-size:12px;';

      // Corner cell
      grid.appendChild(this._cell('', '#161b22', 'corner'));

      // Impact header (X axis)
      for (var imp = 1; imp <= 5; imp++) {
        grid.appendChild(this._cell('影响 ' + imp, '#161b22', 'header', '#8b949e'));
      }

      // Rows (Probability from 5 (top) to 1 (bottom))
      for (var prob = 5; prob >= 1; prob--) {
        grid.appendChild(this._cell('概率 ' + prob, '#161b22', 'header', '#8b949e'));

        for (var imp = 1; imp <= 5; imp++) {
          var bgColor = colors[prob - 1][imp - 1];
          var cell = this._cell('', bgColor, 'cell');
          cell.style.position = 'relative';

          // Find risks at this position
          var cellRisks = risks.filter(function(r) {
            return r.probability === prob && r.impact === imp;
          });

          cellRisks.forEach(function(risk, idx) {
            var bubble = document.createElement('div');
            bubble.className = 'risk-bubble';
            var size = 28 + risk.probability * risk.impact * 2;
            bubble.style.cssText =
              'position:absolute;width:' + size + 'px;height:' + size + 'px;' +
              'background:' + (risk.severity === '高' ? '#f85149' : risk.severity === '中' ? '#d2991b' : '#58a6ff') + ';' +
              'top:50%;left:50%;transform:translate(-50%,-50%);' +
              'border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
              'font-weight:700;font-size:11px;color:#fff;border:2px solid rgba(255,255,255,0.3);' +
              'transition:transform 0.2s;z-index:' + (10 + idx) + ';';

            bubble.textContent = risk.id.replace('R', '');
            bubble.title = risk.description;

            bubble.addEventListener('mouseenter', function() {
              bubble.style.transform = 'translate(-50%,-50%) scale(1.3)';
              bubble.style.zIndex = '50';
            });
            bubble.addEventListener('mouseleave', function() {
              bubble.style.transform = 'translate(-50%,-50%) scale(1)';
              bubble.style.zIndex = 10 + idx;
            });
            bubble.addEventListener('click', (function(r) {
              return function() { self._showDetail(r); };
            })(risk));

            cell.appendChild(bubble);
          });

          grid.appendChild(cell);
        }
      }

      this.container.appendChild(grid);

      // Risk detail table below
      var table = document.createElement('table');
      table.className = 'risk-table';
      table.style.cssText = 'width:100%;font-size:13px;border-collapse:collapse;margin-top:16px;';
      table.innerHTML =
        '<thead><tr>' +
        '<th style="text-align:left;padding:8px 6px;border-bottom:1px solid #21262d;color:#8b949e;">风险描述</th>' +
        '<th style="text-align:left;padding:8px 6px;border-bottom:1px solid #21262d;color:#8b949e;">概率×影响</th>' +
        '<th style="text-align:left;padding:8px 6px;border-bottom:1px solid #21262d;color:#8b949e;">等级</th>' +
        '<th style="text-align:left;padding:8px 6px;border-bottom:1px solid #21262d;color:#8b949e;">缓解措施</th>' +
        '<th style="text-align:left;padding:8px 6px;border-bottom:1px solid #21262d;color:#8b949e;">负责人</th>' +
        '</tr></thead><tbody></tbody>';

      var tbody = table.querySelector('tbody');
      risks.forEach(function(r) {
        var tr = document.createElement('tr');
        var sevClass = r.severity === '高' ? 'risk-high' : r.severity === '中' ? 'risk-mid' : '';
        tr.innerHTML =
          '<td style="padding:8px 6px;border-bottom:1px solid #21262d;">' + r.description + '</td>' +
          '<td style="padding:8px 6px;border-bottom:1px solid #21262d;">' + r.probability + '×' + r.impact + '</td>' +
          '<td class="' + sevClass + '" style="padding:8px 6px;border-bottom:1px solid #21262d;">' + r.severity + '</td>' +
          '<td style="padding:8px 6px;border-bottom:1px solid #21262d;font-size:12px;">' + r.mitigation + '</td>' +
          '<td style="padding:8px 6px;border-bottom:1px solid #21262d;">' + r.owner + '</td>';
        tbody.appendChild(tr);
      });
      this.container.appendChild(table);
    },

    _cell: function(text, bg, type, color) {
      var div = document.createElement('div');
      div.textContent = text;
      div.style.cssText =
        'background:' + bg + ';border-radius:4px;display:flex;align-items:center;justify-content:center;' +
        'min-height:' + (type === 'header' ? '28px' : '70px') + ';' +
        'color:' + (color || '#c9d1d9') + ';';
      return div;
    },

    _showDetail: function(risk) {
      var overlay = document.createElement('div');
      overlay.className = 'modal-overlay show';
      overlay.innerHTML =
        '<div class="modal-content">' +
        '<h3>风险详情: ' + risk.id + '</h3>' +
        '<p><strong>描述:</strong> ' + risk.description + '</p>' +
        '<p><strong>概率:</strong> ' + risk.probability + '/5 | <strong>影响:</strong> ' + risk.impact + '/5 | <strong>等级:</strong> ' + risk.severity + '</p>' +
        '<p><strong>缓解措施:</strong> ' + risk.mitigation + '</p>' +
        '<p><strong>负责人:</strong> ' + risk.owner + '</p>' +
        '<p><strong>状态:</strong> ' + risk.status + '</p>' +
        '<button class="modal-close">关闭</button>' +
        '</div>';
      document.body.appendChild(overlay);

      overlay.querySelector('.modal-close').addEventListener('click', function() {
        overlay.remove();
      });
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
      });
    }
  };
})(window);
