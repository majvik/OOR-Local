<?php
/**
 * Template for displaying single artist post
 * Шаблон для отображения страницы артиста
 */

get_header();
?>

<!-- Breadcrumbs -->
    <div class="oor-artist-breadcrumbs">
        <a href="/artists.html" class="oor-artist-breadcrumb-link rolling-button"><span class="tn-atom">артисты</span></a>
        <span class="oor-artist-breadcrumb-dot"></span>
        <span class="oor-artist-breadcrumb-current">dsprit</span>
    </div>

    <!-- Main Content -->
    <main class="oor-artist-main">
        <!-- Left - Description with gradient background -->
        <div class="oor-artist-description-container">
            <h1 class="oor-artist-title">DSPRITE</h1>
            <div class="oor-artist-description-wrapper">
                <div class="oor-artist-description-content" id="artist-description">
                    <p>Васютинский Мирослав Вадимович (родился 4 января в Волгограде) — российский хип-хоп исполнитель и продюсер.</p>
                    <p class="oor-artist-description-expanded">Он начал заниматься музыкой в подростковом возрасте, вдохновляясь как западным рэпом, так и отечественными исполнителями. Свой первый микстейп выпустил в 2017 году, который получил внимание в локальном андеграунд-сообществе.</p>
                    <p class="oor-artist-description-expanded">В 2019 году DSPRITE подписал контракт с независимым лейблом Out of Records, что стало поворотным моментом в его карьере. Под крылом лейбла он выпустил несколько успешных синглов и дебютный альбом "Эхо улиц", который принес ему широкую известность.</p>
                </div>
                <button class="oor-artist-description-toggle" id="description-toggle">подробнее</button>
            </div>

            <!-- Social Links -->
            <div class="oor-artist-social-links">
                <a href="#" class="oor-artist-social-link rolling-button"><span class="tn-atom">Яндекс Музыка</span></a>
                <a href="#" class="oor-artist-social-link rolling-button"><span class="tn-atom">ВК музыка</span></a>
                <a href="#" class="oor-artist-social-link rolling-button"><span class="tn-atom">Apple</span></a>
                <a href="#" class="oor-artist-social-link rolling-button"><span class="tn-atom">Spotify</span></a>
                <a href="#" class="oor-artist-social-link rolling-button"><span class="tn-atom">МТС Музыка</span></a>
            </div>
        </div>

        <!-- Center - Artist Image (full height, pinned to bottom) -->
        <div class="oor-artist-image-container">
            <picture>
                <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="DSPRITE" class="oor-artist-image-main no-parallax">
            </picture>
        </div>

        <!-- Right Side - Tracks Grid (3 columns) -->
        <div class="oor-artist-tracks-container">
            <div class="oor-artist-tracks-grid">
                <!-- Track 1 -->
                <div class="oor-artist-track" data-track-id="1" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Бьется" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Бьется</span>
                        <span class="oor-artist-track-year">2015</span>
                    </div>
                </div>

                <!-- Track 2 -->
                <div class="oor-artist-track" data-track-id="2" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Пустота" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Пустота</span>
                        <span class="oor-artist-track-year">2015</span>
                    </div>
                </div>

                <!-- Track 3 -->
                <div class="oor-artist-track" data-track-id="3" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Парфюм" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Парфюм</span>
                        <span class="oor-artist-track-year">2015</span>
                    </div>
                </div>

                <!-- Track 4 -->
                <div class="oor-artist-track" data-track-id="4" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Химия" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Химия</span>
                        <span class="oor-artist-track-year">2015</span>
                    </div>
                </div>

                <!-- Track 5 -->
                <div class="oor-artist-track" data-track-id="5" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Новый трек" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Новый трек</span>
                        <span class="oor-artist-track-year">2024</span>
                    </div>
                </div>

                <!-- Track 6 -->
                <div class="oor-artist-track" data-track-id="6" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Еще один" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Еще один</span>
                        <span class="oor-artist-track-year">2023</span>
                    </div>
                </div>

                <!-- Track 7 -->
                <div class="oor-artist-track" data-track-id="7" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Мечты" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Мечты</span>
                        <span class="oor-artist-track-year">2022</span>
                    </div>
                </div>

                <!-- Track 8 -->
                <div class="oor-artist-track" data-track-id="8" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Ночь" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Ночь</span>
                        <span class="oor-artist-track-year">2021</span>
                    </div>
                </div>

                <!-- Track 9 -->
                <div class="oor-artist-track" data-track-id="9" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Звезды" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Звезды</span>
                        <span class="oor-artist-track-year">2020</span>
                    </div>
                </div>

                <!-- Track 10 -->
                <div class="oor-artist-track" data-track-id="10" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Рассвет" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Рассвет</span>
                        <span class="oor-artist-track-year">2019</span>
                    </div>
                </div>

                <!-- Track 11 -->
                <div class="oor-artist-track" data-track-id="11" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Закат" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Закат</span>
                        <span class="oor-artist-track-year">2018</span>
                    </div>
                </div>

                <!-- Track 12 -->
                <div class="oor-artist-track" data-track-id="12" data-track-src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/test.mp3">
                    <div class="oor-artist-track-cover">
                        <picture>
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.avif 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.avif 2x" type="image/avif">
                            <source srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.webp 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.webp 2x" type="image/webp">
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png" srcset="<?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite.png 1x, <?php echo get_template_directory_uri(); ?>/public/assets/artist-dsprite@2x.png 2x" alt="Лето" class="oor-artist-track-image no-parallax">
                        </picture>
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">Лето</span>
                        <span class="oor-artist-track-year">2017</span>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Player -->
    <div class="oor-artist-player">
        <div class="oor-artist-player-left">
            <div class="oor-artist-player-controls">
                <button class="oor-artist-player-btn" id="player-prev">
                    <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/prev-icon.svg" alt="Previous" width="24" height="24">
                </button>
                <button class="oor-artist-player-btn oor-artist-player-btn-play" id="player-play-pause">
                    <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/play-icon.svg" alt="Play" width="24" height="24" class="oor-artist-player-play-icon">
                    <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/pause-icon.svg" alt="Pause" width="24" height="24" class="oor-artist-player-pause-icon">
                </button>
                <button class="oor-artist-player-btn" id="player-next">
                    <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/next-icon.svg" alt="Next" width="24" height="24">
                </button>
            </div>
            <div class="oor-artist-player-track-name" id="player-track-name">Бьется</div>
        </div>
        <div class="oor-artist-player-center">
            <div class="oor-artist-player-progress-bar">
                <div class="oor-artist-player-progress-fill" id="player-progress"></div>
                <div class="oor-artist-player-progress-handle" id="player-handle"></div>
            </div>
        </div>
        <div class="oor-artist-player-right">
            <div class="oor-artist-player-time" id="player-time">00:00</div>
            <div class="oor-artist-player-volume">
                <button class="oor-artist-player-volume-btn" id="player-volume-btn">
                    <img src="<?php echo get_template_directory_uri(); ?>/public/assets/artist-page/volume-icon.svg" alt="Volume" width="24" height="24">
                </button>
                <div class="oor-artist-player-volume-bar-wrapper">
                    <div class="oor-artist-player-volume-bar">
                        <div class="oor-artist-player-volume-fill" id="player-volume-fill"></div>
                        <div class="oor-artist-player-volume-handle" id="player-volume-handle"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- OOR JavaScript -->
    <!-- External deps (load first) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    
    <!-- UI Scaling для больших мониторов (загружаем рано) -->
    <script src="/src/js/scale-container.js?v=20260115223720"></script>
    
    <!-- OOR JavaScript модули -->
    <script src="/src/js/modules/error-handler.js?v=20260115223720"></script>
    <script src="/src/js/modules/preloader.js?v=20260115223720"></script>
    <script src="/src/js/modules/navigation.js?v=20260115223720"></script>
    <script src="/src/js/mobile-menu.js?v=20260115223720"></script>
    <script src="/src/js/menu-sync.js?v=20260115223720"></script>
    <script src="/src/js/main.js?v=20260115223720"></script>
    
    <!-- Rolling text effect script -->
    <script defer src="/src/js/rolling-text.js?v=20260115223720"></script>
    
    <!-- MouseFollower + Custom cursor (объединенный) -->
    <script src="/src/js/cursor.js?v=20260115223720"></script>
    
    <!-- Кастомный декоративный скроллбар -->
    <div class="custom-scrollbar" id="customScrollbar">
      <div class="custom-scrollbar-track">
        <div class="custom-scrollbar-thumb" id="scrollbarThumb"></div>
    </div>
  </div>
    
    <!-- Custom scrollbar script -->
    <script src="/src/js/scrollbar.js?v=20260115223720"></script>

    <!-- Artist page script -->
    <script src="/src/js/artist-page.js?v=20260115223720"></script>

<?php
get_footer();
?>
