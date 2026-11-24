const C="tile-calc-v32",F=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>fetch(u,{cache:"reload"}).then(r=>{if(r&&r.ok)return c.put(u,r)}).catch(()=>{})))));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
/* Network-first: online ho to hamesha naya version, 2 second me na aaye ya offline ho to saved copy */
self.addEventListener("fetch",e=>{
  const q=e.request;
  if(q.method!=="GET"||new URL(q.url).origin!==location.origin)return;
  e.respondWith((async()=>{
    try{
      const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),2000);
      const res=await fetch(q,{cache:"no-cache",signal:ctl.signal});
      clearTimeout(t);
      if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(q,cp)).catch(()=>{})}
      return res;
    }catch(err){
      return (await caches.match(q,{ignoreSearch:true}))||(await caches.match("./index.html"))||Response.error();
    }
  })());
});
