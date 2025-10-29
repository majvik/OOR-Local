// Модуль для работы с видео
function initHeroVideo() {
  const heroVideo = document.querySelector('.oor-hero-video');
  
  if (!heroVideo) return;
  heroVideo.muted = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;
  heroVideo.preload = 'metadata';
  
  heroVideo.addEventListener('error', () => {
    console.warn('Hero video failed to load, showing fallback');
    const fallback = heroVideo.querySelector('div');
    if (fallback) {
      fallback.style.display = 'block';
    }
  });
  
  heroVideo.play().catch(() => {
    console.warn('Hero video autoplay failed');
  });
}

function initFullscreenVideo() {
  const fullscreenVideos = document.querySelectorAll('.oor-fullscreen-video');
  
  fullscreenVideos.forEach(video => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    
    video.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    });
    
    video.addEventListener('error', () => {
      console.warn('Fullscreen video failed to load');
    });
  });
}
window.initHeroVideo = initHeroVideo;
window.initFullscreenVideo = initFullscreenVideo;
