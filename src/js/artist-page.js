(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Disable Lenis for artist page to allow native scrolling in tracks container
    disableLenisForArtistPage();
    
    // Description toggle functionality
    initDescription();
    
    // Player functionality
    initPlayer();
  }

  function disableLenisForArtistPage() {
    // Function to stop Lenis
    function stopLenis() {
      if (window.lenis) {
        try {
          if (window.lenis.stop) window.lenis.stop();
          if (window.lenis.destroy) {
            window.lenis.destroy();
          } else if (window.lenis.off) {
            window.lenis.off('scroll');
          }
          window.lenis = null;
        } catch(e) {
          console.warn('Error disabling Lenis:', e);
        }
      }
    }

    // Stop Lenis immediately
    stopLenis();

    // Also try to stop it after a delay in case it's initialized later
    setTimeout(stopLenis, 100);
    setTimeout(stopLenis, 500);
    setTimeout(stopLenis, 1000);

    // Enable native scrolling
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';

    // Prevent Lenis from intercepting wheel events on tracks container
    const tracksContainer = document.querySelector('.oor-artist-tracks-container');
    if (tracksContainer) {
      // Remove any event listeners that Lenis might have added
      const newContainer = tracksContainer.cloneNode(true);
      tracksContainer.parentNode.replaceChild(newContainer, tracksContainer);

      // Re-attach our event listeners
      newContainer.addEventListener('wheel', function(e) {
        // Allow native scrolling in tracks container
        const container = this;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const height = container.clientHeight;
        const isScrollingUp = e.deltaY < 0;
        const isScrollingDown = e.deltaY > 0;
        
        if ((isScrollingUp && scrollTop > 0) || (isScrollingDown && scrollTop < scrollHeight - height)) {
          // Allow native scroll
          return true;
        }
      }, { passive: true });
    }
  }

  // Description toggle
  function initDescription() {
    const toggleButton = document.getElementById('description-toggle');
    const descriptionContent = document.getElementById('artist-description');
    
    if (!toggleButton || !descriptionContent) return;

    let isExpanded = false;

    toggleButton.addEventListener('click', function() {
      isExpanded = !isExpanded;
      
      if (isExpanded) {
        descriptionContent.classList.add('expanded');
        toggleButton.textContent = 'свернуть';
      } else {
        descriptionContent.classList.remove('expanded');
        toggleButton.textContent = 'подробнее';
      }
    });
  }

  // Audio Player
  function initPlayer() {
    const audio = new Audio();
    let currentTrack = null;
    let isPlaying = false;

    // Player elements
    const playerPlayPause = document.getElementById('player-play-pause');
    const playerPrev = document.getElementById('player-prev');
    const playerNext = document.getElementById('player-next');
    const playerTrackName = document.getElementById('player-track-name');
    const playerTime = document.getElementById('player-time');
    const playerProgress = document.getElementById('player-progress');
    const playerHandle = document.getElementById('player-handle');
    const playerProgressBar = document.querySelector('.oor-artist-player-progress-bar') || (playerProgress ? playerProgress.parentElement : null);
    const playerVolumeBtn = document.getElementById('player-volume-btn');
    const playerVolumeFill = document.getElementById('player-volume-fill');
    const playerVolumeHandle = document.getElementById('player-volume-handle');
    const playerVolumeBar = playerVolumeFill ? playerVolumeFill.parentElement : null;
    let savedVolume = 1;
    let isMuted = false;

    // Track elements
    const tracks = Array.from(document.querySelectorAll('.oor-artist-track'));
    
    if (tracks.length === 0) return;

    // Track click handlers
    tracks.forEach(function(track, index) {
      track.addEventListener('click', function(e) {
        // Пропускаем клик, если он был по элементам плеера (прогресс-бар, кнопки и т.д.)
        const player = document.querySelector('.oor-artist-player');
        if (player && player.contains(e.target)) {
          return;
        }
        
        // Пропускаем клик, если он был по прогресс-бару или его элементам
        if (playerProgressBar && (playerProgressBar.contains(e.target) || e.target.closest('.oor-artist-player-progress-bar'))) {
          return;
        }
        
        const trackSrc = track.dataset.trackSrc;
        const trackName = track.querySelector('.oor-artist-track-name').textContent;
        
        if (currentTrack === track && isPlaying) {
          // Pause current track
          pauseTrack();
        } else if (currentTrack === track && !isPlaying) {
          // Resume current track
          playTrack();
        } else {
          // Play new track
          loadAndPlayTrack(track, trackSrc, trackName);
        }
      });
    });

    // Player controls
    if (playerPlayPause) {
      playerPlayPause.addEventListener('click', function() {
        if (isPlaying) {
          pauseTrack();
        } else {
          playTrack();
        }
      });
    }

    if (playerPrev) {
      playerPrev.addEventListener('click', function() {
        const currentIndex = tracks.indexOf(currentTrack);
        if (currentIndex > 0) {
          const prevTrack = tracks[currentIndex - 1];
          const trackSrc = prevTrack.dataset.trackSrc;
          const trackName = prevTrack.querySelector('.oor-artist-track-name').textContent;
          loadAndPlayTrack(prevTrack, trackSrc, trackName);
        }
      });
    }

    if (playerNext) {
      playerNext.addEventListener('click', function() {
        const currentIndex = tracks.indexOf(currentTrack);
        if (currentIndex < tracks.length - 1) {
          const nextTrack = tracks[currentIndex + 1];
          const trackSrc = nextTrack.dataset.trackSrc;
          const trackName = nextTrack.querySelector('.oor-artist-track-name').textContent;
          loadAndPlayTrack(nextTrack, trackSrc, trackName);
        }
      });
    }

    // Progress bar interaction
    if (playerProgressBar) {
      // Функция для выполнения перемотки
      function performSeek(clientX) {
        if (!playerProgressBar || !audio.src) {
          return;
        }
        
        const rect = playerProgressBar.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(x / rect.width, 1));
        
        // Всегда устанавливаем currentTime - браузер сам обработает
        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0 && isFinite(audio.duration)) {
          // Duration загружен - используем его
          const newTime = percentage * audio.duration;
          if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0 && newTime <= audio.duration) {
            audio.currentTime = newTime;
          }
        } else {
          // Duration не загружен - устанавливаем currentTime с примерной длительностью
          const estimatedDuration = 180; // 3 минуты
          const estimatedTime = Math.max(0, percentage * estimatedDuration);
          audio.currentTime = estimatedTime;
          
          // Ждем загрузки метаданных для точной перемотки
          const seekHandler = function() {
            if (audio.duration && !isNaN(audio.duration) && audio.duration > 0 && isFinite(audio.duration)) {
              const newTime = percentage * audio.duration;
              if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0 && newTime <= audio.duration) {
                audio.currentTime = newTime;
              }
            }
          };
          audio.addEventListener('loadedmetadata', seekHandler, { once: true });
        }
      }
      
      // Handle dragging
      let isDragging = false;
      let dragStartX = 0;
      let hasMoved = false;

      if (playerHandle) {
        playerHandle.addEventListener('mousedown', function(e) {
          isDragging = true;
          hasMoved = false;
          dragStartX = e.clientX;
          e.preventDefault();
          e.stopPropagation();
        });
      }

      // Обработчик клика по прогресс-бару
      playerProgressBar.addEventListener('click', function(e) {
        // Пропускаем, если клик был по handle
        if (playerHandle && (e.target === playerHandle || playerHandle.contains(e.target))) {
          return;
        }
        
        e.stopPropagation();
        performSeek(e.clientX);
      });
      
      // Обработчик клика по fill
      if (playerProgress) {
        playerProgress.addEventListener('click', function(e) {
          e.stopPropagation();
          performSeek(e.clientX);
        });
      }

      document.addEventListener('mousemove', function(e) {
        if (isDragging && audio.src && playerProgressBar) {
          // Проверяем, действительно ли произошло движение (больше 5px)
          if (Math.abs(e.clientX - dragStartX) > 5) {
            hasMoved = true;
          }
          
          const rect = playerProgressBar.getBoundingClientRect();
          const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
          const percentage = Math.max(0, Math.min(x / rect.width, 1));
          
          if (audio.duration && !isNaN(audio.duration) && audio.duration > 0 && isFinite(audio.duration)) {
            const newTime = percentage * audio.duration;
            if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0 && newTime <= audio.duration) {
              audio.currentTime = newTime;
            }
          } else {
            // Duration не загружен - используем примерную длительность
            const estimatedDuration = 180;
            const estimatedTime = Math.max(0, percentage * estimatedDuration);
            audio.currentTime = estimatedTime;
          }
        }
      });

      document.addEventListener('mouseup', function(e) {
        // Сбрасываем hasMoved только если это был реальный drag
        if (isDragging && hasMoved) {
          // Не обрабатываем клик после drag
          setTimeout(function() {
            hasMoved = false;
          }, 0);
        } else {
          hasMoved = false;
        }
        isDragging = false;
      });
    }

    // Volume control
    if (playerVolumeBar) {
      playerVolumeBar.addEventListener('click', function(e) {
        const rect = playerVolumeBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(x / rect.width, 1));
        
        savedVolume = percentage;
        audio.volume = percentage;
        isMuted = false;
        updateVolumeDisplay(percentage);
      });

      // Handle dragging for volume
      let isVolumeDragging = false;
      if (playerVolumeHandle) {
        playerVolumeHandle.addEventListener('mousedown', function(e) {
          isVolumeDragging = true;
          e.preventDefault();
          e.stopPropagation();
        });
      }

      document.addEventListener('mousemove', function(e) {
        if (isVolumeDragging && playerVolumeBar) {
          const rect = playerVolumeBar.getBoundingClientRect();
          const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
          const percentage = Math.max(0, Math.min(x / rect.width, 1));
          
          savedVolume = percentage;
          audio.volume = percentage;
          isMuted = false;
          updateVolumeDisplay(percentage);
        }
      });

      document.addEventListener('mouseup', function() {
        isVolumeDragging = false;
      });
    }

    // Mute/unmute functionality
    if (playerVolumeBtn) {
      playerVolumeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isMuted) {
          // Unmute - restore saved volume
          audio.volume = savedVolume;
          isMuted = false;
          updateVolumeDisplay(savedVolume);
        } else {
          // Mute - save current volume and set to 0
          savedVolume = audio.volume;
          audio.volume = 0;
          isMuted = true;
          updateVolumeDisplay(0);
        }
      });
    }

    function updateVolumeDisplay(percentage) {
      if (playerVolumeFill) {
        playerVolumeFill.style.width = (percentage * 100) + '%';
      }
      if (playerVolumeHandle) {
        playerVolumeHandle.style.left = (percentage * 100) + '%';
      }
    }

    // Audio event listeners
    audio.addEventListener('timeupdate', function() {
      if (!audio.duration) return;
      
      const percentage = (audio.currentTime / audio.duration) * 100;
      
      if (playerProgress) {
        playerProgress.style.width = percentage + '%';
      }
      
      if (playerHandle) {
        playerHandle.style.left = percentage + '%';
      }
      
      if (playerTime) {
        playerTime.textContent = formatTime(audio.currentTime);
      }

      // Update track progress circle
      if (currentTrack) {
        const progressFill = currentTrack.querySelector('.oor-artist-track-progress-fill');
        if (progressFill) {
          const circumference = 2 * Math.PI * 85; // radius = 85
          const offset = circumference - (percentage / 100) * circumference;
          progressFill.style.strokeDashoffset = offset;
        }
      }
    });

    audio.addEventListener('ended', function() {
      // Reset progress on current track
      if (currentTrack) {
        const progressFill = currentTrack.querySelector('.oor-artist-track-progress-fill');
        if (progressFill) {
          const circumference = 2 * Math.PI * 85;
          progressFill.style.strokeDashoffset = circumference;
        }
      }

      // Auto play next track
      const currentIndex = tracks.indexOf(currentTrack);
      if (currentIndex < tracks.length - 1) {
        const nextTrack = tracks[currentIndex + 1];
        const trackSrc = nextTrack.dataset.trackSrc;
        const trackName = nextTrack.querySelector('.oor-artist-track-name').textContent;
        loadAndPlayTrack(nextTrack, trackSrc, trackName);
      } else {
        pauseTrack();
      }
    });

    audio.addEventListener('loadedmetadata', function() {
      if (playerTime) {
        playerTime.textContent = formatTime(0) + ' / ' + formatTime(audio.duration);
      }
    });

    // Helper functions
    function loadAndPlayTrack(track, src, name) {
      // Remove playing class from all tracks and reset progress
      tracks.forEach(function(t) {
        t.classList.remove('playing');
        const progressFill = t.querySelector('.oor-artist-track-progress-fill');
        if (progressFill) {
          const circumference = 2 * Math.PI * 85;
          progressFill.style.strokeDashoffset = circumference;
        }
        // Возвращаем иконку плей на всех треках
        const trackPlayIcon = t.querySelector('.oor-artist-track-play-icon');
        if (trackPlayIcon) {
          trackPlayIcon.src = '/public/assets/artist-page/play-track.svg';
          trackPlayIcon.style.display = 'block';
        }
      });

      // Set current track
      currentTrack = track;
      currentTrack.classList.add('playing');

      // Update player
      // Важно: сначала останавливаем текущее воспроизведение
      audio.pause();
      audio.currentTime = 0;
      audio.src = src;
      if (playerTrackName) {
        playerTrackName.textContent = name;
      }
      
      // Ждем загрузки метаданных для получения duration
      const metadataHandler = function() {
        if (playerTime && audio.duration) {
          playerTime.textContent = formatTime(0) + ' / ' + formatTime(audio.duration);
        }
      };
      audio.addEventListener('loadedmetadata', metadataHandler, { once: true });

      // Play audio
      audio.play().then(function() {
        isPlaying = true;
        updatePlayPauseButton();
      }).catch(function(error) {
        console.error('Error playing audio:', error);
        isPlaying = false;
        updatePlayPauseButton();
      });
    }

    function playTrack() {
      if (!audio.src) {
        // Load first track if no track is loaded
        if (tracks.length > 0) {
          const firstTrack = tracks[0];
          const trackSrc = firstTrack.dataset.trackSrc;
          const trackName = firstTrack.querySelector('.oor-artist-track-name').textContent;
          loadAndPlayTrack(firstTrack, trackSrc, trackName);
        }
        return;
      }

      audio.play().then(function() {
        isPlaying = true;
        updatePlayPauseButton();
      }).catch(function(error) {
        console.error('Error playing audio:', error);
      });
    }

    function pauseTrack() {
      if (audio.src) {
        audio.pause();
      }
      isPlaying = false;
      updatePlayPauseButton();
    }

    function updatePlayPauseButton() {
      if (!playerPlayPause) return;

      const playIcon = playerPlayPause.querySelector('.oor-artist-player-play-icon');
      const pauseIcon = playerPlayPause.querySelector('.oor-artist-player-pause-icon');

      if (playIcon && pauseIcon) {
        // Принудительно обновляем иконки
        if (isPlaying) {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
        } else {
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        }
        // Принудительный reflow для гарантированного обновления
        void playerPlayPause.offsetHeight;
      }
      
      // Обновляем иконку на текущем треке
      updateTrackPlayIcon();
    }
    
    function updateTrackPlayIcon() {
      if (!currentTrack) return;
      
      const trackPlayIcon = currentTrack.querySelector('.oor-artist-track-play-icon');
      if (trackPlayIcon) {
        // При воспроизведении показываем иконку паузы, при паузе - иконку плей
        if (isPlaying) {
          trackPlayIcon.src = '/public/assets/artist-page/pause-track.svg';
          trackPlayIcon.style.display = 'block';
        } else {
          trackPlayIcon.src = '/public/assets/artist-page/play-track.svg';
          trackPlayIcon.style.display = 'block';
        }
      }
    }

    function formatTime(seconds) {
      if (isNaN(seconds)) return '00:00';
      
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      
      return (minutes < 10 ? '0' : '') + minutes + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // Set initial volume
    audio.volume = 1;
    savedVolume = 1;
    updateVolumeDisplay(1);
  }
})();
