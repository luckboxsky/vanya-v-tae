(() => {
  'use strict';
  const launch=document.querySelector('.tv-launch');
  if(!launch)return;
  launch.addEventListener('click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    const player=document.createElement('iframe');
    player.src='https://www.youtube-nocookie.com/embed/QJ4sxwZ_0Jo?start=371&end=485&autoplay=1&playsinline=1&rel=0';
    player.title='Ваня в программе «100 мест, где поесть» — фрагмент 6:11–8:05';
    player.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    player.allowFullscreen=true;
    player.referrerPolicy='strict-origin-when-cross-origin';
    launch.replaceWith(player);
    player.focus();
  });
})();
