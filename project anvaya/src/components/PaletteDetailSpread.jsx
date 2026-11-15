import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Check,
  ZoomIn,
  X,
} from 'lucide-react';
import { SilhouetteFigure } from './SilhouetteFigure';
import { assignPaletteToGarments } from '../utils/paletteColorAssignment';

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function hexToHue(hex, fallbackH) {
  if (typeof fallbackH === 'number' && !isNaN(fallbackH)) {
    return Math.round(((fallbackH % 360) + 360) % 360);
  }
  if (!hex || typeof hex !== 'string') return 0;
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6 && clean.length !== 3) return 0;
  let r, g, b;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16) / 255;
    g = parseInt(clean[1] + clean[1], 16) / 255;
    b = parseInt(clean[2] + clean[2], 16) / 255;
  } else {
    r = parseInt(clean.substring(0, 2), 16) / 255;
    g = parseInt(clean.substring(2, 4), 16) / 255;
    b = parseInt(clean.substring(4, 6), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (d === 0) return 0;
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = Math.round(h * 60);
  return ((h % 360) + 360) % 360;
}

function getProportions(swatches = []) {
  const f1 = Number(swatches[0]?.flex) || 5.5;
  const f2 = Number(swatches[1]?.flex) || 3.0;
  const f3 = Number(swatches[2]?.flex) || 1.5;
  const total = f1 + f2 + f3;
  const p1 = Math.round((f1 / total) * 100);
  const p2 = Math.round((f2 / total) * 100);
  return [p1, p2, 100 - p1 - p2];
}

function getColourName(swatch, roleIndex, palette) {
  if (swatch?.name && typeof swatch.name === 'string') return swatch.name;
  const rawLabel = swatch?.label || '';
  let cleaned = rawLabel
    .replace(/^(dominant|supporting|accent)\s+/i, '')
    .replace(/\s+\d+%\s*$/i, '')
    .trim();
  if (!cleaned || cleaned.toLowerCase() === 'base') {
    return palette?.baseColor?.name ||
      (roleIndex === 0 ? 'Foundation Base' : roleIndex === 1 ? 'Secondary Base' : 'Accent Base');
  }
  if (cleaned.toLowerCase() === 'comp') return 'Harmonic Complement';
  if (cleaned.toLowerCase() === 'pop') return 'Vivid Accent';
  return cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getPaletteDescription(technique) {
  const t = (technique || '').toLowerCase();
  if (t === 'complementary') return 'Structured contrast pairing a grounded neutral foundation with a calibrated complementary accent for high sartorial definition and everyday versatility.';
  if (t === 'analogous') return 'A nuanced tonal sequence across adjacent spectral hues, curating a fluid, organic gradient across layered garments.';
  if (t === 'monochromatic') return 'A single-hue depth study varying luminance and saturation to curate subtle textural dimension and understated luxury.';
  if (t === 'triadic') return 'An equidistant triadic equilibrium pairing a grounded neutral foundation with controlled chromatic punctuation.';
  return 'A calibrated tripartite outfit colour system designed for balanced sartorial presence and wearable elegance.';
}

const ROLES = [
  { role: 'Dominant',   badgeBg: 'bg-[#34483A]/10', badgeText: 'text-[#34483A]', badgeBorder: 'border-[#34483A]/20' },
  { role: 'Supporting', badgeBg: 'bg-[#593D2F]/10', badgeText: 'text-[#593D2F]', badgeBorder: 'border-[#593D2F]/20' },
  { role: 'Accent',     badgeBg: 'bg-[#7C3F2A]/10', badgeText: 'text-[#7C3F2A]', badgeBorder: 'border-[#7C3F2A]/20' },
];

// ---------------------------------------------------------------------------
// Four wearable categories — 2D Layered Garments
// ---------------------------------------------------------------------------
const GARMENT_ZONES = ['outerwear', 'topwear', 'bottomwear', 'accessories'];

const DEFAULT_GARMENT_COLOR = '#1A1A1A';

const GARMENT_META = {
  outerwear:   { label: 'Outerwear',   hint: 'Black open-front jacket', order: 1 },
  topwear:     { label: 'Topwear',     hint: 'Black crewneck T-shirt',  order: 2 },
  bottomwear:  { label: 'Bottomwear',  hint: 'Black tailored trousers', order: 3 },
  accessories: { label: 'Footwear',    hint: 'Black leather sneakers',  order: 4 },
};

const NATURAL_COLORS = {
  outerwear: DEFAULT_GARMENT_COLOR,
  topwear: DEFAULT_GARMENT_COLOR,
  bottomwear: DEFAULT_GARMENT_COLOR,
  accessories: DEFAULT_GARMENT_COLOR,
};

// ---------------------------------------------------------------------------
// DetailLeftPage — Palette information (colour breakdown, back navigation)
// ---------------------------------------------------------------------------

export function DetailLeftPage({ 
  palette, 
  onReturn, 
  selectedSwatch, 
  onSelectSwatch, 
  className = '',
  isZoomed: controlledIsZoomed,
  onZoomChange,
}) {
  if (!palette) return null;

  const [internalZoomed, setInternalZoomed] = useState(false);
  const isZoomed = controlledIsZoomed !== undefined ? controlledIsZoomed : internalZoomed;

  const handleZoomChange = (val) => {
    if (controlledIsZoomed === undefined) {
      setInternalZoomed(val);
    }
    onZoomChange?.(val);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isZoomed) {
        handleZoomChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  const swatches = palette.swatches || [];
  const proportions = getProportions(swatches);

  return (
    <div className={`w-full h-full p-4 sm:p-5 lg:p-6 flex flex-col justify-between bg-[#FAF8F3] relative z-10 min-h-[420px] sm:min-h-[460px] ${className}`}>
      {/* Folio Header */}
      <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-[#49382C]/10 text-[9px] font-mono uppercase tracking-[0.2em] text-[#34483A]">
        <span className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="w-3 h-3 text-[#34483A]" />
          Page 03 · Chromatic Study
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[#49382C]/60">Harmonic Breakdown</span>
          <button
            type="button"
            onClick={() => handleZoomChange(true)}
            className="w-5 h-5 rounded-xs bg-[#FAF8F3]/90 hover:bg-[#FAF8F3] text-[#49382C]/75 hover:text-[#34483A] border border-[#49382C]/20 shadow-2xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Inspect chromatic study in detail"
            aria-label="Inspect chromatic study in detail"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Palette Title & Technique */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[9px] font-mono uppercase tracking-wider text-[#34483A] font-semibold">
            {palette.technique || 'Curated Study'}
          </span>
          <span className="text-[#49382C]/30">·</span>
          <span className="text-[9px] font-mono text-[#49382C]/60 uppercase tracking-wider">
            {palette.name || 'Harmonised Trio'}
          </span>
        </div>
        <h3 className="font-serif text-lg sm:text-xl text-[#49382C] font-normal leading-tight">
          {palette.name || `${palette.technique} Harmony`}
        </h3>
        <p className="mt-1 text-[11px] sm:text-xs text-[#49382C]/75 font-light leading-relaxed line-clamp-2">
          {getPaletteDescription(palette.technique)}
        </p>
      </div>

      {/* Tripartite Proportion Bar (Interactive) */}
      <div className="my-1.5">
        <div className="text-[9px] font-mono uppercase tracking-wider text-[#49382C]/60 mb-1 flex items-center justify-between">
          <span>Sartorial Proportion</span>
          <span>{proportions.join(' / ')}%</span>
        </div>
        <div className="w-full h-5 rounded-xs overflow-hidden flex border border-[#49382C]/20 shadow-xs cursor-pointer">
          {swatches.map((swatch, idx) => {
            const isSelected = selectedSwatch?.hex === swatch.hex;
            const percentage = proportions[idx] || 33;
            return (
              <div
                key={idx}
                style={{ width: `${percentage}%`, backgroundColor: swatch.hex }}
                onClick={() => onSelectSwatch?.(swatch)}
                className={`h-full transition-all relative group flex items-center justify-center ${
                  isSelected ? 'ring-2 ring-inset ring-[#FAF8F3]' : ''
                }`}
                title={`${swatch.name || swatch.label}: ${swatch.hex} (${percentage}%) — Click to select`}
              >
                {isSelected && (
                  <Check className="w-2.5 h-2.5 text-[#FAF8F3] drop-shadow-md" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Swatch Breakdown Cards */}
      <div className="flex-1 flex flex-col justify-center gap-1.5 my-1">
        {swatches.map((swatch, idx) => {
          const roleInfo = ROLES[idx] || ROLES[0];
          const percentage = proportions[idx] || 33;
          const colourName = getColourName(swatch, idx, palette);
          const hexCode = (swatch.hex || '#000000').toUpperCase();
          const hueValue = hexToHue(swatch.hex, swatch.h);
          const isSelected = selectedSwatch?.hex === swatch.hex;

          return (
            <div
              key={idx}
              onClick={() => onSelectSwatch?.(swatch)}
              className={`flex items-center gap-2.5 p-2 rounded-xs border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#EFEAE0] border-[#34483A] shadow-xs ring-1 ring-[#34483A]/30'
                  : 'bg-[#FAF8F3] border-[#49382C]/15 hover:bg-[#EFEAE0]/60 hover:border-[#49382C]/30'
              }`}
              title="Click to activate this colour for dyeing mannequin garments"
            >
              {/* Swatch chip */}
              <div
                className="w-8 h-8 rounded-xs shrink-0 border border-[#49382C]/20 shadow-xs flex items-center justify-center relative"
                style={{ backgroundColor: swatch.hex }}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#FAF8F3] shadow-xs" />
                )}
              </div>

              {/* Swatch meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className={`px-1.5 py-0.5 text-[8.5px] font-mono uppercase tracking-wider font-semibold rounded-2xs border ${roleInfo.badgeBg} ${roleInfo.badgeText} ${roleInfo.badgeBorder}`}>
                    {roleInfo.role}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#34483A]">{percentage}%</span>
                </div>
                <h4 className="font-serif text-sm sm:text-[15px] text-[#49382C] font-normal truncate leading-tight mb-0.5">
                  {colourName}
                </h4>
                <div className="flex items-center gap-3 text-[9.5px] font-mono text-[#49382C]/75">
                  <span className="flex items-center gap-1">
                    <span className="text-[#49382C]/45 uppercase text-[8.5px]">HEX</span>
                    <span className="font-medium text-[#49382C]">{hexCode}</span>
                  </span>
                  <span className="text-[#49382C]/30">·</span>
                  <span className="flex items-center gap-1">
                    <span className="text-[#49382C]/45 uppercase text-[8.5px]">HUE</span>
                    <span className="font-medium text-[#49382C]">{hueValue}°</span>
                  </span>
                </div>
                <div className="w-full bg-[#EAE5D9] h-[2.5px] rounded-full mt-1 overflow-hidden">
                  <div style={{ width: `${percentage}%`, backgroundColor: swatch.hex }} className="h-full rounded-full transition-all duration-300" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2 mt-1 border-t border-[#49382C]/15 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onReturn?.(); }}
          className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#34483A] hover:text-[#49382C] hover:underline font-semibold cursor-pointer py-1 group"
          title="Turn page back"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" /> Turn Page Back
        </button>
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#34483A] font-semibold">Anvaya Studio</span>
      </div>

      {/* Chromatic Study Zoom Modal / Detailed Inspection Panel */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-[#2C1810]/55 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in select-none"
          onClick={() => handleZoomChange(false)}
        >
          <div 
            className="relative bg-[#FAF8F3] border border-[#49382C]/25 rounded-xs p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#49382C]/15">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#34483A] font-semibold">
                    Harmonic Breakdown Study
                  </span>
                  <span className="text-[#49382C]/30">•</span>
                  <span className="text-[9px] font-mono text-[#49382C]/60 uppercase tracking-wider">
                    {palette.technique || 'Curated Study'}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-[#49382C] font-normal leading-tight">
                  {palette.name || `${palette.technique} Harmony`}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => handleZoomChange(false)}
                className="w-8 h-8 rounded-full border border-[#49382C]/20 bg-[#FAF8F3] hover:bg-[#EFEAE0] text-[#49382C] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                title="Close enlarged view"
                aria-label="Close enlarged view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto space-y-4 py-2">
              <p className="text-xs text-[#49382C]/75 font-light leading-relaxed">
                {getPaletteDescription(palette.technique)}
              </p>

              {/* Tripartite Proportion Bar */}
              <div className="space-y-1">
                <div className="text-[9px] font-mono uppercase tracking-wider text-[#49382C]/60 flex items-center justify-between">
                  <span>Sartorial Proportion</span>
                  <span>{proportions.join(' / ')}%</span>
                </div>
                <div className="w-full h-7 rounded-xs overflow-hidden flex border border-[#49382C]/20 shadow-xs cursor-pointer">
                  {swatches.map((swatch, idx) => {
                    const isSelected = selectedSwatch?.hex === swatch.hex;
                    const percentage = proportions[idx] || 33;
                    return (
                      <div
                        key={idx}
                        style={{ width: `${percentage}%`, backgroundColor: swatch.hex }}
                        onClick={() => onSelectSwatch?.(swatch)}
                        className={`h-full transition-all relative group flex items-center justify-center ${
                          isSelected ? 'ring-2 ring-inset ring-[#FAF8F3]' : ''
                        }`}
                        title={`${swatch.name || swatch.label}: ${swatch.hex} (${percentage}%)`}
                      >
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#FAF8F3] drop-shadow-md" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Enlarged Swatch Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {swatches.map((swatch, idx) => {
                  const roleInfo = ROLES[idx] || ROLES[0];
                  const percentage = proportions[idx] || 33;
                  const colourName = getColourName(swatch, idx, palette);
                  const hexCode = (swatch.hex || '#000000').toUpperCase();
                  const hueValue = hexToHue(swatch.hex, swatch.h);
                  const isSelected = selectedSwatch?.hex === swatch.hex;

                  return (
                    <div
                      key={idx}
                      onClick={() => onSelectSwatch?.(swatch)}
                      className={`flex flex-col gap-2 p-3 rounded-xs border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#EFEAE0] border-[#34483A] shadow-xs ring-1 ring-[#34483A]/30'
                          : 'bg-[#FAF8F3] border-[#49382C]/15 hover:bg-[#EFEAE0]/60'
                      }`}
                    >
                      <div
                        className="w-full h-16 rounded-xs border border-[#49382C]/20 shadow-xs flex items-center justify-center relative"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {isSelected && (
                          <span className="w-3 h-3 rounded-full bg-[#FAF8F3] shadow-xs" />
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className={`px-1.5 py-0.5 text-[8.5px] font-mono uppercase tracking-wider font-semibold rounded-2xs border ${roleInfo.badgeBg} ${roleInfo.badgeText} ${roleInfo.badgeBorder}`}>
                          {roleInfo.role}
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#34483A]">{percentage}%</span>
                      </div>
                      <h4 className="font-serif text-sm text-[#49382C] font-normal truncate leading-tight">
                        {colourName}
                      </h4>
                      <div className="flex items-center gap-2 text-[9px] font-mono text-[#49382C]/75">
                        <span>{hexCode}</span>
                        <span>·</span>
                        <span>{hueValue}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 mt-2 border-t border-[#49382C]/15 flex items-center justify-between text-[9px] font-mono text-[#49382C]/60">
              <span>Press Escape or click outside to dismiss</span>
              <button
                type="button"
                onClick={() => handleZoomChange(false)}
                className="px-3 py-1 rounded-xs bg-[#34483A] text-[#FAF8F3] text-[9.5px] font-mono uppercase tracking-wider hover:bg-[#27372B] transition-colors cursor-pointer shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DetailRightPage — 2D Layered Mannequin Outfit System & Colour Studio
// ---------------------------------------------------------------------------

export function DetailRightPage({
  palette,
  onReturn,
  selectedSwatch,
  onSelectSwatch,
  activeGarments = {
    outerwear: true,
    topwear: true,
    bottomwear: true,
    accessories: true,
  },
  onToggleGarment,
  onSetGarments,
  zoneColours = {},
  onApplyColour,
  onResetColours,
  className = '',
  isZoomed: controlledIsZoomed,
  onZoomChange,
}) {
  if (!palette) return null;

  const [activeZone, setActiveZone] = useState(null);
  const [internalZoomed, setInternalZoomed] = useState(false);
  const isZoomed = controlledIsZoomed !== undefined ? controlledIsZoomed : internalZoomed;

  const handleZoomChange = (val) => {
    if (controlledIsZoomed === undefined) {
      setInternalZoomed(val);
    }
    onZoomChange?.(val);
  };

  const canApply = !!selectedSwatch && !!onApplyColour;
  const hasAppliedColours = Object.keys(zoneColours).length > 0;

  const activeCount = Object.values(activeGarments || {}).filter(Boolean).length;

  // Close zoom modal with Escape key
  useEffect(() => {
    if (!isZoomed) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleZoomChange(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  // Derive automatic garment colour assignment from currently selected palette
  const defaultColours = useMemo(
    () => assignPaletteToGarments(palette, activeGarments),
    [palette, activeGarments]
  );
  const effectiveZoneColours = useMemo(
    () => ({ ...defaultColours, ...zoneColours }),
    [defaultColours, zoneColours]
  );

  return (
    <div className={`w-full h-full p-4 sm:p-5 lg:p-6 flex flex-col justify-between bg-[#F8F5EE] relative z-10 min-h-[420px] sm:min-h-[460px] ${className}`}>
      
      {/* Folio Header */}
      <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-[#49382C]/10 text-[9px] font-mono uppercase tracking-[0.2em] text-[#34483A]">
        <span className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="w-3 h-3 text-[#34483A]" />
          Page 04 · Layered Mannequin Studio
        </span>
        <div className="flex items-center gap-2">
          {hasAppliedColours && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onResetColours?.();
              }}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs border border-[#49382C]/20 bg-[#FAF8F3] hover:bg-[#EFEAE0] text-[#49382C] text-[8.5px] font-mono lowercase tracking-normal cursor-pointer transition-colors shadow-2xs"
              title="Reset garment dyes to natural fabric tones"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>reset dyes</span>
            </button>
          )}
          <span className="text-[#49382C]/65 font-medium">
            {activeCount} / 4 Garments Equipped
          </span>
        </div>
      </div>

      {/* Title & Quick Look Presets Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
        <h3 className="font-serif text-base sm:text-lg text-[#49382C] font-normal leading-tight">
          2D Layered Outfit Assembly
        </h3>

        {/* Quick Styling Presets */}
        <div className="flex items-center gap-1 text-[8.5px] font-mono">
          {[
            { label: 'All', config: { outerwear: true, topwear: true, bottomwear: true, accessories: true } },
            { label: 'No Jacket', config: { outerwear: false, topwear: true, bottomwear: true, accessories: true } },
            { label: 'Tee + Chinos', config: { outerwear: false, topwear: true, bottomwear: true, accessories: false } },
            { label: 'Base Only', config: { outerwear: false, topwear: false, bottomwear: false, accessories: false } },
          ].map((preset, idx) => {
            const isActive = Object.keys(preset.config).every(
              k => !!activeGarments[k] === !!preset.config[k]
            );
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSetGarments?.(preset.config);
                }}
                className={`px-1.5 py-0.5 rounded-2xs border transition-all ${
                  isActive
                    ? 'bg-[#34483A] text-[#FAF8F3] border-[#34483A] font-semibold shadow-2xs'
                    : 'bg-[#FAF8F3] text-[#49382C]/80 border-[#49382C]/20 hover:bg-[#EFEAE0]'
                }`}
                title={`Apply preset: ${preset.label}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Mannequin Stage & Garment Wardrobe Controls */}
      <div className="flex-1 flex items-stretch gap-3 min-h-0 my-1">
        
        {/* Layered Mannequin Figure Container with Engraved Rectangular Frame */}
        <div className="flex-1 flex items-center justify-center relative min-h-0">
          <div className="relative h-full w-full max-h-[410px] flex items-center justify-center p-2 rounded-xs border border-[#49382C]/18 bg-[#F5F1E8]/60 shadow-[inset_0_1px_3px_rgba(73,56,44,0.08),inset_0_0_0_1px_rgba(255,255,255,0.45),0_1px_0_rgba(255,255,255,0.6)]">
            
            {/* Mannequin Zoom Inspection Button */}
            <button
              type="button"
              onClick={() => handleZoomChange(true)}
              className="absolute top-2 right-2 z-25 w-7 h-7 rounded-xs bg-[#FAF8F3]/90 hover:bg-[#FAF8F3] text-[#49382C]/75 hover:text-[#34483A] border border-[#49382C]/20 shadow-2xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Inspect mannequin in detail"
              aria-label="Inspect mannequin in detail"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            {/* Mannequin Figure */}
            <div className="h-full w-full flex items-center justify-center overflow-hidden">
              <SilhouetteFigure
                activeZone={activeZone}
                activeGarments={activeGarments}
                palette={palette}
                zoneColours={zoneColours}
                onZoneClick={(zone) => {
                  if (canApply && activeGarments[zone] !== false) {
                    onApplyColour(zone, selectedSwatch.hex);
                  }
                }}
                onZoneHover={setActiveZone}
                canApply={canApply}
              />
            </div>
          </div>
        </div>

        {/* Garment Selection & Dyeing Column */}
        <div className="flex flex-col justify-center gap-1.5 w-[140px] sm:w-[150px] shrink-0">
          <div className="text-[9px] font-mono uppercase tracking-wider text-[#34483A] font-semibold border-b border-[#49382C]/10 pb-1 mb-0.5 flex items-center justify-between">
            <span>Garment Layers</span>
            <span className="text-[8px] text-[#49382C]/50">Toggle / Dye</span>
          </div>

          {GARMENT_ZONES.map((zone) => {
            const { label, hint } = GARMENT_META[zone];
            const isHovered = activeZone === zone;
            const appliedColour = zoneColours[zone];
            const defaultColour = defaultColours[zone];
            const displayColour = appliedColour || defaultColour;
            const isEquipped = activeGarments ? activeGarments[zone] !== false : true;
            const canDye = canApply && isEquipped;

            return (
              <div
                key={zone}
                onMouseEnter={() => setActiveZone(zone)}
                onMouseLeave={() => setActiveZone(null)}
                onClick={() => {
                  if (canDye) {
                    onApplyColour(zone, selectedSwatch.hex);
                  }
                }}
                title={
                  !isEquipped
                    ? `${label} is currently removed. Click checkbox to wear.`
                    : canDye
                    ? `Click to dye ${label} with ${selectedSwatch.hex}`
                    : `${label} (${hint})`
                }
                className={`p-1.5 sm:p-2 rounded-xs border transition-all ${
                  !isEquipped
                    ? 'bg-[#EFEAE0]/40 border-[#49382C]/10 opacity-70'
                    : isHovered && canDye
                    ? 'bg-[#EFEAE0] border-[#49382C]/50 shadow-sm scale-[1.01] cursor-pointer'
                    : isHovered
                    ? 'bg-[#EFEAE0] border-[#49382C]/40 shadow-xs'
                    : 'bg-[#FAF8F3] border-[#49382C]/15 shadow-2xs'
                }`}
              >
                {/* Header row: Checkbox, Label & Dye Swatch */}
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isEquipped}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleGarment?.(zone);
                      }}
                      id={`toggle-garment-${zone}`}
                      className="w-3 h-3 rounded-2xs accent-[#34483A] cursor-pointer"
                      title={isEquipped ? `Remove ${label} from mannequin` : `Equip ${label} on mannequin`}
                    />
                    <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold truncate ${
                      isEquipped ? 'text-[#49382C]' : 'text-[#49382C]/45 line-through'
                    }`}>
                      {label}
                    </span>
                  </div>

                  {/* Dye dot or clear button */}
                  <div className="flex items-center gap-1 shrink-0">
                    <div
                      className="w-3 h-3 rounded-2xs border border-[#49382C]/25 transition-colors shadow-2xs"
                      style={{ backgroundColor: displayColour || NATURAL_COLORS[zone] }}
                      title={
                        appliedColour
                          ? `Custom dyed: ${appliedColour}`
                          : defaultColour
                          ? `Palette assigned: ${defaultColour}`
                          : 'Natural fabric tone'
                      }
                    />
                    {appliedColour && isEquipped && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyColour?.(zone, null);
                        }}
                        className="text-[9px] font-mono text-[#7C3F2A] hover:underline font-bold"
                        title="Remove dye"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtitle description */}
                <div className="flex items-center justify-between text-[8px] font-sans leading-tight pl-4">
                  <span className={`truncate ${isEquipped ? 'text-[#49382C]/65' : 'text-[#49382C]/40 italic'}`}>
                    {isEquipped ? hint : 'Removed'}
                  </span>
                  {isEquipped && appliedColour && (
                    <span className="font-mono text-[7.5px] text-[#34483A] font-semibold uppercase ml-1 shrink-0" title="Custom dyed">
                      {appliedColour}
                    </span>
                  )}
                  {isEquipped && !appliedColour && defaultColour && (
                    <span className="font-mono text-[7.5px] text-[#49382C]/65 font-medium uppercase ml-1 shrink-0" title="Palette assigned">
                      {defaultColour}
                    </span>
                  )}
                  {isEquipped && !appliedColour && !defaultColour && canDye && (
                    <span className="text-[7.5px] text-[#34483A] font-semibold underline ml-1 shrink-0">
                      Dye
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Dynamic Helper Note */}
          <div className="pt-1 border-t border-[#49382C]/08 mt-0.5">
            {selectedSwatch ? (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-2xs shrink-0 border border-[#49382C]/30 shadow-xs"
                  style={{ backgroundColor: selectedSwatch.hex }}
                />
                <p className="text-[8px] font-sans text-[#34483A] font-medium leading-tight">
                  Click garment to apply {selectedSwatch.hex}
                </p>
              </div>
            ) : (
              <p className="text-[8px] font-sans text-[#49382C]/45 leading-tight">
                Select colour on Page 03 to dye garments.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 mt-1 border-t border-[#49382C]/15 flex items-center justify-between text-[8.5px] font-mono text-[#49382C]/60">
        <span>2D Layered System</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#34483A] font-semibold">Anvaya Studio</span>
          {/* Anvaya 'A' — forest green, flips back to front page */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onReturn?.(); }}
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

      {/* Mannequin Zoom Modal / Detailed Inspection Panel */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-[#2C1810]/55 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in select-none"
          onClick={() => handleZoomChange(false)}
        >
          <div 
            className="relative bg-[#FAF8F3] border border-[#49382C]/25 rounded-xs p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#49382C]/15">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#34483A] font-semibold">
                    Chromatic Mannequin Study
                  </span>
                  <span className="text-[#49382C]/30">•</span>
                  <span className="text-[9px] font-mono text-[#49382C]/60 uppercase tracking-wider">
                    {palette?.name || 'Detailed Inspection'}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-[#49382C] font-normal leading-tight">
                  Enlarged Silhouette Detail
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => handleZoomChange(false)}
                className="w-8 h-8 rounded-full border border-[#49382C]/20 bg-[#FAF8F3] hover:bg-[#EFEAE0] text-[#49382C] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                title="Close inspection view"
                aria-label="Close inspection view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Enlarged Mannequin Display Stage */}
            <div className="flex-1 flex items-center justify-center min-h-0 my-2">
              <div 
                className="relative flex items-center justify-center p-3 rounded-xs border border-[#49382C]/18 bg-[#F5F1E8]/70 shadow-[inset_0_1px_3px_rgba(73,56,44,0.08),inset_0_0_0_1px_rgba(255,255,255,0.45),0_1px_0_rgba(255,255,255,0.6)]"
                style={{ width: 'min(68vh, 460px)', height: 'min(68vh, 460px)', maxWidth: '100%' }}
              >
                <SilhouetteFigure
                  activeZone={null}
                  activeGarments={activeGarments}
                  palette={palette}
                  zoneColours={zoneColours}
                  canApply={false}
                />
              </div>
            </div>

            {/* Footer Meta: Equipped Garments & Palette Colours Chips */}
            <div className="pt-3 mt-2 border-t border-[#49382C]/15 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#49382C]/70">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wider font-semibold text-[#34483A]">Palette Harmonies:</span>
                {(palette?.swatches || []).map((swatch, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-2xs border border-[#49382C]/25" style={{ backgroundColor: swatch.hex }} />
                    <span className="text-[9px] font-mono uppercase">{swatch.hex}</span>
                  </div>
                ))}
              </div>
              <span className="italic text-[9.5px]">ESC or click backdrop to close</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PaletteDetailSpread — Mobile stacked view (holds shared colour state)
// ---------------------------------------------------------------------------

export default function PaletteDetailSpread({
  palette,
  onReturn,
  activeGarments: parentActiveGarments,
  onToggleGarment: parentToggleGarment,
  onSetGarments: parentSetGarments,
  zoneColours: parentZoneColours,
  onApplyColour: parentApplyColour,
  onResetColours: parentResetColours,
  selectedSwatch: parentSelectedSwatch,
  onSelectSwatch: parentSelectSwatch,
  className = '',
  isLeftZoomed,
  onLeftZoomChange,
  isRightZoomed,
  onRightZoomChange,
}) {
  if (!palette) return null;

  const [localSwatch, setLocalSwatch] = useState(null);
  const [localColours, setLocalColours] = useState({});
  const [localGarments, setLocalGarments] = useState({
    outerwear: true,
    topwear: true,
    bottomwear: true,
    accessories: true,
  });

  const selectedSwatch = parentSelectedSwatch !== undefined ? parentSelectedSwatch : localSwatch;
  const onSelectSwatch = parentSelectSwatch || setLocalSwatch;

  const zoneColours = parentZoneColours !== undefined ? parentZoneColours : localColours;
  const onApplyColour = parentApplyColour || ((zone, hex) => {
    if (hex === null) {
      setLocalColours(prev => {
        const next = { ...prev };
        delete next[zone];
        return next;
      });
    } else {
      setLocalColours(prev => ({ ...prev, [zone]: hex }));
    }
  });
  const onResetColours = parentResetColours || (() => setLocalColours({}));

  const activeGarments = parentActiveGarments !== undefined ? parentActiveGarments : localGarments;
  const onToggleGarment = parentToggleGarment || ((zone) => setLocalGarments(prev => ({ ...prev, [zone]: !prev[zone] })));
  const onSetGarments = parentSetGarments || setLocalGarments;

  return (
    <div className={`flex flex-col md:flex-row w-full h-full ${className}`}>
      <div className="w-full md:w-1/2 h-full">
        <DetailLeftPage
          palette={palette}
          onReturn={onReturn}
          selectedSwatch={selectedSwatch}
          onSelectSwatch={onSelectSwatch}
          isZoomed={isLeftZoomed}
          onZoomChange={onLeftZoomChange}
        />
      </div>
      <div className="w-full md:w-1/2 h-full">
        <DetailRightPage
          palette={palette}
          onReturn={onReturn}
          selectedSwatch={selectedSwatch}
          onSelectSwatch={onSelectSwatch}
          activeGarments={activeGarments}
          onToggleGarment={onToggleGarment}
          onSetGarments={onSetGarments}
          zoneColours={zoneColours}
          onApplyColour={onApplyColour}
          onResetColours={onResetColours}
          isZoomed={isRightZoomed}
          onZoomChange={onRightZoomChange}
        />
      </div>
    </div>
  );
}
