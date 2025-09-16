/**
 * Zoom Script for OOR Website
 * Отключает респонзив и зумит страницу после 1920px
 * Корректно обрабатывает 100vh и 100vw
 */

(function() {
    'use strict';
    
    let isZoomed = false;
    let zoomScale = 1;
    let originalViewport = '';
    
    // Минимальная ширина для зума
    const MIN_ZOOM_WIDTH = 1920;
    
    // Функция для получения текущего масштаба
    function getZoomScale() {
        const windowWidth = window.innerWidth;
        if (windowWidth > MIN_ZOOM_WIDTH) {
            return windowWidth / MIN_ZOOM_WIDTH;
        }
        return 1;
    }
    
    // Функция для обновления CSS переменных для корректной работы 100vh/100vw
    function updateViewportUnits() {
        if (isZoomed) {
            // При зуме корректируем viewport units
            const vh = window.innerHeight / zoomScale;
            const vw = window.innerWidth / zoomScale;
            
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            document.documentElement.style.setProperty('--vw', `${vw}px`);
        } else {
            // Без зума используем стандартные значения
            document.documentElement.style.setProperty('--vh', '1vh');
            document.documentElement.style.setProperty('--vw', '1vw');
        }
    }
    
    // Функция для применения зума
    function applyZoom() {
        const windowWidth = window.innerWidth;
        
        if (windowWidth > MIN_ZOOM_WIDTH && !isZoomed) {
            // Включаем зум
            isZoomed = true;
            zoomScale = getZoomScale();
            
            // Сохраняем оригинальный viewport
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            if (viewportMeta) {
                originalViewport = viewportMeta.getAttribute('content');
                viewportMeta.setAttribute('content', 'width=1920, initial-scale=1, maximum-scale=1, user-scalable=no');
            }
            
            // Применяем зум к body
            document.body.style.transform = `scale(${zoomScale})`;
            document.body.style.transformOrigin = 'top left';
            document.body.style.width = `${MIN_ZOOM_WIDTH}px`;
            document.body.style.height = '100vh';
            document.body.style.overflow = 'hidden';
            
            // Обновляем viewport units
            updateViewportUnits();
            
            console.log(`Zoom applied: ${zoomScale}x`);
            
        } else if (windowWidth <= MIN_ZOOM_WIDTH && isZoomed) {
            // Отключаем зум
            isZoomed = false;
            zoomScale = 1;
            
            // Восстанавливаем оригинальный viewport
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            if (viewportMeta && originalViewport) {
                viewportMeta.setAttribute('content', originalViewport);
            }
            
            // Убираем зум с body
            document.body.style.transform = '';
            document.body.style.transformOrigin = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.overflow = '';
            
            // Обновляем viewport units
            updateViewportUnits();
            
            console.log('Zoom disabled');
        }
    }
    
    // Функция для обновления зума при изменении размера окна
    function handleResize() {
        if (isZoomed) {
            const newZoomScale = getZoomScale();
            if (Math.abs(newZoomScale - zoomScale) > 0.01) {
                zoomScale = newZoomScale;
                document.body.style.transform = `scale(${zoomScale})`;
                updateViewportUnits();
                console.log(`Zoom updated: ${zoomScale}x`);
            }
        } else {
            applyZoom();
        }
    }
    
    // Функция для корректировки высоты при зуме
    function adjustHeight() {
        if (isZoomed) {
            const scaledHeight = window.innerHeight / zoomScale;
            document.body.style.height = `${scaledHeight}px`;
        }
    }
    
    // Инициализация
    function init() {
        // Применяем зум при загрузке
        applyZoom();
        
        // Слушаем изменения размера окна
        window.addEventListener('resize', handleResize);
        
        // Слушаем изменения ориентации
        window.addEventListener('orientationchange', function() {
            setTimeout(handleResize, 100);
        });
        
        // Корректируем высоту при изменении размера
        window.addEventListener('resize', adjustHeight);
        
        console.log('Zoom script initialized');
    }
    
    // Запускаем после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Экспортируем функции для внешнего использования
    window.OORZoom = {
        isZoomed: () => isZoomed,
        getZoomScale: () => zoomScale,
        applyZoom: applyZoom,
        updateViewportUnits: updateViewportUnits
    };
    
})();
