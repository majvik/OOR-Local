# OOR Webstudio

Ванильная HTML/CSS/JS разметка сайта с пиксель-перфект точностью. Проект готов к миграции на WordPress.

## Запуск

```bash
python3 -m http.server 8040
# Открыть http://localhost:8040
```

Альтернативы: `npx serve .` или `php -S localhost:8040`

## Структура проекта

```
/OOR-webstudio-netlify
├── /public/           # Медиа ресурсы
│   ├── /assets/      # Изображения, видео
│   └── /fonts/       # Шрифты
├── /src/
│   ├── /css/         # Модульные стили (12 файлов)
│   │   ├── reset.css
│   │   ├── tokens.css      # CSS переменные
│   │   ├── base.css
│   │   ├── grid.css        # 12-колоночная сетка
│   │   ├── layout.css
│   │   ├── fonts.css
│   │   ├── utilities.css
│   │   ├── slider.css
│   │   ├── scrollbar.css
│   │   ├── animations.css
│   │   ├── components.css
│   │   └── cursor.css
│   └── /js/          # JavaScript модули
│       ├── main.js
│       ├── cursor.js       # MouseFollower
│       ├── config.js       # Конфигурация путей
│       ├── slider.js
│       ├── mobile-menu.js
│       ├── menu-sync.js
│       ├── scrollbar.js
│       ├── scale-container.js
│       ├── merch-images.js
│       ├── merch-filter.js
│       ├── size-sync.js
│       ├── rolling-text.js
│       ├── artist-page.js
│       ├── events-slider.js
│       ├── studio-equipment-accordion.js
│       ├── talk-show-parallax.js
│       └── /modules/
│           ├── error-handler.js
│           ├── navigation.js
│           ├── preloader.js
│           └── video.js      # Пустой (функции в main.js)
├── /artists/         # HTML страницы артистов
├── /scripts/         # Node.js скрипты обработки
│   ├── process-artists.js
│   ├── prepare-main-page-artists.js
│   ├── update-cache-version.js
│   └── check-mp3-headers.js
├── *.html           # 13 основных HTML страниц + 5 страниц артистов = 18 страниц
├── README.md
├── SPEC.md          # Техническое задание
└── package.json
```

## Основные технологии

- **Сетка**: 12 колонок, gap 16px, контейнер 1440px с отступами 48px
- **CSS**: Модульная архитектура с переменными в `tokens.css` (12 файлов)
- **JavaScript**: Модульная структура, ErrorHandler, кастомный курсор
- **Зависимости**: 
  - GSAP 3.12.5 (CDN) - анимации
  - Lenis (CDN, загружается динамически) - smooth scrolling
  - MouseFollower (встроен в cursor.js) - кастомный курсор
- **Node.js скрипты**: Sharp, fluent-ffmpeg для обработки медиа

## WordPress

Проект готов к переносу на WordPress:
- CSS классы совместимы (`.current-menu-item`, `.current_page_item`)
- Модульная архитектура
- Семантическая разметка

### ⚠️ Важно: Абсолютные пути при миграции на WordPress

**Проблема:** В проекте используются абсолютные пути `/public/` и `/src/` (1628 использований в 30 файлах). В WordPress тема находится в `/wp-content/themes/theme-name/`, а не в корне сайта, поэтому абсолютные пути будут указывать на корень сайта и вернут 404.

**Где используется:**
- HTML файлы: `<link href="/src/css/reset.css">`, `<img src="/public/assets/logo.svg">`
- CSS файлы: `url("/public/fonts/pragmatica-book.ttf")`
- JavaScript файлы: `'/public/assets/plus-large.svg'`, `'/src/css/reset.css'`

**Решение при миграции:**

1. **В PHP шаблонах WordPress:**
   ```php
   // Вместо:
   <link rel="stylesheet" href="/src/css/reset.css">
   
   // Использовать:
   <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/src/css/reset.css">
   ```

2. **В CSS файлах:**
   ```css
   /* Вместо: */
   src: url("/public/fonts/pragmatica-book.ttf");
   
   /* Использовать относительные пути: */
   src: url("../public/fonts/pragmatica-book.ttf");
   /* Или через PHP переменную в style.php */
   ```

3. **В JavaScript файлах:**
   - Использовать `src/js/config.js` с настройкой `OOR_BASE_URL`
   - Или передавать базовый URL через `wp_localize_script()`

4. **Автоматизация:**
   - Создать скрипт для массовой замены путей
   - Использовать поиск и замену: `/public/` → `<?php echo get_template_directory_uri(); ?>/public/`
   - Для CSS: `/public/` → `../public/` (относительные пути)

**Файл конфигурации:** `src/js/config.js` создан для будущей миграции и может быть адаптирован для WordPress.

## Скрипты обработки

Проект включает Node.js скрипты для автоматизации:

- **`npm run build`** - обновление версий кэша для всех HTML файлов
- **`npm run process-artists`** - обработка артистов, треков и обложек

Подробное описание скриптов: [scripts/README.md](scripts/README.md)

---

**Версия**: 1.0.0  
**Дата**: 2025-01-15
