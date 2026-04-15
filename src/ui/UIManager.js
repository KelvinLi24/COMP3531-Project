import { ZONES } from '../data/content.js';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export class UIManager {
  constructor(container) {
    this.container = container;
    this.callbacks = {};

    this.build();
    this.cacheElements();
    this.bindInternalEvents();
  }

  build() {
    const zoneButtons = ZONES.map(
      (zone) =>
        `<button class="zone-btn" data-zone-id="${zone.id}" title="${zone.label}">${zone.shortLabel}</button>`
    ).join('');

    this.container.innerHTML = `
      <div id="scene-root" aria-label="3D scene container"></div>

      <div id="loading-screen" class="fade-visible">
        <div class="loading-inner">
          <p class="loading-overline">AIGC Intangible Cultural Heritage Metaverse</p>
          <h1>靈貓有禮 LingMao YouLi</h1>
          <p id="loading-text">Initializing cultural world...</p>
          <div class="loading-track">
            <div id="loading-progress"></div>
          </div>
        </div>
      </div>

      <div id="hero-overlay" class="fade-visible">
        <div class="hero-backdrop"></div>
        <div class="hero-content">
          <p class="hero-overline">WebGL + Optional WebXR</p>
          <h2>靈貓有禮 LingMao YouLi</h2>
          <h3>AIGC Intangible Cultural Heritage VR Metaverse</h3>
          <p>
            Begin in desktop browser mode. Explore pavilions, stories, and products on screen. Enter VR only when you choose.
          </p>
          <div class="hero-actions">
            <button id="btn-explore" class="primary-btn">Explore on Screen</button>
            <button id="btn-enter-vr-hero" class="outline-btn">Enter VR</button>
          </div>
          <p id="vr-support-note" class="hero-note">Checking WebXR support...</p>
        </div>
      </div>

      <header id="top-ui" class="hidden-ui" aria-label="top controls">
        <div class="top-ui-left">
          ${zoneButtons}
        </div>

        <div class="top-ui-right">
          <button id="btn-freewalk" class="glass-btn">WASD On</button>
          <button id="btn-mood" class="glass-btn">Mood: Dusk</button>
          <button id="btn-audio" class="glass-btn">Audio: Off</button>
          <button id="btn-enter-vr-top" class="glass-btn accent">Enter VR</button>
          <button id="btn-about" class="glass-btn">About</button>
        </div>
      </header>

      <aside id="info-panel" class="panel-hidden" aria-label="info panel">
        <button id="btn-close-info" class="close-btn" aria-label="Close panel">×</button>
        <p id="info-zone" class="info-zone"></p>
        <h4 id="info-title"></h4>
        <p id="info-subtitle" class="info-subtitle"></p>
        <p id="info-body" class="info-body"></p>
      </aside>

      <aside id="about-panel" class="panel-hidden" aria-label="about panel">
        <button id="btn-close-about" class="close-btn" aria-label="Close about">×</button>
        <h4>About LingMao YouLi</h4>
        <p>
          LingMao YouLi is a cultural-tech platform concept for transforming intangible heritage into immersive storytelling,
          creative products, and scalable commerce experiences.
        </p>
        <p>
          Current prototype cases: Hangzhou BanShan Mud Cat and Yunnan Wa Cat. The pipeline is designed for future
          expansion to additional regional cultural themes.
        </p>
      </aside>

      <div id="deploy-test-banner" aria-label="deployment test banner">
        <p>DEPLOY TEST MARKER</p>
        <p>BUILD VERSION: 2026-04-16-1</p>
        <p>If you can read this, GitHub Pages is serving the latest build.</p>
      </div>

      <div id="hover-tooltip" class="tooltip-hidden"></div>
      <div id="vr-status" class="status-hidden"></div>
      <div id="portal-flash"></div>
    `;
  }

  cacheElements() {
    this.sceneRoot = this.container.querySelector('#scene-root');

    this.loadingScreen = this.container.querySelector('#loading-screen');
    this.loadingText = this.container.querySelector('#loading-text');
    this.loadingProgress = this.container.querySelector('#loading-progress');

    this.hero = this.container.querySelector('#hero-overlay');
    this.exploreButton = this.container.querySelector('#btn-explore');
    this.enterVrHeroButton = this.container.querySelector('#btn-enter-vr-hero');
    this.vrSupportNote = this.container.querySelector('#vr-support-note');

    this.topUi = this.container.querySelector('#top-ui');
    this.zoneButtons = [...this.container.querySelectorAll('.zone-btn')];
    this.freeWalkButton = this.container.querySelector('#btn-freewalk');
    this.moodButton = this.container.querySelector('#btn-mood');
    this.audioButton = this.container.querySelector('#btn-audio');
    this.enterVrTopButton = this.container.querySelector('#btn-enter-vr-top');
    this.aboutButton = this.container.querySelector('#btn-about');

    this.infoPanel = this.container.querySelector('#info-panel');
    this.infoZone = this.container.querySelector('#info-zone');
    this.infoTitle = this.container.querySelector('#info-title');
    this.infoSubtitle = this.container.querySelector('#info-subtitle');
    this.infoBody = this.container.querySelector('#info-body');
    this.closeInfoButton = this.container.querySelector('#btn-close-info');

    this.aboutPanel = this.container.querySelector('#about-panel');
    this.closeAboutButton = this.container.querySelector('#btn-close-about');

    this.tooltip = this.container.querySelector('#hover-tooltip');
    this.status = this.container.querySelector('#vr-status');
    this.portalFlash = this.container.querySelector('#portal-flash');
  }

  bindInternalEvents() {
    this.exploreButton.addEventListener('click', () => {
      this.callbacks.onExplore?.();
    });

    this.enterVrHeroButton.addEventListener('click', () => {
      this.callbacks.onEnterVR?.();
    });

    this.enterVrTopButton.addEventListener('click', () => {
      this.callbacks.onEnterVR?.();
    });

    this.moodButton.addEventListener('click', () => {
      this.callbacks.onToggleMood?.();
    });

    this.audioButton.addEventListener('click', () => {
      this.callbacks.onToggleAudio?.();
    });

    this.freeWalkButton.addEventListener('click', () => {
      this.callbacks.onToggleFreeWalk?.();
    });

    this.aboutButton.addEventListener('click', () => {
      this.toggleAboutPanel(true);
    });

    this.closeAboutButton.addEventListener('click', () => {
      this.toggleAboutPanel(false);
    });

    this.closeInfoButton.addEventListener('click', () => {
      this.hideInfo();
    });

    this.zoneButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const zoneId = button.dataset.zoneId;
        this.callbacks.onZoneSelect?.(zoneId);
      });
    });
  }

  on(callbacks) {
    this.callbacks = callbacks;
  }

  mountRendererCanvas(canvas) {
    this.sceneRoot.appendChild(canvas);
  }

  setLoading(progress, text) {
    this.loadingProgress.style.width = `${Math.max(0, Math.min(100, progress))}%`;

    if (text) {
      this.loadingText.textContent = text;
    }
  }

  hideLoading() {
    this.loadingScreen.classList.add('fade-hidden');
    window.setTimeout(() => {
      this.loadingScreen.style.display = 'none';
    }, 600);
  }

  showHero() {
    this.hero.classList.remove('fade-hidden');
    this.hero.classList.add('fade-visible');
  }

  hideHero() {
    this.hero.classList.add('fade-hidden');
    this.hero.classList.remove('fade-visible');
    window.setTimeout(() => {
      this.hero.style.pointerEvents = 'none';
    }, 420);
  }

  showTopUI() {
    this.topUi.classList.remove('hidden-ui');
  }

  setVRAvailability(isAvailable) {
    if (isAvailable) {
      this.vrSupportNote.textContent = 'VR is available. You can enter now or continue on screen.';
      this.enterVrHeroButton.disabled = false;
      this.enterVrTopButton.disabled = false;
    } else {
      this.vrSupportNote.textContent = 'VR is unavailable on this browser/device. Desktop mode remains fully available.';
      this.enterVrHeroButton.disabled = true;
      this.enterVrTopButton.disabled = true;
    }
  }

  setMood(mode) {
    const label = mode === 'night' ? 'Mood: Night' : 'Mood: Dusk';
    this.moodButton.textContent = label;
  }

  setAudioEnabled(isEnabled) {
    this.audioButton.textContent = isEnabled ? 'Audio: On' : 'Audio: Off';
  }

  setFreeWalkEnabled(isEnabled) {
    this.freeWalkButton.textContent = isEnabled ? 'WASD On' : 'WASD Off';
    this.freeWalkButton.classList.toggle('active', isEnabled);
  }

  showInfo(data) {
    const zone = ZONES.find((item) => item.id === data.zoneId);
    this.infoZone.textContent = zone
      ? `${zone.label} / ${zone.chineseLabel}`
      : 'LingMao Cultural Node';
    this.infoTitle.textContent = data.title;
    this.infoSubtitle.textContent = data.subtitle;
    this.infoBody.textContent = data.body;

    this.infoPanel.classList.remove('panel-hidden');
  }

  hideInfo() {
    this.infoPanel.classList.add('panel-hidden');
  }

  toggleAboutPanel(show) {
    this.aboutPanel.classList.toggle('panel-hidden', !show);
  }

  showTooltip(data, pointer) {
    if (!data) {
      this.tooltip.classList.add('tooltip-hidden');
      return;
    }

    this.tooltip.innerHTML = `
      <strong>${escapeHtml(data.title)}</strong>
      <span>${escapeHtml(data.subtitle)}</span>
    `;

    this.tooltip.style.left = `${pointer.x + 18}px`;
    this.tooltip.style.top = `${pointer.y + 18}px`;
    this.tooltip.classList.remove('tooltip-hidden');
  }

  hideTooltip() {
    this.tooltip.classList.add('tooltip-hidden');
  }

  flashPortal() {
    this.portalFlash.classList.remove('portal-active');

    // restart animation
    void this.portalFlash.offsetWidth;

    this.portalFlash.classList.add('portal-active');
  }

  showStatus(text, tone = 'neutral', ttlMs = 3200) {
    this.status.textContent = text;
    this.status.className = `status-visible ${tone}`;

    window.clearTimeout(this.statusTimer);
    this.statusTimer = window.setTimeout(() => {
      this.status.className = 'status-hidden';
    }, ttlMs);
  }

  setZoneActive(zoneId) {
    this.zoneButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.zoneId === zoneId);
    });
  }
}
