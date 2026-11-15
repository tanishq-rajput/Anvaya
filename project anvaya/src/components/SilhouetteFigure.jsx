import React from 'react';
import { getSilhouette } from '../data/silhouettes';
import {
  DEFAULT_MANNEQUIN_COLOR,
  assignPaletteToGarments,
} from '../utils/paletteColorAssignment';

/**
 * SilhouetteFigure — 2D Layered Fashion Mannequin with Realistic Fabric Recoloring
 * 
 * Features:
 * - Neutral full-body base mannequin (base.png or base-arms-masked.png when outerwear is equipped).
 * - Complete, unmodified topwear asset preserved underneath outerwear.
 * - Outerwear rendered as a separate layer over topwear.
 * - Bottomwear shifted exactly 2 pixels to the right.
 * - Dynamic luminance calibration for bottomwear so colour selections dye the fabric accurately while preserving natural pleats, folds, and texture.
 * - Layered render order: Base -> Bottomwear -> Topwear -> Outerwear -> Footwear.
 * - Shared 524x524 coordinate space with aligned proportions and interactive hit map.
 */

export function SilhouetteFigure({
  silhouetteId = 'look-01',
  activeZone = null,
  activeGarments = {
    outerwear: true,
    topwear: true,
    bottomwear: true,
    accessories: true,
  },
  palette = null,
  zoneColours = {},
  onZoneClick,
  onZoneHover,
  canApply = false,
}) {
  const silhouette = getSilhouette(silhouetteId);
  const categories = silhouette.categories;
  const isOuterwearEquipped = !!activeGarments?.outerwear;

  // Derive palette defaults and merge with any custom user dyes
  const defaultColours = React.useMemo(
    () => assignPaletteToGarments(palette, activeGarments),
    [palette, activeGarments]
  );
  const effectiveColours = {
    ...defaultColours,
    ...zoneColours,
  };

  const handleZoneEnter = (zone) => {
    onZoneHover?.(zone);
  };

  const handleZoneLeave = () => {
    onZoneHover?.(null);
  };

  const handleZoneClick = (zone) => {
    onZoneClick?.(zone);
  };

  // Base image: use arms-masked version when jacket is equipped so arms don't bleed through sleeves
  const baseImageSrc = isOuterwearEquipped
    ? (silhouette.baseImageArmsMasked || silhouette.baseImage)
    : silhouette.baseImage;

  return (
    <div
      className="relative select-none flex items-center justify-center max-h-full h-full"
      style={{ aspectRatio: silhouette.aspectRatio }}
      aria-label={`${silhouette.name} fashion mannequin`}
    >
      {/* Container wrapper matching 1:1 aspect ratio */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xs bg-transparent">
        
        {/* Layer 0: Neutral Full-Body Mannequin (Base Layer, always visible) */}
        <img
          src={baseImageSrc}
          alt={silhouette.name}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-150"
          style={{ filter: 'drop-shadow(0 4px 16px rgba(49,38,30,0.14))', zIndex: 1 }}
          draggable={false}
        />

        {/* Layer 1..N: Independent Clothing Layers & Segmentation Overlays */}
        {silhouette.stackOrder.map((catKey) => {
          const cat = categories[catKey];
          if (!cat) return null;

          const isEquipped = activeGarments ? activeGarments[catKey] !== false : true;
          if (!isEquipped) return null;

          const appliedColor = effectiveColours[catKey] || DEFAULT_MANNEQUIN_COLOR;
          const isHovered = activeZone === catKey;

          // Bottomwear adjustments:
          // 1. Shift exactly 2 pixels to the right
          // 2. Matte finish: contrast(0.88) saturate(0.92) brightness(0.97) dull the specular highlights
          //    without touching the texture, folds, shading structure or pattern.
          // 3. When dyed a non-black palette colour, prepend brightness(7.5) contrast(1.1) to push light
          //    into the fabric so the multiply tint lands accurately, then re-apply matte treatment after.
          const isBottomwear = catKey === 'bottomwear';
          // Outerwear (jacket) base colour accuracy:
          // The jacket PNG has a warm sandy-beige base (~#D4BEA8). When multiply-blending a light/cool/pastel
          // palette colour onto it, the warm base contaminates the result — turning any light tint cream/beige.
          // Fix: grayscale(1) on the base image neutralises the hue bias while exactly preserving each pixel's
          // luminance (highlights stay bright, shadows stay dark, folds/texture are fully intact).
          // Multiply then renders the pure palette colour + fabric depth with zero warm contamination.
          const isOuterwear = catKey === 'outerwear';
          const transformStyle = isBottomwear ? 'translateX(2px)' : undefined;
          const isBlack = !appliedColor || 
            appliedColor.toLowerCase() === '#1a1a1a' || 
            appliedColor.toLowerCase() === '#1c1c1c' || 
            appliedColor.toLowerCase() === '#000000';
          // Matte filter: kills gloss highlights while keeping depth, folds and texture intact.
          const MATTE_FILTER = 'contrast(0.88) saturate(0.92) brightness(0.97)';
          const imgFilter = isBottomwear
            ? (!isBlack
                ? `brightness(7.5) contrast(1.1) ${MATTE_FILTER}`
                : MATTE_FILTER)
            : isOuterwear
              ? 'grayscale(1)'
              : undefined;

          return (
            <React.Fragment key={catKey}>
              {/* Garment Base Fabric Image (preserved complete and unmodified) */}
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-200"
                style={{
                  zIndex: (cat.zIndex || 1) * 2,
                  transform: transformStyle,
                  filter: imgFilter,
                }}
                draggable={false}
              />

              {/* Primary Dyed Fabric Tint (Luminance & crease preserving multiply) */}
              {appliedColor && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
                  style={{
                    backgroundColor: appliedColor,
                    WebkitMaskImage: `url(${cat.mask})`,
                    maskImage: `url(${cat.mask})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    mixBlendMode: cat.blendMode || 'multiply',
                    zIndex: (cat.zIndex || 1) * 2 + 1,
                    transform: transformStyle,
                  }}
                />
              )}

              {/* Hover / Targeted Region Indicator */}
              {isHovered && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-200"
                  style={{
                    backgroundColor: appliedColor || (canApply ? '#FAF8F3' : '#FFFFFF'),
                    WebkitMaskImage: `url(${cat.mask})`,
                    maskImage: `url(${cat.mask})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    mixBlendMode: 'overlay',
                    opacity: canApply ? 0.75 : 0.45,
                    filter: 'brightness(1.15) contrast(1.1)',
                    zIndex: 25,
                    transform: transformStyle,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Layer Top: Interactive SVG Hit Map (524 x 524 coordinate space) */}
        <svg
          viewBox={`0 0 ${silhouette.width} ${silhouette.height}`}
          className="absolute inset-0 w-full h-full z-30"
          style={{ cursor: canApply ? 'crosshair' : 'pointer' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Topwear (T-shirt / Inner layer: complete silhouette) */}
          {activeGarments?.topwear !== false && (
            <rect
              x="192"
              y="82"
              width="140"
              height="170"
              fill="transparent"
              onMouseEnter={() => handleZoneEnter('topwear')}
              onMouseLeave={handleZoneLeave}
              onClick={() => handleZoneClick('topwear')}
              className="transition-colors cursor-pointer"
            >
              <title>Topwear (T-shirt)</title>
            </rect>
          )}

          {/* Outerwear (Beige open-front jacket: left panel, right panel, shoulders) */}
          {isOuterwearEquipped && (
            <path
              d="
                M 189 82
                L 333 82
                L 333 295
                L 289 295
                L 289 110
                L 235 110
                L 235 295
                L 189 295
                Z
              "
              fill="transparent"
              onMouseEnter={() => handleZoneEnter('outerwear')}
              onMouseLeave={handleZoneLeave}
              onClick={() => handleZoneClick('outerwear')}
              className="transition-colors cursor-pointer"
            >
              <title>Outerwear (Jacket)</title>
            </path>
          )}

          {/* Bottomwear (Trousers, shifted exactly 2px to the right) */}
          {activeGarments?.bottomwear !== false && (
            <rect
              x={204 + 2}
              y="254"
              width="112"
              height="207"
              fill="transparent"
              onMouseEnter={() => handleZoneEnter('bottomwear')}
              onMouseLeave={handleZoneLeave}
              onClick={() => handleZoneClick('bottomwear')}
              className="transition-colors cursor-pointer"
            >
              <title>Bottomwear (Trousers)</title>
            </rect>
          )}

          {/* Footwear / Accessories (Sneakers) */}
          {activeGarments?.accessories !== false && (
            <rect
              x="220"
              y="463"
              width="85"
              height="40"
              fill="transparent"
              onMouseEnter={() => handleZoneEnter('accessories')}
              onMouseLeave={handleZoneLeave}
              onClick={() => handleZoneClick('accessories')}
              className="transition-colors cursor-pointer"
            >
              <title>Footwear (Shoes)</title>
            </rect>
          )}
        </svg>
      </div>
    </div>
  );
}
