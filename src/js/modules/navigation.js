// Модуль навигации
function initNavigation() {
  const navLinks = document.querySelectorAll('.oor-nav-link');
  
  navLinks.forEach(link => {
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
