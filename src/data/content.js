export const ZONES = [
  {
    id: 'plaza',
    shortLabel: 'Plaza',
    label: 'Central LingMao Plaza',
    chineseLabel: '靈貓中庭',
    anchor: [0, 0, 0],
    cameraPosition: [0, 7, 22],
    cameraTarget: [0, 3.2, 0],
    summary:
      'Arrival commons for the LingMao YouLi platform. The central emblem expresses digital ritual, welcoming audiences into an expandable cultural metaverse.'
  },
  {
    id: 'mud-pavilion',
    shortLabel: 'Mud Cat',
    label: 'Hangzhou Mud Cat Pavilion',
    chineseLabel: '半山泥貓館',
    anchor: [-34, 0, -20],
    cameraPosition: [-22, 6, -10],
    cameraTarget: [-34, 3, -20],
    summary:
      'A warm Jiangnan-inspired exhibition zone focused on Hangzhou BanShan Mud Cat craftsmanship, gestures, and auspicious symbolism.'
  },
  {
    id: 'tile-pavilion',
    shortLabel: 'Tile Cat',
    label: 'Yunnan Tile Cat Pavilion',
    chineseLabel: '雲南瓦貓館',
    anchor: [34, 0, -22],
    cameraPosition: [22, 6.8, -10],
    cameraTarget: [34, 3.5, -22],
    summary:
      'A dramatic guardian-themed pavilion representing Wa Cat heritage, where architecture and lighting express folk protection and household blessing.'
  },
  {
    id: 'story-gallery',
    shortLabel: 'Story',
    label: 'Cultural Story Gallery',
    chineseLabel: '文化敘事長廊',
    anchor: [0, 0, -54],
    cameraPosition: [0, 6.5, -32],
    cameraTarget: [0, 3, -54],
    summary:
      'A narrative corridor showing the LingMao YouLi method: heritage research, AIGC design, product incubation, commerce channels, and platform scaling.'
  },
  {
    id: 'product-hall',
    shortLabel: 'Products',
    label: 'Creative Product Hall',
    chineseLabel: '文創產品殿',
    anchor: [0, 0, 36],
    cameraPosition: [0, 7.2, 52],
    cameraTarget: [0, 3.2, 36],
    summary:
      'A curated showcase of digital-first cultural products: gift sets, accessories, collectibles, and retail-ready design concepts.'
  },
  {
    id: 'vr-portal',
    shortLabel: 'VR Portal',
    label: 'VR Entry Zone',
    chineseLabel: 'VR傳送區',
    anchor: [0, 0, 16],
    cameraPosition: [0, 5.8, 28],
    cameraTarget: [0, 2.5, 16],
    summary:
      'A ceremonial transition point where visitors can move from screen exploration into optional immersive WebXR mode.'
  }
];

export const STORY_STAGES = [
  {
    title: '1. Heritage Discovery',
    body:
      'Fieldwork, interviews, and visual archives capture ritual context, craftsmanship methods, and regional identity.'
  },
  {
    title: '2. AIGC Co-Creation',
    body:
      'Generative systems assist motif extraction, style transfer, and concept variation while preserving cultural intent.'
  },
  {
    title: '3. Product Transformation',
    body:
      'Intangible motifs become tangible categories: gifting, accessories, interiors, digital collectibles, and educational kits.'
  },
  {
    title: '4. Cultural Commerce',
    body:
      'Omnichannel storytelling links exhibition, social media, and e-commerce touchpoints for sustainable market adoption.'
  },
  {
    title: '5. Scalable Platform',
    body:
      'LingMao YouLi provides a reusable pipeline for future regional heritage themes beyond the first two prototype cases.'
  }
];

export const PRODUCT_PROTOTYPES = [
  {
    name: 'Jade Gift Capsule',
    label: '禮盒原型',
    description: 'Premium cultural gift box with modular inserts and NFC-linked storytelling.'
  },
  {
    name: 'Guardian Pendant',
    label: '守護吊飾',
    description: 'Wearable charm inspired by Wa Cat protection symbols and modern minimal metal craft.'
  },
  {
    name: 'BanShan Tea Ritual Set',
    label: '茶禮套組',
    description: 'Jiangnan tea accessory concept blending mud cat textures with contemporary lifestyle design.'
  },
  {
    name: 'Cultural Blind Box Series',
    label: '文化盲盒',
    description: 'Collectible series pairing heritage narratives with serialized digital identities.'
  },
  {
    name: 'Home Blessing Ornament',
    label: '家居擺件',
    description: 'Ceramic-inspired tabletop object designed for modern interiors and cultural gifting.'
  },
  {
    name: 'AIGC Pattern Silk Scarf',
    label: '絲巾圖樣',
    description: 'High-resolution generative motifs derived from cat iconography and textile geometries.'
  }
];

