/* مهم: هذا الموقع (ebom2030-gif.github.io) مشترك مع تطبيقات أخرى مثل «يومي»، والذاكرة المؤقتة مشتركة بينها.
   لذلك نحذف ونقرأ فقط الذاكرة التي تبدأ بـ dm- ولا نلمس ذاكرة أي تطبيق آخر. */
const C = 'dm-shell-v4';
const SHELL = ['./', './install.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('dm-') === 0 && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
/* فتح فوري: نعرض النسخة المحفوظة مباشرة ونحدّثها في الخلفية للمرة القادمة */
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.indexOf('/demo/') >= 0) return;
  e.respondWith(caches.open(C).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request, { cache: 'no-cache' }).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; });
    if (hit) { e.waitUntil(net.catch(() => { })); return hit; }
    return net.catch(() => c.match('./'));
  })));
});
