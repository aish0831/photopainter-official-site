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
