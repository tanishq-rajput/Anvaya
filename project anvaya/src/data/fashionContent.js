/**
 * ANVAYA Fashion Content System
 * 
 * Internal categories:
 * - 'men': Visible only when browsing Men's collection
 * - 'women': Visible only when browsing Women's collection
 * - 'shared': Visible in BOTH Men's and Women's collections (unisex styling, shared staples)
 * 
 * Aesthetics:
 * - Old Money
 * - Minimalist
 * - Streetwear
 * - Smart Casual
 * - Casual
 * - Professional
 */

export const AESTHETICS = [
  'All Aesthetics',
  'Old Money',
  'Minimalist',
  'Streetwear',
  'Smart Casual',
  'Casual',
  'Professional',
];

export const OUTFITS = [
  // --- OLD MONEY ---
  {
    id: 'om-men-1',
    name: 'Italian Double-Breasted Wool Blazer & Pleated Slacks',
    category: 'men',
    aesthetic: 'Old Money',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
    garments: ['Navy double-breasted wool blazer', 'Light ecru poplin shirt', 'Medium-grey pleated trousers', 'Burnished oxblood horsebit loafers'],
    mainColours: [
      { name: 'Dark Navy', hex: '#1C2833' },
      { name: 'Ecru', hex: '#F4EFEA' },
      { name: 'Mid Grey', hex: '#85929E' }
    ],
    stylingExplanation: 'Classic heritage tailoring rooted in high-armhole cuts and unstructured canvas drape, exuding understated authority.'
  },
  {
    id: 'om-women-1',
    name: 'Cashmere Cable-Knit & High-Waist Pleated Midi',
    category: 'women',
    aesthetic: 'Old Money',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    garments: ['Heavy cream cable-knit cashmere sweater', 'A-line wool-blend pleated midi skirt', 'Chocolate brown leather riding boots', 'Silk neck foulard'],
    mainColours: [
      { name: 'Cream Cashmere', hex: '#FDFBF7' },
      { name: 'Espresso', hex: '#1E1815' },
      { name: 'Warm Taupe', hex: '#A39587' }
    ],
    stylingExplanation: 'Subtle equestrian elegance with luxurious texture layering that focuses on heritage materials rather than logos.'
  },
  {
    id: 'om-shared-1',
    name: 'Double-Faced Camel Coat & Tailored Loafers',
    category: 'shared',
    aesthetic: 'Old Money',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
    garments: ['Unstructured double-faced camel wool coat', 'Fine-gauge merino wool turtleneck', 'Tailored stone trousers', 'Calfskin leather penny loafers'],
    mainColours: [
      { name: 'Warm Camel', hex: '#C9BAA6' },
      { name: 'Walnut', hex: '#4A3728' },
      { name: 'Ivory', hex: '#FAF8F5' }
    ],
    stylingExplanation: 'A timeless silhouette defined by clean natural drape and an earthy palette that commands respect across any wardrobe.'
  },

  // --- MINIMALIST ---
  {
    id: 'min-men-1',
    name: 'Boxy Heavyweight Overshirt & Straight Trousers',
    category: 'men',
    aesthetic: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1000&q=85',
    garments: ['Boxy boiled-wool overshirt in Espresso', 'Heavy cotton crewneck tee in Ivory', 'Straight-leg pressed wool trousers in Slate', 'Minimalist black derby shoes'],
    mainColours: [
      { name: 'Espresso', hex: '#1E1815' },
      { name: 'Ivory', hex: '#FAF8F5' },
      { name: 'Slate Grey', hex: '#5D6D7E' }
    ],
    stylingExplanation: 'Architectural geometry with hidden plackets and clean hem finishes creates a razor-sharp, distraction-free aesthetic.'
  },
  {
    id: 'min-women-1',
    name: 'Sculptural Column Maxi Dress & Angular Leather Slides',
    category: 'women',
    aesthetic: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    garments: ['Matte jersey architectural column maxi dress', 'Unlined linen trench duster', 'Square-toe sculptural leather mules', 'Brushed silver cuff'],
    mainColours: [
      { name: 'Warm Alabaster', hex: '#F7F5F0' },
      { name: 'Muted Forest', hex: '#2D3B30' },
      { name: 'Charcoal', hex: '#2C3E50' }
    ],
    stylingExplanation: 'Pure verticality and deliberate proportion. The continuous silhouette lengthens the body while maintaining effortless grace.'
  },
  {
    id: 'min-shared-1',
    name: 'Relaxed Raw Linen Button-Down & Ecru Chinos',
    category: 'shared',
    aesthetic: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    garments: ['Pre-washed raw linen relaxed shirt', 'Loose-fit single-pleat ecru chinos', 'Muted leather slip-on loafers', 'Minimalist canvas tote'],
    mainColours: [
      { name: 'Raw Linen', hex: '#D8CEC3' },
      { name: 'Ecru', hex: '#F4EFEA' },
      { name: 'Muted Taupe', hex: '#A39587' }
    ],
    stylingExplanation: 'Breathable organic fabrics paired tone-on-tone to highlight weave texture over artificial color.'
  },

  // --- STREETWEAR ---
  {
    id: 'str-men-1',
    name: 'Heavyweight Flannel Overshirt & Wide Carpenter Slacks',
    category: 'men',
    aesthetic: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85',
    garments: ['500gsm brushed cotton utility overshirt', 'Dropped-shoulder boxy tee', 'Heavy duck canvas carpenter pants', 'Retro runner low-top sneakers'],
    mainColours: [
      { name: 'Forest Green', hex: '#2D3B30' },
      { name: 'Bone White', hex: '#F4EFEA' },
      { name: 'Muted Earth', hex: '#7A6D61' }
    ],
    stylingExplanation: 'Utilitarian workwear re-engineered with relaxed skate-inspired volume for functional all-day style.'
  },
  {
    id: 'str-women-1',
    name: 'Cropped Parachute Jacket & Relaxed Cargo Slacks',
    category: 'women',
    aesthetic: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=1000&q=85',
    garments: ['Cropped nylon technical bomber', 'Ribbed high-neck micro tank', 'Wide-leg articulated cargo trousers', 'Chunky retro trail sneakers'],
    mainColours: [
      { name: 'Muted Olive', hex: '#3C4E40' },
      { name: 'Ivory', hex: '#FAF8F5' },
      { name: 'Deep Espresso', hex: '#1E1815' }
    ],
    stylingExplanation: 'Contrast between the cinched cropped jacket waistline and exaggerated leg width provides dynamic visual balance.'
  },
  {
    id: 'str-shared-1',
    name: 'Oversized Vintage Washed Tee & Wide-Leg Raw Denim',
    category: 'shared',
    aesthetic: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
    garments: ['300gsm vintage wash drop-shoulder t-shirt', '14oz rigid Japanese selvedge denim (wide leg)', 'Retro court suede trainers', 'Structured cotton cap'],
    mainColours: [
      { name: 'Faded Charcoal', hex: '#2C3E50' },
      { name: 'Indigo', hex: '#1B2631' },
      { name: 'Ecru', hex: '#F4EFEA' }
    ],
    stylingExplanation: 'The quintessential modern streetwear foundation: heavy fabric drape that holds an architectural silhouette.'
  },

  // --- SMART CASUAL ---
  {
    id: 'sc-men-1',
    name: 'Fine Merino Mockneck & Unstructured Linen Blazer',
    category: 'men',
    aesthetic: 'Smart Casual',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=85',
    garments: ['Soft shoulder unlined linen-wool blazer', 'Fine-gauge merino mockneck sweater', 'Tailored drawstring trousers', 'Suede penny loafers'],
    mainColours: [
      { name: 'Walnut', hex: '#4A3728' },
      { name: 'Muted Forest', hex: '#2D3B30' },
      { name: 'Warm Ivory', hex: '#FAF8F5' }
    ],
    stylingExplanation: 'Replacing a traditional collar shirt with a fine knit relaxes formal jacket construction while elevating everyday meetings.'
  },
  {
    id: 'sc-women-1',
    name: 'Silk Crepe Blouse & High-Waisted Cigarette Trousers',
    category: 'women',
    aesthetic: 'Smart Casual',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    garments: ['Silk crepe de chine blouse with soft drape', 'High-waisted cropped cigarette trousers', 'Pointed leather slingback flats', 'Leather saddle bag'],
    mainColours: [
      { name: 'Champagne Ivory', hex: '#FAF8F5' },
      { name: 'Espresso', hex: '#1E1815' },
      { name: 'Warm Taupe', hex: '#A39587' }
    ],
    stylingExplanation: 'Luxurious fluid silk juxtaposed against crisp tailored trousers bridges executive polish and gallery-evening ease.'
  },
  {
    id: 'sc-shared-1',
    name: 'Relaxed Tailored Blazer & Crisp Heavyweight Tee',
    category: 'shared',
    aesthetic: 'Smart Casual',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
    garments: ['Single-breasted relaxed wool blazer', 'Premium combed cotton crewneck t-shirt', 'Tapered pleated chinos', 'Minimal leather court sneakers'],
    mainColours: [
      { name: 'Deep Espresso', hex: '#1E1815' },
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Warm Taupe', hex: '#A39587' }
    ],
    stylingExplanation: 'High-low dressing at its finest: pairing structured suiting with casual staples for effortless versatility.'
  },

  // --- CASUAL ---
  {
    id: 'cas-men-1',
    name: 'Waffle-Knit Raglan & Relaxed Olive Chinos',
    category: 'men',
    aesthetic: 'Casual',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=85',
    garments: ['Heavy waffle-knit long-sleeve crewneck', 'Relaxed-fit garment-dyed olive chinos', 'Moc-toe leather boots', 'Field canvas watch'],
    mainColours: [
      { name: 'Ecru', hex: '#F4EFEA' },
      { name: 'Forest Olive', hex: '#2D3B30' },
      { name: 'Walnut', hex: '#4A3728' }
    ],
    stylingExplanation: 'Tactile thermal knits provide comfortable structure for weekend living without looking unkempt.'
  },
  {
    id: 'cas-women-1',
    name: 'Breezy Cotton Poplin Button-Down & Linen Shorts',
    category: 'women',
    aesthetic: 'Casual',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85',
    garments: ['Oversized organic cotton poplin shirt', 'Pleated high-waisted linen shorts', 'Leather woven huarache sandals', 'Woven raffia tote'],
    mainColours: [
      { name: 'Linen Ecru', hex: '#F4EFEA' },
      { name: 'Warm Sand', hex: '#DDD2C3' },
      { name: 'Espresso', hex: '#1E1815' }
    ],
    stylingExplanation: 'Effortless sun-drenched ease with relaxed rolled cuffs and natural fiber breathability.'
  },
  {
    id: 'cas-shared-1',
    name: 'Classic Brushed Sweatshirt & Relaxed Canvas Pants',
    category: 'shared',
    aesthetic: 'Casual',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85',
    garments: ['Loopback French terry crewneck sweatshirt', 'Straight-cut washed canvas utility trousers', 'Canvas low-top trainers', 'Ribbed wool beanie'],
    mainColours: [
      { name: 'Warm Taupe', hex: '#A39587' },
      { name: 'Forest Green', hex: '#2D3B30' },
      { name: 'Ivory', hex: '#FAF8F5' }
    ],
    stylingExplanation: 'Premium fleece weight and clean tailoring lift lounge staples into refined street-ready leisurewear.'
  },

  // --- PROFESSIONAL ---
  {
    id: 'pro-men-1',
    name: 'Sharp Charcoal Wool Suit & Spread Collar Shirt',
    category: 'men',
    aesthetic: 'Professional',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85',
    garments: ['Super 130s worsted wool two-piece suit in Charcoal', 'Spread collar Egyptian cotton shirt', 'Silk grenadine tie in Forest Green', 'Black leather cap-toe oxfords'],
    mainColours: [
      { name: 'Charcoal Wool', hex: '#212F3D' },
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Forest Green', hex: '#2D3B30' }
    ],
    stylingExplanation: 'Impeccable executive tailoring with subtle green grenadine silk adding personality without compromising decorum.'
  },
  {
    id: 'pro-women-1',
    name: 'Tailored Waistcoat Vest & Fluid Wide-Leg Trousers',
    category: 'women',
    aesthetic: 'Professional',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85',
    garments: ['Fitted four-button tailored vest', 'High-rise pleated wide-leg trousers', 'Sharp pointed leather court pumps', 'Minimalist structured briefcase'],
    mainColours: [
      { name: 'Deep Espresso', hex: '#1E1815' },
      { name: 'Warm Taupe', hex: '#A39587' },
      { name: 'Warm Ivory', hex: '#FAF8F5' }
    ],
    stylingExplanation: 'Sleek menswear-inspired suiting reimagined for the modern boardroom with fluid feminine drape.'
  },
  {
    id: 'pro-shared-1',
    name: 'Tailored Wool Overcoat & Pressed Dark Slacks',
    category: 'shared',
    aesthetic: 'Professional',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
    garments: ['Single-breasted architectural wool overcoat', 'Fine gauge mockneck knit', 'Flat-front pressed wool trousers', 'Burnished leather dress boots'],
    mainColours: [
      { name: 'Espresso Walnut', hex: '#37291E' },
      { name: 'Charcoal', hex: '#2C3E50' },
      { name: 'Bone Ivory', hex: '#F4EFEA' }
    ],
    stylingExplanation: 'Universal executive presence: a longline silhouette that shields against the elements with quiet luxury.'
  },
];

