import {weatherResponse} from './weather-worker.mjs';
const PARTNERS = {
  'autain-bike': {name:'Autain Bike Repair', places:['phangan'], channels:['maps']},
  'nong-bikes': {name:'Nong cheap rent and repair bikes', places:['phangan'], channels:['maps']},
  'phuket-market': {name:'Phuket Market', places:['phuket'], channels:['website']},
  'green-way': {name:'Green Way', places:['phuket','samui'], channels:['telegram','phone']},
  'funny-time': {name:'Funny Time', places:['phuket'], channels:['website']},
  viktor: {name:'Виктор', places:['phuket'], channels:['telegram']},
  'el-phuket': {name:'EL PHUKET', places:['phuket'], channels:['website']},
  'fat-cat-krabi': {name:'Кирилл · Толстый кот', places:['krabi'], channels:['maps','instagram']}
};
const ORIGINS = new Set(['https://vanyavtae.com','https://www.vanyavtae.com','https://yellow-term-6761.ddnpw2r226.workers.dev']);
const ISLANDS = {phuket:'Пхукет',samui:'Самуи',krabi:'Краби',phangan:'Пханган'};
const ACTIONS = {website:'Сайт / приложение',telegram:'Telegram',phone:'Телефон',maps:'Google Карты',instagram:'Instagram'};
const response = (status) => new Response(null,{status,headers:{'Cache-Control':'no-store'}});

export async function recordClick(request, env) {
  if (request.method !== 'POST') return response(405);
  const origin = request.headers.get('Origin');
  if (!ORIGINS.has(origin)) return response(403);
  if (Number(request.headers.get('Content-Length') || 0) > 512) return response(413);
  if (/bot|crawler|spider|headless/i.test(request.headers.get('User-Agent') || '')) return response(204);
  let event;
  try {
    const body = await request.text();
    if (body.length > 512) return response(413);
    event = JSON.parse(body);
  } catch { return response(400); }
  const partner = Object.hasOwn(PARTNERS,event?.partner) ? PARTNERS[event.partner] : null;
  if (!partner || !partner.places.includes(event.place) || !partner.channels.includes(event.channel)) return response(400);
  if (!env.CLICK_DB) return response(503);
  const now = new Date();
  const day = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  const values = [partner.name,ISLANDS[event.place],ACTIONS[event.channel],event.test === true ? 1 : 0,now.toISOString()];
  try {
    await env.CLICK_DB.batch([
      env.CLICK_DB.prepare(`INSERT INTO partner_totals (partner,island,action,is_test,clicks,last_clicked) VALUES (?,?,?,?,1,?)
        ON CONFLICT(partner,island,action,is_test) DO UPDATE SET clicks=clicks+1,last_clicked=excluded.last_clicked`).bind(...values),
      env.CLICK_DB.prepare(`INSERT INTO partner_daily (day,partner,island,action,is_test,clicks,last_clicked) VALUES (?,?,?,?,?,1,?)
        ON CONFLICT(day,partner,island,action,is_test) DO UPDATE SET clicks=clicks+1,last_clicked=excluded.last_clicked`).bind(day,...values)
    ]);
    return response(204);
  } catch {
    // Never log request headers, identifiers, or event bodies.
    return response(503);
  }
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === '/_weather/chiang-mai') return weatherResponse(request);
    if (new URL(request.url).pathname === '/_events/partner-click') return recordClick(request,env);
    return env.ASSETS.fetch(request);
  }
};
