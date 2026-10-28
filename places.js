(() => {
 'use strict';
 const recommendations=window.PLACE_RECOMMENDATIONS||[];
 const grid=document.getElementById('places-grid');
 const home=document.getElementById('places-home');
 const detail=document.getElementById('place-detail');
 // The plain-text directory stays in the HTML for search engines and no-JS visitors; the interactive cards replace it.
 const directory=document.getElementById('directory-index');if(directory)directory.hidden=true;
 const maps=(window.PLACE_MAPS||[]).slice();
 const copy={
  phangan:{title:'ПХАНГАН',sub:'Мои пять лет островной жизни',intro:'На Пхангане я прожил пять лет. Здесь соберу проверенные контакты, любимые кафе и места, куда хочется возвращаться. Отдельно расскажу о районах острова.',categories:['Все','Транспорт','Жильё','Мотосервис','Еда и кофе','Любимые места'],items:[['Транспорт','Аренда байков','Люди, у которых я могу рекомендовать взять транспорт.'],['Мотосервис','Мотосервис друга','Мой тайский друг, который помогает с байками.'],['Жильё','Резорт друга','Ещё одно место, о котором расскажу лично.'],['Еда и кофе','Любимые кафе','Мои места для завтраков, кофе и встреч.'],['Любимые места','Вьюпойнты и прогулки','Красивые точки и маршруты по острову.']]},
  samui:{title:'САМУИ',sub:'Остров, с которого всё началось',intro:'На Самуи я прожил больше года. В этой подборке будут проверенные контакты по транспорту, любимые места и мои заметки о районах острова.',categories:['Все','Транспорт','Любимые места'],items:[['Транспорт','Аренда транспорта','Проверенные контакты на острове.'],['Любимые места','Мой Самуи','Кафе, прогулки и места, которые мне запомнились.']]},
  phuket:{title:'ПХУКЕТ',sub:'Проверенные контакты на Пхукете',intro:'После маленьких островов я переехал на Пхукет. Здесь соберу рекомендации по жилью, транспорту, экскурсиям и местам, где можно вкусно поесть.',categories:['Все','Транспорт','Жильё','Экскурсии','Еда и кофе'],items:[['Транспорт','Байки и машины','Аренда транспорта и варианты каршеринга.'],['Жильё','Аренда жилья','Контакты людей, к которым я могу направить.'],['Жильё','Отель','Место для отдельной рекомендации.'],['Экскурсии','Куда съездить','Поездки и экскурсии с проверенными организаторами.'],['Еда и кофе','Русские рестораны','Знакомые места и любимая еда.']]},
  chiangmai:{title:'ЧИАНГМАЙ',sub:'Мой дом на севере Таиланда',intro:'Сейчас я живу в Чиангмае и постепенно собираю здесь проверенные контакты. Здесь уже есть аренда байков, гайд моей подруги Наташи и фотограф Рома, а дальше добавим любимые места и новые знакомства.',categories:['Все','Транспорт','Гайды','Фотография'],items:[]}
 };
 copy.krabi={title:'КРАБИ',sub:'Проверенные контакты на побережье',intro:'Моя первая рекомендация в Краби — Кирилл: ресторан «Толстый кот», экскурсии и небольшой отель. Здесь делюсь опытом нашей с отцом поездки.',categories:['Все','Рестораны','Экскурсии','Жильё'],items:[]};
 let current=null;
 copy.phuket.intro='Проверенные контакты на Пхукете: транспорт, жильё, экскурсии и проекты, которые мне хочется поддержать. Всех, кого рекомендую здесь, я знаю лично.';
 copy.phuket.categories=['Все','Объявления','Транспорт','Жильё','Экскурсии','Визы','Обучение'];
 copy.phuket.items=[];
 copy.samui.intro='Остров, с которого всё началось: здесь в 2017 году я снял свой первый байк. На Самуи я прожил больше года. Здесь мои любимые места — виды, храмы, где поесть и встретить закат — и проверенные контакты по транспорту и яхтам. В некоторых местах я давно не был, так что перед поездкой проверяйте их на Картах.';
 copy.samui.items=[];
copy.samui.categories=['Все','Виды и храмы','Еда','Закаты и атмосфера','Природа','Сауны и спа','Магазины','Транспорт','Яхты и прогулки'];
 copy.phangan.intro='Пять лет моей жизни прошли на Пхангане. Здесь мои любимые места — где вкусно поесть, встретить закат и что посмотреть, — проверенные контакты и честный опыт, куда обращаться не советую. Часть мест я посещал пару лет назад: перед поездкой загляните на Карты, что они работают.';
 copy.phangan.categories=['Все','Еда','Закаты и атмосфера','Природа','Транспорт'];
 copy.phangan.items=[];
 function esc(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

 function contactIcon(url){const shape=url.startsWith('/')?'<path d="M6 3h9l4 4v14H6Z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>':url.includes('instagram.com')?'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>':/maps\.app\.goo\.gl|goo\.gl\/maps|google\.com\/maps/.test(url)?'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>':url.startsWith('tel:')?'<path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 1-1 2-2 2C9 21 3 15 3 5c0-1 1-2 2-2Z"/>':url.startsWith('https://t.me/')?'<path d="m21 3-4 18-6-5-4 3 1-6 10-7-12 6-4-2Z"/>':'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>';return '<svg class="partner-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shape+'</svg>';}

 function linkChannel(link){return link.channel||(link.url.startsWith('tel:')?'phone':link.url.startsWith('https://t.me/')?'telegram':'website');}
 function photoGallery(item){return item.photos?.length?'<div class="partner-trip-photos" aria-label="Фотографии из моей поездки">'+item.photos.map(photo=>'<figure><img src="'+esc(photo.src)+'" alt="'+esc(photo.alt)+'" width="720" height="1280" loading="lazy"><figcaption>'+esc(photo.caption)+'</figcaption></figure>').join('')+'</div>':'';}
 // Favourite places (cafes, beaches, viewpoints) get a compact card: no logo, the whole text visible at once.
 function renderSpot(item){
  const actions=`<div class="partner-actions">${item.links.map((link,i)=>`<a class="partner-action ${i?'partner-action-secondary':''}" data-click-partner="${esc(item.id)}" data-click-place="${esc(current)}" data-click-channel="${linkChannel(link)}" href="${esc(link.url)}" ${link.url.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''}>${contactIcon(link.url)}<span>${esc(link.label)}</span></a>`).join('')}</div>`;
  const photos=item.photos?.length?`<div class="spot-photos">${item.photos.map(photo=>`<figure><img src="${esc(photo.src)}" alt="${esc(photo.alt)}" width="${photo.width||1280}" height="${photo.height||960}" loading="lazy">${photo.caption?`<figcaption>${esc(photo.caption)}</figcaption>`:''}</figure>`).join('')}</div>`:'';
  return `<article class="recommendation-card spot-card" data-partner="${esc(item.id)}"><div class="partner-category">${item.categories.map(esc).join(' · ')}</div><h3>${esc(item.name)}</h3><p class="spot-role">${esc(item.role)}</p><div class="spot-text">${item.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div>${photos}${actions}</article>`;
 }
 function renderRecommendation(item){
  if(item.spot)return renderSpot(item);
  const portrait=item.isPortrait||item.id==='viktor';
  const logo=item.serviceIcon?'<div class="partner-service-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+(item.serviceIcon==='bike'?'<circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M8 17.5h6l2.6-7.5"/><path d="M16.6 10 15.2 5.5H13"/><path d="M3 17.5c0-3 2-5 4.6-5H11l1.5 2.5"/><path d="M6 10h4.5"/>':'<path d="M14 6a5 5 0 0 0-6 6L3 17a3 3 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-3 3-4-4Z"/>')+'</svg></div>':item.featured?`<div class="market-banner"><img src="${esc(item.logo)}" alt="Пхукет"><strong>МАРКЕТ</strong><span>ОБЪЯВЛЕНИЯ · АФИША · ЖИЗНЬ ОСТРОВА</span></div>`:`<div class="partner-logo-frame ${item.id==='funny-time'?'logo-app':''} ${portrait?'logo-avatar':''}">${item.logo?`<img src="${esc(item.logo)}" alt="${esc(item.name)}${portrait?' — фото':' — логотип'}" loading="lazy">`:`<span class="partner-monogram" aria-label="${esc(item.name)}">${esc(item.monogram||item.name.slice(0,1))}</span>`}</div>`;
  const description=`<div class="partner-description">${item.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div>${photoGallery(item)}${item.note?`<p class="partner-promo-note">${esc(item.note)}</p>`:''}`;
  const actions=`<div class="partner-actions">${item.links.map((link,i)=>`<a class="partner-action ${i?'partner-action-secondary':''}" data-click-partner="${esc(item.id)}" data-click-place="${esc(current)}" data-click-channel="${linkChannel(link)}" href="${esc(link.url)}" ${link.url.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''}>${contactIcon(link.url)}<span>${esc(link.label)}</span></a>`).join('')}</div>`;
  const content=item.featured?description+actions:actions+`<details class="partner-details"><summary aria-label="Подробнее о ${esc(item.name)}"><span class="details-label-closed">Подробнее</span><span class="details-label-open">Свернуть описание</span><span class="details-toggle" aria-hidden="true">+</span></summary>${description}</details>`;
  const heading=item.featured?`<h3>${esc(item.name)}</h3>`:`<div class="partner-title-row"><h3>${esc(item.name)}</h3>${item.badge?`<div class="partner-benefit">${esc(item.badge)}</div>`:''}</div>`;
  return `<article class="recommendation-card partner-entry ${item.featured?'partner-featured':''}" data-partner="${esc(item.id)}">${logo}<div class="partner-content"><div class="partner-category">${item.categories.map(esc).join(' · ')}</div>${heading}<p class="partner-role-text">${esc(item.role)}${item.promocode?`<span class="partner-promocode">Промокод: <strong>${esc(item.promocode)}</strong></span>`:''}</p>${content}</div></article>`;
 }
 function createCards(){
  grid.innerHTML=maps.map(m=>`<article class="place-card"><div class="map-frame">${m.map}</div><div class="card-copy"><div><h2><a href="#${m.id}" data-place="${m.id}">${m.name}</a></h2><p>${copy[m.id].sub}</p></div><a class="card-arrow" href="#${m.id}" data-place="${m.id}" aria-label="Открыть ${m.name}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></a></div></article>`).join('');
 }
 function showItems(category){
  const items=copy[current].items.filter(x=>category==='Все'||x[0]===category);
  const live=recommendations.filter(item=>item.status!=='not-recommended'&&item.places.includes(current)&&(category==='Все'||item.categories.includes(category)));
  document.getElementById('recommendations').innerHTML=live.map(renderRecommendation).join('')+items.map(item=>`<article class="recommendation-card"><span>${item[0].toUpperCase()}</span><h3>${item[1]}</h3><span class="coming-soon">Скоро</span><p>${item[2]}</p></article>`).join('');
 }
 // The scam warning is shown on every place; the "Не рекомендую" block only where there are warnings.
 function scamNotice(notice){return '<details class="scam-notice"><summary><span class="scam-icon" aria-hidden="true">!</span><span class="scam-head"><strong>'+esc(notice.title)+'</strong><span>'+esc(notice.teaser)+'</span></span><span class="scam-toggle" aria-hidden="true">+</span></summary><div class="scam-body"><h4>Как это работает</h4><p>'+esc(notice.how)+'</p><h4>Как себя защитить</h4><ul>'+notice.tips.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul></div></details>';}
 function safetySection(id){
  const warnings=recommendations.filter(item=>item.places.includes(id)&&item.status==='not-recommended');
  const notice=window.PLACE_SAFETY_NOTICE;
  if(!warnings.length)return notice?'<div class="place-safety">'+scamNotice(notice)+'</div>':'';
  return '<section class="place-cautions" aria-labelledby="place-cautions-heading"><h2 id="place-cautions-heading">Не рекомендую</h2><p class="caution-context">Мой личный опыт · Пханган</p>'+warnings.map(item=>'<article class="caution-card" data-warning="'+esc(item.id)+'"><h3>'+esc(item.name)+'</h3><p class="caution-role">'+esc(item.role)+'</p>'+item.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'<div class="partner-actions">'+item.links.map(link=>'<a class="partner-action partner-action-secondary" href="'+esc(link.url)+'" data-click-partner="'+esc(item.id)+'" data-click-place="'+esc(id)+'" data-click-channel="maps" target="_blank" rel="noopener noreferrer">'+contactIcon(link.url)+'<span>'+esc(link.label)+'</span></a>').join('')+'</div></article>').join('')+(notice?scamNotice(notice):'')+'</section>';
 }
 function showPlace(id){
  const m=maps.find(m=>m.id===id);if(!m)return;
  current=id;const c=copy[id];
  detail.innerHTML=`<a class="back-link nav-prev" href="#" data-back>Все места</a><div class="detail-head"><div><div class="eyebrow">РЕКОМЕНДУЮ ЛИЧНО · ${c.title}</div><h1>${c.title}</h1><p class="detail-intro">${c.intro}</p></div><div class="detail-map">${m.map.replaceAll('id="',`id="detail-`).replaceAll('url(#','url(#detail-')}</div></div><div class="categories" role="group" aria-label="Категория рекомендаций">${c.categories.map((name,i)=>`<button type="button" data-category="${name}" aria-pressed="${i===0}">${name}</button>`).join('')}</div><div class="recommendation-grid" id="recommendations"></div>${safetySection(id)}<p class="empty-note">Подборка готовится. Скоро здесь появятся контакты, фотографии и подробные рекомендации.</p>`;
  detail.querySelector('.empty-note').hidden=recommendations.some(item=>item.places.includes(id)&&item.status!=='not-recommended');
  // Category filters only help when a place has enough cards to sort through.
  const cardCount=recommendations.filter(item=>item.places.includes(id)&&item.status!=='not-recommended').length+c.items.length;
  detail.querySelector('.categories').style.display=cardCount<5?'none':'';
  detail.querySelector('.empty-note').textContent=id==='phuket'?'Подборка будет пополняться. Следом добавлю любимые рестораны и места острова.':'Подборка пополняется: новые контакты, фотографии и подробные рекомендации появятся здесь.';
  home.hidden=true;detail.hidden=false;showItems('Все');window.scrollTo({top:0,behavior:'instant'});
 }
 function showHome(){home.hidden=false;detail.hidden=true;current=null;window.scrollTo({top:0,behavior:'instant'});}
 function route(){const id=location.hash.slice(1);if(copy[id])showPlace(id);else if(!id)showHome();else{const target=document.getElementById(id);if(target){const jump=()=>window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-85,behavior:'instant'});jump();if(document.readyState!=='complete')window.addEventListener('load',jump,{once:true});}}}
 document.addEventListener('click',e=>{
  const place=e.target.closest('[data-place]');if(place){e.preventDefault();history.pushState(null,'','#'+place.dataset.place);showPlace(place.dataset.place);return;}
  const back=e.target.closest('[data-back]');if(back){e.preventDefault();history.pushState(null,'',location.pathname+location.search);showHome();return;}
  const category=e.target.closest('[data-category]');if(category&&current){detail.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===category)));showItems(category.dataset.category);}
 });
 window.addEventListener('hashchange',route);
 window.addEventListener('popstate',route);
 createCards();route();
 // Promo code buttons in the services block copy the code and confirm on the button itself.
 document.addEventListener('click',async event=>{const button=event.target.closest('.service-copy[data-copy]');if(!button)return;const label=button.textContent;try{await navigator.clipboard.writeText(button.dataset.copy);button.textContent='Скопировано ✓'}catch{button.textContent='Промокод: '+button.dataset.copy}setTimeout(()=>{button.textContent=label},2500)});
})();
