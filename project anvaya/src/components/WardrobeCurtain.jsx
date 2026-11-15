import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  Upload, 
  Sparkles, 
  Check, 
  Camera, 
  Layers, 
  ArrowRight,
  Info,
  Maximize2
} from 'lucide-react';

/**
 * Curated Dressing Room Garment Wardrobe
 * Beloved personal wardrobe staples hanging on the craftsman rack.
 */
const INITIAL_WARDROBE = {
  women: [
    {
      id: 'w-coat',
      name: 'Camel Double-Faced Wool Coat',
      category: 'outerwear',
      categoryLabel: 'Outerwear',
      fabric: 'Double-Faced Wool',
      dominantHex: '#C9BAA6',
      colorName: 'Warm Camel',
      hangerNote: 'Unstructured soft shoulder drape, trans-seasonal staple.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85',
      pairings: {
        palette: [
          { name: 'Warm Camel (Owned)', hex: '#C9BAA6', role: 'Anchor (50%)' },
          { name: 'Pale Mist Cream', hex: '#D5DDE0', role: 'Secondary (35%)' },
          { name: 'Heritage Forest', hex: '#34483A', role: 'Accent (15%)' }
        ],
        formulas: [
          {
            title: 'I. Morning Gallery & Studio',
            top: 'Ecru fine-gauge cashmere mockneck',
            bottom: 'Pleated wide-leg charcoal wool slacks',
            shoes: 'Burnished chocolate leather riding boots',
            acc: 'Forest green silk neck foulard & woven tote'
          },
          {
            title: 'II. Tailored Boardroom Contrast',
            top: 'Crisp alabaster cotton poplin button-down',
            bottom: 'Pressed cigarette trousers in slate grey',
            shoes: 'Pointed calfskin court mules',
            acc: 'Slim espresso belt with brushed silver buckle'
          },
          {
            title: 'III. Relaxed Autumn Weekend',
            top: 'Heavy ribbed oatmeal knit jumper',
            bottom: 'Relaxed raw ecru denim with rolled cuffs',
            shoes: 'Minimalist suede penny loafers',
            acc: 'Soft vintage wool scarf in sage'
          }
        ],
        textureAdvice: 'The brushed, velvety pile of camel wool contrasts beautifully against crisp shirting poplin or high-twist worsted flannel.'
      }
    },
    {
      id: 'w-knit',
      name: 'Cream Cable-Knit Cashmere',
      category: 'knitwear',
      categoryLabel: 'Knitwear',
      fabric: 'Hand-Finished Cashmere',
      dominantHex: '#FAF8F3',
      colorName: 'Warm Cream',
      hangerNote: 'Traditional fisherman cable stitch, heavy and tactile.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
      pairings: {
        palette: [
          { name: 'Warm Cream (Owned)', hex: '#FAF8F3', role: 'Base (55%)' },
          { name: 'Dark Roast Espresso', hex: '#49382C', role: 'Structure (35%)' },
          { name: 'Olive Grove', hex: '#526649', role: 'Accent (10%)' }
        ],
        formulas: [
          {
            title: 'I. Country Estate Ease',
            top: 'Unlined chocolate suede trench duster',
            bottom: 'A-line wool-blend midi skirt in espresso',
            shoes: 'Knee-high equestrian leather boots',
            acc: 'Thin bridle-leather waist belt'
          },
          {
            title: 'II. Minimalist Saturday Walk',
            top: 'Silk camisole base layer',
            bottom: 'Tailored relaxed trousers in warm sand',
            shoes: 'Soft leather slip-on smoking flats',
            acc: 'Woven raffia and leather basket bag'
          },
          {
            title: 'III. Fireside Evening Layer',
            top: 'Washed raw linen collared shirt underneath',
            bottom: 'Straight-leg heavy velvet trousers',
            shoes: 'Velvet Venetian slippers',
            acc: 'Antique silver signet ring'
          }
        ],
        textureAdvice: 'Because the chunky 3D cable knit provides rich volume, keep lower garments sleek and untextured.'
      }
    },
    {
      id: 'w-trouser',
      name: 'High-Waist Tailored Trousers in Slate',
      category: 'bottoms',
      categoryLabel: 'Trousers',
      fabric: 'Super 120s Worsted Wool',
      dominantHex: '#788691',
      colorName: 'Slate Flannel',
      hangerNote: 'Sharp pressed front crease, fluid drape when walking.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85',
      pairings: {
        palette: [
          { name: 'Slate Flannel (Owned)', hex: '#788691', role: 'Base (50%)' },
          { name: 'Pale Mist Silk', hex: '#D5DDE0', role: 'Secondary (35%)' },
          { name: 'Burnt Ochre', hex: '#B85822', role: 'Accent (15%)' }
        ],
        formulas: [
          {
            title: 'I. Modern Architectural Polish',
            top: 'Tailored four-button waistcoat in matching slate',
            bottom: 'The anchor high-waist trousers',
            shoes: 'Sharp pointed leather court pumps',
            acc: 'Structured espresso leather portfolio'
          },
          {
            title: 'II. Tactile Silk Juxtaposition',
            top: 'Fluid mulberry silk blouse in pale mist',
            bottom: 'The anchor high-waist trousers',
            shoes: 'Leather slingback kitten heels',
            acc: 'Delicate gold chain and leather watch'
          },
          {
            title: 'III. Weekend Oversized Tailoring',
            top: 'Boxy heavyweight cotton crewneck tee in ecru',
            bottom: 'The anchor high-waist trousers',
            shoes: 'Clean retro court trainers in chalk white',
            acc: 'Unstructured canvas tote bag'
          }
        ],
        textureAdvice: 'Worsted wool creates verticality; balance its crisp tailored lines with soft, fluid tops in silk or jersey.'
      }
    },
    {
      id: 'w-shoes',
      name: 'Burnished Horsebit Loafers',
      category: 'footwear',
      categoryLabel: 'Footwear',
      fabric: 'Full-Grain Box Calf',
      dominantHex: '#49382C',
      colorName: 'Espresso Brown',
      hangerNote: 'Aged brass horsebit hardware, Goodyear welted sole.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
      pairings: {
        palette: [
          { name: 'Espresso Brown (Owned)', hex: '#49382C', role: 'Anchor (30%)' },
          { name: 'Warm Cream', hex: '#FAF8F3', role: 'Base (50%)' },
          { name: 'Slate Blue', hex: '#788E9C', role: 'Accent (20%)' }
        ],
        formulas: [
          {
            title: 'I. Tailored Chino Daywear',
            top: 'Fine merino mockneck in slate blue',
            bottom: 'Single-pleat linen-cotton chinos in cream',
            shoes: 'The burnished horsebit loafers',
            acc: 'Matching espresso calfskin belt'
          },
          {
            title: 'II. Autumn Trench Silhouette',
            top: 'Unlined camel duster coat',
            bottom: 'Pressed dark charcoal wool trousers',
            shoes: 'The burnished horsebit loafers',
            acc: 'Silk neck scarf in botanical green'
          },
          {
            title: 'III. Relaxed Denim Polish',
            top: 'Oversized striped poplin button-down',
            bottom: 'Vintage straight-leg indigo denim',
            shoes: 'The burnished horsebit loafers',
            acc: 'Tortoiseshell frame spectacles'
          }
        ],
        textureAdvice: 'Polished calfskin anchors both textured wools and breezy summer linens with understated gravitas.'
      }
    }
  ],
  men: [
    {
      id: 'm-blazer',
      name: 'Italian Navy Double-Breasted Blazer',
      category: 'outerwear',
      categoryLabel: 'Outerwear',
      fabric: 'Hopsack Worsted Wool',
      dominantHex: '#1B2631',
      colorName: 'Midnight Navy',
      hangerNote: 'Unlined six-on-two buttoning with vintage horn buttons.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85',
      pairings: {
        palette: [
          { name: 'Midnight Navy (Owned)', hex: '#1B2631', role: 'Anchor (50%)' },
          { name: 'Pale Mist Ecru', hex: '#D5DDE0', role: 'Base (35%)' },
          { name: 'Heritage Forest', hex: '#34483A', role: 'Accent (15%)' }
        ],
        formulas: [
          {
            title: 'I. Classic Milanese Tailoring',
            top: 'Spread-collar Egyptian cotton shirt in light ecru',
            bottom: 'Mid-grey single-pleat wool trousers',
            shoes: 'Burnished oxblood horsebit loafers',
            acc: 'Forest green silk grenadine necktie'
          },
          {
            title: 'II. Sartorial Casual Layer',
            top: 'Fine-gauge merino turtleneck in warm camel',
            bottom: 'Pressed stone chinos or tailored denim',
            shoes: 'Dark brown suede penny loafers',
            acc: 'Linen pocket square in ivory'
          },
          {
            title: 'III. Evening Executive Composure',
            top: 'White poplin shirt with mother-of-pearl buttons',
            bottom: 'Charcoal flannel trousers with 2-inch cuff',
            shoes: 'Black calfskin oxford dress shoes',
            acc: 'Silver tie bar & vintage leather watch'
          }
        ],
        textureAdvice: 'Hopsack weave has a breathable open texture; complement with crisp poplin shirting or matte grenadine silk.'
      }
    },
    {
      id: 'm-overshirt',
      name: 'Boiled Wool Utility Overshirt in Espresso',
      category: 'outerwear',
      categoryLabel: 'Outerwear / Knit',
      fabric: 'Boiled Shetland Wool',
      dominantHex: '#37261C',
      colorName: 'Dark Roast Espresso',
      hangerNote: 'Two flap chest pockets, horn buttons, weather-resistant.',
      image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=85',
      pairings: {
        palette: [
          { name: 'Dark Roast Espresso (Owned)', hex: '#37261C', role: 'Anchor (45%)' },
          { name: 'Pale Mist Cream', hex: '#D5DDE0', role: 'Base (40%)' },
          { name: 'Olive Grove', hex: '#526649', role: 'Accent (15%)' }
        ],
        formulas: [
          {
            title: 'I. Field & Studio Utility',
            top: 'Heavyweight cotton crewneck tee in ivory',
            bottom: 'Relaxed garment-dyed olive chinos',
            shoes: 'Minimalist leather derby shoes or field boots',
            acc: 'Canvas field watch with leather strap'
          },
          {
            title: 'II. Structured Saturday Casual',
            top: 'Washed indigo chambray button-down shirt',
            bottom: 'Heavy duck canvas carpenter trousers in stone',
            shoes: 'Suede chukka boots in snuff brown',
            acc: 'Waxed canvas shoulder bag'
          },
          {
            title: 'III. Cold Weather Layering',
            top: 'Waffle-knit thermal henley in ecru',
            bottom: '14oz rigid Japanese selvedge denim',
            shoes: 'Moc-toe oiled leather boots',
            acc: 'Ribbed wool beanie in moss green'
          }
        ],
        textureAdvice: 'The dense boiled wool texture naturally balances smooth combed cotton tees and heavy canvas trousers.'
      }
    },
    {
      id: 'm-flannel',
      name: 'Heavyweight Flannel Slacks in Charcoal',
      category: 'bottoms',
      categoryLabel: 'Trousers',
      fabric: 'Fox Brothers Flannel Wool',
      dominantHex: '#2C3E50',
      colorName: 'Tailored Charcoal',
      hangerNote: 'Double forward pleats, side adjusters, gentle taper.',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=85',
      pairings: {
        palette: [
          { name: 'Tailored Charcoal (Owned)', hex: '#2C3E50', role: 'Anchor (50%)' },
          { name: 'Warm Camel', hex: '#C9BAA6', role: 'Secondary (35%)' },
          { name: 'Heritage Forest', hex: '#34483A', role: 'Accent (15%)' }
        ],
        formulas: [
          {
            title: 'I. Editorial Winter Overcoat',
            top: 'Camel double-breasted wool longcoat',
            bottom: 'The charcoal flannel trousers',
            shoes: 'Black calfskin cap-toe dress oxfords',
            acc: 'Fine cashmere scarf in forest green'
          },
          {
            title: 'II. Intellectual Knit Polish',
            top: 'Merino wool mockneck knit in ivory cream',
            bottom: 'The charcoal flannel trousers',
            shoes: 'Burnished dark brown leather derby shoes',
            acc: 'Pebbled leather briefcase'
          },
          {
            title: 'III. Creative Black-Tie Alternative',
            top: 'Black velvet evening smoking jacket & white shirt',
            bottom: 'The charcoal flannel trousers',
            shoes: 'Patent or polished black dress shoes',
            acc: 'Silk bow tie in charcoal noir'
          }
        ],
        textureAdvice: 'Flannel gently diffuses daylight; pair with camel overcoats or brushed merino knits for deep seasonal contrast.'
      }
    }
  ]
};

