const nav = document.querySelector('.apple-navbar');
const items = document.querySelectorAll('.nav-item');
const megaMenus = document.querySelectorAll('.mega-menu');
const body = document.body;

// hover دسکتاپ / click موبایل
items.forEach(item => {
  const id = item.dataset.menu;
  const target = document.getElementById(id);

  // دسکتاپ hover
  item.addEventListener('mouseenter', () => {
    if(window.innerWidth > 900){
      body.classList.add('menu-blur');
      megaMenus.forEach(m => m.classList.remove('active'));
      if(target) target.classList.add('active');
    }
  });
  item.addEventListener('mouseleave', () => {
    if(window.innerWidth > 900){
      setTimeout(() => {
        if(!document.querySelector('.mega-menu:hover')){
          body.classList.remove('menu-blur');
          megaMenus.forEach(m => m.classList.remove('active'));
        }
      },50);
    }
  });

  // موبایل click
  item.addEventListener('click', () => {
    if(window.innerWidth <= 900 && target){
      target.classList.toggle('active');
    }
  });
});

// وقتی موس از مگامنو خارج شد
megaMenus.forEach(menu => {
  menu.addEventListener('mouseleave', () => {
    body.classList.remove('menu-blur');
    menu.classList.remove('active');
  });
  menu.addEventListener('mouseenter', () => {
    body.classList.add('menu-blur');
    menu.classList.add('active');
  });
});

// تغییر رنگ navbar روی اسکرول
window.addEventListener('scroll', () => {
  if(window.scrollY > 50){
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});
