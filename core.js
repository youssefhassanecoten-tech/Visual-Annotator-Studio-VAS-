import { HISTORY, FULL_TUTORIAL, PRIVACY } from "./data.js";

export const I18N = {
  en: {
    appName: "Visual Annotator Studio",
    tagline: "Draw and export bounding-box annotations.",
    upload: "Upload",
    drawHint: "Click and drag on the image to draw a box. Select a box and press Delete to remove it.",
    boxes: "Boxes",
    noBoxes: "No boxes yet.",
    exportJson: "Export JSON",
    exportCsv: "Export CSV",
    exportPdf: "Export PDF",
    importJson: "Import JSON",
    save: "Save",
    load: "Load",
    clear: "Clear",
    deleteSel: "Delete selected",
    labelPh: "Label",
    version: "Version",
    changelog: "Changelog",
    privacy: "Privacy & Policy",
    agree: "By using this product you agree to the Privacy & Policy.",
    latestChanges: "Latest changes",
    history: "History",
    downloadPdf: "Download full history PDF",
    pdfDisabled: "Full-history PDF is available after 7 major versions.",
    home: "Home",
    language: "Language",
    theme: "Theme",
    themeNight: "Night",
    themeDay: "Day",
    tutorialNext: "Next",
    tutorialSkip: "Skip",
    tutorialDone: "Done",
    updateTutorial: "New in this version",
    fullTutorial: "Welcome tutorial",
    saved: "Saved locally",
    loaded: "Project loaded",
    cleared: "Cleared",
    uploaded: "Image uploaded",
    noImage: "Upload an image to start.",
    close: "Close",
  },
  ru: {
    appName: "Визуальный аннотатор",
    tagline: "Рисование и экспорт разметки рамками.",
    upload: "Загрузить",
    drawHint: "Нажмите и тяните на изображении, чтобы нарисовать рамку. Выберите рамку и нажмите Delete.",
    boxes: "Рамки",
    noBoxes: "Рамок пока нет.",
    exportJson: "Экспорт JSON",
    exportCsv: "Экспорт CSV",
    exportPdf: "Экспорт PDF",
    importJson: "Импорт JSON",
    save: "Сохранить",
    load: "Загрузить",
    clear: "Очистить",
    deleteSel: "Удалить выбранное",
    labelPh: "Подпись",
    version: "Версия",
    changelog: "История изменений",
    privacy: "Политика конфиденциальности и использования",
    agree: "Используя продукт, вы соглашаетесь с Политикой конфиденциальности и использования.",
    latestChanges: "Последние изменения",
    history: "История",
    downloadPdf: "Скачать полную историю PDF",
    pdfDisabled: "PDF полной истории доступен после 7 мажорных версий.",
    home: "На главную",
    language: "Язык",
    theme: "Тема",
    themeNight: "Ночь",
    themeDay: "День",
    tutorialNext: "Далее",
    tutorialSkip: "Пропустить",
    tutorialDone: "Готово",
    updateTutorial: "Новое в этой версии",
    fullTutorial: "Обучение",
    saved: "Сохранено локально",
    loaded: "Проект загружен",
    cleared: "Очищено",
    uploaded: "Изображение загружено",
    noImage: "Загрузите изображение, чтобы начать.",
    close: "Закрыть",
  }
};

export let lang = localStorage.getItem("vas-lang") || "en";
export let theme = localStorage.getItem("vas-theme") || "light";

export function t(key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}

export function setLang(next) {
  lang = next;
  localStorage.setItem("vas-lang", lang);
  applyLang();
}

export function currentVersionCounts() {
  let major = 0;
  let middle = 0;
  let minor = 0;
  HISTORY.forEach((r) => {
    if (r.type === "major") major += 1;
    if (r.type === "middle") middle += 1;
    if (r.type === "minor") minor += 1;
  });
  return { major, middle, minor };
}

export function currentVersionNumber() {
  const c = currentVersionCounts();
  return `${c.major}.${c.middle}.${c.minor}`;
}

export function currentRelease() {
  return HISTORY.find((r) => r.current === true) || HISTORY[HISTORY.length - 1];
}

