// docs/src/middleware.js
import { defineMiddleware } from "astro:middleware";

// МАССИВ-КАРТА ДЛЯ НАСТРОЙКИ ИМЕН СТРАНИЦ И ПУТЕЙ
const URL_MAP = {
  'docs': { name: 'DOCS', link: '' },
  'en': { name: 'EN', link: '' },
  'ru': { name: 'RU', link: '' },
  'main': { name: 'MAIN', link: 'MAIN' },
  // 'commands': { name: 'COMMANDS', link: '/docs/EN/commands' }
};

export const onRequest = defineMiddleware(async (context, next) => {
  // 1. Загружаем оригинальный HTML
  const response = await next();
  const html = await response.text();

  // 2. Определяем язык
  const isEn = context.url.pathname.toUpperCase().includes('/EN/');
  const currentLangText = isEn ? 'EN' : 'RU';

  // 3. Получаем части URL
  const pathSegments = context.url.pathname
    .split('/')
    .filter(Boolean);

  // 4. Генерация пути
  const breadcrumbsHtml = pathSegments
    .map((segment) => {
      const lowerSegment = segment.toLowerCase();
      const mapped = URL_MAP[lowerSegment];

      if (mapped) {
        if (mapped.link) {
          return `<a href="${mapped.link}" class="breadcrumb-link">${mapped.name}</a>`;
        }

        return `<span class="breadcrumb-text">${mapped.name}</span>`;
      }

      return `<span class="breadcrumb-text">${segment.toUpperCase()}</span>`;
    })
    .join(' <span class="breadcrumb-separator">/</span> ');

  // 5. Верхний бар
  const topBarHtml = `
    <header class="os-header">

        <div class="header-left">
            <img
                src="/Veyro/trollface.png"
                alt="Trollface"
                class="troll-icon"
            />
        </div>

        <div class="os-breadcrumbs">
            ${breadcrumbsHtml}
        </div>

        <button class="btn-lang" id="global-lang-btn">
            ${currentLangText}
        </button>

    </header>

    <script>
        document.getElementById('global-lang-btn')?.addEventListener('click', () => {
            const currentPath = window.location.pathname;

            if (currentPath.toUpperCase().includes('/EN/')) {
                window.location.pathname =
                    currentPath.replace(/\\/EN\\//i, '/RU/');
            } else if (currentPath.toUpperCase().includes('/RU/')) {
                window.location.pathname =
                    currentPath.replace(/\\/RU\\//i, '/EN/');
            } else {
                window.location.pathname = '/docs/EN/imain';
            }
        });
    </script>
  `;

  // 6. Стили
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

      /* Trollface остаётся отдельно */
      .header-left {
        display: flex;
        align-items: center;
      }

      .troll-icon {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }

      /* ПУТЬ:
         абсолютная позиция относительно экрана,
         ровно 4px от левого края */
      .os-breadcrumbs {
        position: absolute;
        left: 4px;
        top: 50%;
        transform: translateY(-50%);

        display: flex;
        align-items: center;
        gap: 6px;

        color: #888888;
        font-size: 12px;
        font-weight: bold;

        margin: 0;
        padding: 0;
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

      /* Кнопку НЕ стилизуем вообще.
         Её существующий стиль сайта сохраняется. */

      body {
        margin-top: 40px !important;
      }
    </style>
  `;

  // 7. Вставляем бар сразу после <body>
  const modifiedHtml = html.replace(
    /<body[^>]*>/i,
    (match) => `${match}${topBarHtml}${topBarStyles}`
  );

  // 8. Возвращаем страницу
  return new Response(modifiedHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
});