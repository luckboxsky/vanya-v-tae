// Small Thai touches: a Thai phrase above the footer (tap for the next one) and Songkran water splashes in April.
(() => {
  'use strict';

  // Thai phrase above the footer. The page ships with the first one; a random one replaces it, a tap shows the next.
  const PHRASES = [
    ['สวัสดีครับ', 'сава-ди кхрап', 'привет (девушки говорят «кха»)'],
    ['ไม่เป็นไร', 'май пен рай', 'ничего страшного, забей'],
    ['อร่อยมากๆ', 'арой мак-мак', 'очень-очень вкусно'],
    ['ขอบคุณครับ', 'кхоп кхун кхрап', 'спасибо'],
    ['ไม่เผ็ด', 'май пет', 'не остро — самая нужная фраза в кафе'],
    ['เผ็ดนิดหน่อย', 'пет нит-ной', 'чуть-чуть остро'],
    ['สบาย สบาย', 'сабай-сабай', 'расслабься, всё хорошо'],
    ['ใจเย็นๆ', 'чай йен-йен', 'спокойно, не кипятись'],
    ['เท่าไหร่', 'тао рай?', 'сколько стоит?'],
    ['กินข้าวยัง', 'кин кхао рэ янг?', 'ты уже поел? — тайское «как дела»'],
    ['ไปไหน', 'пай най?', 'куда идёшь? — так здороваются на улице'],
    ['สนุก', 'санук', 'весело — главное слово тайской жизни'],
    ['Hello, welcome!', 'хэлло, уэлкам!', 'так встречают в каждом 7-Eleven']
  ];
  const box = document.querySelector('[data-thai-phrase]');
  if (box) {
    let i = Math.floor(Math.random() * PHRASES.length);
    const show = () => {
      const [thai, say, means] = PHRASES[i];
      box.querySelector('.thai-phrase-th').textContent = thai;
      box.querySelector('.thai-phrase-say').textContent = say;
      box.querySelector('.thai-phrase-means').textContent = means;
    };
    show();
    box.addEventListener('click', () => { i = (i + 1) % PHRASES.length; show(); });
  }

  // Songkran (Thai New Year, 13–15 April): for a few days around it buttons splash water. #songkran shows it any day.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate) return;
  const now = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Bangkok'}));
  const songkran = location.hash === '#songkran' || (now.getMonth() === 3 && now.getDate() >= 10 && now.getDate() <= 17);
  if (!songkran) return;
  document.documentElement.classList.add('is-songkran');
  document.addEventListener('pointerdown', event => {
    const target = event.target.closest('a, button, .story-card, .read-also-card');
    if (!target) return;
    for (let n = 0; n < 9; n++) {
      const drop = document.createElement('span');
      drop.className = 'songkran-drop';
      drop.style.left = event.clientX + 'px';
      drop.style.top = event.clientY + 'px';
      document.body.appendChild(drop);
      const angle = Math.random() * Math.PI * 2, dist = 30 + Math.random() * 45;
      drop.animate([
        {transform: 'translate(-50%,-50%) scale(1)', opacity: .95},
        {transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist + 18}px)) scale(.4)`, opacity: 0}
      ], {duration: 520 + Math.random() * 260, easing: 'cubic-bezier(.2,.7,.4,1)'}).finished.then(() => drop.remove());
    }
  });
})();