export function applyTheme() {
  document.body.classList.toggle("dark", theme === "dark");
  const btn = document.getElementById("theme-btn");
  if (btn) {
    btn.textContent = theme === "dark" ? t("themeDay") : t("themeNight");
  }
}

export function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("vas-theme", theme);
  applyTheme();
}

export function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll(".lang-choice").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  applyTheme();
  const badge = document.getElementById("version-badge");
  if (badge) {
    badge.textContent = `v${currentVersionNumber()}`;
  }
}

export function initChrome() {
  document.querySelectorAll(".lang-choice").forEach((b) => {
    b.addEventListener("click", () => setLang(b.dataset.lang));
  });
  const themeBtn = document.getElementById("theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }
  applyLang();
}

export function startTutorial(steps, opts = {}) {
  if (!steps || steps.length === 0) {
    if (opts.onDone) opts.onDone(); return;
  }

  const overlay = document.createElement("div");
  overlay.className = "coach-overlay";
  document.body.appendChild(overlay);

  let index = 0;

  function clearMarks() {
    overlay.querySelectorAll(".coach-highlight, .coach-pop").forEach((n) => n.remove());
  }

  function done() {
    overlay.remove();
    if (opts.onDone) opts.onDone();
  }

  function show() {
    clearMarks();
    const step = steps[index];
    if (!step) { done(); return; }
    const el = document.querySelector(step.target);
    if (!el) { index += 1; show(); return; }

    el.scrollIntoView({ block: "center", inline: "center" });
    const rect = el.getBoundingClientRect();

    const highlight = document.createElement("div");
    highlight.className = "coach-highlight";
    highlight.style.left = `${Math.max(0, rect.left - 6)}px`;
    highlight.style.top = `${Math.max(0, rect.top - 6)}px`;
    highlight.style.width = `${rect.width + 12}px`;
    highlight.style.height = `${rect.height + 12}px`;
    overlay.appendChild(highlight);

    const pop = document.createElement("div");
    pop.className = "coach-pop";
    const arrow = document.createElement("div");
    arrow.className = "coach-arrow";
    const strong = document.createElement("strong");
    strong.textContent = step.title;
    const p = document.createElement("p");
    p.textContent = step.text;
    const actions = document.createElement("div");
    actions.className = "coach-actions";
    const skip = document.createElement("button");
    skip.type = "button";
    skip.className = "btn small ghost";
    skip.textContent = t("tutorialSkip");
    skip.onclick = done;
    const next = document.createElement("button");
    next.type = "button";
    next.className = "btn small primary";
    next.textContent = index === steps.length - 1 ? t("tutorialDone") : t("tutorialNext");
    next.onclick = () => { index += 1; show(); };
    actions.append(skip, next);
    pop.append(arrow, strong, p, actions);
    overlay.appendChild(pop);

    const popW = 320;
    const popH = 160;
    let top = rect.bottom + 12;
    let place = "below";
    if (top + popH > window.innerHeight) {
      top = Math.max(8, rect.top - popH - 12);
      place = "above";
    }
    let left = rect.left + rect.width / 2 - popW / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - popW - 12));
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
    pop.classList.add(place === "below" ? "pop-below" : "pop-above");
  }

  show();
}

export function maybeRunTutorial(onStateChange) {
  const visited = localStorage.getItem("vas-visited");
  const seen = localStorage.getItem("vas-seen-version");
  const current = currentVersionNumber();

  if (!visited) {
    startTutorial(FULL_TUTORIAL[lang], () => {
      localStorage.setItem("vas-visited", "1");
      localStorage.setItem("vas-seen-version", current);
      if (onStateChange) onStateChange();
    });
    return;
  }

  if (seen !== current) {
    const rel = currentRelease();
    const steps = rel && rel.tutorial && rel.tutorial[lang] ? rel.tutorial[lang] : null;
    if (steps && steps.length) {
      startTutorial(steps, () => {
        localStorage.setItem("vas-seen-version", current);
        if (onStateChange) onStateChange();
      });
      return;
    }
    localStorage.setItem("vas-seen-version", current);
  }
}

export { PRIVACY, HISTORY };
