import fs from 'node:fs';
import vm from 'node:vm';
import './prepare-meta.mjs';
// Generate the native contact index from the same data as the interactive cards.
const data={window:{}};
vm.runInNewContext(fs.readFileSync(new URL('./places-data.js',import.meta.url),'utf8'),data);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const islands=[['phangan','Остров Пханган'],['samui','Остров Самуи'],['phuket','Остров Пхукет'],['chiangmai','Чиангмай'],['krabi','Краби']];
const sections=islands.map(([id,name])=>{
 const list=data.window.PLACE_RECOMMENDATIONS.filter(e=>e.places.includes(id));
 const cards=list.map(item=>`<article><h3>${esc(item.name)}</h3><p><strong>${esc(item.role)}</strong></p>${item.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${item.note?`<p>${esc(item.note)}</p>`:''}<div class="directory-links">${item.links.map(link=>`<a href="${esc(link.url)}" data-click-partner="${esc(item.id)}" data-click-place="${id}" data-click-channel="${link.url.startsWith('tel:')?'phone':link.url.startsWith('https://t.me/')?'telegram':'website'}"${link.url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${esc(link.label)}</a>`).join('')}</div></article>`).join('');
 return `<section id="directory-${id}"><h2>${name}</h2>${cards||'<p>Собираю проверенные контакты и любимые места. Подборка появится здесь.</p>'}</section>`;
}).join('');
const file=new URL('./partners.html',import.meta.url);
let html=fs.readFileSync(file,'utf8');
const block=`<!-- partner-directory:start --><details class="directory-index" id="directory-index"><summary>Все рекомендации и контакты</summary>${sections}</details><!-- partner-directory:end -->`;
if(!html.includes('<!-- partner-directory:start -->'))throw new Error('Native directory markers are missing');
html=html.replace(/<!-- partner-directory:start -->[\s\S]*?<!-- partner-directory:end -->/,block);
fs.writeFileSync(file,html);
