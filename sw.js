const C="tile-calc-v23",F=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).catch(()=>{}));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const q=e.request;
  if(q.method!=="GET"||new URL(q.url).origin!==location.origin)return;
  e.respondWith(caches.match(q,{ignoreSearch:true}).then(r=>r||fetch(q).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(q,cp)).catch(()=>{})}return res}).catch(()=>caches.match("./index.html"))));
});
