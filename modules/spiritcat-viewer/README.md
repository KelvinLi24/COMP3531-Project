# SpiritCat Viewer Module

Standalone frontend module for showcasing a single `.glb` asset with a premium intro transition and a demo blockchain certification panel.

## Folder Structure

```text
modules/spiritcat-viewer
?? index.html
?? vite.config.js
?? public/
?? ?? assets/
??    ?? models/
??       ?? README.md        (place lingmao-spiritcat-guardian.glb here)
?? src/
   ?? main.js
   ?? styles.css
   ?? data/
   ?? ?? certification.js
   ?? viewer/
      ?? SpiritCatViewer.js
```

## Model Placement

Add your model file here:

`modules/spiritcat-viewer/public/assets/models/lingmao-spiritcat-guardian.glb`

The viewer uses this relative path so it works on GitHub Pages:

`./assets/models/lingmao-spiritcat-guardian.glb`

## Run Locally

From repository root:

```powershell
npm exec -- vite --config modules/spiritcat-viewer/vite.config.js
```

Then open:

`http://localhost:5188`

## Build

From repository root:

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

- This module is frontend-only and static-safe.
- `base: './'` is configured for GitHub Pages subpath compatibility.
- Deploy the generated `modules/spiritcat-viewer/dist` folder as your Pages artifact when publishing this module independently.
