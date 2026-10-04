/* مهم: هذا الموقع (ebom2030-gif.github.io) مشترك مع تطبيقات أخرى مثل «يومي»، والذاكرة المؤقتة مشتركة بينها.
   لذلك نحذف ونقرأ فقط الذاكرة التي تبدأ بـ dmt- ولا نلمس ذاكرة أي تطبيق آخر. */
const C = 'dmt-shell-v1';
const SHELL = ['./', './install.html', './manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('dmt-') === 0 && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || false || u.pathname.indexOf('/tenders/') >= 0) return;
  /* الصفحات: أحدث نسخة من الإنترنت دائماً (مهلة ثانيتين)، والنسخة المحفوظة فقط عند انقطاع أو بطء الاتصال */
  if (e.request.mode === 'navigate') {
    const key = u.pathname.indexOf('install.html') >= 0 ? './install.html' : './';
    e.respondWith(caches.open(C).then(c => {
      const net = fetch(e.request, { cache: 'no-store' }).then(r => { if (r && r.ok) c.put(key, r.clone()); return r; });
      const slow = new Promise(res => setTimeout(() => c.match(key).then(h => h && res(h)), 2000));
      return Promise.race([net.catch(() => c.match(key)), slow]);
    }));
    return;
  }
  /* الأيقونات والملفات الثابتة: من الذاكرة فوراً مع تحديث في الخلفية */
  e.respondWith(caches.open(C).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request, { cache: 'no-cache' }).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; });
    if (hit) { e.waitUntil(net.catch(() => { })); return hit; }
    return net;
  })));
});
