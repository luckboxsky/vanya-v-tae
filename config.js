/*
  ВАНЯ В ТАЕ · Реквизиты и ссылки
  Все значения null показываются на сайте как «пока не добавлено».
  Перед публикацией проверь номер СБП, имя банка и ссылки.
  Не добавляй в этот файл пароли, секретные ключи, данные входа.
*/
window.SITE_CONFIG = {
  instagram: 'https://www.instagram.com/vanyavtae/',      // Instagram Вани
  telegram: 'https://t.me/thevany',       // Telegram для связи
  boosty: 'https://boosty.to/vanyavtae/donate',
  boostyQr: {"src":"/assets/boosty-qr-original.png","width":150,"height":150,"viewBox":"0 0 150 150"},         // например: 'https://boosty.to/your_account'
  sbpPhone: '89203414537', // пользователь прислал этот номер раньше; ОБЯЗАТЕЛЬНО проверить
  sbpBank: 'Т-Банк',
  sbpBanks: [{id:'tbank', name:'Т-Банк'}, {id:'yandex', name:'Яндекс Банк'}],
  sbpRecipient: 'Иван Андреевич M.',
  thaiBankName: 'Bangkok Bank',
  thaiRecipient: 'MR. IVAN MINEEV',
  thaiQr: {"src":"/assets/bangkok-promptpay-original.png","width":1031,"height":1280,"viewBox":"295 364 442 442"},
  thaiAccountNumber: '7330131298',
  thaiPromptpay: null, // номер PromptPay, если хочешь показывать
  kazakhstanBankName: 'Freedom Bank',
  kazakhstanCard: '5269880009716176',
  cryptoCurrency: 'USDT',
  cryptoExchanges: [
  {
    "id": "bitazza",
    "name": "Bitazza",
    "internalId": "@btz940751",
    "internalLabel": "Bitazza ID",
    "address": "TPZdustD7aMQipMdVKH6K2xBYQs6AKzUnJ",
    "qr": {
      "src": "/assets/bitazza-usdt-trc20-original.png",
      "width": 1275,
      "height": 1847,
      "viewBox": "300 586 676 676"
    }
  },
  {
    "id": "bybit",
    "name": "Bybit",
    "internalId": "100977048",
    "internalLabel": "Bybit UID",
    "address": "TYJ86g8FdBCmStnFNKwHJXiBzckTq1QsQK",
    "qr": {
      "src": "/assets/bybit-usdt-trc20-original.png",
      "width": 1024,
      "height": 1280,
      "viewBox": "264 324 498 498"
    }
  }
],
  cryptoNetwork: 'TRC20', // например TRC20. Без сети адрес не выводится!
  cryptoAddress: null,
};
