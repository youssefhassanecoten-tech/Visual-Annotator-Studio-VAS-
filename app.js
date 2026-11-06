import { t, initChrome, maybeRunTutorial } from "./core.js";

const state = {
  imageSrc: "",
  imageName: "",
  boxes: [],
  selected: null,
  drawing: false,
  startX: 0,
  startY: 0,
};

const $ = (id) => document.getElementById(id);

function escapeHtml(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function setStatus(text) {
  const el = $("status");
  if (el) el.textContent = text;
}

function persist() {
  try {
    localStorage.setItem("vas-project", JSON.stringify({
      imageSrc: state.imageSrc,
      imageName: state.imageName,
      boxes: state.boxes,
    }));
  } catch (err) {
    console.warn("Could not autosave project (storage quota).", err);
  }
}

function scale() {
  const img = $("image");
  if (!img || !img.naturalWidth) return 1;
  return img.clientWidth / img.naturalWidth;
}

function renderBoxes() {
  const svg = $("overlay");
  if (!svg) return;
  svg.querySelectorAll("rect.box, text.box-label").forEach((n) => n.remove());

  const s = scale();
  state.boxes.forEach((b, i) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("class", "box");
    rect.setAttribute("x", String(b.x * s));
    rect.setAttribute("y", String(b.y * s));
    rect.setAttribute("width", String(b.w * s));
    rect.setAttribute("height", String(b.h * s));
    rect.setAttribute("fill", i === state.selected ? "rgba(224,166,43,0.22)" : "rgba(22,119,255,0.14)");
    rect.setAttribute("stroke", i === state.selected ? "#e0a62b" : "#1677ff");
    rect.setAttribute("stroke-width", "2");
    rect.style.cursor = "pointer";
    rect.addEventListener("click", (ev) => {
      ev.stopPropagation();
      state.selected = i;
      renderBoxes();
      renderList();
    });
    svg.appendChild(rect);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("class", "box-label");
    label.setAttribute("x", String(b.x * s + 5));
    label.setAttribute("y", String(b.y * s + 16));
    label.setAttribute("fill", "#111827");
    label.setAttribute("font-size", "12");
    label.style.pointerEvents = "none";
    label.textContent = String(b.label || "");
    svg.appendChild(label);
  });

  renderList();
}

function renderList() {
  const list = $("box-list");
  if (!list) return;
  if (state.boxes.length === 0) {
    list.innerHTML = `<p class="hint">${escapeHtml(t("noBoxes"))}</p>`;
    return;
  }

  list.innerHTML = state.boxes.map((b, i) => `
    <div class="box-item ${i === state.selected ? "selected" : ""}" data-index="${i}">
      <input type="text" class="label-input" data-label="${i}" value="${escapeHtml(b.label)}" placeholder="${escapeHtml(t("labelPh"))}" />
      <button type="button" class="icon-btn" data-del="${i}" title="${escapeHtml(t("deleteSel"))}">×</button>
    </div>
  `).join("");

  list.querySelectorAll("[data-label]").forEach((inp) => {
    inp.addEventListener("input", () => {
      const i = Number(inp.dataset.label);
      state.boxes[i].label = inp.value;
      persist();
    });
  });

  list.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.del);
      state.boxes.splice(i, 1);
      state.selected = null;
      renderBoxes();
      persist();
      setStatus(t("cleared"));
    });
  });
}

function loadImageFromFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.imageSrc = String(reader.result || "");
    state.imageName = file.name || "image";
    state.boxes = [];
    state.selected = null;
    const img = $("image");
    img.src = state.imageSrc;
    img.onload = () => {
      renderBoxes();
      persist();
      setStatus(t("uploaded") + " · " + new Date().toLocaleTimeString());
    };
  };
  reader.readAsDataURL(file);
}

function relativePoint(ev) {
  const img = $("image");
  const rect = img.getBoundingClientRect();
  const s = scale();
  return {
    x: (ev.clientX - rect.left) / s,
    y: (ev.clientY - rect.top) / s,
  };
}

function initCanvas() {
  const wrap = $("canvas-wrap");
  const temp = $("temp-rect");
  if (!wrap || !temp) return;

  wrap.addEventListener("mousedown", (ev) => {
    if (!state.imageSrc) return;
    if (ev.target && ev.target.classList && ev.target.classList.contains("box")) return;
    state.drawing = true;
    const p = relativePoint(ev);
    state.startX = p.x;
    state.startY = p.y;
    temp.setAttribute("x", String(p.x));
    temp.setAttribute("y", String(p.y));
    temp.setAttribute("width", "0");
    temp.setAttribute("height", "0");
    temp.style.display = "block";
  });

  wrap.addEventListener("mousemove", (ev) => {
    if (!state.drawing) return;
    const p = relativePoint(ev);
    const x = Math.min(state.startX, p.x);
    const y = Math.min(state.startY, p.y);
    const w = Math.abs(p.x - state.startX);
    const h = Math.abs(p.y - state.startY);
    temp.setAttribute("x", String(x));
    temp.setAttribute("y", String(y));
    temp.setAttribute("width", String(w));
    temp.setAttribute("height", String(h));
  });

  window.addEventListener("mouseup", (ev) => {
    if (!state.drawing) return;
    state.drawing = false;
    temp.style.display = "none";
    const p = relativePoint(ev);
    const x = Math.min(state.startX, p.x);
    const y = Math.min(state.startY, p.y);
    const w = Math.abs(p.x - state.startX);
    const h = Math.abs(p.y - state.startY);
    if (w > 4 && h > 4) {
      state.boxes.push({
        x: Math.round(x),
        y: Math.round(y),
        w: Math.round(w),
        h: Math.round(h),
        label: "object " + (state.boxes.length + 1),
      });
      state.selected = state.boxes.length - 1;
      renderBoxes();
      persist();
      setStatus(t("saved") + " · " + new Date().toLocaleTimeString());
    }
  });

  window.addEventListener("resize", () => {
    if (state.imageSrc) renderBoxes();
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Delete" || ev.key === "Backspace") {
      if (state.selected !== null) {
        state.boxes.splice(state.selected, 1);
        state.selected = null;
        renderBoxes();
        persist();
        setStatus(t("cleared"));
      }
    }
  });
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function exportJson() {
  download("annotations.json", JSON.stringify({ image: state.imageName, boxes: state.boxes }, null, 2), "application/json");
  setStatus(t("saved") + " · " + new Date().toLocaleTimeString());
}

