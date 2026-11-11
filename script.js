// Small helpers only: mobile menu, pop-up windows, and fade-in animations.
document.documentElement.classList.add('js');
 
// ─── Mobile menu ───
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
 
function setMenu(open) {
  if (!burger || !navLinks) return;
  navLinks.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}
 
if (burger) {
  burger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
}
 
// ─── Pop-up windows (<dialog>) ───
document.querySelectorAll('[data-dialog]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.dialog);
    if (!dlg) return;
    dlg.showModal();
    document.body.classList.add('no-scroll');
    const body = dlg.querySelector('.modal-right');
    if (body) body.scrollTop = 0;
  });
});
 
document.querySelectorAll('dialog.modal').forEach((dlg) => {
  dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dlg.close()));
  // Click on the dark backdrop closes the pop-up
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => {
    if (!document.querySelector('dialog.modal[open]')) document.body.classList.remove('no-scroll');
  });
});
 
// ─── Hide broken photos so the silhouette placeholder shows instead ───
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG' && e.target.closest('.avatar, .modal-avatar')) {
    e.target.style.display = 'none';
  }
}, true);
document.querySelectorAll('.avatar img, .modal-avatar img').forEach((img) => {
  if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
});
 
// ─── Fade-in on scroll ───
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('visible'));
}
 