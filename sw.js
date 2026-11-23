/* Warlords: Service Worker (Offline-Spiel nach dem ersten Laden).
   Spielcode (html/js/css) wird online immer frisch geladen. Nur wenn du Dateien in audio/, data/ oder icons/
   AENDERST oder ERSETZT (gleicher Name), VERSION hochzaehlen. */
const VERSION='warlords-v0.40';
const CORE=['./','index.html','manifest.webmanifest','css/style.css','data/snd.js','data/fan.js','data/vk.js',
 'icons/icon-192.png','icons/icon-512.png','js/01-daten-kern.js','js/02-figuren.js','js/03-karte-render.js','js/04-sound.js','js/06-dateimusik.js','js/07-sprache.js','js/08-menues.js','js/09-kampagne.js','js/10-schlacht.js','js/11-todesanimation.js','js/12-tastatur.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function ranged(req,res){ // Audio-Elemente fragen mit Range an: aus der vollen Datei ausschneiden
 const m=/bytes=(\d*)-(\d*)/.exec(req.headers.get('range')||'');if(!m)return res;
 const buf=await res.arrayBuffer(),n=buf.byteLength;let s=m[1]===''?n-parseInt(m[2],10):parseInt(m[1],10),e=m[1]!==''&&m[2]!==''?parseInt(m[2],10):n-1;
 e=Math.min(e,n-1);
 return new Response(buf.slice(s,e+1),{status:206,statusText:'Partial Content',headers:{'Content-Type':res.headers.get('Content-Type')||'audio/mpeg','Content-Length':String(e-s+1),'Content-Range':'bytes '+s+'-'+e+'/'+n}})}
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 const big=/\/(audio|data|icons)\//.test(u.pathname); // grosse Dateien: aus dem Speicher, spart Daten
 e.respondWith((async()=>{
  const c=await caches.open(VERSION),key=new Request(r.url);
  if(!big){ // Spielcode: immer zuerst die aktuelle Version aus dem Netz, ohne Browser-Zwischenspeicher; offline die gespeicherte
   try{const res=await fetch(new Request(r.url,{cache:'no-cache'}));if(res.ok){c.put(key,res.clone());return res}}catch(err){}
   return (await c.match(key))||new Response('offline',{status:503})}
  let hit=await c.match(key);
  if(!hit){try{const res=await fetch(key);if(res.ok){c.put(key,res.clone());hit=res}else return res}catch(err){return new Response('offline',{status:503})}}
  return r.headers.has('range')?ranged(r,hit):hit})())});
