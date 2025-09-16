// Main JavaScript для OOR проекта

document.addEventListener('DOMContentLoaded', function() {
  // Инициализация прелоадера
  initPreloader();
});

// Инициализация после загрузки
window.addEventListener('load', function() {
  // Инициализация компонентов
  initNavigation();
  initDynamicYear();
  initHeroVideo();
  initFullscreenVideo();
  initMagneticElements();
});

// Preloader с реальной загрузкой
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const percentElement = document.getElementById('preloader-percent');
  
  if (!preloader || !percentElement) return;

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
    
    // Удаляем прелоадер из DOM после анимации
    setTimeout(() => {
      preloader.remove();
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

// Магнетизм для кликабельных элементов
function initMagneticElements() {
  const magneticElements = document.querySelectorAll(`
    .oor-fullscreen-close,
    .oor-btn-small,
    .oor-nav-link,
    .oor-logo,
    .oor-social-icon
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