const CATEGORIES = [
  { id: 'all', label: 'All Pieces' },
  { id: 'outerwear', label: 'Coats & Jackets' },
  { id: 'knitwear', label: 'Knitwear & Tops' },
  { id: 'bottoms', label: 'Trousers' },
  { id: 'footwear', label: 'Footwear & Acc' }
];

/**
 * Floor-to-Ceiling Realistic Ripple-Fold Curtain Graphic
 * 
 * Recreates the attached reference:
 * - Ceiling-mounted extruded bronze track with gliders.
 * - Deep, continuous vertical pleats with natural irregular variations in wave width.
 * - Alternating highlights (rounded forward crests) and deep shadows (concave troughs).
 * - Thick, matte, premium blue-charcoal fabric (#27343E base, #131B21 shadow, #4E6171 highlight).
 * - Physically compresses and stacks accordion-style when gathered open.
 */
function FloorToCeilingCurtain({ isGathered, onPull, className = "" }) {
  // 14 irregular realistic wave pleats across the drape
  const pleats = [
    { id: 1, w: 58, highlight: 0.85, shadow: 0.9 },
    { id: 2, w: 52, highlight: 0.95, shadow: 1.0 },
    { id: 3, w: 64, highlight: 0.75, shadow: 0.85 },
    { id: 4, w: 49, highlight: 0.9, shadow: 0.95 },
    { id: 5, w: 56, highlight: 0.8, shadow: 0.9 },
    { id: 6, w: 61, highlight: 1.0, shadow: 1.0 },
    { id: 7, w: 53, highlight: 0.85, shadow: 0.85 },
    { id: 8, w: 58, highlight: 0.9, shadow: 0.95 },
    { id: 9, w: 50, highlight: 0.75, shadow: 0.8 },
    { id: 10, w: 63, highlight: 0.95, shadow: 1.0 },
    { id: 11, w: 55, highlight: 0.85, shadow: 0.9 },
    { id: 12, w: 52, highlight: 0.9, shadow: 0.95 },
    { id: 13, w: 60, highlight: 0.8, shadow: 0.85 },
    { id: 14, w: 54, highlight: 0.95, shadow: 1.0 },
  ];

  return (
    <div 
      onClick={onPull}
      className={`relative h-full select-none cursor-pointer group flex flex-col overflow-hidden transition-all duration-900 ease-[cubic-bezier(0.25,1,0.5,1)] ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onPull()}
      aria-label={isGathered ? "Draw curtain closed" : "Pull curtain open"}
    >
      {/* 1. CEILING-MOUNTED ARCHITECTURAL BRONZE TRACK */}
      <div className="curtain-ceiling-track h-6 sm:h-7 w-full shrink-0 relative z-30 flex items-center justify-between px-3">
        {/* Track Glider Slit */}
        <div className="w-full h-1 bg-[#0B0E11] rounded-full mx-1 relative flex items-center justify-between">
          {pleats.map((p, idx) => (
            <div 
              key={idx} 
              className="w-1.5 h-2 bg-[#8C9BA5] rounded-xs shadow-xs -mt-0.5" 
              title="Track Glider Runner"
            />
          ))}
        </div>
      </div>

      {/* 2. THE HEAVY BLUE-CHARCOAL FABRIC DRAPERY WITH DEEP VERTICAL WAVE PLEATS */}
      <div className="flex-1 w-full relative overflow-hidden curtain-charcoal-fabric shadow-2xl flex">
        
        {/* Render realistic continuous cylindrical pleats */}
        <div className="w-full h-full flex items-stretch">
          {pleats.map((pleat) => (
            <div
              key={pleat.id}
              className="flex-1 h-full relative"
              style={{
                background: `linear-gradient(
                  90deg, 
                  rgba(18, 25, 31, 0.98) 0%, 
                  rgba(28, 38, 46, 0.92) 18%, 
                  rgba(45, 59, 70, ${0.85 * pleat.highlight}) 42%, 
                  rgba(78, 97, 113, ${0.95 * pleat.highlight}) 52%, 
                  rgba(45, 59, 70, ${0.85 * pleat.highlight}) 62%, 
                  rgba(26, 36, 43, 0.94) 84%, 
                  rgba(18, 25, 31, 0.98) 100%
                )`
              }}
            >
              {/* Subtle vertical yarn/weave shadow lines */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.4) 4px)'
                }}
              />
              
              {/* Top heading fold gather */}
              <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

              {/* Bottom hem curve shadow */}
              <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Ambient Top Ceiling Shadow */}
        <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none z-10" />

        {/* Floor Drop Shadow under Bottom Hem */}
        <div className="absolute bottom-0 inset-x-0 h-4 bg-black/60 filter blur-xs pointer-events-none z-10" />

        {/* 3. TACTILE BRASS & LEATHER PULL WAND / TIE-BACK */}
        <div className="absolute left-3 sm:left-4 top-1/3 z-20 flex flex-col items-center pointer-events-none transition-transform duration-300 group-hover:scale-105">
          {/* Brass Ring */}
          <div className="w-5 h-5 rounded-full border-2 border-[#D5DDE0] bg-[#49382C] shadow-md flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D5DDE0]" />
          </div>

          {/* Hanging Cord */}
          <div className="w-0.5 h-14 bg-[#D5DDE0]/80 shadow-xs" />

          {/* Engraved Pale Mist Tag with Espresso Brown Text */}
          <div className="bg-[#D5DDE0] border border-[#49382C] px-3 py-2 rounded-xs shadow-xl text-center whitespace-nowrap mt-1">
            <span className="font-serif text-[11px] sm:text-xs text-[#49382C] font-semibold block uppercase tracking-[0.2em]">
              {isGathered ? "Draw Curtain" : "Pull Curtain Open"}
            </span>
            <span className="text-[8px] font-sans text-[#49382C]/80 uppercase tracking-widest block font-medium mt-0.5">
              {isGathered ? "Close Dressing Room" : "Enter Dressing Room"}
            </span>
          </div>
        </div>

        {/* Subtle Gathered Tie-Back Belt when open */}
        {isGathered && (
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-10 bg-[#49382C] border-y border-[#D5DDE0]/40 shadow-lg flex items-center justify-center z-20">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#D5DDE0]">
              Folded Drape
            </span>
          </div>
        )}

      </div>
    </div>
  );
}

/**
 * The Dressing Room Workspace Component
 * 
 * - Floor-to-ceiling blue-charcoal ripple-fold curtain hanging from ceiling track.
 * - Genuine visual depth: Background slate-blue wall with architectural skirting,
 *   midground wooden rack and dressing mirror, foreground clothes and dressing journal.
 * - Colour Hierarchy:
 *   - Slate Blue (#788E9C): Main background/wall.
 *   - Pale Mist (#D5DDE0): Secondary backgrounds, surfaces, panels, display areas.
 *   - Espresso Brown (#49382C): ALL primary typography, headings, labels and text!
 *   - Silver Blue (#A9B8C2): Subtle accents.
 *   - Deep Blue-Charcoal (#27343E): Heavy curtain fabric.
 */
export default function WardrobeCurtain({ isOpen, onToggle }) {
  const [collection, setCollection] = useState('women');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wardrobe, setWardrobe] = useState(INITIAL_WARDROBE);
  const [selectedItemId, setSelectedItemId] = useState('w-coat');
  const [activeFormulaIndex, setActiveFormulaIndex] = useState(0);

  // Sync selected item when switching collection
  useEffect(() => {
    const items = wardrobe[collection];
    const firstItem = items[0]?.id || 'w-coat';
    setSelectedItemId(firstItem);
    setActiveFormulaIndex(0);
  }, [collection]);

  // Lock body scroll when dressing room is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const currentItems = wardrobe[collection];
  const filteredItems = selectedCategory === 'all' 
    ? currentItems 
    : currentItems.filter((i) => i.category === selectedCategory);

  const activeItem = currentItems.find((i) => i.id === selectedItemId) || currentItems[0] || INITIAL_WARDROBE.women[0];

  // Handle user uploading their own piece
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const newGarment = {
        id: `custom-${Date.now()}`,
        name: fileName.length > 25 ? fileName.slice(0, 22) + '...' : fileName,
        category: selectedCategory === 'all' ? 'outerwear' : selectedCategory,
        categoryLabel: 'Personal Wardrobe',
        fabric: 'Uploaded Garment',
        dominantHex: '#3D4E5B',
        colorName: 'Personal Specimen',
        hangerNote: 'Custom garment added to your dressing rack.',
        image: URL.createObjectURL(file),
        pairings: {
          palette: [
            { name: 'Garment Tone (Uploaded)', hex: '#3D4E5B', role: 'Anchor (50%)' },
            { name: 'Pale Mist Cream', hex: '#D5DDE0', role: 'Base (35%)' },
            { name: 'Espresso Brown', hex: '#49382C', role: 'Accent (15%)' }
          ],
          formulas: [
            {
              title: 'I. Cohesive Minimalist Formula',
              top: 'Off-white fine gauge cashmere turtleneck',
              bottom: 'Tailored relaxed trousers in espresso brown',
              shoes: 'Burnished leather derby shoes or ankle boots',
              acc: 'Minimalist leather shoulder bag'
            },
            {
              title: 'II. Dynamic Contrast Balance',
              top: 'Crisp poplin button-down in pale mist',
              bottom: 'Dark pressed wool trousers in charcoal',
              shoes: 'Classic leather loafers with brass hardware',
              acc: 'Textured wool scarf in muted olive'
            },
            {
              title: 'III. Everyday Understated Ease',
              top: 'Heavyweight organic cotton crewneck tee',
              bottom: 'Straight-leg denim in vintage wash',
              shoes: 'Clean chalk-white leather court shoes',
              acc: 'Leather cardholder & brass watch'
            }
          ],
          textureAdvice: 'Combine this piece with contrasting weaves: smooth poplin against textured wool, or matte knitwear against subtle leather sheen.'
        }
      };

      setWardrobe((prev) => ({
        ...prev,
        [collection]: [newGarment, ...prev[collection]]
      }));
      setSelectedItemId(newGarment.id);
      setActiveFormulaIndex(0);
    }
  };

  return (
    <>
      {/* =========================================================================
          1. HOMEPAGE CURTAIN ENTRY: FLOOR-TO-CEILING REAL ROOM DIVIDER PREVIEW
          Hanging along the right edge of the homepage from its ceiling track
         ========================================================================= */}
      {!isOpen && (
        <aside
          onClick={onToggle}
          className="fixed right-0 top-0 bottom-0 z-40 w-12 sm:w-16 md:w-20 hover:w-24 sm:hover:w-28 transition-all duration-500 ease-out flex flex-col justify-between shadow-2xl cursor-pointer select-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onToggle()}
          aria-label="Pull floor-to-ceiling curtain to enter personal dressing room"
        >
          {/* Floor-to-Ceiling Curtain Drape */}
          <FloorToCeilingCurtain isGathered={false} onPull={onToggle} />
        </aside>
      )}


      {/* =========================================================================
          2. THE IMMERSIVE PERSONAL DRESSING ROOM WITH THE ACCORDION GATHER CURTAIN
         ========================================================================= */}
      <div 
        className={`fixed inset-0 z-50 flex transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        {/* The Entire Screen Dressing Room Container */}
        <div className="w-full h-full flex relative overflow-hidden bg-[#788E9C]">
          
          {/* =====================================================================
              A. THE DRESSING ROOM INTERIOR SPACE (Layers: Back, Mid, Fore)
             ===================================================================== */}
          <div className="flex-1 h-full flex flex-col dressing-room-wall relative overflow-y-auto">
            
            {/* Natural Window Daylight Beam from Upper-Left */}
            <div 
              className="absolute -top-20 -left-20 w-[550px] h-[550px] rounded-full pointer-events-none opacity-25"
              style={{
                background: 'radial-gradient(circle, rgba(255, 252, 240, 0.95) 0%, rgba(213, 221, 224, 0.45) 45%, transparent 75%)'
              }}
            />

            {/* Ceiling Picture Rail / Crown Moulding (Espresso Wood #49382C) */}
            <div className="w-full h-2.5 wood-espresso shadow-md shrink-0 relative z-20 border-b border-[#36281E]" />

            {/* ===================================================================
                ARCHITECTURAL HEADER: PALE MIST SURFACE WITH ESPRESSO BROWN TEXT
               =================================================================== */}
            <header className="relative z-30 px-6 sm:px-10 py-3.5 bg-[#D5DDE0] border-b-2 border-[#49382C] shadow-sm flex flex-wrap items-center justify-between gap-4 shrink-0">
              
              {/* Room Title & Vignette */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full wood-espresso text-[#D5DDE0] flex items-center justify-center font-serif text-sm font-semibold shadow-xs">
                  A
                </div>
                <div>
                  <h1 className="font-serif text-xl sm:text-2xl font-normal text-[#49382C] tracking-wide leading-none">
                    The Dressing Room
                  </h1>
                  <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#49382C]/80 mt-1 block font-medium">
                    Personal Styling & Wardrobe Sanctuary
                  </span>
                </div>
              </div>

              {/* Room Controls: Her Wardrobe / His Wardrobe + Draw Curtain Closed */}
              <div className="flex items-center gap-3">
                
                {/* Her/His Wardrobe Selector */}
                <div className="inline-flex p-0.5 rounded-xs border border-[#49382C] bg-[#C5CFD4] text-xs font-sans uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setCollection('women')}
                    className={`px-3 py-1 rounded-xs transition-all ${
                      collection === 'women'
                        ? 'bg-[#49382C] text-[#D5DDE0] font-semibold shadow-xs'
                        : 'text-[#49382C] hover:text-black font-medium'
                    }`}
                  >
                    Her Wardrobe
                  </button>
                  <button
                    type="button"
                    onClick={() => setCollection('men')}
                    className={`px-3 py-1 rounded-xs transition-all ${
                      collection === 'men'
                        ? 'bg-[#49382C] text-[#D5DDE0] font-semibold shadow-xs'
                        : 'text-[#49382C] hover:text-black font-medium'
                    }`}
                  >
                    His Wardrobe
                  </button>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onToggle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xs wood-espresso text-[#D5DDE0] text-xs font-sans uppercase tracking-[0.16em] hover:brightness-110 transition-all shadow-xs"
                  aria-label="Draw curtain closed and return to homepage"
                >
                  <span className="hidden sm:inline">Draw Curtain</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D5DDE0]" />
                </button>
              </div>
            </header>


            {/* ===================================================================
                THE PHYSICAL DRESSING ROOM SPACE (3 Distinct Dimensional Layers)
               =================================================================== */}
            <div className="flex-1 p-5 sm:p-8 md:p-10 space-y-10 relative z-10 flex flex-col justify-between">
              
              {/* --- BACKGROUND VIGNETTE: Framed Sketches & Sconce on Slate Blue Wall --- */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#49382C]/25">
                <div className="flex items-center gap-5">
                  {/* Framed Fashion Study I */}
                  <div className="w-12 h-16 rounded-xs border-2 border-[#49382C] bg-[#FAF8F3] p-1 shadow-md flex flex-col justify-between hidden sm:flex">
                    <div className="w-full h-10 bg-[#D5DDE0] rounded-2xs overflow-hidden flex items-center justify-center text-[7px] text-[#49382C] font-serif italic">
                      Étude I
                    </div>
                    <span className="text-[6px] uppercase tracking-widest text-[#49382C] text-center font-mono">Silhouette</span>
                  </div>

                  {/* Framed Fashion Study II */}
                  <div className="w-12 h-16 rounded-xs border-2 border-[#49382C] bg-[#FAF8F3] p-1 shadow-md flex flex-col justify-between hidden sm:flex">
                    <div className="w-full h-10 bg-[#D5DDE0] rounded-2xs overflow-hidden flex items-center justify-center text-[7px] text-[#49382C] font-serif italic">
                      Étude II
                    </div>
                    <span className="text-[6px] uppercase tracking-widest text-[#49382C] text-center font-mono">Drape</span>
                  </div>

                  {/* Pale Mist Room Note Plaque */}
                  <div className="bg-[#D5DDE0] border border-[#49382C]/40 p-3 rounded-xs shadow-xs text-[#49382C] max-w-md">
                    <span className="text-[9px] uppercase tracking-[0.24em] font-sans font-semibold text-[#49382C] block">
                      Interior Staging
                    </span>
                    <p className="text-xs font-light text-[#49382C] mt-0.5 leading-relaxed">
                      Select any garment hanging on the wooden rack to try it on in the mirror and reveal matching colour balances and styling formulas.
                    </p>
                  </div>
                </div>

                {/* Sconce & Ambient Light Indicator */}
                <div className="flex items-center gap-2 text-xs font-mono text-[#49382C] bg-[#D5DDE0] px-3 py-1.5 rounded-xs border border-[#49382C]/40 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#788E9C]" />
                  <span>Morning Light • Natural Reflection</span>
                </div>
              </div>


              {/* ===================================================================
                  MIDGROUND ELEMENT 1: THE WOODEN STANDING CLOTHING RACK
                 =================================================================== */}
              <div className="bg-[#D5DDE0] border-2 border-[#49382C] rounded-sm p-5 sm:p-6 shadow-xl relative furniture-floor-shadow">
                
                {/* Rack Rail Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#49382C]/25 text-[#49382C]">
                  <div>
                    <span className="text-[9px] font-sans uppercase tracking-[0.24em] text-[#49382C] font-semibold block">
                      The Standing Clothes Rack
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl text-[#49382C] font-normal">
                      Garments on the Rail
                    </h2>
                  </div>

                  {/* Category Filter Pegs */}
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3 py-1 text-xs rounded-xs transition-all ${
                            isActive
                              ? 'wood-espresso text-[#D5DDE0] font-semibold shadow-xs'
                              : 'bg-[#C5CFD4] text-[#49382C] hover:bg-[#B5C2C8] font-medium'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Solid Wood Rail with Cast Shadow */}
                <div className="relative mb-6">
                  <div className="h-2.5 w-full wood-espresso rounded-xs shadow-md border-b border-[#36281E]" />
                  <div className="absolute left-6 -top-1.5 w-2.5 h-6 bg-[#36281E] rounded-xs shadow-xs" />
                  <div className="absolute right-6 -top-1.5 w-2.5 h-6 bg-[#36281E] rounded-xs shadow-xs" />
                </div>

                {/* Garments Hanging on Wooden Hangers */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  
                  {/* Upload Hanger Hook ("Hang a New Piece") */}
                  <label className="group cursor-pointer rounded-xs border-2 border-dashed border-[#49382C]/50 hover:border-[#49382C] bg-[#C5CFD4]/60 p-3 flex flex-col justify-between items-center text-center transition-all duration-200 hover:bg-[#C5CFD4] min-h-[210px] shadow-xs">
                    {/* Wooden Hanger Arch */}
                    <div className="w-16 h-4 border-t-2 border-x-2 border-[#49382C] rounded-t-full relative flex justify-center -mt-1 mb-2">
                      <div className="w-2 h-2.5 rounded-full border-t border-l border-[#49382C] -mt-2.5" />
                    </div>

                    <div className="my-auto flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full wood-espresso text-[#D5DDE0] flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="font-serif text-sm text-[#49382C] font-semibold leading-tight">
                        Hang a Piece
                      </span>
                      <span className="text-[10px] text-[#49382C]/80 font-light mt-1">
                        Upload garment photo
                      </span>
                    </div>

                    <span className="text-[9px] uppercase tracking-wider text-[#D5DDE0] font-mono px-2 py-0.5 wood-espresso rounded-xs shadow-xs">
                      + Add to Rack
                    </span>

                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>


                  {/* Hanging Curated Garment Items */}
                  {filteredItems.map((item) => {
                    const isSelected = item.id === selectedItemId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedItemId(item.id);
                          setActiveFormulaIndex(0);
                        }}
                        className={`group cursor-pointer rounded-xs border transition-all duration-200 flex flex-col justify-between p-2.5 relative ${
                          isSelected
                            ? 'bg-[#FAF8F3] border-[#49382C] shadow-xl ring-2 ring-[#49382C] -translate-y-1.5'
                            : 'bg-[#C5CFD4]/50 border-[#49382C]/30 hover:bg-[#FAF8F3] hover:border-[#49382C] hover:shadow-md'
                        }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setSelectedItemId(item.id);
                            setActiveFormulaIndex(0);
                          }
                        }}
                        aria-label={`Select ${item.name} from rack`}
                      >
                        {/* Wooden Hanger Top Silhouette */}
                        <div className="w-14 mx-auto h-3 border-t-2 border-x-2 border-[#49382C] rounded-t-full relative flex justify-center -mt-1 mb-1.5">
                          <div className="w-1.5 h-2 rounded-full border-t border-l border-[#49382C] -mt-2" />
                        </div>

                        {/* Garment Image */}
                        <div className="relative aspect-[3/4] w-full rounded-2xs overflow-hidden bg-[#B5C2C8] border border-[#49382C]/20 shadow-inner">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover object-center filter saturate-[0.95] group-hover:scale-103 transition-transform duration-500" 
                          />
                          
                          {/* Active Mirror Tag */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 px-2 py-0.5 wood-espresso text-[#D5DDE0] text-[8px] font-mono uppercase tracking-wider rounded-2xs shadow-xs">
                              In Mirror
                            </div>
                          )}

                          {/* Color Dot */}
                          <div 
                            className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs" 
                            style={{ backgroundColor: item.dominantHex }}
                            title={item.colorName}
                          />
                        </div>

                        {/* Pale Mist Paper Tag with Espresso Brown Text */}
                        <div className="mt-2 text-left bg-[#D5DDE0]/70 p-1.5 rounded-xs border border-[#49382C]/15">
                          <span className="text-[8px] uppercase tracking-widest text-[#49382C] font-mono block font-semibold">
                            {item.categoryLabel}
                          </span>
                          <h3 className="font-serif text-xs font-normal text-[#49382C] leading-snug line-clamp-1 mt-0.5">
                            {item.name}
                          </h3>
                          <span className="text-[9px] text-[#49382C]/85 font-light block truncate mt-0.5">
                            {item.fabric}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>


              {/* ===================================================================
                  MIDGROUND ELEMENT 2 & 3: THE DRESSING MIRROR & FOLDED SHELF JOURNAL
                 =================================================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* --- LEFT: FULL-LENGTH WOODEN DRESSING MIRROR (5 Cols) --- */}
                <div className="lg:col-span-5 flex flex-col items-center furniture-floor-shadow">
                  
                  {/* Mirror Sconce Light */}
                  <div className="w-12 h-2.5 wood-espresso rounded-t-xs shadow-xs" />
                  <div className="w-1.5 h-2.5 bg-[#49382C]" />

                  {/* Arched Espresso Wood Mirror Frame */}
                  <div className="w-full rounded-t-full rounded-b-sm p-4 wood-espresso border-2 border-[#36281E] shadow-2xl relative">
                    
                    {/* Inner Bevel */}
                    <div className="rounded-t-full rounded-b-2xs p-1 border border-[#A9B8C2]/40 bg-[#36281E]">
                      
                      {/* Mirror Reflection Glass Surface */}
                      <div className="mirror-glass-surface rounded-t-full rounded-b-2xs aspect-[3/4.4] w-full relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                        
                        {/* Top Label */}
                        <div className="relative z-10 text-center pt-2">
                          <span className="text-[9px] font-sans uppercase tracking-[0.26em] text-[#49382C] font-semibold drop-shadow-xs">
                            Fitting Reflection
                          </span>
                        </div>

                        {/* Active Garment in Mirror */}
                        <div className="relative z-10 my-auto flex flex-col items-center">
                          <div className="w-48 sm:w-56 aspect-[3/3.8] rounded-xs overflow-hidden border-2 border-[#49382C] shadow-2xl bg-white/50">
                            <img 
                              src={activeItem.image} 
                              alt={activeItem.name}
                              className="w-full h-full object-cover object-center filter saturate-[0.96]"
                            />
                          </div>
                        </div>

                        {/* Handwritten Specimen Tag in Pale Mist with Espresso Brown Text */}
                        <div className="relative z-10 bg-[#D5DDE0] border-2 border-[#49382C] p-3 rounded-xs shadow-lg text-[#49382C]">
                          <div className="flex items-center justify-between border-b border-[#49382C]/25 pb-1 mb-1.5">
                            <span className="text-[8px] uppercase tracking-widest font-mono text-[#49382C] font-semibold">
                              Specimen in Mirror
                            </span>
                            <span className="text-[9px] font-mono text-[#49382C] font-semibold">{activeItem.dominantHex}</span>
                          </div>

                          <h3 className="font-serif text-base text-[#49382C] font-semibold leading-snug">
                            {activeItem.name}
                          </h3>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#49382C] font-normal">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0" 
                              style={{ backgroundColor: activeItem.dominantHex }} 
                            />
                            <span>{activeItem.colorName}</span>
                            <span>•</span>
                            <span>{activeItem.fabric}</span>
                          </div>

                          <p className="mt-2 text-[10px] text-[#49382C] italic font-serif leading-tight">
                            "{activeItem.hangerNote}"
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Floor Baseboard of Mirror */}
                    <div className="mt-2 h-3.5 w-full bg-[#36281E] rounded-xs shadow-xs" />
                  </div>

                  <span className="text-[10px] font-serif italic text-[#D5DDE0] mt-2.5 font-medium">
                    Arched standing mirror with beveled espresso wood frame
                  </span>
                </div>


                {/* --- RIGHT: FOLDED CLOTHES SHELF & STYLING JOURNAL (7 Cols) --- */}
                <div className="lg:col-span-7 space-y-6">

                  {/* 1. Folded Clothes Shelves: 60-30-10 Colour Proportion (Pale Mist Surface + Espresso Brown Text) */}
                  <div className="bg-[#D5DDE0] border-2 border-[#49382C] rounded-sm p-5 sm:p-6 shadow-xl text-[#49382C] furniture-floor-shadow">
                    
                    <div className="flex items-center justify-between border-b border-[#49382C]/25 pb-3 mb-4">
                      <div>
                        <span className="text-[9px] font-sans uppercase tracking-[0.24em] text-[#49382C] font-semibold block">
                          Dresser Shelf • Colour Balance
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl text-[#49382C] font-normal">
                          Matching Colour Equilibrium
                        </h3>
                      </div>

                      <span className="text-[10px] font-mono px-2.5 py-1 bg-[#FAF8F3] border border-[#49382C] rounded-xs text-[#49382C] font-semibold">
                        60-30-10 Standard
                      </span>
                    </div>

                    {/* Folded Knitwear Stacks */}
                    <div className="grid grid-cols-3 gap-3.5">
                      {activeItem.pairings.palette.map((swatch, idx) => (
                        <div 
                          key={idx}
                          className="bg-[#FAF8F3] border-2 border-[#49382C] p-3 rounded-xs shadow-md flex flex-col justify-between"
                        >
                          {/* Folded Fabric Stack Graphic */}
                          <div 
                            className="w-full h-14 rounded-2xs border border-black/20 shadow-inner relative overflow-hidden mb-2"
                            style={{ backgroundColor: swatch.hex }}
                          >
                            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/15" />
                            <div className="absolute top-2 left-2 text-[8px] font-mono px-1.5 py-0.5 rounded-2xs bg-black/40 text-white font-medium">
                              {swatch.role.split(' ')[0]}
                            </div>
                          </div>

                          <div>
                            <span className="font-serif text-xs text-[#49382C] font-semibold block truncate">
                              {swatch.name}
                            </span>
                            <span className="text-[10px] font-mono text-[#49382C] block mt-0.5 font-medium">
                              {swatch.hex}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-xs text-[#49382C] font-light leading-relaxed border-t border-[#49382C]/20 pt-3">
                      <strong className="font-semibold text-[#49382C]">Sartorial Texture Rule: </strong>{activeItem.pairings.textureAdvice}
                    </p>
                  </div>


                  {/* 2. Dressing Table Journal: 3 Curated Outfit Formulations (Pale Mist Pages + Espresso Brown Text) */}
                  <div className="bg-[#FAF8F3] border-2 border-[#49382C] rounded-sm p-5 sm:p-6 shadow-xl text-[#49382C] furniture-floor-shadow">
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#49382C]/25 pb-3 mb-4">
                      <div>
                        <span className="text-[9px] font-sans uppercase tracking-[0.24em] text-[#49382C] font-semibold block">
                          Styling Journal • Dressing Table
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl text-[#49382C] font-normal">
                          Three Complete Silhouettes
                        </h3>
                      </div>

                      {/* Formula Selector Tabs */}
                      <div className="inline-flex p-0.5 bg-[#D5DDE0] border border-[#49382C] rounded-xs text-xs font-sans">
                        {activeItem.pairings.formulas.map((f, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveFormulaIndex(i)}
                            className={`px-3 py-1 rounded-xs transition-all ${
                              activeFormulaIndex === i
                                ? 'wood-espresso text-[#D5DDE0] font-semibold shadow-xs'
                                : 'text-[#49382C] hover:text-black font-medium'
                            }`}
                          >
                            {i === 0 ? 'Look I' : i === 1 ? 'Look II' : 'Look III'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Formula Description */}
                    {(() => {
                      const formula = activeItem.pairings.formulas[activeFormulaIndex] || activeItem.pairings.formulas[0];
                      return (
                        <div className="space-y-4 animate-fade-in">
                          
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-base text-[#49382C] font-semibold">
                              {formula.title}
                            </span>
                            <span className="text-[10px] uppercase font-mono text-[#49382C]/80 font-medium">
                              Curated Formula
                            </span>
                          </div>

                          {/* Companion Garments Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            
                            <div className="p-3 bg-[#D5DDE0] border border-[#49382C]/30 rounded-xs">
                              <span className="text-[9px] uppercase tracking-wider text-[#49382C] font-semibold block mb-0.5">
                                Layering / Shirting
                              </span>
                              <span className="text-[#49382C] font-normal block leading-snug">
                                {formula.top}
                              </span>
                            </div>

                            <div className="p-3 bg-[#D5DDE0] border border-[#49382C]/30 rounded-xs">
                              <span className="text-[9px] uppercase tracking-wider text-[#49382C] font-semibold block mb-0.5">
                                Trousers / Skirt
                              </span>
                              <span className="text-[#49382C] font-normal block leading-snug">
                                {formula.bottom}
                              </span>
                            </div>

                            <div className="p-3 bg-[#D5DDE0] border border-[#49382C]/30 rounded-xs">
                              <span className="text-[9px] uppercase tracking-wider text-[#49382C] font-semibold block mb-0.5">
                                Footwear Pairing
                              </span>
                              <span className="text-[#49382C] font-normal block leading-snug">
                                {formula.shoes}
                              </span>
                            </div>

                            <div className="p-3 bg-[#D5DDE0] border border-[#49382C]/30 rounded-xs">
                              <span className="text-[9px] uppercase tracking-wider text-[#49382C] font-semibold block mb-0.5">
                                Personal Accents
                              </span>
                              <span className="text-[#49382C] font-normal block leading-snug">
                                {formula.acc}
                              </span>
                            </div>

                          </div>

                          {/* Journal Footnote */}
                          <div className="pt-2 border-t border-[#49382C]/20 flex items-center justify-between text-[11px] text-[#49382C]">
                            <span className="italic font-serif">
                              Inscribed in the Anvaya dressing room ledger
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#49382C] font-semibold">
                              Studio Specimen
                            </span>
                          </div>

                        </div>
                      );
                    })()}

                  </div>

                </div>

              </div>

            </div>


            {/* ===================================================================
                ARCHITECTURAL BASEBOARD & FLOOR (Espresso Skirting + Parquet)
               =================================================================== */}
            <div className="w-full shrink-0 relative z-20">
              {/* Espresso Skirting Board (#49382C) */}
              <div className="w-full h-5 wood-espresso border-t border-[#36281E] shadow-lg flex items-center justify-between px-6 sm:px-10">
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#D5DDE0]/60">
                  Dressing Room Baseboard
                </span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#D5DDE0]/60">
                  Room Boundary
                </span>
              </div>

              {/* Oak Parquet Floor Strip with Area Rug */}
              <div className="w-full h-8 dressing-room-floor shadow-inner flex items-center justify-center">
                <div className="w-4/5 h-4 bg-[#D5DDE0]/85 border-y border-[#49382C]/30 shadow-xs" title="Pale Mist Woven Area Rug" />
              </div>
            </div>

          </div>


          {/* =====================================================================
              B. THE REAL GATHERED BLUE-CHARCOAL CURTAIN (ON THE RIGHT ROOM EDGE)
              This is the physical curtain gathered into dense stacked folds against the wall!
             ===================================================================== */}
          <div 
            className="w-16 sm:w-20 md:w-28 lg:w-36 h-full shrink-0 border-l-2 border-[#12191F] shadow-2xl relative z-40 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            title="Gathered floor-to-ceiling curtain. Click to draw closed."
          >
            {/* The Gathered Pleats */}
            <FloorToCeilingCurtain isGathered={true} onPull={onToggle} />
          </div>

        </div>
      </div>
    </>
  );
}
