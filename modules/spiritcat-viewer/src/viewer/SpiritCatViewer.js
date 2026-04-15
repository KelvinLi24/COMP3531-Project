import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class SpiritCatViewer {
  constructor({ container, modelPath, onProgress, onReady, onError }) {
    this.container = container;
    this.modelPath = modelPath;
    this.onProgress = onProgress;
    this.onReady = onReady;
    this.onError = onError;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();
    this.cameraOffset = new THREE.Vector3(1, 0.55, 1.15);

    this.rootGroup = null;
    this.modelGroup = null;
    this.pedestalGlow = null;
    this.animationFrameId = null;
    this.didReportLoadCompletion = false;

    this.handleResize = this.handleResize.bind(this);
    this.render = this.render.bind(this);
  }

  start() {
    this.setupScene();
    this.loadModel();
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    this.render();
  }

  setupScene() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x08202b);
    this.scene.fog = new THREE.Fog(0x08202b, 12, 30);

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    this.camera.position.set(2.8, 1.9, 3.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 8.5;
    this.controls.maxPolarAngle = Math.PI * 0.49;
    this.controls.target.set(0, 0.92, 0);

    this.rootGroup = new THREE.Group();
    this.modelGroup = new THREE.Group();
    this.rootGroup.add(this.modelGroup);
    this.scene.add(this.rootGroup);

    this.addLighting();
    this.addPedestal();
  }

  addLighting() {
    const hemisphere = new THREE.HemisphereLight(0xb9f5ff, 0x1a2e34, 1.15);
    this.scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(0xe5f9ff, 1.85);
    keyLight.position.set(3.2, 5.4, 4.6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.4;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbbefff, 0.85);
    fillLight.position.set(-3, 3.2, 2.4);
    this.scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x73e8f5, 2.8, 22, 2);
    rimLight.position.set(-4, 2.2, -3.8);
    this.scene.add(rimLight);

    const goldKick = new THREE.PointLight(0xf2cb89, 1.7, 18, 2);
    goldKick.position.set(2.2, 1.2, 2);
    this.scene.add(goldKick);
  }

  addPedestal() {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(8, 80),
      new THREE.MeshStandardMaterial({
        color: 0x0b1e26,
        roughness: 0.92,
        metalness: 0.05
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 1.8, 0.34, 64),
      new THREE.MeshStandardMaterial({
        color: 0x123341,
        roughness: 0.35,
        metalness: 0.28
      })
    );
    base.position.y = 0.08;
    base.receiveShadow = true;
    base.castShadow = true;
    this.scene.add(base);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.03, 24, 120),
      new THREE.MeshStandardMaterial({
        color: 0x9fefff,
        emissive: 0x2a7a8b,
        emissiveIntensity: 0.46,
        roughness: 0.22,
        metalness: 0.7
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.24;
    this.pedestalGlow = ring;
    this.scene.add(ring);
  }

  loadModel() {
    const loader = new GLTFLoader();

    loader.load(
      this.modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        this.centerAndScaleModel(model);
        this.modelGroup.add(model);

        if (!this.didReportLoadCompletion) {
          this.didReportLoadCompletion = true;
          this.onProgress?.(1);
        }
        this.onReady?.();
      },
      (event) => {
        if (event.total > 0) {
          const ratio = Math.min(1, event.loaded / event.total);
          this.onProgress?.(ratio);
        }
      },
      () => {
        this.onError?.(
          `Unable to load ${this.modelPath}. Confirm the model exists under modules/spiritcat-viewer/public/assets/models/.`
        );
      }
    );
  }

  centerAndScaleModel(model) {
    const originalBox = new THREE.Box3().setFromObject(model);
    const size = originalBox.getSize(new THREE.Vector3());
    const center = originalBox.getCenter(new THREE.Vector3());

    model.position.sub(center);

    // Normalize model size so different GLB exports still frame well in this fixed showcase layout.
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const desiredSize = 2.1;
    const scale = desiredSize / maxDimension;
    model.scale.setScalar(scale);

    const normalizedBox = new THREE.Box3().setFromObject(model);
    model.position.y -= normalizedBox.min.y - 0.28;
    this.frameModel(model);
  }

  frameModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const halfFovY = THREE.MathUtils.degToRad(this.camera.fov * 0.5);
    const fitHeightDistance = (size.y * 0.68) / Math.tan(halfFovY);
    const fitWidthDistance =
      ((size.x * 0.62) / Math.tan(halfFovY)) / Math.max(this.camera.aspect, 1);
    const distance = Math.max(fitHeightDistance, fitWidthDistance, 2.5);

    // Bias target slightly above center so ears/head keep safe top margin.
    const targetY = center.y + size.y * 0.12;
    this.controls.target.set(center.x, targetY, center.z);

    this.camera.position.set(
      center.x + this.cameraOffset.x * distance,
      targetY + this.cameraOffset.y * distance,
      center.z + this.cameraOffset.z * distance
    );
    this.camera.near = 0.1;
    this.camera.far = Math.max(120, distance * 30);
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  render() {
    this.animationFrameId = window.requestAnimationFrame(this.render);

    const delta = Math.min(0.05, this.clock.getDelta());
    const elapsed = this.clock.elapsedTime;

    if (this.modelGroup) {
      this.modelGroup.rotation.y += delta * 0.18;
    }

    if (this.pedestalGlow?.material) {
      this.pedestalGlow.material.emissiveIntensity = 0.38 + Math.sin(elapsed * 1.6) * 0.1;
    }

    this.controls?.update();
    this.renderer?.render(this.scene, this.camera);
  }

  handleResize() {
    if (!this.container || !this.camera || !this.renderer) {
      return;
    }

    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize);
    window.cancelAnimationFrame(this.animationFrameId);

    this.controls?.dispose();
    this.renderer?.dispose();

    if (this.renderer?.domElement && this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
