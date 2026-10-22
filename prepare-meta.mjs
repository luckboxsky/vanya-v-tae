import fs from 'node:fs';
import {metadata} from './site-meta.mjs';
const pages=JSON.parse(fs.readFileSync(new URL('./site-pages.json',import.meta.url),'utf8'));
// Keep the supplied counter in every generated page; verification files are not pages.
const metrika=`<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=113735677', 'ym');

    ym(113735677, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
</script>
<!-- /Yandex.Metrika counter -->`;
const metrikaFallback=`<!-- Yandex.Metrika fallback -->
<noscript><div><img src="https://mc.yandex.ru/watch/113735677" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika fallback -->`;
for(const [file,meta] of Object.entries(pages)) {
  const path=new URL('./'+file,import.meta.url);
  let html=fs.readFileSync(path,'utf8');
  html=html.replace(/<!-- Yandex\.Metrika counter -->[\s\S]*?<!-- \/Yandex\.Metrika counter -->\s*/g,'')
    .replace(/\s*<!-- Yandex\.Metrika fallback -->[\s\S]*?<!-- \/Yandex\.Metrika fallback -->\s*/g,'');
  html=html.replace(/<head>([\s\S]*?)<\/head>/i,(_,head)=>{
    head=head.replace(/<title>[\s\S]*?<\/title>/gi,'')
      .replace(/<meta\b[^>]*>/gi,tag=>/charset=|(?:name|property)=["'](?:viewport|theme-color|description|og:[^"']+)["']/i.test(tag)?'':tag)
      .replace(/<link\b[^>]*>/gi,tag=>/rel=["'](?:canonical|icon)["']|fonts\.(?:googleapis|gstatic)\.com|site-fixes\.css/i.test(tag)?'':tag);
    const sharedHead=metadata(meta).replace('<meta charset="utf-8">','<meta charset="utf-8">\n'+metrika);
    return '<head>\n'+sharedHead+'\n'+head.trim()+'\n<link rel="stylesheet" href="/site-fixes.css?v=3">\n</head>';
  });
  html=html.replace(/<body\b[^>]*>/i,tag=>tag+'\n'+metrikaFallback+'\n');
  fs.writeFileSync(path,html);
}
