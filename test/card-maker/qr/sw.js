// 名刺QRページを端末に保存して、電波がなくても開けるようにする
var CACHE = 'meishi-qr-v1';
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(['./', './index.html']); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
// ページはネットを先に見て、つながらなければ保存したものを出す（直したものがすぐ届くように）
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function(r){
    if(r && r.ok){ var copy = r.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, copy); }); }
    return r;
  }).catch(function(){ return caches.match(e.request, {ignoreSearch: true}).then(function(r){ return r || caches.match('./'); }); }));
});
