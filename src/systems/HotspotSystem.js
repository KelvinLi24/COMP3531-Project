import * as THREE from 'three';
import { HOTSPOTS } from '../data/content.js';
import { createBadgeTexture } from '../utils/textures.js';

function makeHotspotVisual(hotspot) {
  const group = new THREE.Group();
  group.position.fromArray(hotspot.position);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.055, 12, 34),
    new THREE.MeshStandardMaterial({
      color: '#83ebd4',
      roughness: 0.18,
      metalness: 0.72,
      emissive: '#4fc9b3',
      emissiveIntensity: 0.7
    })
  );
  ring.rotation.x = Math.PI / 2;

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 16, 16),
    new THREE.MeshStandardMaterial({
      color: '#ffdc9c',
      roughness: 0.3,
      metalness: 0.56,
      emissive: '#d29944',
      emissiveIntensity: 0.78
    })
  );

  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.2),
    new THREE.MeshBasicMaterial({
      color: '#89eed8',
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  halo.position.y = 0.04;

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.0, 12),
    new THREE.MeshBasicMaterial({
      color: '#9deedc',
      transparent: true,
      opacity: 0.45
    })
  );
  beam.position.y = 0.65;

  const labelTexture = createBadgeTexture({
    title: hotspot.title,
    subtitle: hotspot.subtitle,
    width: 980,
    height: 290,
    background: 'rgba(7, 41, 50, 0.76)',
    border: 'rgba(224, 187, 101, 0.95)'
  });

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 1.06),
    new THREE.MeshBasicMaterial({
      map: labelTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.86
    })
  );
  label.position.set(0, 1.55, 0);

  group.add(ring, core, halo, beam, label);

  const pickTarget = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 14, 12),
    new THREE.MeshBasicMaterial({
      visible: false
    })
  );
  pickTarget.position.set(0, 0.2, 0);
  group.add(pickTarget);

  return {
    group,
    ring,
    core,
    halo,
    beam,
    label,
    pickTarget
  };
}

export class HotspotSystem {
  constructor(scene, camera, domElement, callbacks = {}) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;

    this.onSelect = callbacks.onSelect ?? (() => {});
    this.onHover = callbacks.onHover ?? (() => {});

    this.group = new THREE.Group();
    this.group.name = 'HotspotSystem';
    this.scene.add(this.group);

    this.hotspots = HOTSPOTS.map((hotspot) => {
      const visual = makeHotspotVisual(hotspot);
      visual.group.userData.hotspotId = hotspot.id;
      visual.pickTarget.userData.hotspotId = hotspot.id;

      visual.group.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });

      this.group.add(visual.group);

      return {
        data: hotspot,
        ...visual,
        pulse: Math.random() * Math.PI * 2,
        selectedPulse: 0
      };
    });

    this.hotspotMap = new Map(this.hotspots.map((entry) => [entry.data.id, entry]));

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-5, -5);
    this.lastPointer = { x: 0, y: 0 };

    this.hoveredId = null;
    this.externalHoveredId = null;
    this.isVRPresenting = false;

    this.pickables = this.hotspots.map((entry) => entry.pickTarget);

    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.domElement.addEventListener('pointermove', this.handlePointerMove);
    this.domElement.addEventListener('pointerleave', this.handlePointerLeave);
    this.domElement.addEventListener('click', this.handleClick);
  }

  setVRPresenting(value) {
    this.isVRPresenting = value;

    if (value) {
      this.clearHover();
    }
  }

  handlePointerMove(event) {
    if (this.isVRPresenting) {
      return;
    }

    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.lastPointer.x = event.clientX;
    this.lastPointer.y = event.clientY;
  }

  handlePointerLeave() {
    if (this.isVRPresenting) {
      return;
    }

    this.pointer.set(-5, -5);
    this.clearHover();
  }

  handleClick() {
    if (this.isVRPresenting) {
      return;
    }

    if (!this.hoveredId) {
      return;
    }

    this.activate(this.hoveredId, 'desktop');
  }

  clearHover() {
    if (this.hoveredId) {
      const prev = this.hotspotMap.get(this.hoveredId);
      if (prev) {
        prev.ring.material.emissiveIntensity = 0.7;
        prev.core.material.emissiveIntensity = 0.78;
      }
    }

    this.hoveredId = null;
    this.onHover(null, this.lastPointer);
    this.domElement.style.cursor = 'default';
  }

  setHoverById(hotspotId) {
    const nextId = hotspotId ?? null;
    if (this.hoveredId === nextId) {
      return;
    }

    if (this.hoveredId) {
      const prev = this.hotspotMap.get(this.hoveredId);
      if (prev) {
        prev.ring.material.emissiveIntensity = 0.7;
        prev.core.material.emissiveIntensity = 0.78;
      }
    }

    this.hoveredId = nextId;

    if (this.hoveredId) {
      const entry = this.hotspotMap.get(this.hoveredId);
      if (entry) {
        entry.ring.material.emissiveIntensity = 1.3;
        entry.core.material.emissiveIntensity = 1.4;
        this.onHover(entry.data, this.lastPointer);
        this.domElement.style.cursor = 'pointer';
      }
    } else {
      this.onHover(null, this.lastPointer);
      this.domElement.style.cursor = 'default';
    }
  }

  setExternalHover(hotspotId) {
    this.externalHoveredId = hotspotId;
  }

  activate(hotspotId, source = 'desktop') {
    const entry = this.hotspotMap.get(hotspotId);
    if (!entry) {
      return;
    }

    entry.selectedPulse = 1;
    this.onSelect(entry.data, source);
  }

  getHotspotById(hotspotId) {
    return this.hotspotMap.get(hotspotId)?.data ?? null;
  }

  getIntersection(raycaster) {
    const intersections = raycaster.intersectObjects(this.pickables, false);
    if (!intersections.length) {
      return null;
    }

    const hit = intersections[0];
    const hotspotId = hit.object.userData.hotspotId;
    const entry = this.hotspotMap.get(hotspotId);

    if (!entry) {
      return null;
    }

    return {
      hotspotId,
      distance: hit.distance,
      point: hit.point,
      entry,
      data: entry.data
    };
  }

  update(delta, elapsed, cameraPosition) {
    if (!this.isVRPresenting) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hit = this.getIntersection(this.raycaster);
      this.setHoverById(hit?.hotspotId ?? null);
    }

    this.hotspots.forEach((entry, index) => {
      entry.pulse += delta * (1.3 + index * 0.02);

      const pulse = 1 + Math.sin(entry.pulse) * 0.1;
      entry.ring.scale.setScalar(pulse);
      entry.halo.material.opacity = 0.18 + (Math.sin(entry.pulse * 1.8) + 1) * 0.09;
      entry.ring.rotation.z += delta * 0.68;
      entry.label.lookAt(cameraPosition);

      if (entry.selectedPulse > 0) {
        entry.selectedPulse = Math.max(0, entry.selectedPulse - delta * 1.4);
      }

      const selectedGlow = entry.selectedPulse * 0.8;
      const vrGlow = this.externalHoveredId === entry.data.id ? 0.62 : 0;
      entry.core.material.emissiveIntensity = 0.78 + selectedGlow + vrGlow;
      entry.ring.material.emissiveIntensity =
        (this.hoveredId === entry.data.id ? 1.3 : 0.7) + selectedGlow + vrGlow;
    });
  }

  dispose() {
    this.domElement.removeEventListener('pointermove', this.handlePointerMove);
    this.domElement.removeEventListener('pointerleave', this.handlePointerLeave);
    this.domElement.removeEventListener('click', this.handleClick);
  }
}
