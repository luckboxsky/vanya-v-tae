(() => {
 'use strict';
 const recommendations=window.PLACE_RECOMMENDATIONS||[];
 const grid=document.getElementById('places-grid');
 const home=document.getElementById('places-home');
 const detail=document.getElementById('place-detail');
 const maps=window.PLACE_MAPS;
 const copy={
  phangan:{title:'ПХАНГАН',sub:'Мои пять лет островной жизни',intro:'На Пхангане я прожил пять лет. Здесь соберу своих людей, любимые кафе и места, куда хочется возвращаться. Отдельно расскажу о районах острова.',categories:['Все','Транспорт','Жильё','Мотосервис','Еда и кофе','Любимые места'],items:[['Транспорт','Аренда байков','Люди, у которых я могу рекомендовать взять транспорт.'],['Мотосервис','Мотосервис друга','Мой тайский друг, который помогает с байками.'],['Жильё','Резорт друга','Ещё одно место, о котором расскажу лично.'],['Еда и кофе','Любимые кафе','Мои места для завтраков, кофе и встреч.'],['Любимые места','Вьюпойнты и прогулки','Красивые точки и маршруты по острову.']]},
  samui:{title:'САМУИ',sub:'Остров, с которого всё началось',intro:'На Самуи я прожил больше года. В этой подборке будут проверенные контакты по транспорту, любимые места и мои заметки о районах острова.',categories:['Все','Транспорт','Любимые места'],items:[['Транспорт','Аренда транспорта','Проверенные контакты на острове.'],['Любимые места','Мой Самуи','Кафе, прогулки и места, которые мне запомнились.']]},
  phuket:{title:'ПХУКЕТ',sub:'Свои люди на большом острове',intro:'После маленьких островов я переехал на Пхукет. Здесь соберу рекомендации по жилью, транспорту, экскурсиям и местам, где можно вкусно поесть.',categories:['Все','Транспорт','Жильё','Экскурсии','Еда и кофе'],items:[['Транспорт','Байки и машины','Аренда транспорта и варианты каршеринга.'],['Жильё','Аренда жилья','Контакты людей, к которым я могу направить.'],['Жильё','Отель','Место для отдельной рекомендации.'],['Экскурсии','Куда съездить','Поездки и экскурсии со своими людьми.'],['Еда и кофе','Русские рестораны','Знакомые места и любимая еда.']]},
  chiangmai:{title:'ЧИАНГМАЙ',sub:'Мой дом на севере Таиланда',intro:'Сейчас я живу в Чиангмае и постепенно собираю здесь своих людей. Начнём с фотографа и гайда моей подруги, а дальше добавим любимые места и новые знакомства.',categories:['Все','Фотография','Гайды'],items:[['Фотография','Фотограф в Чиангмае','Человек, к которому можно обратиться за съёмкой.'],['Гайды','Гайд по Чиангмаю','Подборка от моей подруги.']]}
 };
 let current=null;
 copy.phuket.intro='Мои люди на Пхукете: транспорт, жильё, экскурсии и проекты, которые мне хочется поддержать. Всех, кого рекомендую здесь, я знаю лично.';
 copy.phuket.categories=['Все','Объявления','Транспорт','Жильё','Экскурсии'];
 copy.phuket.items=[];
 copy.samui.intro='На Самуи я прожил больше года. Здесь собираю проверенные контакты по транспорту, любимые места и свои заметки о районах острова.';
 copy.samui.items=copy.samui.items.filter(item=>item[0]!=='Транспорт');
 function esc(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function renderRecommendation(item){
  const logo=item.featured?`<div class="market-banner"><img src="${esc(item.logo)}" alt="Пхукет"><strong>МАРКЕТ</strong><span>ОБЪЯВЛЕНИЯ · АФИША · ЖИЗНЬ ОСТРОВА</span></div>`:`<div class="partner-logo-frame ${item.id==='funny-time'?'logo-dark':''} ${item.id==='viktor'?'logo-avatar':''}">${item.logo?`<img src="${esc(item.logo)}" alt="${esc(item.name)}${item.id==='viktor'?' — фото':' — логотип'}" loading="lazy">`:'<span class="person-monogram" aria-label="Виктор">В</span>'}</div>`;
  const description=`<div class="partner-description">${item.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div>${item.note?`<p class="partner-promo-note">${esc(item.note)}</p>`:''}`;
  const actions=`<div class="partner-actions">${item.links.map((link,i)=>`<a class="partner-action ${i?'partner-action-secondary':''}" href="${esc(link.url)}" ${link.url.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''}>${esc(link.label)}<span aria-hidden="true">↗</span></a>`).join('')}</div>`;
  const content=item.featured?description+actions:actions+`<details class="partner-details"><summary aria-label="Подробнее о ${esc(item.name)}"><span class="details-label-closed">Подробнее</span><span class="details-label-open">Свернуть описание</span><span class="details-toggle" aria-hidden="true">+</span></summary>${description}</details>`;
  const heading=item.featured?`<h3>${esc(item.name)}</h3>`:`<div class="partner-title-row"><h3>${esc(item.name)}</h3>${item.badge?`<div class="partner-benefit">${esc(item.badge)}</div>`:''}</div>`;
  return `<article class="recommendation-card partner-entry ${item.featured?'partner-featured':''}" data-partner="${esc(item.id)}">${logo}<div class="partner-content"><div class="partner-category">${item.categories.map(esc).join(' · ')}</div>${heading}<p class="partner-role-text">${esc(item.role)}${item.promocode?`<span class="partner-promocode">Промокод: <strong>${esc(item.promocode)}</strong></span>`:''}</p>${content}</div></article>`;
 }
 function createCards(){
  grid.innerHTML=maps.map(m=>`<article class="place-card"><div class="map-frame">${m.map}</div><div class="card-copy"><div><h2><a href="#${m.id}" data-place="${m.id}">${m.name}</a></h2><p>${copy[m.id].sub}</p></div><a class="card-arrow" href="#${m.id}" data-place="${m.id}" aria-label="Открыть ${m.name}">↗</a></div></article>`).join('');
 }
 function showItems(category){
  const items=copy[current].items.filter(x=>category==='Все'||x[0]===category);
  const live=recommendations.filter(item=>item.places.includes(current)&&(category==='Все'||item.categories.includes(category)));
  document.getElementById('recommendations').innerHTML=live.map(renderRecommendation).join('')+items.map(item=>`<article class="recommendation-card"><span>${item[0].toUpperCase()}</span><h3>${item[1]}</h3><span class="coming-soon">Скоро</span><p>${item[2]}</p></article>`).join('');
 }
 function showPlace(id){
  const m=maps.find(m=>m.id===id);if(!m)return;
  current=id;const c=copy[id];
  detail.innerHTML=`<a class="back-link" href="#" data-back>← Все места</a><div class="detail-head"><div><div class="eyebrow">СВОИ ЛЮДИ · ${c.title}</div><h1>${c.title}</h1><p class="detail-intro">${c.intro}</p></div><div class="detail-map">${m.map.replaceAll('id="',`id="detail-`).replaceAll('url(#','url(#detail-')}</div></div><div class="categories" role="group" aria-label="Категория рекомендаций">${c.categories.map((name,i)=>`<button type="button" data-category="${name}" aria-pressed="${i===0}">${name}</button>`).join('')}</div><div class="recommendation-grid" id="recommendations"></div><p class="empty-note">Подборка готовится. Скоро здесь появятся контакты, фотографии и подробные рекомендации.</p>`;
  detail.querySelector('.empty-note').textContent=id==='phuket'?'Подборка будет пополняться. Следом добавлю любимые рестораны и места острова.':'Подборка пополняется: новые контакты, фотографии и подробные рекомендации появятся здесь.';
  home.hidden=true;detail.hidden=false;showItems('Все');window.scrollTo({top:0,behavior:'instant'});
 }
 function showHome(){home.hidden=false;detail.hidden=true;current=null;window.scrollTo({top:0,behavior:'instant'});}
 function route(){const id=location.hash.slice(1);if(copy[id])showPlace(id);else showHome();}
 document.addEventListener('click',e=>{
  const place=e.target.closest('[data-place]');if(place){e.preventDefault();history.pushState(null,'','#'+place.dataset.place);showPlace(place.dataset.place);return;}
  const back=e.target.closest('[data-back]');if(back){e.preventDefault();history.pushState(null,'',location.pathname);showHome();return;}
  const category=e.target.closest('[data-category]');if(category&&current){detail.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===category)));showItems(category.dataset.category);}
 });
 window.addEventListener('hashchange',route);
 window.addEventListener('popstate',route);
 createCards();route();
})();
