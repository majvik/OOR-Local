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
/vanilla
├── /public
│   ├── /assets     # оригинальные картинки/видео из Webstudio
│   ├── /fonts      # только .woff2
│   └── overlay.png # скриншот-референс главной в 1440
├── /src
│   ├── /css
│   │   ├── reset.css
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── grid.css
│   │   ├── layout.css
│   │   └── components.css
│   └── /js
│       └── main.js
└── index.html
```

### Подключение CSS
CSS файлы подключаются строго в следующем порядке:

```html
<link rel="stylesheet" href="/src/css/reset.css">
<link rel="stylesheet" href="/src/css/tokens.css">
<link rel="stylesheet" href="/src/css/base.css">
<link rel="stylesheet" href="/src/css/grid.css">
<link rel="stylesheet" href="/src/css/layout.css">
<link rel="stylesheet" href="/src/css/components.css">
```

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
- Задокументировать все кастомные классы
- Создать README с инструкциями по запуску
- Описать структуру проекта

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
- **Все пути к ассетам** относительные и без билд-магии

> **Результат:** Когда придёт время, эта структура мапится 1:1 на шаблонные части (header, footer, template-parts, partials) — без переписывания стилей.

### H) Итоговый чек-лист «Идентичность достигнута»

- [ ] При ширине 1440-1920px overlay практически черный (difference)
- [ ] Визуально 1:1: размеры, расположение, переносы строк
- [ ] Везде 12-колонок, боковые поля 48px, gap 16px
- [ ] Нет `!important` и инлайнов, DOM плоский
- [ ] Шрифты — только используемые начертания, метрики совпадают
- [ ] Видеофоны/изображения без «ступенек», без разрывов

### I) Правила работы с Git

- [ ] **Коммиты только по запросу:** Все изменения должны быть закоммичены только после явного запроса пользователя
- [ ] **Описательные сообщения:** Каждый коммит должен содержать понятное описание изменений
- [ ] **Чистая история:** Избегать множественных мелких коммитов, группировать связанные изменения
- [ ] **Проверка перед коммитом:** Убедиться, что все изменения протестированы и работают корректно