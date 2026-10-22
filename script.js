(() => {
  'use strict';
  const c = window.SITE_CONFIG || {};
  let dialog, title, body;
  const toast = document.getElementById('toast');
  let toastTimer;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl = value => {
    if (typeof value !== 'string') return null;
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  };
  const pending = '<p class="config-hint">Реквизиты для этого способа ещё не добавлены. Пока выберите другой способ или напишите мне в Instagram*.</p>';
  const row = (label, value, copyValue = value, copyLabel = 'Скопировать') => `<div class="detail-row"><label>${esc(label)}</label><span class="detail-value">${esc(value)}</span><button type="button" class="copy-button" data-copy="${esc(copyValue)}">${esc(copyLabel)}</button></div>`;
  const external = (url, label) => `<a class="modal-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
  function ensureModal() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.id = 'detail-modal';
    dialog.className = 'modal';
    dialog.setAttribute('aria-labelledby','modal-title');
    dialog.innerHTML = '<div class="modal-box"><button aria-label="Закрыть окно" class="modal-close" id="modal-close" type="button">×</button><span class="kicker">ВАНЯ В ТАЕ</span><h2 id="modal-title"></h2><div id="modal-body"></div></div>';
    document.body.appendChild(dialog);
    title = dialog.querySelector('#modal-title');
    body = dialog.querySelector('#modal-body');
    dialog.querySelector('#modal-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
    body.addEventListener('click',handleModalAction);
  }
  function modal(name, html) {
    ensureModal();
    title.textContent = name;
    if (html.includes("Instagram*")) html += '<p class="config-hint">* Instagram принадлежит компании Meta Platforms Inc., признанной экстремистской организацией; её деятельность запрещена на территории Российской Федерации.</p>';
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

  function qrBlock(qr, label, expanded = false) {
    if (!qr || typeof qr.src !== 'string' || !/^\/?assets\/[a-z0-9-]+\.png$/.test(qr.src)) return '';
    const src = '/' + qr.src.replace(/^\//, '');
    const image = '<a class="donation-qr-link" href="' + esc(src) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc('Открыть '+label) + '"><svg viewBox="' + esc(qr.viewBox) + '" role="img" aria-label="' + esc(label) + '"><image href="' + esc(src) + '" width="' + esc(qr.width) + '" height="' + esc(qr.height) + '"/></svg></a><a class="qr-save" href="' + esc(src) + '" download>Сохранить QR-код</a>';
    return expanded ? '<div class="donation-qr">' + image + '</div>' : '<details class="donation-qr"><summary>Показать QR-код</summary>' + image + '</details>';
  }
  function cryptoContent(exchangeId) {
    const list = Array.isArray(c.cryptoExchanges) ? c.cryptoExchanges : [];
    const current = list.find(item => item.id === exchangeId) || list[0];
    if (!current) return pending;
    const tabs = '<div class="crypto-switch" role="group" aria-label="Выберите биржу">' + list.map(item => '<button type="button" data-crypto-exchange="' + esc(item.id) + '" aria-pressed="' + String(item.id === current.id) + '">' + esc(item.name) + '</button>').join('') + '</div>';
    return tabs + '<div class="crypto-panel"><section class="crypto-internal"><h3>Внутри ' + esc(current.name) + '</h3><p>Для перевода с аккаунта ' + esc(current.name) + '. Внутренний перевод без комиссии биржи.</p>' + row(current.internalLabel, current.internalId, current.internalId, 'Скопировать ID') + '</section><section class="crypto-onchain"><h3>Из другого кошелька или биржи</h3><p class="crypto-network">USDT · TRON (TRC20)</p><p>При отправке выберите именно эту валюту и сеть.</p>' + row('Адрес кошелька', current.address, current.address, 'Скопировать адрес') + qrBlock(current.qr,'QR-код USDT '+current.name) + '</section></div>';
  }
  function donate(type) {
    switch (type) {
      case 'boosty': {
        const url = safeUrl(c.boosty);
        modal('ПОДДЕРЖАТЬ НА BOOSTY', '<p>Разовый донат на развитие блога. Выберите сумму на Boosty и при желании оставьте сообщение. Если хотите поддерживать меня регулярно, можете оформить подписку — есть несколько вариантов.</p><p class="config-hint">Для отправки доната Boosty попросит войти или зарегистрироваться. Доступность оплаты зависит от страны и банка вашей карты.</p>' + (url ? '<div class="boosty-actions">' + external(url, 'Поддержать на Boosty') + external('https://boosty.to/vanyavtae', 'Выбрать подписку') + '</div>' + qrBlock(c.boostyQr,'QR-код для доната на Boosty') : pending));
        return;
      }
      case 'thai': {
        const ready = c.thaiBankName && c.thaiAccountNumber;
        const recipient = c.thaiRecipient ? '<div class="donation-recipient"><span>Получатель</span><strong>' + esc(c.thaiRecipient) + '</strong></div>' : '';
        const qr = qrBlock(c.thaiQr,'PromptPay Bangkok Bank',true);
        const instruction = qr ? 'Отсканируйте QR-код в банковском приложении или сохраните его и выберите из галереи приложения.' : 'Переведите по номеру счёта через приложение вашего банка.';
        modal('ТАЙСКИЙ БАНК', '<p class="donation-bank-name">' + esc(c.thaiBankName || 'Bangkok Bank') + '</p><p>' + instruction + '</p>' + qr + (ready ? row('Номер счёта',c.thaiAccountNumber) : pending) + recipient + '<p class="config-hint">Также можно перевести по номеру счёта. Перед подтверждением проверьте имя получателя.</p>');
        return;
      }
      case 'sbp': {
        const bankMarks = {
          tbank: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#ffdd2d" d="M3 2h26v16c0 7-13 12-13 12S3 25 3 18Z"/><path fill="#222" d="M8 8h16v4h-6v11h-4V12H8Z"/></svg>',
          yandex: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#222"/><text x="16" y="23" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700">Я</text></svg>'
        };
        const banks = Array.isArray(c.sbpBanks) && c.sbpBanks.length ? c.sbpBanks : (c.sbpBank ? [{name:c.sbpBank}] : []);
        const bankList = banks.length ? '<div class="sbp-banks" aria-label="Банки получателя">' + banks.map(bank => '<span class="sbp-bank">' + (bankMarks[bank.id] || '') + '<span>' + esc(bank.name) + '</span></span>').join('') + '</div>' : '';
        const recipient = c.sbpRecipient ? '<div class="sbp-recipient"><span>Получатель</span><strong>' + esc(c.sbpRecipient) + '</strong></div>' : '';
        modal('ПЕРЕВОД ПО СБП', '<p>В приложении своего банка выберите перевод по СБП, вставьте номер телефона и выберите банк получателя.</p>' + (c.sbpPhone ? row('Номер телефона', c.sbpPhone) : pending) + bankList + recipient + '<p class="config-hint">Перед подтверждением перевода проверьте имя получателя и выбранный банк.</p>');
        return;
      }
      case 'kazakhstan': {
        const card = String(c.kazakhstanCard || '').replace(/\s/g,'');
        const displayCard = card.replace(/(.{4})(?=.)/g,'$1 ');
        modal('КАЗАХСТАН', '<p class="donation-bank-name">' + esc(c.kazakhstanBankName || 'Freedom Bank') + '</p><p>Перевод по номеру карты через приложение вашего банка.</p>' + (card ? row('Номер карты',displayCard,card) : pending));
        return;
      }
      case 'crypto': {
        modal('КРИПТОВАЛЮТА', cryptoContent('bitazza'));
        return;
      }
    }
  }
  const contactCopy = {
    question: {title:'ЗАДАТЬ ВОПРОС', intro:'Короткие вопросы про Таиланд можно присылать в личку Instagram*. Отвечаю сам, когда есть время.', message:'Привет, Ваня! У меня вопрос про Таиланд: '},
    consult: {title:'КОНСУЛЬТАЦИЯ', intro:'Разговор про Таиланд: 30 минут — 500 бат, 60 минут — 1 000 бат. Договоримся о времени лично.', message:'Привет, Ваня! Хочу договориться о консультации по Таиланду. Мой вопрос: '},
    collab: {title:'СОТРУДНИЧЕСТВО', intro:'Реклама, совместные проекты и другие предложения. Пиши мне в Instagram*.', message:'Привет, Ваня! У меня предложение по сотрудничеству: '}
  };
  function contact(type) {
    const details = contactCopy[type] || contactCopy.question;
    const url = safeUrl(c.instagram);
    modal(details.title, `<p>${esc(details.intro)}</p><div class="detail-row"><label>Можно начать с такого сообщения</label><span class="detail-value">${esc(details.message)}</span><button type="button" class="copy-button" data-copy="${esc(details.message)}">Скопировать текст</button></div>${url ? external(url,'Открыть мой Instagram*') : '<p class="config-hint">Ссылка на Instagram* ещё не добавлена в настройки сайта. Перед окончательным запуском её необходимо указать.</p>'}`);
  }
  const telegramDetails = {title:'РАБОЧИЙ TELEGRAM', intro:'Для сообщений с сайта будет отдельный рабочий Telegram. Личный аккаунт здесь не публикую.'};
  function telegram() {
    const url=safeUrl(c.telegram);
    modal(telegramDetails.title,`<p>${telegramDetails.intro}</p>${url ? external(url,'Открыть Telegram') : '<p class="config-hint">Ссылка на рабочий Telegram ещё не добавлена. Пока можно написать мне в Instagram*, когда ссылка появится в настройках сайта.</p>'}`);
  }
  document.querySelectorAll('[data-filter]').forEach(button=> button.addEventListener('click', () => {
    const category=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelectorAll('[data-category]').forEach(card => {card.hidden = category !== 'all' && card.dataset.category !== category;});
  }));
  document.querySelectorAll('[data-method]').forEach(node => node.addEventListener('click', () => donate(node.dataset.method)));
  document.querySelectorAll('[data-contact]').forEach(node => {
    const url = safeUrl(node.dataset.contact === 'telegram' ? c.telegram : c.instagram);
    if (url) {
      const link = document.createElement('a');
      for (const attribute of node.attributes) {
        if (!['type', 'data-contact'].includes(attribute.name)) link.setAttribute(attribute.name, attribute.value);
      }
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML = node.innerHTML;
      node.replaceWith(link);
    } else {
      node.addEventListener('click', () => node.dataset.contact === 'telegram' ? telegram() : contact(node.dataset.contact));
    }
  });
  async function handleModalAction(event) {
    const exchangeButton = event.target.closest('[data-crypto-exchange]');
    if (exchangeButton) {
      const exchangeId = exchangeButton.dataset.cryptoExchange;
      if (!(c.cryptoExchanges || []).some(item => item.id === exchangeId)) return;
      body.innerHTML = cryptoContent(exchangeId);
      body.querySelectorAll('[data-crypto-exchange]').forEach(button => {if(button.dataset.cryptoExchange === exchangeId) button.focus();});
      return;
    }
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
  }
  document.querySelectorAll('.mobile-nav nav a').forEach(a => a.addEventListener('click', () => {const menu=a.closest('details');if(menu)menu.open=false;}));
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
