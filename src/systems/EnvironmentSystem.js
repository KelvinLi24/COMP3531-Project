import * as THREE from 'three';
import { damp } from '../utils/math.js';

const MOODS = {
  dusk: {
    fogColor: '#07232e',
    skyTop: '#0f5b66',
    skyBottom: '#040b16',
    hemiSky: '#72d8c6',
    hemiGround: '#0b1724',
    dirColor: '#f0c378',
    ambientColor: '#2b6f71',
    hemiIntensity: 1.0,
    dirIntensity: 1.45,
    ambientIntensity: 0.42,
    exposure: 1.1
  },
  night: {
    fogColor: '#04131e',
    skyTop: '#12324f',
    skyBottom: '#01040b',
    hemiSky: '#4ea7d8',
    hemiGround: '#060d18',
    dirColor: '#88b7ff',
    ambientColor: '#1d4f72',
    hemiIntensity: 0.7,
    dirIntensity: 0.92,
    ambientIntensity: 0.26,
    exposure: 0.93
  }
};

export class EnvironmentSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentMood = 'dusk';
    this.targetMood = 'dusk';

    this.scene.fog = new THREE.FogExp2(new THREE.Color(MOODS.dusk.fogColor), 0.0115);

    this.ambient = new THREE.AmbientLight(MOODS.dusk.ambientColor, MOODS.dusk.ambientIntensity);
    this.hemi = new THREE.HemisphereLight(
      MOODS.dusk.hemiSky,
      MOODS.dusk.hemiGround,
      MOODS.dusk.hemiIntensity
    );
    this.directional = new THREE.DirectionalLight(MOODS.dusk.dirColor, MOODS.dusk.dirIntensity);
    this.directional.position.set(16, 30, 18);
    this.directional.castShadow = true;
    this.directional.shadow.mapSize.set(2048, 2048);
    this.directional.shadow.camera.left = -80;
    this.directional.shadow.camera.right = 80;
    this.directional.shadow.camera.top = 80;
    this.directional.shadow.camera.bottom = -80;
    this.directional.shadow.camera.far = 120;

    this.accentLightA = new THREE.PointLight('#68ffe5', 0.9, 80, 2);
    this.accentLightA.position.set(-22, 8, -10);
    this.accentLightB = new THREE.PointLight('#efba62', 1.1, 90, 2);
    this.accentLightB.position.set(26, 7, -18);

    this.scene.add(this.ambient, this.hemi, this.directional, this.accentLightA, this.accentLightB);

    this.skyUniforms = {
      topColor: { value: new THREE.Color(MOODS.dusk.skyTop) },
      bottomColor: { value: new THREE.Color(MOODS.dusk.skyBottom) },
      offset: { value: 22 },
      exponent: { value: 0.75 }
    };

    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: this.skyUniforms,
      vertexShader: `
        varying vec3 vWorldPosition;

        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;

        varying vec3 vWorldPosition;

        void main() {
          float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
          float mixValue = max(pow(max(h, 0.0), exponent), 0.0);
          gl_FragColor = vec4(mix(bottomColor, topColor, mixValue), 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    });

    const skyGeometry = new THREE.SphereGeometry(260, 48, 24);
    this.skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(this.skyMesh);

    const glowRingGeometry = new THREE.TorusGeometry(58, 0.18, 12, 120);
    const glowRingMaterial = new THREE.MeshBasicMaterial({
      color: '#72efd5',
      transparent: true,
      opacity: 0.33,
      blending: THREE.AdditiveBlending
    });

    this.glowRing = new THREE.Mesh(glowRingGeometry, glowRingMaterial);
    this.glowRing.rotation.x = Math.PI / 2;
    this.glowRing.position.y = 0.06;
    this.scene.add(this.glowRing);

    this.time = 0;
    this.currentExposure = MOODS.dusk.exposure;
  }

  setMood(mode) {
    if (!MOODS[mode]) {
      return;
    }

    this.targetMood = mode;
  }

  toggleMood() {
    const next = this.targetMood === 'dusk' ? 'night' : 'dusk';
    this.setMood(next);
    return next;
  }

  update(delta, renderer) {
    this.time += delta;

    const target = MOODS[this.targetMood];

    const fogColor = this.scene.fog.color;
    fogColor.lerp(new THREE.Color(target.fogColor), 1 - Math.exp(-1.8 * delta));

    this.skyUniforms.topColor.value.lerp(new THREE.Color(target.skyTop), 1 - Math.exp(-1.8 * delta));
    this.skyUniforms.bottomColor.value.lerp(
      new THREE.Color(target.skyBottom),
      1 - Math.exp(-1.8 * delta)
    );

    this.hemi.color.lerp(new THREE.Color(target.hemiSky), 1 - Math.exp(-2.1 * delta));
    this.hemi.groundColor.lerp(new THREE.Color(target.hemiGround), 1 - Math.exp(-2.1 * delta));
    this.directional.color.lerp(new THREE.Color(target.dirColor), 1 - Math.exp(-1.7 * delta));
    this.ambient.color.lerp(new THREE.Color(target.ambientColor), 1 - Math.exp(-1.5 * delta));

    this.hemi.intensity = damp(this.hemi.intensity, target.hemiIntensity, 4.5, delta);
    this.directional.intensity = damp(this.directional.intensity, target.dirIntensity, 4.5, delta);
    this.ambient.intensity = damp(this.ambient.intensity, target.ambientIntensity, 4.5, delta);

    this.glowRing.material.opacity = 0.26 + Math.sin(this.time * 0.38) * 0.06;
    this.glowRing.rotation.z += delta * 0.035;

    this.currentExposure = damp(this.currentExposure, target.exposure, 2.4, delta);
    renderer.toneMappingExposure = this.currentExposure;
  }
}
