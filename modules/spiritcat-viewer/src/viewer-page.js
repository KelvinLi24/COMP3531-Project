import './styles.css';
import { MODEL_CATALOG } from './data/models.js';
import { SpiritCatViewer } from './viewer/SpiritCatViewer.js';

const AUTO_ENTER_SECONDS = 6;
const MIN_LOADING_FLOOR_MS = 80;
const MIN_LOADING_CEILING_MS = 700;

const modelId = document.body.dataset.modelId;
const modelConfig = MODEL_CATALOG[modelId];

const introScreen = document.querySelector('#intro-screen');
const introCountdown = document.querySelector('#intro-countdown');
const viewAssetButton = document.querySelector('#view-asset-button');
const viewerScreen = document.querySelector('#viewer-screen');
const assetTitle = document.querySelector('#asset-title');
const panelTitle = document.querySelector('#panel-title');

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

if (!modelConfig) {
  const fallback = document.createElement('p');
  fallback.className = 'config-error';
  fallback.textContent = 'Invalid model page configuration.';
  document.body.appendChild(fallback);
} else {
  applyModelText();
  buildCertificationPanel();
  initializeIntroFlow();
}

function applyModelText() {
  if (assetTitle) {
    assetTitle.textContent = modelConfig.title;
  }

  if (panelTitle) {
    panelTitle.textContent = `${modelConfig.title} Record`;
  }

  document.title = `${modelConfig.title} Showcase`;
}

function buildCertificationPanel() {
  const fields = [
    ['Asset Title', modelConfig.title],
    ['Collection Name', modelConfig.collectionName],
    ['Status', 'Demo Verified'],
    ['Certification Hash', modelConfig.certificationHash],
    ['Token ID', modelConfig.tokenId],
    ['Registered Date', modelConfig.registeredDate],
    ['Owner', modelConfig.owner],
    ['Network', modelConfig.network]
  ];

  certificationGrid.innerHTML = fields
    .map(([label, value]) => {
      const isStatus = label === 'Status';
      const isHash = label === 'Certification Hash' || label === 'Owner';

      return `
        <div class="cert-item">
          <dt>${label}</dt>
          <dd>${isStatus ? `<span class="status-pill">${value}</span>` : `<span class="${isHash ? 'mono' : ''}">${value}</span>`}</dd>
        </div>
      `;
    })
    .join('');
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

  enterTimeout = window.setTimeout(openViewer, AUTO_ENTER_SECONDS * 1000);
  viewAssetButton.addEventListener('click', openViewer);
}

function openViewer() {
  if (hasOpenedViewer) {
    return;
  }
  hasOpenedViewer = true;

  window.clearTimeout(enterTimeout);
  window.clearInterval(countdownInterval);

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
  const loadingStartedAt = Date.now();
  let loadingHidden = false;
  let totalBytes = 0;
  let adaptiveMinLoadingMs = 220;
  viewerLoading.classList.remove('is-hidden');
  viewerError.classList.add('is-hidden');
  loadingProgress.textContent = 'Loading 0%';

  const hideLoading = () => {
    if (loadingHidden) {
      return;
    }
    loadingHidden = true;
    viewerLoading.classList.add('is-hidden');
  };

  viewerInstance = new SpiritCatViewer({
    container: viewerCanvas,
    modelPath: modelConfig.modelPath,
    onProgress: (ratio, progress) => {
      if (progress?.total) {
        totalBytes = progress.total;
        const modelSizeMb = totalBytes / (1024 * 1024);
        adaptiveMinLoadingMs = Math.max(
          MIN_LOADING_FLOOR_MS,
          Math.min(MIN_LOADING_CEILING_MS, Math.round(90 + modelSizeMb * 16))
        );
      }
      const percent = Math.round(Math.max(0, Math.min(100, (ratio || 0) * 100)));
      loadingProgress.textContent = `Loading ${percent}%`;
    },
    onReady: () => {
      const elapsed = Date.now() - loadingStartedAt;
      const settleMs = elapsed < 350 ? 120 : elapsed < 1200 ? 70 : 20;
      const delay = Math.max(0, adaptiveMinLoadingMs - elapsed) + settleMs;
      window.setTimeout(() => {
        hideLoading();
      }, delay);
    },
    onError: (message) => {
      viewerLoading.classList.add('is-hidden');
      viewerError.classList.remove('is-hidden');
      errorBody.textContent = message;
    }
  });

  viewerInstance.start();
}

window.addEventListener('beforeunload', () => {
  viewerInstance?.dispose();
});
