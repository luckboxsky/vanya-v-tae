// Light motion for the whole site: reveal on scroll, the home route line and counters in the media kit.
// Content stays visible without JavaScript and for visitors who ask for reduced motion.
(() => {
  'use strict';
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('motion-ready');

  // Cards, photos and figures fade up when they scroll into view. Only items below the first screen are hidden,
  // so nothing that is already visible on load blinks.
  const REVEAL = '.story-card,.read-also-card,.service-card,.recommendation-card,.place-card,.reel-card,.yt-card,.actor-card,.tv-card,.story-yt,.story-content figure,.ad-format-grid article,.home-about figure';
  let observerAlive = false;
  const revealer = new IntersectionObserver(entries => entries.forEach(entry => {
    observerAlive = true;
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-revealed');
    revealer.unobserve(entry.target);
  }), {rootMargin: '0px 0px -8% 0px'});
  function scan() {
    document.querySelectorAll(REVEAL).forEach(el => {
      if (el.dataset.reveal) return;
      el.dataset.reveal = '1';
      if (el.getBoundingClientRect().top < innerHeight * .92) return;
      const siblings = el.parentElement ? [...el.parentElement.children].filter(x => x.matches(REVEAL)) : [];
      el.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(el) % 3, 2) * 90 + 'ms');
      el.classList.add('is-hidden');
      revealer.observe(el);
    });
  }
  scan();
  // Safety net: if the observer stays silent (some in-app browsers), reveal by scroll position, and if the observer never
  // answers at all, show everything after a moment.
  let ticking = false;
  const sweep = () => {
    ticking = false;
    document.querySelectorAll('.is-hidden:not(.is-revealed)').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('is-revealed'); revealer.unobserve(el); }
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } }, {passive: true});
  setTimeout(() => { if (!observerAlive) document.querySelectorAll('.is-hidden').forEach(el => el.classList.remove('is-hidden')); }, 2500);
  // Recommendation cards are rendered by places.js after the island opens.
  let pending = 0;
  new MutationObserver(() => { clearTimeout(pending); pending = setTimeout(scan, 80); }).observe(document.body, {childList: true, subtree: true});

  // Home: the islands of the route light up one after another and stop on the current city.
  const route = document.querySelector('[data-route]');
  if (route) {
    const stops = [...route.querySelectorAll('.hero-route-stop')];
    let i = 0;
    const step = () => {
      stops.forEach((s, n) => s.classList.toggle('is-on', n === i));
      if (i < stops.length - 1) { i++; setTimeout(step, 1100); }
    };
    setTimeout(step, 600);
  }

  // Media kit: numbers count up from zero once they are on screen, keeping their format ("3,2 млн", "+4 165").
  const counter = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    counter.unobserve(entry.target);
    countUp(entry.target);
  }), {threshold: .6});
  function countUp(el) {
    const text = el.textContent;
    const m = text.match(/^(\+?)([\d\s ]*\d(?:,\d+)?)(.*)$/);
    if (!m) return;
    const decimals = (m[2].split(',')[1] || '').length;
    const target = parseFloat(m[2].replace(/[\s ]/g, '').replace(',', '.'));
    if (!target) return;
    const grouped = /[\s ]/.test(m[2].trim());
    const fmt = v => {
      let s = v.toFixed(decimals).replace('.', ',');
      if (grouped) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return m[1] + s + m[3];
    };
    let start = 0;
    const dur = 1300;
    const tick = now => {
      if (!start) start = now;
      const t = Math.min(Math.max((now - start) / dur, 0), 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick); else el.textContent = text;
    };
    requestAnimationFrame(tick);
  }
  document.querySelectorAll('.reel-views strong,.instagram-stats-grid strong').forEach(el => counter.observe(el));
})();
