(() => {
  'use strict';
  const c = window.SITE_CONFIG || {};
  const dialog = document.getElementById('detail-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const toast = document.getElementById('toast');
  let toastTimer;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl = value => {
    if (typeof value !== 'string') return null;
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  };
  const pending = '<p class="config-hint">Реквизиты для этого способа ещё не добавлены. Пока выберите другой способ или напишите мне в Instagram.</p>';
  const row = (label, value) => `<div class="detail-row"><label>${esc(label)}</label><span class="detail-value">${esc(value)}</span><button type="button" class="copy-button" data-copy="${esc(value)}">Скопировать</button></div>`;
  const external = (url, label) => `<a class="modal-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
  function modal(name, html) {
    title.textContent = name;
    body.innerHTML = html;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open','');
  }
  function notify(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
  }
  function donate(type) {
    switch (type) {
      case 'boosty': {
        const url = safeUrl(c.boosty);
        modal('ИНОСТРАННАЯ КАРТА', `<p>Поддержка через Boosty. Доступность платежа с иностранной карты зависит от страны, банка и настроек сервиса.</p>${url ? external(url, 'Перейти на Boosty') : pending}`);
        return;
      }
      case 'thai': {
        const bank = c.thaiBankName && c.thaiAccountNumber;
        modal('ТАЙСКИЙ БАНК', `<p>Перевод через банковское приложение на тайский счёт.</p>${bank ? row(c.thaiBankName,c.thaiAccountNumber) : pending}${c.thaiPromptpay ? row('PromptPay',c.thaiPromptpay) : ''}<p class="config-hint">Перед отправкой проверьте имя получателя в приложении банка.</p>`);
        return;
      }
      case 'sbp': {
        modal('ПЕРЕВОД ПО СБП', `<p>Перевод с российской карты по номеру телефона.</p>${c.sbpPhone ? row('Телефон СБП',c.sbpPhone) : pending}${c.sbpBank ? `<p class="config-hint">Банк: <strong>${esc(c.sbpBank)}</strong>. Перед переводом проверьте имя получателя.</p>` : ''}`);
        return;
      }
      case 'kazakhstan': {
        modal('КАЗАХСТАН', `<p>Перевод на карту или счёт в Казахстане.</p>${c.kazakhstanCard ? row(c.kazakhstanBankName || 'Карта',c.kazakhstanCard) : pending}`);
        return;
      }
      case 'crypto': {
        const ready = c.cryptoNetwork && c.cryptoAddress;
        modal('КРИПТОВАЛЮТА', `<p>Для криптовалютного перевода должны совпадать и валюта, и сеть.</p>${ready ? row('Валюта и сеть',`${c.cryptoCurrency || 'USDT'} / ${c.cryptoNetwork}`) + row('Адрес кошелька',c.cryptoAddress) : pending}<p class="config-hint">Внимательно сверяйте сеть перед переводом. Криптовалютные транзакции обычно необратимы.</p>`);
        return;
      }
    }
  }
  const contactCopy = {
    question: {title:'ЗАДАТЬ ВОПРОС', intro:'Короткие вопросы про Таиланд можно присылать в личку Instagram. Отвечаю сам, когда есть время.', message:'Привет, Ваня! У меня вопрос про Таиланд: '},
    consult: {title:'КОНСУЛЬТАЦИЯ', intro:'Подробный разговор про Таиланд, 50–60 минут, 1 000 бат. Договоримся о времени в Instagram.', message:'Привет, Ваня! Хочу договориться о консультации по Таиланду. Мой вопрос: '},
    collab: {title:'СОТРУДНИЧЕСТВО', intro:'Реклама, совместные проекты и другие предложения. Пиши мне в Instagram.', message:'Привет, Ваня! У меня предложение по сотрудничеству: '}
  };
  function contact(type) {
    const details = contactCopy[type] || contactCopy.question;
    const url = safeUrl(c.instagram);
    modal(details.title, `<p>${esc(details.intro)}</p><div class="detail-row"><label>Можно начать с такого сообщения</label><span class="detail-value">${esc(details.message)}</span><button type="button" class="copy-button" data-copy="${esc(details.message)}">Скопировать текст</button></div>${url ? external(url,'Открыть мой Instagram') : '<p class="config-hint">Ссылка на Instagram ещё не добавлена в настройки сайта. Перед окончательным запуском её необходимо указать.</p>'}`);
  }
  const telegramDetails = {title:'РАБОЧИЙ TELEGRAM', intro:'Для сообщений с сайта будет отдельный рабочий Telegram. Личный аккаунт здесь не публикую.'};
  function telegram() {
    const url=safeUrl(c.telegram);
    modal(telegramDetails.title,`<p>${telegramDetails.intro}</p>${url ? external(url,'Открыть Telegram') : '<p class="config-hint">Ссылка на рабочий Telegram ещё не добавлена. Пока можно написать мне в Instagram, когда ссылка появится в настройках сайта.</p>'}`);
  }
  document.querySelectorAll('[data-filter]').forEach(button=> button.addEventListener('click', () => {
    const category=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelectorAll('[data-category]').forEach(card => {card.hidden = category !== 'all' && card.dataset.category !== category;});
  }));
  document.querySelectorAll('[data-method]').forEach(node => node.addEventListener('click', () => donate(node.dataset.method)));
  document.querySelectorAll('[data-contact]').forEach(node => node.addEventListener('click', () => node.dataset.contact === 'telegram' ? telegram() : contact(node.dataset.contact)));
  document.getElementById('modal-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', event => {if (event.target === dialog) dialog.close();});
  body?.addEventListener('click', async event => {
    const button = event.target.closest('[data-copy]');
    if (!button) return;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      notify('Скопировано ✓');
    } catch {
      // iOS fallback; selection is easier from rendered plain text.
      const valueNode = button.parentElement.querySelector('.detail-value');
      if (valueNode) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(valueNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      notify('Выделил текст: удерживай и выбери «Скопировать»');
    }
  });
  document.querySelectorAll('.mobile-nav nav a').forEach(a => a.addEventListener('click', () => {const menu=a.closest('details');if(menu)menu.open=false;}));
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
