/**
 * Anvaya — Palette-Based Garment Colour Assignment Engine
 * 
 * Automatically assigns garment colours to the fashion mannequin based on the
 * tripartite hierarchy (dominant, secondary, accent) and percentage proportions
 * of the currently active colour palette.
 * 
 * Rules:
 * 1. Read existing palette swatches (dominant, secondary, accent) directly from palette data.
 * 2. Visual Hierarchy:
 *    - Outerwear: Dominant colour (highest %).
 *    - Visible inner topwear: Secondary colour.
 *    - Bottomwear: Dominant or Secondary based on luminance/contrast balance.
 *    - Footwear/Accessories: Accent colour (lowest %) or grounded shade for leather realism.
 * 3. Accounts for garment visibility:
 *    - With outerwear equipped: Outerwear + Trousers balance dominant area, topwear peeks through.
 *    - With outerwear removed: Topwear & bottomwear split dominant & secondary.
 * 4. Derived tints/shades strictly preserve hue & saturation (no unrelated 4th colour).
 * 5. Fallback: If no palette is selected/available, retains default black (#1A1A1A).
 */

export const DEFAULT_MANNEQUIN_COLOR = '#1A1A1A';

/**
 * Computes perceived luminance of a hex colour (0 to 1)
 */
export function getHexLuminance(hex) {
  if (!hex || typeof hex !== 'string') return 0.5;
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6 && clean.length !== 3) return 0.5;
  let r, g, b;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Derives a shade (darker) or tint (lighter) of a hex colour.
 * Strictly preserves the exact same hue and saturation so it is never an unrelated colour.
 * 
 * @param {string} hex - Source hex colour
 * @param {number} factor - Lightness multiplier (e.g. 0.80 = 20% darker shade)
 * @returns {string} Uppercase hex colour string
 */
export function deriveShadeOrTint(hex, factor = 0.8) {
  if (!hex || typeof hex !== 'string') return hex;
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6 && clean.length !== 3) return hex;
  let r, g, b;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16) / 255;
    g = parseInt(clean[1] + clean[1], 16) / 255;
    b = parseInt(clean[2] + clean[2], 16) / 255;
  } else {
    r = parseInt(clean.substring(0, 2), 16) / 255;
    g = parseInt(clean.substring(2, 4), 16) / 255;
    b = parseInt(clean.substring(4, 6), 16) / 255;
  }

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const newL = Math.max(0.08, Math.min(0.95, l * factor));

  let newR, newG, newB;
  if (s === 0) {
    newR = newG = newB = newL;
  } else {
    const hue2rgb = (p, q, t) => {
      let val = t;
      if (val < 0) val += 1;
      if (val > 1) val -= 1;
      if (val < 1/6) return p + (q - p) * 6 * val;
      if (val < 1/2) return q;
      if (val < 2/3) return p + (q - p) * (2/3 - val) * 6;
      return p;
    };
    const q = newL < 0.5 ? newL * (1 + s) : newL + s - newL * s;
    const p = 2 * newL - q;
    newR = hue2rgb(p, q, h + 1/3);
    newG = hue2rgb(p, q, h);
    newB = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return ('#' + toHex(newR) + toHex(newG) + toHex(newB)).toUpperCase();
}

/**
 * Automatically assigns garment colours from the currently selected palette.
 * 
 * @param {Object} palette - Palette object containing swatches array
 * @param {Object} activeGarments - Equipped garment state { outerwear, topwear, bottomwear, accessories }
 * @returns {Object} { outerwear: hex, topwear: hex, bottomwear: hex, accessories: hex }
 */
export function assignPaletteToGarments(palette, activeGarments = {}) {
  const fallback = {
    outerwear: DEFAULT_MANNEQUIN_COLOR,
    topwear: DEFAULT_MANNEQUIN_COLOR,
    bottomwear: DEFAULT_MANNEQUIN_COLOR,
    accessories: DEFAULT_MANNEQUIN_COLOR,
  };

  if (!palette || !palette.swatches || !Array.isArray(palette.swatches) || palette.swatches.length === 0) {
    return fallback;
  }

  const swatches = palette.swatches;
  // Sort swatches by proportion / flex descending to ensure correct hierarchy
  const sorted = swatches.slice().sort((a, b) => (Number(b.flex) || 0) - (Number(a.flex) || 0));

  const dominantSwatch = sorted[0] || swatches[0];
  const secondarySwatch = sorted[1] || swatches[1] || dominantSwatch;
  const accentSwatch = sorted[2] || swatches[2] || secondarySwatch;

  const domHex = (dominantSwatch?.hex || DEFAULT_MANNEQUIN_COLOR).toUpperCase();
  const secHex = (secondarySwatch?.hex || domHex).toUpperCase();
  const accHex = (accentSwatch?.hex || secHex).toUpperCase();

  const domLum = getHexLuminance(domHex);
  const secLum = getHexLuminance(secHex);
  const accLum = getHexLuminance(accHex);

  const isOuterwearEquipped = activeGarments?.outerwear !== false;

  // 1. Footwear / Accessories:
  // Shoes occupy a relatively small visual area (~10-15%), so they carry the accent colour.
  // If the accent colour is very pale/light (luminance > 0.68), derive a grounded leather shade (0.80)
  // of that exact same accent hue for realistic sartorial grounding.
  const footwearColor = accLum > 0.68 ? deriveShadeOrTint(accHex, 0.80) : accHex;

  if (isOuterwearEquipped) {
    // Outerwear is equipped:
    // - Outerwear: Dominant colour (highest % proportion, covers arms, shoulders & jacket body)
    // - Visible inner topwear: Secondary colour (visible through the open front lapels/chest)
    // - Bottomwear: Assigned for optimal visual balance.
    //   If Dominant is light and Secondary is darker (e.g. linen jacket with dark trousers),
    //   secondary provides the grounding anchor.
    //   Otherwise, dominant creates a cohesive suit column.
    let bottomwearColor = domHex;
    if (domLum > 0.60 && secLum < 0.45) {
      bottomwearColor = secHex;
    } else {
      bottomwearColor = domHex;
    }

    return {
      outerwear: domHex,
      topwear: secHex,
      bottomwear: bottomwearColor,
      accessories: footwearColor,
    };
  } else {
    // Outerwear is removed:
    // Topwear and bottomwear share the torso and lower body.
    // Balance dominant and secondary across upper and lower pieces:
    let topwearColor = domHex;
    let bottomwearColor = secHex;

    if (domLum < 0.45 && secLum > 0.55) {
      // Classic light inner shirt + dark tailored trousers
      topwearColor = secHex;
      bottomwearColor = domHex;
    } else {
      topwearColor = domHex;
      bottomwearColor = secHex;
    }

    return {
      outerwear: domHex,
      topwear: topwearColor,
      bottomwear: bottomwearColor,
      accessories: footwearColor,
    };
  }
}