export const HOTSPOTS = [
  {
    id: 'plaza-emblem',
    zoneId: 'plaza',
    title: 'LingMao Core Emblem',
    subtitle: '靈貓有禮 / Digital Ceremony Beacon',
    body:
      'This floating emblem represents the platform mission: translating intangible heritage into contemporary cultural experiences, products, and commerce pathways.',
    position: [0, 4.3, 0],
    focusPosition: [0, 5.5, 11],
    focusTarget: [0, 3.8, 0]
  },
  {
    id: 'mud-origin',
    zoneId: 'mud-pavilion',
    title: 'BanShan Mud Cat Origin',
    subtitle: '半山泥貓 / Hangzhou Craft Lineage',
    body:
      'BanShan Mud Cat heritage reflects handmade clay ritual objects tied to local blessing culture, household protection, and folk creativity in the Hangzhou region.',
    position: [-37.5, 2.6, -18],
    focusPosition: [-26, 4.8, -13],
    focusTarget: [-37.5, 2.3, -18]
  },
  {
    id: 'mud-craft',
    zoneId: 'mud-pavilion',
    title: 'Craft Process Node',
    subtitle: '泥塑工藝轉譯',
    body:
      'AIGC can assist shape iteration, pattern extraction, and color studies while artisans preserve tactile knowledge, symbolic grammar, and cultural authenticity.',
    position: [-31, 2.2, -23.8],
    focusPosition: [-24, 4.2, -28],
    focusTarget: [-31, 2, -23.8]
  },
  {
    id: 'tile-guardian',
    zoneId: 'tile-pavilion',
    title: 'Wa Cat Guardian Spirit',
    subtitle: '瓦貓守護意象',
    body:
      'Yunnan Wa Cat iconography centers on protection and threshold guardianship, forming a powerful visual language for architectural ornament and modern branding.',
    position: [33.8, 3.1, -19],
    focusPosition: [24, 5.5, -12],
    focusTarget: [33.8, 3.1, -19]
  },
  {
    id: 'tile-symbol',
    zoneId: 'tile-pavilion',
    title: 'Protective Symbol System',
    subtitle: '民俗符號轉化',
    body:
      'This zone explores how protective motifs can move into packaging, jewelry, architecture graphics, and immersive digital storytelling formats.',
    position: [38.6, 2.3, -25],
    focusPosition: [28, 4.8, -31],
    focusTarget: [38.6, 2.1, -25]
  },
  {
    id: 'story-pipeline',
    zoneId: 'story-gallery',
    title: 'Heritage to Platform Pipeline',
    subtitle: '文化 -> AIGC -> 產品 -> 商業',
    body:
      'LingMao YouLi is designed as an expandable transformation engine: each heritage case can run through a repeatable path from documentation to commercialization.',
    position: [0, 2.2, -54],
    focusPosition: [0, 4.6, -41],
    focusTarget: [0, 2.2, -54]
  },
  {
    id: 'product-commerce',
    zoneId: 'product-hall',
    title: 'Creative Product Matrix',
    subtitle: '文創商品矩陣',
    body:
      'The hall demonstrates a portfolio strategy: digital IP expression, physical products, experiential retail moments, and traceable story-driven commerce.',
    position: [0, 3, 36],
    focusPosition: [0, 5.5, 49],
    focusTarget: [0, 3, 36]
  },
  {
    id: 'platform-future',
    zoneId: 'product-hall',
    title: 'Scalable Heritage Network',
    subtitle: '可複製平台願景',
    body:
      'Beyond the first two prototypes, this platform can onboard additional regional crafts, enabling a federated ecosystem for digital cultural innovation.',
    position: [-7.5, 2.4, 32],
    focusPosition: [-12, 4.6, 44],
    focusTarget: [-7.5, 2.1, 32]
  },
  {
    id: 'vr-portal',
    zoneId: 'vr-portal',
    title: 'Immersive VR Gateway',
    subtitle: '點擊進入 WebXR 沉浸模式',
    body:
      'Desktop mode remains fully featured. Entering VR is optional and user-driven, enabling deeper spatial storytelling and embodied cultural exploration.',
    position: [0, 2.4, 16],
    focusPosition: [0, 4.4, 24],
    focusTarget: [0, 2.4, 16],
    action: 'enter-vr'
  }
];
