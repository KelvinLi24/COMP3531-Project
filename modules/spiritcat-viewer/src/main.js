import './styles.css';
import { certificationFields } from './data/certification.js';
import { SpiritCatViewer } from './viewer/SpiritCatViewer.js';

const MODEL_PATH = './assets/models/lingmao-spiritcat-guardian.glb';
const AUTO_ENTER_SECONDS = 6;

const introScreen = document.querySelector('#intro-screen');
const introCountdown = document.querySelector('#intro-countdown');
const viewAssetButton = document.querySelector('#view-asset-button');
const viewerScreen = document.querySelector('#viewer-screen');
const backButton = document.querySelector('#back-button');

const viewerCanvas = document.querySelector('#viewer-canvas');
const viewerLoading = document.querySelector('#viewer-loading');
const loadingProgress = document.querySelector('#loading-progress');
const viewerError = document.querySelector('#viewer-error');
const errorBody = document.querySelector('#error-body');
const certificationGrid = document.querySelector('#certification-grid');

let viewerInstance = null;
let hasOpenedViewer = false;
let enterTimeout = null;
let countdownInterval = null;

buildCertificationPanel();
initializeIntroFlow();
initializeBackButton();

function buildCertificationPanel() {
  const rows = certificationFields
    .map(([label, value]) => {
      const isStatus = label === 'Status';
      const isHash = label === 'Certification Hash' || label === 'Owner';
      const valueMarkup = isStatus
        ? `<span class="status-pill">${value}</span>`
        : `<span class="${isHash ? 'mono' : ''}">${value}</span>`;

      return `
        <div class="cert-item">
          <dt>${label}</dt>
          <dd>${valueMarkup}</dd>
        </div>
      `;
    })
    .join('');

  certificationGrid.innerHTML = rows;
}

function initializeIntroFlow() {
  let remainingSeconds = AUTO_ENTER_SECONDS;
  introCountdown.textContent = `Opening viewer in ${remainingSeconds}s...`;

  countdownInterval = window.setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds > 0) {
      introCountdown.textContent = `Opening viewer in ${remainingSeconds}s...`;
    }
  }, 1000);

  enterTimeout = window.setTimeout(() => {
    openViewer();
  }, AUTO_ENTER_SECONDS * 1000);

  viewAssetButton.addEventListener('click', () => {
    openViewer();
  });
}

function openViewer() {
  if (hasOpenedViewer) {
    return;
  }
  hasOpenedViewer = true;

  window.clearTimeout(enterTimeout);
  window.clearInterval(countdownInterval);

  // Keep transition smooth before we mount the 3D renderer.
  introScreen.classList.add('intro-screen--exit');

  window.setTimeout(() => {
    introScreen.classList.add('is-hidden');

    viewerScreen.classList.remove('viewer-screen--hidden');
    viewerScreen.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      viewerScreen.classList.add('viewer-screen--visible');
    });

    initializeViewerStage();
  }, 620);
}

function initializeViewerStage() {
  viewerLoading.classList.remove('is-hidden');
  viewerError.classList.add('is-hidden');
  loadingProgress.textContent = 'Loading 0%';

  viewerInstance = new SpiritCatViewer({
    container: viewerCanvas,
    modelPath: MODEL_PATH,
    onProgress: (ratio) => {
      const percent = Math.round(Math.max(0, Math.min(100, (ratio || 0) * 100)));
      loadingProgress.textContent = `Loading ${percent}%`;
    },
    onReady: () => {
      viewerLoading.classList.add('is-hidden');
    },
    onError: (message) => {
      viewerLoading.classList.add('is-hidden');
      viewerError.classList.remove('is-hidden');
      errorBody.textContent = message;
    }
  });

  viewerInstance.start();
}

function initializeBackButton() {
  backButton.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.reload();
  });
}

window.addEventListener('beforeunload', () => {
  viewerInstance?.dispose();
});
