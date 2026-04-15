import './styles.css';
import { MODEL_LIST } from './data/models.js';

const vaultGrid = document.querySelector('#vault-grid');

if (vaultGrid) {
  const cardsMarkup = MODEL_LIST.map((model) => {
    return `
      <article class="vault-card">
        <p class="vault-card-kicker">Demo Asset</p>
        <h2>${model.title}</h2>
        <p class="vault-card-subtitle">${model.subtitle}</p>
        <dl class="vault-card-meta">
          <div>
            <dt>Token ID</dt>
            <dd>${model.tokenId}</dd>
          </div>
          <div>
            <dt>Network</dt>
            <dd>${model.network}</dd>
          </div>
        </dl>
        <a class="vault-enter" href="${model.page}">Enter Exhibition</a>
      </article>
    `;
  }).join('');

  vaultGrid.innerHTML = cardsMarkup;
}
