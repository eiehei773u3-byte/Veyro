// docs/src/middleware.js
import { defineMiddleware } from "astro:middleware";

// МАССИВ-КАРТА ДЛЯ НАСТРОЙКИ ИМЕН СТРАНИЦ И ПУТЕЙ
// Сюда ты можешь дописывать любые сегменты из URL.
// Если 'link' пустой или отсутствует, элемент будет просто текстом, а не ссылкой.
const URL_MAP = {
  'docs': { name: 'DOCS', link: '' },
  'en': { name: 'EN', link: '' },
  'ru': { name: 'RU', link: '' },
  'main': { name: 'MAIN', link: 'MAIN' }, // пример для русской главной
  // 'commands': { name: 'COMMANDS', link: '/docs/EN/commands' }
};

export const onRequest = defineMiddleware(async (context, next) => {
  // 1. Загружаем оригинальный HTML-код текущей страницы
  const response = await next();
  const html = await response.text();

  // 2. Определяем, какой язык сейчас открыт
  const isEn = context.url.pathname.toUpperCase().includes('/EN/');
  const currentLangText = isEn ? 'EN' : 'RU';

  // 3. ГЕНЕРАЦИЯ ПУТЕЙ (Хлебных крошек) НА ОСНОВЕ URL
  // Бьем pathname на части, убираем пустые элементы
  const pathSegments = context.url.pathname.split('/').filter(Boolean);
  
  // Собираем крошки в HTML
  const breadcrumbsHtml = pathSegments
    .map((segment) => {
      const lowerSegment = segment.toLowerCase();
      const mapped = URL_MAP[lowerSegment];

      if (mapped) {
        // Если в нашей карте для этого сегмента прописана ссылка — делаем кликабельным
        if (mapped.link) {
          return `<a href="${mapped.link}" class="breadcrumb-link">${mapped.name}</a>`;
        }
        // Если ссылки нет — выводим просто как текст
        return `<span class="breadcrumb-text">${mapped.name}</span>`;
      }
      // Если сегмента вообще нет в массиве — выводим как есть (скрываем или оставляем текстом)
      return `<span class="breadcrumb-text">${segment.toUpperCase()}</span>`;
    })
    .join(' <span class="breadcrumb-separator">/</span> ');

  // 4. Верстка верхнего бара с динамическими путями (БЕЗ надписи VEYRO OS v0.1)
  const topBarHtml = `
    <header class="os-header">
        <div class="header-left">
            <img src="/Veyro/trollface.png" alt="Trollface" class="troll-icon" />
            <div class="os-breadcrumbs">
                ${breadcrumbsHtml}
            </div>
        </div>
        <button class="btn-lang" id="global-lang-btn">${currentLangText}</button>
    </header>
    
    <script>
        document.getElementById('global-lang-btn')?.addEventListener('click', () => {
            const currentPath = window.location.pathname;
            if (currentPath.toUpperCase().includes('/EN/')) {
                window.location.pathname = currentPath.replace(/\\/EN\\//i, '/RU/');
            } else if (currentPath.toUpperCase().includes('/RU/')) {
                window.location.pathname = currentPath.replace(/\\/RU\\//i, '/EN/');
            } else {
                window.location.pathname = '/docs/EN/imain';
            }
        });
    </script>
  `;

  // 5. Стили для бара и крошек
  const topBarStyles = `
    <style>
      .os-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 40px;
        background-color: #101010;
        border-bottom: 2px solid #000000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        box-sizing: border-box;
        z-index: 99999;
        font-family: monospace;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      .troll-icon {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }
      /* Стили для путей в баре */
      .os-breadcrumbs {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #888888;
        font-size: 12px;
        font-weight: bold;
      }
      .breadcrumb-link {
        color: #ffffff;
        text-decoration: none;
      }
      .breadcrumb-link:hover {
        color: #ff5555;
        text-decoration: underline;
      }
      .breadcrumb-text {
        color: #aaaaaa;
      }
      .breadcrumb-separator {
        color: #444444;
      }
      body {
        margin-top: 40px !important; 
      }
    </style>
  `;

  // 6. Вживляем бар и стили сразу после открывающегося тега <body>
  const modifiedHtml = html.replace(
    /<body[^>]*>/i,
    (match) => `${match}${topBarHtml}${topBarStyles}`
  );

  // 7. Возвращаем готовую страницу
  return new Response(modifiedHtml, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
});
