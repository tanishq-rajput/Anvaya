/**
 * ANVAYA Colour Archive – The Master Textile & Sartorial Ledger
 * 
 * 9 Colour Families arranged in book-like volumes.
 * Each family contains a progression of shades from light to deep,
 * complete with editorial descriptions, tactile fabric associations,
 * and harmonized palette recommendations (complementary, analogous, monochromatic).
 */

export const COLOUR_FAMILIES = [
  {
    id: 'greens',
    name: 'Greens',
    volume: 'Vol. I',
    epithet: 'The Botanical & Forest Ledger',
    editorialQuote: 'From misty lichen and silvered sage to deep pine needles, green is the living pulse of organic quiet luxury.',
    shades: [
      {
        id: 'sage',
        name: 'Muted Sage',
        hex: '#D2DCD2',
        textColor: '#2E3A2F',
        step: 1,
        description: 'A whisper of dried herbs and morning dew on limestone. Soft, chalky and restorative.',
        fabrics: ['Washed raw linen', 'Fine gauge silk-cashmere', 'Summer poplin'],
        season: 'Spring / Summer & Trans-Seasonal',
        complementary: { name: 'Blush Terracotta', hex: '#D99B82', role: 'Accent (15%)' },
        analogous: [
          { name: 'Celadon Frost', hex: '#B5CFBE', role: 'Secondary (35%)' },
          { name: 'Herbaceous Moss', hex: '#688B6A', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Pale Celadon', hex: '#E5EDE5', role: 'Base (50%)' },
          { name: 'Olive Grove', hex: '#4C6148', role: 'Structure (35%)' }
        ],
        outfitFormula: 'Wear as an unstructured linen blazer over crisp ecru shirting and ivory pleated shorts.'
      },
      {
        id: 'celadon',
        name: 'Pale Celadon',
        hex: '#A7C7AD',
        textColor: '#1E2D20',
        step: 2,
        description: 'Inspired by Song Dynasty porcelain and jade river stones. A luminous, soothing mid-light tint.',
        fabrics: ['Mulberry silk crepe', 'Lightweight modal jersey', 'Tropical wool'],
        season: 'Spring / Summer',
        complementary: { name: 'Dusty Rose', hex: '#C98284', role: 'Accent (10%)' },
        analogous: [
          { name: 'Muted Sage', hex: '#D2DCD2', role: 'Secondary (30%)' },
          { name: 'Olive Grove', hex: '#5B6F52', role: 'Anchor (20%)' }
        ],
        monochromatic: [
          { name: 'Celadon Mist', hex: '#D8E7DC', role: 'Base (60%)' },
          { name: 'Forest Shadow', hex: '#243B2A', role: 'Accent (10%)' }
        ],
        outfitFormula: 'Ideal for fluid silk midi dresses or breezy summer button-downs paired with stone chinos.'
      },
      {
        id: 'moss',
        name: 'Herbaceous Moss',
        hex: '#6A8A66',
        textColor: '#FFFFFF',
        step: 3,
        description: 'The lush, tactile green of shaded woodland boulders. Earthy, grounded and effortlessly refined.',
        fabrics: ['Chunky cable-knit wool', 'Moleskin trousers', 'Brushed cotton twill'],
        season: 'Autumn / Transitional',
        complementary: { name: 'Warm Terracotta', hex: '#C26A45', role: 'Accent (15%)' },
        analogous: [
          { name: 'Olive Grove', hex: '#586A4C', role: 'Secondary (30%)' },
          { name: 'Deep Emerald', hex: '#2E6941', role: 'Depth (20%)' }
        ],
        monochromatic: [
          { name: 'Lichen Veil', hex: '#C2D4BF', role: 'Base (50%)' },
          { name: 'Heritage Forest', hex: '#263C2A', role: 'Accent (15%)' }
        ],
        outfitFormula: 'A fisherman sweater in moss wool paired with raw indigo selvedge denim and chocolate leather boots.'
      },
      {
        id: 'olive',
        name: 'Olive Grove',
        hex: '#526649',
        textColor: '#FFFFFF',
        step: 4,
        description: 'Sun-cured Mediterranean olive leaves with warm yellow-brown undertones. The consummate neutral.',
        fabrics: ['Garment-dyed cotton drill', 'Unlined trench gabardine', 'Heavy canvas'],
        season: 'All Seasons',
        complementary: { name: 'Burnt Ochre', hex: '#C45E28', role: 'Accent (10%)' },
        analogous: [
          { name: 'Toasted Hazelnut', hex: '#8C6746', role: 'Secondary (35%)' },
          { name: 'Heritage Forest', hex: '#34483A', role: 'Anchor (25%)' }
        ],
        monochromatic: [
          { name: 'Pale Olive', hex: '#94A68C', role: 'Base (40%)' },
          { name: 'Black Olive', hex: '#2C3626', role: 'Structure (40%)' }
        ],
        outfitFormula: 'Tailored utility cargo trousers with an ecru waffle-knit henley and suede driving loafers.'
      },
      {
        id: 'emerald',
        name: 'Deep Emerald',
        hex: '#2B6341',
        textColor: '#FFFFFF',
        step: 5,
        description: 'The aristocratic jewel tone of velvet evenings and antique library lamps. Regal yet quiet.',
        fabrics: ['Silk velvet', 'Super 140s worsted wool', 'Fine gauge merino'],
        season: 'Autumn / Winter',
        complementary: { name: 'True Crimson', hex: '#8E2822', role: 'Accent (10%)' },
        analogous: [
          { name: 'Midnight Navy', hex: '#1C2938', role: 'Secondary (40%)' },
          { name: 'Olive Grove', hex: '#526649', role: 'Softener (15%)' }
        ],
        monochromatic: [
          { name: 'Celadon Wash', hex: '#A8C9B0', role: 'Base (45%)' },
          { name: 'Dark Spruce', hex: '#163823', role: 'Anchor (35%)' }
        ],
        outfitFormula: 'An emerald merino mockneck under a tailored charcoal overcoat with oxblood leather shoes.'
      },
      {
        id: 'forest',
        name: 'Heritage Forest',
        hex: '#34483A',
        textColor: '#FFFFFF',
        step: 6,
        description: "Anvaya's signature accent: the enduring serenity of towering pine canopies. Commanding and timeless.",
        fabrics: ['Double-faced melton wool', 'Heavyweight flannel', 'Corduroy'],
        season: 'Autumn / Winter & Permanent',
        complementary: { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (60%)' },
        analogous: [
          { name: 'Dark Roast Espresso', hex: '#49382C', role: 'Secondary (30%)' },
          { name: 'Walnut Brown', hex: '#76543C', role: 'Accent (10%)' }
        ],
        monochromatic: [
          { name: 'Sage Mist', hex: '#D2DCD2', role: 'Highlight (20%)' },
          { name: 'Deep Evergreen', hex: '#1B2C20', role: 'Anchor (50%)' }
        ],
        outfitFormula: 'A double-breasted forest wool overcoat with cream cashmere scarf and pleated espresso slacks.'
      }
    ]
  },

  {
    id: 'blues',
    name: 'Blues',
    volume: 'Vol. II',
    epithet: 'The Indigo & Cerulean Ledger',
    editorialQuote: 'From glacial powder skies to deep midnight indigo, blue speaks the universal language of quiet authority.',
    shades: [
      {
        id: 'powder-blue',
        name: 'Powder Frost',
        hex: '#D2DFE8',
        textColor: '#21323F',
        step: 1,
        description: 'A crisp, airy whisper of winter sky. Clean, serene and impeccably tailored.',
        fabrics: ['Egyptian cotton poplin', 'Chambray', 'Silk foulard'],
        season: 'Spring / Summer',
        complementary: { name: 'Warm Sand', hex: '#D9C8B0', role: 'Secondary (35%)' },
        analogous: [
          { name: 'Sky Linen', hex: '#9BB8CD', role: 'Mid-layer (25%)' },
          { name: 'Pale Lavender', hex: '#DED3E6', role: 'Accent (10%)' }
        ],
        monochromatic: [
          { name: 'Pure Alabaster', hex: '#FDFEFE', role: 'Base (50%)' },
          { name: 'Denim Indigo', hex: '#3C6788', role: 'Structure (35%)' }
        ],
        outfitFormula: 'A spread-collar powder blue cotton shirt under a camel blazer with stone chinos.'
      },
      {
        id: 'sky-blue',
        name: 'Sky Linen',
        hex: '#9BB8CD',
        textColor: '#1A2834',
        step: 2,
        description: 'Sun-drenched Mediterranean horizon filtered through unbleached linen weave.',
        fabrics: ['Organic linen', 'Brushed Oxford cloth', 'Lightweight wool duster'],
        season: 'Spring / Summer',
        complementary: { name: 'Toasted Hazelnut', hex: '#A88260', role: 'Secondary (30%)' },
        analogous: [
          { name: 'Celadon Frost', hex: '#A7C7AD', role: 'Accent (15%)' },
          { name: 'Midnight Navy', hex: '#1C2938', role: 'Anchor (25%)' }
        ],
        monochromatic: [
          { name: 'Glacial White', hex: '#EDF4F8', role: 'Base (50%)' },
          { name: 'Deep Cobalt', hex: '#264E70', role: 'Accent (20%)' }
        ],
        outfitFormula: 'An unlined sky blue linen jacket paired with ecru pleated trousers and woven leather loafers.'
      },
      {
        id: 'denim',
        name: 'Washed Denim',
        hex: '#5B7F9C',
        textColor: '#FFFFFF',
        step: 3,
        description: 'The storied patina of vintage selvedge denim softened by decades of sun and salt water.',
        fabrics: ['Rigid Japanese denim', 'Cotton twill overshirt', 'Knit polo'],
        season: 'All Seasons',
        complementary: { name: 'Warm Amber', hex: '#D98938', role: 'Accent (10%)' },
        analogous: [
          { name: 'Powder Frost', hex: '#D2DFE8', role: 'Highlight (25%)' },
          { name: 'Midnight Navy', hex: '#1C2938', role: 'Anchor (40%)' }
        ],
        monochromatic: [
          { name: 'Chambray Veil', hex: '#AEC6DA', role: 'Base (40%)' },
          { name: 'Dark Indigo', hex: '#22384B', role: 'Structure (40%)' }
        ],
        outfitFormula: 'A structured denim chore jacket over an off-white heavyweight tee with olive chinos.'
      },
      {
        id: 'aegean',
        name: 'Aegean Cobalt',
        hex: '#315F86',
        textColor: '#FFFFFF',
        step: 4,
        description: 'The intense, magnetic cerulean of deep island waters. Dynamic and striking.',
        fabrics: ['Worsted wool blazer', 'Silk knit tie', 'Fine cashmere sweater'],
        season: 'Trans-Seasonal',
        complementary: { name: 'Burnt Ochre', hex: '#C25A24', role: 'Accent (15%)' },
        analogous: [
          { name: 'Emerald Grove', hex: '#2B6341', role: 'Accent (15%)' },
          { name: 'Midnight Navy', hex: '#1B2631', role: 'Secondary (35%)' }
        ],
        monochromatic: [
          { name: 'Sky Wash', hex: '#9BB8CD', role: 'Highlight (20%)' },
          { name: 'Night Sea', hex: '#173046', role: 'Anchor (50%)' }
        ],
        outfitFormula: 'An Aegean blue fine merino crewneck under a dark roast espresso trench with ecru trousers.'
      },
      {
        id: 'navy',
        name: 'Midnight Navy',
        hex: '#1B2631',
        textColor: '#FFFFFF',
        step: 5,
        description: 'The undisputed cornerstone of sartorial elegance. Darker than dusk, softer than black.',
        fabrics: ['Super 130s wool', 'Double-breasted peacoat', 'Heavy barathea'],
        season: 'Permanent & Executive',
        complementary: { name: 'Linen Ecru', hex: '#F3EDE2', role: 'Base (60%)' },
        analogous: [
          { name: 'Dark Roast Espresso', hex: '#49382C', role: 'Secondary (25%)' },
          { name: 'Slate Grey', hex: '#5D6D7E', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Powder Frost', hex: '#D2DFE8', role: 'Highlight (15%)' },
          { name: 'True Navy', hex: '#2C3E50', role: 'Secondary (35%)' }
        ],
        outfitFormula: 'A tailored double-breasted navy blazer with ecru poplin shirt, grey flannel slacks and oxblood loafers.'
      }
    ]
  },

  {
    id: 'reds',
    name: 'Reds',
    volume: 'Vol. III',
    epithet: 'The Crimson & Rose Ledger',
    editorialQuote: 'Red in the Anvaya universe avoids loud neon, finding quiet confidence in antique rose, terracotta and aged wine.',
    shades: [
      {
        id: 'blush',
        name: 'Blush Primrose',
        hex: '#EED6D0',
        textColor: '#3A2724',
        step: 1,
        description: 'The delicate flush of wild garden roses in early dawn. Gentle, powdery and warm.',
        fabrics: ['Silk chiffon', 'Brushed cashmere', 'Fine poplin'],
        season: 'Spring / Summer',
        complementary: { name: 'Muted Sage', hex: '#D2DCD2', role: 'Secondary (40%)' },
        analogous: [
          { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (45%)' },
          { name: 'Dusty Rose', hex: '#C2847A', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Rose Alabaster', hex: '#F8EEEC', role: 'Base (55%)' },
          { name: 'Aged Burgundy', hex: '#632522', role: 'Accent (10%)' }
        ],
        outfitFormula: 'A relaxed blush silk blouse tucked into high-waist pleated taupe trousers.'
      },
      {
        id: 'rose-dust',
        name: 'Dusty Rose',
        hex: '#C2847A',
        textColor: '#FFFFFF',
        step: 2,
        description: 'Sun-faded terracotta brick and dried rose petals. Nostalgic, romantic and grounded.',
        fabrics: ['Linen-cotton twill', 'Merino wool knitwear', 'Suede accessories'],
        season: 'Trans-Seasonal',
        complementary: { name: 'Pale Celadon', hex: '#A7C7AD', role: 'Secondary (30%)' },
        analogous: [
          { name: 'Warm Terracotta', hex: '#B8654A', role: 'Accent (20%)' },
          { name: 'Muted Taupe', hex: '#B7A58D', role: 'Base (40%)' }
        ],
        monochromatic: [
          { name: 'Blush Primrose', hex: '#EED6D0', role: 'Highlight (25%)' },
          { name: 'Crimson Velvet', hex: '#87322A', role: 'Structure (35%)' }
        ],
        outfitFormula: 'A dusty rose merino mockneck layered under an unlined camel wool trench.'
      },
      {
        id: 'terracotta-red',
        name: 'Warm Terracotta',
        hex: '#A74A38',
        textColor: '#FFFFFF',
        step: 3,
        description: 'Earthy Tuscan earthenware warmed by Mediterranean afternoon light.',
        fabrics: ['Brushed moleskin', 'Heavy canvas', 'Wool flannel'],
        season: 'Autumn / Winter',
        complementary: { name: 'Herbaceous Moss', hex: '#6A8A66', role: 'Accent (15%)' },
        analogous: [
          { name: 'Burnt Ochre', hex: '#C25A24', role: 'Secondary (25%)' },
          { name: 'Chocolate Roast', hex: '#593D2F', role: 'Anchor (35%)' }
        ],
        monochromatic: [
          { name: 'Dusty Rose', hex: '#C2847A', role: 'Highlight (30%)' },
          { name: 'Deep Oxblood', hex: '#4E1917', role: 'Anchor (40%)' }
        ],
        outfitFormula: 'A tailored terracotta overshirt over an ivory tee with dark espresso trousers.'
      },
      {
        id: 'crimson',
        name: 'Crimson Velvet',
        hex: '#7A221E',
        textColor: '#FFFFFF',
        step: 4,
        description: 'Deep, dramatic red with cool blue undertones. Evoking historic opera houses and vintage tapestries.',
        fabrics: ['Plush velvet', 'Heavy boiled wool', 'Silk grenadine'],
        season: 'Autumn / Winter',
        complementary: { name: 'Deep Emerald', hex: '#2B6341', role: 'Accent (10%)' },
        analogous: [
          { name: 'Aged Burgundy', hex: '#561918', role: 'Anchor (40%)' },
          { name: 'Dark Roast Espresso', hex: '#49382C', role: 'Secondary (30%)' }
        ],
        monochromatic: [
          { name: 'Rose Dust', hex: '#C2847A', role: 'Highlight (20%)' },
          { name: 'Oxblood Noir', hex: '#3B1010', role: 'Depth (50%)' }
        ],
        outfitFormula: 'A crimson grenadine silk tie or velvet smoking blazer paired with crisp white shirting and charcoal suiting.'
      },
      {
        id: 'burgundy',
        name: 'Aged Burgundy',
        hex: '#4E1917',
        textColor: '#FFFFFF',
        step: 5,
        description: 'The opulent, brooding depth of vintage Bordeaux wine. Aristocratic, brooding and commanding.',
        fabrics: ['Calfskin leather', 'Super 150s worsted wool', 'Heavy cashmere'],
        season: 'Winter & Formal',
        complementary: { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (55%)' },
        analogous: [
          { name: 'Midnight Navy', hex: '#1B2631', role: 'Secondary (30%)' },
          { name: 'Heritage Forest', hex: '#34483A', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Dusty Rose', hex: '#C2847A', role: 'Highlight (15%)' },
          { name: 'Deep Oxblood', hex: '#351110', role: 'Anchor (60%)' }
        ],
        outfitFormula: 'Burnished burgundy leather penny loafers anchoring an ecru wool suit with forest green grenadine tie.'
      }
    ]
  },

  {
    id: 'oranges',
    name: 'Oranges',
    volume: 'Vol. IV',
    epithet: 'The Ochre & Terracotta Ledger',
    editorialQuote: 'Warmed by ancient earth and late summer sunsets, these shades bring comforting radiance to neutral silhouettes.',
    shades: [
      {
        id: 'apricot',
        name: 'Apricot Wash',
        hex: '#F2D3B4',
        textColor: '#3A2719',
        step: 1,
        description: 'Soft sunlight through linen curtains. Gentle, optimistic and flattering against all complexions.',
        fabrics: ['Raw silk', 'Lightweight voile', 'Fine cotton'],
        season: 'Spring / Summer',
        complementary: { name: 'Powder Frost', hex: '#D2DFE8', role: 'Secondary (35%)' },
        analogous: [
          { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (45%)' },
          { name: 'Warm Amber', hex: '#D89146', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Ivory Primrose', hex: '#FAF1E6', role: 'Base (50%)' },
          { name: 'Burnt Ochre', hex: '#B85822', role: 'Structure (30%)' }
        ],
        outfitFormula: 'An apricot silk camp collar shirt worn open over an ecru tank with linen trousers.'
      },
      {
        id: 'amber',
        name: 'Warm Amber',
        hex: '#D89146',
        textColor: '#FFFFFF',
        step: 2,
        description: 'Fossilized pine resin glowing in candlelight. Rich, radiant and deeply inviting.',
        fabrics: ['Fine gauge merino', 'Suede leather', 'Brushed flannel'],
        season: 'Autumn / Transitional',
        complementary: { name: 'Aegean Cobalt', hex: '#315F86', role: 'Accent (15%)' },
        analogous: [
          { name: 'Tuscan Gold', hex: '#D1A338', role: 'Highlight (25%)' },
          { name: 'Burnt Ochre', hex: '#B85822', role: 'Anchor (35%)' }
        ],
        monochromatic: [
          { name: 'Apricot Wash', hex: '#F2D3B4', role: 'Highlight (25%)' },
          { name: 'Deep Sienna', hex: '#632B0F', role: 'Anchor (40%)' }
        ],
        outfitFormula: 'An amber knit crewneck under a tailored navy blazer with cream flannel slacks.'
      },
      {
        id: 'burnt-ochre',
        name: 'Burnt Ochre',
        hex: '#B85822',
        textColor: '#FFFFFF',
        step: 3,
        description: 'Natural earth pigment baked by fierce sun. Robust, tactile and unmistakably autumn.',
        fabrics: ['Heavy canvas', 'Brushed corduroy', 'Chunky wool knit'],
        season: 'Autumn / Winter',
        complementary: { name: 'Midnight Navy', hex: '#1B2631', role: 'Anchor (40%)' },
        analogous: [
          { name: 'Warm Terracotta', hex: '#A74A38', role: 'Secondary (25%)' },
          { name: 'Dark Roast Espresso', hex: '#49382C', role: 'Anchor (35%)' }
        ],
        monochromatic: [
          { name: 'Apricot Wash', hex: '#F2D3B4', role: 'Highlight (20%)' },
          { name: 'Deep Sienna', hex: '#58240D', role: 'Structure (50%)' }
        ],
        outfitFormula: 'A burnt ochre corduroy overshirt over a charcoal mockneck with raw selvedge denim.'
      },
      {
        id: 'sienna',
        name: 'Deep Sienna',
        hex: '#6A2E12',
        textColor: '#FFFFFF',
        step: 4,
        description: 'The intense, ancient reddish-brown clay of historic Tuscan frescoes.',
        fabrics: ['Oilskin canvas', 'Heavy shearling', 'Full-grain leather'],
        season: 'Autumn / Winter',
        complementary: { name: 'Muted Sage', hex: '#D2DCD2', role: 'Secondary (35%)' },
        analogous: [
          { name: 'Chocolate Roast', hex: '#593D2F', role: 'Anchor (40%)' },
          { name: 'Warm Terracotta', hex: '#A74A38', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Warm Amber', hex: '#D89146', role: 'Highlight (20%)' },
          { name: 'Espresso Noir', hex: '#2F1307', role: 'Anchor (55%)' }
        ],
        outfitFormula: 'A sienna shearling leather aviator jacket worn over a cream cable-knit sweater.'
      }
    ]
  },

  {
    id: 'yellows',
    name: 'Yellows',
    volume: 'Vol. V',
    epithet: 'The Saffron & Citron Ledger',
    editorialQuote: 'Far from synthetic yellows, these tones evoke rich churned butter, antique brass and sun-warmed Tuscan villas.',
    shades: [
      {
        id: 'buttercream',
        name: 'Buttercream Primrose',
        hex: '#F6ECC4',
        textColor: '#3A3215',
        step: 1,
        description: 'Soft, creamy and velvety as churned dairy. The gentlest warming tint for neutral wardrobes.',
        fabrics: ['Fine cashmere knit', 'Silk habotai', 'Brushed cotton'],
        season: 'Spring / Summer & Trans-Seasonal',
        complementary: { name: 'Midnight Navy', hex: '#1B2631', role: 'Anchor (45%)' },
        analogous: [
          { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (40%)' },
          { name: 'Tuscan Gold', hex: '#D1A338', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Ivory Frost', hex: '#FDFBF4', role: 'Base (50%)' },
          { name: 'Antique Brass', hex: '#9E7822', role: 'Accent (15%)' }
        ],
        outfitFormula: 'A buttercream cashmere knit tucked into high-waist charcoal trousers with leather loafers.'
      },
      {
        id: 'tuscan-gold',
        name: 'Tuscan Gold',
        hex: '#D1A338',
        textColor: '#292006',
        step: 2,
        description: 'The golden hour light bathing stone farmhouses in Val d’Orcia. Warm, luminous and regal.',
        fabrics: ['Heavy linen', 'Silk-wool blend', 'Knitted polo'],
        season: 'Summer / Autumn',
        complementary: { name: 'Midnight Navy', hex: '#1B2631', role: 'Anchor (40%)' },
        analogous: [
          { name: 'Warm Amber', hex: '#D89146', role: 'Accent (20%)' },
          { name: 'Olive Grove', hex: '#526649', role: 'Secondary (30%)' }
        ],
        monochromatic: [
          { name: 'Buttercream', hex: '#F6ECC4', role: 'Highlight (25%)' },
          { name: 'Raw Saffron', hex: '#6E4F0A', role: 'Anchor (40%)' }
        ],
        outfitFormula: 'A tailored Tuscan gold linen jacket paired with crisp white shirt and navy trousers.'
      },
      {
        id: 'mustard',
        name: 'Antique Brass',
        hex: '#9E7822',
        textColor: '#FFFFFF',
        step: 3,
        description: 'The weathered, muted patina of aged brass hardware on luxury vintage luggage.',
        fabrics: ['Moleskin jacket', 'Chunky wool knit', 'Cotton corduroy'],
        season: 'Autumn / Winter',
        complementary: { name: 'Aegean Cobalt', hex: '#315F86', role: 'Accent (20%)' },
        analogous: [
          { name: 'Burnt Ochre', hex: '#B85822', role: 'Accent (20%)' },
          { name: 'Chocolate Roast', hex: '#593D2F', role: 'Anchor (40%)' }
        ],
        monochromatic: [
          { name: 'Buttercream', hex: '#F6ECC4', role: 'Highlight (20%)' },
          { name: 'Dark Saffron', hex: '#573E09', role: 'Anchor (50%)' }
        ],
        outfitFormula: 'An antique brass corduroy overshirt over a charcoal merino mockneck and ecru chinos.'
      },
      {
        id: 'saffron',
        name: 'Raw Saffron',
        hex: '#6B4C0A',
        textColor: '#FFFFFF',
        step: 4,
        description: 'Deep, earthy golden-brown derived from precious dried spice threads.',
        fabrics: ['Heavy tweed', 'Brushed flannel', 'Calfskin leather'],
        season: 'Autumn / Winter',
        complementary: { name: 'Powder Frost', hex: '#D2DFE8', role: 'Highlight (20%)' },
        analogous: [
          { name: 'Dark Roast Espresso', hex: '#49382C', role: 'Anchor (40%)' },
          { name: 'Heritage Forest', hex: '#34483A', role: 'Secondary (30%)' }
        ],
        monochromatic: [
          { name: 'Tuscan Gold', hex: '#D1A338', role: 'Highlight (20%)' },
          { name: 'Blackened Gold', hex: '#3D2B05', role: 'Anchor (55%)' }
        ],
        outfitFormula: 'A raw saffron tweed overcoat over an ecru turtleneck with dark roast espresso trousers.'
      }
    ]
  },

  {
    id: 'purples',
    name: 'Purples',
    volume: 'Vol. VI',
    epithet: 'The Plum & Wisteria Ledger',
    editorialQuote: 'Reserved, enigmatic and subtly historic. Muted purples bring an unexpected poetic depth to tailoring.',
    shades: [
      {
        id: 'lavender',
        name: 'Pale Wisteria',
        hex: '#E0D4E5',
        textColor: '#2E2235',
        step: 1,
        description: 'The ethereal lilac-grey of trailing wisteria blooms in early spring mist.',
        fabrics: ['Silk georgette', 'Fine gauge cotton', 'Cashmere scarf'],
        season: 'Spring / Summer',
        complementary: { name: 'Muted Sage', hex: '#D2DCD2', role: 'Secondary (35%)' },
        analogous: [
          { name: 'Powder Frost', hex: '#D2DFE8', role: 'Accent (20%)' },
          { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (40%)' }
        ],
        monochromatic: [
          { name: 'Lilac Mist', hex: '#F2EDF5', role: 'Base (50%)' },
          { name: 'Vintage Plum', hex: '#58305F', role: 'Structure (30%)' }
        ],
        outfitFormula: 'A pale wisteria linen button-down paired with tailored bone trousers and tan loafers.'
      },
      {
        id: 'amethyst',
        name: 'Dusty Amethyst',
        hex: '#98759E',
        textColor: '#FFFFFF',
        step: 2,
        description: 'Muted violet gemstone tempered with cool slate-grey ash.',
        fabrics: ['Superfine merino', 'Silk-satin slip', 'Unstructured blazer'],
        season: 'Trans-Seasonal',
        complementary: { name: 'Olive Grove', hex: '#526649', role: 'Secondary (30%)' },
        analogous: [
          { name: 'Dusty Rose', hex: '#C2847A', role: 'Accent (15%)' },
          { name: 'Slate Grey', hex: '#5D6D7E', role: 'Anchor (35%)' }
        ],
        monochromatic: [
          { name: 'Pale Wisteria', hex: '#E0D4E5', role: 'Highlight (25%)' },
          { name: 'Royal Aubergine', hex: '#3E1C44', role: 'Anchor (40%)' }
        ],
        outfitFormula: 'A dusty amethyst silk knit worn under a charcoal suit with black leather dress boots.'
      },
      {
        id: 'plum',
        name: 'Vintage Plum',
        hex: '#5C2D62',
        textColor: '#FFFFFF',
        step: 3,
        description: 'The rich, velvet skin of autumn damsons. Intellectual, sensual and understated.',
        fabrics: ['Heavy velvet', 'Flannel wool', 'Cashmere-silk scarf'],
        season: 'Autumn / Winter',
        complementary: { name: 'Herbaceous Moss', hex: '#6A8A66', role: 'Accent (15%)' },
        analogous: [
          { name: 'Aged Burgundy', hex: '#4E1917', role: 'Secondary (30%)' },
          { name: 'Midnight Navy', hex: '#1B2631', role: 'Anchor (40%)' }
        ],
        monochromatic: [
          { name: 'Pale Wisteria', hex: '#E0D4E5', role: 'Highlight (15%)' },
          { name: 'Deep Cassis', hex: '#2A102D', role: 'Anchor (55%)' }
        ],
        outfitFormula: 'A vintage plum velvet evening jacket with ecru silk shirt and black tailored slacks.'
      },
      {
        id: 'aubergine',
        name: 'Deep Cassis',
        hex: '#311436',
        textColor: '#FFFFFF',
        step: 4,
        description: 'Blackened blackcurrant liqueur. Near-black with an enigmatic purple pulse.',
        fabrics: ['Heavy melton wool', 'Silk grenadine', 'Grained calf leather'],
        season: 'Winter & Evening',
        complementary: { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (50%)' },
        analogous: [
          { name: 'Midnight Navy', hex: '#1B2631', role: 'Secondary (35%)' },
          { name: 'Charcoal Noir', hex: '#1F2421', role: 'Anchor (35%)' }
        ],
        monochromatic: [
          { name: 'Dusty Amethyst', hex: '#98759E', role: 'Highlight (15%)' },
          { name: 'Midnight Cassis', hex: '#1F0B23', role: 'Anchor (60%)' }
        ],
        outfitFormula: 'A cassis cashmere overcoat worn over an ivory turtleneck with tailored charcoal trousers.'
      }
    ]
  },

  {
    id: 'browns',
    name: 'Browns & Earth',
    volume: 'Vol. VII',
    epithet: 'The Walnut & Espresso Ledger',
    editorialQuote: 'The timeless backbone of menswear and quiet luxury womenswear. Rich roast beans, aged timber and soft sand.',
    shades: [
      {
        id: 'warm-sand',
        name: 'Warm Sand',
        hex: '#DDD2C3',
        textColor: '#3A2E24',
        step: 1,
        description: 'Fine dune sands and sea-worn travertine stone. Light, serene and endlessly combinable.',
        fabrics: ['Unwashed raw linen', 'Fine gauge cotton', 'Suede loafers'],
        season: 'All Seasons',
        complementary: { name: 'Powder Frost', hex: '#D2DFE8', role: 'Accent (15%)' },
        analogous: [
          { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (50%)' },
          { name: 'Muted Taupe', hex: '#B7A58D', role: 'Secondary (25%)' }
        ],
        monochromatic: [
          { name: 'Bleached Bone', hex: '#EFEAE2', role: 'Highlight (30%)' },
          { name: 'Walnut Brown', hex: '#76543C', role: 'Anchor (35%)' }
        ],
        outfitFormula: 'Warm sand single-pleat chinos with an ecru cotton polo and chocolate suede driving shoes.'
      },
      {
        id: 'taupe',
        name: 'Muted Taupe',
        hex: '#B7A58D',
        textColor: '#2E2218',
        step: 2,
        description: 'The consummate bridge between warm grey and soft fawn. Impeccably balanced and discreet.',
        fabrics: ['Double-faced cashmere', 'Worsted wool slacks', 'Silk-cotton knit'],
        season: 'All Seasons',
        complementary: { name: 'Sky Linen', hex: '#9BB8CD', role: 'Accent (15%)' },
        analogous: [
          { name: 'Heritage Forest', hex: '#34483A', role: 'Secondary (30%)' },
          { name: 'Walnut Brown', hex: '#76543C', role: 'Anchor (35%)' }
        ],
        monochromatic: [
          { name: 'Warm Sand', hex: '#DDD2C3', role: 'Highlight (25%)' },
          { name: 'Dark Roast Espresso', hex: '#49382C', role: 'Anchor (40%)' }
        ],
        outfitFormula: 'A muted taupe cashmere crewneck under a forest green overcoat with ivory flannel trousers.'
      },
      {
        id: 'walnut',
        name: 'Walnut Brown',
        hex: '#76543C',
        textColor: '#FFFFFF',
        step: 3,
        description: 'Polished mid-century woodgrain and roasted chestnuts. Warm, reassuring and distinguished.',
        fabrics: ['Harris tweed', 'Heavy corduroy', 'Fine leather goods'],
        season: 'Autumn / Winter',
        complementary: { name: 'Heritage Forest', hex: '#34483A', role: 'Secondary (35%)' },
        analogous: [
          { name: 'Warm Terracotta', hex: '#A74A38', role: 'Accent (15%)' },
          { name: 'Dark Roast Espresso', hex: '#49382C', role: 'Anchor (35%)' }
        ],
        monochromatic: [
          { name: 'Warm Sand', hex: '#DDD2C3', role: 'Highlight (20%)' },
          { name: 'Dark Roast Espresso', hex: '#38251A', role: 'Anchor (50%)' }
        ],
        outfitFormula: 'A tailored walnut wool sport coat over an ecru shirt with charcoal flannel slacks.'
      },
      {
        id: 'chocolate-fabric',
        name: 'Chocolate Roast',
        hex: '#593D2F',
        textColor: '#FFFFFF',
        step: 4,
        description: "The tactile tone of Anvaya's woven fabric navbar: tight wool weave, artisanal richness and understated luxury.",
        fabrics: ['Woven wool tweed', 'Suede field jackets', 'Heavy gauge cable knit'],
        season: 'Autumn / Winter & Signature',
        complementary: { name: 'Linen Ecru', hex: '#F3EDE2', role: 'Base (55%)' },
        analogous: [
          { name: 'Heritage Forest', hex: '#34483A', role: 'Secondary (30%)' },
          { name: 'Warm Amber', hex: '#D89146', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Muted Taupe', hex: '#B7A58D', role: 'Highlight (20%)' },
          { name: 'Espresso Noir', hex: '#2A1910', role: 'Anchor (50%)' }
        ],
        outfitFormula: 'A chocolate roast boiled wool overshirt over an ivory tee with relaxed olive chinos.'
      },
      {
        id: 'espresso',
        name: 'Dark Roast Espresso',
        hex: '#37261C',
        textColor: '#FFFFFF',
        step: 5,
        description: 'The rich, bitter darkness of freshly pressed dark roast espresso beans. Deep, velvety and sharp.',
        fabrics: ['Smooth calfskin', 'Cashmere-wool overcoating', 'Structured luggage leather'],
        season: 'Permanent & Executive',
        complementary: { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (60%)' },
        analogous: [
          { name: 'Midnight Navy', hex: '#1B2631', role: 'Secondary (30%)' },
          { name: 'Walnut Brown', hex: '#76543C', role: 'Accent (10%)' }
        ],
        monochromatic: [
          { name: 'Warm Sand', hex: '#DDD2C3', role: 'Highlight (15%)' },
          { name: 'Blackened Espresso', hex: '#1C130D', role: 'Anchor (65%)' }
        ],
        outfitFormula: 'An espresso cashmere-wool longcoat worn over a cream turtleneck with tailored stone slacks.'
      }
    ]
  },

  {
    id: 'creams',
    name: 'Whites & Creams',
    volume: 'Vol. VIII',
    epithet: 'The Alabaster & Ecru Ledger',
    editorialQuote: 'The foundational canvas of Anvaya. Not cold sterile starkness, but warm, unbleached, tactile fiber purity.',
    shades: [
      {
        id: 'alabaster',
        name: 'Pure Alabaster',
        hex: '#FAF9F6',
        textColor: '#2E261F',
        step: 1,
        description: 'Fine uncarved gypsum stone. A pristine white with just enough warmth to avoid hospital glare.',
        fabrics: ['Egyptian cotton', 'Silk crepe de chine', 'Crisp poplin'],
        season: 'Permanent Canvas',
        complementary: { name: 'Midnight Navy', hex: '#1B2631', role: 'Anchor (50%)' },
        analogous: [
          { name: 'Warm Cream', hex: '#FAF8F3', role: 'Secondary (35%)' },
          { name: 'Powder Frost', hex: '#D2DFE8', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Warm Sand', hex: '#DDD2C3', role: 'Structure (30%)' },
          { name: 'Dark Roast Espresso', hex: '#37261C', role: 'Anchor (40%)' }
        ],
        outfitFormula: 'A tailored alabaster poplin shirt with a spread collar anchoring any dark suit.'
      },
      {
        id: 'warm-cream',
        name: 'Warm Cream',
        hex: '#FAF8F3',
        textColor: '#2E261F',
        step: 2,
        description: "Anvaya's main page surface tone: calm, soothing and easy on the eyes. The warmth of fine cream paper.",
        fabrics: ['Cashmere knitwear', 'Wool-silk suiting', 'Pre-washed cotton'],
        season: 'All Seasons',
        complementary: { name: 'Heritage Forest', hex: '#34483A', role: 'Anchor (30%)' },
        analogous: [
          { name: 'Linen Beige', hex: '#F3EDE2', role: 'Base (50%)' },
          { name: 'Walnut Brown', hex: '#76543C', role: 'Accent (20%)' }
        ],
        monochromatic: [
          { name: 'Pure Alabaster', hex: '#FAF9F6', role: 'Highlight (20%)' },
          { name: 'Raw Ecru', hex: '#DCD3C5', role: 'Structure (40%)' }
        ],
        outfitFormula: 'A heavy cable-knit cream cashmere sweater paired with pleated linen beige trousers.'
      },
      {
        id: 'linen-beige',
        name: 'Linen Beige',
        hex: '#F3EDE2',
        textColor: '#2E261F',
        step: 3,
        description: 'Natural unbleached flax fibers after morning field harvest. The quintessential quiet luxury neutral.',
        fabrics: ['Heavyweight raw linen', 'Belgian flax sheeting', 'Cotton gabardine'],
        season: 'All Seasons',
        complementary: { name: 'Dark Roast Espresso', hex: '#37261C', role: 'Anchor (35%)' },
        analogous: [
          { name: 'Heritage Forest', hex: '#34483A', role: 'Secondary (25%)' },
          { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (40%)' }
        ],
        monochromatic: [
          { name: 'Pure Alabaster', hex: '#FAF9F6', role: 'Highlight (20%)' },
          { name: 'Muted Taupe', hex: '#B7A58D', role: 'Structure (40%)' }
        ],
        outfitFormula: 'An unstructured linen beige summer suit worn with open-collar white poplin shirt.'
      },
      {
        id: 'raw-ecru',
        name: 'Raw Ecru',
        hex: '#E3D8C8',
        textColor: '#2E261F',
        step: 4,
        description: 'Unbleached calico and wild silk cocoon threads. Earthy, textured and tactile.',
        fabrics: ['Calico canvas', 'Knitted boucle', 'Drill trousers'],
        season: 'All Seasons',
        complementary: { name: 'Midnight Navy', hex: '#1B2631', role: 'Anchor (40%)' },
        analogous: [
          { name: 'Olive Grove', hex: '#526649', role: 'Secondary (30%)' },
          { name: 'Chocolate Roast', hex: '#593D2F', role: 'Anchor (30%)' }
        ],
        monochromatic: [
          { name: 'Warm Cream', hex: '#FAF8F3', role: 'Highlight (25%)' },
          { name: 'Walnut Brown', hex: '#76543C', role: 'Structure (45%)' }
        ],
        outfitFormula: 'Raw ecru single-pleat chinos paired with a dark roast espresso overshirt and suede sneakers.'
      }
    ]
  },

  {
    id: 'greys',
    name: 'Greys & Blacks',
    volume: 'Vol. IX',
    epithet: 'The Charcoal & Slate Ledger',
    editorialQuote: 'Precision, geometry and architectural clarity. Shaded carbon and midnight noir that sharpen every silhouette.',
    shades: [
      {
        id: 'morning-mist',
        name: 'Morning Mist',
        hex: '#E2E5E8',
        textColor: '#273138',
        step: 1,
        description: 'Cool river fog over limestone bridges. Modern, minimalist and razor sharp.',
        fabrics: ['Fine gauge cotton', 'Tropical wool', 'Technical poplin'],
        season: 'Spring / Summer',
        complementary: { name: 'Warm Sand', hex: '#DDD2C3', role: 'Secondary (35%)' },
        analogous: [
          { name: 'Powder Frost', hex: '#D2DFE8', role: 'Accent (20%)' },
          { name: 'Slate Flannel', hex: '#788691', role: 'Structure (35%)' }
        ],
        monochromatic: [
          { name: 'Pure Alabaster', hex: '#FAF9F6', role: 'Highlight (30%)' },
          { name: 'Tailored Charcoal', hex: '#2C3E50', role: 'Anchor (45%)' }
        ],
        outfitFormula: 'A morning mist lightweight knit under an unstructured charcoal blazer.'
      },
      {
        id: 'slate',
        name: 'Slate Flannel',
        hex: '#788691',
        textColor: '#FFFFFF',
        step: 2,
        description: 'Classic British winter flannel wool. Balanced mid-grey that anchors all color harmonies.',
        fabrics: ['Worsted flannel', 'Boiled wool', 'Herringbone weave'],
        season: 'Autumn / Winter',
        complementary: { name: 'Warm Amber', hex: '#D89146', role: 'Accent (15%)' },
        analogous: [
          { name: 'Midnight Navy', hex: '#1B2631', role: 'Secondary (35%)' },
          { name: 'Heritage Forest', hex: '#34483A', role: 'Secondary (25%)' }
        ],
        monochromatic: [
          { name: 'Morning Mist', hex: '#E2E5E8', role: 'Highlight (25%)' },
          { name: 'Midnight Noir', hex: '#14181B', role: 'Anchor (45%)' }
        ],
        outfitFormula: 'Mid-grey flannel pleated trousers with a cashmere camel coat and dark brown oxford shoes.'
      },
      {
        id: 'charcoal',
        name: 'Tailored Charcoal',
        hex: '#2C3E50',
        textColor: '#FFFFFF',
        step: 3,
        description: 'Architectural grey-black. Authoritative, razor-sharp and immaculately tailored.',
        fabrics: ['Super 130s wool', 'Heavy overcoating', 'Cashmere mockneck'],
        season: 'Executive & Permanent',
        complementary: { name: 'Warm Cream', hex: '#FAF8F3', role: 'Highlight (40%)' },
        analogous: [
          { name: 'Midnight Navy', hex: '#1B2631', role: 'Secondary (30%)' },
          { name: 'Heritage Forest', hex: '#34483A', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Morning Mist', hex: '#E2E5E8', role: 'Highlight (20%)' },
          { name: 'Midnight Noir', hex: '#14181B', role: 'Anchor (50%)' }
        ],
        outfitFormula: 'A tailored charcoal two-piece suit with an Egyptian cotton white shirt and forest green grenadine tie.'
      },
      {
        id: 'noir',
        name: 'Midnight Noir',
        hex: '#14181B',
        textColor: '#FFFFFF',
        step: 4,
        description: 'Deepest matte black. Not lifeless void, but the ink of fine Japanese calligraphy.',
        fabrics: ['Barathea tuxedo wool', 'Heavy silk satin', 'Box calfskin leather'],
        season: 'Formal & Permanent',
        complementary: { name: 'Linen Ecru', hex: '#F3EDE2', role: 'Base (50%)' },
        analogous: [
          { name: 'Midnight Navy', hex: '#1B2631', role: 'Secondary (30%)' },
          { name: 'Dark Roast Espresso', hex: '#37261C', role: 'Accent (15%)' }
        ],
        monochromatic: [
          { name: 'Morning Mist', hex: '#E2E5E8', role: 'Highlight (15%)' },
          { name: 'Slate Flannel', hex: '#788691', role: 'Structure (35%)' }
        ],
        outfitFormula: 'A minimalist black tailored blazer over an off-white heavyweight tee and straight wool trousers.'
      }
    ]
  }
];

export function getFamilyById(id) {
  return COLOUR_FAMILIES.find((fam) => fam.id === id) || COLOUR_FAMILIES[0];
}

