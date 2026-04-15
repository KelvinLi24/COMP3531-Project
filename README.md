# 靈貓有禮 LingMao YouLi — AIGC Intangible Cultural Heritage WebGL/WebXR Metaverse

Portfolio-quality browser metaverse demo built with **Vite + Three.js**.

This project is intentionally **WebGL-first**:

- Starts in standard desktop browser mode (no VR hardware required)
- Full world exploration works on-screen
- User enters VR only via explicit **Enter VR** action (WebXR immersive-vr)

## Highlights

- Polished cinematic hub world with six explorable zones:
  - Central LingMao Plaza
  - Hangzhou Mud Cat Pavilion (半山泥貓)
  - Yunnan Tile Cat Pavilion (瓦貓)
  - Cultural Story Gallery
  - Creative Product Hall
  - VR Portal / Entry Zone
- Premium UI/UX:
  - Hero landing overlay
  - Beautiful loading screen
  - Elegant top HUD and info panels
  - Tooltip hover feedback and hotspot storytelling
- Interaction systems:
  - Desktop orbit + WASD locomotion
  - Clickable hotspots with smooth camera transitions
  - VR controller rays + teleport locomotion
  - VR in-world floating info panel
- Atmosphere systems:
  - Dusk/Night mood toggle
  - Procedural calligraphy-like floating glyph particles
  - Ambient audio toggle with subtle synth soundscape

## Tech Stack

- [Three.js](https://threejs.org/)
- WebGL renderer for desktop mode
- WebXR immersive-vr integration via `VRButton` pattern
- Vite (ES Modules)

## Project Structure

```text
.
├─ index.html
├─ package.json
├─ src/
│  ├─ main.js
│  ├─ core/
│  │  └─ App.js
│  ├─ data/
│  │  └─ content.js
│  ├─ styles/
│  │  └─ main.css
│  ├─ ui/
│  │  └─ UIManager.js
│  ├─ systems/
│  │  ├─ AmbientAudioSystem.js
│  │  ├─ CameraSystem.js
│  │  ├─ EnvironmentSystem.js
│  │  ├─ HotspotSystem.js
│  │  ├─ InfoBillboard.js
│  │  ├─ MotifParticles.js
│  │  ├─ VRSystem.js
│  │  └─ ZoneSystem.js
│  └─ utils/
│     ├─ math.js
│     └─ textures.js
└─ README.md
```

## Run Locally

### One-click startup (Windows)

- Double-click [一鍵啟動.bat](C:/Users/User/Documents/Cat Metaverse/一鍵啟動.bat)
- Or run:

```powershell
npm.cmd run start:all
```

This will:
- install dependencies automatically if needed
- start the Vite dev server in a new PowerShell window
- open browser at `http://localhost:5173`

### 1) Install dependencies

```powershell
npm.cmd install
```

### 2) Start dev server

```powershell
npm.cmd run dev
```

Then open the local URL shown by Vite (usually `http://localhost:5173`).

### 3) Build production bundle

```powershell
npm.cmd run build
```

### 4) Preview production bundle

```powershell
npm.cmd run preview
```

## Controls

### Desktop mode (default)

- Mouse drag: orbit/look
- Scroll: zoom
- `W A S D`: move camera
- `Shift`: faster movement
- `Q / E`: down/up movement
- Click glowing hotspots: open stories + smooth camera focus

### VR mode (optional)

- Enter VR from hero button, top button, or VR hotspot
- Controller ray: point at hotspots and select
- Controller select on floor/platform: teleport locomotion

## How WebXR Is Triggered

The app follows an explicit user-action flow:

1. World loads in regular WebGL desktop mode
2. User clicks **Enter VR**
3. A portal transition effect plays
4. Hidden native `VRButton` (Three.js WebXR pattern) is triggered
5. Browser requests `immersive-vr` session

No auto-entry into VR is performed.

## Notes

- If the browser/device does not support immersive WebXR, desktop mode still provides the full experience.
- For many devices, immersive VR requires HTTPS or localhost-secure context.
- Scene uses procedural/placeholder geometry by design, with an art-directed presentation suitable for proposal demos and portfolio showcases.

## Concept Framing

This demo communicates LingMao YouLi as a **replicable digital platform**, not a single-IP endpoint:

- Heritage digitization
- AIGC-assisted design
- Productization pipeline
- Cultural commerce activation
- Future multi-region expansion

Initial featured prototype heritage cases:

- Hangzhou BanShan Mud Cat
- Yunnan Wa Cat

## Deploy to GitHub Pages

If you open the root `index.html` directly by double-click, it may show a blank page because this project needs Vite build output.

Use this deployment flow instead:

1. Push this repository to GitHub (default branch `main` or `master`).
2. In GitHub repository settings, go to **Pages** and set **Source** to **GitHub Actions**.
3. Push a commit; workflow `.github/workflows/deploy-pages.yml` will build and deploy `dist` automatically.
4. Open your published site URL from GitHub Pages.

For local production preview:

```powershell
npm.cmd run build
npm.cmd run preview
```
