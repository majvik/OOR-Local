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
├── /public/assets/     # Изображения, видео, шрифты
├── /src/
│   ├── /css/          # Модульные стили
│   │   ├── reset.css
│   │   ├── tokens.css      # CSS переменные
│   │   ├── base.css
│   │   ├── grid.css        # 12-колоночная сетка
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── ...
│   └── /js/           # JavaScript модули
│       ├── main.js
│       ├── cursor.js       # MouseFollower
│       └── /modules/
│           ├── error-handler.js
│           ├── navigation.js
│           ├── preloader.js
│           └── video.js
├── index.html
├── README.md
└── SPEC.md            # Техническое задание
```

## Основные технологии

- **Сетка**: 12 колонок, gap 16px, контейнер 1440px с отступами 48px
- **CSS**: Модульная архитектура с переменными в `tokens.css`
- **JavaScript**: Модульная структура, ErrorHandler, кастомный курсор
- **Зависимости**: GSAP (CDN)

## WordPress

Проект готов к переносу на WordPress:
- CSS классы совместимы (`.current-menu-item`, `.current_page_item`)
- Модульная архитектура
- Семантическая разметка
- Относительные пути

---

**Версия**: 1.0.0  
**Дата**: 2025-10-29
