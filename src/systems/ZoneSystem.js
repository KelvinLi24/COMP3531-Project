import * as THREE from 'three';
import { PRODUCT_PROTOTYPES, STORY_STAGES, ZONES } from '../data/content.js';
import { createBadgeTexture, createCardTexture } from '../utils/textures.js';

function createFloorPatternTexture(size = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  ctx.fillStyle = '#05161e';
  ctx.fillRect(0, 0, size, size);

  ctx.translate(size / 2, size / 2);

  for (let i = 0; i < 13; i += 1) {
    const radius = (size * 0.45 * (i + 1)) / 13;
    ctx.strokeStyle = `rgba(109, 221, 204, ${0.018 + i * 0.004})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = 0; i < 22; i += 1) {
    const angle = (i / 22) * Math.PI * 2;
    ctx.strokeStyle = 'rgba(215, 174, 84, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * size * 0.45, Math.sin(angle) * size * 0.45);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function createPortalGradientTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const radial = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.44
  );
  radial.addColorStop(0, 'rgba(255, 237, 188, 0.92)');
  radial.addColorStop(0.32, 'rgba(106, 245, 218, 0.76)');
  radial.addColorStop(0.62, 'rgba(12, 116, 130, 0.5)');
  radial.addColorStop(1, 'rgba(5, 24, 34, 0)');

  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.44, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createPavilionRoof(width, depth, height, color) {
  const group = new THREE.Group();

  const lowerRoof = new THREE.Mesh(
    new THREE.ConeGeometry(width * 0.54, height * 0.68, 4),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.32,
      metalness: 0.12
    })
  );
  lowerRoof.rotation.y = Math.PI * 0.25;
  lowerRoof.scale.set(1.2, 0.82, depth / width);
  lowerRoof.position.y = height * 0.3;
  lowerRoof.castShadow = true;

  const upperRoof = new THREE.Mesh(
    new THREE.ConeGeometry(width * 0.38, height * 0.52, 4),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(color).offsetHSL(0, 0, 0.1),
      roughness: 0.28,
      metalness: 0.16
    })
  );
  upperRoof.rotation.y = Math.PI * 0.25;
  upperRoof.scale.set(1.1, 0.78, depth / width);
  upperRoof.position.y = height * 0.76;
  upperRoof.castShadow = true;

  group.add(lowerRoof, upperRoof);

  return group;
}

function createCatFigurine({ bodyColor, accentColor, fierce = false }) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 20, 16),
    new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.45,
      metalness: 0.2
    })
  );
  body.position.y = 1.2;

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 20, 16),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(bodyColor).offsetHSL(0, -0.03, 0.09),
      roughness: 0.42,
      metalness: 0.18
    })
  );
  head.position.set(0, 2.2, 0.45);

  const earGeometry = new THREE.ConeGeometry(0.23, fierce ? 0.75 : 0.55, 8);
  const earMaterial = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.42, metalness: 0.24 });
  const leftEar = new THREE.Mesh(earGeometry, earMaterial);
  leftEar.position.set(-0.36, 2.86, 0.5);
  leftEar.rotation.z = Math.PI * 0.13;
  const rightEar = leftEar.clone();
  rightEar.position.x = 0.36;
  rightEar.rotation.z = -Math.PI * 0.13;

  const eyeGeometry = new THREE.SphereGeometry(0.09, 10, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: fierce ? '#ffce7a' : '#f3f0d8',
    emissive: fierce ? '#d57f35' : '#6cb8bb',
    emissiveIntensity: fierce ? 0.9 : 0.45,
    roughness: 0.2,
    metalness: 0.45
  });

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.2, 2.3, 1.17);
  const rightEye = leftEye.clone();
  rightEye.position.x = 0.2;

  const tail = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.13, 14, 30, Math.PI * 1.2),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(bodyColor).offsetHSL(0, -0.06, -0.08),
      roughness: 0.48,
      metalness: 0.1
    })
  );
  tail.position.set(-0.94, 1.3, -0.4);
  tail.rotation.set(0.2, -0.8, 1.1);

  group.add(body, head, leftEar, rightEar, leftEye, rightEye, tail);
  return group;
}

function createZoneSign({ label, chineseLabel, width = 7.5, height = 2.2 }) {
  const texture = createBadgeTexture({
    title: label,
    subtitle: chineseLabel,
    width: 1280,
    height: 360,
    background: 'rgba(3, 38, 46, 0.72)',
    border: 'rgba(218, 180, 95, 0.95)'
  });

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false
  });

  return new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
}

function createStoryPanel(stage) {
  const texture = createCardTexture({
    title: stage.title,
    body: stage.body,
    accent: '#d9b46a',
    width: 980,
    height: 520
  });

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 3.8),
    new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.45,
      metalness: 0.22,
      emissive: '#17474e',
      emissiveIntensity: 0.2,
      transparent: true
    })
  );

  panel.castShadow = false;
  panel.receiveShadow = false;
  return panel;
}

function createPrototypeObject(index) {
  const group = new THREE.Group();
  const baseColorPalette = ['#6de7d0', '#f3be71', '#87c2ff', '#8deca7', '#ffcd8b', '#b7ecf3'];
  const accentPalette = ['#e6c57a', '#c8f6ec', '#ffd7a2', '#9fe8ff', '#f0dcaa', '#96ffd4'];

  const baseMat = new THREE.MeshStandardMaterial({
    color: baseColorPalette[index % baseColorPalette.length],
    roughness: 0.3,
    metalness: 0.45,
    emissive: new THREE.Color(baseColorPalette[index % baseColorPalette.length]).multiplyScalar(0.14),
    emissiveIntensity: 0.45
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: accentPalette[index % accentPalette.length],
    roughness: 0.23,
    metalness: 0.58
  });

  switch (index % 6) {
    case 0: {
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), baseMat);
      const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.08, 10, 40), accentMat);
      ribbon.rotation.x = Math.PI / 2;
      ribbon.position.y = 0.12;
      group.add(box, ribbon);
      break;
    }
    case 1: {
      const pendant = new THREE.Mesh(new THREE.TorusKnotGeometry(0.62, 0.18, 80, 16), baseMat);
      pendant.scale.setScalar(0.8);
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 24), accentMat);
      loop.position.y = 1.0;
      group.add(pendant, loop);
      break;
    }
    case 2: {
      const set = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.52, 1.6, 26), baseMat);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.22, 26), accentMat);
      lid.position.y = 0.9;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.06, 8, 24), accentMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.2;
      group.add(set, lid, ring);
      break;
    }
    case 3: {
      const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 0), baseMat);
      const frame = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), accentMat);
      frame.material = frame.material.clone();
      frame.material.wireframe = true;
      group.add(orb, frame);
      break;
    }
    case 4: {
      const ornament = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.7, 8), baseMat);
      ornament.position.y = 0.2;
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), accentMat);
      cap.position.y = 1.1;
      group.add(ornament, cap);
      break;
    }
    default: {
      const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.24, 16, 42), baseMat);
      scarf.rotation.x = Math.PI / 2.2;
      const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.07, 16, 42), accentMat);
      stripe.rotation.x = Math.PI / 2.2;
      stripe.rotation.y = Math.PI / 8;
      group.add(scarf, stripe);
      break;
    }
  }

  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}

export class ZoneSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'LingMaoHubWorld';

    this.teleportSurfaces = [];
    this.animatedObjects = [];
    this.worldLabels = [];

    this.zoneMap = new Map(ZONES.map((zone) => [zone.id, zone]));

    this.floorTexture = createFloorPatternTexture();
    this.portalTexture = createPortalGradientTexture();

    this.scene.add(this.group);

    this.buildBaseWorld();
    this.buildCentralPlaza();
    this.buildHangzhouPavilion();
    this.buildYunnanPavilion();
    this.buildStoryGallery();
    this.buildProductHall();
    this.buildVRPortalZone();
    this.buildZoneSigns();
    this.buildPaths();
  }

  getZoneById(zoneId) {
    return this.zoneMap.get(zoneId);
  }

  getTeleportSurfaces() {
    return this.teleportSurfaces;
  }

  buildBaseWorld() {
    const outerFloor = new THREE.Mesh(
      new THREE.CircleGeometry(120, 120),
      new THREE.MeshStandardMaterial({
        color: '#05131c',
        roughness: 0.93,
        metalness: 0.04
      })
    );
    outerFloor.rotation.x = -Math.PI / 2;
    outerFloor.receiveShadow = true;
    this.group.add(outerFloor);
    this.teleportSurfaces.push(outerFloor);

    const mainFloor = new THREE.Mesh(
      new THREE.CircleGeometry(78, 140),
      new THREE.MeshStandardMaterial({
        color: '#082734',
        map: this.floorTexture,
        roughness: 0.62,
        metalness: 0.2,
        emissive: '#0c2c35',
        emissiveIntensity: 0.45
      })
    );
    mainFloor.rotation.x = -Math.PI / 2;
    mainFloor.position.y = 0.02;
    mainFloor.receiveShadow = true;
    this.group.add(mainFloor);
    this.teleportSurfaces.push(mainFloor);

    const edgeRing = new THREE.Mesh(
      new THREE.TorusGeometry(79, 0.3, 12, 180),
      new THREE.MeshStandardMaterial({
        color: '#69daca',
        roughness: 0.35,
        metalness: 0.6,
        emissive: '#4fcab8',
        emissiveIntensity: 0.65
      })
    );
    edgeRing.rotation.x = Math.PI / 2;
    edgeRing.position.y = 0.16;
    edgeRing.receiveShadow = true;
    this.group.add(edgeRing);
    this.animatedObjects.push({ mesh: edgeRing, rotateSpeed: 0.042, float: 0.01 });

    const waterRing = new THREE.Mesh(
      new THREE.TorusGeometry(63, 3.5, 20, 160),
      new THREE.MeshStandardMaterial({
        color: '#083645',
        roughness: 0.22,
        metalness: 0.58,
        emissive: '#0a6072',
        emissiveIntensity: 0.28,
        transparent: true,
        opacity: 0.8
      })
    );
    waterRing.rotation.x = Math.PI / 2;
    waterRing.position.y = 0.1;
    this.group.add(waterRing);
    this.animatedObjects.push({ mesh: waterRing, rotateSpeed: -0.018, float: 0.012 });
  }

  buildCentralPlaza() {
    const zone = this.getZoneById('plaza');
    const hub = new THREE.Group();
    hub.position.fromArray(zone.anchor);
    this.group.add(hub);

    const dais = new THREE.Mesh(
      new THREE.CylinderGeometry(13.8, 15.8, 1.4, 80),
      new THREE.MeshStandardMaterial({
        color: '#0f3943',
        roughness: 0.5,
        metalness: 0.34,
        emissive: '#0f3d4f',
        emissiveIntensity: 0.32
      })
    );
    dais.position.y = 0.72;
    dais.receiveShadow = true;
    hub.add(dais);
    this.teleportSurfaces.push(dais);

    const innerDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(8.8, 9.4, 0.4, 48),
      new THREE.MeshStandardMaterial({
        color: '#144957',
        roughness: 0.26,
        metalness: 0.58,
        emissive: '#1f8f8e',
        emissiveIntensity: 0.6
      })
    );
    innerDisc.position.y = 1.15;
    hub.add(innerDisc);

    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.52, 5.5, 12),
        new THREE.MeshStandardMaterial({
          color: '#89d4ca',
          roughness: 0.3,
          metalness: 0.52
        })
      );
      pillar.position.set(Math.cos(angle) * 9.4, 3.1, Math.sin(angle) * 9.4);
      pillar.castShadow = true;
      hub.add(pillar);

      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 14, 10),
        new THREE.MeshStandardMaterial({
          color: '#e2c681',
          roughness: 0.28,
          metalness: 0.7,
          emissive: '#7f612d',
          emissiveIntensity: 0.28
        })
      );
      cap.position.copy(pillar.position).add(new THREE.Vector3(0, 2.85, 0));
      hub.add(cap);
    }

    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.y = 3.4;

    const sculpture = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.2, 0.54, 240, 28, 2, 3),
      new THREE.MeshStandardMaterial({
        color: '#f0c97c',
        roughness: 0.2,
        metalness: 0.85,
        emissive: '#b7813f',
        emissiveIntensity: 0.62
      })
    );
    sculpture.castShadow = true;
    sculptureGroup.add(sculpture);

    const emblemTexture = createBadgeTexture({
      title: '靈貓有禮',
      subtitle: 'LingMao YouLi / Cultural Metaverse',
      width: 1280,
      height: 340,
      background: 'rgba(9, 52, 63, 0.8)',
      border: 'rgba(224, 189, 101, 0.95)'
    });

    const emblem = new THREE.Mesh(
      new THREE.PlaneGeometry(8.8, 2.25),
      new THREE.MeshBasicMaterial({
        map: emblemTexture,
        transparent: true,
        depthWrite: false
      })
    );
    emblem.position.set(0, 3.8, 0);
    emblem.rotation.y = Math.PI;
    sculptureGroup.add(emblem);

    this.animatedObjects.push({
      mesh: sculptureGroup,
      rotateSpeed: 0.22,
      float: 0.3,
      floatPhase: 0
    });

    hub.add(sculptureGroup);

    const floorLight = new THREE.PointLight('#7cf1da', 1.0, 40, 2);
    floorLight.position.set(0, 5, 0);
    hub.add(floorLight);

    const archMaterial = new THREE.MeshStandardMaterial({
      color: '#1b5362',
      roughness: 0.34,
      metalness: 0.36,
      emissive: '#1e7887',
      emissiveIntensity: 0.26
    });

    for (let i = 0; i < 4; i += 1) {
      const angle = (i / 4) * Math.PI * 2;
      const arch = new THREE.Mesh(new THREE.TorusGeometry(4.3, 0.2, 14, 40, Math.PI), archMaterial);
      arch.rotation.y = angle;
      arch.rotation.x = Math.PI / 2;
      arch.position.set(Math.cos(angle) * 5.8, 2.2, Math.sin(angle) * 5.8);
      arch.castShadow = true;
      hub.add(arch);
    }
  }

  buildHangzhouPavilion() {
    const zone = this.getZoneById('mud-pavilion');
    const root = new THREE.Group();
    root.position.fromArray(zone.anchor);
    this.group.add(root);

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(18, 1.2, 13.6),
      new THREE.MeshStandardMaterial({
        color: '#193f4a',
        roughness: 0.62,
        metalness: 0.25,
        emissive: '#17414d',
        emissiveIntensity: 0.24
      })
    );
    base.position.y = 0.64;
    base.receiveShadow = true;
    root.add(base);
    this.teleportSurfaces.push(base);

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(15, 0.4, 10.8),
      new THREE.MeshStandardMaterial({
        color: '#4d2f28',
        roughness: 0.53,
        metalness: 0.16,
        emissive: '#5e3523',
        emissiveIntensity: 0.25
      })
    );
    floor.position.y = 1.15;
    root.add(floor);

    const columnMat = new THREE.MeshStandardMaterial({
      color: '#e4c084',
      roughness: 0.35,
      metalness: 0.44,
      emissive: '#7f5d2f',
      emissiveIntensity: 0.2
    });

    const columnPositions = [
      [-6.3, 2.8, -3.8],
      [6.3, 2.8, -3.8],
      [-6.3, 2.8, 3.8],
      [6.3, 2.8, 3.8],
      [-2.2, 2.8, -3.8],
      [2.2, 2.8, -3.8],
      [-2.2, 2.8, 3.8],
      [2.2, 2.8, 3.8]
    ];

    columnPositions.forEach((position) => {
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 4.2, 14), columnMat);
      column.position.fromArray(position);
      column.castShadow = true;
      root.add(column);
    });

    const roof = createPavilionRoof(13.5, 10, 3.8, '#734a34');
    roof.position.y = 4.6;
    root.add(roof);

    const accentLight = new THREE.PointLight('#f5b56f', 1.25, 28, 2);
    accentLight.position.set(0, 4.5, 0);
    root.add(accentLight);

    const exhibitOffsets = [
      [-4.3, 1.6, 0],
      [0, 1.6, -1.4],
      [4.3, 1.6, 1.2]
    ];

    exhibitOffsets.forEach((offset, index) => {
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.82, 1.02, 1.2, 24),
        new THREE.MeshStandardMaterial({
          color: '#2e5f66',
          roughness: 0.3,
          metalness: 0.48,
          emissive: '#2f7f84',
          emissiveIntensity: 0.25
        })
      );
      pedestal.position.set(offset[0], 1.2, offset[2]);
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      root.add(pedestal);

      const figurine = createCatFigurine({
        bodyColor: index === 1 ? '#ce8d62' : '#a97355',
        accentColor: '#f5d7a6',
        fierce: false
      });
      figurine.scale.setScalar(0.78 + index * 0.05);
      figurine.position.set(offset[0], 1.95, offset[2]);
      figurine.rotation.y = index === 0 ? -0.3 : 0.45;
      root.add(figurine);
      this.animatedObjects.push({ mesh: figurine, rotateSpeed: 0.11 - index * 0.03, float: 0.08 });
    });

    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(12.8, 4.6),
      new THREE.MeshStandardMaterial({
        color: '#3a575b',
        roughness: 0.44,
        metalness: 0.2,
        emissive: '#325866',
        emissiveIntensity: 0.16
      })
    );
    backdrop.position.set(0, 3.4, -4.8);
    root.add(backdrop);
  }

  buildYunnanPavilion() {
    const zone = this.getZoneById('tile-pavilion');
    const root = new THREE.Group();
    root.position.fromArray(zone.anchor);
    this.group.add(root);

    const fortressBase = new THREE.Mesh(
      new THREE.BoxGeometry(18.5, 1.6, 14),
      new THREE.MeshStandardMaterial({
        color: '#1a3340',
        roughness: 0.58,
        metalness: 0.24,
        emissive: '#1a4657',
        emissiveIntensity: 0.22
      })
    );
    fortressBase.position.y = 0.82;
    fortressBase.receiveShadow = true;
    root.add(fortressBase);
    this.teleportSurfaces.push(fortressBase);

    const innerPad = new THREE.Mesh(
      new THREE.BoxGeometry(14, 0.45, 10.6),
      new THREE.MeshStandardMaterial({
        color: '#2d3b44',
        roughness: 0.5,
        metalness: 0.24,
        emissive: '#4e2c23',
        emissiveIntensity: 0.24
      })
    );
    innerPad.position.y = 1.54;
    root.add(innerPad);

    const cornerTowers = [
      [-6.7, 2.5, -4.7],
      [6.7, 2.5, -4.7],
      [-6.7, 2.5, 4.7],
      [6.7, 2.5, 4.7]
    ];
    cornerTowers.forEach((position) => {
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 1.0, 3.2, 8),
        new THREE.MeshStandardMaterial({
          color: '#7a4a34',
          roughness: 0.39,
          metalness: 0.22,
          emissive: '#6a3629',
          emissiveIntensity: 0.22
        })
      );
      tower.position.fromArray(position);
      tower.castShadow = true;
      root.add(tower);

      const beacon = new THREE.PointLight('#ff9562', 0.45, 15, 2.2);
      beacon.position.set(position[0], position[1] + 1.4, position[2]);
      root.add(beacon);
    });

    const guardian = createCatFigurine({
      bodyColor: '#734739',
      accentColor: '#f2b16b',
      fierce: true
    });
    guardian.scale.setScalar(1.4);
    guardian.position.set(0, 2.2, -0.8);
    guardian.rotation.y = Math.PI;
    root.add(guardian);
    this.animatedObjects.push({ mesh: guardian, rotateSpeed: -0.06, float: 0.12, floatPhase: 0.8 });

    const guardianFrame = new THREE.Mesh(
      new THREE.TorusGeometry(4.6, 0.22, 14, 60),
      new THREE.MeshStandardMaterial({
        color: '#eea560',
        roughness: 0.18,
        metalness: 0.72,
        emissive: '#ad5f37',
        emissiveIntensity: 0.66
      })
    );
    guardianFrame.rotation.x = Math.PI / 2;
    guardianFrame.position.set(0, 2.45, -0.8);
    root.add(guardianFrame);
    this.animatedObjects.push({ mesh: guardianFrame, rotateSpeed: 0.2, float: 0.02 });

    const dramaticLight = new THREE.SpotLight('#ffb86e', 1.9, 52, Math.PI * 0.2, 0.45, 1.8);
    dramaticLight.position.set(0, 12, 3);
    dramaticLight.target.position.set(0, 2, -0.8);
    dramaticLight.castShadow = true;
    root.add(dramaticLight, dramaticLight.target);

    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(13.4, 4.8, 0.4),
      new THREE.MeshStandardMaterial({
        color: '#4f3d3a',
        roughness: 0.62,
        metalness: 0.12,
        emissive: '#66362d',
        emissiveIntensity: 0.24
      })
    );
    wall.position.set(0, 3.2, -5.1);
    root.add(wall);
  }

  buildStoryGallery() {
    const zone = this.getZoneById('story-gallery');
    const root = new THREE.Group();
    root.position.fromArray(zone.anchor);
    this.group.add(root);

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(14, 0.6, 42),
      new THREE.MeshStandardMaterial({
        color: '#173847',
        roughness: 0.48,
        metalness: 0.32,
        emissive: '#145160',
        emissiveIntensity: 0.24
      })
    );
    floor.position.y = 0.36;
    floor.receiveShadow = true;
    root.add(floor);
    this.teleportSurfaces.push(floor);

    const centralStrip = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.1, 40),
      new THREE.MeshStandardMaterial({
        color: '#f0c77d',
        roughness: 0.22,
        metalness: 0.62,
        emissive: '#c28732',
        emissiveIntensity: 0.5
      })
    );
    centralStrip.position.y = 0.72;
    root.add(centralStrip);

    for (let i = 0; i < 7; i += 1) {
      const z = -18 + i * 6;

      const leftColumn = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 4.1, 0.34),
        new THREE.MeshStandardMaterial({
          color: '#5d8898',
          roughness: 0.32,
          metalness: 0.48
        })
      );
      leftColumn.position.set(-6.2, 2.25, z);

      const rightColumn = leftColumn.clone();
      rightColumn.position.x = 6.2;

      const arch = new THREE.Mesh(
        new THREE.TorusGeometry(6.2, 0.14, 10, 40, Math.PI),
        new THREE.MeshStandardMaterial({
          color: '#8ed8cf',
          roughness: 0.22,
          metalness: 0.66,
          emissive: '#4bb4ac',
          emissiveIntensity: 0.33
        })
      );
      arch.rotation.x = Math.PI / 2;
      arch.position.set(0, 4.2, z);

      root.add(leftColumn, rightColumn, arch);
    }

    STORY_STAGES.forEach((stage, index) => {
      const panel = createStoryPanel(stage);
      const side = index % 2 === 0 ? -1 : 1;
      panel.position.set(side * 4.8, 2.9, -15 + index * 7.8);
      panel.rotation.y = side === -1 ? Math.PI / 2.25 : -Math.PI / 2.25;
      root.add(panel);
      this.animatedObjects.push({ mesh: panel, rotateSpeed: side * 0.015, float: 0.04, floatPhase: index * 0.4 });
    });
  }

  buildProductHall() {
    const zone = this.getZoneById('product-hall');
    const root = new THREE.Group();
    root.position.fromArray(zone.anchor);
    this.group.add(root);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(12, 13.2, 1.2, 60),
      new THREE.MeshStandardMaterial({
        color: '#1b424d',
        roughness: 0.42,
        metalness: 0.46,
        emissive: '#1e5a69',
        emissiveIntensity: 0.26
      })
    );
    platform.position.y = 0.62;
    platform.receiveShadow = true;
    root.add(platform);
    this.teleportSurfaces.push(platform);

    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(8.4, 0.24, 16, 72),
      new THREE.MeshStandardMaterial({
        color: '#f0c16a',
        roughness: 0.2,
        metalness: 0.8,
        emissive: '#b47b2e',
        emissiveIntensity: 0.54
      })
    );
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 1.16;
    root.add(innerRing);
    this.animatedObjects.push({ mesh: innerRing, rotateSpeed: -0.17, float: 0.01 });

    PRODUCT_PROTOTYPES.forEach((product, index) => {
      const angle = (index / PRODUCT_PROTOTYPES.length) * Math.PI * 2;
      const x = Math.cos(angle) * 6.5;
      const z = Math.sin(angle) * 6.5;

      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 1.1, 1.4, 28),
        new THREE.MeshStandardMaterial({
          color: '#24545f',
          roughness: 0.24,
          metalness: 0.62,
          emissive: '#2e7881',
          emissiveIntensity: 0.22
        })
      );
      pedestal.position.set(x, 1.35, z);
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      root.add(pedestal);

      const item = createPrototypeObject(index);
      item.position.set(x, 2.6, z);
      item.rotation.y = angle + Math.PI / 3;
      root.add(item);
      this.animatedObjects.push({ mesh: item, rotateSpeed: 0.25 - index * 0.02, float: 0.16, floatPhase: angle });

      const tagTexture = createBadgeTexture({
        title: product.name,
        subtitle: product.label,
        width: 1120,
        height: 320,
        background: 'rgba(9, 53, 61, 0.78)',
        border: 'rgba(223, 186, 102, 0.9)'
      });

      const tag = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 1.06),
        new THREE.MeshBasicMaterial({ map: tagTexture, transparent: true, depthWrite: false })
      );
      tag.position.set(x, 4.3, z);
      tag.lookAt(0, 4.3, 0);
      root.add(tag);
      this.worldLabels.push(tag);
    });

    const canopy = new THREE.Mesh(
      new THREE.TorusGeometry(11.6, 0.18, 12, 100),
      new THREE.MeshStandardMaterial({
        color: '#8fe6d5',
        roughness: 0.32,
        metalness: 0.58,
        emissive: '#68ccb7',
        emissiveIntensity: 0.4
      })
    );
    canopy.rotation.x = Math.PI / 2;
    canopy.position.y = 6.6;
    root.add(canopy);
    this.animatedObjects.push({ mesh: canopy, rotateSpeed: 0.065, float: 0.12, floatPhase: 1.2 });
  }

  buildVRPortalZone() {
    const zone = this.getZoneById('vr-portal');
    const root = new THREE.Group();
    root.position.fromArray(zone.anchor);
    this.group.add(root);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(5.4, 6.1, 1, 50),
      new THREE.MeshStandardMaterial({
        color: '#163d49',
        roughness: 0.4,
        metalness: 0.45,
        emissive: '#1a5467',
        emissiveIntensity: 0.28
      })
    );
    pedestal.position.y = 0.5;
    pedestal.receiveShadow = true;
    root.add(pedestal);
    this.teleportSurfaces.push(pedestal);

    const portalRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.95, 0.19, 18, 72),
      new THREE.MeshStandardMaterial({
        color: '#8decd4',
        roughness: 0.24,
        metalness: 0.86,
        emissive: '#5ddcc0',
        emissiveIntensity: 1.1
      })
    );
    portalRing.position.y = 3.5;
    root.add(portalRing);
    this.portalRing = portalRing;
    this.animatedObjects.push({ mesh: portalRing, rotateSpeed: 0.48, float: 0.06 });

    const portalInner = new THREE.Mesh(
      new THREE.CircleGeometry(2.64, 50),
      new THREE.MeshBasicMaterial({
        map: this.portalTexture,
        color: '#8df2e0',
        transparent: true,
        opacity: 0.84,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    portalInner.position.y = 3.5;
    root.add(portalInner);
    this.portalInner = portalInner;
    this.animatedObjects.push({ mesh: portalInner, rotateSpeed: -0.23, float: 0.08, floatPhase: 0.6 });

    const portalStand = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 2.1, 1.2, 24),
      new THREE.MeshStandardMaterial({
        color: '#294b53',
        roughness: 0.34,
        metalness: 0.53,
        emissive: '#3a7886',
        emissiveIntensity: 0.2
      })
    );
    portalStand.position.y = 1.65;
    root.add(portalStand);

    const glyphBand = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.08, 12, 32),
      new THREE.MeshStandardMaterial({
        color: '#f0c980',
        roughness: 0.2,
        metalness: 0.83,
        emissive: '#b57b35',
        emissiveIntensity: 0.65
      })
    );
    glyphBand.rotation.x = Math.PI / 2;
    glyphBand.position.y = 2.25;
    root.add(glyphBand);
    this.animatedObjects.push({ mesh: glyphBand, rotateSpeed: 0.32, float: 0.02, floatPhase: 2.2 });

    const portalLight = new THREE.PointLight('#83f2dc', 1.8, 36, 2);
    portalLight.position.set(0, 3.5, 0);
    root.add(portalLight);

    const sign = createZoneSign({
      label: 'Optional VR Entry',
      chineseLabel: '可選擇進入沉浸模式',
      width: 7,
      height: 2
    });
    sign.position.set(0, 6.8, -1.6);
    root.add(sign);
    this.worldLabels.push(sign);
  }

  buildZoneSigns() {
    ZONES.forEach((zone) => {
      if (zone.id === 'vr-portal') {
        return;
      }

      const sign = createZoneSign({
        label: zone.label,
        chineseLabel: zone.chineseLabel
      });

      sign.position.set(zone.anchor[0], 7.8, zone.anchor[2]);
      sign.lookAt(zone.anchor[0], 7.8, zone.anchor[2] + 8);

      this.group.add(sign);
      this.worldLabels.push(sign);
    });
  }

  buildPaths() {
    const pathMaterialA = new THREE.MeshStandardMaterial({
      color: '#68d8c6',
      roughness: 0.3,
      metalness: 0.58,
      emissive: '#3fbdaa',
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.82
    });

    const connections = [
      [[0, 0.05, 0], [-34, 0.05, -20]],
      [[0, 0.05, 0], [34, 0.05, -22]],
      [[0, 0.05, 0], [0, 0.05, -54]],
      [[0, 0.05, 0], [0, 0.05, 36]],
      [[0, 0.05, 0], [0, 0.05, 16]]
    ];

    connections.forEach(([start, end], index) => {
      const startVec = new THREE.Vector3(...start);
      const endVec = new THREE.Vector3(...end);
      const mid = startVec.clone().lerp(endVec, 0.5);
      mid.y = 0.05;
      mid.x += index % 2 === 0 ? 1.6 : -1.4;

      const curve = new THREE.CatmullRomCurve3([startVec, mid, endVec]);
      const geometry = new THREE.TubeGeometry(curve, 72, 0.12, 8, false);
      const mesh = new THREE.Mesh(geometry, pathMaterialA.clone());
      mesh.material.opacity = 0.66;
      this.group.add(mesh);
      this.animatedObjects.push({ mesh, rotateSpeed: 0.06 - index * 0.005, float: 0 });
    });
  }

  update(delta, elapsed, cameraPosition) {
    this.animatedObjects.forEach((item, index) => {
      if (item.baseY === undefined) {
        item.baseY = item.mesh.position.y;
      }

      if (item.rotateSpeed !== undefined) {
        item.mesh.rotation.y += item.rotateSpeed * delta;
      }

      if (item.float) {
        const phase = item.floatPhase ?? index * 0.57;
        item.mesh.position.y = item.baseY + Math.sin(elapsed * 1.05 + phase) * item.float;
      }
    });

    if (this.portalRing && this.portalInner) {
      this.portalRing.material.emissiveIntensity = 0.85 + Math.sin(elapsed * 2.4) * 0.35;
      this.portalInner.material.opacity = 0.72 + Math.sin(elapsed * 2.1 + 0.8) * 0.2;
    }

    this.worldLabels.forEach((label) => {
      label.lookAt(cameraPosition.x, label.position.y, cameraPosition.z);
    });
  }
}
