// Shared metadata template. Keep page titles, canonical URLs and social cards together.
export function metadata({title,description,path,image='https://vanyavtae.com/assets/og.jpg',type='website',published}) {
  const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
  const url='https://vanyavtae.com'+path;
  const graph=[{'@type':'WebSite','@id':'https://vanyavtae.com/#website',url:'https://vanyavtae.com/',name:'Ваня в Тае',inLanguage:'ru',author:{'@id':'https://vanyavtae.com/#person'}},{'@type':'Person','@id':'https://vanyavtae.com/#person',name:'Иван Минеев',alternateName:'Ваня в Тае',url:'https://vanyavtae.com/',sameAs:['https://t.me/thevany','https://www.instagram.com/vanyavtae/']}];
  // Articles also describe themselves for search engines: headline, image, author and publish date.
  if(type==='article')graph.push({'@type':'Article','@id':url+'#article',headline:title.replace(/ \| Ваня в Тае$/,''),description,image,url,mainEntityOfPage:url,inLanguage:'ru',author:{'@id':'https://vanyavtae.com/#person'},publisher:{'@id':'https://vanyavtae.com/#person'},...(published?{datePublished:published,dateModified:published}:{})});
  const schema=JSON.stringify({'@context':'https://schema.org','@graph':graph});
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#fff0e3">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="${type}">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="Ваня в Тае">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
${image.endsWith("/assets/og.jpg")?'<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">':''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<script type="application/ld+json" id="site-schema">${schema}</script>
<link rel="icon" href="/assets/favicon.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&amp;display=swap" rel="stylesheet">`;
}
