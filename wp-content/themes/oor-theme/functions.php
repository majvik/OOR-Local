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

// Подключение вспомогательных файлов
require_once get_template_directory() . '/inc/cpt.php';
require_once get_template_directory() . '/inc/enqueue.php';
require_once get_template_directory() . '/inc/body-classes.php';

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
