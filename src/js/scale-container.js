/**
 * ========================================
 * UI SCALING ДЛЯ БОЛЬШИХ МОНИТОРОВ
 * ========================================
 * 
 * Автоматически масштабирует весь интерфейс на мониторах >1920px
 * используя CSS свойство zoom с компенсацией для fixed элементов.
 * 
 * @author OOR Development Team
 * @version 3.0.0
 * @since 2025-10-09
 * 
 * ПРЕИМУЩЕСТВА ZOOM:
 * - Простая реализация
 * - События мыши работают автоматически
 * - Slider drag работает без изменений
 * - Минимальные изменения в коде
 * 
 * КОМПЕНСАЦИЯ:
 * - Preloader, cursor, scrollbar масштабируются обратно (1/zoom)
 */

(function() {
  'use strict';
  
  // === НАСТРОЙКИ ===
  const BASE_WIDTH = 1920;  // Базовая ширина дизайна
  const MAX_ZOOM = null;    // Максимальный zoom (null = без ограничений)
  const DEBUG = false;      // Логирование в консоль
  
  // Fixed элементы которые нужно компенсировать (масштабировать обратно)
  const COMPENSATE_SELECTORS = [
    '#preloader',
    '.custom-scrollbar'
  ];
  
  // Элементы внутри которых нужна компенсация (например контент прелоадера)
  const COMPENSATE_CONTENT_SELECTORS = [
    '.oor-preloader-content'
  ];
  
  /**
   * Компенсирует zoom для fixed элементов
   */
  function compensateFixedElements(zoom) {
    // Компенсируем основные элементы
    COMPENSATE_SELECTORS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.zoom = 1 / zoom;
      });
    });
    
    // Компенсируем контент внутри элементов
    COMPENSATE_CONTENT_SELECTORS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.zoom = 1 / zoom;
      });
    });
    
    if (DEBUG && zoom !== 1) {
      console.log('[Scale] Compensated fixed elements with zoom:', (1 / zoom).toFixed(3));
    }
  }
  
  /**
   * Вычисляет и применяет zoom для текущей ширины экрана
   */
  function updateZoom() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let zoom = 1;
    
    // Масштабируем только на экранах шире базовой ширины
    if (vw > BASE_WIDTH) {
      zoom = vw / BASE_WIDTH;
      
      // Применяем ограничение максимального zoom если задано
      if (MAX_ZOOM && zoom > MAX_ZOOM) {
        zoom = MAX_ZOOM;
      }
    }
    
    // Применяем zoom к html элементу
    document.documentElement.style.zoom = zoom;
    document.documentElement.style.setProperty('--oor-zoom', zoom);
    
    // Компенсируем zoom для fixed элементов
    compensateFixedElements(zoom);
    
    // DEBUG: Проверяем что zoom применился
    if (DEBUG) {
      const computedStyle = window.getComputedStyle(document.documentElement);
      const appliedZoom = computedStyle.zoom;
      console.log('[Scale] Applied zoom to html:', appliedZoom);
      console.log('[Scale] Window innerWidth:', window.innerWidth);
      console.log('[Scale] Document body offsetWidth:', document.body.offsetWidth);
    }
    
    // Вычисляем правильный vh с учетом zoom
    // При zoom=1.5 реальный vh должен быть меньше чтобы компенсировать увеличение
    const scaledVh = (vh / zoom) * 0.01; // в px на 1vh
    document.documentElement.style.setProperty('--oor-vh', `${scaledVh}px`);
    
    // Уведомляем Lenis о изменении размеров
    if (window.lenis && typeof window.lenis.resize === 'function') {
      window.lenis.resize();
    }
    
    // Логирование для отладки
    if (DEBUG) {
      console.log(`[Scale] Width: ${vw}px, Zoom: ${zoom.toFixed(3)}x, VH: ${scaledVh.toFixed(2)}px`);
    }
    
    // Экспортируем zoom для использования в других модулях
    window.oorZoom = zoom;
  }
  
  /**
   * Инициализация при загрузке
   */
  function init() {
    if (DEBUG) {
      console.log('[Scale] Initializing zoom on html element');
    }
    
    // Применяем zoom сразу, но даем браузеру время на первичный рендер
    // Это предотвращает конфликты с CSS transitions при загрузке
    requestAnimationFrame(() => {
      updateZoom();
    });
    
    // Обновляем при изменении размера окна
    // Используем passive для производительности
    window.addEventListener('resize', updateZoom, { passive: true });
    
    // Обновляем при изменении orientation на мобильных
    window.addEventListener('orientationchange', updateZoom, { passive: true });
    
    // Следим за динамически добавляемыми элементами (например, курсор)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Проверяем курсор
            if (node.classList && node.classList.contains('mf-cursor')) {
              const zoom = window.oorZoom || 1;
              if (zoom !== 1) {
                node.style.zoom = 1 / zoom;
                if (DEBUG) {
                  console.log('[Scale] Compensated dynamically added cursor');
                }
              }
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: false
    });
    
    if (DEBUG) {
      console.log('[Scale] Initialized successfully');
    }
  }
  
  // Запускаем инициализацию когда DOM готов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM уже загружен
    init();
  }
  
  // Экспортируем функцию для возможности ручного вызова из консоли
  window.oorUpdateZoom = updateZoom;
  
})();
