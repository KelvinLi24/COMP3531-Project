import * as THREE from 'three';
import { ZONES } from '../data/content.js';
import { AmbientAudioSystem } from '../systems/AmbientAudioSystem.js';
import { CameraSystem } from '../systems/CameraSystem.js';
import { EnvironmentSystem } from '../systems/EnvironmentSystem.js';
import { HotspotSystem } from '../systems/HotspotSystem.js';
import { InfoBillboard } from '../systems/InfoBillboard.js';
import { MotifParticles } from '../systems/MotifParticles.js';
import { VRSystem } from '../systems/VRSystem.js';
import { ZoneSystem } from '../systems/ZoneSystem.js';
import { UIManager } from '../ui/UIManager.js';

export class App {
  constructor(container) {
    this.container = container;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.clock = new THREE.Clock();

    this.ui = null;
    this.environment = null;
    this.zoneSystem = null;
    this.cameraSystem = null;
    this.hotspotSystem = null;
    this.particles = null;
    this.vrSystem = null;
    this.infoBillboard = null;
    this.audioSystem = null;

    this.isStarted = false;

    this.viewerPosition = new THREE.Vector3();

    this.onResize = this.onResize.bind(this);
    this.render = this.render.bind(this);
  }

  async init() {
    this.ui = new UIManager(this.container);

    this.ui.setLoading(8, 'Configuring renderer...');
    this.setupScene();

    this.ui.setLoading(24, 'Lighting and atmosphere...');
    this.environment = new EnvironmentSystem(this.scene);

    this.ui.setLoading(42, 'Building metaverse districts...');
    this.zoneSystem = new ZoneSystem(this.scene);

    this.ui.setLoading(57, 'Preparing navigation controls...');
    this.cameraSystem = new CameraSystem(this.camera, this.renderer.domElement);

    this.ui.setLoading(71, 'Adding cultural interactions...');
    this.hotspotSystem = new HotspotSystem(this.scene, this.camera, this.renderer.domElement, {
      onSelect: (hotspot, source) => this.handleHotspotSelection(hotspot, source),
      onHover: (hotspot, pointer) => this.handleHotspotHover(hotspot, pointer)
    });

    this.ui.setLoading(83, 'Animating motifs and ambience...');
    this.particles = new MotifParticles(this.scene);
    this.infoBillboard = new InfoBillboard(this.scene);
    this.audioSystem = new AmbientAudioSystem();

    this.ui.setLoading(92, 'Enabling optional WebXR mode...');
    this.vrSystem = new VRSystem(this.renderer, this.scene, this.camera, this.hotspotSystem, {
      onSessionStart: () => this.handleVRSessionStart(),
      onSessionEnd: () => this.handleVRSessionEnd(),
      onStatus: (text, tone) => this.ui.showStatus(text, tone)
    });
    const vrSupported = await this.vrSystem.init();
    this.vrSystem.setTeleportSurfaces(this.zoneSystem.getTeleportSurfaces());

    this.bindUIEvents();

    this.ui.setVRAvailability(vrSupported);
    this.ui.setFreeWalkEnabled(true);
    this.ui.setMood('dusk');
    this.ui.setAudioEnabled(false);

    this.jumpToZone('plaza', false);

    this.ui.setLoading(100, 'Ready. Enter when you are ready.');
    window.setTimeout(() => {
      this.ui.hideLoading();
      this.ui.showHero();
    }, 520);

    window.addEventListener('resize', this.onResize);

    this.renderer.setAnimationLoop(this.render);
  }

  setupScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      420
    );
    this.camera.position.set(0, 7, 22);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.xr.enabled = true;

    this.renderer.domElement.setAttribute('aria-label', 'LingMao YouLi 3D scene');

    this.ui.mountRendererCanvas(this.renderer.domElement);
  }

  bindUIEvents() {
    this.ui.on({
      onExplore: () => this.startDesktopExperience(),
      onEnterVR: () => this.requestEnterVR(),
      onZoneSelect: (zoneId) => this.jumpToZone(zoneId, true),
      onToggleMood: () => this.toggleMood(),
      onToggleAudio: async () => {
        const enabled = await this.audioSystem.toggle();
        this.ui.setAudioEnabled(enabled);
      },
      onToggleFreeWalk: () => this.toggleFreeWalk()
    });
  }

  startDesktopExperience() {
    if (!this.isStarted) {
      this.isStarted = true;
      this.ui.hideHero();
      this.ui.showTopUI();
      this.ui.showStatus(
        'Desktop exploration active. Drag to look. Use WASD + Shift to navigate.',
        'neutral',
        5000
      );
    }
  }

  async requestEnterVR() {
    this.startDesktopExperience();

    this.ui.flashPortal();
    await this.audioSystem.playCue(540);

    const entered = await this.vrSystem.enterVR();
    if (!entered) {
      this.ui.showStatus('Could not enter VR. Continue exploring in desktop mode.', 'warn');
    }
  }

  toggleMood() {
    const nextMood = this.environment.toggleMood();
    this.ui.setMood(nextMood);
    this.ui.showStatus(nextMood === 'night' ? 'Atmosphere switched to night.' : 'Atmosphere switched to dusk.');
  }

  toggleFreeWalk() {
    const next = !this.cameraSystem.freeWalkEnabled;
    this.cameraSystem.setFreeWalkEnabled(next);
    this.ui.setFreeWalkEnabled(next);

    this.ui.showStatus(
      next ? 'WASD locomotion enabled.' : 'WASD locomotion disabled. Orbit-only navigation active.',
      'neutral'
    );
  }

  jumpToZone(zoneId, withInfo = false) {
    const zone = ZONES.find((item) => item.id === zoneId);
    if (!zone) {
      return;
    }

    const position = new THREE.Vector3(...zone.cameraPosition);
    const target = new THREE.Vector3(...zone.cameraTarget);

    if (this.renderer.xr.isPresenting) {
      this.ui.showStatus('Zone jumping is disabled while in immersive VR.', 'warn');
      return;
    }

    this.cameraSystem.focus(position, target, 1.8);
    this.ui.setZoneActive(zoneId);

    if (withInfo) {
      this.ui.showInfo({
        title: zone.label,
        subtitle: zone.chineseLabel,
        body: zone.summary,
        zoneId
      });
    }
  }

  async handleHotspotSelection(hotspot, source) {
    if (hotspot.focusPosition && hotspot.focusTarget && !this.renderer.xr.isPresenting) {
      const focusPosition = new THREE.Vector3(...hotspot.focusPosition);
      const focusTarget = new THREE.Vector3(...hotspot.focusTarget);
      this.cameraSystem.focus(focusPosition, focusTarget, 1.45);
    }

    await this.audioSystem.playCue(source === 'vr' ? 740 : 620);

    if (this.renderer.xr.isPresenting || source === 'vr') {
      this.infoBillboard.show(hotspot, 12);
    } else {
      this.ui.showInfo(hotspot);
    }

    this.ui.setZoneActive(hotspot.zoneId);

    if (hotspot.action === 'enter-vr' && source !== 'vr') {
      this.requestEnterVR();
      return;
    }

    this.ui.showStatus(
      source === 'vr' ? 'Hotspot opened in VR panel.' : `${hotspot.title} opened.`,
      source === 'vr' ? 'success' : 'neutral'
    );
  }

  handleHotspotHover(hotspot, pointer) {
    if (this.renderer.xr.isPresenting) {
      this.ui.hideTooltip();
      return;
    }

    this.ui.showTooltip(hotspot, pointer);
  }

  handleVRSessionStart() {
    this.cameraSystem.setVRPresenting(true);
    this.hotspotSystem.setVRPresenting(true);
    this.ui.hideTooltip();
    this.ui.hideInfo();
    this.ui.toggleAboutPanel(false);

    this.ui.showStatus('Immersive VR mode active.', 'success');
  }

  handleVRSessionEnd() {
    this.cameraSystem.setVRPresenting(false);
    this.hotspotSystem.setVRPresenting(false);
    this.infoBillboard.hide();

    this.ui.showStatus('Desktop mode resumed.', 'neutral');
  }

  getViewerPosition() {
    if (this.renderer.xr.isPresenting) {
      const xrCamera = this.renderer.xr.getCamera(this.camera);
      this.viewerPosition.setFromMatrixPosition(xrCamera.matrixWorld);
      return this.viewerPosition;
    }

    this.viewerPosition.copy(this.camera.position);
    return this.viewerPosition;
  }

  render() {
    const delta = Math.min(0.05, this.clock.getDelta());
    const elapsed = this.clock.elapsedTime;

    this.cameraSystem.update(delta);
    this.environment.update(delta, this.renderer);

    const viewerPosition = this.getViewerPosition();

    this.zoneSystem.update(delta, elapsed, viewerPosition);
    this.particles.update(delta, elapsed, viewerPosition);
    this.hotspotSystem.update(delta, elapsed, viewerPosition);
    this.vrSystem.update();
    const activeCamera = this.renderer.xr.isPresenting
      ? this.renderer.xr.getCamera(this.camera)
      : this.camera;
    this.infoBillboard.update(delta, activeCamera, this.renderer.xr.isPresenting);

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
