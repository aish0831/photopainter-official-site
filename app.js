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
      ['kids-art', '儿童手绘创意'],
      ['travel-beijing', '故宫旅行纪念'],
      ['couple-surprise', '异地情侣留言'],
      ['luggage-tag', '旅行行李牌'],
      ['wall-art', '墙面艺术挂画']
    ];
    const original = gallery.querySelector('[data-original]');
    const screen = gallery.querySelector('[data-screen]');
    const indexText = gallery.querySelector('[data-index]');
    const dots = [...gallery.querySelectorAll('.gallery-dots button')];
    let current = 0;
    const show = index => {
      current = (index + works.length) % works.length;
      const [file, label] = works[current];
      original.src = `assets/scenarios/${file}-original.png`;
      original.alt = `${label}的 AI 生成输入图像`;
      screen.src = `assets/scenarios/${file}-screen.png`;
      screen.alt = `${label}的六色圆屏软件输出`;
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