/**
 * Universal Colour Theory & Harmonization Rules
 * Available to everyone regardless of gender collection.
 */
export const COLOUR_THEORY_PALETTES = [
  {
    id: 'earth-ivory',
    title: 'Warm Cream & Forest Green',
    description: 'The foundation of quiet luxury: warm tones that soothe the eye and harmonize effortlessly.',
    swatches: [
      { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (60%)' },
      { name: 'Linen Beige', hex: '#F3EDE2', role: 'Secondary (30%)' },
      { name: 'Forest Green', hex: '#34483A', role: 'Accent (10%)' }
    ],
    stylingRule: 'Anchor the silhouette with warm cream knitwear, frame with linen beige tailoring, and introduce forest green through leather accessories or footwear.'
  },
  {
    id: 'walnut-espresso',
    title: 'Walnut & Dark Roast Espresso',
    description: 'Rich tonal depth pairing dark roast browns with warm woody mid-tones.',
    swatches: [
      { name: 'Linen Beige', hex: '#F3EDE2', role: 'Base (60%)' },
      { name: 'Walnut Brown', hex: '#76543C', role: 'Secondary (30%)' },
      { name: 'Espresso', hex: '#49382C', role: 'Accent (10%)' }
    ],
    stylingRule: 'Tone-on-tone dressing creates height and commanding composure. Ideal for textured autumn and winter wools.'
  },
  {
    id: 'forest-sage',
    title: 'Forest Green & Muted Taupe',
    description: 'Botanical sophistication that brings natural vibrance to traditional neutrals.',
    swatches: [
      { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (60%)' },
      { name: 'Forest Green', hex: '#34483A', role: 'Secondary (30%)' },
      { name: 'Muted Taupe', hex: '#B7A58D', role: 'Accent (10%)' }
    ],
    stylingRule: 'Use forest green as your primary jacket or trouser statement, softening the contrast with creamy shirting.'
  }
];

/**
 * Filter outfits for a visitor collection ('men' | 'women')
 * Internal category 'shared' is dynamically included in BOTH.
 */
export function getOutfitsForCollection(collection = 'women', aesthetic = 'All Aesthetics') {
  return OUTFITS.filter((outfit) => {
    const matchesCollection = outfit.category === collection || outfit.category === 'shared';
    const matchesAesthetic = aesthetic === 'All Aesthetics' || outfit.aesthetic === aesthetic;
    return matchesCollection && matchesAesthetic;
  });
}

