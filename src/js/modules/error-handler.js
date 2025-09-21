/**
 * ========================================
 * ERROR HANDLER MODULE
 * ========================================
 * 
 * Централизованная обработка ошибок для OOR проекта
 * Следует принципам Always Works™
 * 
 * @author OOR Development Team
 * @version 1.0.0
 * @since 2025-09-21
 * 
 * FEATURES:
 * - Глобальная обработка ошибок
 * - Логирование в консоль
 * - Graceful degradation
 * - Пользовательские уведомления
 */

/**
 * Класс для обработки ошибок
 */
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.isDebugMode = this.checkDebugMode();
    
    this.init();
  }

  /**
   * Проверяет режим отладки
   * @returns {boolean}
   */
  checkDebugMode() {
    return (
      typeof window !== 'undefined' && 
      window.location && 
      (window.location.search.includes('debug') || window.location.search.includes('verbose'))
    );
  }

  /**
   * Инициализирует обработчик ошибок
   */
  init() {
    // Отложенная проверка зависимостей после загрузки страницы
    this.scheduleDependencyCheck();
    
    // Глобальная обработка ошибок JavaScript
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack
      });
    });

    // Обработка необработанных промисов
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        error: event.reason,
        stack: event.reason?.stack
      });
    });

    // Обработка ошибок загрузки ресурсов
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError({
          type: 'resource',
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          src: event.target.src || event.target.href
        });
      }
    }, true);
  }

  /**
   * Планирует проверку зависимостей после завершения загрузки
   */
  scheduleDependencyCheck() {
    // Проверяем зависимости через 2 секунды после загрузки
    setTimeout(() => {
      this.checkCriticalDependencies();
    }, 2000);

    // Дополнительная проверка при завершении прелоадера
    const preloader = document.getElementById('preloader');
    if (preloader) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && 
              mutation.attributeName === 'class' && 
              preloader.classList.contains('oor-preloader-hidden')) {
            this.checkCriticalDependencies();
            observer.disconnect();
          }
        });
      });
      observer.observe(preloader, { attributes: true });
    }
  }

  /**
   * Проверяет загрузку критических зависимостей
   * Выполняется только после завершения прелоадера
   */
  checkCriticalDependencies() {
    // Проверяем, что прелоадер завершен
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('oor-preloader-hidden')) {
      // Прелоадер еще активен - не проверяем зависимости
      return;
    }

    // Проверяем GSAP только если он критичен для текущей страницы
    if (typeof gsap === 'undefined' && this.isGSAPRequired()) {
      this.handleError({
        type: 'dependency',
        message: 'GSAP library not loaded',
        dependency: 'gsap'
      });
    }

    // Проверяем MouseFollower только если курсор нужен
    if (typeof MouseFollower === 'undefined' && this.isCursorRequired()) {
      this.handleError({
        type: 'dependency',
        message: 'MouseFollower library not loaded',
        dependency: 'MouseFollower'
      });
    }

    // Lenis не критичен - только предупреждение
    if (typeof Lenis === 'undefined') {
      console.info('[OOR] Lenis library not loaded - smooth scrolling disabled');
    }
  }

  /**
   * Проверяет, нужен ли GSAP для текущей страницы
   * @returns {boolean}
   */
  isGSAPRequired() {
    // GSAP нужен только если есть анимированные элементы
    return document.querySelector('.oor-preloader, .oor-hero-video, .slider-section') !== null;
  }

  /**
   * Проверяет, нужен ли курсор для текущей страницы
   * @returns {boolean}
   */
  isCursorRequired() {
    // Курсор нужен только если есть элементы с data-cursor
    return document.querySelector('[data-cursor-text], [data-cursor-video], [data-cursor-img]') !== null;
  }

  /**
   * Обрабатывает ошибку
   * @param {Object} errorData - Данные об ошибке
   */
  handleError(errorData) {
    // Фильтруем ненужные ошибки
    if (this.shouldIgnoreError(errorData)) {
      return;
    }

    const error = {
      ...errorData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Добавляем в массив ошибок
    this.errors.push(error);
    
    // Ограничиваем количество ошибок
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Логируем в консоль
    this.logError(error);

    // Показываем пользователю в debug режиме
    if (this.isDebugMode) {
      this.showUserError(error);
    }

    // Отправляем в аналитику (если настроена)
    this.sendToAnalytics(error);
  }

  /**
   * Проверяет, нужно ли игнорировать ошибку
   * @param {Object} errorData - Данные об ошибке
   * @returns {boolean} Игнорировать ли ошибку
   */
  shouldIgnoreError(errorData) {
    // Игнорируем ошибки видео play()
    if (errorData.type === 'promise' && 
        errorData.message && 
        errorData.message.includes('play() request was interrupted')) {
      return true;
    }

    // Игнорируем AbortError для видео
    if (errorData.error && 
        errorData.error.name === 'AbortError' && 
        errorData.message && 
        errorData.message.includes('play()')) {
      return true;
    }

    // Игнорируем ошибки загрузки ресурсов для курсора
    if (errorData.type === 'resource' && 
        errorData.src && 
        errorData.src.includes('video')) {
      return true;
    }

    return false;
  }

  /**
   * Логирует ошибку в консоль
   * @param {Object} error - Данные об ошибке
   */
  logError(error) {
    const logMethod = this.isDebugMode ? 'error' : 'warn';
    
    console[logMethod](`[OOR Error] ${error.type.toUpperCase()}:`, {
      message: error.message,
      timestamp: error.timestamp,
      ...(this.isDebugMode && {
        stack: error.stack,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno
      })
    });
  }

  /**
   * Показывает ошибку пользователю в debug режиме
   * @param {Object} error - Данные об ошибке
   */
  showUserError(error) {
    // Создаем уведомление об ошибке
    const notification = document.createElement('div');
    notification.className = 'oor-error-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    notification.innerHTML = `
      <strong>Error: ${error.type}</strong><br>
      ${error.message}<br>
      <small>${error.timestamp}</small>
    `;

    document.body.appendChild(notification);

    // Автоматически удаляем через 5 секунд
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  /**
   * Отправляет ошибку в аналитику
   * @param {Object} error - Данные об ошибке
   */
  sendToAnalytics(error) {
    // Здесь можно добавить отправку в Google Analytics, Sentry и т.д.
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }

  /**
   * Получает все ошибки
   * @returns {Array} Массив ошибок
   */
  getErrors() {
    return [...this.errors];
  }

  /**
   * Очищает все ошибки
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Получает статистику ошибок
   * @returns {Object} Статистика
   */
  getStats() {
    const stats = {
      total: this.errors.length,
      byType: {},
      recent: this.errors.slice(-10)
    };

    this.errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
    });

    return stats;
  }
}

/**
 * Создаем глобальный экземпляр обработчика ошибок
 */
const errorHandler = new ErrorHandler();

/**
 * Функция для безопасного выполнения кода
 * @param {Function} fn - Функция для выполнения
 * @param {*} fallback - Значение по умолчанию при ошибке
 * @returns {*} Результат выполнения или fallback
 */
function safeExecute(fn, fallback = null) {
  try {
    return fn();
  } catch (error) {
    errorHandler.handleError({
      type: 'safeExecute',
      message: error.message,
      error: error,
      stack: error.stack
    });
    return fallback;
  }
}

/**
 * Функция для безопасного выполнения асинхронного кода
 * @param {Function} fn - Асинхронная функция
 * @param {*} fallback - Значение по умолчанию при ошибке
 * @returns {Promise} Промис с результатом или fallback
 */
async function safeExecuteAsync(fn, fallback = null) {
  try {
    return await fn();
  } catch (error) {
    errorHandler.handleError({
      type: 'safeExecuteAsync',
      message: error.message,
      error: error,
      stack: error.stack
    });
    return fallback;
  }
}

/**
 * Функция для проверки доступности API
 * @param {string} apiName - Название API
 * @param {Function} checkFn - Функция проверки
 * @returns {boolean} Доступно ли API
 */
function checkAPI(apiName, checkFn) {
  try {
    const result = checkFn();
    if (!result) {
      errorHandler.handleError({
        type: 'apiCheck',
        message: `API ${apiName} is not available`,
        apiName: apiName
      });
    }
    return !!result;
  } catch (error) {
    errorHandler.handleError({
      type: 'apiCheck',
      message: `API ${apiName} check failed: ${error.message}`,
      apiName: apiName,
      error: error
    });
    return false;
  }
}

/**
 * Функция для безопасной загрузки скриптов
 * @param {string} src - URL скрипта
 * @param {Object} options - Опции загрузки
 * @returns {Promise} Промис загрузки
 */
function loadScript(src, options = {}) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = options.async !== false;
    script.defer = options.defer || false;
    
    script.onload = () => {
      errorHandler.handleError({
        type: 'scriptLoad',
        message: `Script loaded successfully: ${src}`,
        src: src
      });
      resolve(script);
    };
    
    script.onerror = (error) => {
      errorHandler.handleError({
        type: 'scriptLoad',
        message: `Failed to load script: ${src}`,
        src: src,
        error: error
      });
      reject(error);
    };
    
    document.head.appendChild(script);
  });
}

// Делаем функции доступными глобально
window.OOR = window.OOR || {};
window.OOR.errorHandler = errorHandler;
window.OOR.safeExecute = safeExecute;
window.OOR.safeExecuteAsync = safeExecuteAsync;
window.OOR.checkAPI = checkAPI;
window.OOR.loadScript = loadScript;
