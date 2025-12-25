const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');

// Конфигурация
const ARTISTS_SOURCE_DIR = '/Users/vik/Yandex.Disk.localized/Загрузки/1. Лейбл/Артисты';
const PROJECT_ROOT = path.join(__dirname, '..');
const ASSETS_DIR = path.join(PROJECT_ROOT, 'public', 'assets', 'artists');
const ARTISTS_OUTPUT_DIR = path.join(PROJECT_ROOT, 'artists');

// Утилиты для транслитерации
function transliterate(str) {
  const map = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };
  
  return str
    .split('')
    .map(char => map[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Создание slug
function createSlug(name) {
  return transliterate(name)
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .toLowerCase();
}

// Извлечение года из даты
function extractYear(dateStr) {
  const match = dateStr.match(/(\d{4})/);
  return match ? parseInt(match[1]) : new Date().getFullYear();
}

// Извлечение даты из названия папки
function extractDate(folderName) {
  const match = folderName.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  return null;
}

// Извлечение названия трека из папки
function extractTrackName(folderName, artistName) {
  let name = folderName;
  
  // Убираем префикс артиста (если есть)
  if (name.toLowerCase().startsWith(artistName.toLowerCase() + ' ')) {
    name = name.substring(artistName.length).trim();
  } else if (name.toLowerCase().startsWith(artistName.toLowerCase() + ' - ')) {
    name = name.substring(artistName.length + 3).trim();
  } else if (name.toLowerCase().startsWith(artistName.toLowerCase() + ' — ')) {
    // Тире (—) вместо дефиса
    name = name.substring(artistName.length + 3).trim();
  } else if (name.includes(' - ')) {
    // Если есть " - ", берем часть после дефиса
    const parts = name.split(' - ');
    if (parts.length > 1) {
      name = parts.slice(1).join(' - ');
    }
  } else if (name.includes(' — ')) {
    // Если есть " — ", берем часть после тире
    const parts = name.split(' — ');
    if (parts.length > 1) {
      name = parts.slice(1).join(' — ');
    }
  }
  
  // Убираем дату в формате DD.MM.YYYY или DD.MM.YY
  name = name.replace(/\s+\d{1,2}\.\d{1,2}\.\d{2,4}.*$/, '');
  
  // Убираем дефисы, тире и пробелы в начале и конце
  name = name.replace(/^[-\s—]+/, '').replace(/[-\s—]+$/, '').trim();
  
  return name || folderName;
}

// Поиск первого изображения в папке
async function findFirstImage(dir) {
  try {
    const files = await fs.readdir(dir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP'];
    
    for (const file of files.sort()) {
      const ext = path.extname(file);
      if (imageExtensions.includes(ext)) {
        return path.join(dir, file);
      }
    }
  } catch (error) {
    // Папка не существует или ошибка чтения
  }
  return null;
}

// Поиск WAV файла в папке
async function findWavFile(dir) {
  try {
    const files = await fs.readdir(dir);
    for (const file of files.sort()) {
      if (file.toLowerCase().endsWith('.wav')) {
        return path.join(dir, file);
      }
    }
  } catch (error) {
    // Папка не существует или ошибка чтения
  }
  return null;
}

// Обработка изображения артиста
async function processArtistImage(inputPath, outputDir, slug) {
  if (!inputPath) {
    console.warn(`  ⚠️  Изображение артиста не найдено для ${slug}`);
    return null;
  }

  const sizes = [
    { suffix: '', size: 1280 },
    { suffix: '@2x', size: 2560 }
  ];

  const formats = [
    { ext: 'avif', mime: 'image/avif' },
    { ext: 'webp', mime: 'image/webp' },
    { ext: 'png', mime: 'image/png' }
  ];

  for (const size of sizes) {
    for (const format of formats) {
      const outputPath = path.join(outputDir, `main${size.suffix}.${format.ext}`);
      
      try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        // Вычисляем размеры с сохранением пропорций (cover)
        let width, height;
        if (metadata.width > metadata.height) {
          width = size.size;
          height = null;
        } else {
          width = null;
          height = size.size;
        }

        await image
          .resize(width, height, {
            fit: 'cover',
            position: 'center'
          })
          .toFormat(format.ext === 'avif' ? 'avif' : format.ext === 'webp' ? 'webp' : 'png')
          .toFile(outputPath);
        
        console.log(`    ✓ Создано: main${size.suffix}.${format.ext}`);
      } catch (error) {
        console.error(`    ✗ Ошибка создания main${size.suffix}.${format.ext}:`, error.message);
      }
    }
  }

  return {
    avif: '/public/assets/artists/' + slug + '/main.avif',
    webp: '/public/assets/artists/' + slug + '/main.webp',
    png: '/public/assets/artists/' + slug + '/main.png',
    avif2x: '/public/assets/artists/' + slug + '/main@2x.avif',
    webp2x: '/public/assets/artists/' + slug + '/main@2x.webp',
    png2x: '/public/assets/artists/' + slug + '/main@2x.png'
  };
}

// Создание плейсхолдера
async function createPlaceholder(outputDir, trackSlug) {
  const sizes = [
    { suffix: '', size: 480 },
    { suffix: '@2x', size: 960 }
  ];

  const formats = [
    { ext: 'avif', mime: 'image/avif' },
    { ext: 'webp', mime: 'image/webp' },
    { ext: 'png', mime: 'image/png' }
  ];

  // Создаем серый квадрат
  const grayColor = { r: 128, g: 128, b: 128, alpha: 1 };

  for (const size of sizes) {
    for (const format of formats) {
      const outputPath = path.join(outputDir, `cover${size.suffix}.${format.ext}`);
      
      try {
        await sharp({
          create: {
            width: size.size,
            height: size.size,
            channels: 4,
            background: grayColor
          }
        })
          .toFormat(format.ext === 'avif' ? 'avif' : format.ext === 'webp' ? 'webp' : 'png')
          .toFile(outputPath);
        
        console.log(`    ✓ Создан плейсхолдер: cover${size.suffix}.${format.ext}`);
      } catch (error) {
        console.error(`    ✗ Ошибка создания плейсхолдера:`, error.message);
      }
    }
  }

  // Получаем slug артиста из пути
  const artistSlug = path.basename(path.dirname(path.dirname(outputDir)));
  
  return {
    avif: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover.avif',
    webp: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover.webp',
    png: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover.png',
    avif2x: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover@2x.avif',
    webp2x: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover@2x.webp',
    png2x: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover@2x.png'
  };
}

// Обработка обложки трека
async function processTrackCover(inputPath, outputDir, trackSlug, artistSlug) {
  const sizes = [
    { suffix: '', size: 480 },
    { suffix: '@2x', size: 960 }
  ];

  const formats = [
    { ext: 'avif', mime: 'image/avif' },
    { ext: 'webp', mime: 'image/webp' },
    { ext: 'png', mime: 'image/png' }
  ];

  if (!inputPath) {
    console.log(`    ⚠️  Обложка не найдена, создаю плейсхолдер`);
    return await createPlaceholder(outputDir, trackSlug);
  }

  for (const size of sizes) {
    for (const format of formats) {
      const outputPath = path.join(outputDir, `cover${size.suffix}.${format.ext}`);
      
      try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        // Вычисляем размеры с сохранением пропорций (cover)
        let width, height;
        if (metadata.width > metadata.height) {
          width = size.size;
          height = null;
        } else {
          width = null;
          height = size.size;
        }

        await image
          .resize(width, height, {
            fit: 'cover',
            position: 'center'
          })
          .toFormat(format.ext === 'avif' ? 'avif' : format.ext === 'webp' ? 'webp' : 'png')
          .toFile(outputPath);
        
        console.log(`    ✓ Создано: cover${size.suffix}.${format.ext}`);
      } catch (error) {
        console.error(`    ✗ Ошибка создания cover${size.suffix}.${format.ext}:`, error.message);
      }
    }
  }

  return {
    avif: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover.avif',
    webp: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover.webp',
    png: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover.png',
    avif2x: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover@2x.avif',
    webp2x: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover@2x.webp',
    png2x: '/public/assets/artists/' + artistSlug + '/tracks/' + trackSlug + '/cover@2x.png'
  };
}

// Конвертация WAV в MP3
async function convertWavToMp3(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioBitrate(320)
      .audioCodec('libmp3lame')
      .on('end', () => {
        console.log(`    ✓ Конвертировано в MP3: audio.mp3`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`    ✗ Ошибка конвертации:`, err.message);
        reject(err);
      })
      .save(outputPath);
  });
}

