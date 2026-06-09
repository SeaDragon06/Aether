/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProductModel } from './types';

export const IMAGES = {
  hero: '/src/assets/images/luxury_boxer_hero_1780902949461.png',
  texture: '/src/assets/images/fabric_texture_close_1780902962451.png',
  colors: '/src/assets/images/luxury_boxer_colors_1780902975283.png',
  detail: '/src/assets/images/waistband_stitching_detail_1780902987192.png',
  model1: '/src/assets/images/model_fit1_silk_1780905485589.png',
  model2: '/src/assets/images/model_fit2_seamless_1780905511605.png',
  model3: '/src/assets/images/model_fit3_silver_1780905523223.png',
  silverMesh: '/src/assets/images/silver_detail_mesh_1780905538845.png',
  modelWhite: '/src/assets/images/model_white_silk_1780913045467.png',
  giftBox: '/src/assets/images/magnetic_gift_box_1780913009782.png',
  silkGrey: '/src/assets/images/silk_grey_fit_1780913420058.png',
  silkBlue: '/src/assets/images/silk_blue_fit_1780913449693.png',
  seamlessBlack: '/src/assets/images/seamless_black_fit_1780913463374.png',
  silverBlack: '/src/assets/images/silver_black_fit_1780913477382.png',
};

export const COLOR_PALETTE = [
  { id: 'obsidian', name: '曜石黑', nameEn: 'Obsidian Black', hex: '#0a0a0a', description: '深邃纯粹的极致原黑，泛着微光丝绸般的金属高级感' },
  { id: 'steel', name: '陨铁灰', nameEn: 'Steel Meteor', hex: '#374151', description: '冷峻、雅致的金属冷灰，承载现代建筑的力量美学' },
  { id: 'indigo', name: '深海幽蓝', nameEn: 'Abyssal Blue', hex: '#1e293b', description: '幽邃静谧的午夜至蓝，散发出内敛神秘的绅士气度' },
  { id: 'alabaster', name: '雪花白', nameEn: 'Alabaster Silk', hex: '#f8fafc', description: '如温润白瓷般纯洁无瑕，还原奢华材质最细致的肌理' },
];

export const MODELS: ProductModel[] = [
  {
    id: 'air-silk',
    name: 'AETHER.01「极光真丝」',
    nameEn: 'Aether Air-Silk Boxer',
    tagline: '22% 臻奢桑蚕丝与超细莫代尔的绝对融合，重新定义无感贴身肌理。',
    price: '¥ 320',
    materials: [
      { name: '皇家天然桑蚕丝 (Mulberry Silk)', ratio: '22%', desc: '提供绝佳的防菌、天然保湿活性，带来如月光流淌般的奢华柔滑光泽。' },
      { name: '140S 超细莫代尔 (Air MicroModal)', ratio: '70%', desc: '采用极细针织织造，单纤比棉纤维更柔软 2.5 倍，极富垂坠感与透气性能。' },
      { name: '日本 Creora 莱卡超弹医用氨纶', ratio: '8%', desc: '抗拉伸度是普通氨纶的数倍，无压力束缚感，记忆人体腰围轮廓。' }
    ],
    colors: [
      { id: 'obsidian', name: '曜石黑', nameEn: 'Obsidian Black', hex: '#0d0d0d', description: '泛着月影真丝光晕的高贵纯黑' },
      { id: 'steel', name: '陨铁灰', nameEn: 'Steel Meteor', hex: '#444a54', description: '极具工业张力的尊贵微暗银灰' },
      { id: 'indigo', name: '深海幽蓝', nameEn: 'Abyssal Blue', hex: '#1c283d', description: '如至暗午夜极光般的幽暗矿物蓝' },
    ],
    images: [
      '/src/assets/images/model_fit1_silk_1780905485589.png',
      '/src/assets/images/luxury_boxer_hero_1780902949461.png',
      '/src/assets/images/fabric_texture_close_1780902962451.png'
    ]
  },
  {
    id: 'seamless-tech',
    name: 'AETHER.02「极简无缝」',
    nameEn: 'Aether Seamless Thermal-Bonded',
    tagline: '微激光热压合工艺，消弭所有车线缝隙。如同不可替代的第二层肌肤。',
    price: '¥ 260',
    materials: [
      { name: '120S 极致透气莫代尔纤维', ratio: '92%', desc: '带来丝般奢华触感，并拥有超乎寻常的湿热调节和舒爽透干表现。' },
      { name: '特种弹性纤维防缩技术', ratio: '8%', desc: '经洗涤40次依然不缩水，纤维在细微状态下高频锁定。' }
    ],
    colors: [
      { id: 'obsidian', name: '曜石黑', nameEn: 'Obsidian Black', hex: '#0d0d0d', description: '泛着月影真丝光晕的高贵纯黑' },
      { id: 'steel', name: '陨铁灰', nameEn: 'Steel Meteor', hex: '#444a54', description: '极具工业张力的尊贵微暗银灰' },
      { id: 'alabaster', name: '雪花白', nameEn: 'Alabaster Silk', hex: '#f8fafc', description: '透射高端美学的纯白细腻材质' }
    ],
    images: [
      '/src/assets/images/model_fit2_seamless_1780905511605.png',
      '/src/assets/images/waistband_stitching_detail_1780902987192.png',
      '/src/assets/images/luxury_boxer_colors_1780902975283.png'
    ]
  },
  {
    id: 'silver-mesh',
    name: 'AETHER.03「防辐射银网」',
    nameEn: 'Aether Silver-Infused Mesh',
    tagline: '将 9% 的纯银长丝编织进入囊袋核心科技区，全天候电磁屏蔽与活性抑菌。',
    price: '¥ 360',
    materials: [
      { name: '99.9% 纯物理纳米银丝 (Pure Silver)', ratio: '9%', desc: '编议编织入黄金舒压区，提供主动抗菌防异味，隔绝 99% 的电子产品电磁辐射。' },
      { name: '苏匹马超长纤维轻棉 (Supima Cotton)', ratio: '83%', desc: '全球仅 1% 的优美利坚超长绒棉，色牢度佳，经久耐磨且兼具棉的饱满厚实度与高透光。' },
      { name: 'Creora 医用减压弹力丝', ratio: '8%', desc: '避免压迫人体静脉网，保证血液微循环畅通。' }
    ],
    colors: [
      { id: 'obsidian', name: '曜石黑', nameEn: 'Obsidian Black', hex: '#0d0d0d', description: '泛着月影真丝光晕的高贵纯黑' },
      { id: 'indigo', name: '深海幽蓝', nameEn: 'Abyssal Blue', hex: '#1c283d', description: '如至暗午夜极光般的幽暗矿物蓝' },
    ],
    images: [
      '/src/assets/images/model_fit3_silver_1780905523223.png',
      '/src/assets/images/silver_detail_mesh_1780905538845.png',
      '/src/assets/images/luxury_boxer_colors_1780902975283.png'
    ]
  }
];

