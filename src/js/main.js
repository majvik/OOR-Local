// Масочный reveal для заголовков (слайд снизу вверх из клипа)
function initMaskedHeadingsReveal() {
  if (window.innerWidth <= 1024) return;

  const headingSelectors = [
    '.oor-hero-title',
    '.oor-hero-description-title',
    '.oor-challenge-title',
    '.oor-challenge-2-studio-title',
    '.oor-challenge-2-good-works-title',
    '.oor-out-of-talk-heading',
    '.oor-events-heading',
    '.oor-merch-title'
  ];
  const headings = headingSelectors.flatMap(sel => Array.from(document.querySelectorAll(sel)));
  if (headings.length === 0) return;

  // Оборачиваем текст в маску
  headings.forEach(h => {
    if (h.closest('.oor-heading-mask')) return;
    const mask = document.createElement('span');
    mask.className = 'oor-heading-mask';
    // Блочная маска, чтобы корректно охватывать многострочные заголовки
    mask.style.display = 'block';
    mask.style.overflow = 'hidden';
    mask.style.verticalAlign = 'bottom';
    // переносим детей: сначала в mask, затем в внутренний контейнер, чтобы анимировать весь текст целиком
    while (h.firstChild) mask.appendChild(h.firstChild);
    h.appendChild(mask);

    const inner = document.createElement('span');
    inner.className = 'oor-heading-inner';
    inner.style.display = 'inline-block';
    // перемещаем ВСЕ узлы mask во внутренний контейнер
    while (mask.firstChild) inner.appendChild(mask.firstChild);
    mask.appendChild(inner);

    // начальные стили содержимого
    inner.style.transform = 'translate3d(0, 120%, 0)';
    inner.style.opacity = '0';
    inner.style.transition = 'transform 900ms cubic-bezier(0.84, 0.00, 0.16, 1), opacity 900ms ease';
    inner.style.willChange = 'transform, opacity';
  });

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const h = entry.target;
        const mask = h.querySelector('.oor-heading-mask');
        const inner = mask && mask.querySelector('.oor-heading-inner');
        if (inner) {
          inner.style.transform = 'translate3d(0, 0, 0)';
          inner.style.opacity = '1';
          setTimeout(() => { try { inner.style.willChange = ''; } catch(_) {} }, 1000);
        }
        observer.unobserve(h);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

  // Старт наблюдения с небольшим кадром задержки
  requestAnimationFrame(() => {
    headings.forEach(h => io.observe(h));
  });
}
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
    initRetinaSupport();
    initParallaxImages();
    initRevealOnScroll();
    initMaskedHeadingsReveal();
    
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

    // console.log(`Preloader: ${loadedResources}/${totalResources} (${progress}%)`);

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