function exportCsv() {
  const rows = [["id", "label", "x", "y", "w", "h"].join(",")];
  state.boxes.forEach((b, i) => {
    const label = '"' + String(b.label || "").replace(/"/g, '""') + '"';
    rows.push([i + 1, label, b.x, b.y, b.w, b.h].join(","));
  });
  download("annotations.csv", "\uFEFF" + rows.join("\n"), "text/csv;charset=utf-8");
  setStatus(t("saved") + " · " + new Date().toLocaleTimeString());
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || "{}"));
      if (Array.isArray(data.boxes)) {
        state.boxes = data.boxes.map((b) => ({
          x: Number(b.x) || 0,
          y: Number(b.y) || 0,
          w: Number(b.w) || 0,
          h: Number(b.h) || 0,
          label: String(b.label || ""),
        }));
      }
      renderBoxes();
      persist();
      setStatus(t("loaded") + " · " + new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Invalid JSON.", err);
      setStatus(t("noImage"));
    }
  };
  reader.readAsText(file);
}

function saveProject() {
  persist();
  setStatus(t("saved") + " · " + new Date().toLocaleTimeString());
}

function loadProject() {
  const raw = localStorage.getItem("vas-project");
  if (!raw) {
    setStatus(t("noImage"));
    return;
  }
  try {
    const data = JSON.parse(raw);
    state.imageSrc = data.imageSrc || "";
    state.imageName = data.imageName || "";
    state.boxes = Array.isArray(data.boxes) ? data.boxes : [];
    state.selected = null;
    const img = $("image");
    if (state.imageSrc) {
      img.src = state.imageSrc;
      img.onload = () => renderBoxes();
    } else {
      img.removeAttribute("src");
      renderBoxes();
    }
    setStatus(t("loaded") + " · " + new Date().toLocaleTimeString());
  } catch (err) {
    console.warn("Could not load project.", err);
    setStatus(t("noImage"));
  }
}

function clearAll() {
  state.imageSrc = "";
  state.imageName = "";
  state.boxes = [];
  state.selected = null;
  const img = $("image");
  img.removeAttribute("src");
  renderBoxes();
  renderList();
  localStorage.removeItem("vas-project");
  setStatus(t("cleared"));
}

function deleteSelected() {
  if (state.selected !== null) {
    state.boxes.splice(state.selected, 1);
    state.selected = null;
    renderBoxes();
    persist();
    setStatus(t("cleared"));
  }
}

function onTutorialStateChange() {
  setStatus(t("noImage"));
}

function boot() {
  initChrome();
  initCanvas();
  renderBoxes();
  renderList();
  setStatus(t("noImage"));
  maybeRunTutorial(onTutorialStateChange);
}

const uploadBtn = $("upload-btn");
if (uploadBtn) uploadBtn.addEventListener("click", () => $("file-input").click());

const fileInput = $("file-input");
if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    loadImageFromFile(e.target.files[0]);
    e.target.value = "";
  });
}

const exportJsonBtn = $("export-json");
if (exportJsonBtn) exportJsonBtn.addEventListener("click", exportJson);

const exportCsvBtn = $("export-csv");
if (exportCsvBtn) exportCsvBtn.addEventListener("click", exportCsv);

const printBtn = $("print-btn");
if (printBtn) printBtn.addEventListener("click", () => window.print());

const importJsonBtn = $("import-json");
if (importJsonBtn) importJsonBtn.addEventListener("click", () => $("import-input").click());

const importInput = $("import-input");
if (importInput) {
  importInput.addEventListener("change", (e) => {
    importJson(e.target.files[0]);
    e.target.value = "";
  });
}

const saveBtn = $("save-btn");
if (saveBtn) saveBtn.addEventListener("click", saveProject);

const loadBtn = $("load-btn");
if (loadBtn) loadBtn.addEventListener("click", loadProject);

const clearBtn = $("clear-btn");
if (clearBtn) clearBtn.addEventListener("click", clearAll);

const deleteBtn = $("delete-btn");
if (deleteBtn) deleteBtn.addEventListener("click", deleteSelected);

boot();
