<?php
/**
 * Управление body-классами
 */

function oor_body_classes($classes) {
    // Статические страницы
    if (is_page('studio')) {
        $classes[] = 'oor-studio-page';
    } elseif (is_page('artists') || is_post_type_archive('artist')) {
        $classes[] = 'oor-artists-page';
    } elseif (is_page('manifest')) {
        $classes[] = 'oor-manifest-page';
    } elseif (is_page('services')) {
        $classes[] = 'oor-services-page';
    } elseif (is_page('dawgs')) {
        $classes[] = 'oor-dawgs-page';
    } elseif (is_page('talk-show')) {
        $classes[] = 'oor-talk-show-page';
    } elseif (is_page('merch')) {
        $classes[] = 'oor-merch-page';
    } elseif (is_page('contacts')) {
        $classes[] = 'oor-contacts-page';
    }
    
    // Custom Post Types
    if (is_singular('artist')) {
        $classes[] = 'oor-artist-page';
    } elseif (is_singular('event')) {
        $classes[] = 'oor-event-page';
    } elseif (is_post_type_archive('event')) {
        $classes[] = 'oor-events-page';
    }
    
    return $classes;
}
add_filter('body_class', 'oor_body_classes');
