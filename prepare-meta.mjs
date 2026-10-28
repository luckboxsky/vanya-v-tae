import fs from 'node:fs';
import {polishPage} from './page-polish.mjs';
import {metadata} from './site-meta.mjs';
const pages=JSON.parse(fs.readFileSync(new URL('./site-pages.json',import.meta.url),'utf8'));
// Cache-busting versions (?v=) for local CSS/JS. When a file changes, set a new version here — one line per file.
// Files not listed keep the shared version from page-polish.mjs. See SITE-MAINTENANCE.md.
const ASSET_VERSIONS={
  'script.js':'share-20261029',
  'site-fixes.css':'share-20261029',
  'home-useful.css':'services-20261023',
  'blog-filters.js':'home-20261023',
  'partners-cards.css':'legenda-20261028',
  'places.js':'icons-20261029',
  'places-data.js':'pagoda-photos-20261023',
  'media-kit-tv.css':'youtube-20261028',
  'motion.js':'count2-20261029',
  'places-maps.js':'krabi-relief-20261023'
};
function applyAssetVersions(html) {
  return html.replace(/((?:src|href)=["']\/([^"'?]+\.(?:css|js)))\?v=[^"']+/g,(whole,ref,file)=>ASSET_VERSIONS[file]?ref+'?v='+ASSET_VERSIONS[file]:whole);
}
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
// End of every article and story: optional FAQ block (from site-pages.json "faq") and share buttons (copy handler in script.js).
function articleExtras(html,meta) {
  html=html.replace(/<!-- Article extras -->[\s\S]*?<!-- \/Article extras -->/g,'');
  if(!html.includes('<article class="story-content">'))return html;
  const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;');
  const url='https://vanyavtae.com'+meta.path;
  const title=meta.title.replace(/\s*\|\s*Ваня в Тае$/,'');
  const faq=meta.faq?.length?'<section class="story-faq" aria-labelledby="story-faq-title"><h2 id="story-faq-title">Коротко: частые вопросы</h2>'+meta.faq.map(({q,a})=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')+'</section>':'';
  const tg='https://t.me/share/url?url='+encodeURIComponent(url)+'&amp;text='+encodeURIComponent(title);
  const share=`<div class="story-share"><span>Пригодилось? Отправьте тем, кто собирается в Таиланд</span><div class="story-share-actions"><a class="button primary" href="${tg}" target="_blank" rel="noopener noreferrer" data-goal="share_telegram">Отправить в Telegram</a><button class="button outline share-copy" type="button" data-share-copy="${url}">Скопировать ссылку</button></div></div>`;
  const block='<!-- Article extras -->'+faq+share+'<!-- /Article extras -->';
  const at=html.search(/<aside class="read-also"|<nav class="story-end"/);
  return at<0?html:html.slice(0,at)+block+html.slice(at);
}

for(const [file,meta] of Object.entries(pages)) {
  const path=new URL('./'+file,import.meta.url);
  let html=fs.readFileSync(path,'utf8');
  html=html.replace(/<!-- Yandex\.Metrika counter -->[\s\S]*?<!-- \/Yandex\.Metrika counter -->\s*/g,'')
    .replace(/\s*<!-- Yandex\.Metrika fallback -->[\s\S]*?<!-- \/Yandex\.Metrika fallback -->\s*/g,'');
  html=html.replace(/<head>([\s\S]*?)<\/head>/i,(_,head)=>{
    head=head.replace(/<script\b[^>]*id=["']site-schema["'][^>]*>[\s\S]*?<\/script>/gi,'')
      .replace(/<script\b[^>]*src=["']\/motion\.js[^>]*><\/script>/gi,'');
    head=head.replace(/<title>[\s\S]*?<\/title>/gi,'')
      .replace(/<meta\b[^>]*>/gi,tag=>/charset=|(?:name|property)=["'](?:viewport|theme-color|description|twitter:[^"']+|og:[^"']+)["']/i.test(tag)?'':tag)
      .replace(/<link\b[^>]*>/gi,tag=>/rel=["'](?:canonical|icon|apple-touch-icon)["']|fonts\.(?:googleapis|gstatic)\.com|site-fixes\.css/i.test(tag)?'':tag);
    const sharedHead=metadata(meta);
    // Collapse lines left empty by removed tags so repeated runs don't add blank lines.
    head=head.trim().replace(/\r?\n[ \t\r]*(?:\n[ \t\r]*)+/g,'\n');
    return '<head>\n'+sharedHead+'\n'+head+'\n<link rel="stylesheet" href="/site-fixes.css">\n<script defer src="/motion.js?v=1"></script>\n</head>';
  });

  if(file!=='consultation.html')html=articleExtras(html,meta);
  html=instagramNotice(html);
  html=polishPage(html);
  html=applyAssetVersions(html);
  html=html.replace(/(Таиланд|Истории)<br><span>/g,'$1 <br><span>');
  fs.writeFileSync(path,html);
}
