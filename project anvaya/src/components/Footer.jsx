import React from 'react';

/**
 * Editorial Footer
 * 
 * - Forest green (#34483A) background
 * - All text explicitly set to warm linen beige (#F3EDE2) with strong contrast
 * - Subtle organic root tendrils spreading along the margins (understated, non-intrusive)
 * - Statement in Cormorant Garamond: "Every colour tells a story. Every combination makes it yours."
 * - Supporting line: "An exploration of colour, clothing and personal style."
 * - Copyright: "© 2026 Anvaya"
 */
export default function Footer() {
  return (
    <footer 
      id="contact"
      className="relative mt-12 md:mt-20 py-12 md:py-16 text-[#F3EDE2] bg-[#34483A] overflow-hidden scroll-mt-16"
      style={{ backgroundColor: '#34483A', color: '#F3EDE2' }}
    >
      {/* Botanical Root Extension in Footer 
          - Synchronized coordinate space with BotanicalTree.jsx (max-w-7xl, viewBox 1200 320, preserveAspectRatio xMidYMin meet)
          - Roots begin at Y=0 from X: 584 to 616 (exact center 600), seamlessly continuing the trunk from above
          - Elevated opacity (0.26) in warm cream linen (#F3EDE2) on forest green for authentic botanical visibility
      */}
      <div 
        className="absolute inset-0 pointer-events-none select-none overflow-hidden flex justify-center" 
        aria-hidden="true"
      >
        <svg 
          className="w-full h-full max-w-7xl mx-auto opacity-[0.26] text-[#F3EDE2]" 
          viewBox="0 0 1200 320" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMin meet"
        >
          <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Trunk entry collar at Y = 0 (exact match with BotanicalTree trunk base: X 584 & 616) */}
            <path d="M584 0 L584 16" strokeWidth="5.0" />
            <path d="M616 0 L616 16" strokeWidth="4.2" />
            <path d="M594 0 L594 20" strokeWidth="2.0" strokeDasharray="12 4" />
            <path d="M606 0 L606 20" strokeWidth="1.8" strokeDasharray="10 4" />

            {/* --- Primary Left Lateral Roots --- */}
            <path 
              d="M584 16 C582 70 540 125 450 175 C360 225 240 255 100 280" 
              strokeWidth="3.4" 
            />
            <path 
              d="M450 175 C390 215 310 245 190 270 C130 280 70 290 10 295" 
              strokeWidth="2.2" 
            />
            <path 
              d="M540 125 C475 165 390 205 295 235 C200 260 110 280 20 290" 
              strokeWidth="1.8" 
            />
            <path 
              d="M360 225 C290 255 200 275 110 290" 
              strokeWidth="1.3" 
            />
            <path 
              d="M240 255 C180 275 110 290 40 300" 
              strokeWidth="0.9" 
            />
            <path 
              d="M495 150 C440 190 370 225 285 250" 
              strokeWidth="1.2" 
            />

            {/* --- Primary Right Lateral Roots --- */}
            <path 
              d="M616 16 C618 70 660 125 750 175 C840 225 960 255 1100 280" 
              strokeWidth="3.4" 
            />
            <path 
              d="M750 175 C810 215 890 245 1010 270 C1070 280 1130 290 1190 295" 
              strokeWidth="2.2" 
            />
            <path 
              d="M660 125 C725 165 810 205 905 235 C1000 260 1090 280 1180 290" 
              strokeWidth="1.8" 
            />
            <path 
              d="M840 225 C910 255 1000 275 1090 290" 
              strokeWidth="1.3" 
            />
            <path 
              d="M960 255 C1020 275 1090 290 1160 300" 
              strokeWidth="0.9" 
            />
            <path 
              d="M705 150 C760 190 830 225 915 250" 
              strokeWidth="1.2" 
            />

            {/* --- Central Deep Taproots --- */}
            <path 
              d="M594 16 C592 70 588 140 582 210 C578 260 572 295 565 320" 
              strokeWidth="2.2" 
            />
            <path 
              d="M606 16 C608 70 612 140 618 210 C622 260 628 295 635 320" 
              strokeWidth="2.2" 
            />
            <path 
              d="M600 20 C600 85 598 155 596 225 C594 270 590 300 585 320" 
              strokeWidth="1.4" 
              strokeDasharray="25 8" 
            />
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Main Editorial Statement in #F3EDE2 */}
        <p 
          className="font-serif text-xl sm:text-2xl md:text-3xl font-light leading-snug text-[#F3EDE2]"
          style={{ color: '#F3EDE2' }}
        >
          "Every colour tells a story. Every combination makes it yours."
        </p>

        {/* Supporting Line in soft beige */}
        <p 
          className="mt-2.5 text-xs sm:text-sm font-sans font-light tracking-wide text-[#F3EDE2]/85"
          style={{ color: '#F3EDE2', opacity: 0.85 }}
        >
          An exploration of colour, clothing and personal style.
        </p>

        {/* Subtle Divider */}
        <div 
          className="w-8 h-[1px] mx-auto my-6 bg-[#F3EDE2]/25"
          style={{ backgroundColor: '#F3EDE2', opacity: 0.25 }}
        />

        {/* Copyright and Contact Email */}
        <div 
          className="text-[11px] font-sans tracking-wider text-[#F3EDE2]/75 flex items-center justify-center flex-wrap gap-x-3 gap-y-1"
          style={{ color: '#F3EDE2', opacity: 0.75 }}
        >
          <span>© 2026 ANVAYA</span>
          <span className="opacity-50 select-none">|</span>
          <a 
            href="mailto:tanishqrajput.dev@gmail.com"
            className="hover:text-[#F3EDE2] hover:underline underline-offset-2 transition-colors cursor-pointer"
          >
            tanishqrajput.dev@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
