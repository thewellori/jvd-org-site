// تغییر opacity هدر هنگام اسکرول
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    let scrollPos = window.scrollY;
    header.style.opacity = 1 - scrollPos / 600;
});

// انیمیشن Hover روی خدمات
const serviceItems = document.querySelectorAll('.service-item');

serviceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.05)';
        item.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
    });
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
        item.style.boxShadow = 'none';
    });
});
// sticky navbar: اضافه/حذف کلاس وقتی اسکرول انجام میشه
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// موبایل — باز/بسته کردن منو
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle?.addEventListener('click', () => {
  menu.classList.toggle('show');
});
