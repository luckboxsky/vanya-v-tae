// /coffee: a coffee card with a choice of processing and roast puts the chosen variant
// into the order button label and into the Telegram message to Roma.
document.querySelectorAll('[data-coffee-choice]').forEach(card => {
  const button = card.querySelector('[data-coffee-buy]');
  const label = card.querySelector('[data-coffee-label]');
  if (!button) return;
  const name = card.dataset.coffeeName;
  const update = () => {
    const picked = [...card.querySelectorAll('input[type="radio"]:checked')].map(input => input.value).join(' · ');
    if (label) label.textContent = picked;
    button.href = 'https://t.me/RomaBlack?text=' + encodeURIComponent(`Привет, Рома! Я от Вани в Тае, хочу заказать кофе ${name}: ${picked}.`);
  };
  card.addEventListener('change', update);
  update();
});
