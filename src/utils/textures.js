import * as THREE from 'three';

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 10) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  for (let i = 0; i < words.length; i += 1) {
    const testLine = `${line}${words[i]} `;
    const lineWidth = ctx.measureText(testLine).width;

    if (lineWidth > maxWidth && i > 0) {
      lines.push(line.trim());
      line = `${words[i]} `;
      if (lines.length >= maxLines) {
        break;
      }
    } else {
      line = testLine;
    }
  }

  if (line.trim().length > 0 && lines.length < maxLines) {
    lines.push(line.trim());
  }

  lines.forEach((lineText, index) => {
    ctx.fillText(lineText, x, y + index * lineHeight);
  });

  return lines.length;
}

export function createBadgeTexture({
  title,
  subtitle,
  width = 1024,
  height = 320,
  background = 'rgba(3, 40, 45, 0.7)',
  border = 'rgba(216, 175, 88, 0.95)'
}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, background);
  gradient.addColorStop(1, 'rgba(7, 30, 41, 0.78)');

  roundedRect(ctx, 14, 14, width - 28, height - 28, 36);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = border;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 244, 219, 0.96)';
  ctx.font = "600 74px 'Cormorant Garamond', 'Noto Serif SC', serif";
  ctx.fillText(title, 64, 128);

  ctx.fillStyle = 'rgba(190, 236, 232, 0.9)';
  ctx.font = "400 42px 'Noto Sans SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText(subtitle, 64, 205);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export function createParagraphTexture({
  title,
  subtitle,
  body,
  width = 1024,
  height = 640,
  background = 'rgba(2, 31, 36, 0.86)',
  border = 'rgba(223, 184, 96, 0.95)'
}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, background);
  gradient.addColorStop(1, 'rgba(8, 21, 33, 0.9)');

  roundedRect(ctx, 18, 18, width - 36, height - 36, 44);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.lineWidth = 5;
  ctx.strokeStyle = border;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 246, 229, 0.98)';
  ctx.font = "600 72px 'Cormorant Garamond', 'Noto Serif SC', serif";
  ctx.fillText(title, 72, 124);

  ctx.fillStyle = 'rgba(188, 235, 228, 0.95)';
  ctx.font = "400 38px 'Noto Sans SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText(subtitle, 72, 182);

  ctx.fillStyle = 'rgba(229, 241, 241, 0.95)';
  ctx.font = "400 34px 'Noto Sans SC', 'Microsoft YaHei', sans-serif";
  drawWrappedText(ctx, body, 72, 262, width - 144, 48, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export function createGlyphTexture(character, size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const radius = size * 0.48;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.15, size / 2, size / 2, radius);
  gradient.addColorStop(0, 'rgba(240, 230, 200, 0.6)');
  gradient.addColorStop(0.45, 'rgba(131, 230, 211, 0.35)');
  gradient.addColorStop(1, 'rgba(5, 28, 38, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 236, 189, 0.95)';
  ctx.font = `600 ${size * 0.42}px 'Noto Serif SC', 'Songti SC', serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(character, size / 2, size / 2 + 6);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export function createCardTexture({ title, body, accent = '#d7af57', width = 900, height = 520 }) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(5, 45, 53, 0.9)');
  gradient.addColorStop(1, 'rgba(9, 25, 37, 0.94)');

  roundedRect(ctx, 14, 14, width - 28, height - 28, 34);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 243, 211, 0.96)';
  ctx.font = "600 58px 'Cormorant Garamond', 'Noto Serif SC', serif";
  ctx.fillText(title, 56, 96);

  ctx.fillStyle = 'rgba(212, 238, 232, 0.95)';
  ctx.font = "400 30px 'Noto Sans SC', 'Microsoft YaHei', sans-serif";
  drawWrappedText(ctx, body, 56, 168, width - 112, 44, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}
