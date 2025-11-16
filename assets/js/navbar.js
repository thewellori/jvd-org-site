const nav = document.querySelector('.apple-navbar');
const navContainer = document.querySelector('.nav-container');
const items = document.querySelectorAll('.nav-item');
const megaMenus = document.querySelectorAll('.mega-menu');

let activeMenu = null;

// -------------------------------
// 🟣 Hover Desktop Logic
// -------------------------------
items.forEach(item => {
  const id = item.dataset.menu;
  const target = document.getElementById(id);

  item.addEventListener('mouseenter', () => {
    document.body.classList.add('menu-blur');

    // سوییچ بین مگامنوها بدون خاموش کردن blur
    megaMenus.forEach(m => m.classList.remove('active'));
    if (target) {
      target.classList.add('active');
      activeMenu = target;
    }
  });
});

// 🟣 نگه داشتن blur تا وقتی موس داخل navbar یا مگا منو باشد
nav.addEventListener('mouseleave', () => {
  // اگر وارد mega menu نشود blur خاموش می‌شود
  setTimeout(() => {
    if (!document.querySelector('.mega-menu:hover') &&
        !document.querySelector('.apple-navbar:hover')) {
      document.body.classList.remove('menu-blur');
      megaMenus.forEach(m => m.classList.remove('active'));
      activeMenu = null;
    }
  }, 80);
});

// -------------------------------
// 🟣 Mega Menu Hover Behavior
// -------------------------------
megaMenus.forEach(menu => {
  menu.addEventListener('mouseenter', () => {
    document.body.classList.add('menu-blur');
    menu.classList.add('active');
  });

  menu.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!document.querySelector('.apple-navbar:hover')) {
        document.body.classList.remove('menu-blur');
        megaMenus.forEach(m => m.classList.remove('active'));
        activeMenu = null;
      }
    }, 80);
  });
});

// -------------------------------
// 🟣 Scroll — شیشه‌ای شدن navbar
// -------------------------------
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

/* گرفتن رنگ‌های LED از سکشن فعال */
const sections = document.querySelectorAll("section");
const menu = document.querySelector("nav");

const setDynamicLED = (colors) => {
  document.documentElement.style.setProperty("--led1", colors[0]);
  document.documentElement.style.setProperty("--led2", colors[1]);
  document.documentElement.style.setProperty("--led3", colors[2]);
};

const colorThemes = {
  home:      ["#00eaff", "#0077ff", "#00ffaa"],
  services:  ["#ff6bcb", "#b400ff", "#ff00aa"],
  about:     ["#ffaa00", "#ff5500", "#ff8800"],
  contact:   ["#33ffcc", "#009977", "#00ffaa"]
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (colorThemes[id]) {
          setDynamicLED(colorThemes[id]);
        }
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(sec => observer.observe(sec));
:root {
  --led1: #ff00aa;
  --led2: #7700ff;
  --led3: #00eaff;
}
