import React from 'react';
import HeroShowcase from './HeroShowcase';

/**
 * Editorial Hero Section
 * 
 * - Full campaign-scale visual presentation.
 * - Slogan overlaid directly onto the photograph.
 * - Introductory labels and descriptive subtitles removed for an authentic luxury fashion editorial impact.
 */
export default function Hero() {
  return (
    <section id="home" className="relative pt-4 sm:pt-6 pb-10 sm:pb-14 md:pb-16 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <HeroShowcase />
      </div>
    </section>
  );
}
