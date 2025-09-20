/**
 * ========================================
 * VIDEO MODULE
 * ========================================
 * 
 * Модуль для работы с видео в OOR проекте
 * Вынесен из main.js для модульности
 * 
 * @author OOR Development Team
 * @version 1.0.0
 * @since 2025-09-21
 * 
 * FEATURES:
 * - Инициализация hero видео
 * - Полноэкранное видео
 * - Автозапуск и зацикливание
 * - Обработка ошибок
 */

/**
 * Инициализация hero видео
 * @function initHeroVideo
 * @returns {void}
 */
function initHeroVideo() {
  const heroVideo = document.querySelector('.oor-hero-video');
  
  if (!heroVideo) return;
  
  // Настройки для hero видео
  heroVideo.muted = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;
  heroVideo.preload = 'metadata';
  
  // Обработка ошибок
  heroVideo.addEventListener('error', () => {
    console.warn('Hero video failed to load, showing fallback');
    // Показываем fallback изображение
    const fallback = heroVideo.querySelector('div');
    if (fallback) {
      fallback.style.display = 'block';
    }
  });
  
  // Попытка автозапуска
  heroVideo.play().catch(() => {
    console.warn('Hero video autoplay failed');
  });
}

/**
 * Инициализация полноэкранного видео
 * @function initFullscreenVideo
 * @returns {void}
 */
function initFullscreenVideo() {
  const fullscreenVideos = document.querySelectorAll('.oor-fullscreen-video');
  
  fullscreenVideos.forEach(video => {
    // Настройки для полноэкранного видео
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    
    // Обработка клика для полноэкранного режима
    video.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    });
    
    // Обработка ошибок
    video.addEventListener('error', () => {
      console.warn('Fullscreen video failed to load');
    });
  });
}

// Экспорт для использования в main.js
window.initHeroVideo = initHeroVideo;
window.initFullscreenVideo = initFullscreenVideo;
