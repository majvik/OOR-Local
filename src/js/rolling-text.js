// Rolling Text Effect – safe init after DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // Отключаем rolling text на мобильных устройствах (≤1024px с запасом)
  if (window.innerWidth <= 1024) {
    return;
  }
  
  // slight delay to ensure fonts applied
  setTimeout(() => {
    const elements = document.querySelectorAll('.rolling-button .tn-atom');
    elements.forEach(el => {
      // Если уже инициализировано, не трогаем
      if (el.dataset.processed === 'true') return;

      // Берем исходный текст без разметки, но не трогаем пробелы между буквами
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) return;

      el.dataset.processed = 'true';
      el.innerHTML = '';

      // Создаем два перекрывающих блока одинакового текста
      for (let i = 0; i < 2; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        let delay = 0;
        for (const ch of text) {
          const span = document.createElement('span');
          span.classList.add('letter');
          span.innerText = ch === ' ' ? '\u00A0' : ch;
          span.style.transitionDelay = `${delay}s`;
          block.appendChild(span);
          delay += 0.03;
        }
        el.appendChild(block);
      }
    });
  }, 50);
});