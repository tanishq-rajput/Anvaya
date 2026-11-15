import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Star, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { COLOUR_FAMILIES } from '../data/colourArchive';
import PaletteDetailSpread, { DetailLeftPage, DetailRightPage } from './PaletteDetailSpread';

// Display name mapping for the 9 canonical families
const FAMILY_DISPLAY_NAMES = {
  greens: 'Greens',
  blues: 'Blues',
  reds: 'Reds',
  oranges: 'Oranges',
  yellows: 'Yellows',
  purples: 'Purples',
  browns: 'Browns & Earth',
  creams: 'Whites & Creams',
  greys: 'Greys & Blacks'
};

// Starting coordinates for each family on the wheel
const FAMILY_STARTING_COORDINATES = {
  greens: { h: 135, s: 0.55, l: 0.42, name: 'Botanical Forest' },
  blues: { h: 215, s: 0.60, l: 0.48, name: 'Aegean Blue' },
  reds: { h: 355, s: 0.65, l: 0.45, name: 'Crimson Rose' },
  oranges: { h: 28, s: 0.75, l: 0.50, name: 'Warm Terracotta' },
  yellows: { h: 50, s: 0.80, l: 0.52, name: 'Tuscan Gold' },
  purples: { h: 280, s: 0.50, l: 0.42, name: 'Amethyst Plum' },
  browns: { h: 28, s: 0.42, l: 0.35, name: 'Walnut Earth' },
  creams: { h: 40, s: 0.25, l: 0.90, name: 'Linen Cream' },
  greys: { h: 210, s: 0.10, l: 0.30, name: 'Charcoal Slate' }
};

// 4 Selectable Palette Techniques
const PALETTE_TECHNIQUES = [
  { id: 'complementary', label: 'Complementary' },
  { id: 'analogous', label: 'Analogous' },
  { id: 'monochromatic', label: 'Monochromatic' },
  { id: 'triadic', label: 'Triadic' }
];

// Flatten curated shades for dynamic nearest-name resolution
const ALL_CURATED_SHADES = COLOUR_FAMILIES.flatMap((f) => f.shades);

/**
 * HSL to RGB conversion
 * h in [0, 360], s in [0, 1], l in [0, 1]
 */
function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hp >= 0 && hp < 1) { r1 = c; g1 = x; b1 = 0; }
  else if (hp >= 1 && hp < 2) { r1 = x; g1 = c; b1 = 0; }
  else if (hp >= 2 && hp < 3) { r1 = 0; g1 = c; b1 = x; }
  else if (hp >= 3 && hp < 4) { r1 = 0; g1 = x; b1 = c; }
  else if (hp >= 4 && hp < 5) { r1 = x; g1 = 0; b1 = c; }
  else if (hp >= 5 && hp <= 6) { r1 = c; g1 = 0; b1 = x; }
  const m = l - c / 2;
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255)
  ];
}

/**
 * RGB to HEX conversion
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * HEX to RGB conversion
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16)
  ];
}

/**
 * Find nearest curated shade name using perceptual distance
 */
function getPerceptualShadeName(r, g, b, h, s, l) {
  let closest = null;
  let minDistance = Infinity;

  ALL_CURATED_SHADES.forEach((shade) => {
    const [sr, sg, sb] = hexToRgb(shade.hex);
    const dist = Math.sqrt(
      0.30 * Math.pow(r - sr, 2) +
      0.59 * Math.pow(g - sg, 2) +
      0.11 * Math.pow(b - sb, 2)
    );
    if (dist < minDistance) {
      minDistance = dist;
      closest = shade;
    }
  });

  if (!closest) return 'Harmonic Hue';

  if (minDistance < 26) {
    return closest.name;
  }

  // Prepend descriptor if slightly offset
  if (l > 0.82) return `Luminous ${closest.name}`;
  if (l < 0.28) return `Deep ${closest.name}`;
  if (s < 0.22) return `Muted ${closest.name}`;
  return closest.name;
}

/**
 * Preserves the exact selected base colour from Colour Explorer without any shifting or approximation
 */
