(function() {
  'use strict';

  function initEquipmentAccordion() {
    const rows = document.querySelectorAll('.oor-studio-equipment-row');
    const equipmentImage = document.getElementById('equipment-image');

    if (!rows.length || !equipmentImage) return;

    rows.forEach(row => {
      const headerRow = row.querySelector('.oor-studio-equipment-header-row');
      if (!headerRow) return;

      headerRow.addEventListener('click', function() {
        const isActive = row.classList.contains('oor-studio-equipment-row-active');
        const icon = row.querySelector('.oor-studio-equipment-item-icon');
        const iconImg = icon ? icon.querySelector('img') : null;
        const description = row.querySelector('.oor-studio-equipment-item-description');
        const imageUrl = row.getAttribute('data-image');

        // Закрываем все остальные строки
        rows.forEach(otherRow => {
          if (otherRow !== row) {
            otherRow.classList.remove('oor-studio-equipment-row-active');
            const otherIcon = otherRow.querySelector('.oor-studio-equipment-item-icon');
            const otherIconImg = otherIcon ? otherIcon.querySelector('img') : null;
            const otherDescription = otherRow.querySelector('.oor-studio-equipment-item-description');

            if (otherIcon) {
              otherIcon.classList.remove('oor-studio-equipment-item-icon-open');
            }

            if (otherIconImg) {
              otherIconImg.src = '/public/assets/plus-large.svg';
              otherIconImg.style.transform = 'rotate(180deg)';
            }

            if (otherDescription) {
              otherDescription.style.display = 'none';
            }
          }
        });

        // Переключаем текущую строку
        if (isActive) {
          // Закрываем
          row.classList.remove('oor-studio-equipment-row-active');
          if (icon) {
            icon.classList.remove('oor-studio-equipment-item-icon-open');
          }
          if (iconImg) {
            iconImg.src = '/public/assets/plus-large.svg';
            iconImg.style.transform = 'rotate(180deg)';
          }
          if (description) {
            description.style.display = 'none';
          }
        } else {
          // Открываем
          row.classList.add('oor-studio-equipment-row-active');
          if (icon) {
            icon.classList.add('oor-studio-equipment-item-icon-open');
          }
          if (iconImg) {
            iconImg.src = '/public/assets/minus-icon.svg';
            iconImg.style.transform = 'none';
          }
          if (description) {
            description.style.display = 'block';
          }
          if (imageUrl && equipmentImage.src !== imageUrl) {
            // Fade out
            equipmentImage.style.opacity = '0';
            
            // После fade out меняем изображение и fade in
            setTimeout(() => {
              equipmentImage.src = imageUrl;
              // Fade in
              setTimeout(() => {
                equipmentImage.style.opacity = '1';
              }, 50);
            }, 400);
          }
        }
      });
    });
  }

  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEquipmentAccordion);
  } else {
    initEquipmentAccordion();
  }
})();

