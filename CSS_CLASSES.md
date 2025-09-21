# CSS Классы - Полная документация

## 📋 Содержание
1. [Сетка и контейнеры](#сетка-и-контейнеры)
2. [Навигация](#навигация)
3. [Кнопки](#кнопки)
4. [Типографика](#типографика)
5. [Компоненты](#компоненты)
6. [Утилиты](#утилиты)
7. [Анимации](#анимации)
8. [Курсор](#курсор)

---

## Сетка и контейнеры

### `.oor-container`
**Назначение**: Основной контейнер с отступами 48px по бокам
```css
.oor-container {
  width: 1440px;
  margin: 0 auto;
  padding-left: 48px;
  padding-right: 48px;
}
```

### `.oor-grid`
**Назначение**: 12-колоночная сетка с gap 16px
```css
.oor-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 16px;
}
```

### Колонки `.oor-col-*`
**Назначение**: Классы для span колонок (1-12)

| Класс | Описание | Grid свойство |
|-------|----------|---------------|
| `.oor-col-1` | 1 колонка | `grid-column: span 1` |
| `.oor-col-2` | 2 колонки | `grid-column: span 2` |
| `.oor-col-3` | 3 колонки | `grid-column: span 3` |
| `.oor-col-4` | 4 колонки | `grid-column: span 4` |
| `.oor-col-5` | 5 колонок | `grid-column: span 5` |
| `.oor-col-6` | 6 колонок | `grid-column: span 6` |
| `.oor-col-7` | 7 колонок | `grid-column: span 7` |
| `.oor-col-8` | 8 колонок | `grid-column: span 8` |
| `.oor-col-9` | 9 колонок | `grid-column: span 9` |
| `.oor-col-10` | 10 колонок | `grid-column: span 10` |
| `.oor-col-11` | 11 колонок | `grid-column: span 11` |
| `.oor-col-12` | 12 колонок | `grid-column: span 12` |

### Позиционирование `.oor-start-*`
**Назначение**: Классы для start позиций (1-12)

| Класс | Описание | Grid свойство |
|-------|----------|---------------|
| `.oor-start-1` | Начать с 1 колонки | `grid-column-start: 1` |
| `.oor-start-2` | Начать с 2 колонки | `grid-column-start: 2` |
| `.oor-start-3` | Начать с 3 колонки | `grid-column-start: 3` |
| `.oor-start-4` | Начать с 4 колонки | `grid-column-start: 4` |
| `.oor-start-5` | Начать с 5 колонки | `grid-column-start: 5` |
| `.oor-start-6` | Начать с 6 колонки | `grid-column-start: 6` |
| `.oor-start-7` | Начать с 7 колонки | `grid-column-start: 7` |
| `.oor-start-8` | Начать с 8 колонки | `grid-column-start: 8` |
| `.oor-start-9` | Начать с 9 колонки | `grid-column-start: 9` |
| `.oor-start-10` | Начать с 10 колонки | `grid-column-start: 10` |
| `.oor-start-11` | Начать с 11 колонки | `grid-column-start: 11` |
| `.oor-start-12` | Начать с 12 колонки | `grid-column-start: 12` |

---

## Навигация

### `.oor-nav`
**Назначение**: Контейнер навигации
```css
.oor-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### `.oor-nav-list`
**Назначение**: Список пунктов навигации
```css
.oor-nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}
```

### `.oor-nav-item`
**Назначение**: Элемент навигации
```css
.oor-nav-item {
  margin-right: 32px;
}
```

### `.oor-nav-link`
**Назначение**: Ссылка навигации
```css
.oor-nav-link {
  text-decoration: none;
  color: inherit;
  font-size: 16px;
  line-height: 1.4em;
}
```

### `.oor-nav-link--active`
**Назначение**: Активная ссылка навигации
```css
.oor-nav-link--active {
  /* Стили активного состояния */
}
```

### WordPress совместимость
```css
/* WordPress автоматически добавит эти классы */
.current-menu-item .oor-nav-link,
.current_page_item .oor-nav-link,
.current-menu-ancestor .oor-nav-link {
  /* Стили активного состояния */
}
```

---

## Кнопки

### `.oor-btn`
**Назначение**: Базовая кнопка
```css
.oor-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  background: #000;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}
```

### `.oor-btn-small`
**Назначение**: Маленькая кнопка
```css
.oor-btn-small {
  padding: 8px 16px;
  font-size: 14px;
}
```

### `.oor-btn-small-text`
**Назначение**: Текст маленькой кнопки
```css
.oor-btn-small-text {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

### `.oor-btn-small-icon`
**Назначение**: Иконка маленькой кнопки
```css
.oor-btn-small-icon {
  width: 17px;
  height: 17px;
}
```

---

## Типографика

### `.h1`
**Назначение**: Заголовок H1
```css
.h1 {
  font-size: 64px;
  line-height: 72px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}
```

### `.h2`
**Назначение**: Заголовок H2
```css
.h2 {
  font-size: 48px;
  line-height: 56px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}
```

### `.h3`
**Назначение**: Заголовок H3
```css
.h3 {
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}
```

### `.p-lg`
**Назначение**: Большой параграф
```css
.p-lg {
  font-size: 18px;
  line-height: 28px;
  letter-spacing: 0.2px;
}
```

### `.p-md`
**Назначение**: Средний параграф
```css
.p-md {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0;
}
```

### `.p-sm`
**Назначение**: Маленький параграф
```css
.p-sm {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
}
```

---

## Компоненты

### `.oor-card`
**Назначение**: Карточка контента
```css
.oor-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### `.oor-hero`
**Назначение**: Герой секция
```css
.oor-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### `.oor-section`
**Назначение**: Секция контента
```css
.oor-section {
  padding: 120px 0;
}
```

### `.oor-media-cover`
**Назначение**: Обертка для медиа (видео/изображения)
```css
.oor-media-cover {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
```

---

## Утилиты

### `.u-overflow-x-hidden`
**Назначение**: Скрыть горизонтальный скролл
```css
.u-overflow-x-hidden {
  overflow-x: hidden;
}
```

### `.u-scrollbar-hide`
**Назначение**: Скрыть скроллбар
```css
.u-scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.u-scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### `.u-text-center`
**Назначение**: Центрировать текст
```css
.u-text-center {
  text-align: center;
}
```

### `.u-text-left`
**Назначение**: Выровнять текст по левому краю
```css
.u-text-left {
  text-align: left;
}
```

### `.u-text-right`
**Назначение**: Выровнять текст по правому краю
```css
.u-text-right {
  text-align: right;
}
```

---

## Анимации

### `.rolling-button`
**Назначение**: Кнопка с rolling эффектом
```css
.rolling-button {
  position: relative;
  overflow: hidden;
  display: inline-block;
}
```

### `.tn-atom`
**Назначение**: Атом для rolling анимации
```css
.tn-atom {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### `.block`
**Назначение**: Блок для rolling анимации
```css
.block {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## Курсор

### MouseFollower атрибуты
**Назначение**: Атрибуты для кастомного курсора

| Атрибут | Описание | Пример |
|---------|----------|--------|
| `data-cursor` | Тип курсора | `data-cursor="text"` |
| `data-cursor-text` | Текст для курсора | `data-cursor-text="Кликни"` |
| `data-cursor-img` | Изображение для курсора | `data-cursor-img="/path/to/image.jpg"` |
| `data-cursor-video` | Видео для курсора | `data-cursor-video="/path/to/video.mp4"` |

### CSS классы курсора
```css
/* Базовые стили курсора */
.mf-cursor {
  /* Стили основного курсора */
}

.mf-cursor-text {
  /* Стили текстового курсора */
}

.mf-cursor-media {
  /* Стили медиа курсора */
}
```

---

## Использование

### Пример базовой сетки
```html
<div class="oor-container">
  <div class="oor-grid">
    <div class="oor-col-6">
      <!-- Контент на 6 колонок -->
    </div>
    <div class="oor-col-6">
      <!-- Контент на 6 колонок -->
    </div>
  </div>
</div>
```

### Пример навигации
```html
<nav class="oor-nav">
  <ul class="oor-nav-list">
    <li class="oor-nav-item">
      <a href="/" class="oor-nav-link oor-nav-link--active">Главная</a>
    </li>
    <li class="oor-nav-item">
      <a href="/about" class="oor-nav-link">О нас</a>
    </li>
  </ul>
</nav>
```

### Пример кнопки
```html
<button class="oor-btn oor-btn-small">
  <span class="oor-btn-small-text">
    <span class="oor-btn-small-icon">
      <svg>...</svg>
    </span>
    Текст кнопки
  </span>
</button>
```

---

## Обновление документации

### При добавлении нового класса
1. Добавить описание в этот файл
2. Указать назначение и примеры использования
3. Обновить README.md
4. Проверить актуальность

### При изменении существующего класса
1. Обновить описание в этом файле
2. Обновить примеры использования
3. Проверить совместимость
4. Обновить README.md

---

**Последнее обновление**: 2025-09-21  
**Версия**: 1.0.0
