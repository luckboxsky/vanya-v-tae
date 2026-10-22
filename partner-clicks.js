(() => {
  'use strict';
  const lastClick = new WeakMap();
  function track(event) {
    if (!event.isTrusted || (event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return;
    const link = event.target.closest?.('a[data-click-partner]');
    if (!link) return;
    const now = Date.now();
    if (now - (lastClick.get(link) || 0) < 800) return;
    lastClick.set(link,now);
    const payload = JSON.stringify({
      partner:link.dataset.clickPartner,
      place:link.dataset.clickPlace,
      channel:link.dataset.clickChannel,
      test:new URLSearchParams(location.search).get('analytics_test') === '1'
    });
    const endpoint = '/_events/partner-click';
    try {
      if (navigator.sendBeacon?.(endpoint,new Blob([payload],{type:'text/plain;charset=UTF-8'}))) return;
    } catch {}
    fetch(endpoint,{method:'POST',body:payload,keepalive:true,credentials:'omit',headers:{'Content-Type':'text/plain;charset=UTF-8'}}).catch(() => {});
  }
  document.addEventListener('click',track,{capture:true});
  document.addEventListener('auxclick',track,{capture:true});
})();
