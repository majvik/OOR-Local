// Модуль навигации
function initNavigation() {
  const navLinks = document.querySelectorAll('.oor-nav-link');
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '#')) {
      link.classList.add('oor-nav-link--active');
    }
    
    link.addEventListener('click', handleNavClick);
  });
  
  function handleNavClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    
    if (href.startsWith('#') || href.startsWith('http')) {
      return;
    }
    
    if (href !== '#' && !href.startsWith('mailto:')) {
      event.preventDefault();
    }
  }
}
window.initNavigation = initNavigation;