// Обработка артиста
async function processArtist(artistDir, artistName) {
  const slug = createSlug(artistName);
  console.log(`\n📁 Обработка артиста: ${artistName} (${slug})`);

  // Создаем структуру папок
  const artistAssetsDir = path.join(ASSETS_DIR, slug);
  const artistTracksDir = path.join(artistAssetsDir, 'tracks');
  await fs.mkdir(artistAssetsDir, { recursive: true });
  await fs.mkdir(artistTracksDir, { recursive: true });

  // Ищем основное фото
  const photoDir = path.join(artistDir, 'Фото');
  let mainImagePath = await findFirstImage(photoDir);
  
  // Если фото не найдено, создаем плейсхолдер
  if (!mainImagePath) {
    console.warn(`  ⚠️  Изображение артиста не найдено, создаю плейсхолдер`);
    // Создаем серый квадрат 1280x1280 как плейсхолдер
    const placeholderPath = path.join(artistAssetsDir, 'main-placeholder.png');
    await sharp({
      create: {
        width: 1280,
        height: 1280,
        channels: 4,
        background: { r: 128, g: 128, b: 128, alpha: 1 }
      }
    }).png().toFile(placeholderPath);
    mainImagePath = placeholderPath;
  }
  
  // Обрабатываем основное фото
  const mainImage = await processArtistImage(mainImagePath, artistAssetsDir, slug);

  // Обрабатываем релизы
  const releasesDir = path.join(artistDir, 'Релизы');
  const tracks = [];

  try {
    const releaseFolders = await fs.readdir(releasesDir);
    
    for (const releaseFolder of releaseFolders) {
      const releasePath = path.join(releasesDir, releaseFolder);
      const stat = await fs.stat(releasePath);
      
      if (!stat.isDirectory()) continue;

      // Проверяем, что это релиз основного артиста (не коллаборация)
      // Пропускаем только если это явная коллаборация:
      // - есть запятая в названии
      // - первый артист в названии (до запятой) не совпадает с текущим артистом
      const hasComma = releaseFolder.includes(',');
      if (hasComma) {
        const firstPart = releaseFolder.split(',')[0].trim();
        const firstArtistSlug = createSlug(firstPart.split(/\s+/)[0]); // Берем первое слово до запятой
        if (firstArtistSlug !== slug) {
          console.log(`  ⏭️  Пропускаем коллаборацию: ${releaseFolder}`);
          continue;
        }
      }

      console.log(`  🎵 Обработка трека: ${releaseFolder}`);

      // Извлекаем данные
      const trackName = extractTrackName(releaseFolder, artistName);
      const trackSlug = createSlug(trackName);
      const date = extractDate(releaseFolder);
      const year = date ? extractYear(date) : new Date().getFullYear();

      // Ищем WAV файлы (может быть несколько в альбоме)
      const wavFiles = [];
      try {
        const files = await fs.readdir(releasePath);
        for (const file of files) {
          if (file.toLowerCase().endsWith('.wav')) {
            wavFiles.push(path.join(releasePath, file));
          }
        }
      } catch (error) {
        console.warn(`    ⚠️  Ошибка чтения папки: ${error.message}`);
      }

      if (wavFiles.length === 0) {
        console.warn(`    ⚠️  WAV файлы не найдены, пропускаем`);
        continue;
      }

      // Если несколько WAV файлов, обрабатываем только первый (или можно обработать все как отдельные треки)
      // Для простоты обрабатываем первый файл
      const wavPath = wavFiles[0];
      if (wavFiles.length > 1) {
        console.log(`    ℹ️  Найдено ${wavFiles.length} WAV файлов, обрабатываю первый: ${path.basename(wavPath)}`);
      }

      // Ищем обложку
      const coverPath = await findFirstImage(releasePath);

      // Создаем папку для трека
      const trackDir = path.join(artistTracksDir, trackSlug);
      await fs.mkdir(trackDir, { recursive: true });

      // Обрабатываем обложку
      const cover = await processTrackCover(coverPath, trackDir, trackSlug, slug);

      // Конвертируем аудио
      const mp3Path = path.join(trackDir, 'audio.mp3');
      try {
        await convertWavToMp3(wavPath, mp3Path);
      } catch (error) {
        console.error(`    ✗ Ошибка конвертации аудио:`, error.message);
        continue;
      }

      tracks.push({
        name: trackName,
        slug: trackSlug,
        year: year,
        date: date,
        cover: cover,
        audio: '/public/assets/artists/' + slug + '/tracks/' + trackSlug + '/audio.mp3'
      });
    }

    // Сортируем треки по дате (новые первыми)
    tracks.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

    console.log(`  ✓ Обработано треков: ${tracks.length}`);

    return {
      name: artistName,
      slug: slug,
      mainImage: mainImage,
      tracks: tracks
    };

  } catch (error) {
    console.error(`  ✗ Ошибка обработки релизов:`, error.message);
    return {
      name: artistName,
      slug: slug,
      mainImage: mainImage,
      tracks: []
    };
  }
}

