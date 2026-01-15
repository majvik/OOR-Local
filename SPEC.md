# Техническое задание: Переписывание webstudio.is в ванильную разметку

## Цель проекта
Переписать экспорт webstudio.is в «ванильную» разметку с пиксель-перфект идентичностью.

## Ограничения
- **Полноэкранный десктоп 1440px-1920px** - контент центрируется, фон растягивается
- **Визуал менять нельзя** (размеры, шрифты, отступы, ассеты)
- **Главное:** Перевести «тотально на флексах» в 12-колоночный Grid
- **Сохранить 1:1 дизайн**

## Содержание

1. [Технические рамки](#технические-рамки)
2. [Структура проекта](#структура-проекта)
3. [Мини-reset и базовые токены](#мини-reset-и-базовые-токены)
4. [12-колоночный GRID](#12-колоночный-grid)
5. [Типографика](#типографика)
6. [Ассеты](#ассеты)
7. [Overlay-проверка](#overlay-проверка)
8. [Правила для рефактора](#правила-для-рефактора)
9. [Критерии готовности](#критерии-готовности)

---

## Технические рамки

### Рабочая ширина макета
- **Ширина:** 1440px - 1920px (полноэкранный десктоп)
- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`
- **Поведение:** Контент заполняет всю ширину экрана с отступами 48px
- **Адаптивность:** Никаких медиа-квери, фиксированная ширина контента

### Полноэкранное поведение
- **Секции:** `width: 100%` - растягиваются на всю ширину экрана
- **Контент:** `.oor-container` заполняет всю ширину с боковыми отступами 48px
- **Фоны:** Могут растягиваться на всю ширину секции
- **Grid:** Работает внутри контейнера с 12 колонками на всю ширину

---

## Структура проекта

```
/OOR-webstudio-netlify
├── /public
│   └── /assets     # оригинальные картинки/видео из Webstudio
├── /src
│   ├── /css
│   │   ├── reset.css
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── grid.css
│   │   ├── layout.css
│   │   ├── fonts.css
│   │   ├── utilities.css
│   │   ├── slider.css
│   │   ├── scrollbar.css
│   │   ├── animations.css
│   │   ├── components.css
│   │   └── cursor.css
│   └── /js
│       ├── main.js
│       ├── cursor.js
│       ├── config.js
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
│           └── video.js
├── index.html
├── README.md
└── SPEC.md
```

### Подключение CSS
CSS файлы подключаются строго в следующем порядке:

```html
<link rel="stylesheet" href="/src/css/reset.css">
<link rel="stylesheet" href="/src/css/tokens.css">
<link rel="stylesheet" href="/src/css/base.css">
<link rel="stylesheet" href="/src/css/grid.css">
<link rel="stylesheet" href="/src/css/layout.css">
<link rel="stylesheet" href="/src/css/fonts.css">
<link rel="stylesheet" href="/src/css/utilities.css">
<link rel="stylesheet" href="/src/css/slider.css">
<link rel="stylesheet" href="/src/css/scrollbar.css">
<link rel="stylesheet" href="/src/css/animations.css">
<link rel="stylesheet" href="/src/css/components.css">
<link rel="stylesheet" href="/src/css/cursor.css">
```

### Подключение JavaScript
JavaScript файлы подключаются в следующем порядке:

```html
<!-- External deps (load first) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

<!-- UI Scaling для больших мониторов -->
<script src="/src/js/scale-container.js"></script>

<!-- OOR JavaScript модули -->
<script src="/src/js/modules/error-handler.js"></script>
<script src="/src/js/modules/preloader.js"></script>
<script src="/src/js/modules/navigation.js"></script>
<script src="/src/js/mobile-menu.js"></script>
<script src="/src/js/menu-sync.js"></script>
<script src="/src/js/main.js"></script>

<!-- Deferred scripts -->
<script defer src="/src/js/slider.js"></script>
<script defer src="/src/js/merch-images.js"></script>
<script defer src="/src/js/size-sync.js"></script>
<script defer src="/src/js/rolling-text.js"></script>

<!-- MouseFollower + Custom cursor -->
<script src="/src/js/cursor.js"></script>

<!-- Custom scrollbar -->
<script src="/src/js/scrollbar.js"></script>
```

**Примечания:**
- Lenis загружается динамически через `preloader.js` после скрытия прелоадера
- `video.js` пустой (функции `initHeroVideo` и `initFullscreenVideo` определены в `main.js`)
- Все скрипты подключаются с версионированием кэша (`?v=timestamp`)

---

## Мини-reset и базовые токены

### reset.css
Мягкий reset (не ломаем метрики шрифтов):

```css
*,*::before,*::after{box-sizing:border-box}
html{height:100%}
body,h1,h2,h3,h4,h5,h6,p,figure,blockquote,dl,dd{margin:0}
img,svg,video{display:block;max-width:100%}
a{text-decoration:none;color:inherit}
```

### tokens.css
Цвета/шрифты из исходника:

```css
:root{
  --page-width:1440px;
  --container-x:48px;
  --grid-columns:12;
  --grid-gap:16px;

  --color-bg:#fff;
  --color-text:#000;
  --color-accent:#000;
  --color-muted:rgba(0,0,0,0.7);
  --color-black:#000;

  --font-ui:"Pragmatica Extended",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  --font-pragmatica:"Pragmatica",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  --font-size-root:16px;
  --line-height-root:1.25;

  --spacing-xs:8px;
  --spacing-sm:16px;
  --spacing-md:24px;
  --spacing-lg:48px;
  --spacing-xl:120px;
}
```

### base.css

```css
html{
  font-size:var(--font-size-root);
  height:100%;
}

body{
  min-height:100%;
  background:var(--color-bg);
  color:var(--color-text);
  line-height:var(--line-height-root);
  font-family:var(--font-ui);
  font-size:var(--font-size-root);
  margin:0;
  padding:0;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  text-rendering:geometricPrecision;
  font-synthesis:none;
}
```

---

## 12-колоночный GRID

### grid.css

```css
/* Контейнер секции с внутренними боковыми полями 48px */
.oor-container{
  width:var(--page-width);
  margin:0 auto;
  padding-left:var(--container-x);
  padding-right:var(--container-x);
}

/* Сетка 12 колонок + gap 16px */
.oor-grid{
  display:grid;
  grid-template-columns:repeat(var(--grid-columns),minmax(0,1fr));
  column-gap:var(--grid-gap);
}

/* Утилиты span/start (только на десктопе) */
[class*="oor-col-"]{min-width:0}
.oor-col-1{grid-column:span 1}
.oor-col-2{grid-column:span 2}
.oor-col-3{grid-column:span 3}
.oor-col-4{grid-column:span 4}
.oor-col-5{grid-column:span 5}
.oor-col-6{grid-column:span 6}
.oor-col-7{grid-column:span 7}
.oor-col-8{grid-column:span 8}
.oor-col-9{grid-column:span 9}
.oor-col-10{grid-column:span 10}
.oor-col-11{grid-column:span 11}
.oor-col-12{grid-column:span 12}

.oor-start-1{grid-column-start:1}
.oor-start-2{grid-column-start:2}
.oor-start-3{grid-column-start:3}
.oor-start-4{grid-column-start:4}
.oor-start-5{grid-column-start:5}
.oor-start-6{grid-column-start:6}
.oor-start-7{grid-column-start:7}
.oor-start-8{grid-column-start:8}
.oor-start-9{grid-column-start:9}
.oor-start-10{grid-column-start:10}
.oor-start-11{grid-column-start:11}
.oor-start-12{grid-column-start:12}
```

### Утилиты span/start (только на десктопе)

| Класс | Описание |
|-------|----------|
| `.oor-col-1` | `grid-column:span 1` |
| `.oor-col-2` | `grid-column:span 2` |
| `.oor-col-3` | `grid-column:span 3` |
| `.oor-col-4` | `grid-column:span 4` |
| `.oor-col-5` | `grid-column:span 5` |
| `.oor-col-6` | `grid-column:span 6` |
| `.oor-col-7` | `grid-column:span 7` |
| `.oor-col-8` | `grid-column:span 8` |
| `.oor-col-9` | `grid-column:span 9` |
| `.oor-col-10` | `grid-column:span 10` |
| `.oor-col-11` | `grid-column:span 11` |
| `.oor-col-12` | `grid-column:span 12` |

| Класс | Описание |
|-------|----------|
| `.oor-start-1` | `grid-column-start:1` |
| `.oor-start-2` | `grid-column-start:2` |
| `.oor-start-3` | `grid-column-start:3` |
| `.oor-start-4` | `grid-column-start:4` |
| `.oor-start-5` | `grid-column-start:5` |
| `.oor-start-6` | `grid-column-start:6` |
| `.oor-start-7` | `grid-column-start:7` |
| `.oor-start-8` | `grid-column-start:8` |
| `.oor-start-9` | `grid-column-start:9` |
| `.oor-start-10` | `grid-column-start:10` |
| `.oor-start-11` | `grid-column-start:11` |
| `.oor-start-12` | `grid-column-start:12` |

> **Важно:** Все прежние flex-обёртки заменить на `.oor-grid`, дочкам выдать классы `oor-col-N` (и при необходимости `oor-start-M`). Визуал не меняется.

---

## Типографика

### Зафиксировать пиксели
Все размеры, межстрочные и кернинг переносить из исходника в px:

```css
.h1{font-size:64px;line-height:72px;font-weight:700;letter-spacing:0}
.p-lg{font-size:18px;line-height:28px;letter-spacing:0.2px}
```

> **Примечание:** Внести фактические значения по Computed в DevTools исходной страницы.

---

## Ассеты

- Используем оригинальные изображения/видео из `/public/assets`
- Для `<img>` выставить реальные `width/height` атрибуты
- Фоновые видео/картинки — через абсолютный контейнер + `object-fit:cover` (точно как в исходнике)

---

## Overlay-проверка (пиксель-перфект)

### Кнопка переключения

```html
<button id="overlay-toggle" style="position:fixed;right:16px;bottom:16px;z-index:9999">Overlay</button>
```

### CSS для overlay

```css
body.overlay::before{
  content:"";position:fixed;inset:0;pointer-events:none;
  background:url("/public/overlay.png") center top no-repeat;
  background-size:var(--page-width) auto;
  opacity:.5;mix-blend-mode:difference;
}
```

### JavaScript

```javascript
document.getElementById('overlay-toggle')?.addEventListener('click',()=>document.body.classList.toggle('overlay'));
```

---

## Правила для рефактора

- [ ] Дом-дерево упростить, не меняя визуал
- [ ] Удалить инлайновые стили, `!important`, случайные глобальные резеты билдера
- [ ] Весь интерактив вынести в `/src/js/main.js`
- [ ] Никаких `rem/em/vw` на этом этапе, только `px`
- [ ] Любая оптимизация возможна только если оверлей «сливается»

---

## Критерии готовности

- [ ] Оверлей при ширине 1440-1920px «совпадает»
- [ ] Метрики шрифтов идентичны (`font-size`, `line-height`, `letter-spacing`)
- [ ] Сетки переведены на `.oor-grid/.oor-col-*`
- [ ] Нет `!important` и инлайна, HTML валиден
- [ ] Все ассеты подключены корректно
- [ ] JavaScript функционал работает

---

## Дополнительные требования

### Тестирование
- Проверить на разных браузерах (Chrome, Firefox, Safari)
- Убедиться в корректности отображения на 1440px
- Проверить производительность загрузки

### Оптимизация
- Минимизировать CSS
- Оптимизировать изображения
- Проверить скорость загрузки

### Документация
- ✅ **README.md** - Полная документация проекта с инструкциями по запуску
- ✅ **SPEC.md** - Техническое задание и спецификация проекта
- ✅ **JSDoc комментарии** - Документация JavaScript функций в коде
- ✅ **CSS комментарии** - Описания стилей в CSS файлах

---

## Расширенные инструкции

### A) Почему именно такой GRID (и как считать спаны быстро)

**Расчет размеров:**
- Внутренняя ширина контейнера: `1440 - 48*2 = 1344px`
- Суммарные промежутки: `11 * 16 = 176px`
- Ширина 12 колонок: `1344 - 176 = 1168px`
- Ширина 1 колонки: `1168 / 12 = 97.333…px`

**Формула для спана:**
```
span ≈ round( (w + 8) / (97.333... + 16) ) = round( (w + 8) / 113.333... )
```

> **Примечание:** «+8» условно учитывает половину gap; в рефакторе подгоняй по overlay, если нужно сдвинуть на ±1 колонку.

### B) Алгоритм перевода flex→grid (на секцию)

1. **Обернуть секцию** в `.oor-container`
2. **Родительский ряд:** `display:flex` заменить на `.oor-grid`
3. **Каждому прямому потомку** (карточка/колонка) выдать `oor-col-N`, где N по формуле выше (подтверждаем через overlay)
4. **Если в исходнике есть «пустые поля»/смещения** — добавить `oor-start-M`
5. **Удалить лишние обёртки** и все инлайновые стили
6. **Проверить, что высоты/отступы** содержатся в `layout.css/components.css` и строго в `px`
7. **Свериться оверлеем. Коммит.**

**Советы:**
- Избегай вложенных гридов там, где достаточно одного уровня (`.oor-grid` на уровень секции часто хватает)
- «Карточка с картинкой/текстом» — это компонент: вынеси его стили в `components.css`, разметку сделай плоской

### C) Типографика без дрейфа

- В `@font-face` подключай ровно те веса/начертания, что используются
- Везде явно ставь `letter-spacing` из исходника (даже 0)
- Для заголовков часто спасает `text-wrap:balance` (но только если не меняет переносы относительно исходника — проверяй оверлеем)

### D) Чистка Webstudio-наследия безопасно

- Запретить глобальные каскады типа `div > * { ... }`
- Именование с префиксом `oor-` для сетки и ключевых компонентов (минимум конфликтов сейчас и в будущем)
- Фоновое видео: обертка `.oor-media-cover{position:absolute;inset:0}` + `video{width:100%;height:100%;object-fit:cover}`

### E) Проверки качества (минимум багов)

- У `<img>` реальные `width/height` → никакого CLS
- У интерактивных SVG не ломать `viewBox`. Если цвет не нужно менять — подключай через `<img>`, а не inline
- Не допускай «магических» отступов. Всё должно складываться из сетки (gap) и компонентных paddings

### F) Порядок работы (reliable)

1. **Первая — Hero-секция:** она задаёт типосистему, медиа-фоны и первые паттерны сетки
2. **Повторяющиеся блоки** (карточки) — делай как один компонент, дальше переиспользуй
3. **Большие визуальные секции** с фоном — сначала контейнер/грид, потом — позиционирование фона
4. **После каждой секции** — быстрый overlay-чек и коммит

### G) Подготовка к будущему шаблону

**Сразу выстраиваем структуру, чтобы позже «безболезненно» вынести в шаблонизатор:**

- **Компоненты самодостаточны:** разметка + BEM-классы, без «утечек» глобальных правил
- **Разделение слоёв:**
  - `grid.css` — сетка (стабильна, не трогаем дальше)
  - `layout.css` — отступы секций, вертикальные ритмы
  - `components.css` — карточки/хедер/футер/герой и т.п.
- **Тексты/изображения** держи сгруппированными в HTML так, будто завтра они станут «полями» — заголовок, подпись, кнопка, картинка
- **Используй уникальные обёртки-якоря секций:** `.oor-section-hero`, `.oor-section-benefits`, `.oor-section-gallery` — это помогут потом разбить на «части шаблона»

> **Результат:** Когда придёт время, эта структура мапится 1:1 на шаблонные части (header, footer, template-parts, partials) — без переписывания стилей.

### ⚠️ КРИТИЧНО: Абсолютные пути при миграции на WordPress

**Проблема:** Проект использует абсолютные пути `/public/` и `/src/` (1628 использований в 30 файлах). В WordPress тема находится в `/wp-content/themes/theme-name/`, поэтому абсолютные пути будут указывать на корень сайта и вернут 404 для всех ресурсов.

**Масштаб проблемы:**
- HTML файлы (18 файлов): ссылки на CSS/JS и изображения
- CSS файлы (`fonts.css`, `components.css`): пути к шрифтам через `url()`
- JavaScript файлы (`preloader.js`, `cursor.js`, и др.): пути к ресурсам в коде

**Решение для миграции:**

1. **HTML → PHP шаблоны:**
   ```php
   // Заменить все:
   href="/src/css/reset.css"
   src="/public/assets/logo.svg"
   
   // На:
   href="<?php echo get_template_directory_uri(); ?>/src/css/reset.css"
   src="<?php echo get_template_directory_uri(); ?>/public/assets/logo.svg"
   ```

2. **CSS файлы:**
   ```css
   /* Заменить абсолютные пути на относительные: */
   /* Было: */
   url("/public/fonts/pragmatica-book.ttf")
   
   /* Стало: */
   url("../public/fonts/pragmatica-book.ttf")
   ```

3. **JavaScript файлы:**
   - Использовать `src/js/config.js` с `OOR_BASE_URL`
   - Или передавать через `wp_localize_script()`:
     ```php
     wp_localize_script('oor-main', 'oorPaths', [
         'base' => get_template_directory_uri(),
         'assets' => get_template_directory_uri() . '/public/assets',
         'fonts' => get_template_directory_uri() . '/public/fonts'
     ]);
     ```

4. **Автоматизация замены:**
   - Создать скрипт для массовой замены в HTML файлах
   - Использовать регулярные выражения для поиска и замены
   - Для CSS: заменить `/public/` на `../public/` (относительные пути)

**Файл конфигурации:** `src/js/config.js` создан для будущей миграции и может быть адаптирован для WordPress.

### ⚠️ Важно: Body-классы для стилей шапки при миграции на WordPress

**Проблема:** Стили шапки (`.oor-header`) завязаны на body-классы и используют `mix-blend-mode` с `!important`. По умолчанию шапка имеет `mix-blend-mode: difference` (строка 134 в `components.css`), что может привести к проблемам с контрастом на некоторых фонах, если соответствующий body-класс не установлен.

**Как это работает:**
- **Базовые стили:** `.oor-header { mix-blend-mode: difference; }` - шапка инвертирует цвета относительно фона
- **Специфичные страницы:** Каждая страница имеет свой body-класс, который переопределяет `mix-blend-mode: normal !important`
- **Мобильные устройства:** Есть защита `body:not(.oor-studio-page) .oor-header { mix-blend-mode: normal !important; }` для всех страниц кроме studio

**Список необходимых body-классов:**
- `oor-studio-page` - страница студии (черный фон шапки)
- `oor-dawgs-page` - страница DAWGS
- `oor-events-page` - страница событий
- `oor-talk-show-page` - страница ток-шоу
- `oor-artists-page` - страница списка артистов
- `oor-artist-page` - страница отдельного артиста
- `oor-manifest-page` - страница манифеста (белый фон шапки)
- `oor-services-page` - страница услуг
- `oor-merch-page` - страница магазина
- `oor-product-page` - страница продукта
- `oor-cart-page` - страница корзины
- `oor-checkout-page` - страница оформления заказа

**Решение для миграции:**

1. **В PHP шаблонах использовать `body_class()`:**
   ```php
   <body <?php body_class('preloader-active oor-studio-page'); ?>>
   ```

2. **Через фильтр `body_class` в `functions.php`:**
   ```php
   add_filter('body_class', function($classes) {
       // Для обычных страниц
       if (is_page('studio')) {
           $classes[] = 'oor-studio-page';
       } elseif (is_page('artists')) {
           $classes[] = 'oor-artists-page';
       } elseif (is_page('manifest')) {
           $classes[] = 'oor-manifest-page';
       } elseif (is_page('services')) {
           $classes[] = 'oor-services-page';
       } elseif (is_page('dawgs')) {
           $classes[] = 'oor-dawgs-page';
       } elseif (is_page('events')) {
           $classes[] = 'oor-events-page';
       } elseif (is_page('talk-show')) {
           $classes[] = 'oor-talk-show-page';
       } elseif (is_page('merch')) {
           $classes[] = 'oor-merch-page';
       } elseif (is_page('cart')) {
           $classes[] = 'oor-cart-page';
       } elseif (is_page('checkout')) {
           $classes[] = 'oor-checkout-page';
       }
       
       // Для кастомных типов постов
       if (is_singular('artist')) {
           $classes[] = 'oor-artist-page';
       } elseif (is_singular('product')) {
           $classes[] = 'oor-product-page';
       }
       
       return $classes;
   });
   ```

3. **Для главной страницы:**
   - Главная страница (`index.html`) не имеет специфичного body-класса, использует `mix-blend-mode: difference` по умолчанию
   - В WordPress можно добавить класс через `is_front_page()`:
     ```php
     if (is_front_page()) {
         // Класс не нужен, используется базовый mix-blend-mode: difference
     }
     ```

**Последствия отсутствия body-классов:**
- На десктопе шапка будет использовать `mix-blend-mode: difference` по умолчанию
- Это может привести к проблемам с контрастом на некоторых фонах
- На мобильных устройствах есть защита через общее правило отключения mix-blend-mode

**Рекомендация:** Обязательно настроить body-классы в WordPress через `body_class()` или фильтр `body_class` для всех страниц проекта.

### H) Итоговый чек-лист «Идентичность достигнута»

- [ ] При ширине 1440-1920px overlay практически черный (difference)
- [ ] Визуально 1:1: размеры, расположение, переносы строк
- [ ] Везде 12-колонок, боковые поля 48px, gap 16px
- [ ] Нет `!important` и инлайнов, DOM плоский
- [ ] Шрифты — только используемые начертания, метрики совпадают
- [ ] Видеофоны/изображения без «ступенек», без разрывов

---

## Правила безопасности

### Приоритет надежных источников
- **CDN библиотек**: Использовать только официальные CDN (jsdelivr, unpkg, cdnjs)
- **Проверенные источники**: Избегать неизвестных или подозрительных сайтов
- **HTTPS обязателен**: Все внешние ресурсы только по HTTPS
- **SRI (Subresource Integrity)**: При возможности использовать SRI для проверки целостности

### Запрещенные практики
- ❌ Загрузка скриптов с неизвестных доменов
- ❌ Использование неофициальных зеркал библиотек
- ❌ HTTP соединения для внешних ресурсов
- ❌ Смешивание источников одной библиотеки

### Рекомендуемые CDN
- ✅ `https://cdn.jsdelivr.net/` - jsDelivr (официальный)
- ✅ `https://unpkg.com/` - unpkg (официальный)
- ✅ `https://cdnjs.cloudflare.com/` - Cloudflare (официальный)
- ✅ `https://cdn.skypack.dev/` - Skypack (официальный)

---

## Оптимизации и улучшения

### CSS Design System
- **Расширенная система переменных** в `tokens.css`
- **Цветовая палитра** с семантическими названиями
- **Типографическая шкала** для консистентности
- **Z-index система** для правильного наложения
- **Переходы и анимации** через переменные

### JavaScript документация
- **JSDoc комментарии** для всех функций
- **Подробная документация** каждого модуля
- **Описание зависимостей** и API
- **Примеры использования** в комментариях

### Производительность
- **Объединенные файлы** (cursor.js = mouse-follower + custom)
- **Оптимизированные CSS переменные**
- **Защищенные критические файлы**
- **Минимизированные HTTP запросы**

---

## Защищенные файлы

### Критически важные файлы
При работе с проектом следует соблюдать осторожность при редактировании ключевых файлов:

- **`src/js/slider.js`** - Критический функционал слайдера
- **`src/css/grid.css`** - Система сетки (12 колонок)
- **`src/css/tokens.css`** - CSS переменные проекта