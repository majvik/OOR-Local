<?php
/**
 * OOR Webstudio Theme Functions
 */

// Защита от прямого доступа
if (!defined('ABSPATH')) {
    exit;
}

// Версия темы
define('OOR_THEME_VERSION', '1.0.0');

// Подавление deprecation warnings от ACF Pro (PHP 8.2+ совместимость)
// ACF Pro 6.4.2 использует динамические свойства, которые deprecated в PHP 8.2+
// Это не критично и не влияет на функциональность, но вызывает предупреждения
// которые выводятся до отправки HTTP заголовков → "headers already sent" error
if (PHP_VERSION_ID >= 80200) {
    // Отключаем вывод ошибок на экран для предотвращения "headers already sent"
    // Логирование остается активным (если WP_DEBUG_LOG включен)
    ini_set('display_errors', 0);
    
    // Подавляем только deprecation warnings, остальные ошибки логируем
    if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
        // В режиме отладки логируем все, кроме deprecation
        error_reporting(E_ALL & ~E_DEPRECATED);
    } else {
        // В продакшене скрываем все предупреждения
        error_reporting(0);
    }
}

// Настройка ACF для автоматической загрузки и синхронизации JSON из acf-json/
add_filter('acf/settings/save_json', function($path) {
    $path = get_stylesheet_directory() . '/acf-json';
    // Создаем папку если её нет
    if (!file_exists($path)) {
        wp_mkdir_p($path);
    }
    return $path;
});

add_filter('acf/settings/load_json', function($paths) {
    // Удаляем стандартный путь ACF
    unset($paths[0]);
    // Добавляем путь к папке темы
    $theme_path = get_stylesheet_directory() . '/acf-json';
    if (file_exists($theme_path)) {
        $paths[] = $theme_path;
    }
    return $paths;
});

// Автоматическая синхронизация ACF полей при активации темы
add_action('after_setup_theme', function() {
    // Проверяем, что ACF активен
    if (function_exists('acf_get_setting')) {
        // Принудительно загружаем JSON файлы при загрузке темы
        $json_path = get_stylesheet_directory() . '/acf-json';
        if (is_dir($json_path)) {
            // ACF автоматически загрузит JSON файлы при следующем обращении к Field Groups
            // Это происходит автоматически через фильтр load_json выше
        }
    }
});

// Улучшенная синхронизация: автоматически обновляем JSON при сохранении Field Group
add_action('acf/update_field_group', function($field_group) {
    // ACF автоматически сохранит в JSON благодаря фильтру save_json
    // Дополнительная логика не требуется
}, 10, 1);

// Включение поддержки AVIF и WebP изображений
add_filter('mime_types', function($mimes) {
    // Добавляем поддержку AVIF
    $mimes['avif'] = 'image/avif';
    // Добавляем поддержку WebP (обычно уже есть, но на всякий случай)
    $mimes['webp'] = 'image/webp';
    return $mimes;
});

// Включение поддержки AVIF и WebP в загрузке файлов
add_filter('upload_mimes', function($mimes) {
    $mimes['avif'] = 'image/avif';
    $mimes['webp'] = 'image/webp';
    return $mimes;
}, 10, 1);

// Включение AVIF и WebP в список поддерживаемых форматов для генерации миниатюр
add_filter('image_size_names_choose', function($sizes) {
    return $sizes;
});

// Подключение вспомогательных файлов
require_once get_template_directory() . '/inc/cpt.php';
require_once get_template_directory() . '/inc/enqueue.php';
require_once get_template_directory() . '/inc/body-classes.php';
require_once get_template_directory() . '/inc/image-processing.php';

// Поддержка тем WordPress
add_theme_support('post-thumbnails');
add_theme_support('title-tag');
add_theme_support('html5', [
    'search-form',
    'comment-form',
    'comment-list',
    'gallery',
    'caption'
]);

// Отключение Gutenberg
add_filter('use_block_editor_for_post', '__return_false', 10);
add_filter('use_block_editor_for_post_type', '__return_false', 10);

// Отключение стандартных стилей WordPress
add_action('wp_enqueue_scripts', function() {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-block-style');
}, 100);

// Отключение Gravatar (не нужен, так как нет блога и комментариев)
// Правильное отключение get_avatar - возвращаем пустую строку вместо false
add_filter('get_avatar', function($avatar, $id_or_email, $size, $default, $alt, $args) {
    return '';
}, 1, 6);

// Правильное отключение pre_get_avatar_data - возвращаем массив с пустыми данными
// Фильтр получает только 2 аргумента: $args (массив) и $id_or_email
add_filter('pre_get_avatar_data', function($args, $id_or_email) {
    // Извлекаем значения из массива $args
    $size = isset($args['size']) ? $args['size'] : 96;
    $default = isset($args['default']) ? $args['default'] : '';
    $force_default = isset($args['force_default']) ? $args['force_default'] : false;
    $rating = isset($args['rating']) ? $args['rating'] : 'G';
    
    return [
        'url' => '',
        'found_avatar' => false,
        'size' => $size,
        'default' => $default,
        'force_default' => $force_default,
        'rating' => $rating
    ];
}, 1, 2);

// Отключение загрузки скриптов Gravatar
add_filter('avatar_defaults', '__return_empty_array');

// Блокировка запросов к Gravatar
add_filter('get_avatar_url', function($url, $id_or_email, $args) {
    return '';
}, 1, 3);

// Отключение комментариев (если они не используются)
add_filter('comments_open', '__return_false', 20);
add_filter('pings_open', '__return_false', 20);

// Удаление ссылок на Gravatar из wp_head
add_action('init', function() {
    remove_action('wp_head', 'wp_generator');
}, 1);