// Генерация HTML страницы артиста
function generateArtistHTML(artist, templatePath) {
  return new Promise(async (resolve, reject) => {
    try {
      let template = await fs.readFile(templatePath, 'utf-8');

      // Заменяем данные
      template = template.replace(/DSPRITE/g, artist.name);
      template = template.replace(/dsprit/g, artist.slug);

      // Заменяем основное изображение
      if (artist.mainImage) {
        const pictureTag = `
            <picture>
                <source srcset="${artist.mainImage.avif} 1x, ${artist.mainImage.avif2x} 2x" type="image/avif">
                <source srcset="${artist.mainImage.webp} 1x, ${artist.mainImage.webp2x} 2x" type="image/webp">
                <img src="${artist.mainImage.png}" srcset="${artist.mainImage.png} 1x, ${artist.mainImage.png2x} 2x" alt="${artist.name}" class="oor-artist-image-main no-parallax">
            </picture>`;
        template = template.replace(
          /<picture>[\s\S]*?<\/picture>/,
          pictureTag
        );
      }

      // Заменяем описание (оставляем пустым)
      template = template.replace(
        /<div class="oor-artist-description-content" id="artist-description">[\s\S]*?<\/div>/,
        '<div class="oor-artist-description-content" id="artist-description"></div>'
      );

      // Генерируем треки
      let tracksHTML = '';
      artist.tracks.forEach((track, index) => {
        const pictureTag = `                        <picture>
                            <source srcset="${track.cover.avif} 1x, ${track.cover.avif2x} 2x" type="image/avif">
                            <source srcset="${track.cover.webp} 1x, ${track.cover.webp2x} 2x" type="image/webp">
                            <img src="${track.cover.png}" srcset="${track.cover.png} 1x, ${track.cover.png2x} 2x" alt="${track.name}" class="oor-artist-track-image no-parallax">
                        </picture>`;

        tracksHTML += `
                <!-- Track ${index + 1} -->
                <div class="oor-artist-track" data-track-id="${index + 1}" data-track-src="${track.audio}">
                    <div class="oor-artist-track-cover">
${pictureTag}
                        <div class="oor-artist-track-overlay">
                            <svg class="oor-artist-track-progress" width="180" height="180" viewBox="0 0 180 180">
                                <circle class="oor-artist-track-progress-bg" cx="90" cy="90" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2"/>
                                <circle class="oor-artist-track-progress-fill" cx="90" cy="90" r="85" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="534.07" stroke-dashoffset="534.07" transform="rotate(-90 90 90)"/>
                            </svg>
                            <img src="/public/assets/artist-page/play-track.svg" alt="Play" class="oor-artist-track-play-icon">
                        </div>
                    </div>
                    <div class="oor-artist-track-info">
                        <span class="oor-artist-track-name">${track.name}</span>
                        <span class="oor-artist-track-year">${track.year}</span>
                    </div>
                </div>`;
      });

      // Заменяем треки - находим весь блок tracks-grid включая tracks-container
      const tracksContainerStart = '<div class="oor-artist-tracks-container">';
      const tracksContainerStartIdx = template.indexOf(tracksContainerStart);
      
      if (tracksContainerStartIdx !== -1) {
        // Находим закрывающий тег для tracks-container
        let depth = 0;
        let pos = tracksContainerStartIdx;
        let containerEndIdx = -1;
        
        while (pos < template.length) {
          if (template.substr(pos, 4) === '<div') {
            depth++;
          } else if (template.substr(pos, 6) === '</div>') {
            depth--;
            if (depth === 0) {
              containerEndIdx = pos + 6;
              break;
            }
          }
          pos++;
        }
        
        if (containerEndIdx !== -1) {
          // Заменяем весь блок tracks-container
          const before = template.substring(0, tracksContainerStartIdx);
          const after = template.substring(containerEndIdx);
          const replacement = `${tracksContainerStart}
            <div class="oor-artist-tracks-grid">${tracksHTML}
            </div>
        </div>`;
          template = before + replacement + after;
        }
      } else {
        // Fallback: ищем вручную
        const gridStart = '<div class="oor-artist-tracks-grid">';
        const gridStartIdx = template.indexOf(gridStart);
        
        if (gridStartIdx !== -1) {
          // Находим закрывающий тег tracks-container
          const containerStart = '<div class="oor-artist-tracks-container">';
          const containerStartIdx = template.indexOf(containerStart, gridStartIdx);
          if (containerStartIdx !== -1) {
            // Находим закрывающий тег для tracks-container
            let depth = 0;
            let pos = containerStartIdx;
            let containerEndIdx = -1;
            
            while (pos < template.length) {
              if (template.substr(pos, 4) === '<div') {
                depth++;
              } else if (template.substr(pos, 6) === '</div>') {
                depth--;
                if (depth === 0) {
                  containerEndIdx = pos + 6;
                  break;
                }
              }
              pos++;
            }
            
            if (containerEndIdx !== -1) {
              // Находим закрывающий тег для tracks-grid (он перед tracks-container)
              const gridCloseIdx = template.lastIndexOf('</div>', containerEndIdx - 7);
              
              if (gridCloseIdx > gridStartIdx) {
                const before = template.substring(0, gridStartIdx + gridStart.length);
                const after = template.substring(gridCloseIdx);
                template = before + tracksHTML + '\n            ' + after;
              }
            }
          }
        }
      }

      // Обновляем title
      template = template.replace(
        /<title>.*?<\/title>/,
        `<title>${artist.name} - Out of Records</title>`
      );

      resolve(template);
    } catch (error) {
      reject(error);
    }
  });
}

