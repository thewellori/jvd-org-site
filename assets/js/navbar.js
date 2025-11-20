/* assets/js/navbar.js */
/*
  Navbar JS
  - کنترل مگامنوی hover دسکتاپ و click موبایل (drawer)
  - کنترل LED (scaleX animation) و dynamic gradient via IntersectionObserver
  - اضافه کردن کلاس scrolled هنگام اسکرول برای glass effect
  - جلوگیری از flicker با زمان‌بندی هوشمند باز/بسته (debounce ساده)
*/

/* Helpers */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // بارگذاری ماژولار navbar از components (در صفحات دیگر استفاده کنید)
  const target = document.getElementById('site-navbar');
  if (target) {
    fetch('/components/navbar/navbar.html')
      .then(r => r.text())
      .then(html => {
        target.innerHTML = html;
        // بعد از درج، init کنیم
        initJvdNavbar();
      })
      .catch(err => {
        console.error('خطا در لود navbar:', err);
      });
  } else {
    // اگر صفحه مستقیم navbar را شامل می‌کند (مثلاً در index.html کپی شده)، init مستقیم
    initJvdNavbar();
  }
});

function initJvdNavbar() {
  const nav = document.getElementById('jvd-navbar');
  if (!nav) return;

  const overlay = document.getElementById('jvd-overlay');
  const drawer = document.getElementById('jvd-drawer');
  const hamburger = document.getElementById('jvd-hamburger');
  const megas = $$('.jvd-navbar__item.has-mega', nav);
  const links = $$('.jvd-navbar__link', nav);

  // ============================
  // 1) SCROLL: glass add/remove
  // ============================
  let lastScroll = window.scrollY;
  const onScroll = () => {
    const sc = window.scrollY;
    if (sc > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    lastScroll = sc;
  };
  window.addEventListener('scroll', throttle(onScroll, 50));
  onScroll();

  // ============================
  // 2) MEGA MENU (desktop hover)
  //    - استفاده از JS برای جلوگیری از flicker هنگام حرکت موس
  // ============================
  megas.forEach(item => {
    const megaId = item.dataset.mega;
    const menu = item.querySelector('.jvd-megamenu');
    const link = item.querySelector('.jvd-navbar__link');

    let openTimer = null;
    let closeTimer = null;
    const OPEN_DELAY = 60;
    const CLOSE_DELAY = 180;

    function openMega() {
      clearTimeout(closeTimer);
      openTimer = setTimeout(() => {
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        link.setAttribute('aria-expanded', 'true');
        overlay.classList.add('is-active');
        overlay.setAttribute('aria-hidden', 'false');
      }, OPEN_DELAY);
    }

    function closeMegaImmediate() {
      clearTimeout(openTimer);
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      link.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('is-active');
      overlay.setAttribute('aria-hidden', 'true');
    }

    function closeMega() {
      clearTimeout(openTimer);
      closeTimer = setTimeout(() => {
        closeMegaImmediate();
      }, CLOSE_DELAY);
    }

    // دسکتاپ: hover / pointerenter
    item.addEventListener('pointerenter', openMega);
    // وقتی موس از روی آیتم یا خود مگامنوی بیرون رفت، زمان‌بندی برای بستن
    item.addEventListener('pointerleave', closeMega);
    if (menu) {
      menu.addEventListener('pointerenter', () => {
        clearTimeout(closeTimer);
      });
      menu.addEventListener('pointerleave', closeMega);
    }

    // overlay click should close
    overlay.addEventListener('pointerdown', closeMegaImmediate);
  });

  // ============================
  // 3) LED behaviour (hover & keep open while moving)
  //    - LED با افزودن کلاس led-active فعال می‌شود (transform: scaleX)
  // ============================
  links.forEach(link => {
    const ledParent = link;
    // hover enter
    link.addEventListener('pointerenter', () => {
      ledParent.classList.add('led-active');
    });
    // leave
    link.addEventListener('pointerleave', () => {
      // روی دسکتاپ اجازه بدید سریع مخفی شود اما نه آنی تا flicker نداشته باشیم
      setTimeout(() => ledParent.classList.remove('led-active'), 80);
    });
  });

  // ============================
  // 4) MOBILE: drawer toggle & drawer submenu click
  // ============================
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      if (expanded) closeDrawer();
      else openDrawer();
    });

    function openDrawer() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    // بسته شدن با کلیک بیرون (overlay نیز می‌تواند کار کند)
    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !hamburger.contains(e.target)) {
        closeDrawer();
      }
    });

    // drawer submenu toggles
    $$('.drawer-has-children > .drawer-toggle', drawer).forEach(btn => {
      btn.addEventListener('click', (e) => {
        const parent = btn.parentElement;
        parent.classList.toggle('open');
      });
    });
  }

  // ============================
  // 5) IntersectionObserver: تغییر دینامیک رنگ LED بر اساس سکشن‌ها
  //    - المنت‌هایی که می‌خواهیم بر اساس آنها gradient تغییر کند،
  //      به آنها attribute قرار دهید: data-led-color = "linear-gradient(...)"
  //    - اگر هیچ سکشنی پیدا نشد، از متغیر root استفاده می‌شود.
  // ============================
  const obsTargets = $$('[data-led-color]');
  if (obsTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const val = entry.target.getAttribute('data-led-color');
          if (val) {
            document.documentElement.style.setProperty('--led-gradient', val);
          }
        }
      });
    }, { threshold: 0.35 });

    obsTargets.forEach(t => observer.observe(t));
  }

  // ============================
  // 6) Accessibility: Escape to close
  // ============================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // close all megamenus and overlay
      $$('.jvd-megamenu.is-open').forEach(m => m.classList.remove('is-open'));
      overlay.classList.remove('is-active');
      // close drawer
      if (drawer) drawer.classList.remove('open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // small utility throttle
  function throttle(fn, wait){
    let t = 0;
    return (...args) => {
      const now = Date.now();
      if (now - t >= wait) {
        t = now;
        fn(...args);
      }
    };
  }

  // end init
}
