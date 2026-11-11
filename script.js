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
function setupOfficerDialog(dlg) {
  dlg.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => dlg.close());
  });
  dlg.addEventListener('click', (event) => {
    if (event.target === dlg) dlg.close();
  });
  dlg.addEventListener('close', () => {
    if (!document.querySelector('dialog.modal[open]')) document.body.classList.remove('no-scroll');
  });
}

function createOfficerDialog(id) {
  const dlg = document.createElement('dialog');
  dlg.className = 'modal';
  dlg.id = id;
  dlg.innerHTML = `
    <button class="modal-close" type="button" data-close aria-label="Close">✕</button>
    <div class="modal-left">
      <div class="modal-avatar"><img alt="" /></div>
      <div class="modal-name"></div>
      <div class="modal-position"></div>
    </div>
    <div class="modal-right">
      <h3>Details &amp; Background</h3>
      <ul class="credential-list"></ul>
    </div>`;
  document.body.append(dlg);
  setupOfficerDialog(dlg);
  return dlg;
}

function populateOfficerDialog(dlg, card) {
  const name = card.querySelector('.officer-name')?.textContent.trim() || 'Officer';
  const image = card.querySelector('.avatar img');
  const role = card.querySelector('.officer-position')?.textContent.trim()
    || card.closest('.position-block')?.querySelector('.position-label')?.textContent.trim()
    || 'Officer';
  const course = card.querySelector('.officer-course')?.textContent.trim();

  dlg.setAttribute('aria-label', `${name} details`);
  dlg.querySelector('.modal-name').textContent = name;
  dlg.querySelector('.modal-position').textContent = role;
  const modalImage = dlg.querySelector('.modal-avatar img');
  if (image) {
    modalImage.src = image.getAttribute('src');
    modalImage.alt = `Photo of ${name}`;
    modalImage.style.display = '';
  }

  const details = dlg.querySelector('.credential-list');
  details.replaceChildren();
  const customDetails = card.querySelector('template.popup-details');
  if (customDetails) {
    details.append(customDetails.content.cloneNode(true));
    return;
  }

  [role, course].filter(Boolean).forEach((detail) => {
    const item = document.createElement('li');
    item.textContent = detail;
    details.append(item);
  });
}

document.querySelectorAll('[data-dialog]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.dialog) || createOfficerDialog(btn.dataset.dialog);
    populateOfficerDialog(dlg, btn);
    dlg.showModal();
    document.body.classList.add('no-scroll');
    const body = dlg.querySelector('.modal-right');
    if (body) body.scrollTop = 0;
  });
});
 
document.querySelectorAll('dialog.modal').forEach((dlg) => {
  setupOfficerDialog(dlg);
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
 