// Главная функция
async function main() {
  console.log('🚀 Начало обработки артистов...\n');

  try {
    // Проверяем наличие исходной папки
    try {
      await fs.access(ARTISTS_SOURCE_DIR);
    } catch {
      console.error(`❌ Папка с артистами не найдена: ${ARTISTS_SOURCE_DIR}`);
      process.exit(1);
    }

    // Создаем выходные папки
    await fs.mkdir(ASSETS_DIR, { recursive: true });
    await fs.mkdir(ARTISTS_OUTPUT_DIR, { recursive: true });

    // Читаем список артистов
    const artistFolders = await fs.readdir(ARTISTS_SOURCE_DIR);
    const artists = [];

    // Обрабатываем каждого артиста
    for (const artistFolder of artistFolders) {
      const artistPath = path.join(ARTISTS_SOURCE_DIR, artistFolder);
      const stat = await fs.stat(artistPath);
      
      if (!stat.isDirectory()) continue;

      const artist = await processArtist(artistPath, artistFolder);
      artists.push(artist);

      // Генерируем HTML
      const templatePath = path.join(PROJECT_ROOT, 'artist.html');
      const html = await generateArtistHTML(artist, templatePath);
      
      // Создаем папку для артиста
      const artistOutputDir = path.join(ARTISTS_OUTPUT_DIR, artist.slug);
      await fs.mkdir(artistOutputDir, { recursive: true });
      
      // Сохраняем HTML
      const htmlPath = path.join(artistOutputDir, 'artist.html');
      await fs.writeFile(htmlPath, html, 'utf-8');
      console.log(`  ✓ Создана страница: /artists/${artist.slug}/artist.html\n`);
    }

    console.log(`\n✅ Обработка завершена! Обработано артистов: ${artists.length}`);
    console.log(`\n📝 Не забудьте обновить artists.html со ссылками на новые страницы!`);

  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  }
}

// Запуск
if (require.main === module) {
  main();
}

module.exports = { main };

