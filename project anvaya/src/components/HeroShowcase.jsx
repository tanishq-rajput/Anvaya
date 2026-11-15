import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImagesByLibrary } from '../services/imageStorage';

// High-fashion editorial campaign photograph used when no custom images are uploaded
const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85';

/**
 * Editorial Campaign Hero Showcase
 * 
 * - Full-height spacious presentation establishing Anvaya's editorial fashion identity.
 * - Dynamic backdrop: Displays images uploaded to Developer Mode Hero Library (or campaign default).
 * - Slogan overlay: Bottom-left positioned, prominent serif typography, no full stop after expression.
 * - Intentional cropping (object-cover) preserving aspect ratios across screen sizes.
 */
export default function HeroShowcase() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Object URL tracking for proper lifecycle cleanup
  const urlsRef = useRef([]);

  const loadHeroImages = useCallback(async () => {
    try {
      setLoading(true);
      const allHeroImages = await getImagesByLibrary('hero');

      // Filter enabled images only, maintaining configured order
      const enabledImages = (allHeroImages || []).filter((img) => img.enabled !== false);

      // Revoke any previous URLs
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlsRef.current = [];

      // Create object URLs
      const loadedSlides = enabledImages.map((img) => {
        const url = URL.createObjectURL(img.blob);
        urlsRef.current.push(url);
        return {
          id: img.id,
          url,
          filename: img.filename,
          isPrimary: img.isPrimary,
          order: img.order
        };
      });

      setSlides(loadedSlides);

      // Start on primary image if designated, otherwise 0
      const primaryIdx = loadedSlides.findIndex((s) => s.isPrimary);
      setCurrentIndex(primaryIdx >= 0 ? primaryIdx : 0);
    } catch (err) {
      console.error('Failed to load hero showcase images from IndexedDB:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadHeroImages();

    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlsRef.current = [];
    };
  }, [loadHeroImages]);

  // Real-time synchronization with Developer Mode
  useEffect(() => {
    const handleAssetsUpdated = (e) => {
      if (!e.detail || e.detail.libraryId === 'hero' || e.detail.type?.includes('images')) {
        loadHeroImages();
      }
    };

    window.addEventListener('anvaya_assets_updated', handleAssetsUpdated);
    return () => window.removeEventListener('anvaya_assets_updated', handleAssetsUpdated);
  }, [loadHeroImages]);

  // Autoplay timer for multi-image slideshows
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000); // 8s gentle luxury crossfade interval

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="w-full animate-fade-in select-none">
      {/* Editorial Campaign Hero Canvas */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="group relative w-full h-[62vh] sm:h-[70vh] md:h-[78vh] min-h-[460px] sm:min-h-[540px] max-h-[760px] bg-linen rounded-sm sm:rounded-md border border-[#49382C]/15 overflow-hidden shadow-luxury"
      >
        {/* Loading shimmer fallback */}
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-linen text-espresso/40">
            <span className="font-serif italic text-xs tracking-wider animate-pulse">
              Curating visual campaign...
            </span>
          </div>
        ) : slides.length === 0 ? (
          /* Default Campaign Visual Backdrop */
          <div className="absolute inset-0">
            <img
              src={DEFAULT_HERO_IMAGE}
              alt="Anvaya Sartorial Campaign"
              className="w-full h-full object-cover object-center filter saturate-[0.96] contrast-[1.02]"
              loading="eager"
            />
          </div>
        ) : (
          /* Custom Uploaded Slides (Single or Crossfade Slideshow) */
          <>
            {slides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  aria-hidden={!isActive}
                >
                  <img
                    src={slide.url}
                    alt={slide.filename || `Showcase frame ${idx + 1}`}
                    className="w-full h-full object-cover object-center filter saturate-[0.96] contrast-[1.02]"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              );
            })}
          </>
        )}

        {/* Subtle Editorial Gradient Overlays (Ensures effortless text contrast without solid containers) */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Prominent Editorial Slogan Overlay (Bottom-Left) */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-14 lg:bottom-16 left-6 sm:left-10 md:left-14 lg:left-16 z-20 max-w-2xl pointer-events-none select-none">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-light text-[#FAF8F3] tracking-tight leading-[1.08] drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
            Discover your style <br />
            <span className="italic font-normal">Define your expression</span>
          </h1>
        </div>

        {/* Multi-Image Navigation Controls (Only active when > 1 custom slide is uploaded) */}
        {slides.length > 1 && (
          <>
            {/* Previous Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous campaign photograph"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cream/80 hover:bg-cream text-espresso shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-90 focus:opacity-100 focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next campaign photograph"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cream/80 hover:bg-cream text-espresso shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-90 focus:opacity-100 focus:outline-none"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Slide Index Badge (Top Right) */}
            <div className="absolute top-4 right-5 sm:right-6 z-20 pointer-events-none">
              <span className="text-[10px] font-mono tracking-widest text-cream bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-xs border border-cream/15">
                {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            {/* Bottom-Right Pagination Indicators (Positioned away from slogan) */}
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 z-20 flex items-center gap-1.5 p-1 rounded-full bg-black/30 backdrop-blur-xs">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Navigate to slide ${idx + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex
                    ? 'w-6 bg-cream shadow-xs'
                    : 'w-2 bg-cream/50 hover:bg-cream/80'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
