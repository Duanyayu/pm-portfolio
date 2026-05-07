/**
 * burndown.js — SVG 燃尽图（理想 vs 实际）
 * 展示 Sprint 内剩余 Story Points 的变化趋势
 */
(function(global) {
  global.Dashboard = global.Dashboard || {};
  var Data = global.Dashboard.Data;

  global.Dashboard.Burndown = {
    init: function(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this._renderSprintSelector();
      this.render('S2'); // 默认显示当前 Sprint
    },

    _renderSprintSelector: function() {
      var self = this;
      var sprints = Data.getSprints();
      var sel = document.createElement('select');
      sel.id = 'burndown-sprint-select';
      sel.style.cssText = 'background:#21262d;color:#c9d1d9;border:1px solid #30363d;padding:4px 8px;border-radius:4px;margin-bottom:12px;font-size:13px;';
      sprints.forEach(function(s) {
        var opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name + ' (' + s.start + ' ~ ' + s.end + ')';
        if (s.status === 'current') opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener('change', function() { self.render(this.value); });
      this.container.appendChild(sel);

      this.chartDiv = document.createElement('div');
      this.chartDiv.className = 'burndown-container';
      this.container.appendChild(this.chartDiv);

      this.legendDiv = document.createElement('div');
      this.legendDiv.className = 'burndown-legend';
      this.legendDiv.innerHTML =
        '<span><span class="line" style="background:#8b949e;border:1px dashed #8b949e;"></span>理想线</span>' +
        '<span><span class="line" style="background:#58a6ff;"></span>实际线</span>';
      this.container.appendChild(this.legendDiv);
    },

    render: function(sprintId) {
      var bd = Data.getBurndown();
      var sprintData = bd.sprints[sprintId];
      if (!sprintData) return;

      var ideal = sprintData.ideal;
      var actual = sprintData.actual;
      var total = sprintData.totalPoints;
      var days = ideal.length;

      var W = 600, H = 260;
      var pad = { top: 20, right: 20, bottom: 30, left: 45 };
      var plotW = W - pad.left - pad.right;
      var plotH = H - pad.top - pad.bottom;

      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', H);

      // Grid lines
      for (var i = 0; i <= 5; i++) {
        var y = pad.top + (plotH / 5) * i;
        var line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', pad.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', W - pad.right);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#21262d');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);

        var label = document.createElementNS(svgNS, 'text');
        label.setAttribute('x', pad.left - 8);
        label.setAttribute('y', y + 4);
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('fill', '#8b949e');
        label.setAttribute('font-size', '11');
        label.textContent = Math.round(total * (1 - i / 5));
        svg.appendChild(label);
      }

      // X axis labels
      for (var d = 0; d < days; d++) {
        var x = pad.left + (plotW / (days - 1)) * d;
        var tick = document.createElementNS(svgNS, 'line');
        tick.setAttribute('x1', x); tick.setAttribute('y1', pad.top + plotH);
        tick.setAttribute('x2', x); tick.setAttribute('y2', pad.top + plotH + 5);
        tick.setAttribute('stroke', '#30363d'); tick.setAttribute('stroke-width', '1');
        svg.appendChild(tick);

        var dl = document.createElementNS(svgNS, 'text');
        dl.setAttribute('x', x);
        dl.setAttribute('y', pad.top + plotH + 18);
        dl.setAttribute('text-anchor', 'middle');
        dl.setAttribute('fill', '#8b949e');
        dl.setAttribute('font-size', '10');
        dl.textContent = 'D' + (d + 1);
        svg.appendChild(dl);
      }

      // Ideal line
      var idealPath = this._buildPath(ideal, total, pad, plotW, plotH, days);
      var idealLine = document.createElementNS(svgNS, 'path');
      idealLine.setAttribute('d', idealPath);
      idealLine.setAttribute('fill', 'none');
      idealLine.setAttribute('stroke', '#8b949e');
      idealLine.setAttribute('stroke-width', '2');
      idealLine.setAttribute('stroke-dasharray', '6,3');
      svg.appendChild(idealLine);

      // Actual line
      var actualPath = this._buildPath(actual, total, pad, plotW, plotH, days);
      var actualLine = document.createElementNS(svgNS, 'path');
      actualLine.setAttribute('d', actualPath);
      actualLine.setAttribute('fill', 'none');
      actualLine.setAttribute('stroke', '#58a6ff');
      actualLine.setAttribute('stroke-width', '2.5');
      svg.appendChild(actualLine);

      // Data points on actual line
      for (var p = 0; p < days; p++) {
        if (actual[p] === 0 && p > 0 && actual[p-1] === 0) continue;
        var px = pad.left + (plotW / (days - 1)) * p;
        var py = pad.top + plotH * (1 - actual[p] / total);

        var dot = document.createElementNS(svgNS, 'circle');
        dot.setAttribute('cx', px); dot.setAttribute('cy', py);
        dot.setAttribute('r', '3.5');
        dot.setAttribute('fill', '#58a6ff');
        svg.appendChild(dot);

        // Tooltip on hover
        dot.style.cursor = 'pointer';
        dot.addEventListener('mouseenter', (function(x, y, val, day) {
          return function() { global.Dashboard.Burndown._showTooltip(x, y, val, day); };
        })(px, py, actual[p], p + 1));

        dot.addEventListener('mouseleave', function() {
          global.Dashboard.Burndown._hideTooltip();
        });
      }

      this.chartDiv.innerHTML = '';
      this.chartDiv.appendChild(svg);
    },

    _buildPath: function(data, total, pad, plotW, plotH, days) {
      var path = '';
      for (var i = 0; i < days; i++) {
        var x = pad.left + (plotW / (days - 1)) * i;
        var y = pad.top + plotH * (1 - data[i] / total);
        path += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
      }
      return path;
    },

    _showTooltip: function(x, y, value, day) {
      var tip = document.getElementById('burndown-tooltip');
      if (!tip) {
        tip = document.createElement('div');
        tip.id = 'burndown-tooltip';
        tip.style.cssText = 'position:absolute;background:#161b22;border:1px solid #30363d;padding:6px 10px;border-radius:6px;font-size:12px;pointer-events:none;z-index:100;color:#c9d1d9;';
        document.body.appendChild(tip);
      }
      tip.innerHTML = '<strong>Day ' + day + '</strong><br>剩余: ' + value + ' points';
      tip.style.left = (x + 350) + 'px';
      tip.style.top = (y + 100) + 'px';
      tip.style.display = 'block';
    },

    _hideTooltip: function() {
      var tip = document.getElementById('burndown-tooltip');
      if (tip) tip.style.display = 'none';
    }
  };
})(window);
