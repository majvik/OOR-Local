/**
 * ========================================
 * PRELOADER MODULE
 * ========================================
 * 
 * Модуль прелоадера для OOR проекта
 * Вынесен из main.js для модульности
 * 
 * @author OOR Development Team
 * @version 1.0.0
 * @since 2025-09-21
 * 
 * FEATURES:
 * - Реальная загрузка ресурсов
 * - Анимация прогресса
 * - Автоматическое скрытие
 * - Fallback при отсутствии элементов
 */

/**
 * Инициализация прелоадера с реальной загрузкой
 * @function initPreloader
 * @returns {void}
 */
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

  let loadedResources = 0;
  const totalResources = countResources();
  
  if (totalResources === 0) {
    // Если нет ресурсов для загрузки — сразу скрываем
    hidePreloader();
    return;
  }

  // Загружаем все ресурсы
  loadResources().then(() => {
    hidePreloader();
  }).catch(() => {
    // В случае ошибки — все равно скрываем прелоадер
    hidePreloader();
  });

  /**
   * Подсчитывает количество ресурсов для загрузки
   * @function countResources
   * @returns {number}
   */
  function countResources() {
    const images = document.querySelectorAll('img[src]');
    const videos = document.querySelectorAll('video source[src]');
    return images.length + videos.length;
  }

  /**
   * Загружает все ресурсы
   * @function loadResources
   * @returns {Promise<void>}
   */
  function loadResources() {
    return new Promise((resolve) => {
      const images = document.querySelectorAll('img[src]');
      const videos = document.querySelectorAll('video source[src]');
      
      let completed = 0;
      const total = images.length + videos.length;
      
      if (total === 0) {
        resolve();
        return;
      }

      // Загружаем изображения
      images.forEach(img => {
        if (img.complete) {
          updateProgress();
        } else {
          img.addEventListener('load', updateProgress);
          img.addEventListener('error', updateProgress);
        }
      });

      // Загружаем видео
      videos.forEach(video => {
        const videoElement = video.parentElement;
        if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA
          updateProgress();
        } else {
          videoElement.addEventListener('loadeddata', updateProgress);
          videoElement.addEventListener('error', updateProgress);
        }
      });

      /**
       * Обновляет прогресс загрузки
       * @function updateProgress
       * @returns {void}
       */
      function updateProgress() {
        completed++;
        const percent = Math.round((completed / total) * 100);
        percentElement.textContent = percent;
        
        if (completed >= total) {
          resolve();
        }
      }
    });
  }

  /**
   * Скрывает прелоадер
   * @function hidePreloader
   * @returns {void}
   */
  function hidePreloader() {
    try {
      // Анимация скрытия
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        preloader.style.display = 'none';
        document.documentElement.classList.remove('preloader-active');
        document.body.classList.remove('preloader-active');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }, 500);
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
