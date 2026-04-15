import * as THREE from 'three';
import { createParagraphTexture } from '../utils/textures.js';

export class InfoBillboard {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.visible = false;

    const geometry = new THREE.PlaneGeometry(2.8, 1.65);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      opacity: 0.96
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);

    this.scene.add(this.group);

    this.currentData = null;
    this.hideTimer = 0;
  }

  show(data, duration = 10) {
    this.currentData = data;
    this.hideTimer = duration;

    const texture = createParagraphTexture({
      title: data.title,
      subtitle: data.subtitle,
      body: data.body,
      width: 1200,
      height: 700
    });

    this.mesh.material.map = texture;
    this.mesh.material.needsUpdate = true;

    this.group.visible = true;
  }

  hide() {
    this.currentData = null;
    this.hideTimer = 0;
    this.group.visible = false;
  }

  update(delta, camera, isVRPresenting) {
    if (!isVRPresenting) {
      this.group.visible = false;
      return;
    }

    if (!this.currentData) {
      return;
    }

    this.hideTimer -= delta;
    if (this.hideTimer <= 0) {
      this.hide();
      return;
    }

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = -0.04;
    direction.normalize();

    const targetPosition = camera.position.clone().add(direction.multiplyScalar(2.4));
    targetPosition.y = camera.position.y + 0.15;

    this.group.position.lerp(targetPosition, 1 - Math.exp(-7.2 * delta));
    this.group.lookAt(camera.position.x, camera.position.y - 0.05, camera.position.z);
    this.group.visible = true;
  }
}
