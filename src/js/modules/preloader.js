/**
 * ========================================
 * PRELOADER MODULE WITH SPLASH SCREEN
 * ========================================
 * 
 * Модуль прелоадера для OOR проекта с поддержкой splash screen
 * Вынесен из main.js для модульности
 * 
 * @author OOR Development Team
 * @version 2.0.0
 * @since 2025-01-27
 * 
 * FEATURES:
 * - Реальная загрузка ресурсов
 * - Анимация прогресса
 * - Кнопка "Войти" при достижении 100%
 * - Splash screen с видео на главной странице
 * - Последовательность анимаций: маска → fade → видео → fade out
 * - Автоматическое скрытие
 * - Fallback при отсутствии элементов
 */

/**
 * Инициализация прелоадера с splash screen
 * @function initPreloader
 * @returns {void}
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const percentElement = document.getElementById('preloader-percent');
  const enterButton = document.getElementById('enter-button');
  const splashScreen = document.getElementById('splash-screen');
  const splashVideo = document.getElementById('splash-video');
  
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

  // Проверяем, находимся ли мы на главной странице
  const isMainPage = window.location.pathname === '/' || 
                    window.location.pathname === '/index.html' || 
                    window.location.pathname === '';

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

    if (loadedResources >= totalResources) {
      // Завершаем прелоадер - показываем кнопку или скрываем
      if (isMainPage && enterButton && splashScreen && splashVideo) {
        // На главной странице показываем кнопку "Войти"
        showEnterButton();
      } else {
        // На других страницах просто скрываем прелоадер
        hidePreloader();
      }
    }
  }

  // Функция загрузки ресурса
  function loadResource(url) {
    return new Promise((resolve) => {
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
  resourcesToLoad.forEach(url => loadResource(url));
  
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
    }
  }, 5000);
  
  // Дополнительная проверка каждые 500ms
  const progressCheckInterval = setInterval(() => {
    if (loadedResources >= totalResources) {
      clearInterval(progressCheckInterval);
    }
  }, 500);

  /**
   * Показывает кнопку "Войти"
   * @function showEnterButton
   * @returns {void}
   */
  function showEnterButton() {
    if (!enterButton) return;
    
    // Показываем кнопку с fade эффектом
    enterButton.classList.add('visible');
    
    // Добавляем обработчик клика
    enterButton.addEventListener('click', handleEnterClick);
  }

  /**
   * Обрабатывает клик по кнопке "Войти"
   * @function handleEnterClick
   * @returns {void}
   */
  function handleEnterClick() {
    if (!enterButton || !percentElement || !splashScreen || !splashVideo) return;
    
    // Убираем обработчик клика
    enterButton.removeEventListener('click', handleEnterClick);
    
    // Разблокируем автоплей видео через user interaction
    if (typeof window.unlockVideoAutoplay === 'function') {
      window.unlockVideoAutoplay().then(() => {
        console.log('[Preloader] Video autoplay unlocked successfully');
        // Устанавливаем глобальный флаг для других скриптов
        window.videoAutoplayUnlocked = true;
      }).catch(e => {
        console.warn('[Preloader] Failed to unlock video autoplay:', e);
      });
    }
    
    // 1. Скрываем счетчик через маску (600ms)
    // Находим родительский элемент .oor-preloader-progress
    const progressContainer = percentElement.closest('.oor-preloader-progress');
    if (progressContainer) {
      progressContainer.classList.add('hidden');
    }
    
    // 2. Одновременно fade out кнопки (500ms)
    enterButton.classList.remove('visible');
    
    // 3. После 600ms показываем splash screen
    setTimeout(() => {
      showSplashScreen();
    }, 600);
  }

  /**
   * Показывает splash screen и запускает видео
   * @function showSplashScreen
   * @returns {void}
   */
  function showSplashScreen() {
    if (!splashScreen || !splashVideo) {
      hidePreloader();
      return;
    }
    
    // Скрываем preloader полностью перед показом splash
    if (preloader) {
      preloader.style.display = 'none';
    }
    
    // Показываем splash screen с fade эффектом
    splashScreen.classList.add('visible');
    
    // После завершения fade in запускаем видео
    setTimeout(() => {
      playSplashVideo();
    }, 800);
  }

  /**
   * Запускает воспроизведение splash видео
   * @function playSplashVideo
   * @returns {void}
   */
  function playSplashVideo() {
    if (!splashVideo) {
      hideSplashScreen();
      return;
    }
    
    // Устанавливаем обработчик окончания видео
    splashVideo.addEventListener('ended', hideSplashScreen);
    splashVideo.addEventListener('error', () => {
      console.warn('Splash video error, hiding after 2 seconds');
      setTimeout(hideSplashScreen, 2000);
    });
    
    // Запускаем воспроизведение
    splashVideo.play().catch(error => {
      console.warn('Splash video autoplay failed:', error);
      // Если автоплей заблокирован, показываем белый экран 2 секунды
      setTimeout(hideSplashScreen, 2000);
    });
  }

  /**
   * Скрывает splash screen
   * @function hideSplashScreen
   * @returns {void}
   */
  function hideSplashScreen() {
    if (!splashScreen) {
      hidePreloader();
      return;
    }
    
    // Fade out splash screen
    splashScreen.classList.add('hidden');
    
    // После fade out удаляем элементы и разблокируем скролл
    setTimeout(() => {
      hidePreloader();
    }, 800);
  }

  /**
   * Скрывает прелоадер и очищает DOM
   * @function hidePreloader
   * @returns {void}
   */
  function hidePreloader() {
    try {
      // Удаляем элементы из DOM
      if (preloader) {
        preloader.remove();
      }
      if (splashScreen) {
        splashScreen.remove();
      }
      
      // Снимаем блокировки скролла
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      
      // Загружаем и инициализируем Lenis ПОСЛЕ полного удаления прелоадера
      setTimeout(() => {
        try {
          const DISABLE_LENIS = (typeof window !== 'undefined') && window.location && 
                               (window.location.search.includes('nolenis') || window.location.search.includes('disablelenis'));
          if (DISABLE_LENIS) {
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
              }
            } catch(e) { console.warn('Lenis init error', e); }
          };
          document.head.appendChild(s);
        } catch(e) { console.warn('Lenis load error', e); }
      }, 100);
      
    } catch(_) {
      // Fallback: принудительно снимаем блокировки
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }
}

// Экспорт для использования в main.js
window.initPreloader = initPreloader;