function createBaseSwatch(baseColor, label, flex = 1) {
  const hex = (baseColor.hex || '#000000').toUpperCase();
  const [r, g, b] = hexToRgb(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return {
    h: Math.round(((baseColor.h % 360) + 360) % 360),
    s: parseFloat((baseColor.s ?? 0.5).toFixed(2)),
    l: parseFloat((baseColor.l ?? 0.5).toFixed(2)),
    hex,
    name: baseColor.name,
    label,
    flex,
    textDark: brightness > 150
  };
}

/**
 * Generate a color swatch object with HEX and perceived text contrast
 */
function createSwatch(h, s, l, label, flex = 1) {
  const clampedH = ((h % 360) + 360) % 360;
  const clampedS = Math.min(1, Math.max(0.04, s));
  const clampedL = Math.min(0.96, Math.max(0.08, l));
  const [r, g, b] = hslToRgb(clampedH, clampedS, clampedL);
  const hex = rgbToHex(r, g, b);
  // Perceived luminance threshold for text readability
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return {
    h: Math.round(clampedH),
    s: parseFloat(clampedS.toFixed(2)),
    l: parseFloat(clampedL.toFixed(2)),
    hex,
    label,
    flex,
    textDark: brightness > 150
  };
}

/**
 * Clamp helper for numerical ranges
 */
function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

/**
 * Fashion-oriented saturation damping:
 * Transmutes raw wheel saturation into luxurious, wearable textile ranges
 */
function wearableS(s, factor = 0.60, offset = 0.06, min = 0.20, max = 0.44) {
  return clamp(s * factor + offset, min, max);
}

/**
 * Advanced Base Colour Analysis
 * Evaluates Hue, Saturation, Lightness, and undertone to establish
 * outfit role suitability and aesthetic tendencies
 */
function analyzeBaseColor(h, s, l) {
  const isLight = l >= 0.65;
  const isDark = l <= 0.32;
  const isMidLight = !isLight && !isDark;

  const isMuted = s <= 0.28;
  const isVivid = s >= 0.58;
  const isModerateSat = !isMuted && !isVivid;

  // Temperature / Undertone
  const isWarm = (h >= 0 && h < 70) || h >= 320;
  const isGreen = h >= 70 && h < 160;
  const isCool = !isWarm && !isGreen;

  return {
    h, s, l,
    isLight,
    isDark,
    isMidLight,
    isMuted,
    isVivid,
    isModerateSat,
    isWarm,
    isGreen,
    isCool,
    temperature: isWarm ? 'warm' : isGreen ? 'botanical' : 'cool'
  };
}

/**
 * Contextual Fashion Neutrals Engine
 * Intelligently supplies coordinated neutrals based on palette role and undertone
 */
function getContextNeutral(analysis, category = 'matching', tier = 'light') {
  const { isWarm, isGreen } = analysis;

  if (category === 'matching') {
    if (isWarm) {
      if (tier === 'light') return { h: 38, s: 0.16, l: 0.93, name: 'Linen Alabaster', tag: 'Linen' };
      if (tier === 'mid') return { h: 34, s: 0.28, l: 0.66, name: 'Toasted Camel', tag: 'Camel' };
      return { h: 26, s: 0.30, l: 0.18, name: 'Dark Roast Espresso', tag: 'Espresso' };
    } else if (isGreen) {
      if (tier === 'light') return { h: 42, s: 0.18, l: 0.92, name: 'Oat Milk Linen', tag: 'Oat Ecru' };
      if (tier === 'mid') return { h: 36, s: 0.22, l: 0.66, name: 'Raw Suede Sand', tag: 'Suede' };
      return { h: 28, s: 0.26, l: 0.18, name: 'Bitter Chocolate', tag: 'Chocolate' };
    } else {
      if (tier === 'light') return { h: 210, s: 0.08, l: 0.94, name: 'Crisp Chalk', tag: 'Chalk' };
      if (tier === 'mid') return { h: 210, s: 0.12, l: 0.66, name: 'Silver Mist', tag: 'Silver' };
      return { h: 218, s: 0.16, l: 0.18, name: 'Tailored Charcoal', tag: 'Charcoal' };
    }
  }

  // Contrasting neutral (e.g., cool charcoal with warm terracotta, or warm camel with cobalt)
  if (category === 'contrasting') {
    if (isWarm) {
      if (tier === 'light') return { h: 210, s: 0.08, l: 0.94, name: 'Crisp Chalk', tag: 'Chalk' };
      if (tier === 'mid') return { h: 212, s: 0.12, l: 0.64, name: 'Slate Grey', tag: 'Slate' };
      return { h: 218, s: 0.16, l: 0.18, name: 'Tailored Charcoal', tag: 'Charcoal' };
    } else {
      if (tier === 'light') return { h: 38, s: 0.16, l: 0.93, name: 'Linen Alabaster', tag: 'Linen' };
      if (tier === 'mid') return { h: 34, s: 0.28, l: 0.66, name: 'Toasted Camel', tag: 'Camel' };
      return { h: 26, s: 0.30, l: 0.18, name: 'Dark Roast Espresso', tag: 'Espresso' };
    }
  }

  // Default grounding
  return isWarm || isGreen
    ? { h: 26, s: 0.30, l: 0.18, name: 'Dark Roast Espresso', tag: 'Espresso' }
    : { h: 218, s: 0.16, l: 0.18, name: 'Tailored Charcoal', tag: 'Charcoal' };
}

/**
 * Complete Outfit Colour Systems Engine
 * 
 * Generates three distinct, wearable outfit colour systems with progressive styling:
 * - Example 1: Easy to Wear (natural balance, approachable everyday styling)
 * - Example 2: More Expressive (richer shades, stronger contrasts, sartorial statement)
 * - Example 3: Experimental (innovative hierarchy shifts, unconventional pairings)
 */
function generateTechniqueExamples(baseColor, technique) {
  const { h, s, l } = baseColor;
  const c = analyzeBaseColor(h, s, l);

  // =========================================================================
  // 1. COMPLEMENTARY
  // =========================================================================
  if (technique === 'complementary') {
    const compH = (h + 180) % 360;
    const neutralLight = getContextNeutral(c, 'matching', 'light');
    const neutralMid = getContextNeutral(c, 'contrasting', 'mid');
    const neutralDeep = getContextNeutral(c, 'matching', 'deep');

    // --- Example 1 â€” Easy to Wear ---
    let ex1;
    if (c.isVivid) {
      // Vivid base (e.g. Crimson Velvet, Cobalt):
      // Neutral is Dominant (55%), Vivid base is Supporting (30%), Muted complement is Accent (15%)
      ex1 = {
        id: 'comp-1',
        number: 'Example 01',
        name: 'Easy to Wear — Grounded Neutral & Accent',
        swatches: [
          createSwatch(neutralMid.h, neutralMid.s, neutralMid.l, `Dominant ${neutralMid.tag} 55%`, 5.5),
          createBaseSwatch(baseColor, 'Supporting Base 30%', 3),
          createSwatch(compH, clamp(s * 0.40 + 0.05, 0.18, 0.32), clamp(0.55, 0.45, 0.62), 'Accent Comp 15%', 1.5)
        ]
      };
    } else if (c.isLight) {
      // Light base (e.g. Raw Ecru):
      // Raw Ecru is Dominant (55%), Soft airy complement is Supporting (30%), Grounding neutral is Accent (15%)
      ex1 = {
        id: 'comp-1',
        number: 'Example 01',
        name: 'Easy to Wear — Linen & Soft Complement',
        swatches: [
          createBaseSwatch(baseColor, 'Dominant Linen 55%', 5.5),
          createSwatch(compH, clamp(s * 0.85 + 0.04, 0.12, 0.26), clamp(l - 0.14, 0.70, 0.82), 'Supporting Mist 30%', 3),
          createSwatch(neutralMid.h, neutralMid.s, neutralMid.l, `Accent ${neutralMid.tag} 15%`, 1.5)
        ]
      };
    } else if (c.isDark) {
      // Dark base (e.g. Deep Burgundy):
      // Deep base is Dominant (55%), Clean light neutral shirt is Supporting (30%), Subdued complement is Accent (15%)
      ex1 = {
        id: 'comp-1',
        number: 'Example 01',
        name: 'Easy to Wear — Classic Tailored Contrast',
        swatches: [
          createBaseSwatch(baseColor, 'Dominant Velvet 55%', 5.5),
          createSwatch(neutralLight.h, neutralLight.s, neutralLight.l, `Supporting ${neutralLight.tag} 30%`, 3),
          createSwatch(compH, clamp(s * 0.45 + 0.05, 0.18, 0.32), clamp(l + 0.22, 0.38, 0.48), 'Accent Comp 15%', 1.5)
        ]
      };
    } else {
      // Mid-tone (e.g. Sage Green):
      // Mid base is Dominant (55%), Light neutral is Supporting (30%), Dusty complement is Accent (15%)
      ex1 = {
        id: 'comp-1',
        number: 'Example 01',
        name: 'Easy to Wear — Harmonious Everyday Balance',
        swatches: [
          createBaseSwatch(baseColor, 'Dominant Base 55%', 5.5),
          createSwatch(neutralLight.h, neutralLight.s, neutralLight.l, `Supporting ${neutralLight.tag} 30%`, 3),
          createSwatch(compH, clamp(s * 0.65 + 0.06, 0.25, 0.45), clamp(1 - l * 0.6, 0.44, 0.56), 'Accent Comp 15%', 1.5)
        ]
      };
    }

    // --- Example 2 — More Expressive ---
    // Confident sartorial statement: Base is Dominant (50%), Rich complement is Supporting (35%), Luminous pop is Accent (15%)
    const ex2 = {
      id: 'comp-2',
      number: 'Example 02',
      name: 'More Expressive — Sartorial Statement Contrast',
      swatches: [
        createBaseSwatch(baseColor, 'Dominant Base 50%', 5),
        createSwatch(compH, clamp(s * 0.55 + 0.06, 0.20, 0.42), clamp(c.isLight ? 0.40 : 0.44, 0.34, 0.48), 'Supporting Comp 35%', 3.5),
        createSwatch(compH, clamp(s * 0.85 + 0.10, 0.36, 0.65), clamp(c.isDark ? 0.72 : 0.78, 0.70, 0.82), 'Accent Pop 15%', 1.5)
      ]
    };

    // --- Example 3 — Experimental ---
    // Hierarchy Inversion: The complement takes Dominant (50%)!
    // The base colour shifts into the Supporting (35%) role!
    // High-contrast neutral or accessory tone takes Accent (15%)!
    const ex3CompS = c.isMuted ? clamp(s * 0.85 + 0.05, 0.14, 0.28) : clamp(s * 0.55 + 0.06, 0.22, 0.40);
    const ex3CompL = c.isLight ? clamp(0.48, 0.40, 0.56) : clamp(0.72, 0.64, 0.78);
    const ex3 = {
      id: 'comp-3',
      number: 'Example 03',
      name: 'Experimental — Inverted Editorial Contrast',
      swatches: [
        createSwatch(compH, ex3CompS, ex3CompL, 'Dominant Comp 50%', 5),
        createBaseSwatch(baseColor, 'Supporting Base 35%', 3.5),
        createSwatch(neutralDeep.h, neutralDeep.s, neutralDeep.l, `Accent ${neutralDeep.tag} 15%`, 1.5)
      ]
    };

    return [ex1, ex2, ex3];
  }

  // =========================================================================
  // 2. ANALOGOUS
  // =========================================================================
  if (technique === 'analogous') {
    const adjForward = (h + 28) % 360;
    const adjBackward = (h - 28 + 360) % 360;
    const adjFar = (h + 50) % 360;
    const neutralLight = getContextNeutral(c, 'matching', 'light');

    // --- Example 1 — Easy to Wear ---
    let ex1;
    if (c.isVivid) {
      ex1 = {
        id: 'ana-1',
        number: 'Example 01',
        name: 'Easy to Wear — Tempered Tonal Flow',
        swatches: [
          createSwatch(neutralLight.h, neutralLight.s, neutralLight.l, `Dominant ${neutralLight.tag} 55%`, 5.5),
          createBaseSwatch(baseColor, 'Supporting Base 30%', 3),
          createSwatch(adjForward, clamp(s * 0.50 + 0.05, 0.20, 0.38), clamp(l * 0.65, 0.24, 0.36), 'Accent Adjacent 15%', 1.5)
        ]
      };
    } else {
      ex1 = {
        id: 'ana-1',
        number: 'Example 01',
        name: 'Easy to Wear — Tonal Cashmere Flow',
        swatches: [
          createBaseSwatch(baseColor, 'Dominant Anchor 55%', 5.5),
          createSwatch(adjForward, clamp(s * 0.52 + 0.04, 0.16, 0.34), clamp(c.isLight ? l - 0.14 : l + 0.18, 0.58, 0.74), 'Supporting +28° 30%', 3),
          createSwatch(adjBackward, clamp(s * 0.65 + 0.06, 0.22, 0.44), clamp(c.isLight ? l - 0.26 : l * 0.55, 0.20, 0.55), 'Accent -28° 15%', 1.5)
        ]
      };
    }

    // --- Example 2 — More Expressive ---
    const ex2 = {
      id: 'ana-2',
      number: 'Example 02',
      name: 'More Expressive — Atmospheric Horizon Cascade',
      swatches: [
        createBaseSwatch(baseColor, 'Dominant Base 50%', 5),
        createSwatch(adjForward, clamp(s * 0.48 + 0.05, 0.18, 0.36), clamp(0.72 + l * 0.1, 0.68, 0.82), 'Supporting +28° 35%', 3.5),
        createSwatch(adjFar, clamp(s * 0.75 + 0.10, 0.30, 0.56), clamp(l * 0.50, 0.20, 0.32), 'Accent +50° 15%', 1.5)
      ]
    };

    // --- Example 3 — Experimental ---
    // Role reversal: The forward adjacent takes Dominant, base shifts to Supporting, neutral takes Accent
    const ex3 = {
      id: 'ana-3',
      number: 'Example 03',
      name: 'Experimental — Architectural Gradient Study',
      swatches: [
        createSwatch(adjBackward, clamp(s * 0.50 + 0.05, 0.16, 0.34), clamp(c.isLight ? 0.70 : 0.42, 0.40, 0.75), 'Dominant -28° 50%', 5),
        createBaseSwatch(baseColor, 'Supporting Base 30%', 3),
        createSwatch(adjFar, clamp(s * 0.75 + 0.08, 0.28, 0.52), clamp(0.24, 0.18, 0.30), 'Accent Horizon 20%', 2)
      ]
    };

    return [ex1, ex2, ex3];
  }

  // =========================================================================
  // 3. MONOCHROMATIC
  // =========================================================================
  if (technique === 'monochromatic') {
    // Strictly the SAME hue h across all swatches!
    // --- Example 1 — Easy to Wear: Stepped Flannel Luminance ---
    const ex1 = {
      id: 'mono-1',
      number: 'Example 01',
      name: 'Easy to Wear — Stepped Flannel Luminance',
      swatches: [
        createSwatch(h, clamp(s * 0.35 + 0.04, 0.10, 0.26), clamp(0.88 + l * 0.05, 0.86, 0.94), 'Dominant Tint 55%', 5.5),
        createBaseSwatch(baseColor, 'Supporting Mid 30%', 3),
        createSwatch(h, clamp(s * 0.75 + 0.08, 0.26, 0.50), clamp(l * 0.45, 0.16, 0.24), 'Accent Shadow 15%', 1.5)
      ]
    };

    // --- Example 2 — More Expressive: Architectural Chalk & Tone ---
    const ex2 = {
      id: 'mono-2',
      number: 'Example 02',
      name: 'More Expressive — Architectural Chalk & Tone',
      swatches: [
        createBaseSwatch(baseColor, 'Dominant Base 55%', 5.5),
        createSwatch(h, clamp(s * 0.22 + 0.03, 0.08, 0.20), clamp(0.76 + l * 0.06, 0.72, 0.82), 'Supporting Chalk 30%', 3),
        createSwatch(h, clamp(s * 0.65 + 0.06, 0.24, 0.48), clamp(l * 0.55, 0.20, 0.28), 'Accent Velvet 15%', 1.5)
      ]
    };

    // --- Example 3 — Experimental: High-Contrast Noir Drama ---
    const ex3 = {
      id: 'mono-3',
      number: 'Example 03',
      name: 'Experimental — High-Contrast Noir Drama',
      swatches: [
        createSwatch(h, clamp(s * 0.72 + 0.08, 0.26, 0.50), clamp(l * 0.42, 0.14, 0.20), 'Dominant Nocturne 50%', 5),
        createBaseSwatch(baseColor, 'Supporting Base 35%', 3.5),
        createSwatch(h, clamp(s * 0.16 + 0.02, 0.06, 0.16), clamp(0.92 + l * 0.03, 0.92, 0.96), 'Accent Gossamer 15%', 1.5)
      ]
    };

    return [ex1, ex2, ex3];
  }

  // =========================================================================
  // 4. TRIADIC
  // =========================================================================
  const t2H = (h + 120) % 360;
  const t3H = (h + 240) % 360;
  const neutralLight = getContextNeutral(c, 'matching', 'light');
  const neutralMid = getContextNeutral(c, 'matching', 'mid');
  const neutralDeep = getContextNeutral(c, 'matching', 'deep');

  // --- Example 1 — Easy to Wear ---
  let ex1;
  if (c.isVivid) {
    // Vivid base: Grounded neutral takes Dominant (55%), vivid base takes Supporting (30%), Triad II is muted Accent (15%)
    ex1 = {
      id: 'triad-1',
      number: 'Example 01',
      name: 'Easy to Wear — Tailored Neutral & Triad Accents',
      swatches: [
        createSwatch(neutralMid.h, neutralMid.s, neutralMid.l, `Dominant ${neutralMid.tag} 55%`, 5.5),
        createBaseSwatch(baseColor, 'Supporting Base 30%', 3),
        createSwatch(t2H, clamp(s * 0.42 + 0.04, 0.16, 0.32), clamp(0.60 + l * 0.08, 0.58, 0.68), 'Accent Triad II 15%', 1.5)
      ]
    };
  } else if (c.isLight) {
    // Light base (e.g. Raw Ecru):
    // Preserves light linen anchor!
    ex1 = {
      id: 'triad-1',
      number: 'Example 01',
      name: 'Easy to Wear — Whisper Linen Triad',
      swatches: [
        createBaseSwatch(baseColor, 'Dominant Linen 60%', 6),
        createSwatch(t2H, clamp(s * 0.85 + 0.02, 0.08, 0.24), clamp(l - 0.12, 0.70, 0.84), 'Supporting Tint 25%', 2.5),
        createSwatch(t3H, clamp(s * 0.95 + 0.04, 0.12, 0.28), clamp(l - 0.24, 0.56, 0.68), 'Accent Haze 15%', 1.5)
      ]
    };
  } else if (c.isDark) {
    // Dark base (e.g. Deep Burgundy):
    // Dark base is Dominant (60%), Velvet Triad II is Supporting (25%), Clean contrast neutral is Accent (15%)
    ex1 = {
      id: 'triad-1',
      number: 'Example 01',
      name: 'Easy to Wear — Classic Heritage Triad',
      swatches: [
        createBaseSwatch(baseColor, 'Dominant Velvet 60%', 6),
        createSwatch(t2H, clamp(s * 0.45 + 0.04, 0.18, 0.34), clamp(l + 0.18, 0.30, 0.42), 'Supporting Triad 25%', 2.5),
        createSwatch(neutralLight.h, neutralLight.s, neutralLight.l, `Accent ${neutralLight.tag} 15%`, 1.5)
      ]
    };
  } else {
    // Mid-tone (e.g. Sage Green):
    ex1 = {
      id: 'triad-1',
      number: 'Example 01',
      name: 'Easy to Wear — Bespoke Harmonic Ensemble',
      swatches: [
        createBaseSwatch(baseColor, 'Dominant Base 60%', 6),
        createSwatch(t2H, clamp(s * 0.55 + 0.04, 0.18, 0.32), clamp(l + 0.16, 0.58, 0.70), 'Supporting Triad 25%', 2.5),
        createSwatch(t3H, clamp(s * 0.75 + 0.06, 0.28, 0.46), clamp(l - 0.12, 0.34, 0.44), 'Accent Triad 15%', 1.5)
      ]
    };
  }

  // --- Example 2 — More Expressive ---
  // Subdued Heritage Statement: Base is Dominant (50%), Dusty Triad III is Supporting (30%), Neutral is Accent (20%)
  const ex2Neutral = c.isLight ? neutralMid : c.isDark ? neutralLight : neutralDeep;
  const ex2T3S = c.isMuted ? clamp(s * 0.90 + 0.03, 0.10, 0.24) : clamp(s * 0.50 + 0.05, 0.20, 0.36);
  const ex2T3L = c.isLight ? clamp(l - 0.18, 0.66, 0.78) : clamp(l + 0.20, 0.36, 0.48);
  const ex2 = {
    id: 'triad-2',
    number: 'Example 02',
    name: 'More Expressive — Subdued Heritage Statement',
    swatches: [
      createBaseSwatch(baseColor, 'Dominant Base 50%', 5),
      createSwatch(t3H, ex2T3S, ex2T3L, 'Supporting Triad 30%', 3),
      createSwatch(ex2Neutral.h, ex2Neutral.s, ex2Neutral.l, `Accent ${ex2Neutral.tag} 20%`, 2)
    ]
  };

  // --- Example 3 — Experimental ---
  // Hierarchy Inversion: Triad II takes Dominant (50%)!
  // Selected base shifts to Supporting (30%)!
  // Triad III takes Accent (20%)!
  // (Directly implements the user's example: Raw Ecru -> Soft Teal dominant, Raw Ecru supporting, Muted Purple accent!)
  const ex3T2S = c.isMuted ? clamp(s * 0.95 + 0.05, 0.14, 0.28) : clamp(s * 0.55 + 0.06, 0.24, 0.38);
  const ex3T2L = c.isLight ? clamp(0.72, 0.65, 0.78) : clamp(0.38, 0.32, 0.46);
  const ex3T3S = c.isMuted ? clamp(s * 1.1 + 0.06, 0.16, 0.32) : clamp(s * 0.70 + 0.08, 0.32, 0.52);
  const ex3T3L = c.isLight ? clamp(0.62, 0.54, 0.68) : clamp(0.68, 0.62, 0.76);

  const ex3 = {
    id: 'triad-3',
    number: 'Example 03',
    name: 'Experimental — Inverted Runway Triad',
    swatches: [
      createSwatch(t2H, ex3T2S, ex3T2L, 'Dominant Triad II 50%', 5),
      createBaseSwatch(baseColor, 'Supporting Base 30%', 3),
      createSwatch(t3H, ex3T3S, ex3T3L, 'Accent Triad III 20%', 2)
    ]
  };

  return [ex1, ex2, ex3];
}

/**
 * Two-Page Colour Studio with Interactive Colour Wheel (Left Page)
 * and 4-Technique Dynamic Palette Generator (Right Page)
 */
export default function ColourArchiveBook({ onExploreLookbook }) {
  const [selectedFamilyId, setSelectedFamilyId] = useState('greens');
  const [selectedTechnique, setSelectedTechnique] = useState('complementary');
  const [copiedHex, setCopiedHex] = useState(null);
  const [starredSlots, setStarredSlots] = useState({});

  // Page-turn navigation state
  const [activePalette, setActivePalette] = useState(null); // null = generator, palette obj = detail
  const [leafState, setLeafState] = useState('generator'); // 'generator' | 'detail'
  const [isTurning, setIsTurning] = useState(false);
  const [zoomedSide, setZoomedSide] = useState(null); // 'left' | 'right' | null

  // Shared colour-application & garment layer state for desktop detail spread
  const [selectedSwatch, setSelectedSwatch] = useState(null);
  const [zoneColours, setZoneColours] = useState({});
  const [activeGarments, setActiveGarments] = useState({
    outerwear: true,
    topwear: true,
    bottomwear: true,
    accessories: true,
  });

  const handleApplyColour = (zone, hex) => {
    if (hex === null) {
      setZoneColours(prev => {
        const next = { ...prev };
        delete next[zone];
        return next;
      });
    } else {
      setZoneColours(prev => ({ ...prev, [zone]: hex }));
    }
  };

  const handleResetColours = () => {
    setZoneColours({});
  };

  const handleToggleGarment = (zone) => {
    setActiveGarments(prev => ({ ...prev, [zone]: !prev[zone] }));
  };

  const handleSetGarments = (config) => {
    setActiveGarments(config);
  };

  // Active selected colour state
  const initialCoord = FAMILY_STARTING_COORDINATES.greens;
  const initialRgb = hslToRgb(initialCoord.h, initialCoord.s, initialCoord.l);
  const [selectedColor, setSelectedColor] = useState({
    h: initialCoord.h,
    s: initialCoord.s,
    l: initialCoord.l,
    hex: rgbToHex(initialRgb[0], initialRgb[1], initialRgb[2]),
    rgb: { r: initialRgb[0], g: initialRgb[1], b: initialRgb[2] },
    name: initialCoord.name
  });

  // Tonal depth / luminance (0.25 to 0.80, default 0.45)
  const [luminance, setLuminance] = useState(0.45);

  // Wheel interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null); // { x, y, hex }

  const canvasRef = useRef(null);
  const wheelContainerRef = useRef(null);
  const familyScrollRef = useRef(null);

  const WHEEL_SIZE = 190; // Diameter in pixels
  const WHEEL_RADIUS = WHEEL_SIZE / 2;

  /**
   * Draw continuous colour wheel spectrum on HTML5 Canvas
   */
  const drawWheel = useCallback((canvas, currentLuminance) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = WHEEL_SIZE;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2;

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * size + x) * 4;

        if (dist <= radius) {
          // Angle in degrees clockwise from 12 o'clock
          const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360;
          const sat = Math.min(dist / radius, 1);

          // Center blends to soft tint, edge reaches selected luminance tone
          const pixelL = 1 - sat * (1 - currentLuminance);
          const [r, g, b] = hslToRgb(angle, sat, pixelL);

          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;

          // Anti-aliased outer boundary
          const edgeAlpha = Math.min(1, Math.max(0, radius - dist + 0.8));
          data[idx + 3] = Math.round(edgeAlpha * 255);
        } else {
          data[idx + 3] = 0;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [WHEEL_SIZE]);

  useEffect(() => {
    if (canvasRef.current) {
      drawWheel(canvasRef.current, luminance);
    }
  }, [drawWheel, luminance]);

  /**
   * Calculate colour parameters from pointer position relative to wheel center
   */
  const calculateColorFromPoint = useCallback((clientX, clientY, targetEl) => {
    const container = targetEl || wheelContainerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const cx = rect.left + WHEEL_RADIUS;
    const cy = rect.top + WHEEL_RADIUS;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Angle clockwise from 12 o'clock
    const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360;
    const sat = Math.min(1, Math.max(0, dist / WHEEL_RADIUS));
    const effectiveL = 1 - sat * (1 - luminance);

    const [r, g, b] = hslToRgb(angle, sat, effectiveL);
    const hex = rgbToHex(r, g, b);
    const name = getPerceptualShadeName(r, g, b, angle, sat, effectiveL);

    return {
      h: Math.round(angle),
      s: parseFloat(sat.toFixed(3)),
      l: parseFloat(effectiveL.toFixed(3)),
      hex,
      rgb: { r, g, b },
      name,
      dist,
      relX: clientX - rect.left,
      relY: clientY - rect.top
    };
  }, [WHEEL_RADIUS, luminance]);

  /**
   * Pointer interaction handlers (Supports Mouse, Drag, and Touch)
   */
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);

    const color = calculateColorFromPoint(e.clientX, e.clientY, e.currentTarget);
    if (color) {
      setSelectedColor({
        h: color.h,
        s: color.s,
        l: color.l,
        hex: color.hex,
        rgb: color.rgb,
        name: color.name
      });
    }
  };

  const handlePointerMove = (e) => {
    const color = calculateColorFromPoint(e.clientX, e.clientY, e.currentTarget);
    if (!color) return;

    if (isDragging) {
      setSelectedColor({
        h: color.h,
        s: color.s,
        l: color.l,
        hex: color.hex,
        rgb: color.rgb,
        name: color.name
      });
      setHoverInfo(null);
    } else {
      // Hover preview if inside wheel circumference
      if (color.dist <= WHEEL_RADIUS + 2) {
        setHoverInfo({
          x: color.relX,
          y: color.relY,
          hex: color.hex
        });
      } else {
        setHoverInfo(null);
      }
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      setHoverInfo(null);
    }
  };

  /**
   * Handle selecting a Colour Family
   * Automatically sets the wheel selection into that family's palette
   */
  const handleSelectFamily = (familyId) => {
    setSelectedFamilyId(familyId);
    const coord = FAMILY_STARTING_COORDINATES[familyId] || FAMILY_STARTING_COORDINATES.greens;
    const [r, g, b] = hslToRgb(coord.h, coord.s, coord.l);
    const hex = rgbToHex(r, g, b);

    setSelectedColor({
      h: coord.h,
      s: coord.s,
      l: coord.l,
      hex,
      rgb: { r, g, b },
      name: coord.name
    });
    setLuminance(coord.l);
  };

  /**
   * Update luminance / depth
   */
  const handleLuminanceChange = (newL) => {
    setLuminance(newL);
    const effectiveL = 1 - selectedColor.s * (1 - newL);
    const [r, g, b] = hslToRgb(selectedColor.h, selectedColor.s, effectiveL);
    const hex = rgbToHex(r, g, b);
    const name = getPerceptualShadeName(r, g, b, selectedColor.h, selectedColor.s, effectiveL);

    setSelectedColor((prev) => ({
      ...prev,
      l: parseFloat(effectiveL.toFixed(3)),
      hex,
      rgb: { r, g, b },
      name
    }));
  };

  const scrollFamilies = (offset) => {
    if (familyScrollRef.current) {
      familyScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleCopyHex = (hex) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(hex);
    }
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const toggleStar = (slotKey) => {
    setStarredSlots((prev) => ({
      ...prev,
      [slotKey]: !prev[slotKey]
    }));
  };

  // Page-turn: open a palette detail spread
  const openDetailSpread = (example) => {
    const palette = { ...example, technique: selectedTechnique, baseColor: { ...selectedColor } };
    setActivePalette(palette);
    setSelectedSwatch(null);
    setZoneColours({});
    setZoomedSide(null);
    setIsTurning(true);
    setLeafState('detail');
    setTimeout(() => {
      setIsTurning(false);
    }, 720);
  };

  // Page-turn: return from detail spread to generator
  const closeDetailSpread = () => {
    setZoomedSide(null);
    setIsTurning(true);
    setLeafState('generator');
    setTimeout(() => {
      setIsTurning(false);
      setActivePalette(null);
    }, 720);
  };

  // Indicator position on the wheel: polar -> cartesian
  const thetaRad = ((selectedColor.h - 90) * Math.PI) / 180;
  const indicatorX = WHEEL_RADIUS + selectedColor.s * WHEEL_RADIUS * Math.cos(thetaRad);
  const indicatorY = WHEEL_RADIUS + selectedColor.s * WHEEL_RADIUS * Math.sin(thetaRad);

  // Dynamically calculate the three examples based on the selected colour and technique
  const currentExamples = generateTechniqueExamples(selectedColor, selectedTechnique);


    // Render Left Page: Colour Explorer
  const renderColourExplorer = () => (
    <div className="w-full h-full p-4 sm:p-5 lg:p-6 flex flex-col justify-between bg-[#FAF8F3] border-b md:border-b-0 md:border-r border-[#49382C]/15 relative z-10 min-h-[420px] sm:min-h-[460px]">
      {/* Top Folio Label */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#49382C]/10 text-[9px] font-mono uppercase tracking-[0.2em] text-[#34483A]">
        <span className="flex items-center gap-1.5 font-semibold">
          <BookOpen className="w-3 h-3 text-[#34483A]" />
          Page 01 â€¢ Colour Explorer
        </span>
        <span className="text-[#49382C]/60">Interactive Spectrum</span>
      </div>

      {/* A. COLOUR FAMILIES SELECTOR */}
      <div className="space-y-1 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#49382C]/80 font-semibold">
            Colour Families
          </span>
          <span className="text-[9px] font-mono text-[#34483A]">
            {FAMILY_DISPLAY_NAMES[selectedFamilyId]}
          </span>
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => scrollFamilies(-120)}
            aria-label="Scroll colour families left"
            className="p-1 text-[#49382C]/60 hover:text-[#49382C] shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div
            ref={familyScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 scroll-smooth w-full"
          >
            {COLOUR_FAMILIES.map((family) => {
              const isSelected = family.id === selectedFamilyId;
              const displayName = FAMILY_DISPLAY_NAMES[family.id] || family.name;
              const repHex = family.shades[Math.floor(family.shades.length / 2)]?.hex || '#6A8A66';

              return (
                <button
                  key={family.id}
                  type="button"
                  onClick={() => handleSelectFamily(family.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans rounded-xs whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#34483A] text-[#FAF8F3] font-semibold shadow-2xs'
                      : 'bg-[#F3EDE2] text-[#49382C]/80 hover:bg-[#EFE9DF] hover:text-[#49382C] border border-[#49382C]/15'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: repHex }}
                  />
                  <span className="text-[11px]">{displayName}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollFamilies(120)}
            aria-label="Scroll colour families right"
            className="p-1 text-[#49382C]/60 hover:text-[#49382C] shrink-0 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* B. INTERACTIVE COLOUR WHEEL */}
      <div className="flex-1 flex flex-col items-center justify-center my-1 select-none">
        <div
          ref={wheelContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="relative touch-none cursor-crosshair rounded-full shadow-md border-2 border-[#49382C]/15 transition-transform duration-100 hover:shadow-lg"
          style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
          title="Click and drag to explore continuous colours"
        >
          {/* Canvas Drawing Surface */}
          <canvas
            ref={(el) => {
              canvasRef.current = el;
              if (el) drawWheel(el, luminance);
            }}
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            className="rounded-full w-full h-full block"
          />

          {/* Subtle Inner Paper Texture Shadow */}
          <div className="absolute inset-0 rounded-full pointer-events-none ring-1 ring-inset ring-black/10 shadow-inner" />

          {/* Current Selection Ring Indicator */}
          <div
            className={`absolute pointer-events-none z-20 -translate-x-1/2 -translate-y-1/2 ${
              isDragging ? 'transition-none' : 'transition-all duration-75'
            }`}
            style={{
              left: `${indicatorX}px`,
              top: `${indicatorY}px`
            }}
          >
            <div className="w-5 h-5 rounded-full border-2 border-white shadow-md ring-1 ring-black/40 flex items-center justify-center">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedColor.hex }}
              />
            </div>
          </div>

          {/* Hover Preview Tooltip */}
          {hoverInfo && (
            <div
              className="absolute z-30 pointer-events-none"
              style={{
                left: `${hoverInfo.x}px`,
                top: `${hoverInfo.y - 28}px`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="flex items-center gap-1 bg-[#FAF8F3] border border-[#49382C]/20 rounded-xs px-1.5 py-0.5 shadow-sm">
                <div
                  className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: hoverInfo.hex }}
                />
                <span className="text-[9px] font-mono text-[#49382C] font-medium">
                  {hoverInfo.hex}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Luminance / Tonal Depth Slider */}
        <div className="mt-3 w-full max-w-[190px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#49382C]/65">
              Tonal Depth
            </span>
            <span className="text-[9px] font-mono text-[#34483A] font-medium">
              {Math.round(luminance * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="25"
            max="85"
            value={Math.round(luminance * 100)}
            onChange={(e) => handleLuminanceChange(parseInt(e.target.value, 10) / 100)}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(${selectedColor.h}, ${Math.round(selectedColor.s * 100)}%, 25%), hsl(${selectedColor.h}, ${Math.round(selectedColor.s * 100)}%, 85%))`
            }}
            aria-label="Tonal depth"
          />
        </div>
      </div>

      {/* C. SELECTED COLOUR READOUT */}
      <div className="mt-2 pt-2 border-t border-[#49382C]/10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xs border border-[#49382C]/25 shadow-xs shrink-0"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-serif text-[#49382C] font-medium leading-tight truncate">
              {selectedColor.name}
            </div>
            <div className="text-[9px] font-mono text-[#49382C]/60 tracking-wider">
              {selectedColor.hex} â€¢ H{selectedColor.h}Â° S{Math.round(selectedColor.s * 100)}% L{Math.round(selectedColor.l * 100)}%
            </div>
          </div>

          {/* Copy HEX Button */}
          <button
            type="button"
            onClick={() => handleCopyHex(selectedColor.hex)}
            title="Copy HEX to clipboard"
            className="shrink-0 inline-flex items-center gap-1 px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-[#49382C]/70 hover:text-[#49382C] border border-[#49382C]/20 rounded-xs hover:bg-[#F3EDE2] transition-all cursor-pointer"
          >
            {copiedHex === selectedColor.hex ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34483A]" />
                <span className="text-[10px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#49382C]/60" />
                <span className="text-[10px]">Copy HEX</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Render Right Page: Palette Generator
  const renderPaletteGenerator = () => (
    <div className="w-full h-full p-4 sm:p-5 lg:p-6 flex flex-col justify-between bg-[#F8F5EE] relative z-10 min-h-[420px] sm:min-h-[460px]">
      {/* Top Folio Label */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#49382C]/10 text-[9px] font-mono uppercase tracking-[0.2em] text-[#34483A]">
        <span className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="w-3 h-3 text-[#34483A]" />
          Page 02 â€¢ Palette Generator
        </span>
        <span className="text-[#49382C]/60">Harmonic Formulations</span>
      </div>

      {/* A. TECHNIQUE SELECTOR (4 Techniques: Compact grid-cols-4) */}
      <div className="space-y-1.5 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <h3 className="font-serif text-lg sm:text-xl text-[#49382C] font-normal leading-tight">
            Colour Palette Generator
          </h3>
          <span className="text-[10px] font-sans text-[#49382C]/65">
            Three Curated Studies
          </span>
        </div>

        {/* 4 Selectable Techniques */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#EFEAE0] border border-[#49382C]/15 rounded-xs">
          {PALETTE_TECHNIQUES.map((tech) => {
            const isSelected = tech.id === selectedTechnique;
            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => setSelectedTechnique(tech.id)}
                className={`py-1.5 px-1 sm:px-1.5 text-center text-[10px] sm:text-[11px] font-sans rounded-2xs transition-all uppercase tracking-wider truncate cursor-pointer ${
                  isSelected
                    ? 'bg-[#34483A] text-[#FAF8F3] font-semibold shadow-xs'
                    : 'text-[#49382C]/75 hover:text-[#49382C] font-medium'
                }`}
              >
                {tech.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* B. THREE EXAMPLE SLOTS (Vertically Arranged Cards) */}
      <div className="space-y-2 flex-1 flex flex-col justify-center my-1">
        {currentExamples.map((example) => {
          return (
            <div
              key={example.id}
              className="bg-[#FAF8F3] border border-[#49382C]/20 hover:border-[#49382C]/40 rounded-xs p-3 transition-all shadow-xs flex flex-col justify-between gap-2"
            >
              {/* Card Top: Number, Descriptive Name, Star Navigation Button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-wider font-semibold text-[#34483A] bg-[#EFEAE0] px-1.5 py-0.5 rounded-2xs shrink-0">
                    {example.number}
                  </span>
                  <span className="font-serif text-xs sm:text-sm text-[#49382C] truncate font-medium">
                    {example.name}
                  </span>
                </div>

                {/* Star navigation button: turns page to open detail spread */}
                <button
                  type="button"
                  onClick={() => openDetailSpread(example)}
                  title="Turn page to inspect palette details"
                  className="star-nav-button p-1 text-[#49382C]/40 hover:text-amber-600 transition-colors shrink-0 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Proportional Colour Blocks (Pure Visual Composition: No permanent text, Percentage Tooltip on Hover) */}
              <div className="h-10 sm:h-11 rounded-xs overflow-hidden flex border border-[#49382C]/20 shadow-2xs relative">
                {example.swatches.map((swatch, sIdx) => {
                  const totalFlex = example.swatches.reduce((sum, s) => sum + (Number(s.flex) || 1), 0);
                  const p1 = Math.round(((Number(example.swatches[0]?.flex) || 5.5) / totalFlex) * 100);
                  const p2 = Math.round(((Number(example.swatches[1]?.flex) || 3.0) / totalFlex) * 100);
                  const p3 = 100 - p1 - p2;
                  const percentages = [p1, p2, p3];
                  const percentage = percentages[sIdx] ?? Math.round(((Number(swatch.flex) || 1) / totalFlex) * 100);

                  return (
                    <div
                      key={sIdx}
                      style={{
                        backgroundColor: swatch.hex,
                        flex: swatch.flex
                      }}
                      className="h-full relative group cursor-pointer border-r border-black/10 last:border-r-0 select-none flex items-center justify-center transition-all hover:brightness-105"
                    >
                      {/* On hover, show a small tooltip containing only the percentage of the relevant colour */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none absolute bottom-full mb-1.5 px-2 py-0.5 bg-[#49382C] text-[#FAF8F3] text-[10px] font-mono font-medium rounded-2xs shadow-md z-30 whitespace-nowrap">
                        {percentage}%
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-[#49382C]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Page Footer / Curatorial Note */}
      <div className="pt-2 mt-1 border-t border-[#49382C]/15 flex items-center justify-between text-[10px] text-[#49382C]/65 font-light">
        <span className="font-serif italic truncate max-w-[200px]">
          {selectedTechnique.charAt(0).toUpperCase() + selectedTechnique.slice(1)} Study â€¢ Base {selectedColor.hex}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#34483A] font-semibold shrink-0">
          Anvaya Studio
        </span>
      </div>
    </div>
  );

  return (
    <section id="colour-archive" className="py-4 sm:py-6 md:py-8 relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2.5 mb-1.5">
            <span className="h-[1px] w-6 bg-forest/40" />
            <span className="text-[10px] font-sans uppercase tracking-[0.26em] text-forest font-semibold">
              The Physical Specimen Archive
            </span>
            <span className="h-[1px] w-6 bg-forest/40" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-espresso tracking-tight">
            Colour Palette Explorer
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-espresso/75 font-light">
            An open reference volume: explore mineral and botanical tints on the left, harmonised studies on the right.
          </p>
        </div>

        {/* =========================================================================
            TWO-PAGE OPEN BOOK CONTAINER (Target: 1366 Ã— 768 Viewport)
           ========================================================================= */}
        <div className={`book-3d-scene bg-[#FAF8F3] border-2 border-[#49382C]/20 rounded-md shadow-2xl relative max-w-6xl mx-auto flex flex-col md:flex-row ${zoomedSide ? 'book-3d-scene--zoomed' : ''}`}>

          {/* Central Book Spine Crease Overlay (Desktop) */}
          <div className={`hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 ${zoomedSide ? 'z-25 opacity-0' : 'z-35 opacity-70'} pointer-events-none bg-gradient-to-r from-transparent via-[#49382C]/10 to-transparent mix-blend-multiply transition-opacity`} />
          <div className={`hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 ${zoomedSide ? 'z-25 opacity-0' : 'z-35 opacity-100'} pointer-events-none bg-[#49382C]/20 transition-opacity`} />

          {/* Page shadow cast on left page during turn (Desktop) */}
          <div className={`hidden md:block book-page-shadow-overlay ${isTurning ? 'book-page-shadow-overlay--active' : ''} ${zoomedSide ? '!opacity-0' : ''}`} />

          {/* -----------------------------------------------------------------------
              LEFT PAGE: Colour Explorer (In-flow on desktop & mobile)
              Rendered EXACTLY ONCE to preserve single canvas and pointer tracking
             ----------------------------------------------------------------------- */}
          <div className={`w-full md:w-1/2 ${activePalette ? 'hidden md:block pointer-events-none' : 'block'} ${zoomedSide === 'left' ? 'relative z-[60]' : 'relative z-10'}`}>
            {renderColourExplorer()}
          </div>

          {/* -----------------------------------------------------------------------
              RIGHT PAGE: Mobile Generator (when not in detail view)
             ----------------------------------------------------------------------- */}
          {!activePalette && (
            <div className="md:hidden w-full">
              {renderPaletteGenerator()}
            </div>
          )}

          {/* -----------------------------------------------------------------------
              RIGHT PAGE: Desktop Stationary Page (Revealed under leaf in detail view)
             ----------------------------------------------------------------------- */}
          <div className={`hidden md:block w-1/2 bg-[#F8F5EE] ${zoomedSide === 'right' ? 'relative z-[60]' : 'relative z-10'}`}>
            {activePalette ? (
              <DetailRightPage
                palette={activePalette}
                onReturn={closeDetailSpread}
                selectedSwatch={selectedSwatch}
                onSelectSwatch={setSelectedSwatch}
                activeGarments={activeGarments}
                onToggleGarment={handleToggleGarment}
                onSetGarments={handleSetGarments}
                zoneColours={zoneColours}
                onApplyColour={handleApplyColour}
                onResetColours={handleResetColours}
                isZoomed={zoomedSide === 'right'}
                onZoomChange={(z) => setZoomedSide(z ? 'right' : null)}
              />
            ) : (
              <div className="w-full h-full min-h-[500px] bg-[#F8F5EE]" />
            )}
          </div>

          {/* -----------------------------------------------------------------------
              DESKTOP 3D TURNING PAGE LEAF: Anchored at spine, swings 180° right-to-left
             ----------------------------------------------------------------------- */}
          <div className={`hidden md:block book-page-leaf book-page-leaf--${leafState} ${isTurning ? 'book-page-leaf--turning' : ''} ${zoomedSide === 'right' ? '!z-20' : zoomedSide === 'left' ? '!z-[60] book-page-leaf--zoomed' : ''}`}>
            {/* Front Face: Palette Generator (Page 02) */}
            <div className="book-leaf-front">
              {renderPaletteGenerator()}
            </div>

            {/* Back Face: DetailLeftPage (Page 03) */}
            <div className="book-leaf-back">
              {activePalette && (
                <DetailLeftPage
                  palette={activePalette}
                  onReturn={closeDetailSpread}
                  selectedSwatch={selectedSwatch}
                  onSelectSwatch={setSelectedSwatch}
                  isZoomed={zoomedSide === 'left'}
                  onZoomChange={(z) => setZoomedSide(z ? 'left' : null)}
                />
              )}
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              MOBILE DETAIL SPREAD: Stacked Navigation for Small Screens (< md)
             ----------------------------------------------------------------------- */}
          {activePalette && (
            <div className="md:hidden flex flex-col w-full">
              <PaletteDetailSpread 
                palette={activePalette} 
                onReturn={closeDetailSpread}
                selectedSwatch={selectedSwatch}
                onSelectSwatch={setSelectedSwatch}
                activeGarments={activeGarments}
                onToggleGarment={handleToggleGarment}
                onSetGarments={handleSetGarments}
                zoneColours={zoneColours}
                onApplyColour={handleApplyColour}
                onResetColours={handleResetColours}
                isLeftZoomed={zoomedSide === 'left'}
                onLeftZoomChange={(z) => setZoomedSide(z ? 'left' : null)}
                isRightZoomed={zoomedSide === 'right'}
                onRightZoomChange={(z) => setZoomedSide(z ? 'right' : null)}
              />
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

