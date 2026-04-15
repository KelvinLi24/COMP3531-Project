# SpiritCat Viewer Module

Standalone frontend module for showcasing three `.glb` assets with:
- a shared repository landing page (`LingMao Spirit Vault`)
- three separate exhibition HTML pages
- premium intro transition + demo blockchain certification panel per model

## Folder Structure

```text
modules/spiritcat-viewer
├─ index.html                 # repository page (LingMao Spirit Vault)
├─ guardian.html              # model page 1
├─ hangzhou.html              # model page 2
├─ classic.html               # model page 3
├─ vite.config.js
├─ public/
│  └─ assets/
│     └─ models/
│        ├─ lingmao-spiritcat-guardian.glb
│        ├─ lingmao-spiritcat-hangzhou.glb
│        ├─ lingmao-spiritcat-classic.glb
│        └─ README.md
└─ src/
   ├─ styles.css
   ├─ repository-page.js
   ├─ viewer-page.js
   ├─ data/
   │  └─ models.js
   └─ viewer/
      └─ SpiritCatViewer.js
```

## Entry URLs

- Vault page: `./index.html`
- Guardian exhibition: `./guardian.html`
- Hangzhou exhibition: `./hangzhou.html`
- Classic exhibition: `./classic.html`

## Run Locally

From repository root:

```powershell
npm exec -- vite --config modules/spiritcat-viewer/vite.config.js
```

Open:

`http://localhost:5188`

## Build

```powershell
npm exec -- vite build --config modules/spiritcat-viewer/vite.config.js
```

Build output:

`modules/spiritcat-viewer/dist`

## Preview Production Build

```powershell
npm exec -- vite preview --config modules/spiritcat-viewer/vite.config.js
```

## GitHub Pages Notes

- Frontend only; static-safe.
- Uses relative paths and `base: './'` for Pages compatibility.
- Multi-page build includes `index`, `guardian`, `hangzhou`, and `classic`.
