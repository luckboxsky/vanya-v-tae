import fs from 'node:fs';
import {polishPage} from './page-polish.mjs';
import {metadata} from './site-meta.mjs';
const pages=JSON.parse(fs.readFileSync(new URL('./site-pages.json',import.meta.url),'utf8'));
// Analytics loads only after the visitor opts in.
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
    head=head.replace(/<script\b[^>]*id=["']site-schema["'][^>]*>[\s\S]*?<\/script>/gi,'');
    head=head.replace(/<title>[\s\S]*?<\/title>/gi,'')
      .replace(/<meta\b[^>]*>/gi,tag=>/charset=|(?:name|property)=["'](?:viewport|theme-color|description|twitter:[^"']+|og:[^"']+)["']/i.test(tag)?'':tag)
      .replace(/<link\b[^>]*>/gi,tag=>/rel=["'](?:canonical|icon)["']|fonts\.(?:googleapis|gstatic)\.com|site-fixes\.css/i.test(tag)?'':tag);
    const sharedHead=metadata(meta);
    // Collapse lines left empty by removed tags so repeated runs don't add blank lines.
    head=head.trim().replace(/\r?\n[ \t\r]*(?:\n[ \t\r]*)+/g,'\n');
    return '<head>\n'+sharedHead+'\n'+head+'\n<link rel="stylesheet" href="/site-fixes.css?v=3">\n</head>';
  });

  html=instagramNotice(html);
  html=html.replace(/script\.js\?v=[^"\s>]+/g,"script.js?v=instagram-note-1");
  html=polishPage(html);
  html=html.replace(/((?:src|href)=["']\/(?:script\.js|site-fixes\.css))\?v=[^"']+/g,'$1?v=qa-20261022');
  html=html.replace(/((?:src|href)=["']\/(?:home-useful\.css|partners-cards\.css|places\.js|places-data\.js|blog-filters\.js))\?v=[^"']+/g,'$1?v=home-20261023');
  html=html.replace(/(Таиланд|Истории)<br><span>/g,'$1 <br><span>');
  html=html.replace(/home-useful.css\?v=[^"']+/g,'home-useful.css?v=refine-20261023');
  html=html.replace(/((?:src|href)=["']\/(?:home-useful\.css|places\.js|places-data\.js))\?v=[^"']+/g,'$1?v=recommend-20261023');
  html=html.replace(/((?:src|href)=["']\/(?:places\.js|places-data\.js|partners-cards\.css))\?v=[^"']+/g,'$1?v=krabi-20261023');
  fs.writeFileSync(path,html);
}
