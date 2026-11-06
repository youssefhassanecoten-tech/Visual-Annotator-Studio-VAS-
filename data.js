// VAS — Visual Annotator Studio: version history, tutorials, privacy text.
// Version number = count of major / middle / minor changes since the beginning.

export const HISTORY = [
  {
    id: 1,
    type: "major",
    date: "2026-10-01",
    changes: {
      en: [
        "Initial Visual Annotator Studio web app.",
        "Upload an image, draw bounding boxes, edit labels, delete boxes, export JSON/CSV."
      ],
      ru: [
        "Первая версия веб-приложения Visual Annotator Studio.",
        "Загрузка изображения, рисование рамок, изменение подписей, удаление рамок, экспорт JSON/CSV."
      ]
    }
  },
  {
    id: 2,
    type: "middle",
    date: "2026-10-08",
    changes: {
      en: ["Import annotations from JSON.", "Export CSV with box coordinates."],
      ru: ["Импорт разметки из JSON.", "Экспорт CSV с координатами рамок."]
    }
  },
  {
    id: 3,
    type: "minor",
    date: "2026-10-12",
    changes: {
      en: ["Fixed CSV label escaping.", "Minor UI alignment fixes."],
      ru: ["Исправлено экранирование подписей в CSV.", "Небольшие исправления интерфейса."]
    }
  },
  {
    id: 4,
    type: "middle",
    date: "2026-10-20",
    changes: {
      en: ["Manual save/load project in browser storage.", "Added light/dark theme support."],
      ru: ["Ручное сохранение/загрузка проекта в хранилище браузера.", "Добавлена поддержка светлой/тёмной темы."]
    }
  },
  {
    id: 5,
    type: "minor",
    date: "2026-10-25",
    changes: {
      en: ["Fixed theme persistence after reload.", "Minor performance polish."],
      ru: ["Исправлено сохранение темы после перезагрузки.", "Небольшая оптимизация производительности."]
    }
  },
  {
    id: 6,
    type: "middle",
    date: "2026-11-03",
    current: true,
    changes: {
      en: [
        "Version badge in header/footer shows the running version.",
        "Clicking the version badge opens the changelog page.",
        "Added Privacy & Policy page (RU/EN) with agreement notice.",
        "Added onboarding: full tutorial for first visit, update tutorial for new controls."
      ],
      ru: [
        "В шапке/футере отображается версия приложения.",
        "Нажатие на версию открывает страницу истории изменений.",
        "Добавлена страница Политика конфиденциальности и использования (RU/EN) с уведомлением о согласии.",
        "Добавлено обучение: полное при первом визите, выборочное при обновлении."
      ]
    },
    tutorial: {
      en: [
        { target: "#version-badge", title: "Version badge", text: "Shows the running version; click it to open the changelog." },
        { target: "#privacy-link", title: "Privacy & Policy", text: "Open the Privacy & Policy page. Using the product means you agree to it." }
      ],
      ru: [
        { target: "#version-badge", title: "Версия", text: "Показывает текущую версию; нажмите, чтобы открыть историю изменений." },
        { target: "#privacy-link", title: "Политика", text: "Открывает страницу Политики конфиденциальности и использования. Использование продукта означает согласие с ней." }
      ]
    }
  }
];

export const FULL_TUTORIAL = {
  en: [
    { target: "#upload-btn", title: "1. Upload image", text: "Click Upload and choose an image to annotate." },
    { target: "#canvas-wrap", title: "2. Draw boxes", text: "Click and drag on the image to draw a bounding box." },
    { target: "#box-list", title: "3. Manage boxes", text: "Select a box to rename or delete it." },
    { target: "#export-json", title: "4. Export", text: "Export annotations as JSON or CSV, or save the project locally." }
  ],
  ru: [
    { target: "#upload-btn", title: "1. Загрузка", text: "Нажмите «Загрузить» и выберите изображение для разметки." },
    { target: "#canvas-wrap", title: "2. Рамки", text: "Нажмите и тяните на изображении, чтобы нарисовать рамку." },
    { target: "#box-list", title: "3. Управление", text: "Выберите рамку, чтобы переименовать или удалить её." },
    { target: "#export-json", title: "4. Экспорт", text: "Экспортируйте разметку в JSON или CSV, или сохраните проект локально." }
  ]
};

export const PRIVACY = {
  en: [
    "Visual Annotator Studio (VAS) is provided by the owner of this repository. All intellectual property rights in the software, design, texts, logos and code remain with the owner.",
    "By accessing and using this product, you automatically agree to this Privacy & Policy. If you do not agree, do not use the product.",
    "VAS runs in your browser. Uploaded images and annotations are processed locally in your browser and are not uploaded to a server by the application. Projects are stored in your browser local storage on your device. You are responsible for the content you upload and annotate; do not upload content you do not have rights to use.",
    "No personal data is collected by the application itself. The hosting provider may record standard technical logs (such as IP address, user agent, requested URL) for security and availability.",
    "THE PRODUCT IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND. You may use VAS for your own internal annotation tasks. You may not resell, sublicense, or claim ownership of the product. Reverse engineering, copying, or redistribution of the product or its parts is prohibited without written permission.",
    "This policy may be updated; continued use means you accept the updated version.",
    "For questions, contact the repository owner."
  ],
  ru: [
    "Visual Annotator Studio (VAS) предоставляется владельцем данного репозитория. Все права интеллектуальной собственности на программное обеспечение, дизайн, тексты, логотипы и код остаются у владельца.",
    "При доступе и использовании продукта вы автоматически соглашаетесь с настоящей Политикой конфиденциальности и использования. Если вы не согласны, не используйте продукт.",
    "VAS работает в вашем браузере. Загруженные изображения и разметка обрабатываются локально в вашем браузере и не загружаются на сервер приложением. Проекты хранятся в локальном хранилище вашего браузера на вашем устройстве. Вы несёте ответственность за загружаемый и размечаемый контент; не загружайте контент, на использование которого у вас нет прав.",
    "Приложение само не собирает персональные данные. Хостинг-провайдер может сохранять стандартные технические логи (например, IP-адрес, user agent, запрошенный URL) для безопасности и доступности.",
    "ПРОДУКТ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ. Вы можете использовать VAS для собственных внутренних задач разметки. Запрещены перепродажа, сублицензирование, присвоение авторства.",
    "Политика может обновляться; дальнейшее использование означает принятие обновлённой версии.",
    "По вопросам обращайтесь к владельцу репозитория."
  ]
};
