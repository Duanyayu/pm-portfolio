// ── Scroll-triggered reveal ──
(function() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
})();

// ── Counter animation ──
(function() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !e.target._done) {
        e.target._done = true;
        var el = e.target;
        var target = parseFloat(el.dataset.target);
        var start = performance.now();
        var dur = 1500;
        function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var v = target * (1 - Math.pow(1 - p, 4));
          el.textContent = Math.round(v);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-target]').forEach(function(el) { obs.observe(el); });
})();

// ── Nav scroll active link ──
(function() {
  var links = document.querySelectorAll('.nav-links a');
  if (!links.length) return;
  window.addEventListener('scroll', function() {
    var sy = window.scrollY + 140;
    var found = false;
    document.querySelectorAll('section[id]').forEach(function(s) {
      if (found) return;
      var top = s.offsetTop;
      var bot = top + s.offsetHeight;
      if (sy >= top && sy < bot) {
        found = true;
        var id = s.getAttribute('id');
        links.forEach(function(l) {
          l.classList.remove('active');
          if (l.getAttribute('href') === '#' + id) l.classList.add('active');
        });
      }
    });
  });
})();

// ── Sidebar TOC active tracking ──
(function() {
  var tocLinks = document.querySelectorAll('.doc-toc a');
  if (!tocLinks.length) return;
  var headings = [];
  tocLinks.forEach(function(a) {
    var href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      var el = document.getElementById(href.slice(1));
      if (el) headings.push({ el: el, link: a });
    }
  });
  if (!headings.length) return;
  window.addEventListener('scroll', function() {
    var sy = window.scrollY + 120;
    var active = null;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].el.offsetTop <= sy) {
        active = headings[i];
      } else {
        break;
      }
    }
    tocLinks.forEach(function(a) { a.classList.remove('active'); });
    if (active) active.link.classList.add('active');
  });
})();

// ── Smooth scroll for TOC (respect fixed nav) ──
(function() {
  document.querySelectorAll('.doc-toc a').forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
      }
    });
  });
})();

// ── Print / PDF button ──
(function() {
  var btn = document.querySelector('.btn-pdf');
  if (btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.print();
    });
  }
})();
