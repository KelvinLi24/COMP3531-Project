export const MODEL_CATALOG = {
  guardian: {
    id: 'guardian',
    page: './guardian.html',
    title: 'SpiritCat Guardian',
    subtitle: 'Skyline Sentinel Edition',
    modelPath: './assets/models/lingmao-spiritcat-guardian.glb',
    collectionName: 'LingMao Vault Signatures',
    tokenId: 'SPCAT-2048-AX91',
    certificationHash: '0xA7F3C91B82E4D6F1X9KLM2038AF1B7C4',
    owner: '0x84D9...A21F',
    registeredDate: '2026-04-16',
    network: 'LingMao Demo Chain'
  },
  hangzhou: {
    id: 'hangzhou',
    page: './hangzhou.html',
    title: 'SpiritCat Hangzhou',
    subtitle: 'Clay Heritage Edition',
    modelPath: './assets/models/lingmao-spiritcat-hangzhou.glb',
    collectionName: 'LingMao Heritage Curation',
    tokenId: 'SPCAT-3097-HZ22',
    certificationHash: '0xD9B53C14E8F2A06N7QWE1189CC2DA4B',
    owner: '0x1F7C...9B03',
    registeredDate: '2026-04-17',
    network: 'LingMao Demo Chain'
  },
  classic: {
    id: 'classic',
    page: './classic.html',
    title: 'SpiritCat Classic',
    subtitle: 'Founders Collection Edition',
    modelPath: './assets/models/lingmao-spiritcat-classic.glb',
    collectionName: 'LingMao Founders Vault',
    tokenId: 'SPCAT-1450-CL18',
    certificationHash: '0x4CE89AF0B6D2F1R4TYU0042AB89E6F0',
    owner: '0x7AA1...6C2E',
    registeredDate: '2026-04-18',
    network: 'LingMao Demo Chain'
  }
};

export const MODEL_LIST = Object.values(MODEL_CATALOG);
