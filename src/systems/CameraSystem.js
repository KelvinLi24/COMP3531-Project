import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { easeInOutCubic } from '../utils/math.js';

export class CameraSystem {
  constructor(camera, domElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxDistance = 86;
    this.controls.minDistance = 8;
    this.controls.maxPolarAngle = Math.PI * 0.49;
    this.controls.target.set(0, 3.2, 0);

    this.freeWalkEnabled = true;
    this.isVRPresenting = false;

    this.keyState = {
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
      KeyQ: false,
      KeyE: false,
      ShiftLeft: false,
      ShiftRight: false
    };

    this.transition = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(event) {
    if (event.code in this.keyState) {
      this.keyState[event.code] = true;
    }
  }

  handleKeyUp(event) {
    if (event.code in this.keyState) {
      this.keyState[event.code] = false;
    }
  }

  setFreeWalkEnabled(value) {
    this.freeWalkEnabled = value;
  }

  setVRPresenting(isPresenting) {
    this.isVRPresenting = isPresenting;

    if (isPresenting) {
      this.transition = null;
    }
  }

  focus(position, target, duration = 1.8) {
    this.transition = {
      fromPosition: this.camera.position.clone(),
      toPosition: position.clone(),
      fromTarget: this.controls.target.clone(),
      toTarget: target.clone(),
      duration,
      elapsed: 0
    };
  }

  snap(position, target) {
    this.camera.position.copy(position);
    this.controls.target.copy(target);
    this.controls.update();
  }

  applyKeyboardMovement(delta) {
    if (!this.freeWalkEnabled || this.isVRPresenting || this.transition) {
      return;
    }

    const movement = new THREE.Vector3();
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, this.camera.up).normalize();

    if (this.keyState.KeyW) {
      movement.add(forward);
    }
    if (this.keyState.KeyS) {
      movement.sub(forward);
    }
    if (this.keyState.KeyD) {
      movement.add(right);
    }
    if (this.keyState.KeyA) {
      movement.sub(right);
    }
    if (this.keyState.KeyE) {
      movement.y += 1;
    }
    if (this.keyState.KeyQ) {
      movement.y -= 1;
    }

    if (movement.lengthSq() === 0) {
      return;
    }

    movement.normalize();

    const speedBoost = this.keyState.ShiftLeft || this.keyState.ShiftRight ? 1.75 : 1;
    const speed = 11 * speedBoost;
    movement.multiplyScalar(speed * delta);

    this.camera.position.add(movement);
    this.controls.target.add(movement);

    const radial = new THREE.Vector2(this.camera.position.x, this.camera.position.z);
    const maxRadius = 102;
    if (radial.length() > maxRadius) {
      radial.setLength(maxRadius);
      this.camera.position.x = radial.x;
      this.camera.position.z = radial.y;
    }

    this.camera.position.y = THREE.MathUtils.clamp(this.camera.position.y, 2.8, 16);
    this.controls.target.y = THREE.MathUtils.clamp(this.controls.target.y, 0.5, 8);
  }

  update(delta) {
    this.applyKeyboardMovement(delta);

    if (this.transition && !this.isVRPresenting) {
      this.transition.elapsed += delta;
      const progress = Math.min(this.transition.elapsed / this.transition.duration, 1);
      const t = easeInOutCubic(progress);

      this.camera.position.lerpVectors(this.transition.fromPosition, this.transition.toPosition, t);
      this.controls.target.lerpVectors(this.transition.fromTarget, this.transition.toTarget, t);

      if (progress >= 1) {
        this.transition = null;
      }
    }

    if (!this.isVRPresenting) {
      this.controls.update();
    }
  }

  dispose() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.controls.dispose();
  }
}
