// A small tokay gecko (ตุ๊กแก) now and then runs out to a button or card on screen, sits for a moment and runs off.
// Tap it and it shouts "Ток-кэ!" (with sound) and darts away. Off for visitors who ask for reduced motion.
(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate) return;

  const SVG = '<svg viewBox="0 0 64 32" width="62" height="31" aria-hidden="true">' +
    '<g class="gk-tail"><path d="M18 14.2C11 12.5 7 17.5 1.5 14.5c3 4.6 9.5 4.3 16.5 3.3Z" fill="#7d93ab"/></g>' +
    '<g class="gk-leg gk-a" style="transform-origin:41px 12px"><path d="M41 12.5 42 7l4.5-2.3M46.5 4.7l2.4.6M46.5 4.7l1.3-2.1M46.5 4.7l-.2-2.4" stroke="#7d93ab" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round" fill="none"/></g>' +
    '<g class="gk-leg gk-b" style="transform-origin:41px 20px"><path d="M41 19.5 42 25l4.5 2.3M46.5 27.3l2.4-.6M46.5 27.3l1.3 2.1M46.5 27.3l-.2 2.4" stroke="#7d93ab" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round" fill="none"/></g>' +
    '<g class="gk-leg gk-b" style="transform-origin:22px 12px"><path d="M22 12.5 21 7l-4.5-2.3M16.5 4.7l-2.4.6M16.5 4.7l-1.3-2.1M16.5 4.7l.2-2.4" stroke="#7d93ab" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round" fill="none"/></g>' +
    '<g class="gk-leg gk-a" style="transform-origin:22px 20px"><path d="M22 19.5 21 25l-4.5 2.3M16.5 27.3l-2.4-.6M16.5 27.3l-1.3 2.1M16.5 27.3l.2 2.4" stroke="#7d93ab" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round" fill="none"/></g>' +
    '<ellipse cx="31" cy="16" rx="14" ry="5.8" fill="#8ea3ba"/>' +
    '<ellipse cx="49" cy="16" rx="7.5" ry="5.4" fill="#8ea3ba"/>' +
    '<g fill="#f0a77f"><circle cx="24" cy="14" r="1.3"/><circle cx="29" cy="18" r="1.4"/><circle cx="34" cy="13.6" r="1.2"/><circle cx="38.5" cy="17.6" r="1.3"/><circle cx="20" cy="17.8" r="1"/><circle cx="12" cy="15.4" r=".9"/><circle cx="46" cy="14.5" r=".9"/></g>' +
    '<circle cx="51" cy="12.2" r="1.7" fill="#f4c24f"/><circle cx="51" cy="19.8" r="1.7" fill="#f4c24f"/>' +
    '<circle cx="51.3" cy="12.2" r=".7" fill="#1d2b26"/><circle cx="51.3" cy="19.8" r=".7" fill="#1d2b26"/></svg>';

  const layer = document.createElement('div');
  layer.className = 'gecko-layer';
  const gecko = document.createElement('button');
  gecko.type = 'button';
  gecko.className = 'gecko';
  gecko.setAttribute('aria-label', 'Геккон');
  gecko.innerHTML = SVG;
  layer.appendChild(gecko);

  const SPEED = .42; // px per ms: geckos dart fast
  let visits = 0, running = null, timer = 0, busy = false, sound = null;

  function spots() {
    return [...document.querySelectorAll('.button,.service-action,.partner-action,.story-card,.read-also-card,.yt-card,.reel-card,.service-card,.recommendation-card,.place-card,.story-yt,.actor-card,.tv-card,.story-share,.story-next-step,.story-content figure,.story-note,.service,.story-content h2,.story-rules,.links-btn')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 90 && r.top > 110 && r.top < innerHeight - 40 && r.left > 4 && r.right < innerWidth - 4 && getComputedStyle(el).visibility !== 'hidden';
    });
  }
  function place(x, y, flip) {
    return `translate(${x}px,${y}px) scaleX(${flip ? -1 : 1})`;
  }
  function move(from, to, flip, extra = {}) {
    const dist = Math.abs(to.x - from.x);
    running = gecko.animate([{transform: place(from.x, from.y, flip)}, {transform: place(to.x, to.y, flip)}],
      {duration: Math.max(dist / SPEED, 250), easing: 'cubic-bezier(.3,.7,.4,1)', fill: 'forwards', ...extra});
    return running.finished;
  }

  async function visit() {
    if (busy || document.hidden || visits >= 3) return;
    // Nothing to sit on (a screen of plain text): run along the bottom line of the sticky header instead.
    const list = spots();
    const header = document.querySelector('.site-header');
    if (!list.length && !header) { schedule(5000); return; }
    busy = true;
    visits++;
    // Vanya's own recording of a tokay; fetched once the gecko first shows up, played only on a tap.
    if (!sound) { sound = new Audio('/assets/tokay.mp3'); sound.preload = 'auto'; sound.volume = .7; }
    if (!layer.isConnected) document.body.appendChild(layer);
    layer.style.height = document.documentElement.scrollHeight + 'px';
    const el = list.length ? list[Math.floor(Math.random() * list.length)] : header;
    const box = el.getBoundingClientRect();
    const r = list.length ? box : {left: box.left, width: box.width, top: box.bottom + 22};
    const fromLeft = r.left + r.width / 2 < innerWidth / 2;
    const y = r.top + scrollY - 26;
    const sitX = r.left + scrollX + r.width * (fromLeft ? .3 : .7) - 31;
    const edge = fromLeft ? scrollX - 70 : scrollX + innerWidth + 14;
    const exit = fromLeft ? scrollX + innerWidth + 14 : scrollX - 70;
    const half = edge + (sitX - edge) * .55;
    const flip = !fromLeft;
    // Dash, freeze, dash: the way geckos move. A tap hands control to the scare handler.
    const scared = () => gecko.classList.contains('is-scared');
    try {
      gecko.classList.add('is-running');
      await move({x: edge, y}, {x: half, y}, flip);
      gecko.classList.remove('is-running');
      await wait(350);
      if (scared()) return;
      gecko.classList.add('is-running');
      await move({x: half, y}, {x: sitX, y}, flip);
      gecko.classList.remove('is-running');
      gecko.classList.add('is-sitting');
      await wait(2600 + Math.random() * 1800);
      if (scared()) return;
      gecko.classList.remove('is-sitting');
      gecko.classList.add('is-running');
      await move({x: sitX, y}, {x: exit, y}, flip);
    } catch {
      return; // cancelled by a tap
    }
    finish();
  }
  function finish() {
    gecko.classList.remove('is-running', 'is-sitting');
    if (running) running.cancel();
    running = null;
    busy = false;
    layer.remove();
    schedule(45000 + Math.random() * 40000);
  }
  function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
  function schedule(ms) { clearTimeout(timer); timer = setTimeout(visit, ms); }

  // A tap scares it: a shout and a fast dash off the screen.
  gecko.addEventListener('click', () => {
    if (!running || gecko.classList.contains('is-scared')) return;
    const m = new DOMMatrix(getComputedStyle(gecko).transform);
    const flip = m.a < 0;
    const x = m.e, y = m.f;
    running.cancel();
    gecko.classList.remove('is-sitting');
    gecko.classList.add('is-running', 'is-scared');
    if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); }
    say(x, y);
    const exit = flip ? scrollX - 70 : scrollX + innerWidth + 14;
    running = gecko.animate([{transform: place(x, y, flip)}, {transform: place(exit, y, flip)}], {duration: Math.max(Math.abs(exit - x) / 1.1, 200), easing: 'ease-in', fill: 'forwards'});
    running.finished.then(() => { gecko.classList.remove('is-scared'); finish(); }).catch(() => {});
  });

  // The bubble counts catches on this device: the 3rd, 5th, 7th and 10th get their own words.
  // Thais say a tokay calling seven times in a row brings luck.
  function say(x, y) {
    let caught = 1;
    try {
      caught = (parseInt(localStorage.getItem('gecko-caught'), 10) || 0) + 1;
      localStorage.setItem('gecko-caught', caught);
    } catch { /* private mode: every catch is the first */ }
    const words = {
      3: 'Ты поймал геккона уже 3 раза 🦎',
      5: 'Эй, отстань от геккона!',
      7: '7 раз! В Таиланде верят: токи прокричал семь раз — к счастью. Удачи тебе!',
      10: '10 раз! Всё, ты местный 🦎'
    }[caught] || 'Ток-кэ!';
    const bubble = document.createElement('span');
    bubble.className = 'gecko-say' + (words.length > 12 ? ' is-long' : '');
    bubble.textContent = words;
    bubble.setAttribute('role', 'status');
    document.body.appendChild(bubble);
    const left = Math.min(Math.max(x - scrollX - 10, 12), innerWidth - bubble.offsetWidth - 12);
    bubble.style.left = left + 'px';
    bubble.style.top = Math.max(y - scrollY - bubble.offsetHeight - 6, 90) + 'px';
    setTimeout(() => bubble.remove(), words.length > 12 ? 3800 : 1400);
  }

  // #gecko in the address calls it right away (handy for showing it off).
  schedule(location.hash === '#gecko' ? 800 : 7000 + Math.random() * 7000);
})();
