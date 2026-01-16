/**
 * Merch Filter Functionality
 * Фильтрация товаров по категориям
 */

(function() {
  'use strict';

  function initMerchFilter() {
    const filterButtons = document.querySelectorAll('.oor-merch-filter-btn');
    const products = document.querySelectorAll('.oor-merch-product');

    if (!filterButtons.length || !products.length) {
      return;
    }

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');

        // Удаляем активный класс со всех кнопок
        filterButtons.forEach(btn => {
          btn.classList.remove('oor-merch-filter-btn--active');
        });

        // Добавляем активный класс к нажатой кнопке
        this.classList.add('oor-merch-filter-btn--active');

        // Фильтруем товары
        products.forEach(product => {
          const category = product.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            product.style.display = 'block';
          } else {
            product.style.display = 'none';
          }
        });
      });
    });
  }

  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMerchFilter);
  } else {
    initMerchFilter();
  }
})();
