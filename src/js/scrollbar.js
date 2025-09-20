/**
 * ========================================
 * CUSTOM SCROLLBAR
 * ========================================
 * 
 * Модуль кастомного скроллбара для OOR проекта
 * Вынесен из inline скрипта для модульности
 * 
 * @author OOR Development Team
 * @version 1.0.0
 * @since 2025-09-21
 * 
 * FEATURES:
 * - Кастомный визуальный скроллбар
 * - Автоматическое скрытие через 1 секунду
 * - Адаптивность под размер контента
 * - Плавные анимации
 */

/**
 * Инициализация кастомного скроллбара
 * @function initCustomScrollbar
 * @returns {void}
 */
function initCustomScrollbar() {
  let scrollTimeout;
  const customScrollbar = document.getElementById('customScrollbar');
  const scrollbarThumb = document.getElementById('scrollbarThumb');
  
  if (!customScrollbar || !scrollbarThumb) {
    console.warn('Custom scrollbar elements not found');
    return;
  }
  
  /**
   * Обновляет позицию и размер скроллбара
   * @function updateScrollbar
   * @returns {void}
   */
  function updateScrollbar() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Показываем скроллбар
    customScrollbar.classList.add('visible');
    
    // Вычисляем высоту и позицию ползунка
    const thumbHeight = (windowHeight / documentHeight) * windowHeight;
    const thumbTop = (scrollTop / (documentHeight - windowHeight)) * (windowHeight - thumbHeight);
    
    scrollbarThumb.style.height = thumbHeight + 'px';
    scrollbarThumb.style.top = thumbTop + 'px';
    
    // Скрываем скроллбар через 1 секунду после остановки скролла
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      customScrollbar.classList.remove('visible');
    }, 1000);
  }
  
  // Обработчики событий
  window.addEventListener('scroll', updateScrollbar);
  window.addEventListener('resize', updateScrollbar);
  
  // Инициализация при загрузке
  updateScrollbar();
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', initCustomScrollbar);
