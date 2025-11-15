// assets/js/navbar.js
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const list = document.querySelector('.navbar__list');
  const items = document.querySelectorAll('.navbar__item[data-mega]');
  const megas = document.querySelectorAll('.mega');
  const backdrop = document.querySelector('[data-backdrop]');

  if (!navbar) return;

  let pointerInside = false;
  const isMobile = () => window.matchMedia('(max-width:900px)').matches;

  /* close all megas */
  function closeAll() {
    megas.forEach(m => {
      m.classList.remove('mega--visible');
      m.setAttribute('aria-hidden', 'true');
    });
    items.forEach(it => {
      const btn = it.querySelector('.navbar__link--btn');
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
    el.setAttribute('aria-hidden','false');
    backdrop.classList.add('navbar__backdrop--visible');
    document.body.classList.add('navbar--blur-active');
  }

  /* DESKTOP: hover */
  items.forEach(item => {
    const id = item.dataset.mega;
    const btn = item.querySelector('.navbar__link--btn');

    item.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      pointerInside = true;
      showMega(id);
      if (btn) btn.setAttribute('aria-expanded','true');
    });

    item.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      // delay so pointer can move into mega without closing
      setTimeout(() => {
        if (!pointerInside) closeAll();
      }, 80);
    });
  });

  /* keep open while pointer inside mega */
  megas.forEach(m => {
    m.addEventListener('mouseenter', () => { pointerInside = true; });
    m.addEventListener('mouseleave', () => {
      pointerInside = false;
      setTimeout(() => { if (!pointerInside) closeAll(); }, 80);
    });
  });

  /* mobile: toggle drawer */
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = list.classList.toggle('navbar__list--open');
      toggle.setAttribute('aria-expanded', String(open));
      if (open) backdrop.classList.add('navbar__backdrop--visible');
      else {
        closeAll();
        backdrop.classList.remove('navbar__backdrop--visible');
      }
    });
  }

  /* mobile: accordion behavior for mega triggers */
  items.forEach(item => {
    const btn = item.querySelector('.navbar__link--btn');
    const id = item.dataset.mega;
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      const target = document.getElementById(id);
      const visible = target.classList.toggle('mega--visible');
      target.setAttribute('aria-hidden', String(!visible));
      btn.setAttribute('aria-expanded', String(visible));

      const anyOpen = Array.from(megas).some(m => m.classList.contains('mega--visible'));
      if (anyOpen) backdrop.classList.add('navbar__backdrop--visible');
      else backdrop.classList.remove('navbar__backdrop--visible');
    });
  });

  /* backdrop click closes everything */
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (list.classList.contains('navbar__list--open')) {
        list.classList.remove('navbar__list--open');
        toggle.setAttribute('aria-expanded','false');
      }
      closeAll();
    });
  }

  /* keyboard: Enter/Space toggle; Escape close */
  document.querySelectorAll('.navbar__link--btn').forEach(btn => {
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
  window.addEventListener('scroll', handleScroll, { passive:true });

  /* cleanup on resize */
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      list.classList.remove('navbar__list--open');
      toggle.setAttribute('aria-expanded','false');
    } else {
      closeAll();
    }
  });
});
