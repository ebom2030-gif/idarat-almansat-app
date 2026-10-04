/* مهم: هذا الموقع (ebom2030-gif.github.io) مشترك مع تطبيقات أخرى مثل «يومي»، والذاكرة المؤقتة مشتركة بينها.
   لذلك نحذف فقط الذاكرة التي تبدأ بـ dm- ولا نلمس ذاكرة أي تطبيق آخر. */
const C = 'dm-shell-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('dm-') === 0 && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.open(C).then(c => c.match(e.request, { ignoreSearch: true }).then(r => r || c.match('./')))));
});
