// navbar.js - modular behavior: hover desktop, click mobile, backdrop blur, sticky change
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const list = document.querySelector('.navbar__list');
  const items = document.querySelectorAll('.navbar__item[data-mega]');
  const megas = document.querySelectorAll('.mega');
  const backdrop = document.querySelector('[data-backdrop]');

  if (!navbar) return;

  let pointerInside = false;
  const mobileQuery = () => window.matchMedia('(max-width:900px)').matches;

  /* utility: close all megas */
  function closeAll() {
    megas.forEach(m => {
      m.classList.remove('mega--visible');
      m.setAttribute('aria-hidden', 'true');
    });
    items.forEach(it => {
      const btn = it.querySelector('.navbar__link--button');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    backdrop.classList.remove('navbar__backdrop--visible');
    document.body.classList.remove('navbar--blur-active');
  }

  /* show mega by id */
  function showMega(id) {
    closeAll();
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('mega--visible');
    el.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('navbar__backdrop--visible');
    document.body.classList.add('navbar--blur-active');
  }

  /* Hover behavior for desktop (mouseenter/leave on triggers) */
  items.forEach(item => {
    const megaId = item.dataset.mega;
    const btn = item.querySelector('.navbar__link--button');

    item.addEventListener('mouseenter', (e) => {
      if (mobileQuery()) return;
      pointerInside = true;
      showMega(megaId);
      if (btn) btn.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', (e) => {
      if (mobileQuery()) return;
      // delay to allow pointer to reach mega
      setTimeout(() => {
        if (!pointerInside) closeAll();
      }, 100);
    });
  });

  /* keep open while pointer inside mega */
  megas.forEach(m => {
    m.addEventListener('mouseenter', () => { pointerInside = true; });
    m.addEventListener('mouseleave', () => {
      pointerInside = false;
      setTimeout(() => { if (!pointerInside) closeAll(); }, 100);
    });
  });

  /* Toggle mobile drawer */
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = list.classList.toggle('navbar__list--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        backdrop.classList.add('navbar__backdrop--visible');
      } else {
        closeAll();
        backdrop.classList.remove('navbar__backdrop--visible');
      }
    });
  }

  /* Mobile: make mega behave like accordion */
  items.forEach(item => {
    const btn = item.querySelector('.navbar__link--button');
    const id = item.dataset.mega;
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      if (!mobileQuery()) return; // only mobile accordion
      e.preventDefault();
      const target = document.getElementById(id);
      if (!target) return;
      const nowVisible = target.classList.toggle('mega--visible');
      target.setAttribute('aria-hidden', String(!nowVisible));
      btn.setAttribute('aria-expanded', String(nowVisible));

      // keep backdrop if any mega open
      const anyOpen = Array.from(megas).some(m => m.classList.contains('mega--visible'));
      if (anyOpen) backdrop.classList.add('navbar__backdrop--visible');
      else backdrop.classList.remove('navbar__backdrop--visible');
    });
  });

  /* backdrop click closes everything (including drawer) */
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (list.classList.contains('navbar__list--open')) {
        list.classList.remove('navbar__list--open');
        toggle.setAttribute('aria-expanded','false');
      }
      closeAll();
    });
  }

  /* keyboard: Enter/Space toggles buttons; Escape closes */
  document.querySelectorAll('.navbar__link--button').forEach(btn => {
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
      if (e.key === 'Escape') {
        closeAll();
      }
    });
  });

  /* sticky: change style after scroll (black -> glass) */
  function handleScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (y > 20) navbar.classList.add('navbar--scrolled');
    else navbar.classList.remove('navbar--scrolled');
  }
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* cleanup on resize: close drawer when switching */
  window.addEventListener('resize', () => {
    if (!mobileQuery()) {
      list.classList.remove('navbar__list--open');
      toggle.setAttribute('aria-expanded','false');
    } else {
      closeAll();
    }
  });
});
