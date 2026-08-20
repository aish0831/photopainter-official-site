(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const closeMenu = () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

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
      ['20260812-133831-24aed89a', '作品 1'],
      ['20260812-135700-a1047b0b', '作品 2'],
      ['20260812-152403-d70e5715', '作品 3']
    ];
    const original = gallery.querySelector('[data-original]');
    const screen = gallery.querySelector('[data-screen]');
    const indexText = gallery.querySelector('[data-index]');
    const dots = [...gallery.querySelectorAll('.gallery-dots button')];
    let current = 0;
    const show = index => {
      current = (index + works.length) % works.length;
      const [file, label] = works[current];
      original.src = `assets/artworks/${file}-original.png`;
      original.alt = `${label} 的原始照片`;
      screen.src = `assets/artworks/${file}-screen.png`;
      screen.alt = `${label} 的六色圆屏渲染`;
      indexText.textContent = String(current + 1).padStart(2, '0');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        dot.setAttribute('aria-selected', String(i === current));
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
