(() => {
 const card=document.querySelector('[data-chiangmai-weather]');
 if(!card)return;
 const clock=card.querySelector('time'),weather=card.querySelector('[data-weather-value]'),icon=card.querySelector('[data-weather-icon]'),live=card.querySelector('[data-weather-live]');
 const format=new Intl.DateTimeFormat('ru-RU',{timeZone:'Asia/Bangkok',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const clockTick=()=>{const now=new Date();clock.textContent=format.format(now)+' в Таиланде';clock.dateTime=now.toISOString();clock.hidden=false;card.querySelector('.hero-presence-details').hidden=false;};
 function describe(symbol){
  if(symbol.includes('thunder'))return ['storm','Гроза'];
  if(/snow|sleet/.test(symbol))return ['rain','Осадки'];
  if(/rain/.test(symbol))return ['rain','Дождь'];
  if(/fog/.test(symbol))return ['fog','Туман'];
  if(/clearsky|fair/.test(symbol))return [symbol.endsWith('_night')?'moon':'sun',symbol.includes('clearsky')?'Ясно':'Малооблачно'];
  if(/partlycloudy/.test(symbol))return ['partly','Переменная облачность'];
  return ['cloud','Облачно'];
 }
 const icons={sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',moon:'<path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"/>',cloud:'<path d="M6 18a4.5 4.5 0 1 1 1-8.9 6 6 0 0 1 11.6 1.9A3.5 3.5 0 0 1 18 18Z"/>',rain:'<path d="M6 15a4 4 0 1 1 1-7.8A5.5 5.5 0 0 1 17.6 9 3 3 0 0 1 18 15ZM8 18l-1 3m6-3-1 3m6-3-1 3"/>',storm:'<path d="M6 14a4 4 0 1 1 1-7.8A5.5 5.5 0 0 1 17.6 8 3 3 0 0 1 18 14M13 12l-4 6h4l-2 5"/>',fog:'<path d="M6 12a4 4 0 1 1 1-7.8A5.5 5.5 0 0 1 17.6 6 3 3 0 0 1 18 12M3 16h18M5 20h14"/>',partly:'<path d="M8 3v2M2 9h2m0-6 1.5 1.5M14 3l-1.5 1.5"/><path d="M6 11a4 4 0 1 1 6-5M7 20a4 4 0 1 1 1-7.8A5.5 5.5 0 0 1 18.6 14a3 3 0 0 1-.6 6Z"/>'};
 let lastAttempt=0,lastSuccess=0,busy=false;
 const hide=()=>{live.hidden=true;card.classList.remove('has-weather');};
 async function update(){
  if(document.hidden||busy||Date.now()-lastAttempt<10*60000)return;
  busy=true;lastAttempt=Date.now();
  try{
   const response=await fetch('/_weather/chiang-mai',{credentials:'omit',signal:AbortSignal.timeout(8500)});
   if(!response.ok)throw new Error('Unavailable');
   const data=await response.json();
   if(!Number.isFinite(data.temperature)||typeof data.symbol!=='string'||!Number.isFinite(Date.parse(data.time))||Math.abs(Date.parse(data.time)-Date.now())>3*3600000)throw new Error('Invalid');
   const [kind,label]=describe(data.symbol);
   icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[kind]+'</svg>';
   weather.textContent=(data.temperature>0?'+':'')+data.temperature+' °C';
   live.setAttribute('aria-label',label+', '+weather.textContent);live.title=label+' · '+format.format(new Date(data.time));
   live.hidden=false;card.classList.add('has-weather');lastSuccess=Date.now();
  }catch{if(Date.now()-lastSuccess>30*60000)hide();}
  finally{busy=false;}
 }
 clockTick();update();
 setInterval(()=>{if(!document.hidden){clockTick();if(lastSuccess&&Date.now()-lastSuccess>30*60000)hide();update();}},30000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){clockTick();update();}});
})();
