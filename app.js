(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const setMenuState = open => {
    nav?.classList.toggle('open', open);
    nav?.toggleAttribute('inert', !open && window.matchMedia('(max-width: 900px)').matches);
    menuButton?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  const closeMenu = () => {
    const wasOpen = menuButton?.getAttribute('aria-expanded') === 'true';
    setMenuState(false);
    if (wasOpen) menuButton?.focus();
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    setMenuState(open);
    if (open) nav.querySelector('a')?.focus();
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  const menuMedia = window.matchMedia('(max-width: 900px)');
  const syncMenuAccessibility = () => {
    if (menuMedia.matches) setMenuState(false);
    else {
      nav?.removeAttribute('inert');
      nav?.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };
  menuMedia.addEventListener?.('change', syncMenuAccessibility);
  syncMenuAccessibility();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(item => item.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(item => observer.observe(item));
  }

  const gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    const works = [
      { original: 'assets/scenarios/kids-art-original.png', screen: 'assets/scenarios/kids-art-screen.png', label: '儿童手绘圆形吧唧', shape: 'round' },
      { original: 'assets/scenarios/travel-beijing-original.png', screen: 'assets/scenarios-v2/travel-beijing-rect-screen.png', label: '故宫旅行矩形相册', shape: 'rect' },
      { original: 'assets/scenarios-v2/college-student-album-original.png', screen: 'assets/scenarios-v2/college-student-album-screen.png', label: '真人女大学生矩形相册', shape: 'rect' },
      { original: 'assets/scenarios/luggage-tag-original.png', screen: 'assets/scenarios-v2/luggage-tag-rect-screen.png', label: '方形旅行行李牌', shape: 'rect' },
      { original: 'assets/scenarios/wall-art-original.png', screen: 'assets/scenarios-v2/wall-art-rect-screen.png', label: '矩形墙面艺术挂画', shape: 'rect' }
    ];
    const original = gallery.querySelector('[data-original]');
    const screen = gallery.querySelector('[data-screen]');
    const outputMat = gallery.querySelector('[data-output-mat]');
    const indexText = gallery.querySelector('[data-index]');
    const dots = [...gallery.querySelectorAll('.gallery-dots button')];
    let current = 0;
    const show = index => {
      current = (index + works.length) % works.length;
      const work = works[current];
      original.src = work.original;
      original.alt = `${work.label}的 AI 生成输入图像`;
      screen.src = work.screen;
      screen.alt = `${work.label}的六色软件输出`;
      outputMat.classList.toggle('is-round', work.shape === 'round');
      outputMat.classList.toggle('is-rect', work.shape === 'rect');
      indexText.textContent = String(current + 1).padStart(2, '0');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        dot.setAttribute('aria-pressed', String(i === current));
      });
    };
    gallery.querySelector('[data-prev]').addEventListener('click', () => show(current - 1));
    gallery.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  }

  const setupContentGallery = ({ rootSelector, items, imageSelector, kickerSelector, titleSelector, copySelector, indexSelector, prevSelector, nextSelector, dotsSelector }) => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const image = root.querySelector(imageSelector);
    const kicker = root.querySelector(kickerSelector);
    const title = root.querySelector(titleSelector);
    const copy = root.querySelector(copySelector);
    const indexText = root.querySelector(indexSelector);
    const dots = [...root.querySelectorAll(dotsSelector)];
    let current = 0;
    const show = index => {
      current = (index + items.length) % items.length;
      const item = items[current];
      image.src = item.image;
      image.alt = item.alt;
      kicker.textContent = item.kicker;
      title.innerHTML = item.title;
      copy.textContent = item.copy;
      indexText.textContent = String(current + 1).padStart(2, '0');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        dot.setAttribute('aria-pressed', String(i === current));
      });
    };
    root.querySelector(prevSelector)?.addEventListener('click', () => show(current - 1));
    root.querySelector(nextSelector)?.addEventListener('click', () => show(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  };

  setupContentGallery({
    rootSelector: '[data-scene-gallery]', imageSelector: '[data-scene-image]', kickerSelector: '[data-scene-kicker]', titleSelector: '[data-scene-title]', copySelector: '[data-scene-copy]', indexSelector: '[data-scene-index]', prevSelector: '[data-scene-prev]', nextSelector: '[data-scene-next]', dotsSelector: '.scene-dots button',
    items: [
      { image: 'assets/lifestyle/album-living-room.webp', alt: '完整电子相册摆放在客厅边柜上的生活场景概念图', kicker: 'HOME ALBUM · 客厅相册', title: '旅行回来，<br>照片不再沉睡。', copy: '完整的相册外框、支架与故宫旅行画面一起摆在边柜上，像家中的一本常翻常新的相册。' },
      { image: 'assets/lifestyle/backpack-subway.webp', alt: '成年女大学生在地铁背着带有方形电子纸挂件的书包概念图', kicker: 'BAG CHARM · 地铁通勤', title: '背在身上，<br>把喜欢带去远方。', copy: '小巧的完整挂件通过挂环连接书包，让可爱的熊猫图案成为通勤穿搭里安静又特别的细节。' },
      { image: 'assets/lifestyle/luggage-airport.webp', alt: '方形电子纸挂件连接旅行箱并出现在机场行李提取区的概念图', kicker: 'TRAVEL TAG · 旅行识别', title: '相似的行李中，<br>一眼看见自己的。', copy: '方形挂件通过金属扣与织带连接旅行箱，个性画面与完整产品结构在真实旅行环境中清楚可见。' },
      { image: 'assets/lifestyle/wall-art-home.webp', alt: '完整矩形电子纸艺术画框挂在现代客厅墙面的生活场景概念图', kicker: 'WALL ART · 客厅艺术', title: '让一面墙，<br>每天都有新的情绪。', copy: '完整的窄边画框、人物花卉作品与客厅尺度一起出现，让电子纸更像家中的一幅安静艺术品。' }
    ]
  });

  setupContentGallery({
    rootSelector: '[data-feature-gallery]', imageSelector: '[data-feature-image]', kickerSelector: '[data-feature-kicker]', titleSelector: '[data-feature-title]', copySelector: '[data-feature-copy]', indexSelector: '[data-feature-index]', prevSelector: '[data-feature-prev]', nextSelector: '[data-feature-next]', dotsSelector: '.feature-dots button',
    items: [
      { image: 'assets/product-studio.png', alt: 'PhotoPainter 创作工作台实际界面', kicker: '创作工作台', title: '在呈现之前，<br>先看见它的样子。', copy: '导入照片、尝试不同风格、调整构图并预览最终效果，整个创作过程清晰地留在同一个界面里。' },
      { image: 'assets/product-library.png', alt: 'PhotoPainter 作品收藏实际界面', kicker: '作品收藏', title: '喜欢的每一次创作，<br>都在身边。', copy: '浏览、管理并再次呈现过去的作品，让旅行、家人和宠物照片随时重新来到眼前。' },
      { image: 'assets/product-notes.png', alt: 'PhotoPainter 每日便签实际界面', kicker: '每日便签', title: '不只展示照片，<br>也留下一句话。', copy: '把提醒、问候或当天的心情，变成桌面上安静的一页，和喜欢的图片轮流陪伴你。' },
      { image: 'assets/product-mobile.png', alt: 'PhotoPainter 移动端实际界面', kicker: '移动使用', title: '拿起手机，<br>随时换一幅喜欢的画。', copy: '手机上的界面保持简洁，选作品、看状态、换内容，不必把所有复杂设置铺在眼前。' }
    ]
  });

  document.querySelectorAll('.accordion button').forEach(button => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion button').forEach(other => other.setAttribute('aria-expanded', 'false'));
      button.setAttribute('aria-expanded', String(!open));
    });
  });

  const video = document.querySelector('#tour-video');
  const videoShell = video?.closest('.video-shell');
  const playButton = videoShell?.querySelector('.video-play');
  playButton?.addEventListener('click', async () => {
    try {
      video.controls = true;
      await video.play();
      videoShell.classList.add('playing');
    } catch (_) {
      video.controls = true;
    }
  });
  video?.addEventListener('pause', () => { if (!video.ended) videoShell.classList.remove('playing'); });
  video?.addEventListener('play', () => videoShell.classList.add('playing'));
  video?.addEventListener('ended', () => videoShell.classList.remove('playing'));

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
