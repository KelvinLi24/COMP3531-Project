import{M as r}from"./models-ec2pdXr1.js";const a=document.querySelector("#vault-grid");if(a){const d=r.map(t=>`
      <article class="vault-card">
        <p class="vault-card-kicker">Demo Asset</p>
        <h2>${t.title}</h2>
        <p class="vault-card-subtitle">${t.subtitle}</p>
        <dl class="vault-card-meta">
          <div>
            <dt>Token ID</dt>
            <dd>${t.tokenId}</dd>
          </div>
          <div>
            <dt>Network</dt>
            <dd>${t.network}</dd>
          </div>
        </dl>
        <a class="vault-enter" href="${t.page}">Enter Exhibition</a>
      </article>
    `).join("");a.innerHTML=d}
