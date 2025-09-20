/**
 * ========================================
 * NAVIGATION MODULE
 * ========================================
 * 
 * Модуль навигации для OOR проекта
 * Вынесен из main.js для модульности
 * 
 * @author OOR Development Team
 * @version 1.0.0
 * @since 2025-09-21
 * 
 * FEATURES:
 * - Инициализация навигации
 * - Обработка кликов по ссылкам
 * - Активные состояния
 * - Плавные переходы
 */

/**
 * Инициализация навигации
 * @function initNavigation
 * @returns {void}
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.oor-nav-link');
  const currentPath = window.location.pathname;
  
  // Устанавливаем активное состояние для текущей страницы
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '#')) {
      link.classList.add('oor-nav-link--active');
    }
    
    // Обработка кликов
    link.addEventListener('click', handleNavClick);
  });
  
  /**
   * Обрабатывает клики по навигационным ссылкам
   * @function handleNavClick
   * @param {Event} event - Событие клика
   * @returns {void}
   */
  function handleNavClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    
    // Если это якорная ссылка или внешняя ссылка
    if (href.startsWith('#') || href.startsWith('http')) {
      return; // Позволяем браузеру обработать ссылку
    }
    
    // Для внутренних ссылок можно добавить плавный переход
    if (href !== '#' && !href.startsWith('mailto:')) {
      event.preventDefault();
      // Здесь можно добавить логику плавного перехода
      // window.location.href = href;
    }
  }
}

// Экспорт для использования в main.js
window.initNavigation = initNavigation;
