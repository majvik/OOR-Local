/**
 * ========================================
 * OOR PROJECT - MAIN JAVASCRIPT
 * ========================================
 * 
 * Главный файл JavaScript для проекта OOR (Out Of Records)
 * Содержит инициализацию всех компонентов и функциональности
 * 
 * @author OOR Development Team
 * @version 1.0.0
 * @since 2025-09-21
 * 
 * DEPENDENCIES:
 * - GSAP 3.x (анимации)
 * - Lenis (плавная прокрутка)
 * - MouseFollower (кастомный курсор)
 * 
 * FEATURES:
 * - Прелоадер с анимацией
 * - Плавная прокрутка (Lenis)
 * - Кастомный курсор
 * - Магнитные элементы
 * - Видео плеер
 * - Навигация
 * - Диагностика производительности
 */

/**
 * Инициализация при загрузке DOM
 * Выполняется сразу после загрузки HTML структуры
 */
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем загрузку GSAP
  if (typeof gsap === 'undefined') {
    console.error('[OOR] GSAP not loaded - some animations may not work');
    // Загружаем GSAP локально как fallback
    loadGSAPFallback();
  }

  // Безопасная инициализация с обработкой ошибок
  try {
    // Инициализация прелоадера
    initPreloader();
    // Страховка: гарантированно снимаем любые блокировки скролла
    installScrollUnlockWatchdog();
    // Диагностика блокировок скролла (включается при ?debug)
    installScrollDiagnostics();
  } catch (error) {
    console.error('[OOR] DOMContentLoaded error:', error);
    // Гарантированно снимаем блокировки при ошибке
    document.documentElement.classList.remove('preloader-active');
    document.body.classList.remove('preloader-active');
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
  }
});

/**
 * Загружает GSAP локально как fallback
 */
function loadGSAPFallback() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js';
  script.onload = function() {
    console.log('[OOR] GSAP loaded from fallback');
    // Перезапускаем инициализацию после загрузки GSAP
    if (typeof initPreloader === 'function') {
      initPreloader();
    }
  };
  script.onerror = function() {
    console.error('[OOR] Failed to load GSAP fallback');
  };
  document.head.appendChild(script);
}

// Инициализация после загрузки
window.addEventListener('load', function() {
  // Безопасная инициализация компонентов с обработкой ошибок
  try {
    // Инициализация компонентов
    initNavigation();
    initDynamicYear();
    initHeroVideo();
    initFullscreenVideo();
    initMagneticElements();
    initOrphanControl();
    
    // Диагностика: если ?nolenis — убедимся, что любые блокировки сняты
    const DISABLE_LENIS = (typeof window !== 'undefined') && window.location && (window.location.search.includes('nolenis') || window.location.search.includes('disablelenis'));
    if (DISABLE_LENIS) {
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
    }
  } catch (error) {
    console.error('[OOR] Window load error:', error);
    // Гарантированно снимаем блокировки при ошибке
    document.documentElement.classList.remove('preloader-active');
    document.body.classList.remove('preloader-active');
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
  }
});

