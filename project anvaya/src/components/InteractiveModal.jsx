import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { 
  AESTHETICS, 
  COLOUR_THEORY_PALETTES, 
  getOutfitsForCollection 
} from '../data/fashionContent';

/**
 * Editorial Interactive Modal & Styling Studio
 * 
 * - Solid opaque background (#FAF8F3 and #F3EDE2) with clear layering.
 * - Backdrop blur affects ONLY the page behind the modal, never the modal itself.
 * - Men's vs Women's collection selector.
 * - Universal colour theory exploration.
 */
export default function InteractiveModal({ activeOption, onClose }) {
  const [collection, setCollection] = useState('women');
  const [selectedAesthetic, setSelectedAesthetic] = useState('All Aesthetics');
  const [selectedWardrobeItem, setSelectedWardrobeItem] = useState('coat');

  const isOutfitSpecimen = typeof activeOption === 'object' && activeOption !== null;
  const targetOutfit = isOutfitSpecimen ? activeOption : null;
  const isRecommend = activeOption === 'recommend';

  // Sync collection if inspecting an outfit with specific category
  useEffect(() => {
    if (targetOutfit && targetOutfit.category !== 'shared') {
      setCollection(targetOutfit.category);
    }
  }, [targetOutfit]);

  // Close on ESC key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (activeOption) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeOption, onClose]);

  if (!activeOption) return null;

  const visibleOutfits = getOutfitsForCollection(collection, selectedAesthetic);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
      {/* Backdrop: Blurs ONLY the page behind the modal */}
      <div 
        className="fixed inset-0 bg-[#49382C]/70 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog: 100% Solid, Opaque Warm Cream (#FAF8F3) Container */}
      <div 
        className="relative z-10 w-full max-w-4xl max-h-[90vh] rounded-sm border border-[#49382C]/20 shadow-2xl flex flex-col overflow-hidden animate-fade-in"
        style={{ backgroundColor: '#FAF8F3' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Top Masthead & Collection Switcher - Solid Linen Beige */}
        <div 
          className="flex flex-wrap items-center justify-between px-5 sm:px-8 py-3.5 sm:py-4 border-b border-[#49382C]/10 shrink-0 gap-3"
          style={{ backgroundColor: '#F3EDE2' }}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-forest"></span>
            <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.24em] text-forest font-semibold">
              {isOutfitSpecimen 
                ? `Look Specimen • ${targetOutfit.aesthetic}` 
                : isRecommend 
                  ? 'Recommend Styles Studio' 
                  : 'Style My Wardrobe Studio'}
            </span>
          </div>

          {/* User-Facing Collection Selector */}
          <div className="flex items-center gap-3">
            {!isOutfitSpecimen && (
              <div className="inline-flex items-center p-0.5 bg-[#FAF8F3] border border-[#49382C]/15 rounded-xs text-[11px] font-sans tracking-wider uppercase">
                <button
                  type="button"
                  onClick={() => setCollection('women')}
                  className={`px-3 py-1 rounded-xs transition-all duration-200 font-semibold ${
                    collection === 'women'
                      ? 'bg-forest text-[#FAF8F3] shadow-xs'
                      : 'text-espresso/70 hover:text-forest'
                  }`}
                >
                  Women's
                </button>
                <button
                  type="button"
                  onClick={() => setCollection('men')}
                  className={`px-3 py-1 rounded-xs transition-all duration-200 font-semibold ${
                    collection === 'men'
                      ? 'bg-forest text-[#FAF8F3] shadow-xs'
                      : 'text-espresso/70 hover:text-forest'
                  }`}
                >
                  Men's
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full border border-[#49382C]/20 flex items-center justify-center text-espresso/70 hover:text-forest hover:border-forest transition-colors duration-150"
              aria-label="Close dialog"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Studio Content - Solid Warm Cream Background */}
        <div 
          className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-6"
          style={{ backgroundColor: '#FAF8F3' }}
        >
          
          {/* =========================================================================
              EXPERIENCE 0: DETAILED SINGLE OUTFIT SPECIMEN VIEW
             ========================================================================= */}
          {isOutfitSpecimen && targetOutfit && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Visual */}
                <div className="md:col-span-6 relative aspect-[4/5] rounded-sm overflow-hidden bg-[#F3EDE2] border border-[#49382C]/15 shadow-sm">
                  <img 
                    src={targetOutfit.image} 
                    alt={targetOutfit.name}
                    className="w-full h-full object-cover object-center filter saturate-[0.93]"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 bg-[#FAF8F3]/95 backdrop-blur-xs text-[9px] uppercase tracking-[0.16em] text-forest font-semibold border border-forest/20 shadow-xs">
                      {targetOutfit.aesthetic}
                    </span>
                    {targetOutfit.category === 'shared' && (
                      <span className="px-2.5 py-0.5 bg-forest text-[#FAF8F3] text-[9px] uppercase tracking-[0.16em] font-semibold shadow-xs">
                        Shared / Unisex
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="md:col-span-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-forest font-semibold block mb-1">
                      Curated Look Specification
                    </span>
                    <h3 id="modal-title" className="font-serif text-2xl sm:text-3xl text-espresso font-light leading-snug">
                      {targetOutfit.name}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-espresso/80 font-light leading-relaxed">
                      {targetOutfit.stylingExplanation}
                    </p>
                  </div>

                  {/* Garments List */}
                  <div className="p-4 bg-[#F3EDE2] rounded-sm border border-[#49382C]/12 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-forest font-semibold block">
                      Garments Included in Formula
                    </span>
                    <ul className="text-xs text-espresso/85 space-y-1.5 list-disc list-inside">
                      {(targetOutfit.garments || ['Tailored Silhouette', 'Harmonised Layers', 'Curated Accents']).map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Chromatic Palette */}
                  <div className="p-4 bg-[#FAF8F3] rounded-sm border border-[#49382C]/15">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-forest font-semibold block mb-2">
                      Chromatic Balance Palette
                    </span>
                    <div className="flex gap-2">
                      {(targetOutfit.mainColours || [
                        { name: 'Dominant (60%)', hex: '#FAF8F3' },
                        { name: 'Structure (30%)', hex: '#788E9C' },
                        { name: 'Accent (10%)', hex: '#49382C' }
                      ]).map((c, i) => (
                        <div key={i} className="flex-1 p-2 bg-[#F3EDE2] rounded-xs border border-espresso/15 flex items-center gap-2">
                          <span 
                            className="w-4 h-4 rounded-full border border-black/20 shrink-0" 
                            style={{ backgroundColor: c.hex }} 
                          />
                          <div className="text-[10px] truncate">
                            <span className="font-medium text-espresso block truncate">{c.name}</span>
                            <span className="text-espresso/60 font-mono">{c.hex}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* Header Description (When browsing general studio) */}
          {!isOutfitSpecimen && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-forest font-medium">
                <span>{collection === 'women' ? "Women's Collection" : "Men's Collection"}</span>
                <span>•</span>
                <span>{isRecommend ? 'Aesthetics & Colour Discovery' : 'Owned Wardrobe Recombination'}</span>
              </div>
              <h3 id="modal-title" className="font-serif text-2xl sm:text-3xl text-espresso font-light mt-1">
                {isRecommend ? 'Recommend Styles Studio' : 'Style My Wardrobe Studio'}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-espresso/80 font-light leading-relaxed max-w-2xl">
                {isRecommend
                  ? "Explore curated fashion aesthetics, colour harmonies and outfit formulas filtered for your browsing preference. Shared unisex styling is seamlessly integrated."
                  : "Select clothing items you already own to explore complementary colour palettes, garment pairings and styling possibilities."}
              </p>
            </div>
          )}

          {/* =========================================================================
              EXPERIENCE 1: RECOMMEND STYLES
             ========================================================================= */}
          {isRecommend && (
            <div className="space-y-6">
              
              {/* Aesthetic Filter Chips */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-forest font-semibold">
                    Select Fashion Aesthetic
                  </span>
                  <span className="text-[10px] text-taupe-dark">
                    Showing {visibleOutfits.length} curated looks
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {AESTHETICS.map((aesthetic) => (
                    <button
                      key={aesthetic}
                      type="button"
                      onClick={() => setSelectedAesthetic(aesthetic)}
                      className={`px-3 py-1 text-xs rounded-xs border transition-all duration-150 ${
                        selectedAesthetic === aesthetic
                          ? 'bg-forest text-[#FAF8F3] border-forest shadow-xs font-semibold'
                          : 'bg-[#F3EDE2] border-[#49382C]/15 text-espresso/80 hover:border-forest/50 hover:text-forest'
                      }`}
                    >
                      {aesthetic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Outfits Grid (Solid cards with crisp contrast) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleOutfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    className="group border border-[#49382C]/15 rounded-sm overflow-hidden flex flex-col justify-between hover:border-forest/60 transition-all duration-200 shadow-sm"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#F3EDE2]">
                      <img
                        src={outfit.image}
                        alt={outfit.name}
                        className="w-full h-full object-cover object-center filter saturate-[0.93] group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-[#FAF8F3]/95 backdrop-blur-xs text-[9px] uppercase tracking-[0.16em] text-forest font-semibold border border-forest/20 shadow-xs">
                          {outfit.aesthetic}
                        </span>
                        {outfit.category === 'shared' && (
                          <span className="px-2 py-0.5 bg-forest text-[#FAF8F3] text-[9px] uppercase tracking-[0.16em] font-semibold shadow-xs">
                            Shared / Unisex
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-lg text-espresso font-normal leading-snug">
                          {outfit.name}
                        </h4>
                        <p className="mt-2 text-xs text-espresso/75 font-light leading-relaxed">
                          {outfit.stylingExplanation}
                        </p>
                      </div>

                      <div className="mt-3.5 pt-3 border-t border-[#49382C]/10 space-y-2">
                        {/* Garments Breakdown */}
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.18em] text-forest font-medium block mb-1">
                            Garments Included
                          </span>
                          <ul className="text-xs text-espresso/80 space-y-0.5 list-disc list-inside">
                            {outfit.garments.slice(0, 3).map((g, i) => (
                              <li key={i} className="truncate">{g}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Main Colours Swatches */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[9px] uppercase tracking-[0.18em] text-forest font-medium">
                            Palette
                          </span>
                          <div className="flex items-center gap-1.5">
                            {outfit.mainColours.map((c, i) => (
                              <span
                                key={i}
                                title={c.name}
                                className="w-3.5 h-3.5 rounded-full border border-espresso/20 shadow-xs"
                                style={{ backgroundColor: c.hex }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Universal Colour Theory Exploration Section */}
              <div className="mt-8 pt-6 border-t border-[#49382C]/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-forest font-semibold block">
                      Universal Colour Studio
                    </span>
                    <h4 className="font-serif text-xl text-espresso font-light">
                      Equilibrium & Ratio Principles
                    </h4>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-taupe-dark hidden sm:inline">
                    Universal to All Collections
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {COLOUR_THEORY_PALETTES.map((pal) => (
                    <div 
                      key={pal.id} 
                      className="p-3.5 border border-[#49382C]/15 rounded-sm shadow-xs"
                      style={{ backgroundColor: '#F3EDE2' }}
                    >
                      <span className="font-serif text-sm font-medium text-espresso block mb-1">
                        {pal.title}
                      </span>
                      <div className="flex gap-1.5 h-7 my-2">
                        {pal.swatches.map((s, idx) => (
                          <div
                            key={idx}
                            title={`${s.name} (${s.role})`}
                            className="flex-1 rounded-xs border border-espresso/15 shadow-2xs"
                            style={{ backgroundColor: s.hex }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-espresso/75 leading-relaxed font-light mt-2">
                        {pal.stylingRule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              EXPERIENCE 2: STYLE MY WARDROBE
             ========================================================================= */}
          {!isRecommend && (
            <div className="space-y-6">
              
              {/* Step 1: Select owned clothing */}
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-forest font-semibold block mb-2">
                  1. Select a Garment You Already Own ({collection === 'women' ? "Women's Staples" : "Men's Staples"})
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'coat', label: collection === 'women' ? 'Double-Faced Trench' : 'Camel Wool Overcoat', type: 'Outerwear' },
                    { id: 'knit', label: collection === 'women' ? 'Cashmere Crewneck' : 'Fine Merino Mockneck', type: 'Knitwear' },
                    { id: 'trouser', label: collection === 'women' ? 'Pleated Wide Trousers' : 'Tailored Chinos', type: 'Bottoms' },
                    { id: 'shoes', label: collection === 'women' ? 'Pointed Leather Mules' : 'Penny Loafers', type: 'Footwear' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedWardrobeItem(item.id)}
                      className={`p-3 text-left border rounded-sm transition-all duration-150 ${
                        selectedWardrobeItem === item.id
                          ? 'bg-[#FAF8F3] border-forest ring-1 ring-forest shadow-xs'
                          : 'bg-[#F3EDE2] border-[#49382C]/15 hover:border-forest/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider text-taupe-dark font-medium">{item.type}</span>
                        {selectedWardrobeItem === item.id && <Check className="w-3 h-3 text-forest" />}
                      </div>
                      <span className="font-serif text-sm text-espresso font-medium block mt-1">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Styling Combinations from Wardrobe */}
              <div 
                className="p-5 rounded-sm border border-[#49382C]/15 space-y-4"
                style={{ backgroundColor: '#F3EDE2' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-forest font-semibold">
                    Matching Recommendations for Selected Piece
                  </span>
                  <span className="text-[11px] font-mono text-forest font-medium">Harmony Score: 94%</span>
                </div>

                {/* Suggested Pairings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF8F3] rounded-sm border border-[#49382C]/15 shadow-xs">
                    <span className="text-[9px] uppercase tracking-wider text-forest font-semibold block">Formula A</span>
                    <span className="font-serif text-base text-espresso block mt-0.5">Tone-on-Tone Earth</span>
                    <p className="mt-1.5 text-espresso/75 text-[11px] leading-relaxed">
                      Pair with raw linen shirting and espresso accessories to create natural vertical height.
                    </p>
                  </div>

                  <div className="p-3 bg-[#FAF8F3] rounded-sm border border-[#49382C]/15 shadow-xs">
                    <span className="text-[9px] uppercase tracking-wider text-forest font-semibold block">Formula B</span>
                    <span className="font-serif text-base text-espresso block mt-0.5">High-Contrast Form</span>
                    <p className="mt-1.5 text-espresso/75 text-[11px] leading-relaxed">
                      Anchor with crisp off-white layers and dark tailored slacks for sharp boardroom polish.
                    </p>
                  </div>

                  <div className="p-3 bg-[#FAF8F3] rounded-sm border border-[#49382C]/15 shadow-xs">
                    <span className="text-[9px] uppercase tracking-wider text-forest font-semibold block">Formula C</span>
                    <span className="font-serif text-base text-espresso block mt-0.5">Botanical Olive Accent</span>
                    <p className="mt-1.5 text-espresso/75 text-[11px] leading-relaxed">
                      Introduce a subtle forest green knit or scarf to add warmth without disrupting cohesion.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-espresso/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-forest"></span>
                  <span><strong>Wardrobe Efficiency:</strong> 1 anchor garment unlocks at least 4 versatile day-to-evening outfits.</span>
                </div>
              </div>
            </div>
          )}

          {/* Development Status Disclaimer */}
          <div className="pt-2 text-center border-t border-[#49382C]/10">
            <p className="text-[11px] text-espresso/60 font-light italic">
              {isRecommend
                ? "This is an editorial preview of ANVAYA's upcoming recommendation engine. Full algorithm-assisted curation will be available in the next release."
                : "Digital closet scanning, colour harmony parsing and automatic recombination are currently in development."}
            </p>
          </div>
        </div>

        {/* Modal Bottom Bar - Solid Linen Beige */}
        <div 
          className="px-5 sm:px-8 py-3.5 border-t border-[#49382C]/10 flex items-center justify-between shrink-0"
          style={{ backgroundColor: '#F3EDE2' }}
        >
          <div className="text-[11px] text-espresso/70 font-light">
            Browsing as: <strong className="font-semibold text-forest uppercase">{collection}'s collection</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-forest text-[#FAF8F3] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-forest-hover transition-colors duration-200 rounded-xs shadow-xs"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
