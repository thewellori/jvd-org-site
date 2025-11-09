// انتخاب تمام آیتم‌ها
const items = document.querySelectorAll('.nav-item');
const megaMenus = document.querySelectorAll('.mega-menu');

items.forEach(item => {
  item.addEventListener('mouseenter', () => {
    const target = document.getElementById(item.dataset.menu);
    document.body.classList.add('menu-blur');
    megaMenus.forEach(m => m.classList.remove('active'));
    if (target) target.classList.add('active');
  });

  item.addEventListener('mouseleave', () => {
    document.body.classList.remove('menu-blur');
  });
});

megaMenus.forEach(menu => {
  menu.addEventListener('mouseleave', () => {
    document.body.classList.remove('menu-blur');
    menu.classList.remove('active');
  });
});
