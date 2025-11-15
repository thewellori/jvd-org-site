const nav = document.querySelector('.apple-navbar');
const items = document.querySelectorAll('.nav-item');
const megaMenus = document.querySelectorAll('.mega-menu');

// 🔹 hover دسکتاپ / click موبایل
items.forEach(item => {
  const id = item.dataset.menu;
  const target = document.getElementById(id);

  // دسکتاپ
  item.addEventListener('mouseenter', () => {
    document.body.classList.add('menu-blur');
    megaMenus.forEach(m => m.classList.remove('active'));
    if (target) target.classList.add('active');
  });

  item.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!document.querySelector('.mega-menu:hover')) {
        document.body.classList.remove('menu-blur');
        megaMenus.forEach(m => m.classList.remove('active'));
      }
    }, 50);
  });

  // موبایل
  item.addEventListener('click', () => {
    if (target) target.classList.toggle('active');
  });
});

// mega menu hover
megaMenus.forEach(menu => {
  menu.addEventListener('mouseenter', () => {
    document.body.classList.add('menu-blur');
    menu.classList.add('active');
  });
  menu.addEventListener('mouseleave', () => {
    document.body.classList.remove('menu-blur');
    menu.classList.remove('active');
  });
});

// 🔹 sticky + شیشه‌ای شدن بعد اسکرول
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});
