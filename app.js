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

  const setupContentGallery = ({ rootSelector, items, imageSelector, kickerSelector, titleSelector, copySelector, indexSelector, prevSelector, nextSelector, dotsSelector, badgeSelector = null, noteSelector = null, voiceSelector = null, autoplay = 0 }) => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const image = root.querySelector(imageSelector);
    const kicker = root.querySelector(kickerSelector);
    const title = root.querySelector(titleSelector);
    const copy = root.querySelector(copySelector);
    const indexText = root.querySelector(indexSelector);
    const badge = badgeSelector ? root.querySelector(badgeSelector) : null;
    const note = noteSelector ? root.querySelector(noteSelector) : null;
    const voice = voiceSelector ? root.querySelector(voiceSelector) : null;
    const dots = [...root.querySelectorAll(dotsSelector)];
    let current = 0;
    let timer;
    let pending;
    let transitionToken = 0;
    items.forEach(item => { const preload = new Image(); preload.src = item.image; });
    const show = index => {
      current = (index + items.length) % items.length;
      const item = items[current];
      const token = ++transitionToken;
      window.clearTimeout(pending);
      root.classList.add('is-switching');
      pending = window.setTimeout(() => {
        if (token !== transitionToken) return;
        image.src = item.image;
        image.alt = item.alt;
        kicker.textContent = item.kicker;
        title.textContent = '';
        item.title.split('|').forEach((line, i) => {
          if (i) title.append(document.createElement('br'));
          title.append(document.createTextNode(line));
        });
        copy.textContent = item.copy;
        if (badge) badge.textContent = item.badge || '';
        if (note) note.textContent = item.note || '产品生活场景构想 · 非实体产品实拍';
        if (voice) voice.hidden = !item.voice;
        indexText.textContent = String(current + 1).padStart(2, '0');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === current);
          dot.setAttribute('aria-pressed', String(i === current));
        });
        image.decode?.().catch(() => {}).finally(() => { if (token === transitionToken) root.classList.remove('is-switching'); });
      }, reducedMotion ? 0 : 140);
    };
    const restart = () => {
      if (!autoplay || reducedMotion) return;
      window.clearInterval(timer);
      timer = window.setInterval(() => show(current + 1), autoplay);
    };
    const manualShow = index => { show(index); restart(); };
    root.querySelector(prevSelector)?.addEventListener('click', () => manualShow(current - 1));
    root.querySelector(nextSelector)?.addEventListener('click', () => manualShow(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => manualShow(i)));
    root.addEventListener('mouseenter', () => window.clearInterval(timer));
    root.addEventListener('mouseleave', restart);
    root.addEventListener('focusin', () => window.clearInterval(timer));
    root.addEventListener('focusout', restart);
    document.addEventListener('visibilitychange', () => document.hidden ? window.clearInterval(timer) : restart());
    restart();
  };

  setupContentGallery({
    rootSelector: '[data-scene-gallery]', imageSelector: '[data-scene-image]', kickerSelector: '[data-scene-kicker]', titleSelector: '[data-scene-title]', copySelector: '[data-scene-copy]', indexSelector: '[data-scene-index]', prevSelector: '[data-scene-prev]', nextSelector: '[data-scene-next]', dotsSelector: '.scene-dots button', noteSelector: '[data-scene-note]', autoplay: 6500,
    items: [
      { image: 'assets/lifestyle/album-living-room.webp', alt: '完整电子相册摆放在客厅边柜上的生活场景概念图', kicker: 'HOME ALBUM · 客厅相册', title: '旅行回来，|照片不再沉睡。', copy: '完整的相册外框、支架与故宫旅行画面一起摆在边柜上，像家中的一本常翻常新的相册。' },
      { image: 'assets/lifestyle/child-voice-imagination.webp', alt: '四岁小朋友对着无背光电子纸相册说出大卡车想法的生活场景概念图', kicker: 'KIDS VOICE · 所问即所见', title: '不会打字也没关系，|把想法直接说出来。', copy: '2–6 岁的小朋友表达还不准确，却有很多奇妙问题：“我想要一辆大卡车”“什么是大海？”这是儿童语音交互体验构想：未来可把说出的想法变成眼前的画。屏幕无背光，借自然光反射，适合安静观看。', note: '儿童语音交互体验构想 · 非当前已实现功能 · 非实体实拍' },
      { image: 'assets/lifestyle/backpack-subway.webp', alt: '成年女大学生在地铁背着带有方形电子纸挂件的书包概念图', kicker: 'BAG CHARM · 地铁通勤', title: '背在身上，|把喜欢带去远方。', copy: '小巧的完整挂件通过挂环连接书包，让可爱的熊猫图案成为通勤穿搭里安静又特别的细节。' },
      { image: 'assets/lifestyle/luggage-airport.webp', alt: '方形电子纸挂件连接旅行箱并出现在机场行李提取区的概念图', kicker: 'TRAVEL TAG · 旅行识别', title: '相似的行李中，|一眼看见自己的。', copy: '方形挂件通过金属扣与织带连接旅行箱，个性画面与完整产品结构在真实旅行环境中清楚可见。' },
      { image: 'assets/lifestyle/wall-art-home.webp', alt: '完整矩形电子纸艺术画框挂在现代客厅墙面的生活场景概念图', kicker: 'WALL ART · 客厅艺术', title: '让一面墙，|每天都有新的情绪。', copy: '完整的窄边画框、人物花卉作品与客厅尺度一起出现，让电子纸更像家中的一幅安静艺术品。' }
    ]
  });

  setupContentGallery({
    rootSelector: '[data-creation-gallery]', imageSelector: '[data-creation-image]', kickerSelector: '[data-creation-kicker]', titleSelector: '[data-creation-title]', copySelector: '[data-creation-copy]', indexSelector: '[data-creation-index]', prevSelector: '[data-creation-prev]', nextSelector: '[data-creation-next]', dotsSelector: '.creation-dots button', badgeSelector: '[data-creation-badge]', voiceSelector: '[data-creation-voice]', autoplay: 5600,
    items: [
      { image: 'assets/product-studio.webp', alt: '上传照片后按照创意进行修改的实际创作界面', kicker: '01 · 上传图片创意修改', title: '保留熟悉的人，|换一种想象。', copy: '上传一张喜欢的照片，用一句创意描述改变画风、背景或氛围，再确认效果。', badge: '实际运行界面' },
      { image: 'assets/creation-text-prompt.webp', alt: '通过文字描述创意生成的可爱儿童想象图', kicker: '02 · 文字描述生成图片', title: '从一句描述，|长出一幅新画。', copy: '没有现成照片也可以开始。描述人物、动物、地方或气氛，让文字变成可以收藏和展示的图像。', badge: '软件生成示例' },
      { image: 'assets/creation-text-prompt.webp', alt: '语音表达转成创意并生成图片的流程示意', kicker: '03 · 语音表达生成图片', title: '说给它听，|让不会打字的想法被看见。', copy: '适合还不会准确打字的孩子，也适合双手正忙的时候。语音先转成创意描述，再生成可见的画面。', badge: '语音交互体验构想 · 非当前实录', voice: true },
      { image: 'assets/creation-travel-batch.webp', alt: '旅行照片一键批量处理并用于相册展示的体验构想示例', kicker: '04 · 旅行照片一键批量处理', title: '一趟旅行，|不必一张张慢慢整理。', copy: '选择一组旅行照片，一次完成统一风格处理与构图整理，再挑选喜欢的作品直接用于相册展示。', badge: '批量体验构想 · 非当前实录' }
    ]
  });

  setupContentGallery({
    rootSelector: '[data-feature-gallery]', imageSelector: '[data-feature-image]', kickerSelector: '[data-feature-kicker]', titleSelector: '[data-feature-title]', copySelector: '[data-feature-copy]', indexSelector: '[data-feature-index]', prevSelector: '[data-feature-prev]', nextSelector: '[data-feature-next]', dotsSelector: '.feature-dots button',
    items: [
      { image: 'assets/product-studio.webp', alt: 'PhotoPainter 创作工作台实际界面', kicker: '创作工作台', title: '在呈现之前，|先看见它的样子。', copy: '导入照片、尝试不同风格、调整构图并预览最终效果，整个创作过程清晰地留在同一个界面里。' },
      { image: 'assets/product-library.webp', alt: 'PhotoPainter 作品收藏实际界面', kicker: '作品收藏', title: '喜欢的每一次创作，|都在身边。', copy: '浏览、管理并再次呈现过去的作品，让旅行、家人和宠物照片随时重新来到眼前。' },
      { image: 'assets/product-notes.webp', alt: 'PhotoPainter 每日便签实际界面', kicker: '每日便签', title: '不只展示照片，|也留下一句话。', copy: '把提醒、问候或当天的心情，变成桌面上安静的一页，和喜欢的图片轮流陪伴你。' },
      { image: 'assets/product-mobile.webp', alt: 'PhotoPainter 移动端实际界面', kicker: '移动使用', title: '拿起手机，|随时换一幅喜欢的画。', copy: '手机上的界面保持简洁，选作品、看状态、换内容，不必把所有复杂设置铺在眼前。' }
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
