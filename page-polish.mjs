export function polishPage(html) {
 html=html.replace(/(<img\b[^>]*?)\/\s+(?=\w+\s*=)/gi,'$1 ');
 html=html.replace(/\b(src|href|poster)=(['"])(?![a-z]+:|\/|#)([^'"]+)\2/gi,(_,key,q,url)=>key+'='+q+'/'+url.replace(/^\.\//,'')+q);
 html=html.replace(/\b(src|href)=(['"])(\/[^'"?]+\.(?:css|js))(?:\?[^'"]*)?\2/gi,'$1=$2$3?v=20261022-2$2');
 html=html.replace(/<h([123])([^>]*)>([\s\S]*?)<\/h\1>/gi,(whole,level,attrs,body)=>{
   const text=body.replace(/<[^>]+>/g,'').replace(/&[^;]+;/g,'');
   if(!/[А-ЯЁ]/.test(text)||text!==text.toUpperCase()) return whole;
   let first=true;
   body=body.split(/(<[^>]+>)/).map(p=>{
     if(p.startsWith('<'))return p;
     p=p.toLowerCase().replace(/[а-яёa-z]/,c=>{if(!first)return c;first=false;return c.toUpperCase();});
     return p.replace(/таиланд/g,'Таиланд').replace(/чиангмай/g,'Чиангмай').replace(/росси/g,'Росси');
   }).join('');
   attrs=/class=/.test(attrs)?attrs.replace(/class=(['"])(.*?)\1/,(_,q,c)=>'class='+q+c+' display-upper'+q):attrs+' class="display-upper"';
   return '<h'+level+attrs+'>'+body+'</h'+level+'>';
 });
 // Assign events to actual actions; a support event is an opened method, not a payment.
 html=html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi,(whole,attrs,body)=>{
   if(/data-goal=/.test(attrs))return whole;
   const href=attrs.match(/href=['"]([^'"]+)/)?.[1]||'';
   let goal='';
   if(href.startsWith('https://t.me/thevany?text=')&&decodeURIComponent(href).includes('консультац'))goal='consult_click';
   else if(href.startsWith('https://t.me/taisvaney'))goal='chat_click';
   else if(/^\/advertising(?:[?#]|$)/.test(href))goal='advertising_click';
   return '<a'+attrs+(goal?' data-goal="'+goal+'"':'')+'>'+body+'</a>';
 });
 html=html.replace(/<button\b([^>]*data-method=[^>]*)>/gi,(whole,attrs)=>/data-goal=/.test(attrs)?whole:'<button'+attrs+' data-goal="support_open">');
 html=html.replace(/<!-- privacy-links:start -->[\s\S]*?<!-- privacy-links:end -->\s*/g,'');
 html=html.replace(/<footer\b/,'<!-- privacy-links:start --><div class="wrap privacy-links"><a href="/privacy">Конфиденциальность</a><button type="button" data-analytics-settings>Настройки аналитики</button></div><!-- privacy-links:end -->\n<footer');
 html=html.replace(/<script\b[^>]*src=['"]\/site-analytics\.js[^>]*><\/script>\s*/gi,'');
 return html.replace('</head>','<script defer src="/site-analytics.js?v=20261022-2"></script>\n</head>');
}