// Preloader с реальной загрузкой
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const percentElement = document.getElementById('preloader-percent');
  
  if (!preloader || !percentElement) {
    // Если прелоадер отсутствует — гарантированно снимаем блокировки
    try {
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    } catch(_) {}
    return;
  }

  // Блокируем скролл страницы
  document.documentElement.classList.add('preloader-active');
  document.body.classList.add('preloader-active');

  let progress = 0;
  let loadedResources = 0;
  let totalResources = 0;
  
  // Список ресурсов для отслеживания загрузки
  const resourcesToLoad = [
    // Изображения
    '/public/assets/plus-large.svg',
    '/public/assets/plus-small.svg',
    '/public/assets/line-small.svg',
    '/public/assets/hero-bg.png',
    
    // Видео
    '/public/assets/OUTOFREC_reel_v4_nologo.mp4',
    
    // Шрифты
    '/public/fonts/pragmatica-book.ttf',
    '/public/fonts/pragmatica-book-oblique.ttf',
    '/public/fonts/pragmatica-extended-book.ttf',
    '/public/fonts/pragmatica-extended-book-oblique.ttf',
    '/public/fonts/pragmatica-extended-light.ttf',
    '/public/fonts/pragmatica-extended-light-oblique.ttf',
    '/public/fonts/pragmatica-extended-medium.ttf',
    '/public/fonts/pragmatica-extended-medium-oblique.ttf',
    '/public/fonts/pragmatica-extended-bold.ttf',
    '/public/fonts/pragmatica-extended-bold-oblique.ttf',
    '/public/fonts/pragmatica-extended-extralight.ttf',
    '/public/fonts/pragmatica-extended-extralight-oblique.ttf'
  ];

  // Ожидаемые CSS и JS файлы
  const expectedCssJsFiles = [
    '/src/css/reset.css',
    '/src/css/fonts.css',
    '/src/css/tokens.css',
    '/src/css/base.css',
    '/src/css/grid.css',
    '/src/css/layout.css',
    '/src/css/components.css',
    '/src/js/main.js'
  ];

  totalResources = resourcesToLoad.length + expectedCssJsFiles.length + 1; // +1 для DOM загрузки

  // Функция обновления прогресса
  function updateProgress() {
    // Ограничиваем прогресс максимум 100%
    const actualProgress = Math.min(loadedResources, totalResources);
    progress = Math.round((actualProgress / totalResources) * 100);
    percentElement.textContent = progress;

    console.log(`Preloader: ${loadedResources}/${totalResources} (${progress}%)`);

    if (loadedResources >= totalResources) {
      // Завершаем прелоадер сразу при достижении 100%
      hidePreloader();
    }
  }

  // Функция скрытия прелоадера
  function hidePreloader() {
    preloader.classList.add('hidden');
    document.documentElement.classList.remove('preloader-active');
    document.body.classList.remove('preloader-active');
    // На всякий случай сбрасываем инлайновые стили блокировки
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    
    // Удаляем прелоадер из DOM после анимации
    setTimeout(() => {
      preloader.remove();
      // Загружаем и инициализируем Lenis ПОСЛЕ полного удаления прелоадера
      try {
        const DISABLE_LENIS = (typeof window !== 'undefined') && window.location && (window.location.search.includes('nolenis') || window.location.search.includes('disablelenis'));
        if (DISABLE_LENIS) {
          if (window.location.search.includes('debug')) {
            console.log('[Lenis] disabled by query param');
          }
          return;
        }

        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1/bundled/lenis.min.js';
        s.async = true;
        s.onload = () => {
          try {
            if (window.Lenis && !window.lenis) {
              window.lenis = new window.Lenis({
                smoothWheel: true,
                smoothTouch: false,
                normalizeWheel: true,
                lerp: 0.09,
                wheelMultiplier: 1.0,
                duration: 1.0,
                easing: (t) => 1 - Math.pow(1 - t, 3),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                touchMultiplier: 2,
                infinite: false
              });
              if (window.location.search.includes('debug')) {
                try { console.log('[Lenis] init after preloader', { limit: window.lenis && window.lenis.limit }); } catch(_) {}
              }
            }
          } catch(e) { console.warn('Lenis init error', e); }
        };
        document.head.appendChild(s);
      } catch(e) { console.warn('Lenis load error', e); }
    }, 500);
  }

  // Функция загрузки ресурса
  function loadResource(url) {
    return new Promise((resolve, reject) => {
      // Определяем тип ресурса по расширению
      const isImage = /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url);
      const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
      const isFont = /\.(ttf|otf|woff|woff2)$/i.test(url);
      
      if (isImage) {
        const resource = new Image();
        resource.onload = () => {
          loadedResources++;
          updateProgress();
          resolve();
        };
        resource.onerror = () => {
          console.warn(`Failed to load image: ${url}`);
          loadedResources++;
          updateProgress();
          resolve();
        };
        resource.src = url;
      } else if (isVideo) {
        const resource = document.createElement('video');
        resource.oncanplaythrough = () => {
          loadedResources++;
          updateProgress();
          resolve();
        };
        resource.onerror = () => {
          console.warn(`Failed to load video: ${url}`);
          loadedResources++;
          updateProgress();
          resolve();
        };
        resource.src = url;
        resource.load();
      } else if (isFont) {
        // Для шрифтов используем FontFace API
        const fontName = url.split('/').pop().split('.')[0];
        const font = new FontFace(fontName, `url(${url})`);
        
        font.load().then(() => {
          loadedResources++;
          updateProgress();
          resolve();
        }).catch(() => {
          console.warn(`Failed to load font: ${url}`);
          loadedResources++;
          updateProgress();
          resolve();
        });
      } else {
        // Для других ресурсов используем fetch
        fetch(url)
          .then(response => {
            if (response.ok) {
              loadedResources++;
              updateProgress();
              resolve();
            } else {
              throw new Error(`HTTP ${response.status}`);
            }
          })
          .catch(error => {
            console.warn(`Failed to load resource: ${url}`, error);
            loadedResources++;
            updateProgress();
            resolve();
          });
      }
    });
  }

  // Загружаем все ресурсы
  const loadPromises = resourcesToLoad.map(url => loadResource(url));
  
  // Отслеживаем загрузку CSS и JS файлов через Performance API
  let checkedResources = new Set();
  
  function checkLoadedResources() {
    const performanceEntries = performance.getEntriesByType('resource');
    
    // Проверяем только ожидаемые CSS и JS файлы
    expectedCssJsFiles.forEach(expectedFile => {
      const foundEntry = performanceEntries.find(entry => 
        entry.name.includes(expectedFile) && !checkedResources.has(expectedFile)
      );
      
      if (foundEntry) {
        checkedResources.add(expectedFile);
        loadedResources++;
      }
    });
    
    updateProgress();
  }
  
  // Проверяем загруженные ресурсы через небольшие интервалы
  const checkInterval = setInterval(() => {
    checkLoadedResources();
    if (loadedResources >= totalResources) {
      clearInterval(checkInterval);
    }
  }, 100);
  
  // Также отслеживаем загрузку DOM (только один раз)
  let domLoaded = false;
  
  function checkDomLoad() {
    if (!domLoaded && document.readyState === 'complete') {
      domLoaded = true;
      loadedResources++;
      updateProgress();
    }
  }
  
  if (document.readyState === 'complete') {
    checkDomLoad();
  } else {
    window.addEventListener('load', checkDomLoad);
  }

  // Fallback таймаут (максимум 5 секунд)
  setTimeout(() => {
    if (loadedResources < totalResources) {
      console.warn('Preloader timeout, forcing completion');
      loadedResources = totalResources;
      updateProgress();
      // Дополнительно снимаем все блокировки — страховка для продакшна
      try {
        document.documentElement.classList.remove('preloader-active');
        document.body.classList.remove('preloader-active');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      } catch(_) {}
    }
  }, 5000);
  
  // Дополнительная проверка каждые 500ms
  const progressCheckInterval = setInterval(() => {
    if (loadedResources >= totalResources) {
      clearInterval(progressCheckInterval);
      hidePreloader();
    }
  }, 500);
}

