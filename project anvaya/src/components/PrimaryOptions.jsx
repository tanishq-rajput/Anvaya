import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Primary Styling Paths Component
 * 
 * - Option 01: Recommend Styles
 * - Option 02: Style My Wardrobe
 * - Proportioned so both cards fit comfortably side-by-side within a standard laptop viewport.
 * - Simple white arrow indicator on the visual, no unwanted black circles or decorative elements.
 * - Clean text actions with smooth hover transitions.
 */
export default function PrimaryOptions({ onSelectOption }) {
  return (
    <section id="explore-options" className="py-8 md:py-12 relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Compact Section Header */}
        <div className="text-center max-w-xl mx-auto mb-6 md:mb-8">
          <span className="text-[10px] md:text-[11px] font-sans uppercase tracking-[0.26em] text-forest font-semibold block mb-1.5">
            Two Styling Pathways
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-espresso font-light">
            Choose Your Experience
          </h2>
          <div className="w-8 h-[1px] bg-forest/40 mx-auto mt-2.5"></div>
        </div>

        {/* Two Viewport-Proportioned Editorial Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7 max-w-5xl mx-auto">
          
          {/* OPTION: RECOMMEND STYLES */}
          <div
            onClick={() => onSelectOption('recommend')}
            className="group relative cursor-pointer bg-cream rounded-sm border border-espresso/12 hover:border-forest/60 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden shadow-editorial hover:shadow-luxury-hover focus:outline-none focus:ring-1 focus:ring-forest/50"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectOption('recommend')}
            aria-label="Open Recommend Styles Experience"
          >
            {/* Top Index Strip */}
            <div className="px-5 py-2.5 flex items-center justify-between border-b border-espresso/6 bg-linen/50">
              <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-forest font-semibold">
                Discovery & Palettes
              </span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-taupe-dark">
                Style Studio
              </span>
            </div>

            {/* Landscape-Oriented Editorial Visual with White Arrow Indicator */}
            <div className="relative aspect-[16/7] w-full overflow-hidden bg-linen">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
                alt="Editorial model in layered autumn earth tones"
                className="w-full h-full object-cover object-center filter saturate-[0.95] group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/45 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300" />
              
              {/* Floating Pill Tag */}
              <div className="absolute bottom-2.5 left-4 py-0.5 px-2.5 bg-cream/95 backdrop-blur-xs border border-forest/20 text-[9px] tracking-[0.18em] uppercase text-forest font-semibold">
                Colour & Aesthetics
              </div>

              {/* Simple White Arrow Indicator */}
              <div className="absolute top-3 right-3 text-white transition-transform duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
            </div>

            {/* Content & Action Area */}
            <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-forest block mb-1 font-medium">
                  Style Exploration
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-espresso font-light group-hover:text-forest transition-colors duration-200">
                  Recommend Styles
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-espresso/80 font-light leading-relaxed">
                  Discover aesthetics, outfit inspirations, colour combinations and curated looks.
                </p>
              </div>

              {/* Action Trigger */}
              <div className="mt-4 pt-3.5 border-t border-espresso/8 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.2em] text-forest font-semibold group-hover:text-forest-hover transition-colors duration-200">
                  <span>Explore curated looks</span>
                  <span className="text-xs transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.16em] text-taupe-dark font-medium">
                  Homepage Lookbook
                </span>
              </div>
            </div>
          </div>

          {/* OPTION: STYLE MY WARDROBE */}
          <div
            onClick={() => onSelectOption('wardrobe')}
            className="group relative cursor-pointer bg-cream rounded-sm border border-espresso/12 hover:border-forest/60 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden shadow-editorial hover:shadow-luxury-hover focus:outline-none focus:ring-1 focus:ring-forest/50"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectOption('wardrobe')}
            aria-label="Open Style My Wardrobe Experience"
          >
            {/* Top Index Strip */}
            <div className="px-5 py-2.5 flex items-center justify-between border-b border-espresso/6 bg-linen/50">
              <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-forest font-semibold">
                Personal Sanctuary
              </span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-taupe-dark">
                The Dressing Room
              </span>
            </div>

            {/* Landscape-Oriented Editorial Visual with White Arrow Indicator */}
            <div className="relative aspect-[16/7] w-full overflow-hidden bg-linen">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85"
                alt="Curated wardrobe collection of natural linen and cashmere garments"
                className="w-full h-full object-cover object-center filter saturate-[0.92] group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/45 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300" />
              
              {/* Floating Pill Tag */}
              <div className="absolute bottom-2.5 left-4 py-0.5 px-2.5 bg-cream/95 backdrop-blur-xs border border-forest/20 text-[9px] tracking-[0.18em] uppercase text-forest font-semibold">
                Dressing Room
              </div>

              {/* Simple White Arrow Indicator */}
              <div className="absolute top-3 right-3 text-white transition-transform duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
            </div>

            {/* Content & Action Area */}
            <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-forest block mb-1 font-medium">
                  Wardrobe Architecture
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-espresso font-light group-hover:text-forest transition-colors duration-200">
                  Style My Wardrobe
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-espresso/80 font-light leading-relaxed">
                  Enter a cosy, personal dressing room to hang pieces you already own, explore matching colours in the mirror, and discover complete outfit harmonies.
                </p>
              </div>

              {/* Action Trigger */}
              <div className="mt-4 pt-3.5 border-t border-espresso/8 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.2em] text-forest font-semibold group-hover:text-forest-hover transition-colors duration-200">
                  <span>Enter dressing room</span>
                  <span className="text-xs transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.16em] text-taupe-dark font-medium">
                  Slate-Blue Curtain
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
