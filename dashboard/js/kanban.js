/**
 * kanban.js — 拖拽看板 (HTML5 Drag & Drop API)
 * 支持卡片在列间拖动，数据持久化到 localStorage
 */
(function(global) {
  global.Dashboard = global.Dashboard || {};
  var Data = global.Dashboard.Data;

  global.Dashboard.Kanban = {
    init: function(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.render();
    },

    render: function() {
      var self = this;
      var kanban = Data.getKanban();
      this.container.innerHTML = '';

      var board = document.createElement('div');
      board.className = 'kanban-board';

      kanban.columns.forEach(function(col) {
        var colEl = document.createElement('div');
        colEl.className = 'kanban-col';
        colEl.dataset.colId = col.id;

        var count = col.items.length;
        colEl.innerHTML = '<h3>' + col.name + ' <span class="count">' + count + '</span></h3>';

        col.items.forEach(function(item) {
          var card = document.createElement('div');
          card.className = 'task-card';
          if (global.Dashboard.editMode) {
            card.draggable = true;
          }
          card.dataset.itemId = item.id;
          card.innerHTML = '<span class="func-tag ' + (item.funcClass || '') + '">' + item.func + '</span>' + item.title;

          // Drag events (only in edit mode)
          if (global.Dashboard.editMode) {
            card.addEventListener('dragstart', function(e) {
              card.classList.add('dragging');
              e.dataTransfer.setData('text/plain', JSON.stringify({ itemId: item.id, fromCol: col.id }));
              e.dataTransfer.effectAllowed = 'move';
            });

            card.addEventListener('dragend', function(e) {
              card.classList.remove('dragging');
              board.querySelectorAll('.kanban-col').forEach(function(c) { c.classList.remove('drag-over'); });
            });
          }

          colEl.appendChild(card);
        });

        // Drop events on column (only in edit mode)
        if (global.Dashboard.editMode) {
          colEl.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            colEl.classList.add('drag-over');
          });

          colEl.addEventListener('dragleave', function(e) {
            colEl.classList.remove('drag-over');
          });

          colEl.addEventListener('drop', function(e) {
            e.preventDefault();
            colEl.classList.remove('drag-over');
            var data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.fromCol !== col.id) {
              self._moveItem(data.itemId, data.fromCol, col.id);
            }
          });
        }

        board.appendChild(colEl);
      });

      this.container.appendChild(board);
    },

    _moveItem: function(itemId, fromColId, toColId) {
      var kanban = Data.getKanban();
      var fromCol = kanban.columns.find(function(c) { return c.id === fromColId; });
      var toCol = kanban.columns.find(function(c) { return c.id === toColId; });
      if (!fromCol || !toCol) return;

      var idx = fromCol.items.findIndex(function(i) { return i.id === itemId; });
      if (idx === -1) return;

      var item = fromCol.items.splice(idx, 1)[0];
      toCol.items.push(item);

      Data.updateKanban(kanban.columns);
      this.render();

      // 通知其他模块数据变化
      if (global.Dashboard.emit) {
        global.Dashboard.emit('kanbanChanged', { item: item, from: fromColId, to: toColId });
      }

      // 持久化到 localStorage
      try {
        localStorage.setItem('dashboard-kanban', JSON.stringify(kanban.columns));
      } catch(e) {}
    }
  };
})(window);