// Навигация
function initNavigation() {
  const navLinks = document.querySelectorAll('.oor-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Navigation clicked:', this.textContent);
    });
  });
}

// Динамическая дата
function initDynamicYear() {
  const yearElement = document.querySelector('.oor-hero-year');
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = `©${currentYear}`;
  }
}

// Hero Video оптимизация
function initHeroVideo() {
  const video = document.querySelector('.oor-hero-video');
  if (!video) return;

  // Оптимизация загрузки
  video.addEventListener('loadstart', function() {
    console.log('Hero video: Начало загрузки');
  });

  video.addEventListener('canplay', function() {
    console.log('Hero video: Готово к воспроизведению');
    // Убираем fallback изображение когда видео готово
    const fallback = video.querySelector('div');
    if (fallback) {
      fallback.style.display = 'none';
    }
  });

  video.addEventListener('error', function(e) {
    console.warn('Hero video: Ошибка загрузки, используем fallback');
    // Показываем fallback изображение при ошибке
    const fallback = video.querySelector('div');
    if (fallback) {
      fallback.style.display = 'block';
    }
  });

  // Оптимизация производительности
  video.addEventListener('loadeddata', function() {
    // Принудительно запускаем воспроизведение
    video.play().catch(e => {
      console.warn('Hero video: Автовоспроизведение заблокировано', e);
    });
  });

  // Обработка видимости страницы для экономии ресурсов
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      video.pause();
    } else {
      video.play().catch(e => {
        console.warn('Hero video: Не удалось возобновить воспроизведение', e);
      });
    }
  });

  // Обработка изменения размера окна
  window.addEventListener('resize', function() {
    // Пересчитываем размеры видео при изменении размера окна
    video.style.width = '100%';
    video.style.height = '100%';
  });
}

