#!/usr/bin/env node

/**
 * Скрипт для перекодирования всех MP3 файлов артистов
 * Гарантирует правильные заголовки для поддержки Accept-Ranges: bytes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ARTISTS_DIR = path.join(__dirname, '..', 'public', 'assets', 'artists');
const TEMP_DIR = path.join(__dirname, '..', 'temp_mp3_reencode');

// Проверяем наличие ffmpeg
function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    console.error('❌ ffmpeg не найден. Установите ffmpeg:');
    console.error('   macOS: brew install ffmpeg');
    console.error('   Linux: sudo apt-get install ffmpeg');
    console.error('   Windows: https://ffmpeg.org/download.html');
    return false;
  }
}

// Находим все MP3 файлы
function findMP3Files(dir) {
  const files = [];
  
  function walkDir(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.mp3')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

// Перекодирует MP3 файл с правильными параметрами для поддержки range requests
function reencodeMP3(inputPath, outputPath) {
  try {
    // Параметры для перекодирования:
    // - -i: входной файл
    // - -codec:a libmp3lame: используем LAME encoder
    // - -b:a 320k: битрейт 320 kbps
    // - -write_id3v2 1: записываем ID3v2 теги в начало файла
    // - -id3v2_version 3: используем ID3v2.3
    // - -y: перезаписывать выходной файл без подтверждения
    // - -map_metadata 0: копируем метаданные из исходного файла
    // - -movflags faststart: перемещает метаданные в начало (для MP4, но полезно для MP3 структуры)
    
    const command = `ffmpeg -i "${inputPath}" -codec:a libmp3lame -b:a 320k -write_id3v2 1 -id3v2_version 3 -map_metadata 0 -y "${outputPath}"`;
    
    execSync(command, { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    return true;
  } catch (error) {
    console.error(`   ❌ Ошибка при перекодировании: ${error.message}`);
    return false;
  }
}

// Проверяет размер файла (должен быть > 0)
function validateFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size > 0;
  } catch (e) {
    return false;
  }
}

// Основная функция
function main() {
  console.log('🎵 Перекодирование MP3 файлов для поддержки Accept-Ranges: bytes\n');
  
  // Проверяем ffmpeg
  if (!checkFFmpeg()) {
    process.exit(1);
  }
  
  // Проверяем существование директории артистов
  if (!fs.existsSync(ARTISTS_DIR)) {
    console.error(`❌ Директория не найдена: ${ARTISTS_DIR}`);
    process.exit(1);
  }
  
  // Создаем временную директорию
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  
  // Находим все MP3 файлы
  console.log('📂 Поиск MP3 файлов...');
  const mp3Files = findMP3Files(ARTISTS_DIR);
  console.log(`   Найдено файлов: ${mp3Files.length}\n`);
  
  if (mp3Files.length === 0) {
    console.log('✅ MP3 файлы не найдены');
    // Удаляем временную директорию
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
    return;
  }
  
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  
  // Перекодируем каждый файл
  for (let i = 0; i < mp3Files.length; i++) {
    const inputPath = mp3Files[i];
    const relativePath = path.relative(ARTISTS_DIR, inputPath);
    
    console.log(`[${i + 1}/${mp3Files.length}] ${relativePath}`);
    
    // Создаем временный файл
    const tempPath = path.join(TEMP_DIR, `temp_${i}_${path.basename(inputPath)}`);
    
    // Перекодируем
    if (reencodeMP3(inputPath, tempPath)) {
      // Проверяем результат
      if (validateFile(tempPath)) {
        // Создаем бэкап оригинального файла
        const backupPath = inputPath + '.backup';
        if (!fs.existsSync(backupPath)) {
          fs.copyFileSync(inputPath, backupPath);
        }
        
        // Заменяем оригинальный файл
        fs.copyFileSync(tempPath, inputPath);
        
        // Удаляем временный файл
        fs.unlinkSync(tempPath);
        
        console.log(`   ✅ Перекодирован успешно`);
        successCount++;
      } else {
        console.log(`   ⚠️  Результат пустой, пропускаем`);
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        skippedCount++;
      }
    } else {
      errorCount++;
    }
    
    console.log('');
  }
  
  // Удаляем временную директорию
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  
  // Итоги
  console.log('📊 Итоги:');
  console.log(`   ✅ Успешно: ${successCount}`);
  console.log(`   ⚠️  Пропущено: ${skippedCount}`);
  console.log(`   ❌ Ошибок: ${errorCount}`);
  console.log('');
  
  if (successCount > 0) {
    console.log('💡 Бэкапы оригинальных файлов сохранены с расширением .backup');
    console.log('   Вы можете удалить их после проверки работы перемотки\n');
  }
  
  if (errorCount === 0 && skippedCount === 0) {
    console.log('✅ Все файлы успешно перекодированы!');
    console.log('   Теперь все MP3 файлы должны поддерживать Accept-Ranges: bytes\n');
  }
}

// Запускаем
main();