export const TECHNICAL_DOTS = [
  { id: 'waistband', x: '52%', y: '16%', title: '微高阻无感腰带', desc: '采用无摩擦高密平滑粘合工艺，抗褶拉，即使拉伸30,000次依然不松懈。' },
  { id: 'capsule', x: '49%', y: '58%', title: 'U型独立人体胶囊囊袋', desc: '通过3D仿生环形立体剪裁，完美实现生理分区支撑，彻底降温1.2℃。' },
  { id: 'hem', x: '35%', y: '84%', title: '激光切割无痕裤脚', desc: '裤脚采用零针线热融隐形封边，贴皮平滑过渡，真正做到穿着贴身外裤不显轮廓，穿行无碍。' },
  { id: 'side', x: '18%', y: '45%', title: '网孔高能散热排湿槽', desc: '隐秘侧缝内嵌呼吸毛细通道，湿热空气单向排散，极速蒸发汗意。' }
];

export const SENSORY_LAB_DATA = {
  breathability: [
    { name: '普通全棉', value: 35, color: '#4b5563' },
    { name: '常规莫代尔', value: 65, color: '#9ca3af' },
    { name: 'Aether 120S', value: 88, color: '#e2e8f0' },
    { name: 'Aether 140S (桑蚕丝混纺)', value: 98, color: '#ffffff' },
  ],
  friction: [
    { name: '精梳棉', value: 0.42, label: '0.42μ 极易摩擦起毛' },
    { name: '超细聚酯', value: 0.31, label: '0.31μ 贴身发痒发糙' },
    { name: 'Aether 极光丝', value: 0.12, label: '0.12μ 极致顺滑如无物' },
  ],
  packagingSteps: [
    { step: '01 / RITUAL', title: '哑光磁吸曜石礼盒', desc: '开启仪式感的第一步。双面手工压纹进口纸壳，极致环保，磁力清脆。' },
    { step: '02 / PROTECTION', title: '医用防潮半透明硫酸纸', desc: '采用真空氮气充装，防止纤维与外界湿杂空气接触，保持最佳出厂弹力。' },
    { step: '03 / FRAGRANCE', title: '特调“木石冷松”沙龙香氛', desc: '加入 AETHER 专属特调男士沙龙级固体香氛卡，前调冷冽青松，尾调温暖雪松。' },
  ]
};
