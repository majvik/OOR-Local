// Модуль прелоадера с splash screen
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress-bar');
  const enterButton = document.getElementById('enter-button-splash') || document.getElementById('enter-button');
  const splashScreen = document.getElementById('splash-screen');
  const splashGif = document.getElementById('splash-gif');
  
  if (!preloader || !progressBar) {
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
  let gifCompletionStarted = false;
  let gifStopped = false;
  
  const resourcesToLoad = [
    '/public/assets/plus-large.svg',
    '/public/assets/plus-small.svg',
    '/public/assets/line-small.svg',
    '/public/assets/hero-bg.png',
    '/public/assets/OUTOFREC_reel_v4_nologo.mp4',
    '/public/assets/splash-last-frame.png',
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
    progress = (actualProgress / totalResources) * 100;
    progressBar.style.width = progress + '%';

    if (loadedResources >= totalResources) {
      handleProgressComplete();
    }
  }

  function handleProgressComplete() {
    progressBar.classList.add('hidden');
    
    setTimeout(() => {
      if (isMainPage && splashScreen && splashGif) {
        showSplashGif();
      } else {
        hidePreloader();
      }
    }, 300);
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

  function showSplashGif() {
    if (!splashScreen || !splashGif) {
      console.warn('[Preloader] splashScreen or splashGif not found, hiding preloader');
      hidePreloader();
      return;
    }
    
    const parent = splashGif.parentNode || splashScreen;
    
    const lastFrameImg = document.createElement('img');
    lastFrameImg.id = 'splash-gif-frozen';
    lastFrameImg.src = '/public/assets/splash-last-frame.png';
    lastFrameImg.alt = 'Splash';
    lastFrameImg.width = 400;
    lastFrameImg.height = 400;
    lastFrameImg.style.zIndex = '1';
    
    splashGif.style.zIndex = '2';
    
    parent.insertBefore(lastFrameImg, splashGif);
    
    splashScreen.classList.add('visible');
    gifCompletionStarted = false;
    
    splashGif.onload = () => {
      if (!gifCompletionStarted) {
        gifCompletionStarted = true;
        waitForGifCompletion();
      }
    };
    
    if (splashGif.complete && splashGif.naturalHeight !== 0) {
      if (!gifCompletionStarted) {
        gifCompletionStarted = true;
        waitForGifCompletion();
      }
    }
  }

  function waitForGifCompletion() {
    if (!splashGif) return;
    
    const estimatedDuration = 3800;
    
    setTimeout(() => {
      stopGifLoop();
    }, estimatedDuration);
  }

  function stopGifLoop() {
    if (gifStopped) return;
    gifStopped = true;
    
    const currentGif = document.getElementById('splash-gif');
    if (!currentGif) {
      setTimeout(() => {
        showEnterButton();
      }, 300);
      return;
    }
    
    try {
      if (currentGif && currentGif.parentNode) {
        currentGif.remove();
      }
      
      setTimeout(() => {
        showEnterButton();
      }, 100);
    } catch (error) {
      console.error('[Preloader] Error removing GIF:', error);
      setTimeout(() => {
        showEnterButton();
      }, 300);
    }
  }

  function showEnterButton() {
    if (!enterButton) return;
    
    if (enterButton.dataset.initialized === 'true') {
      return;
    }
    
    enterButton.dataset.initialized = 'true';
    
    enterButton.addEventListener('click', handleEnterClick, { once: true });
    
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      enterButton.style.transform = 'translateX(-50%)';
    }
    
    requestAnimationFrame(() => {
      enterButton.classList.add('visible');
    });
  }

  function handleEnterClick(e) {
    if (!enterButton) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof window.unlockVideoAutoplay === 'function') {
      window.unlockVideoAutoplay().then(() => {
        console.log('[Preloader] Video autoplay unlocked successfully');
        window.videoAutoplayUnlocked = true;
      }).catch(e => {
        console.warn('[Preloader] Failed to unlock video autoplay:', e);
      });
    }
    
    hidePreloader();
  }

  function hidePreloader() {
    try {
      if (preloader) {
        preloader.classList.add('hidden');
      }
      if (splashScreen) {
        splashScreen.classList.add('hidden');
      }
      
      setTimeout(() => {
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
        
      }, 800);
      
    } catch(_) {
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }
}
window.initPreloader = initPreloader;
