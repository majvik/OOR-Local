/**
 * ========================================
 * MERCH IMAGES DYNAMIC SIZING
 * ========================================
 * 
 * Скрипт для динамического изменения размеров изображений мерча
 * Обеспечивает равномерное распределение изображений в сетке
 * 
 * @author OOR Development Team
 * @version 1.0.0
 * @since 2025-09-21
 * 
 * FEATURES:
 * - Автоматический расчет размеров изображений
 * - Равномерное распределение в сетке
 * - Адаптивность под размер контейнера
 * - Оптимизация для разных разрешений
 * 
 * USAGE:
 * Автоматически выполняется при загрузке страницы и изменении размера окна
 */
/**
 * Динамически изменяет размеры изображений мерча для равномерного распределения
 * @function resizeMerchImages
 * @returns {void}
 */
function resizeMerchImages() {
    // Disable dynamic sizing on very small screens (425px and below)
    if (window.innerWidth <= 425) {
        const imageEls = document.querySelectorAll('.oor-merch-image-item img');
        imageEls.forEach(img => {
            img.style.width = '100%';
            img.style.height = 'auto';
        });
        return;
    }

    const grid = document.querySelector('.oor-merch-images-grid');
    const wrapper = document.querySelector('.oor-merch-images-wrapper');
    const imageItems = document.querySelectorAll('.oor-merch-image-item');
    
    if (!grid || !wrapper || imageItems.length === 0) return;
    
    // Reset all images to natural size
    imageItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            img.style.width = 'auto';
            img.style.height = 'auto';
        }
    });
    
    // Get available width (grid width minus padding)
    const availableWidth = grid.offsetWidth - 96; // 48px padding on each side
    const gap = 16;
    const gapsTotal = (imageItems.length - 1) * gap;
    const imagesWidth = availableWidth - gapsTotal;
    
    // Calculate total natural width of all images
    let totalNaturalWidth = 0;
    const naturalWidths = [];
    
    imageItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            const aspectRatio = naturalWidth / naturalHeight;
            naturalWidths.push({ width: naturalWidth, height: naturalHeight, ratio: aspectRatio });
            totalNaturalWidth += naturalWidth;
        }
    });
    
    if (totalNaturalWidth === 0) return;
    
    // Calculate scale factor to fit all images
    const scaleFactor = imagesWidth / totalNaturalWidth;
    
    // Apply calculated widths to images
    imageItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img && naturalWidths[index]) {
            const newWidth = naturalWidths[index].width * scaleFactor;
            const newHeight = naturalWidths[index].height * scaleFactor;
            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
        }
    });
}

// Resize on load and window resize
window.addEventListener('load', () => {
    // Wait for images to load
    setTimeout(resizeMerchImages, 100);
});
window.addEventListener('resize', resizeMerchImages);

// Also resize when images load
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.oor-merch-image-item img');
    images.forEach(img => {
        if (img.complete) {
            resizeMerchImages();
        } else {
            img.addEventListener('load', resizeMerchImages);
        }
    });
});