// Полноэкранное видео
function initFullscreenVideo() {
  const heroVideoOverlay = document.getElementById('hero-video-overlay');
  const fullscreenVideo = document.getElementById('fullscreen-video');
  const fullscreenVideoElement = document.querySelector('.oor-fullscreen-video-element');
  const fullscreenClose = document.getElementById('fullscreen-close');
  const plusTopRight = document.querySelector('.oor-hero-plus-top-right');
  const plusIcon = plusTopRight.querySelector('img');

  if (!heroVideoOverlay || !fullscreenVideo || !fullscreenVideoElement || !fullscreenClose || !plusTopRight) {
    console.warn('Fullscreen video: Не найдены необходимые элементы');
    return;
  }

  // Клик по оверлею фонового видео открывает полноэкранное
  heroVideoOverlay.addEventListener('click', function() {
    openFullscreenVideo();
  });

  // Клик по plus иконке справа вверху открывает полноэкранное
  plusTopRight.addEventListener('click', function(e) {
    e.stopPropagation();
    openFullscreenVideo();
  });

  // Клик по кнопке закрытия закрывает полноэкранное
  fullscreenClose.addEventListener('click', function() {
    closeFullscreenVideo();
  });

  // Клик по фону закрывает полноэкранное
  fullscreenVideo.addEventListener('click', function(e) {
    if (e.target === fullscreenVideo) {
      closeFullscreenVideo();
    }
  });

  // ESC закрывает полноэкранное
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && fullscreenVideo.classList.contains('active')) {
      closeFullscreenVideo();
    }
  });

  function openFullscreenVideo() {
    // Показываем полноэкранное видео
    fullscreenVideo.classList.add('active');
    
    // Блокируем скролл страницы
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Запускаем видео
    fullscreenVideoElement.play();
    
    // Анимируем иконку закрытия через CSS класс
    fullscreenClose.classList.add('active');
    
    console.log('Fullscreen video: Открыто');
  }

  function closeFullscreenVideo() {
    // Останавливаем видео
    fullscreenVideoElement.pause();
    fullscreenVideoElement.currentTime = 0;
    
    // Скрываем полноэкранное видео
    fullscreenVideo.classList.remove('active');
    
    // Разблокируем скролл страницы
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // Возвращаем иконку в исходное состояние через CSS класс
    fullscreenClose.classList.remove('active');
    
    console.log('Fullscreen video: Закрыто');
  }
}

// Глобальная страховка от зависшей блокировки скролла (Netlify кейс)
function installScrollUnlockWatchdog() {
  let unlockedOnce = false;

  function unlockScroll(reason) {
    if (unlockedOnce) return;
    unlockedOnce = true;
    try {
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    } catch(_) {}
    // Удаляем слушатели, чтобы не держать ссылки
    window.removeEventListener('load', onLoadUnlock);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('pointerdown', onFirstInteract, { capture: true });
    document.removeEventListener('wheel', onFirstInteract, { capture: true });
    document.removeEventListener('keydown', onFirstInteract, { capture: true });
  }

  function onLoadUnlock(){
    // Даем время Netlify подгрузить ассеты, затем снимаем блокировки
    setTimeout(() => unlockScroll('load-timeout'), 1200);
  }

  function onVisibility(){
    if (!document.hidden) setTimeout(() => unlockScroll('visibility'), 600);
  }

  function onFirstInteract(){
    unlockScroll('first-interaction');
  }

  // Подстраховываемся по нескольким событиям
  window.addEventListener('load', onLoadUnlock, { once: true });
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('pointerdown', onFirstInteract, { capture: true, once: true });
  document.addEventListener('wheel', onFirstInteract, { capture: true, once: true });
  document.addEventListener('keydown', onFirstInteract, { capture: true, once: true });
}

// Магнетизм для кликабельных элементов
function initMagneticElements() {
  const magneticElements = document.querySelectorAll(`
    .oor-fullscreen-close,
    .oor-btn-small,
    .oor-logo,
    .oor-social-icon,
    .oor-manifesto-button,
    .oor-become-artist-button,
    .oor-challenge-2-music-icon,
    .oor-challenge-2-good-works-icon,
    .oor-events-sold-out,
    .oor-events-buy-ticket,
    .oor-merch-button
  `);

  magneticElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.addEventListener('mousemove', handleMouseMove);
    });

    element.addEventListener('mouseleave', function() {
      this.removeEventListener('mousemove', handleMouseMove);
      // Возвращаем элемент в исходное положение
      this.style.setProperty('--mouse-x', '0px');
      this.style.setProperty('--mouse-y', '0px');
    });
  });

  function handleMouseMove(e) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Рассчитываем смещение относительно центра элемента
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    // Ограничиваем смещение 16 пикселями
    const maxDistance = 16;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    let offsetX = deltaX;
    let offsetY = deltaY;
    
    if (distance > maxDistance) {
      // Если расстояние больше максимума, нормализуем вектор
      offsetX = (deltaX / distance) * maxDistance;
      offsetY = (deltaY / distance) * maxDistance;
    }
    
    // Применяем смещение через CSS переменные
    element.style.setProperty('--mouse-x', `${offsetX}px`);
    element.style.setProperty('--mouse-y', `${offsetY}px`);
  }
}

