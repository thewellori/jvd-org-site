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