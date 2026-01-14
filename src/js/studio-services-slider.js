(function() {
  'use strict';

  let isInitialized = false;

  function initServicesSlider() {
    // Работаем только на мобильных устройствах (≤768px)
    if (window.innerWidth > 768) {
      // На десктопе показываем все описания
      const serviceDescriptions = document.querySelectorAll('.oor-studio-service-description');
      serviceDescriptions.forEach(desc => {
        desc.classList.remove('active');
        desc.style.display = '';
      });
      isInitialized = false;
      return;
    }

    // Если уже инициализировано, не делаем повторно
    if (isInitialized) {
      return;
    }

    const serviceItems = document.querySelectorAll('.oor-studio-service-item');
    const serviceDescriptions = document.querySelectorAll('.oor-studio-service-description');

    if (!serviceItems.length || !serviceDescriptions.length) return;

    // Скрываем все описания на мобильных
    serviceDescriptions.forEach(desc => {
      desc.style.display = 'none';
      desc.classList.remove('active');
    });

    // Показываем первое описание по умолчанию
    if (serviceDescriptions[0]) {
      serviceDescriptions[0].classList.add('active');
      serviceDescriptions[0].style.display = 'block';
    }

    serviceItems.forEach((item, index) => {
      const serviceContent = item.querySelector('.oor-studio-service-content');
      if (!serviceContent) return;

      // Удаляем старые обработчики если есть
      const newContent = serviceContent.cloneNode(true);
      serviceContent.parentNode.replaceChild(newContent, serviceContent);

      newContent.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Убираем активный класс со всех описаний
        serviceDescriptions.forEach(desc => {
          desc.classList.remove('active');
          desc.style.display = 'none';
        });

        // Добавляем активный класс к соответствующему описанию
        if (serviceDescriptions[index]) {
          serviceDescriptions[index].classList.add('active');
          serviceDescriptions[index].style.display = 'block';
        }
      });
    });

    isInitialized = true;
  }

  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesSlider);
  } else {
    initServicesSlider();
  }

  // Переинициализация при изменении размера окна
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      isInitialized = false;
      initServicesSlider();
    }, 100);
  });
})();
