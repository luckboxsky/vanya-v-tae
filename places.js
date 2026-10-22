(() => {
 'use strict';
 const recommendations=window.PLACE_RECOMMENDATIONS||[];
 const grid=document.getElementById('places-grid');
 const home=document.getElementById('places-home');
 const detail=document.getElementById('place-detail');
 const maps=(window.PLACE_MAPS||[]).slice();
 maps.push({id:'krabi',name:'Краби',map:"<svg class=\"place-map krabi-overview\" viewBox=\"0 0 440 420\" aria-label=\"Краби на карте Таиланда\"><rect width=\"440\" height=\"420\" fill=\"#e7ecde\"/><path d=\"M157.8 33.6 L187.2 26.4 L208.2 43.2 L204.0 55.2 L233.4 69.6 L225.0 93.6 L250.2 84.0 L271.2 79.2 L292.2 86.4 L313.2 76.8 L334.2 74.4 L355.2 96.0 L384.6 108.0 L380.4 122.4 L414.0 141.6 L414.0 168.0 L367.8 170.4 L309.0 172.8 L288.0 189.6 L304.8 211.2 L304.8 235.2 L283.8 223.2 L262.8 211.2 L229.2 211.2 L220.8 194.4 L204.0 189.6 L183.0 194.4 L178.8 216.0 L162.0 247.2 L149.4 264.0 L162.0 295.2 L183.0 314.4 L199.8 333.6 L220.8 350.4 L262.8 367.2 L271.2 369.6 L258.6 379.2 L225.0 379.2 L195.6 362.4 L170.4 360.0 L145.2 340.8 L115.8 324.0 L107.4 309.6 L120.0 288.0 L132.6 264.0 L145.2 237.6 L149.4 211.2 L149.4 184.8 L124.2 170.4 L107.4 148.8 L124.2 129.6 L136.8 124.8 L124.2 96.0 L90.6 84.0 L69.6 69.6 L90.6 60.0 L99.0 40.8 L132.6 40.8Z\" fill=\"#c7d5bc\" stroke=\"#6e8c72\" stroke-width=\"2\"/><circle cx=\"137.2\" cy=\"321.8\" r=\"8\" fill=\"#bc664d\" stroke=\"#fff8f0\" stroke-width=\"3\"/><text x=\"160\" y=\"330\" fill=\"#234b42\" font-size=\"22\" font-family=\"sans-serif\">Краби</text></svg>"});
 const copy={
  phangan:{title:'ПХАНГАН',sub:'Мои пять лет островной жизни',intro:'На Пхангане я прожил пять лет. Здесь соберу проверенные контакты, любимые кафе и места, куда хочется возвращаться. Отдельно расскажу о районах острова.',categories:['Все','Транспорт','Жильё','Мотосервис','Еда и кофе','Любимые места'],items:[['Транспорт','Аренда байков','Люди, у которых я могу рекомендовать взять транспорт.'],['Мотосервис','Мотосервис друга','Мой тайский друг, который помогает с байками.'],['Жильё','Резорт друга','Ещё одно место, о котором расскажу лично.'],['Еда и кофе','Любимые кафе','Мои места для завтраков, кофе и встреч.'],['Любимые места','Вьюпойнты и прогулки','Красивые точки и маршруты по острову.']]},
  samui:{title:'САМУИ',sub:'Остров, с которого всё началось',intro:'На Самуи я прожил больше года. В этой подборке будут проверенные контакты по транспорту, любимые места и мои заметки о районах острова.',categories:['Все','Транспорт','Любимые места'],items:[['Транспорт','Аренда транспорта','Проверенные контакты на острове.'],['Любимые места','Мой Самуи','Кафе, прогулки и места, которые мне запомнились.']]},
  phuket:{title:'ПХУКЕТ',sub:'Проверенные контакты на Пхукете',intro:'После маленьких островов я переехал на Пхукет. Здесь соберу рекомендации по жилью, транспорту, экскурсиям и местам, где можно вкусно поесть.',categories:['Все','Транспорт','Жильё','Экскурсии','Еда и кофе'],items:[['Транспорт','Байки и машины','Аренда транспорта и варианты каршеринга.'],['Жильё','Аренда жилья','Контакты людей, к которым я могу направить.'],['Жильё','Отель','Место для отдельной рекомендации.'],['Экскурсии','Куда съездить','Поездки и экскурсии с проверенными организаторами.'],['Еда и кофе','Русские рестораны','Знакомые места и любимая еда.']]},
  chiangmai:{title:'ЧИАНГМАЙ',sub:'Мой дом на севере Таиланда',intro:'Сейчас я живу в Чиангмае и постепенно собираю здесь проверенные контакты. Начнём с фотографа и гайда моей подруги, а дальше добавим любимые места и новые знакомства.',categories:['Все','Фотография','Гайды'],items:[['Фотография','Фотограф в Чиангмае','Человек, к которому можно обратиться за съёмкой.'],['Гайды','Гайд по Чиангмаю','Подборка от моей подруги.']]}
 };
 copy.krabi={title:'КРАБИ',sub:'Проверенные контакты на побережье',intro:'Моя первая рекомендация в Краби — Кирилл: ресторан «Толстый кот», экскурсии и небольшой отель. Здесь делюсь опытом нашей с отцом поездки.',categories:['Все','Рестораны','Экскурсии','Жильё'],items:[]};
 let current=null;
 copy.phuket.intro='Проверенные контакты на Пхукете: транспорт, жильё, экскурсии и проекты, которые мне хочется поддержать. Всех, кого рекомендую здесь, я знаю лично.';
 copy.phuket.categories=['Все','Объявления','Транспорт','Жильё','Экскурсии'];
 copy.phuket.items=[];
 copy.samui.intro='На Самуи я прожил больше года. Здесь собираю проверенные контакты по транспорту, любимые места и свои заметки о районах острова.';
 copy.samui.items=copy.samui.items.filter(item=>item[0]!=='Транспорт');
 function esc(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

 function contactIcon(url){const shape=url.includes('instagram.com')?'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>':url.includes('maps.app.goo.gl')?'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>':url.startsWith('tel:')?'<path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 1-1 2-2 2C9 21 3 15 3 5c0-1 1-2 2-2Z"/>':url.startsWith('https://t.me/')?'<path d="m21 3-4 18-6-5-4 3 1-6 10-7-12 6-4-2Z"/>':'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>';return '<svg class="partner-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shape+'</svg>';}

 function linkChannel(link){return link.channel||(link.url.startsWith('tel:')?'phone':link.url.startsWith('https://t.me/')?'telegram':'website');}
 function photoGallery(item){return item.photos?.length?'<div class="partner-trip-photos" aria-label="Фотографии из моей поездки">'+item.photos.map(photo=>'<figure><img src="'+esc(photo.src)+'" alt="'+esc(photo.alt)+'" width="720" height="1280" loading="lazy"><figcaption>'+esc(photo.caption)+'</figcaption></figure>').join('')+'</div>':'';}
 function renderRecommendation(item){
  const portrait=item.isPortrait||item.id==='viktor';
  const logo=item.featured?`<div class="market-banner"><img src="${esc(item.logo)}" alt="Пхукет"><strong>МАРКЕТ</strong><span>ОБЪЯВЛЕНИЯ · АФИША · ЖИЗНЬ ОСТРОВА</span></div>`:`<div class="partner-logo-frame ${item.id==='funny-time'?'logo-app':''} ${portrait?'logo-avatar':''}">${item.logo?`<img src="${esc(item.logo)}" alt="${esc(item.name)}${portrait?' — фото':' — логотип'}" loading="lazy">`:`<span class="partner-monogram" aria-label="${esc(item.name)}">${esc(item.monogram||item.name.slice(0,1))}</span>`}</div>`;
  const description=`<div class="partner-description">${item.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div>${photoGallery(item)}${item.note?`<p class="partner-promo-note">${esc(item.note)}</p>`:''}`;
  const actions=`<div class="partner-actions">${item.links.map((link,i)=>`<a class="partner-action ${i?'partner-action-secondary':''}" data-click-partner="${esc(item.id)}" data-click-place="${esc(current)}" data-click-channel="${linkChannel(link)}" href="${esc(link.url)}" ${link.url.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''}>${contactIcon(link.url)}<span>${esc(link.label)}</span></a>`).join('')}</div>`;
  const content=item.featured?description+actions:actions+`<details class="partner-details"><summary aria-label="Подробнее о ${esc(item.name)}"><span class="details-label-closed">Подробнее</span><span class="details-label-open">Свернуть описание</span><span class="details-toggle" aria-hidden="true">+</span></summary>${description}</details>`;
  const heading=item.featured?`<h3>${esc(item.name)}</h3>`:`<div class="partner-title-row"><h3>${esc(item.name)}</h3>${item.badge?`<div class="partner-benefit">${esc(item.badge)}</div>`:''}</div>`;
  return `<article class="recommendation-card partner-entry ${item.featured?'partner-featured':''}" data-partner="${esc(item.id)}">${logo}<div class="partner-content"><div class="partner-category">${item.categories.map(esc).join(' · ')}</div>${heading}<p class="partner-role-text">${esc(item.role)}${item.promocode?`<span class="partner-promocode">Промокод: <strong>${esc(item.promocode)}</strong></span>`:''}</p>${content}</div></article>`;
 }
 function createCards(){
  grid.innerHTML=maps.map(m=>`<article class="place-card"><div class="map-frame">${m.map}${m.id==='krabi'?`<a class="map-card-hit-area" href="#${m.id}" data-place="${m.id}" aria-label="Открыть рекомендации в Краби"></a>`:''}</div><div class="card-copy"><div><h2><a href="#${m.id}" data-place="${m.id}">${m.name}</a></h2><p>${copy[m.id].sub}</p></div><a class="card-arrow" href="#${m.id}" data-place="${m.id}" aria-label="Открыть ${m.name}">↗</a></div></article>`).join('');
 }
 function showItems(category){
  const items=copy[current].items.filter(x=>category==='Все'||x[0]===category);
  const live=recommendations.filter(item=>item.places.includes(current)&&(category==='Все'||item.categories.includes(category)));
  document.getElementById('recommendations').innerHTML=live.map(renderRecommendation).join('')+items.map(item=>`<article class="recommendation-card"><span>${item[0].toUpperCase()}</span><h3>${item[1]}</h3><span class="coming-soon">Скоро</span><p>${item[2]}</p></article>`).join('');
 }
 function showPlace(id){
  const m=maps.find(m=>m.id===id);if(!m)return;
  current=id;const c=copy[id];
  detail.innerHTML=`<a class="back-link" href="#" data-back>← Все места</a><div class="detail-head"><div><div class="eyebrow">РЕКОМЕНДУЮ ЛИЧНО · ${c.title}</div><h1>${c.title}</h1><p class="detail-intro">${c.intro}</p></div><div class="detail-map">${m.map.replaceAll('id="',`id="detail-`).replaceAll('url(#','url(#detail-')}</div></div><div class="categories" role="group" aria-label="Категория рекомендаций">${c.categories.map((name,i)=>`<button type="button" data-category="${name}" aria-pressed="${i===0}">${name}</button>`).join('')}</div><div class="recommendation-grid" id="recommendations"></div><p class="empty-note">Подборка готовится. Скоро здесь появятся контакты, фотографии и подробные рекомендации.</p>`;
  detail.querySelector('.empty-note').textContent=id==='phuket'?'Подборка будет пополняться. Следом добавлю любимые рестораны и места острова.':'Подборка пополняется: новые контакты, фотографии и подробные рекомендации появятся здесь.';
  home.hidden=true;detail.hidden=false;showItems('Все');window.scrollTo({top:0,behavior:'instant'});
 }
 function showHome(){home.hidden=false;detail.hidden=true;current=null;window.scrollTo({top:0,behavior:'instant'});}
 function route(){const id=location.hash.slice(1);if(copy[id])showPlace(id);else if(!id)showHome();}
 document.addEventListener('click',e=>{
  const place=e.target.closest('[data-place]');if(place){e.preventDefault();history.pushState(null,'','#'+place.dataset.place);showPlace(place.dataset.place);return;}
  const back=e.target.closest('[data-back]');if(back){e.preventDefault();history.pushState(null,'',location.pathname+location.search);showHome();return;}
  const category=e.target.closest('[data-category]');if(category&&current){detail.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===category)));showItems(category.dataset.category);}
 });
 window.addEventListener('hashchange',route);
 window.addEventListener('popstate',route);
 createCards();route();
})();
