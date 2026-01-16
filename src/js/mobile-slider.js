/**
 * Awwwards-style мобильный слайдер
 * Плавная прокрутка с инерцией и snap эффектом
 */

(function() {
  'use strict';

  const CONFIG = {
    // Размеры и отступы
    SLIDE_WIDTH_PERCENT: 85,
    GAP: 16,
    PADDING: 16,
    
    // Физика инерции
    FRICTION: 0.92,
    VELOCITY_MULTIPLIER: 0.8,
    MIN_VELOCITY: 0.5,
    
    // Snap настройки
    SNAP_THRESHOLD: 0.3,
    SNAP_DURATION: 450,
    
    // Touch настройки
    DIRECTION_LOCK_THRESHOLD: 10,
  };

  const isMobile = () => window.innerWidth <= 460;

  let container = null;
  let wrapper = null;
  let slides = [];
  let slideWidth = 0;
  let maxScroll = 0;
  let currentX = 0;
  let targetX = 0;
  let velocity = 0;
  let isAnimating = false;
  let animationId = null;

  // Touch state
  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let lastTouchX = 0;
  let lastTouchTime = 0;
  let isDragging = false;
  let isHorizontalSwipe = null;
  let startScrollX = 0;

  function init() {
    if (!isMobile()) {
      destroy();
      return;
    }

    container = document.querySelector('#wsls .slider-track');
    wrapper = container ? container.querySelector('.slider-wrapper') : null;
    slides = wrapper ? Array.from(wrapper.querySelectorAll('.slide')) : [];

    if (!container || !wrapper || slides.length === 0) {
      setTimeout(init, 200);
      return;
    }

    applyStyles();
    calculateDimensions();
    setupEventListeners();
    
    console.log('[MobileSlider] Initialized');
  }

  function destroy() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    removeEventListeners();
    clearStyles();
  }

  function applyStyles() {
    // Container styles
    container.style.cssText = `
      width: 100% !important;
      overflow: hidden !important;
      position: relative !important;
      touch-action: pan-y !important;
    `;

    // Wrapper styles - без gap, используем margin-right на слайдах
    wrapper.style.cssText = `
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      gap: 0 !important;
      padding: 0 ${CONFIG.PADDING}px !important;
      will-change: transform !important;
      transform: translate3d(0, 0, 0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
      perspective: 1000px !important;
      -webkit-perspective: 1000px !important;
    `;

    // Slide styles
    const slideWidthCalc = `calc(${CONFIG.SLIDE_WIDTH_PERCENT}vw - ${CONFIG.PADDING}px)`;
    const slideHeight = '420px'; // Фиксированная высота слайда
    
    slides.forEach((slide, index) => {
      const isLast = index === slides.length - 1;
      slide.style.cssText = `
        flex: 0 0 ${slideWidthCalc} !important;
        width: ${slideWidthCalc} !important;
        min-width: ${slideWidthCalc} !important;
        max-width: ${slideWidthCalc} !important;
        height: ${slideHeight} !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        margin-left: 0 !important;
        margin-right: ${isLast ? '0' : CONFIG.GAP + 'px'} !important;
        padding: 0 !important;
        transform-origin: center center !important;
        will-change: transform !important;
        overflow: hidden !important;
      `;
      
      // Контейнер медиа - на всю площадь слайда
      const media = slide.querySelector('.slide-media');
      if (media) {
        media.style.cssText = `
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          overflow: hidden !important;
        `;
      }
      
      // Изображения - cover для заполнения
      const img = slide.querySelector('img');
      if (img) {
        img.style.cssText = `
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          object-fit: cover !important;
          object-position: center !important;
        `;
      }
      
      const picture = slide.querySelector('picture');
      if (picture) {
        picture.style.cssText = `
          width: 100% !important;
          height: 100% !important;
          display: block !important;
        `;
        // Также img внутри picture
        const picImg = picture.querySelector('img');
        if (picImg) {
          picImg.style.cssText = `
            width: 100% !important;
            height: 100% !important;
            display: block !important;
            object-fit: cover !important;
            object-position: center !important;
          `;
        }
      }
    });
  }

  function clearStyles() {
    if (container) container.style.cssText = '';
    if (wrapper) wrapper.style.cssText = '';
    slides.forEach(slide => {
      slide.style.cssText = '';
      const media = slide.querySelector('.slide-media');
      if (media) media.style.cssText = '';
      const img = slide.querySelector('img');
      if (img) img.style.cssText = '';
      const picture = slide.querySelector('picture');
      if (picture) picture.style.cssText = '';
    });
  }

  function calculateDimensions() {
    if (!slides.length) return;
    
    const containerWidth = container.offsetWidth;
    // Ширина одного слайда (без margin)
    const singleSlideWidth = (window.innerWidth * CONFIG.SLIDE_WIDTH_PERCENT / 100) - CONFIG.PADDING;
    
    // Шаг между началами слайдов = ширина слайда + gap
    slideWidth = singleSlideWidth + CONFIG.GAP;
    
    // Общая ширина контента:
    // padding-left + (все слайды с margins между ними) + padding-right
    // = padding + n*slideWidth + (n-1)*gap + padding
    // = 2*padding + n*singleSlideWidth + (n-1)*gap
    const totalWidth = CONFIG.PADDING * 2 + (singleSlideWidth * slides.length) + (CONFIG.GAP * (slides.length - 1));
    maxScroll = Math.max(0, totalWidth - containerWidth);
    
    console.log('[MobileSlider] slideWidth:', slideWidth, 'maxScroll:', maxScroll, 'containerWidth:', containerWidth);
  }

  function setupEventListeners() {
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });
    
    window.addEventListener('resize', onResize);
  }

  function removeEventListeners() {
    if (container) {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    }
    window.removeEventListener('resize', onResize);
  }

  function onTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchCurrentX = touchStartX;
    lastTouchX = touchStartX;
    lastTouchTime = Date.now();
    startScrollX = currentX;
    isDragging = true;
    isHorizontalSwipe = null;
    velocity = 0;

    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
      isAnimating = false;
    }
    
    // Отключаем FX loop во время драга для производительности
    if (wrapper) {
      wrapper.style.willChange = 'transform';
    }
  }

  function onTouchMove(e) {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (isHorizontalSwipe === null && (absDeltaX > CONFIG.DIRECTION_LOCK_THRESHOLD || absDeltaY > CONFIG.DIRECTION_LOCK_THRESHOLD)) {
      isHorizontalSwipe = absDeltaX > absDeltaY;
    }

    if (isHorizontalSwipe) {
      e.preventDefault();

      touchCurrentX = touch.clientX;
      
      const now = Date.now();
      const dt = now - lastTouchTime;
      if (dt > 0) {
        velocity = (touchCurrentX - lastTouchX) / dt * 15;
      }
      lastTouchX = touchCurrentX;
      lastTouchTime = now;

      let newX = startScrollX - deltaX;
      
      // Резиновый эффект на границах
      if (newX < 0) {
        newX = newX * 0.3;
      } else if (newX > maxScroll) {
        newX = maxScroll + (newX - maxScroll) * 0.3;
      }

      currentX = newX;
      setTransform(currentX);
    }
  }

  function onTouchEnd() {
    if (!isDragging) return;
    isDragging = false;

    if (!isHorizontalSwipe) return;

    const deltaX = touchCurrentX - touchStartX;
    const absDeltaX = Math.abs(deltaX);
    const absVelocity = Math.abs(velocity);

    let targetSlide = Math.round(currentX / slideWidth);
    
    if (absVelocity > 2 || absDeltaX > slideWidth * CONFIG.SNAP_THRESHOLD) {
      if (velocity < 0 || deltaX < 0) {
        targetSlide = Math.ceil(currentX / slideWidth);
      } else {
        targetSlide = Math.floor(currentX / slideWidth);
      }
    }

    targetSlide = Math.max(0, Math.min(slides.length - 1, targetSlide));
    targetX = targetSlide * slideWidth;
    targetX = Math.max(0, Math.min(maxScroll, targetX));

    // Восстанавливаем will-change после драга
    if (wrapper) {
      wrapper.style.willChange = 'transform';
    }

    if (absVelocity > CONFIG.MIN_VELOCITY) {
      animateWithMomentum();
    } else {
      animateToTarget();
    }
  }

  function animateWithMomentum() {
    isAnimating = true;

    function step() {
      if (!isAnimating) return;

      velocity *= CONFIG.FRICTION;
      currentX -= velocity * CONFIG.VELOCITY_MULTIPLIER;

      // Резиновый эффект
      if (currentX < 0) {
        currentX *= 0.85;
        velocity *= 0.5;
      } else if (currentX > maxScroll) {
        currentX = maxScroll + (currentX - maxScroll) * 0.85;
        velocity *= 0.5;
      }

      setTransform(currentX);

      if (Math.abs(velocity) < CONFIG.MIN_VELOCITY) {
        snapToNearestSlide();
        return;
      }

      animationId = requestAnimationFrame(step);
    }

    animationId = requestAnimationFrame(step);
  }

  function snapToNearestSlide() {
    let targetSlide = Math.round(currentX / slideWidth);
    targetSlide = Math.max(0, Math.min(slides.length - 1, targetSlide));
    targetX = targetSlide * slideWidth;
    targetX = Math.max(0, Math.min(maxScroll, targetX));
    
    animateToTarget();
  }

  function animateToTarget() {
    isAnimating = true;
    const startX = currentX;
    const distance = targetX - startX;
    const startTime = Date.now();

    function step() {
      if (!isAnimating) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / CONFIG.SNAP_DURATION, 1);
      
      // Easing (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      currentX = startX + distance * eased;
      setTransform(currentX);

      if (progress < 1) {
        animationId = requestAnimationFrame(step);
      } else {
        currentX = targetX;
        setTransform(currentX);
        isAnimating = false;
        animationId = null;
      }
    }

    animationId = requestAnimationFrame(step);
  }

  function setTransform(x) {
    if (wrapper) {
      // Округляем для избежания subpixel рендеринга и дрожания
      const roundedX = Math.round(-x * 100) / 100;
      // Используем translate3d для аппаратного ускорения
      wrapper.style.transform = `translate3d(${roundedX}px, 0, 0)`;
    }
  }


  function onResize() {
    if (!isMobile()) {
      destroy();
      return;
    }
    
    calculateDimensions();
    currentX = Math.max(0, Math.min(maxScroll, currentX));
    targetX = currentX;
    setTransform(currentX);
  }

  // Инициализация
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  // Переинициализация при resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (isMobile() && !container) {
        init();
      }
    }, 150);
  });
})();
