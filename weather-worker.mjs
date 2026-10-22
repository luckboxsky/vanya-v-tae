const source='https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=18.79&lon=98.99';
let pending, retryAfter=0;
export function selectWeather(data,now=Date.now()) {
 const rows=data?.properties?.timeseries;
 if(!Array.isArray(rows)||!rows.length)throw new Error('Missing weather');
 const row=rows.reduce((a,b)=>Math.abs(Date.parse(a.time)-now)<=Math.abs(Date.parse(b.time)-now)?a:b);
 const temperature=row?.data?.instant?.details?.air_temperature;
 const symbol=row?.data?.next_1_hours?.summary?.symbol_code||row?.data?.next_6_hours?.summary?.symbol_code;
 if(!Number.isFinite(temperature)||temperature < -30||temperature > 60||Math.abs(Date.parse(row.time)-now)>3*3600000||typeof symbol!=='string')throw new Error('Invalid weather');
 return {temperature:Math.round(temperature),symbol,time:row.time,updatedAt:data.properties.meta.updated_at,source:'MET Norway'};
}
async function load(cache) {
 const key=new Request(source);
 const cached=await cache?.match(key);
 if(cached)return cached.json();
 if(Date.now()<retryAfter)throw new Error('Weather cooling down');
 if(pending)return pending;
 pending=(async()=>{
  const response=await fetch(source,{headers:{'User-Agent':'VanyaVtaeWeather/1.0 (+https://vanyavtae.com/)','Accept':'application/json'},signal:AbortSignal.timeout(7000)});
  if(!response.ok)throw new Error('Weather unavailable');
  const data=await response.json();selectWeather(data);
  const expires=Date.parse(response.headers.get('Expires'));
  const ttl=Math.max(600,Number.isFinite(expires)?Math.ceil((expires-Date.now())/1000):600);
  await cache?.put(key,new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json','Cache-Control':'public, max-age='+ttl}}));
  return data;
 })();
 try{return await pending;}catch(error){retryAfter=Date.now()+120000;throw error;}finally{pending=undefined;}
}
export async function weatherResponse(request) {
 if(request.method!=='GET')return new Response(null,{status:405,headers:{Allow:'GET'}});
 try{
  const data=await load(globalThis.caches?.default);
  return Response.json(selectWeather(data),{headers:{'Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff'}});
 }catch{
  return Response.json({unavailable:true},{status:503,headers:{'Cache-Control':'no-store'}});
 }
}
