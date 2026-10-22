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

// Mark Instagram references and retain a readable notice without JavaScript.
function instagramNotice(html) {
  html=html.replace(/<!-- Instagram notice -->[\s\S]*?<!-- \/Instagram notice -->\s*/g,'');
  html=html.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<[^>]+>)/gi).map(part=>{
    if(part.startsWith('<')) return part;
    return part.replace(/Instagram(?![\w*])/g,'Instagram*');
  }).join('');
  html=html.replace(/<a\b([^>]*href=["']https?:\/\/(?:www\.)?instagram\.com[^>]*)>([\s\S]*?)<\/a>/gi,(_,attrs,body)=>{
    if(!attrs.includes('aria-describedby=')) attrs+=' aria-describedby="instagram-notice"';
    if(!body.includes('*')) {
      if(body.includes('actor-watch')) body=body.replace('Смотреть оригинал','Смотреть оригинал*');
      else body=body.replace(/(\s*↗)?$/, '*$1');
    }
    return '<a'+attrs+'>'+body+'</a>';
  });
  const note='<!-- Instagram notice -->\n<aside class="wrap instagram-notice" id="instagram-notice" aria-label="Примечание об Instagram" style="padding-top:20px;padding-bottom:20px;font-size:13px;line-height:1.6"><p style="margin:0">* Instagram принадлежит компании Meta Platforms Inc., признанной экстремистской организацией; её деятельность запрещена на территории Российской Федерации.</p></aside>\n<!-- /Instagram notice -->\n';
  return html.replace(/<footer\b/i,note+'<footer');
}

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
  html=instagramNotice(html);
  html=html.replace(/script\.js\?v=[^"\s>]+/g,"script.js?v=instagram-note-1");
  fs.writeFileSync(path,html);
}
