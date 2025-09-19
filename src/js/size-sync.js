// Универсальная синхронизация размеров элементов
class SizeSync {
    constructor() {
        this.syncTasks = [];
        this.init();
    }

    // Добавить задачу синхронизации
    addSyncTask(sourceSelector, targetSelector, options = {}) {
        const task = {
            sourceSelector,
            targetSelector,
            syncWidth: options.syncWidth !== false,
            syncHeight: options.syncHeight || false,
            offsetWidth: options.offsetWidth || 0,
            offsetHeight: options.offsetHeight || 0
        };
        this.syncTasks.push(task);
        return this;
    }

    // Выполнить синхронизацию для всех задач
    sync() {
        this.syncTasks.forEach(task => {
            const sourceElement = document.querySelector(task.sourceSelector);
            const targetElement = document.querySelector(task.targetSelector);
            
            if (sourceElement && targetElement) {
                if (task.syncWidth) {
                    const width = sourceElement.offsetWidth + task.offsetWidth;
                    targetElement.style.width = width + 'px';
                }
                
                if (task.syncHeight) {
                    const height = sourceElement.offsetHeight + task.offsetHeight;
                    targetElement.style.height = height + 'px';
                }
                
                console.log('Size synced:', {
                    source: task.sourceSelector,
                    target: task.targetSelector,
                    width: task.syncWidth ? sourceElement.offsetWidth + 'px' : 'not synced',
                    height: task.syncHeight ? sourceElement.offsetHeight + 'px' : 'not synced'
                });
            } else {
                console.log('Elements not found:', {
                    source: task.sourceSelector,
                    target: task.targetSelector,
                    sourceFound: !!sourceElement,
                    targetFound: !!targetElement
                });
            }
        });
    }

    // Инициализация с задержками
    init() {
        const initWithDelay = () => {
            setTimeout(() => this.sync(), 100);
            setTimeout(() => this.sync(), 500);
            setTimeout(() => this.sync(), 1000);
        };

        // Выполняем синхронизацию при загрузке страницы
        document.addEventListener('DOMContentLoaded', initWithDelay);

        // Выполняем синхронизацию при изменении размера окна
        window.addEventListener('resize', () => this.sync());

        // Выполняем синхронизацию после загрузки изображений
        window.addEventListener('load', initWithDelay);
    }
}

// Создаем экземпляр синхронизатора
const sizeSync = new SizeSync();

// Синхронизация ширины кнопки "Стать артистом" с первым изображением
sizeSync.addSyncTask(
    '.oor-quality-img-container-1',
    '.oor-become-artist-button',
    { syncWidth: true, syncHeight: false }
);

// Синхронизация ширины кнопки "Манифест" с изображением "без страха"
sizeSync.addSyncTask(
    '.oor-without-fear-image',
    '.oor-manifesto-button',
    { syncWidth: true, syncHeight: false }
);
