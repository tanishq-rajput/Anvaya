/**
 * Anvaya Silhouette Registry
 * 
 * Modular configuration for image-based fashion mannequins and segmentation masks.
 * Additional silhouettes/looks can be added here without modifying UI components.
 */

export const SILHOUETTES = {
  'look-01': {
    id: 'look-01',
    name: 'Atelier Layered Look',
    description: '2D layered outfit system on neutral mannequin with independently selectable garments',
    baseImage: '/silhouettes/look-01-layered/base.png',
    baseImageArmsMasked: '/silhouettes/look-01-layered/base-arms-masked.png',
    width: 524,
    height: 524,
    aspectRatio: '1 / 1',
    categories: {
      outerwear: {
        id: 'outerwear',
        label: 'Outerwear',
        hint: 'Beige open-front jacket',
        image: '/silhouettes/look-01-layered/outerwear.png',
        mask: '/silhouettes/look-01-layered/mask-outerwear.png',
        blendMode: 'multiply',
        zIndex: 4,
      },
      topwear: {
        id: 'topwear',
        label: 'Topwear',
        hint: 'Beige crewneck T-shirt',
        image: '/silhouettes/look-01-layered/topwear.png',
        mask: '/silhouettes/look-01-layered/mask-topwear.png',
        blendMode: 'multiply',
        zIndex: 3,
      },
      bottomwear: {
        id: 'bottomwear',
        label: 'Bottomwear',
        hint: 'Pleated tailored trousers',
        image: '/silhouettes/look-01-layered/bottomwear.png',
        mask: '/silhouettes/look-01-layered/mask-bottomwear.png',
        blendMode: 'multiply',
        zIndex: 2,
        offsetX: 2,
      },
      accessories: {
        id: 'accessories',
        label: 'Footwear',
        hint: 'White sneakers',
        image: '/silhouettes/look-01-layered/accessories.png',
        mask: '/silhouettes/look-01-layered/mask-accessories.png',
        blendMode: 'multiply',
        zIndex: 5,
      },
    },
    // Stacking order from bottom to top: base -> bottomwear -> topwear -> outerwear -> accessories
    stackOrder: ['bottomwear', 'topwear', 'outerwear', 'accessories'],
  },
};

export const DEFAULT_SILHOUETTE_ID = 'look-01';

export function getSilhouette(id = DEFAULT_SILHOUETTE_ID) {
  return SILHOUETTES[id] || SILHOUETTES[DEFAULT_SILHOUETTE_ID];
}

