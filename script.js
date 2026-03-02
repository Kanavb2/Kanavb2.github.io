(function () {
  'use strict';

  // Typing animation
  const phrases = [
    'Forward Deployed Engineer',
    'AI Architect',
    'Enterprise Builder',
    'Production AI Specialist',
  ];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;
  const typedEl = document.getElementById('typed-text');

  function type() {
    if (!typedEl) return;
    const current = phrases[phraseIndex];
    if (!isDeleting) {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) { isDeleting = true; setTimeout(type, 2000); return; }
      setTimeout(type, 60);
    } else {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(type, 400); return; }
      setTimeout(type, 35);
    }
  }
  setTimeout(type, 800);

  // Nav scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Mobile toggle
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => { toggle.classList.toggle('active'); links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { toggle.classList.remove('active'); links.classList.remove('open'); }));
  }

  // Scroll animations
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));

  // Counter animation
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const dec = parseInt(el.dataset.decimals) || 0;
    const prefix = el.dataset.prefix || '';
    const dur = 2000, start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = prefix + (((1 - Math.pow(1 - p, 4))) * target).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number').forEach(el => cObs.observe(el));

  // Particle canvas
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [], w, h;
    function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
    function init() {
      const count = Math.min(Math.floor((w * h) / 15000), 80);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
        r: Math.random() * 1.5 + .5,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.5)'; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 150) * 0.15})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    resize(); init(); draw();
    window.addEventListener('resize', () => { resize(); init(); });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    });
  });
})();
