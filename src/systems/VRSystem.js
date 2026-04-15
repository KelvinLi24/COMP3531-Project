import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

const DEFAULT_LINE_LENGTH = 14;

export class VRSystem {
  constructor(renderer, scene, camera, hotspotSystem, callbacks = {}) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.hotspotSystem = hotspotSystem;

    this.onSessionStart = callbacks.onSessionStart ?? (() => {});
    this.onSessionEnd = callbacks.onSessionEnd ?? (() => {});
    this.onStatus = callbacks.onStatus ?? (() => {});

    this.isSupported = false;
    this.vrButton = null;

    this.controllers = [];
    this.controllerGrips = [];

    this.raycaster = new THREE.Raycaster();
    this.tempMatrix = new THREE.Matrix4();

    this.teleportSurfaces = [];
    this.referenceSpace = null;

    this.teleportMarker = new THREE.Mesh(
      new THREE.RingGeometry(0.24, 0.36, 36),
      new THREE.MeshBasicMaterial({
        color: '#8ef3df',
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    this.teleportMarker.rotation.x = -Math.PI / 2;
    this.teleportMarker.visible = false;
    this.scene.add(this.teleportMarker);

    this.activeHoverId = null;

    this.handleSessionStart = this.handleSessionStart.bind(this);
    this.handleSessionEnd = this.handleSessionEnd.bind(this);
  }

  setTeleportSurfaces(surfaces) {
    this.teleportSurfaces = surfaces;
  }

  async init() {
    this.vrButton = VRButton.createButton(this.renderer, {
      optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking']
    });

    this.vrButton.id = 'native-vr-button';
    this.vrButton.style.display = 'none';
    document.body.appendChild(this.vrButton);

    if (navigator.xr && navigator.xr.isSessionSupported) {
      try {
        this.isSupported = await navigator.xr.isSessionSupported('immersive-vr');
      } catch {
        this.isSupported = false;
      }
    }

    if (this.isSupported) {
      this.setupControllers();
      this.renderer.xr.addEventListener('sessionstart', this.handleSessionStart);
      this.renderer.xr.addEventListener('sessionend', this.handleSessionEnd);
    }

    return this.isSupported;
  }

  handleSessionStart() {
    this.referenceSpace = this.renderer.xr.getReferenceSpace();
    this.onSessionStart();
    this.onStatus('WebXR session started. Use controller rays to teleport or open hotspots.', 'success');
  }

  handleSessionEnd() {
    this.teleportMarker.visible = false;
    this.hotspotSystem.setExternalHover(null);
    this.activeHoverId = null;

    this.onSessionEnd();
    this.onStatus('Returned to desktop mode.', 'neutral');
  }

  setupControllers() {
    const controllerModelFactory = new XRControllerModelFactory();

    for (let i = 0; i < 2; i += 1) {
      const controller = this.renderer.xr.getController(i);
      controller.userData.index = i;

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
      ]);

      const line = new THREE.Line(
        lineGeometry,
        new THREE.LineBasicMaterial({ color: '#8ef3df', transparent: true, opacity: 0.95 })
      );
      line.name = 'controllerRay';
      line.scale.z = DEFAULT_LINE_LENGTH;
      controller.add(line);

      controller.addEventListener('selectstart', () => {
        this.handleSelect(controller);
      });

      this.scene.add(controller);
      this.controllers.push(controller);

      const grip = this.renderer.xr.getControllerGrip(i);
      grip.add(controllerModelFactory.createControllerModel(grip));
      this.scene.add(grip);
      this.controllerGrips.push(grip);
    }
  }

  createRayFromController(controller) {
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

    return this.raycaster;
  }

  findInteractions(raycaster) {
    const hotspotHit = this.hotspotSystem.getIntersection(raycaster);
    const teleportHits = raycaster.intersectObjects(this.teleportSurfaces, true);
    const teleportHit = teleportHits.length > 0 ? teleportHits[0] : null;

    return { hotspotHit, teleportHit };
  }

  updateControllerVisual(controller, interaction) {
    const line = controller.getObjectByName('controllerRay');
    if (!line) {
      return;
    }

    let length = DEFAULT_LINE_LENGTH;
    let color = '#8ef3df';

    if (interaction.hotspotHit) {
      length = interaction.hotspotHit.distance;
      color = '#ffd792';
    } else if (interaction.teleportHit) {
      length = interaction.teleportHit.distance;
      color = '#92ffe2';
    }

    line.scale.z = Math.max(0.15, Math.min(DEFAULT_LINE_LENGTH, length));
    line.material.color.set(color);
  }

  teleportTo(targetPoint) {
    if (!this.renderer.xr.isPresenting || !this.referenceSpace) {
      return;
    }

    if (typeof XRRigidTransform === 'undefined') {
      return;
    }

    const xrCamera = this.renderer.xr.getCamera(this.camera);
    const headsetWorldPosition = new THREE.Vector3();
    headsetWorldPosition.setFromMatrixPosition(xrCamera.matrixWorld);

    const offset = new THREE.Vector3(
      targetPoint.x - headsetWorldPosition.x,
      0,
      targetPoint.z - headsetWorldPosition.z
    );

    const transform = new XRRigidTransform({
      x: -offset.x,
      y: 0,
      z: -offset.z
    });

    this.referenceSpace = this.referenceSpace.getOffsetReferenceSpace(transform);
    this.renderer.xr.setReferenceSpace(this.referenceSpace);
  }

  handleSelect(controller) {
    if (!this.renderer.xr.isPresenting) {
      return;
    }

    const raycaster = this.createRayFromController(controller);
    const { hotspotHit, teleportHit } = this.findInteractions(raycaster);

    if (hotspotHit) {
      this.hotspotSystem.activate(hotspotHit.hotspotId, 'vr');
      return;
    }

    if (teleportHit) {
      this.teleportTo(teleportHit.point);
      this.onStatus('Teleported in VR space.', 'neutral');
    }
  }

  async enterVR() {
    if (!this.isSupported) {
      this.onStatus('WebXR immersive-vr is not available on this device/browser.', 'warn');
      return false;
    }

    if (!this.vrButton) {
      this.onStatus('VR button is not ready yet.', 'warn');
      return false;
    }

    this.vrButton.click();
    return true;
  }

  update() {
    if (!this.renderer.xr.isPresenting) {
      this.teleportMarker.visible = false;
      this.hotspotSystem.setExternalHover(null);
      this.activeHoverId = null;
      return;
    }

    let selectedHover = null;
    let markerPoint = null;

    this.controllers.forEach((controller) => {
      const raycaster = this.createRayFromController(controller);
      const interaction = this.findInteractions(raycaster);
      this.updateControllerVisual(controller, interaction);

      if (!selectedHover && interaction.hotspotHit) {
        selectedHover = interaction.hotspotHit.hotspotId;
      }

      if (!markerPoint && interaction.teleportHit) {
        markerPoint = interaction.teleportHit.point;
      }
    });

    this.hotspotSystem.setExternalHover(selectedHover);
    this.activeHoverId = selectedHover;

    if (markerPoint) {
      this.teleportMarker.visible = true;
      this.teleportMarker.position.copy(markerPoint).add(new THREE.Vector3(0, 0.02, 0));
      this.teleportMarker.rotation.z += 0.03;
    } else {
      this.teleportMarker.visible = false;
    }
  }
}
