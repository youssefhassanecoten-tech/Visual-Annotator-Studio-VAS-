import { t, initChrome, currentVersionNumber, currentRelease, HISTORY, PRIVACY } from "./core.js";

function currentLang() {
  return localStorage.getItem("vas-lang") || "en";
}

function renderChangelog() {
  const lang = currentLang();
  const current = currentRelease();
  const version = currentVersionNumber();
  const changes = (current.changes && current.changes[lang] || []);
  const history = HISTORY.filter((r) => r.current !== true).slice().reverse();
  const latest = document.getElementById("latest-changes");
  if (latest) {
    latest.innerHTML = changes.map((c) => `<li>${c}</li>`).join("");
  }
  const versionLabel = document.getElementById("changelog-version");
  if (versionLabel) {
    versionLabel.textContent = `v${version}`;
  }
  const list = document.getElementById("history-list");
  if (list) {
    list.innerHTML = history.map((r) => `
      <div class="release">
        <div class="release-head">
          <strong>${r.id}. ${r.date} · ${r.type}</strong>
        </div>
        <ul class="changes">
          ${r.changes[lang].map((c) => `<li>${c}</li>`).join("")}
        </ul>
      </div>
    `).join("");
  }
}

function renderPrivacy() {
  const lang = currentLang();
  const container = document.getElementById("privacy-content");
  if (container) {
    container.innerHTML = PRIVACY[lang].map((p) => `<p>${p}</p>`).join("");
  }
}

function boot() {
  initChrome();
  renderChangelog();
  renderPrivacy();
}

function bindRerender() {
  document.querySelectorAll(".lang-choice").forEach((b) => {
    b.addEventListener("click", () => setTimeout(boot, 50));
  });
}

boot();
bindRerender();
