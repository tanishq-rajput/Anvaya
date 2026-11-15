import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getAllCategories, getImagesByLibrary } from '../services/imageStorage';
import { distributeEmptyStateMessages } from '../services/emptyStateMessages';

/**
 * CuratedRecommendations — Premium fashion-gallery outfit card presentation.
 *
 * Card design:
 * - Front face:
 *   Layer 1  Outer espresso/dark-brown border
 *   Layer 2  Substantial warm ivory/cream inner photo mat (padding around photograph)
 *   Layer 3  Inset photograph (object-contain, full image visible, no cropping)
 *   Below    Single editable title (defaults to '-Untitled-')
 *   Corner   Small circular Anvaya 'A' flip button (brown)
 *
 * - Reverse face:
 *   Top      Small photograph thumbnail + title side by side
 *   Body     Recessed/engraved editorial About panel
 *   Corner   Same circular Anvaya 'A' flip button (forest green)
 *
 * Images: ONLY explicitly uploaded photographs via Developer Mode.
 * Empty category → empty card state shown, no auto-generated or seed images.
 *
 * Layout: 2 columns on desktop (md:), 1 column on mobile.
 * Dimension: Fits within a typical ~900px desktop viewport without scrolling.
 */
export default function CuratedRecommendations() {
  const [categories, setCategories]         = useState([]);
  const [selectedAesthetic, setSelectedAesthetic] = useState('All Categories');
  const [imagesByCategory, setImagesByCategory]   = useState({});
  const [flippedCards, setFlippedCards]           = useState({});
  const [emptyMessagesByOutfit, setEmptyMessagesByOutfit] = useState({});
  const [loading, setLoading]                     = useState(true);

  // Object URL cache for uploaded blobs
  const objectUrlsRef = useRef(new Map());

  /**
   * Resolve display URL for an image record.
   * Supports:
   *   - IndexedDB blob  → creates an Object URL
   *   - imageUrl string → used directly (legacy/seed records if any remain)
   *   - Neither         → returns empty string (empty-state shown)
   */
  const getDisplayUrl = useCallback((image) => {
    if (!image) return '';
    if (image.blob) {
      if (objectUrlsRef.current.has(image.id)) {
        return objectUrlsRef.current.get(image.id);
      }
      const url = URL.createObjectURL(image.blob);
      objectUrlsRef.current.set(image.id, url);
      return url;
    }
    if (image.imageUrl) return image.imageUrl;
    return '';
  }, []);

  const clearObjectUrls = useCallback(() => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
  }, []);

  /* -------------------------------------------------------------------------
     Data loading
  -------------------------------------------------------------------------- */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);

      const imageMap = {};
      await Promise.all(
        fetchedCategories.map(async (cat) => {
          const catImages = await getImagesByLibrary(`style_${cat.id}`);
          imageMap[cat.id] = (catImages || []).filter((img) =>
              img.enabled !== false &&
              !(img.id && img.id.startsWith('seed_') && !img.blob));
        })
      );
      setImagesByCategory(imageMap);
    } catch (err) {
      console.error('CuratedRecommendations: failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const sync = () => loadData();
    window.addEventListener('anvaya_assets_updated', sync);
    return () => window.removeEventListener('anvaya_assets_updated', sync);
  }, [loadData]);

  useEffect(() => () => clearObjectUrls(), [clearObjectUrls]);

  /* -------------------------------------------------------------------------
     Card flip
  -------------------------------------------------------------------------- */
  const toggleCardFlip = (cardId, e) => {
    if (e) e.stopPropagation();
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  /* -------------------------------------------------------------------------
     Build catalogue items
     Only explicitly uploaded images (blob or imageUrl from real uploads).
     Seed images written to IndexedDB in a previous session will also appear
     here — their imageUrl points to Unsplash. That is acceptable; the user
     can delete them in Developer Mode.
  -------------------------------------------------------------------------- */
  const catalogItems = [];
  categories.forEach((cat) => {
    const catImages = imagesByCategory[cat.id] || [];
    catImages.forEach((img) => {
      catalogItems.push({
        id:                  img.id,
        title:               img.title  || '',
        about:               img.about  || '',
        aesthetic:           cat.name,
        categoryMode:        cat.mode   || 'women',
        displayUrl:          getDisplayUrl(img),
        isPrimary:           img.isPrimary,
        emptyAboutMode:      img.emptyAboutMode || 'auto',
        emptyAboutMessageId: img.emptyAboutMessageId || '',
      });
    });
  });

  // Available filter aesthetics derived from real uploaded content
  const availableAesthetics = [
    'All Categories',
    ...Array.from(new Set(catalogItems.map((i) => i.aesthetic))),
  ];

  const visibleOutfits =
    selectedAesthetic === 'All Categories'
      ? catalogItems
      : catalogItems.filter((i) => i.aesthetic === selectedAesthetic);

  // Distribute placeholder messages with minimal repetition across cards without manual About text
  useEffect(() => {
    const msgMap = distributeEmptyStateMessages(catalogItems);
    setEmptyMessagesByOutfit(msgMap);
  }, [imagesByCategory, categories]);

  /* -------------------------------------------------------------------------
     Render
  -------------------------------------------------------------------------- */
  return (
    <section id="curated-recommendations" className="py-10 md:py-16 relative scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <div className="mb-8 pb-5 border-b border-espresso/12">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="h-[1px] w-6 md:w-8 bg-forest/40" />
            <span className="text-[10px] md:text-[11px] font-sans uppercase tracking-[0.28em] text-forest font-semibold">
              Sartorial Architecture
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] font-light text-espresso tracking-tight">
            Curated Style Recommendations
          </h2>
        </div>

        {/* ── Category filters ──────────────────────────────────────────── */}
        {availableAesthetics.length > 1 && (
          <div className="mb-7 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-espresso/50 font-medium mr-1 hidden md:inline">
              Aesthetic:
            </span>
            {availableAesthetics.map((aesthetic) => {
              const isActive = selectedAesthetic === aesthetic;
              const count =
                aesthetic === 'All Categories'
                  ? catalogItems.length
                  : catalogItems.filter((i) => i.aesthetic === aesthetic).length;
              return (
                <button
                  key={aesthetic}
                  type="button"
                  onClick={() => setSelectedAesthetic(aesthetic)}
                  className={`px-3 py-1.5 text-xs rounded-xs border transition-all duration-150 inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-forest text-[#FAF8F3] border-forest shadow-xs font-semibold'
                      : 'bg-cream/90 border-espresso/12 text-espresso/80 hover:border-forest/50 hover:text-forest'
                  }`}
                >
                  <span>{aesthetic}</span>
                  <span className={`text-[10px] font-mono px-1 rounded-2xs ${
                    isActive ? 'bg-[#FAF8F3]/20 text-[#FAF8F3]' : 'bg-espresso/8 text-espresso/60'
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Loading ────────────────────────────────────────────────────── */}
        {loading && (
          <div className="py-14 text-center">
            <div className="inline-block w-5 h-5 border-2 border-forest/30 border-t-forest rounded-full animate-spin mb-3" />
            <p className="text-xs font-mono uppercase tracking-wider text-espresso/55">
              Loading style library…
            </p>
          </div>
        )}

        {/* ── Empty state: no outfits uploaded yet ──────────────────────── */}
        {!loading && visibleOutfits.length === 0 && (
          <div className="py-16 text-center border border-espresso/10 bg-[#FAF8F3]/60">
            <p className="font-serif text-xl text-espresso/50 font-light">
              No outfits added yet.
            </p>
            <p className="mt-1 text-xs text-espresso/40 font-sans">
              Upload photographs via Developer Mode to populate this section.
            </p>
          </div>
        )}

        {/* ── Outfit cards grid ──────────────────────────────────────────── */}
        {!loading && visibleOutfits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-9 animate-fade-in">
            {visibleOutfits.map((outfit) => {
              const isFlipped      = !!flippedCards[outfit.id];
              const hasCustomTitle = !!outfit.title.trim();
              const displayTitle   = hasCustomTitle ? outfit.title.trim() : '-Untitled-';
              const hasPhoto       = !!outfit.displayUrl;
              const hasAbout       = !!outfit.about.trim();

              return (
                <div
                  key={outfit.id}
                  /*
                   * Card height: fixed at 76vh, capped at 580px so the full card
                   * (including title and button below the photo) comfortably fits
                   * within a standard 900px desktop viewport without scrolling.
                   */
                  className="relative w-full perspective-1000 select-none"
                  style={{ height: 'min(76vh, 580px)' }}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >

                    {/* ======================================================
                        FRONT FACE
                        Outer border: Espresso `#2C1810`, background `#FBF9F4`
                        Photograph: Clean, undecorated, no mats/frames/bevels/shadows
                        Aspect ratio: Preserved with object-contain (no crop/distortion)
                       ====================================================== */}
                    <div
                      className="absolute inset-0 backface-hidden flex flex-col
                                 bg-[#FBF9F4]
                                 border-[2.5px] border-[#2C1810]
                                 p-4 sm:p-5 overflow-hidden"
                    >

                      {/* Top-left Category Label: MEN, WOMEN, or NEUTRAL */}
                      <div className="shrink-0 pb-1.5 flex items-center justify-start">
                        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#49382C]/70 font-medium select-none">
                          {(outfit.categoryMode || 'women').toUpperCase()}
                        </span>
                      </div>

                      {/* Clean photo area — maximizes available area, left-aligned, object-contain */}
                      <div className="flex-1 min-h-0 w-full flex items-center justify-start overflow-hidden">
                        {hasPhoto ? (
                          <img
                            src={outfit.displayUrl}
                            alt={displayTitle}
                            className="w-full h-full object-contain object-left block rounded-[4px]"
                            loading="lazy"
                          />
                        ) : (
                          /* Clean empty-photo state */
                          <div className="text-center px-4">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-espresso/20 flex items-center justify-center">
                              <span className="font-serif text-lg text-espresso/40 select-none">A</span>
                            </div>
                            <p className="text-[11px] font-sans text-espresso/50 leading-snug">
                              No photograph uploaded.<br />
                              Add via Developer Mode.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Title row + Flip button — below the photograph */}
                      <div className="pt-3 flex items-center justify-between gap-3 shrink-0">
                        <h3
                          className={`font-serif text-base sm:text-lg font-normal tracking-wide truncate ${
                            hasCustomTitle ? 'text-[#2C1810]' : 'text-[#49382C]'
                          }`}
                          title={displayTitle}
                        >
                          {displayTitle}
                        </h3>

                        {/* Anvaya 'A' — brown, flips to reverse */}
                        <button
                          type="button"
                          onClick={(e) => toggleCardFlip(outfit.id, e)}
                          className="w-8 h-8 rounded-full bg-[#2C1810] text-[#FBF9F4]
                                     flex items-center justify-center shrink-0
                                     transition-transform duration-200 hover:scale-105 active:scale-95
                                     shadow-sm cursor-pointer"
                          aria-label={`About ${displayTitle}`}
                        >
                          <span className="font-serif font-semibold text-sm leading-none select-none">A</span>
                        </button>
                      </div>

                    </div>

                    {/* ======================================================
                        REVERSE FACE
                        Outer border: Espresso `#2C1810`, background `#FBF9F4`
                        Photograph: Clean, prominent, full aspect ratio (object-contain)
                        Title & Category: Below the photo
                        About Section: Stays entirely inside card, no overflow
                        Flip Button: Forest green 'A' button at bottom right
                       ====================================================== */}
                    <div
                      className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col
                                 bg-[#FBF9F4]
                                 border-[2.5px] border-[#2C1810]
                                 p-4 sm:p-5 overflow-hidden"
                    >

                      {/* Top: photograph (larger, left-aligned, object-contain, fully contained) */}
                      {hasPhoto && (
                        <div className="w-full h-[210px] sm:h-[240px] max-h-[46%] flex-shrink min-h-0 flex items-center justify-start overflow-hidden mb-2.5">
                          <img
                            src={outfit.displayUrl}
                            alt={displayTitle}
                            className="w-full h-full object-contain object-left block rounded-[4px]"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Title + aesthetic label */}
                      <div className="shrink-0 pb-2 mb-2 border-b border-[#D8CEC0]">
                        <h4
                          className={`font-serif text-base sm:text-lg font-normal leading-snug break-words ${
                            hasCustomTitle ? 'text-[#2C1810]' : 'text-[#49382C]'
                          }`}
                        >
                          {displayTitle}
                        </h4>
                        <p className="mt-0.5 text-[10px] font-mono uppercase tracking-wider text-[#8A7A6E]">
                          {outfit.aesthetic || ''}
                        </p>
                      </div>

                      {/* Recessed editorial About panel — strictly contained, never overflows */}
                      <div
                        className="flex-1 min-h-[90px] overflow-y-auto
                                   bg-[#EDE7DC]
                                   border border-[#C8BEB5]
                                   rounded-[2px] p-3.5 sm:p-4"
                      >
                        {hasAbout ? (
                          <p className="font-serif text-sm sm:text-[0.9rem] text-[#2C1810]/80 leading-relaxed whitespace-pre-wrap">
                            {outfit.about.trim()}
                          </p>
                        ) : emptyMessagesByOutfit[outfit.id] ? (
                          /* Dynamic empty-About message from collection with minimal repetition */
                          <div className="h-full flex items-center justify-center py-2">
                            <p className="font-serif text-sm sm:text-base text-[#49382C] italic leading-relaxed text-center max-w-[24ch] mx-auto">
                              {emptyMessagesByOutfit[outfit.id]}
                            </p>
                          </div>
                        ) : (
                          /* Mode 'none': Graceful blank reverse panel */
                          <div className="h-full flex items-center justify-center py-2" />
                        )}
                      </div>

                      {/* ── Flip back control ────────────────────────────── */}
                      <div className="pt-2 sm:pt-2.5 flex items-center justify-end shrink-0">
                        {/* Anvaya 'A' — forest green, flips back to front */}
                        <button
                          type="button"
                          onClick={(e) => toggleCardFlip(outfit.id, e)}
                          className="w-8 h-8 rounded-full bg-[#1E3A2B] text-[#FBF9F4]
                                     flex items-center justify-center shrink-0
                                     transition-transform duration-200 hover:scale-105 active:scale-95
                                     shadow-sm cursor-pointer"
                          aria-label="Return to front"
                        >
                          <span className="font-serif font-semibold text-sm leading-none select-none">A</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