// Контроль висячих строк (orphans)
function initOrphanControl() {
  // Селекторы для текстовых элементов, где нужно контролировать висячие строки
  const textSelectors = [
    'p',
    '.oor-musical-association-text',
    '.oor-challenge-title',
    '.oor-without-fear-text',
    '.oor-quality-title',
    '.oor-out-of-talk-description',
    '.oor-events-description',
    '.oor-merch-description'
  ];
  
  textSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      preventOrphans(element);
    });
  });
}

// === Диагностика блокировок скролла (активна только с ?debug) ===
function installScrollDiagnostics() {
  try {
    const DEBUG = (typeof window !== 'undefined') && window.location && window.location.search.includes('debug');
    if (!DEBUG) return;

    function logStyles(tag) {
      const htmlCS = getComputedStyle(document.documentElement);
      const bodyCS = getComputedStyle(document.body);
      const info = {
        tag,
        html: {
          overflow: htmlCS.overflow,
          overflowY: htmlCS.overflowY,
          position: htmlCS.position,
          height: htmlCS.height
        },
        body: {
          overflow: bodyCS.overflow,
          overflowY: bodyCS.overflowY,
          position: bodyCS.position,
          height: bodyCS.height
        },
        classes: {
          html: Array.from(document.documentElement.classList),
          body: Array.from(document.body.classList)
        },
        sizes: {
          innerHeight: window.innerHeight,
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: document.documentElement.clientHeight,
          pageYOffset: window.pageYOffset
        }
      };
      console.log('[ScrollDiag]', info);
    }

    function canScrollCheck(tag) {
      const before = window.pageYOffset;
      window.scrollTo(0, before + 2);
      setTimeout(() => {
        const after = window.pageYOffset;
        console.log('[ScrollDiag] canScrollCheck', { tag, moved: after !== before, before, after });
      }, 50);
    }

    // Логи на ключевых этапах
    logStyles('DOMContentLoaded');
    setTimeout(() => logStyles('t+300ms'), 300);
    setTimeout(() => logStyles('t+1200ms'), 1200);
    setTimeout(() => logStyles('t+3000ms'), 3000);
    setTimeout(() => canScrollCheck('t+1200ms'), 1200);

    // Глобальные ловушки событий для диагностики
    window.addEventListener('load', () => logStyles('load'));
    document.addEventListener('wheel', () => logStyles('wheel'), { passive: true });
    window.addEventListener('resize', () => logStyles('resize'));

    // Экстренная разблокировка из консоли
    window.forceUnlockScroll = () => {
      console.warn('[ScrollDiag] forceUnlockScroll invoked');
      try {
        document.documentElement.classList.remove('preloader-active');
        document.body.classList.remove('preloader-active');
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflowY = 'auto';
        document.body.style.overflowY = 'auto';
      } catch (e) { console.warn(e); }
      logStyles('forceUnlockScroll');
    };

  } catch (e) {
    console.warn('installScrollDiagnostics error', e);
  }
}

// Функция для предотвращения висячих строк
function preventOrphans(element) {
  if (!element || !element.textContent) return;
  
  const text = element.textContent.trim();
  const words = text.split(/\s+/);
  
  // Если слов меньше 2, не обрабатываем
  if (words.length < 2) return;
  
  // Если последнее слово короткое (до 4 символов), связываем с предыдущим
  const lastWord = words[words.length - 1];
  if (lastWord.length <= 4) {
    // Заменяем последний пробел на неразрывный пробел
    const newText = text.replace(/\s+$/, '\u00A0');
    element.textContent = newText;
    console.log('Orphan control applied:', element.className, '->', newText);
  }
  
  // Дополнительная проверка: если последние два слова короткие, связываем их
  if (words.length >= 2) {
    const lastTwoWords = words.slice(-2);
    if (lastTwoWords.every(word => word.length <= 4)) {
      const textWithoutLastTwo = words.slice(0, -2).join(' ');
      const lastTwoJoined = lastTwoWords.join('\u00A0');
      element.textContent = textWithoutLastTwo + ' ' + lastTwoJoined;
      console.log('Orphan control applied (two words):', element.className, '->', textWithoutLastTwo + ' ' + lastTwoJoined);
    }
  }
}