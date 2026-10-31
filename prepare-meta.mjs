import fs from 'node:fs';
import {polishPage} from './page-polish.mjs';
import {metadata} from './site-meta.mjs';
const pages=JSON.parse(fs.readFileSync(new URL('./site-pages.json',import.meta.url),'utf8'));
// Cache-busting versions (?v=) for local CSS/JS. When a file changes, set a new version here — one line per file.
// Files not listed keep the shared version from page-polish.mjs. See SITE-MAINTENANCE.md.
const ASSET_VERSIONS={
  'script.js':'consult-20261030',
  'site-fixes.css':'links-20261031',
  'home-useful.css':'consult-20261030',
  'blog-filters.js':'home-20261023',
  'partners-cards.css':'legenda-20261028',
  'places.js':'chiangmai-20261031',
  'places-data.js':'sasha-20261031',
  'media-kit-tv.css':'youtube-20261028',
  'motion.js':'count2-20261029',
  'gecko.js':'links-20261029',
  'coffee.css':'two-20261101',
  'coffee.js':'two-20261101',
  'thai.js':'thai-20261029',
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
    return part.replace(/(Instagram|Facebook)(?![\w*])/g,'$1*');
  }).join('');
  // Facebook belongs to Meta too: when a page mentions it, the notice names both.
  const meta=html.includes('Facebook*')?'Instagram и Facebook принадлежат':'Instagram принадлежит';
  html=html.replace(/<a\b([^>]*href=["']https?:\/\/(?:www\.)?instagram\.com[^>]*)>([\s\S]*?)<\/a>/gi,(_,attrs,body)=>{
    if(!attrs.includes('aria-describedby=')) attrs+=' aria-describedby="instagram-notice"';
    if(!body.includes('*')) {
      if(body.includes('actor-watch')) body=body.replace('Смотреть оригинал','Смотреть оригинал*');
      else body=body.replace(/(\s*↗)?$/, '*$1');
    }
    return '<a'+attrs+'>'+body+'</a>';
  });
  const note='<!-- Instagram notice -->\n<aside class="wrap instagram-notice" id="instagram-notice" aria-label="Примечание об Instagram" style="padding-top:20px;padding-bottom:20px;font-size:13px;line-height:1.6"><p style="margin:0">* '+meta+' компании Meta Platforms Inc., признанной экстремистской организацией; её деятельность запрещена на территории Российской Федерации.</p></aside>\n<!-- /Instagram notice -->\n';
  return html.replace(/<footer\b/i,note+'<footer');
}
// Author line under the lead and the "Об авторе" box at the end of every article and story (trust for readers and search engines).
const MONTHS=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const ruDate=iso=>{const [y,m,d]=iso.split('-').map(Number);return d+' '+MONTHS[m-1]+' '+y};
function authorByline(html,meta) {
  html=html.replace(/<!-- Author byline -->[\s\S]*?<!-- \/Author byline -->/g,'');
  if(meta.type!=='article')return html;
  const date=meta.modified||meta.published;
  const when=date?`<br><time datetime="${date}">${meta.modified?'Обновлено':'Опубликовано'} ${ruDate(date)}</time>`:'';
  const line=`<!-- Author byline --><div class="author-byline"><img src="/assets/avatar-links.jpg" alt="" width="44" height="44"><span><a href="/about">Ваня</a> · живу в Таиланде с 2017 года${when}</span></div><!-- /Author byline -->`;
  return html.replace(/(<p class="story-lead">[\s\S]*?<\/p>)/,'$1'+line);
}
const AUTHOR_BOX='<section class="author-box" aria-label="Об авторе"><img src="/assets/avatar-links.jpg" alt="Ваня" width="96" height="96" loading="lazy"><div><span class="author-box-kicker">Об авторе</span><strong>Ваня, автор блога «Ваня в Тае»</strong><p>С 2017 года живу в Таиланде: Самуи, Пханган, Пхукет, теперь Чиангмай. Пять лет работал в прокате байков, жил по разным визам. Пишу только о том, что проверил сам.</p><div class="author-box-links"><a href="/about">Моя история</a><a href="https://www.instagram.com/vanyavtae/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.youtube.com/@vanyavtae" target="_blank" rel="noopener noreferrer">YouTube</a></div></div></section>';
// End of every article and story: optional FAQ block (from site-pages.json "faq"), a consultation card and share buttons (copy handler in script.js).
// The consultation page itself gets only its FAQ, placed before its closing call to action.
function articleExtras(html,meta,isConsultation=false) {
  html=html.replace(/<!-- Article extras -->[\s\S]*?<!-- \/Article extras -->/g,'');
  if(!isConsultation&&!html.includes('<article class="story-content">'))return html;
  const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;');
  const url='https://vanyavtae.com'+meta.path;
  const title=meta.title.replace(/\s*\|\s*Ваня в Тае$/,'');
  const faq=meta.faq?.length?'<section class="story-faq" aria-labelledby="story-faq-title"><h2 id="story-faq-title">Коротко: частые вопросы</h2>'+meta.faq.map(({q,a})=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')+'</section>':'';
  const tg='https://t.me/share/url?url='+encodeURIComponent(url)+'&amp;text='+encodeURIComponent(title);
  const share=`<div class="story-share"><span>Пригодилось? Отправьте тем, кто собирается в Таиланд</span><div class="story-share-actions"><a class="button primary" href="${tg}" target="_blank" rel="noopener noreferrer" data-goal="share_telegram">Отправить в Telegram</a><button class="button outline share-copy" type="button" data-share-copy="${url}">Скопировать ссылку</button></div></div>`;
  const consult='<div class="consult-card"><div><span class="consult-card-kicker">Консультация онлайн</span><strong>Не хочется разбираться самому?</strong><p>Разберу вашу ситуацию и соберу план: ответ текстом — 990&nbsp;₽, созвон — от 1&nbsp;490&nbsp;₽.</p></div><a class="button primary" href="/consultation" data-click-partner="consult-article" data-click-place="articles" data-click-channel="article">Выбрать формат</a></div>';
  const block='<!-- Article extras -->'+(isConsultation?faq:AUTHOR_BOX+faq+consult+share)+'<!-- /Article extras -->';
  const at=html.search(isConsultation?/<aside class="story-next-step"/:/<aside class="read-also"|<nav class="story-end"/);
  return at<0?html:html.slice(0,at)+block+html.slice(at);
}
// Strip with a Thai ornament and a Thai phrase right above the footer of every page (phrases rotate in thai.js).
export const THAI_STRIP='<!-- Thai strip --><div class="thai-strip"><button class="wrap thai-phrase" type="button" data-thai-phrase aria-label="Тайская фраза, нажмите для следующей"><span class="thai-phrase-label">Тайская фраза</span><span class="thai-phrase-th" lang="th">ไม่เป็นไร</span><span class="thai-phrase-say">май пен рай</span><span class="thai-phrase-means">ничего страшного, забей</span><span class="thai-phrase-more">ещё фраза</span></button></div><!-- /Thai strip -->';
function thaiStrip(html) {
  return html.replace(/<!-- Thai strip -->[\s\S]*?<!-- \/Thai strip -->/g,'').replace(/<footer\b/i,THAI_STRIP+'<footer');
}

for(const [file,meta] of Object.entries(pages)) {
  const path=new URL('./'+file,import.meta.url);
  // A page can be listed before its file is committed (drafts kept only locally); skip it instead of failing the build.
  if(!fs.existsSync(path))continue;
  let html=fs.readFileSync(path,'utf8');
  html=html.replace(/<!-- Yandex\.Metrika counter -->[\s\S]*?<!-- \/Yandex\.Metrika counter -->\s*/g,'')
    .replace(/\s*<!-- Yandex\.Metrika fallback -->[\s\S]*?<!-- \/Yandex\.Metrika fallback -->\s*/g,'');
  html=html.replace(/<head>([\s\S]*?)<\/head>/i,(_,head)=>{
    head=head.replace(/<script\b[^>]*id=["']site-schema["'][^>]*>[\s\S]*?<\/script>/gi,'')
      .replace(/<script\b[^>]*src=["']\/(?:motion|gecko|thai)\.js[^>]*><\/script>/gi,'');
    head=head.replace(/<title>[\s\S]*?<\/title>/gi,'')
      .replace(/<meta\b[^>]*>/gi,tag=>/charset=|(?:name|property)=["'](?:viewport|theme-color|description|twitter:[^"']+|og:[^"']+)["']/i.test(tag)?'':tag)
      .replace(/<link\b[^>]*>/gi,tag=>/rel=["'](?:canonical|icon|apple-touch-icon)["']|fonts\.(?:googleapis|gstatic)\.com|site-fixes\.css/i.test(tag)?'':tag);
    const sharedHead=metadata(meta);
    // Collapse lines left empty by removed tags so repeated runs don't add blank lines.
    head=head.trim().replace(/\r?\n[ \t\r]*(?:\n[ \t\r]*)+/g,'\n');
    return '<head>\n'+sharedHead+'\n'+head+'\n<link rel="stylesheet" href="/site-fixes.css">\n<script defer src="/motion.js?v=1"></script>\n<script defer src="/gecko.js?v=1"></script>\n<script defer src="/thai.js?v=1"></script>\n</head>';
  });

  html=articleExtras(html,meta,file==='consultation.html');
  html=authorByline(html,meta);
  html=instagramNotice(html);
  html=thaiStrip(html);
  html=polishPage(html);
  html=applyAssetVersions(html);
  html=html.replace(/(Таиланд|Истории)<br><span>/g,'$1 <br><span>');
  fs.writeFileSync(path,html);
}
// The 404 page is not in site-pages.json (no canonical, noindex): only refresh asset versions and the Thai strip.
{
  const path=new URL('./404.html',import.meta.url);
  fs.writeFileSync(path,applyAssetVersions(thaiStrip(fs.readFileSync(path,'utf8'))));
}
