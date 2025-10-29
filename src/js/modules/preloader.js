// Модуль прелоадера с splash screen
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const percentElement = document.getElementById('preloader-percent');
  const enterButton = document.getElementById('enter-button');
  const splashScreen = document.getElementById('splash-screen');
  const splashVideo = document.getElementById('splash-video');
  
  if (!preloader || !percentElement) {
    try {
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    } catch(_) {}
    return;
  }

  const isMainPage = window.location.pathname === '/' || 
                    window.location.pathname === '/index.html' || 
                    window.location.pathname === '';
  document.documentElement.classList.add('preloader-active');
  document.body.classList.add('preloader-active');

  let progress = 0;
  let loadedResources = 0;
  let totalResources = 0;
  
  const resourcesToLoad = [
    '/public/assets/plus-large.svg',
    '/public/assets/plus-small.svg',
    '/public/assets/line-small.svg',
    '/public/assets/hero-bg.png',
    '/public/assets/OUTOFREC_reel_v4_nologo.mp4',
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

  totalResources = resourcesToLoad.length + expectedCssJsFiles.length + 1;

  function updateProgress() {
    const actualProgress = Math.min(loadedResources, totalResources);
    progress = Math.round((actualProgress / totalResources) * 100);
    percentElement.textContent = progress;

    if (loadedResources >= totalResources) {
      if (isMainPage && enterButton && splashScreen && splashVideo) {
        showEnterButton();
      } else {
        hidePreloader();
      }
    }
  }
  function loadResource(url) {
    return new Promise((resolve) => {
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

  resourcesToLoad.forEach(url => loadResource(url));
  
  let checkedResources = new Set();
  
  function checkLoadedResources() {
    const performanceEntries = performance.getEntriesByType('resource');
    
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
  
  const checkInterval = setInterval(() => {
    checkLoadedResources();
    if (loadedResources >= totalResources) {
      clearInterval(checkInterval);
    }
  }, 100);
  
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

  setTimeout(() => {
    if (loadedResources < totalResources) {
      console.warn('Preloader timeout, forcing completion');
      loadedResources = totalResources;
      updateProgress();
    }
  }, 5000);
  
  const progressCheckInterval = setInterval(() => {
    if (loadedResources >= totalResources) {
      clearInterval(progressCheckInterval);
    }
  }, 500);

  function showEnterButton() {
    if (!enterButton) return;
    enterButton.classList.add('visible');
    enterButton.addEventListener('click', handleEnterClick);
  }
  function handleEnterClick() {
    if (!enterButton || !percentElement || !splashScreen || !splashVideo) return;
    
    enterButton.removeEventListener('click', handleEnterClick);
    
    if (typeof window.unlockVideoAutoplay === 'function') {
      window.unlockVideoAutoplay().then(() => {
        console.log('[Preloader] Video autoplay unlocked successfully');
        // Устанавливаем глобальный флаг для других скриптов
        window.videoAutoplayUnlocked = true;
      }).catch(e => {
        console.warn('[Preloader] Failed to unlock video autoplay:', e);
      });
    }
    
    const progressContainer = percentElement.closest('.oor-preloader-progress');
    if (progressContainer) {
      progressContainer.classList.add('hidden');
    }
    
    enterButton.classList.remove('visible');
    
    setTimeout(() => {
      showSplashScreen();
    }, 600);
  }

  function showSplashScreen() {
    if (!splashScreen || !splashVideo) {
      hidePreloader();
      return;
    }
    
    if (preloader) {
      preloader.style.display = 'none';
    }
    
    splashScreen.classList.add('visible');
    
    setTimeout(() => {
      playSplashVideo();
    }, 800);
  }

  function playSplashVideo() {
    if (!splashVideo) {
      hideSplashScreen();
      return;
    }
    
    splashVideo.addEventListener('ended', hideSplashScreen);
    splashVideo.addEventListener('error', () => {
      console.warn('Splash video error, hiding after 2 seconds');
      setTimeout(hideSplashScreen, 2000);
    });
    
    splashVideo.play().catch(error => {
      console.warn('Splash video autoplay failed:', error);
      setTimeout(hideSplashScreen, 2000);
    });
  }

  function hideSplashScreen() {
    if (!splashScreen) {
      hidePreloader();
      return;
    }
    
    splashScreen.classList.add('hidden');
    
    setTimeout(() => {
      hidePreloader();
    }, 800);
  }

  function hidePreloader() {
    try {
      if (preloader) {
        preloader.remove();
      }
      if (splashScreen) {
        splashScreen.remove();
      }
      
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      
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
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }
}
window.initPreloader = initPreloader;
