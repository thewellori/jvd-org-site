const navContainer = document.querySelector('.nav-container');
const items = document.querySelectorAll('.nav-item');
const megaMenus = document.querySelectorAll('.mega-menu');

items.forEach(item => {
  const id = item.dataset.menu;
  const target = document.getElementById(id);

  item.addEventListener('mouseenter', () => {
    // فعال‌سازی blur برای کل صفحه
    document.body.classList.add('menu-blur');

    // مخفی کردن همه مگامن‌ها و نمایش هدف
    megaMenus.forEach(m => m.classList.remove('active'));
    if (target) target.classList.add('active');
  });

  item.addEventListener('mouseleave', (e) => {
    // اگر موس وارد مگامنو شد، نباید blur برداشته شود — مدیریت با mouseenter/leave روی مگامنو در پایین انجام می‌شود
    setTimeout(() => {
      if (!document.querySelector('.mega-menu:hover')) {
        document.body.classList.remove('menu-blur');
        megaMenus.forEach(m => m.classList.remove('active'));
      }
    }, 50);
  });
});

// وقتی موس از مگامنو خارج شد، همه را ببند
megaMenus.forEach(menu => {
  menu.addEventListener('mouseleave', () => {
    document.body.classList.remove('menu-blur');
    menu.classList.remove('active');
  });

  menu.addEventListener('mouseenter', () => {
    document.body.classList.add('menu-blur');
    menu.classList.add('active');
  });
});
