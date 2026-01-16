<?php
/**
 * Template Name: Контакты
 * Шаблон для страницы контактов
 */

get_header();
?>

<!-- HERO Section -->
<section class="oor-section-hero oor-contacts-hero">
    <div class="oor-container">
        <div class="oor-contacts-hero-header">
            <h1 class="oor-contacts-hero-title">КОНТАКТЫ</h1>
            <p class="oor-contacts-hero-copyright"><?php echo date('Y'); ?>©</p>
        </div>
    </div>
</section>

<!-- Contacts Content Section -->
<section class="oor-contacts-content-section">
    <div class="oor-container">
        <div class="oor-contacts-content">
            <?php
            // Выводим контент страницы, если он есть
            while (have_posts()) :
                the_post();
                ?>
                <div class="oor-contacts-text">
                    <?php the_content(); ?>
                </div>
                <?php
            endwhile;
            ?>
            
            <!-- Контактная информация -->
            <div class="oor-contacts-info">
                <div class="oor-contacts-info-item">
                    <h3 class="oor-contacts-info-title">Email</h3>
                    <a href="mailto:info@OOR.com" class="oor-contacts-info-link rolling-button">
                        <span class="tn-atom">info@OOR.com</span>
                    </a>
                </div>
                
                <!-- Можно добавить больше контактной информации через ACF поля -->
                <?php
                $phone = get_field('contact_phone');
                $address = get_field('contact_address');
                $social_links = get_field('contact_social_links');
                
                if ($phone || $address || $social_links) :
                    ?>
                    <div class="oor-contacts-info-additional">
                        <?php if ($phone) : ?>
                            <div class="oor-contacts-info-item">
                                <h3 class="oor-contacts-info-title">Телефон</h3>
                                <a href="tel:<?php echo esc_attr($phone); ?>" class="oor-contacts-info-link">
                                    <?php echo esc_html($phone); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($address) : ?>
                            <div class="oor-contacts-info-item">
                                <h3 class="oor-contacts-info-title">Адрес</h3>
                                <p class="oor-contacts-info-text"><?php echo esc_html($address); ?></p>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($social_links) : ?>
                            <div class="oor-contacts-info-item">
                                <h3 class="oor-contacts-info-title">Соцсети</h3>
                                <div class="oor-contacts-social-links">
                                    <?php foreach ($social_links as $link) : ?>
                                        <a href="<?php echo esc_url($link['url']); ?>" 
                                           class="oor-contacts-social-link rolling-button"
                                           target="_blank"
                                           rel="noopener noreferrer">
                                            <span class="tn-atom"><?php echo esc_html($link['platform']); ?></span>
                                        </a>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<?php
get_footer();
?>
