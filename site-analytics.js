(() => {
 'use strict';
 const key='vanya-analytics-choice-v1', counter=113735677;
 const maxAge=180*24*60*60*1000;
 let loaded=false, panel;
 function preference(){try{const p=JSON.parse(localStorage.getItem(key));return p&&Date.now()-p.time<maxAge?p.value:null;}catch{return null;}}
 function start(){
  if(loaded)return;
  loaded=true;
  window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments);};
  window.ym.l=Date.now();
  const tag=document.createElement('script');tag.async=true;tag.src='https://mc.yandex.ru/metrika/tag.js?id='+counter;document.head.append(tag);
  window.ym(counter,'init',{ssr:true,webvisor:true,clickmap:true,referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});
 }
 function save(value){
  try{localStorage.setItem(key,JSON.stringify({value,time:Date.now()}));}catch{}
  panel?.remove();panel=null;
  if(value==='accepted')start();
  else if(loaded){
   if(typeof window.ym==='function')window.ym(counter,'destruct');
   for(const cookie of document.cookie.split(';')){
    const name=cookie.trim().split('=')[0];
    if(!name.startsWith('_ym_'))continue;
    for(const domain of ['',location.hostname,'.'+location.hostname])document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'');
   }
   location.reload();
  }
 }
 function show(){
  if(panel){panel.querySelector('button')?.focus();return;}
  panel=document.createElement('aside');panel.className='analytics-choice';panel.setAttribute('aria-label','Настройки аналитики');
  panel.innerHTML='<div><strong>Можно включить аналитику?</strong><p>Яндекс Метрика использует cookie и Вебвизор, чтобы понять, что удобно на сайте. Можно отказаться — сайт продолжит работать. <a href="/privacy">Подробнее</a></p></div><div class="analytics-choice-actions"><button type="button" data-analytics-choice="accepted">Разрешить аналитику</button><button type="button" data-analytics-choice="declined">Без аналитики Яндекса</button></div>';
  panel.addEventListener('click',e=>{const b=e.target.closest('[data-analytics-choice]');if(b)save(b.dataset.analyticsChoice);});
  document.body.append(panel);
 }
 document.addEventListener('click',e=>{
  if(e.target.closest('[data-analytics-settings]')){show();return;}
  const target=e.target.closest('[data-goal]');
  if(!target||preference()!=='accepted'||typeof window.ym!=='function')return;
  const goal=target.dataset.goal;
  if(!['consult_click','chat_click','support_open','advertising_click'].includes(goal))return;
  window.ym(counter,'reachGoal',goal,target.dataset.method?{method:target.dataset.method}:{});
 });
 if(preference()==='accepted')start();
 else if(preference()===null)show();
})();
