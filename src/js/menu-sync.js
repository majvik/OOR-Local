// Синхронизация меню
// Синхронизация активных состояний между десктопным и мобильным меню

class MenuSync {
  constructor() {
    this.desktopMenu = document.querySelector('.oor-nav');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.currentActiveItem = 'main';
    
    this.init();
  }
  
  init() {
    if (!this.desktopMenu || !this.mobileMenu) {
      console.warn('Menu elements not found for sync');
      return;
    }
    
    this.bindEvents();
    this.setInitialActiveState();
  }
  
  bindEvents() {
    // Синхронизация кликов по десктопному меню
    const desktopLinks = this.desktopMenu.querySelectorAll('[data-menu-item]');
    desktopLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const menuItem = link.getAttribute('data-menu-item');
        this.setActiveItem(menuItem);
        this.closeMobileMenuIfOpen();
      });
    });
    
    // Синхронизация кликов по мобильному меню
    const mobileLinks = this.mobileMenu.querySelectorAll('[data-menu-item]');
    mobileLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const menuItem = link.getAttribute('data-menu-item');
        this.setActiveItem(menuItem);
        this.closeMobileMenuIfOpen();
      });
    });
    
    // Синхронизация кнопок "Стать артистом"
    const desktopBtn = document.querySelector('.oor-btn-small[data-action="become-artist"]');
    const mobileBtn = document.querySelector('.oor-mobile-menu-btn[data-action="become-artist"]');
    
    if (desktopBtn) {
      desktopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleBecomeArtistClick();
      });
    }
    
    if (mobileBtn) {
      mobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleBecomeArtistClick();
        this.closeMobileMenuIfOpen();
      });
    }
    
    // Слушаем события открытия/закрытия мобильного меню
    window.addEventListener('mobileMenuOpen', () => {
      this.syncActiveStates();
    });
    
    window.addEventListener('mobileMenuClose', () => {
      // Дополнительная синхронизация при закрытии
      this.syncActiveStates();
    });
  }
  
  setActiveItem(menuItem) {
    this.currentActiveItem = menuItem;
    
    // Обновляем десктопное меню
    this.updateDesktopMenu(menuItem);
    
    // Обновляем мобильное меню
    this.updateMobileMenu(menuItem);
    
    // Уведомляем другие компоненты об изменении активного пункта
    window.dispatchEvent(new CustomEvent('menuItemChanged', {
      detail: { menuItem }
    }));
  }
  
  updateDesktopMenu(menuItem) {
    const desktopLinks = this.desktopMenu.querySelectorAll('[data-menu-item]');
    
    desktopLinks.forEach(link => {
      const linkMenuItem = link.getAttribute('data-menu-item');
      if (linkMenuItem === menuItem) {
        link.classList.add('oor-nav-link--active');
      } else {
        link.classList.remove('oor-nav-link--active');
      }
    });
  }
  
  updateMobileMenu(menuItem) {
    const mobileLinks = this.mobileMenu.querySelectorAll('[data-menu-item]');
    
    mobileLinks.forEach(link => {
      const linkMenuItem = link.getAttribute('data-menu-item');
      if (linkMenuItem === menuItem) {
        link.classList.add('oor-mobile-menu-link--active');
      } else {
        link.classList.remove('oor-mobile-menu-link--active');
      }
    });
  }
  
  syncActiveStates() {
    // Синхронизируем состояния при открытии мобильного меню
    const activeDesktopLink = this.desktopMenu.querySelector('.oor-nav-link--active');
    if (activeDesktopLink) {
      const menuItem = activeDesktopLink.getAttribute('data-menu-item');
      this.updateMobileMenu(menuItem);
    }
  }
  
  setInitialActiveState() {
    // Устанавливаем начальное активное состояние
    const activeDesktopLink = this.desktopMenu.querySelector('.oor-nav-link--active');
    if (activeDesktopLink) {
      const menuItem = activeDesktopLink.getAttribute('data-menu-item');
      this.setActiveItem(menuItem);
    } else {
      // Если нет активного пункта, устанавливаем 'main' по умолчанию
      this.setActiveItem('main');
    }
  }
  
  closeMobileMenuIfOpen() {
    // Закрываем мобильное меню если оно открыто
    if (window.mobileMenuInstance && window.mobileMenuInstance.isMenuOpen()) {
      window.mobileMenuInstance.closeMenu();
    }
  }
  
  handleBecomeArtistClick() {
    // Обработка клика по кнопке "Стать артистом"
    
    // Здесь можно добавить логику для обработки кнопки
    // Например, открытие формы, переход на страницу и т.д.
    
    // Уведомляем другие компоненты о клике
    window.dispatchEvent(new CustomEvent('becomeArtistClicked'));
  }
  
  // Публичные методы
  getCurrentActiveItem() {
    return this.currentActiveItem;
  }
  
  setActiveItemFromUrl() {
    // Устанавливаем активный пункт меню на основе URL
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // Простая логика определения активного пункта по URL
    let menuItem = 'main';
    
    if (path.includes('/studio') || hash === '#studio') {
      menuItem = 'studio';
    } else if (path.includes('/dawgs') || hash === '#dawgs') {
      menuItem = 'dawgs';
    } else if (path.includes('/podcast') || hash === '#podcast') {
      menuItem = 'podcast';
    } else if (path.includes('/events') || hash === '#events') {
      menuItem = 'events';
    } else if (path.includes('/merch') || hash === '#merch') {
      menuItem = 'merch';
    } else if (path.includes('/contacts') || hash === '#contacts') {
      menuItem = 'contacts';
    }
    
    this.setActiveItem(menuItem);
  }
}

// Инициализация синхронизации меню
let menuSyncInstance = null;

function initMenuSync() {
  if (menuSyncInstance) {
    // Очищаем предыдущий экземпляр если есть
    menuSyncInstance = null;
  }
  
  menuSyncInstance = new MenuSync();
}

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMenuSync);
} else {
  initMenuSync();
}

// Экспорт для внешнего использования
window.MenuSync = MenuSync;
window.menuSyncInstance = menuSyncInstance;
