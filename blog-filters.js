(() => {
 const nav=document.querySelector('[data-blog-filters]');if(!nav)return;
 const cards=[...document.querySelectorAll('[data-blog-category]')],empty=document.querySelector('[data-blog-empty]'),status=document.querySelector('[data-blog-status]');
 const category=()=>['stories','useful'].includes(location.hash.slice(1))?location.hash.slice(1):'all';
 function render(){const selected=category();let count=0;for(const card of cards){card.hidden=selected!=='all'&&card.dataset.blogCategory!==selected;if(!card.hidden)count++;}for(const button of nav.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.blogFilter===selected));empty.hidden=count!==0;status.textContent=count?'Публикаций: '+count:'';}
 nav.hidden=false;
 nav.addEventListener('click',event=>{const button=event.target.closest('[data-blog-filter]');if(!button)return;const hash=button.dataset.blogFilter==='all'?'':'#'+button.dataset.blogFilter;history.replaceState(null,'',location.pathname+location.search+hash);render();});
 window.addEventListener('hashchange',render);render();
})();
