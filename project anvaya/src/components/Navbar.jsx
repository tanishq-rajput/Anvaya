import React, { useState, useEffect } from 'react';
import { Code, Lock, Eye, EyeOff, X, Check, Menu } from 'lucide-react';

/**
 * Temporary prototype authentication check.
 * Isolated function so it can be swapped for secure server-side auth later.
 */
function verifyDeveloperPassword(attempt) {
  const PROTOTYPE_PASSWORD = 'password';
  return attempt === PROTOTYPE_PASSWORD;
}

/**
 * Editorial Top Navigation Bar
 * 
 * - Opaque chocolate-brown woven wool fabric texture (#593D2F base).
 * - Woven cream (#F3EDE2) ANVAYA wordmark with subtle thread-relief integration.
 * - Completely opaque, preserving compact height (~64-68px) and centered layout.
 * - Extreme left: Understated circular button for Developer Access with password dialog.
 */
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'hue-atelier', label: 'Hue Atelier' },
  { id: 'fit-check', label: 'Fit Check' },
  { id: 'contact', label: 'Contact' }
];

export default function Navbar({ 
  isDevAuthenticated = false, 
  onOpenDevMode, 
  onUnlockSuccess 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeOption, setActiveOption] = useState('home');
  const [hoveredOption, setHoveredOption] = useState(null);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authStatus, setAuthStatus] = useState('idle'); // 'idle' | 'error' | 'success'
  const [errorMessage, setErrorMessage] = useState('');

  // Close sidebar or dev modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isSidebarOpen) {
          setIsSidebarOpen(false);
          setHoveredOption(null);
        } else if (isDevModalOpen) {
          handleCloseModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, isDevModalOpen]);

  // Track scroll position to update active destination state dynamically
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const contactEl = document.getElementById('contact');
      const fitCheckEl = document.getElementById('curated-recommendations');
      const hueAtelierEl = document.getElementById('colour-archive');

      const contactTop = contactEl ? contactEl.offsetTop - 350 : Infinity;
      const fitCheckTop = fitCheckEl ? fitCheckEl.offsetTop - 350 : Infinity;
      const hueAtelierTop = hueAtelierEl ? hueAtelierEl.offsetTop - 350 : Infinity;

      if (scrollY >= contactTop) {
        setActiveOption('contact');
      } else if (scrollY >= fitCheckTop) {
        setActiveOption('fit-check');
      } else if (scrollY >= hueAtelierTop) {
        setActiveOption('hue-atelier');
      } else {
        setActiveOption('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Smooth navigation handler
   * - Closes the sidebar
   * - Smoothly scrolls to target section
   * - Retains active destination state
   */
  const handleNavigate = (destination) => {
    setActiveOption(destination);
    setIsSidebarOpen(false);
    setHoveredOption(null);

    if (destination === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const el = document.getElementById('home');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (destination === 'hue-atelier') {
      const el = document.getElementById('colour-archive');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (destination === 'fit-check') {
      const el = document.getElementById('curated-recommendations');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (destination === 'contact') {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenModal = () => {
    // If session is already authenticated, directly open Developer Mode without asking for password
    if (isDevAuthenticated && onOpenDevMode) {
      onOpenDevMode();
      return;
    }
    setPasswordInput('');
    setShowPassword(false);
    setAuthStatus('idle');
    setErrorMessage('');
    setIsDevModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDevModalOpen(false);
    setPasswordInput('');
    setShowPassword(false);
    setAuthStatus('idle');
    setErrorMessage('');
  };

  const handleContinue = () => {
    handleCloseModal();
    if (onUnlockSuccess) {
      onUnlockSuccess();
    } else if (onOpenDevMode) {
      onOpenDevMode();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyDeveloperPassword(passwordInput)) {
      setAuthStatus('success');
      setErrorMessage('');
    } else {
      setAuthStatus('error');
      setErrorMessage('Incorrect password. Please try again.');
    }
  };

  return (
    <>
      {/* 1. Permanent Top Navbar: stays on top of viewport at all times, above sidebar and backdrop */}
      <header className="sticky top-0 z-50 woven-fabric-navbar border-b border-[#3A241A]/70 shadow-sm h-14 sm:h-[58px] flex items-center justify-center relative">
        {/* Extreme Left: Navigation Button (Opens and Closes Sidebar) */}
        <div className="absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20">
          <button
            type="button"
            onClick={() => {
              setIsSidebarOpen((prev) => !prev);
              setHoveredOption(null);
            }}
            aria-label={isSidebarOpen ? "Close navigation sidebar" : "Open navigation sidebar"}
            aria-expanded={isSidebarOpen}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#483327]/80 hover:bg-[#34483A] text-[#F3EDE2]/80 hover:text-[#FAF8F3] border border-[#F3EDE2]/20 hover:border-[#34483A] shadow-xs hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#F3EDE2]/40"
          >
            {isSidebarOpen ? (
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.75]" />
            ) : (
              <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.75]" />
            )}
          </button>
        </div>

        {/* Centered ANVAYA Wordmark (Preserved exactly at center) */}
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 flex items-center justify-center pointer-events-none">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('home');
            }}
            aria-label="ANVAYA Homepage"
            className="group block text-center focus:outline-none pointer-events-auto"
          >
            <span className="font-serif text-lg sm:text-xl font-medium uppercase woven-cream-wordmark inline-block select-none tracking-[0.22em]">
              ANVAYA
            </span>
          </a>
        </div>

        {/* Extreme Right: Developer Mode Button (Simple button, no tooltip) */}
        <div className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20">
          <button
            type="button"
            onClick={handleOpenModal}
            aria-label="Developer Mode"
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#483327]/80 hover:bg-[#34483A] text-[#F3EDE2]/70 hover:text-[#FAF8F3] border border-[#F3EDE2]/20 hover:border-[#34483A] shadow-xs hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#F3EDE2]/40"
          >
            <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.75]" />
          </button>
        </div>
      </header>

      {/* Subtle Text-Only Navigation Sidebar */}
      {/* 2. Backdrop Overlay (begins strictly below navbar, so navbar is never dimmed or covered) */}
      <div
        className={`fixed top-14 sm:top-[58px] left-0 right-0 bottom-0 z-40 bg-[#2E221A]/40 backdrop-blur-xs transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          setIsSidebarOpen(false);
          setHoveredOption(null);
        }}
        aria-hidden={!isSidebarOpen}
      />

      {/* 3. Text-Only Sidebar Panel (begins strictly below navbar, aligned to top with left alignment) */}
      <aside
        id="navigation-sidebar"
        aria-label="Site Navigation"
        aria-hidden={!isSidebarOpen}
        onMouseLeave={() => setHoveredOption(null)}
        className={`fixed top-14 sm:top-[58px] left-0 bottom-0 z-40 w-64 sm:w-72 bg-[#FAF8F3] border-r border-[#49382C]/15 shadow-2xl flex flex-col justify-start px-7 sm:px-9 pt-8 sm:pt-10 pb-8 transition-transform duration-300 ease-out overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav 
          className="flex flex-col space-y-5 sm:space-y-6"
          onMouseLeave={() => setHoveredOption(null)}
        >
          {NAV_ITEMS.map((item) => {
            const isHovered = hoveredOption === item.id;
            const isOtherHovered = hoveredOption !== null && !isHovered;
            const isActive = activeOption === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setHoveredOption(item.id)}
                onClick={() => handleNavigate(item.id)}
                className={`relative inline-block text-left font-serif tracking-tight transition-all duration-300 ease-out origin-left focus:outline-none select-none motion-reduce:transform-none motion-reduce:transition-none py-1 w-fit ${
                  isActive ? 'font-medium' : 'font-light'
                } ${
                  isHovered
                    ? `text-[1.35rem] sm:text-[1.55rem] ${isActive ? 'text-[#34483A]' : 'text-[#2E221A]'} scale-[1.08] opacity-100`
                    : isOtherHovered
                      ? `text-[1.15rem] sm:text-[1.3rem] ${isActive ? 'text-[#34483A]/85' : 'text-[#49382C]/65'} scale-[0.92] opacity-75`
                      : `text-[1.25rem] sm:text-[1.4rem] ${isActive ? 'text-[#34483A]' : 'text-[#49382C]'} scale-100 opacity-100`
                }`}
                style={{
                  textShadow: isHovered
                    ? '0 0 16px rgba(118, 84, 60, 0.45), 0 0 4px rgba(73, 56, 44, 0.25)'
                    : 'none'
                }}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-[1px] transition-all duration-300 ease-out pointer-events-none ${
                    isActive ? 'bg-[#34483A]' : 'bg-[#593D2F]/80'
                  } ${
                    isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Developer Access Password Dialog Modal */}
      {isDevModalOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={handleCloseModal}
          aria-hidden={!isDevModalOpen}
        >
          <div 
            className="relative w-full max-w-sm sm:max-w-md bg-[#FAF8F3] border border-[#49382C]/30 rounded-sm shadow-2xl p-6 sm:p-8 text-[#49382C]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dev-access-title"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-1.5 text-[#49382C]/60 hover:text-[#49382C] hover:bg-[#EFE9DF] rounded-xs transition-colors focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Heading & Supporting Text */}
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-full bg-[#EFE9DF] border border-[#49382C]/20 flex items-center justify-center mx-auto mb-3 text-[#49382C]">
                <Lock className="w-4 h-4 stroke-[2]" />
              </div>
              <h2 id="dev-access-title" className="font-serif text-2xl text-[#49382C] font-normal tracking-tight">
                Developer Access
              </h2>
              <p className="mt-1.5 text-xs text-[#49382C]/70 font-sans tracking-wide">
                Restricted area. Authorised access only.
              </p>
            </div>

            {authStatus === 'success' ? (
              /* Successful Unlocked State */
              <div className="text-center py-2 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#34483A]/10 border border-[#34483A]/30 text-[#34483A] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#34483A] font-medium">
                    Access Granted
                  </h3>
                  <p className="text-xs text-[#49382C]/70 font-sans mt-1">
                    Authorisation verified. Developer Mode unlocked.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full py-2.5 px-4 text-xs font-sans tracking-wider uppercase font-semibold bg-[#34483A] hover:bg-[#28382D] text-[#FAF8F3] rounded-xs shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#34483A]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              /* Password Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="dev-password-input"
                    className="block text-[10px] font-mono uppercase tracking-wider text-[#49382C]/80 mb-1.5 font-semibold"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="dev-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (authStatus === 'error') {
                          setAuthStatus('idle');
                          setErrorMessage('');
                        }
                      }}
                      placeholder="Enter password..."
                      autoFocus
                      className="w-full bg-[#F3EDE2] border border-[#49382C]/35 rounded-xs px-3.5 py-2.5 text-sm text-[#49382C] placeholder-[#49382C]/40 focus:outline-none focus:border-[#49382C] focus:ring-1 focus:ring-[#49382C] pr-10 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#49382C]/60 hover:text-[#49382C] focus:outline-none p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Error Message */}
                  {authStatus === 'error' && (
                    <p className="mt-2 text-xs text-[#8B261E] font-medium">
                      {errorMessage}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-xs font-sans tracking-wider uppercase text-[#49382C]/80 hover:text-[#49382C] transition-colors focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-sans tracking-wider uppercase font-semibold bg-[#49382C] hover:bg-[#34483A] text-[#FAF8F3] rounded-xs shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#49382C]"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
