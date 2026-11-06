# Visual Annotator Studio (VAS)

A static, browser-based visual annotator for drawing bounding-box annotations on images.

## Features

- Upload an image (drag is not required; click **Upload**).
- Draw boxes by clicking and dragging on the image.
- Select a box, rename it in the sidebar, delete with the × button or the `Delete` key.
- Export annotations to **JSON** or **CSV**, import from JSON.
- Save/load project in browser local storage; autosave on edits.
- **RU/EN** language switch.
- **Light / dark** theme.
- **Version badge** in the header (for example `v1.3.2`). The version number is computed from the number of **major / middle / minor** changes since the beginning.
- Clicking the version badge opens the **Changelog** page (RU/EN). It shows:
  - the **latest changes** for the current version, and
  - **history up to 7 major versions back.
  - A **Download full history PDF** button is currently disabled (matted) until 7 major versions exist; then it becomes active and includes the full history.
- **Onboarding tutorial (coach marks)**:
  - First-time visitors get a full tutorial.
  - After an update, visitors get a short tutorial for new/control-based changes in the current version.
- **Privacy & Policy** page (RU/EN), linked in the footer. The footer states that using the product means agreement.
- Export **PDF** via the browser print dialog (`Export PDF` button) — text is dark (`#111827`) for readable printed/PDF output.

## Versioning policy

- Every future change, fix, or feature must be accompanied by a **version bump**.
- Version format: `MAJOR.MIDDLE.MINOR` = counts of major/middle/minor changes since the very beginning.
- The current version is computed from `HISTORY` in `data.js`.

## Run locally

Serve the repository root with any static server:

```bash
python -m http.server 8900
```

Then open `http://localhost:8900/`.

## Deployment

Static hosting (GitHub Pages). Add `.nojekyll` so all assets are served. No server-side component is required.

## Privacy

VAS runs in the browser. Uploaded images and annotations are processed locally in the browser and are not uploaded to a server by the application. Projects are stored in browser local storage on the device. See `privacy.html` for the full Privacy & Policy.
