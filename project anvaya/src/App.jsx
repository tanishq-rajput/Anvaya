import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PrimaryOptions from './components/PrimaryOptions';
import ColourArchiveBook from './components/ColourArchiveBook';
import CuratedRecommendations from './components/CuratedRecommendations';
import WardrobeCurtain from './components/WardrobeCurtain';
import InteractiveModal from './components/InteractiveModal';
import Footer from './components/Footer';
import BotanicalTree from './components/BotanicalTree';
import DeveloperDashboard from './components/DeveloperDashboard';

export default function App() {
  const [activeModalOption, setActiveModalOption] = useState(null);
  const [isWardrobeCurtainOpen, setIsWardrobeCurtainOpen] = useState(false);
  const [isDevModeActive, setIsDevModeActive] = useState(false);
  const [isDevAuthenticated, setIsDevAuthenticated] = useState(false);

  const handleSelectOption = (optionKey) => {
    if (optionKey === 'wardrobe') {
      setIsWardrobeCurtainOpen(true);
    } else if (optionKey === 'recommend') {
      const el = document.getElementById('curated-recommendations');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setActiveModalOption('recommend');
      }
    } else {
      setActiveModalOption(optionKey);
    }
  };

  const handleSelectOutfit = (outfit) => {
    setActiveModalOption(outfit);
  };

  const handleExploreLookbook = (shade) => {
    const el = document.getElementById('curated-recommendations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCloseModal = () => {
    setActiveModalOption(null);
  };

  const handleToggleCurtain = () => {
    setIsWardrobeCurtainOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-cream text-espresso relative flex flex-col selection:bg-forest selection:text-cream font-sans overflow-x-clip">
      {isDevModeActive ? (
        /* Dedicated Developer Mode Dashboard */
        <DeveloperDashboard 
          onExit={() => setIsDevModeActive(false)} 
        />
      ) : (
        <>
          {/* Delicate Continuous Botanical Tree Background Illustration */}
          <BotanicalTree />

          {/* Primary Page Content Layer (z-10 ensures clean interaction and layering) */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* 1. Chocolate Woven Wool Fabric Navbar with Cream Woven Wordmark */}
            <Navbar 
              isDevAuthenticated={isDevAuthenticated}
              onOpenDevMode={() => setIsDevModeActive(true)}
              onUnlockSuccess={() => {
                setIsDevAuthenticated(true);
                setIsDevModeActive(true);
              }}
            />

            {/* Main Editorial Content */}
            <main className="flex-1">
              {/* 2. Editorial Hero Section with Integrated Dynamic Hero Showcase */}
              <Hero />

              {/* 3. The Colour Archive – Physical Book / Magazine Experience (9 Volumes, Light-to-Dark Swatches) */}
              <ColourArchiveBook onExploreLookbook={handleExploreLookbook} />

              {/* 4. Curated Style Recommendations directly on the Homepage */}
              <CuratedRecommendations onSelectOutfit={handleSelectOutfit} />
            </main>

            {/* 6. Forest Green Editorial Footer with Aligned Roots */}
            <Footer />
          </div>

          {/* 7. Style Your Wardrobe Atelier Curtain (Preserved for V2 development) */}
          {/* <WardrobeCurtain 
            isOpen={isWardrobeCurtainOpen}
            onToggle={handleToggleCurtain}
          /> */}

          {/* 8. Interactive Specimen Modal (When an outfit or deep exploration is opened) */}
          <InteractiveModal
            activeOption={activeModalOption}
            onClose={handleCloseModal}
          />
        </>
      )}
    </div>
  );
}
