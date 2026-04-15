import * as THREE from 'three';
import { createGlyphTexture } from '../utils/textures.js';

const GLYPHS = ['禮', '貓', '藝', '福', '文', '瑞'];

export class MotifParticles {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.particles = [];

    const textures = GLYPHS.map((glyph) => createGlyphTexture(glyph, 256));

    for (let i = 0; i < 96; i += 1) {
      const material = new THREE.SpriteMaterial({
        map: textures[i % textures.length],
        color: '#a6f2e4',
        transparent: true,
        opacity: 0.24 + Math.random() * 0.28,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const sprite = new THREE.Sprite(material);
      const radius = 24 + Math.random() * 86;
      const angle = Math.random() * Math.PI * 2;

      sprite.position.set(
        Math.cos(angle) * radius,
        3 + Math.random() * 10,
        Math.sin(angle) * radius
      );

      const scale = 1.25 + Math.random() * 1.8;
      sprite.scale.set(scale, scale, scale);
      this.group.add(sprite);

      this.particles.push({
        sprite,
        radius,
        angle,
        baseY: sprite.position.y,
        speed: 0.03 + Math.random() * 0.06,
        wobble: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2
      });
    }

    this.scene.add(this.group);
  }

  update(delta, elapsed, cameraPosition) {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed * delta;

      particle.sprite.position.x = Math.cos(particle.angle) * particle.radius;
      particle.sprite.position.z = Math.sin(particle.angle) * particle.radius;
      particle.sprite.position.y =
        particle.baseY + Math.sin(elapsed * particle.wobble + particle.phase) * 0.68;

      particle.sprite.lookAt(cameraPosition);
      particle.sprite.material.opacity = 0.2 + (Math.sin(elapsed * 1.4 + particle.phase) + 1) * 0.12;
    });
  }
}