// Retina (2x) support for <img> and background layers
function initRetinaSupport() {
  // Apply only on high-DPR screens
  const isHighDPR = (typeof window !== 'undefined') && (window.devicePixelRatio && window.devicePixelRatio >= 2);
  if (!isHighDPR) return;

  // Helper: build @2x url from a given url like /path/name.ext -> /path/name@2x.ext
  function build2xUrl(url) {
    try {
      const qIndex = url.indexOf('?');
      const base = qIndex >= 0 ? url.slice(0, qIndex) : url;
      const query = qIndex >= 0 ? url.slice(qIndex) : '';
      const dot = base.lastIndexOf('.');
      if (dot <= 0) return null;
      return base.slice(0, dot) + '@2x' + base.slice(dot) + query;
    } catch (_) { return null; }
  }

  // Helper: test if an image exists (loadable)
  function imageExists(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // Upgrade <img> without srcset/picture to use 2x if available
  (async () => {
    const imgs = Array.from(document.querySelectorAll('img'))
      .filter(img => !img.closest('picture'))
      .filter(img => !/\.svg($|\?)/i.test(img.src))
      .filter(img => !img.hasAttribute('srcset'));

    for (const img of imgs) {
      const src = img.getAttribute('src');
      if (!src) continue;
      // Skip video-cover files (no 2x versions available)
      if (/video-cover/i.test(src)) continue;
      const hi = build2xUrl(src);
      if (!hi) continue;
      // eslint-disable-next-line no-await-in-loop
      const ok = await imageExists(hi);
      if (ok) {
        img.setAttribute('srcset', `${src} 1x, ${hi} 2x`);
      }
    }
  })();

  // Upgrade background layers created for parallax (.oor-parallax-bg)
  (async () => {
    const layers = Array.from(document.querySelectorAll('.oor-parallax-bg'));
    for (const layer of layers) {
      const bg = getComputedStyle(layer).backgroundImage; // e.g., url("/path/image.png")
      const match = /url\(("|')?(.*?)("|')?\)/.exec(bg || '');
      if (!match || !match[2]) continue;
      const url = match[2];
      if (/\.svg($|\?)/i.test(url)) continue;
      const hi = build2xUrl(url);
      if (!hi) continue;
      // eslint-disable-next-line no-await-in-loop
      const ok = await imageExists(hi);
      if (ok) {
        // Prefer CSS image-set for crisp rendering
        layer.style.backgroundImage = `image-set(url(${url}) 1x, url(${hi}) 2x)`;
      }
    }
  })();

  // Upgrade ALL elements with a single URL background-image (site-wide)
  (async () => {
    const all = Array.from(document.querySelectorAll('*'));
    for (const el of all) {
      // Skip parallax bg (already processed)
      if (el.classList && el.classList.contains('oor-parallax-bg')) continue;
      const cs = getComputedStyle(el);
      const bg = cs.backgroundImage;
      if (!bg || bg === 'none') continue;
      // Skip already set image-set or multiple backgrounds / gradients
      if (/image-set\(/i.test(bg)) continue;
      if (/,/.test(bg)) continue; // multiple backgrounds not handled
      if (/gradient\(/i.test(bg)) continue;
      // Skip video-cover files (no 2x versions available)
      if (/video-cover/i.test(bg)) continue;
      const match = /url\(("|')?(.*?)("|')?\)/.exec(bg);
      if (!match || !match[2]) continue;
      const url = match[2];
      if (/\.svg($|\?)/i.test(url)) continue;
      const hi = build2xUrl(url);
      if (!hi) continue;
      // eslint-disable-next-line no-await-in-loop
      const ok = await imageExists(hi);
      if (ok) {
        el.style.backgroundImage = `image-set(url(${url}) 1x, url(${hi}) 2x)`;
      }
    }
  })();
}

// Параллакс: двигаем ТОЛЬКО изображение внутри фиксированного контейнера
function initParallaxImages() {
  // Производительность: отключаем на очень маленьких экранах
  if (window.innerWidth <= 425) return;

  // Селектор кандидатов: все <img>, кроме исключений
  const allImages = Array.from(document.querySelectorAll('img'));
  const candidates = allImages.filter(img => {
    // Исключаем любые SVG: встроенные <svg> мы не выбираем; но также исключим src оканчивающиеся на .svg
    const src = (img.getAttribute('src') || '').toLowerCase();
    const isSvg = src.endsWith('.svg');
    if (isSvg) return false;
    // Исключаем изображения внутри слайдера и других зон
    if (img.closest('#wsls')) return false;
    if (img.closest('.oor-merch-images-grid')) return false;
    if (img.closest('.oor-events-posters')) return false;
    // Явные отключения для конкретных контейнеров/изображений
    if (img.closest('.oor-without-fear-image-2')) return false;
    if (img.closest('.oor-quality-img-container-2')) return false;
    if (img.closest('.oor-challenge-2-good-works-image')) return false;
    if (img.closest('.oor-out-of-talk-image-1')) return false;
    if (img.closest('.oor-out-of-talk-image-2')) return false;
    if (img.closest('.oor-out-of-talk-image-3')) return false;
    // Явное отключение
    if (img.classList.contains('no-parallax')) return false;
    return true;
  });

  // Поддержка параллакса для блоков с фоном (.oor-musical-association-right)
  const bgTargets = [];
  document.querySelectorAll('.oor-musical-association-right').forEach(el => {
    const cs = getComputedStyle(el);
    if (!cs.backgroundImage || cs.backgroundImage === 'none') return;
    if (el.querySelector('.oor-parallax-bg')) return;
    if (!el.style.position) el.style.position = 'relative';
    if (!el.style.overflow) el.style.overflow = 'hidden';
    const layer = document.createElement('div');
    layer.className = 'oor-parallax-bg';
    layer.style.position = 'absolute';
    layer.style.inset = '0';
    layer.style.backgroundImage = cs.backgroundImage;
    layer.style.backgroundSize = cs.backgroundSize || 'cover';
    layer.style.backgroundRepeat = cs.backgroundRepeat || 'no-repeat';
    layer.style.backgroundPosition = cs.backgroundPosition || 'center';
    layer.style.willChange = 'transform';
    const initScaleAttr = parseFloat(el.getAttribute('data-parallax-scale'));
    const initScale = Number.isFinite(initScaleAttr) ? initScaleAttr : 'calc(100% + 30%)';
    layer.setAttribute('data-parallax-scale', String(initScale));
    layer.setAttribute('data-parallax-speed', el.getAttribute('data-parallax-speed') || '');
    layer.setAttribute('data-parallax-max', el.getAttribute('data-parallax-max') || '');
    layer.style.transform = `translate3d(0,0,0) scale(${initScale})`;
    // Убираем фон у контейнера, переносим в слой
    el.style.backgroundImage = 'none';
    el.appendChild(layer);
    bgTargets.push(layer);
  });

  if (candidates.length === 0 && bgTargets.length === 0) return;

  // Оборачиваем изображение в контейнер, чтобы блок занимал фиксированное место
  candidates.forEach(img => {
    if (img.closest('.oor-parallax-wrap')) return; // уже обернуто
    const wrap = document.createElement('div');
    wrap.className = 'oor-parallax-wrap';
    wrap.style.position = 'relative';
    wrap.style.overflow = 'hidden';
    wrap.style.display = 'block';
    wrap.style.width = img.style.width || ''; // уважаем заданные стили
    wrap.style.height = '';
    // Снижаем мерцание за счет изоляции перерисовки
    wrap.style.contain = 'paint';
    // Вставляем перед изображением и переносим img внутрь
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    // Уточняем стили изображения
    img.style.display = 'block';
    img.style.willChange = 'transform';
    img.style.transformOrigin = 'center center';
    img.style.transformStyle = 'preserve-3d';
    img.style.backfaceVisibility = 'hidden';
    // Специфичные настройки параллакса для определенных контейнеров
    if (img.closest('.oor-without-fear-image')) {
      img.setAttribute('data-parallax-max', '32');
    }
    if (img.closest('.oor-quality-img-container-1')) {
      img.setAttribute('data-parallax-max', '64');
    }
    
    // Рассчитываем и замораживаем scale для заполнения контейнера
    const calculateAndFreezeScale = () => {
      const container = img.closest('.oor-parallax-wrap') || img.parentElement;
      const containerRect = container.getBoundingClientRect();
      const parallaxMax = parseFloat(img.getAttribute('data-parallax-max')) || 64;
      const customScale = parseFloat(img.getAttribute('data-parallax-scale'));
      
      // Если задан кастомный scale, используем его
      if (Number.isFinite(customScale)) {
        return Promise.resolve(customScale);
      }
      
      // Запас должен покрывать максимальное смещение параллакса + дополнительный буфер
      const reserve = Math.max(parallaxMax + 32, 80); // минимум 80px запас
      
      // Ждем загрузки изображения для получения естественных размеров
      return new Promise((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          // Изображение уже загружено
          const naturalWidth = img.naturalWidth;
          const naturalHeight = img.naturalHeight;
          
          // Рассчитываем scale для полного заполнения контейнера + запас для параллакса
          const neededWidth = containerRect.width + reserve;
          const neededHeight = containerRect.height + reserve;
          
          const scaleX = neededWidth / naturalWidth;
          const scaleY = neededHeight / naturalHeight;
          
          // Берем больший scale, но минимум 1.0 (естественный размер)
          resolve(Math.max(scaleX, scaleY, 1.0));
        } else {
          // Ждем загрузки изображения
          img.onload = () => {
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            
            const neededWidth = containerRect.width + reserve;
            const neededHeight = containerRect.height + reserve;
            
            const scaleX = neededWidth / naturalWidth;
            const scaleY = neededHeight / naturalHeight;
            
            // Берем больший scale, но минимум 1.0 (естественный размер)
            resolve(Math.max(scaleX, scaleY, 1.0));
          };
        }
      });
    };
    
    // Рассчитываем и замораживаем начальный scale
    calculateAndFreezeScale().then(frozenScale => {
      img.setAttribute('data-frozen-scale', frozenScale.toString());
      img.style.transform = `translate3d(0,0,0) scale(${frozenScale})`;
    });
    
    // Сохраняем функцию для пересчета при ресайзе
    img._recalculateScale = calculateAndFreezeScale;
  });

  const observed = new Set();
  const inView = new Set();
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const node = entry.target;
      if (entry.isIntersecting) {
        inView.add(node);
      } else {
        inView.delete(node);
        // Не сбрасываем мгновенно transform, чтобы избежать "прыжков" на границе видимости
        // node.style.transform = '';
        // node.style.willChange = '';
      }
    });
  }, { root: null, rootMargin: '100px 0px', threshold: [0, 0.1, 0.5, 1] });

  candidates.forEach(img => { if (!observed.has(img)) { io.observe(img); observed.add(img); } });
  bgTargets.forEach(layer => { if (!observed.has(layer)) { io.observe(layer); observed.add(layer); } });

  const getVH = () => window.innerHeight || document.documentElement.clientHeight;
  let rafId = null;
  const lastShiftMap = new WeakMap();

  function frame() {
    const vh = getVH();
    inView.forEach(node => {
      const maxAttr = parseFloat(node.getAttribute('data-parallax-max'));
      const maxShift = Number.isFinite(maxAttr) ? maxAttr : 64;    // пиксели

      const rect = node.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      
      // Параллакс начинается как только изображение появляется в viewport
      // -1 когда изображение только появилось сверху, +1 когда полностью ушло вниз
      const norm = (centerY - vh) / vh;
      let shift = Math.max(-1, Math.min(1, norm)) * maxShift;
      // Слегка квантуем изменение, чтобы избежать субпиксельного дрожания
      shift = Math.round(shift * 2) / 2; // шаг 0.5px
      // Используем замороженный scale или fallback
      let baseScale;
      const frozenScale = parseFloat(node.getAttribute('data-frozen-scale'));
      if (Number.isFinite(frozenScale)) {
        baseScale = frozenScale;
      } else {
        const baseScaleAttr = parseFloat(node.getAttribute('data-parallax-scale'));
        baseScale = Number.isFinite(baseScaleAttr) ? baseScaleAttr : 1.3;
      }
      
      const last = lastShiftMap.get(node);
      if (last === undefined || Math.abs(shift - last) >= 0.5) {
        node.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(${baseScale})`;
        lastShiftMap.set(node, shift);
      }
    });
    rafId = requestAnimationFrame(frame);
  }

  function start() { if (rafId == null) rafId = requestAnimationFrame(frame); }
  function stop() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
    inView.forEach(node => { node.style.transform = ''; /* оставляем will-change для плавности */ });
  }

  start();

  const onResize = () => {
    if (window.innerWidth <= 425) {
      stop();
    } else {
      // Пересчитываем и замораживаем новый scale для всех изображений при ресайзе
      candidates.forEach(img => {
        if (img._recalculateScale) {
          img._recalculateScale().then(newScale => {
            img.setAttribute('data-frozen-scale', newScale.toString());
            img.style.transform = `translate3d(0,0,0) scale(${newScale})`;
          });
        }
      });
      if (rafId == null) start();
    }
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
}

// Мягкое "подъезжание" блоков на десктопе
function initRevealOnScroll() {
  // Только десктоп (чтобы не мешать мобильной производительности)
  if (window.innerWidth <= 1024) return;

  // Крупные контейнеры секций, без мелких вложенных элементов
  const selectors = [
    '.oor-hero-content',
    '.oor-musical-association-left',
    '.oor-musical-association-right',
    '.oor-challenge-left',
    '.oor-challenge-right',
    '.oor-challenge-2-left',
    '.oor-challenge-2-good-works',
    '.oor-out-of-talk-text',
    '.oor-out-of-talk-media',
    '.oor-events-text',
    '.oor-events-media',
    '.oor-merch-text',
    '.oor-merch-images-grid'
  ];

  let nodes = selectors
    .flatMap(sel => Array.from(document.querySelectorAll(sel)))
    .filter(el => !el.classList.contains('no-reveal'));

  if (nodes.length === 0) return;

  // Дополнительно: элементы изображений мерча, которые должны подъезжать по очереди
  const merchItems = Array.from(document.querySelectorAll('.oor-merch-images-wrapper .oor-merch-image-item'));
  // Если есть элементы мерча, не анимируем контейнер .oor-merch-images-grid, чтобы не дублировать эффекты
  if (merchItems.length > 0) {
    nodes = nodes.filter(el => !el.matches('.oor-merch-images-grid'));
  }

  // Начальные стили (ниже и прозрачнее, как у референса: больше дистанция и плавнее)
  nodes.forEach(el => {
    el.style.opacity = '0';
    // Появление строго по вертикали, без смещения по X
    el.style.transform = 'translate3d(0, 120px, 0)';
    el.style.transformOrigin = '';
    // более плавные тайминги
    el.style.transition = 'opacity 800ms ease, transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.willChange = 'opacity, transform';
  });

  // Инициализация начальных стилей и стаггера для мерча (по одному элементу с интервалом)
  const MERCH_STAGGER_MS = 140;
  merchItems.forEach((el, idx) => {
    el.style.opacity = '0';
    el.style.transform = 'translate3d(0, 120px, 0)';
    el.style.transition = `opacity 800ms ease ${idx * MERCH_STAGGER_MS}ms, transform 1200ms cubic-bezier(0.22, 1, 0.36, 1) ${idx * MERCH_STAGGER_MS}ms`;
    el.style.willChange = 'opacity, transform';
  });

  // Стагер для двухколоночных секций: левая раньше, правая чуть позже
  const staggerPairs = [
    ['.oor-musical-association-left', '.oor-musical-association-right'],
    ['.oor-challenge-left', '.oor-challenge-right'],
    ['.oor-challenge-2-left', '.oor-challenge-2-good-works'],
    ['.oor-events-text', '.oor-events-media']
  ];
  const STAGGER_DELAY_MS = 200;
  staggerPairs.forEach(([firstSel, secondSel]) => {
    const first = document.querySelector(firstSel);
    const second = document.querySelector(secondSel);
    if (first) first.style.transitionDelay = '0ms';
    if (second) second.style.transitionDelay = `${STAGGER_DELAY_MS}ms`;
  });

  // Флаг активации: запускаем анимации только после первого взаимодействия/скролла
  let activated = false;

  // Наблюдатель видимости
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!activated) return; // игнорируем авто-триггер на загрузке
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = '1';
        el.style.transform = 'translate3d(0, 0, 0)';
        // После анимации очистим will-change, чтобы не держать слои постоянно
        setTimeout(() => { try { el.style.willChange = ''; } catch(_) {} }, 800);
        observer.unobserve(el);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  // Даем браузеру применить initial-стили и начинаем наблюдение (без немедленного старта)
  requestAnimationFrame(() => {
    // принудительная раскладка
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.body && document.body.offsetHeight;

    setTimeout(() => {
      nodes.forEach(el => io.observe(el));
      merchItems.forEach(el => io.observe(el));
    }, 50);
  });

  // Первое взаимодействие активирует анимации
  const activate = () => {
    if (activated) return;
    activated = true;
    // После активации проверим уже видимые элементы
    const all = nodes.concat(merchItems);
    all.forEach(el => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.9 && rect.bottom > 0) {
        el.style.opacity = '1';
        el.style.transform = 'translate3d(0, 0, 0)';
        setTimeout(() => { try { el.style.willChange = ''; } catch(_) {} }, 800);
        io.unobserve(el);
      }
    });
    window.removeEventListener('scroll', activate, { capture: false });
    window.removeEventListener('wheel', activate, { capture: false });
    window.removeEventListener('touchstart', activate, { capture: false });
  };
  window.addEventListener('scroll', activate, { passive: true });
  window.addEventListener('wheel', activate, { passive: true });
  window.addEventListener('touchstart', activate, { passive: true });

  // При ресайзе: если ушли в мобильный — снимаем эффекты
  const onResize = () => {
    if (window.innerWidth <= 1024) {
      nodes.forEach(el => {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
        el.style.willChange = '';
        el.style.transitionDelay = '';
      });
    }
  };
  window.addEventListener('resize', onResize);
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
  // Отключаем магнетизм на мобильных устройствах (≤1024px с запасом)
  if (window.innerWidth <= 1024) {
    console.log('[OOR] Magnetic elements disabled on mobile devices (width ≤1024px)');
    return;
  }
  
  const magneticElements = document.querySelectorAll(`
    .oor-fullscreen-close,
    .oor-btn-small,
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
    // console.log('Orphan control applied:', element.className, '->', newText);
  }
  
  // Дополнительная проверка: если последние два слова короткие, связываем их
  if (words.length >= 2) {
    const lastTwoWords = words.slice(-2);
    if (lastTwoWords.every(word => word.length <= 4)) {
      const textWithoutLastTwo = words.slice(0, -2).join(' ');
      const lastTwoJoined = lastTwoWords.join('\u00A0');
      element.textContent = textWithoutLastTwo + ' ' + lastTwoJoined;
      // console.log('Orphan control applied (two words):', element.className, '->', textWithoutLastTwo + ' ' + lastTwoJoined);
    }
  }
}