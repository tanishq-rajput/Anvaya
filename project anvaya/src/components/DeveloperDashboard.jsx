import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Layers,
  Sparkles,
  FolderKanban,
  ShieldCheck,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  X,
  Info,
  Check,
  MessageSquare
} from 'lucide-react';
import ImageLibraryManager from './ImageLibraryManager';
import EmptyStateMessagesManager from './EmptyStateMessagesManager';
import {
  getAllCategories,
  saveCategory,
  deleteCategory,
  getAllLibraryCounts,
  generateUniqueId,
  DEFAULT_STYLE_CATEGORIES
} from '../services/imageStorage';
import { getEmptyStateMessages } from '../services/emptyStateMessages';

/**
 * Anvaya Developer Mode Dashboard (Step 3 Functional Asset Suite)
 * 
 * Features:
 * - Independent Hero Showcase Image Library
 * - Independent Style Libraries for each category (Minimalist, Old Money, etc.)
 * - Category CRUD: Create new categories, rename, delete with confirmation
 * - Persistent storage with IndexedDB (raw Blobs, metadata, and categories)
 * - Live image count badges across all libraries
 */
export default function DeveloperDashboard({ onExit }) {
  const [currentView, setCurrentView] = useState('overview'); // 'overview' | 'hero' | 'styles' | 'empty-messages'
  const [activeMode, setActiveMode] = useState('women'); // 'women' | 'men' | 'neutral'
  const [categories, setCategories] = useState(DEFAULT_STYLE_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState('women_minimalist');
  const [libraryCounts, setLibraryCounts] = useState({});
  const [emptyMessagesCount, setEmptyMessagesCount] = useState(0);
  const [emptyMessagesTotalCount, setEmptyMessagesTotalCount] = useState(0);
  const [sampleEmptyMessage, setSampleEmptyMessage] = useState('Space left empty for dramatic effect.');

  // Category Modal States
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showRenameCategoryModal, setShowRenameCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);

  // Form Fields
  const [newCatName, setNewCatName] = useState('');
  const [newCatTagline, setNewCatTagline] = useState('');
  const [editCatName, setEditCatName] = useState('');
  const [editCatTagline, setEditCatTagline] = useState('');
  const [modalError, setModalError] = useState('');

  /**
   * Load categories and live image counts from IndexedDB
   */
  const loadInitialData = useCallback(async () => {
    try {
      const [fetchedCategories, counts] = await Promise.all([
        getAllCategories(),
        getAllLibraryCounts()
      ]);
      setCategories(fetchedCategories);
      setLibraryCounts(counts);

      const emptyMsgs = getEmptyStateMessages();
      setEmptyMessagesTotalCount(emptyMsgs.length);
      const activeMsgs = emptyMsgs.filter(m => m.enabled);
      setEmptyMessagesCount(activeMsgs.length);
      if (activeMsgs.length > 0) {
        setSampleEmptyMessage(activeMsgs[0].text);
      }

      const inCurrentMode = fetchedCategories.filter(c => (c.mode || 'women') === activeMode);
      if (inCurrentMode.length > 0 && !inCurrentMode.some(c => c.id === selectedCategoryId)) {
        setSelectedCategoryId(inCurrentMode[0].id);
      }
    } catch (err) {
      console.error('Failed to load dashboard data from IndexedDB:', err);
    }
  }, [selectedCategoryId, activeMode]);

  useEffect(() => {
    loadInitialData();

    const handleAssetsUpdated = () => {
      loadInitialData();
    };

    window.addEventListener('anvaya_assets_updated', handleAssetsUpdated);
    return () => {
      window.removeEventListener('anvaya_assets_updated', handleAssetsUpdated);
    };
  }, [loadInitialData]);

  /**
   * Keep track of live image count changes from ImageLibraryManager
   */
  const handleCountChange = useCallback((libraryId, count) => {
    setLibraryCounts(prev => ({ ...prev, [libraryId]: count }));
  }, []);

  const modeCategories = categories.filter(c => (c.mode || 'women') === activeMode);
  const selectedCategory = modeCategories.find(c => c.id === selectedCategoryId) || modeCategories[0] || null;

  const heroImageCount = libraryCounts['hero'] || 0;
  const totalStyleImagesCount = Object.keys(libraryCounts)
    .filter(k => k.startsWith('style_'))
    .reduce((acc, k) => acc + (libraryCounts[k] || 0), 0);

  /**
   * Handle Create New Category
   */
  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      setModalError('Category name is required.');
      return;
    }
    const baseSlug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || generateUniqueId('cat');
    const slug = `${activeMode}_${baseSlug}`;
    if (categories.some(c => c.id === slug || (c.name.toLowerCase() === trimmed.toLowerCase() && (c.mode || 'women') === activeMode))) {
      setModalError(`A category named "${trimmed}" already exists in the ${activeMode} collection.`);
      return;
    }

    const newCat = {
      id: slug,
      mode: activeMode,
      name: trimmed,
      tagline: newCatTagline.trim() || 'Curated aesthetic collection.',
      description: 'Custom curated style library registered via Anvaya Developer Mode.',
      sampleColors: ['#FAF8F3', '#D5DDE0', '#788E9C', '#49382C']
    };

    try {
      await saveCategory(newCat);
      setCategories(prev => [...prev, newCat]);
      setSelectedCategoryId(newCat.id);
      setNewCatName('');
      setNewCatTagline('');
      setModalError('');
      setShowAddCategoryModal(false);
      setCurrentView('styles');
    } catch (err) {
      console.error('Failed to save category:', err);
      setModalError('Failed to save category to IndexedDB.');
    }
  };

  /**
   * Handle Rename Category
   */
  const handleRenameCategorySubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;
    const trimmed = editCatName.trim();
    if (!trimmed) {
      setModalError('Category name is required.');
      return;
    }

    const updated = {
      ...selectedCategory,
      name: trimmed,
      tagline: editCatTagline.trim() || selectedCategory.tagline
    };

    try {
      await saveCategory(updated);
      setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
      setModalError('');
      setShowRenameCategoryModal(false);
    } catch (err) {
      console.error('Failed to update category:', err);
      setModalError('Failed to update category in IndexedDB.');
    }
  };

  /**
   * Handle Delete Category
   */
  const handleConfirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory.id);
      const remaining = categories.filter(c => c.id !== selectedCategory.id);
      setCategories(remaining);
      setLibraryCounts(prev => {
        const copy = { ...prev };
        delete copy[`style_${selectedCategory.id}`];
        return copy;
      });

      const remainingInMode = remaining.filter(c => (c.mode || 'women') === activeMode);
      if (remainingInMode.length > 0) {
        setSelectedCategoryId(remainingInMode[0].id);
      } else {
        setSelectedCategoryId('');
      }

      setShowDeleteCategoryModal(false);
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#49382C] font-sans flex flex-col selection:bg-[#34483A] selection:text-[#FAF8F3]">

      {/* 1. TOP EDITORIAL BAR */}
      <header className="sticky top-0 z-30 bg-[#FAF8F3]/95 backdrop-blur-xs border-b border-[#49382C]/15 px-4 sm:px-8 py-3 sm:py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            <span className="font-serif text-lg sm:text-xl font-medium tracking-luxury uppercase select-none shrink-0 text-[#49382C]">
              ANVAYA
            </span>
            <span className="text-[#49382C]/30 text-sm hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-xs text-[#49382C]/70 truncate font-mono">
              <button
                type="button"
                onClick={() => setCurrentView('overview')}
                className={`hover:text-[#49382C] transition-colors ${currentView === 'overview' ? 'font-semibold text-[#49382C]' : ''}`}
              >
                Developer Mode
              </button>
              {currentView === 'hero' && (
                <>
                  <span className="text-[#49382C]/40">/</span>
                  <span className="font-semibold text-[#49382C]">Hero Showcase</span>
                </>
              )}
              {currentView === 'styles' && (
                <>
                  <span className="text-[#49382C]/40">/</span>
                  <button
                    type="button"
                    onClick={() => setCurrentView('styles')}
                    className="hover:text-[#49382C]"
                  >
                    Style Libraries
                  </button>
                  <span className="text-[#49382C]/40">/</span>
                  <span className="font-semibold text-[#34483A] truncate">{selectedCategory?.name}</span>
                </>
              )}
              {currentView === 'empty-messages' && (
                <>
                  <span className="text-[#49382C]/40">/</span>
                  <span className="font-semibold text-[#34483A]">Empty State Messages</span>
                </>
              )}
            </div>
          </div>

          {/* Right Action: Exit Developer Mode */}
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-sans uppercase tracking-wider font-medium text-[#49382C] hover:text-[#FAF8F3] hover:bg-[#49382C] border border-[#49382C]/30 rounded-xs shadow-xs transition-colors shrink-0 focus:outline-none focus:ring-1 focus:ring-[#49382C]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Developer Mode</span>
          </button>

        </div>
      </header>

      {/* 2. MAIN DASHBOARD WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">

        {/* VIEW A: DASHBOARD OVERVIEW */}
        {currentView === 'overview' && (
          <div className="space-y-10 sm:space-y-12 animate-fade-in">

            {/* Header Title & Description */}
            <div className="border-b border-[#49382C]/15 pb-6 sm:pb-8">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#34483A] font-semibold block mb-2">
                    Visual Assets & Configuration
                  </span>
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#49382C] font-normal tracking-tight">
                    Developer Mode
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-[#49382C]/75 font-sans max-w-2xl leading-relaxed">
                    Manage the visual assets and styling experience of Anvaya. Every library supports multi-image curation, drag-and-drop ingestion, primary selection, and local persistence.
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#EFE9DF] border border-[#49382C]/15 rounded-xs text-xs font-mono text-[#49382C] shrink-0 self-start md:self-auto shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-[#34483A]" />
                  <span>Session Active (IndexedDB Enabled)</span>
                </div>
              </div>
            </div>

            {/* Three Main Management Sections Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

              {/* Card 1: Hero Showcase */}
              <div
                onClick={() => setCurrentView('hero')}
                className="group relative bg-[#F3EDE2] border border-[#49382C]/20 hover:border-[#49382C]/50 rounded-sm p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg cursor-pointer select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FAF8F3] border border-[#49382C]/20 flex items-center justify-center text-[#49382C] group-hover:scale-105 group-hover:bg-[#34483A] group-hover:text-[#FAF8F3] transition-all">
                      <ImageIcon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#34483A] bg-[#FAF8F3] border border-[#34483A]/20 px-2.5 py-1 rounded-xs font-semibold">
                      {heroImageCount} {heroImageCount === 1 ? 'image' : 'images'}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-[#49382C] font-normal group-hover:text-[#34483A] transition-colors">
                    Hero Showcase
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#49382C]/75 font-sans leading-relaxed">
                    Manage the images displayed in the homepage showcase. Supports multi-image uploads, drag-and-drop, custom order sequence, and primary photo selection.
                  </p>

                  {/* Wireframe Mini Preview Box */}
                  <div className="mt-6 p-4 bg-[#FAF8F3] border border-[#49382C]/15 rounded-xs relative overflow-hidden">
                    <div className="aspect-[2.2/1] w-full border border-dashed border-[#49382C]/30 rounded-xs flex flex-col items-center justify-center text-center p-3 bg-[#F3EDE2]/50">
                      <Sparkles className="w-4 h-4 text-[#34483A] mb-1 opacity-80" />
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#49382C]/80 font-medium">
                        2.2:1 Homepage Showcase
                      </span>
                      <span className="text-[9px] text-[#49382C]/60 mt-0.5">
                        {heroImageCount > 0 ? `${heroImageCount} assets stored in IndexedDB` : 'Click to upload multiple images'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#49382C]/15 flex items-center justify-between text-xs font-sans uppercase tracking-wider font-semibold text-[#49382C] group-hover:text-[#34483A]">
                  <span>Open Showcase Manager</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Card 2: Style Libraries */}
              <div
                onClick={() => setCurrentView('styles')}
                className="group relative bg-[#F3EDE2] border border-[#49382C]/20 hover:border-[#49382C]/50 rounded-sm p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg cursor-pointer select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FAF8F3] border border-[#49382C]/20 flex items-center justify-center text-[#49382C] group-hover:scale-105 group-hover:bg-[#34483A] group-hover:text-[#FAF8F3] transition-all">
                      <FolderKanban className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#34483A] bg-[#FAF8F3] border border-[#34483A]/20 px-2.5 py-1 rounded-xs font-semibold">
                      {categories.length} Categories • {totalStyleImagesCount} Assets
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-[#49382C] font-normal group-hover:text-[#34483A] transition-colors">
                    Style Libraries
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#49382C]/75 font-sans leading-relaxed">
                    Organise the images used across Anvaya's recommended styles. Add, rename, and delete custom categories, each maintaining its own independent multi-image collection.
                  </p>

                  {/* Category Tags Preview Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
                    {categories.slice(0, 6).map((cat) => {
                      const count = libraryCounts[`style_${cat.id}`] || 0;
                      return (
                        <div
                          key={cat.id}
                          className="px-2.5 py-1.5 bg-[#FAF8F3] border border-[#49382C]/15 rounded-xs flex items-center justify-between text-[#49382C]"
                        >
                          <span className="font-serif text-xs truncate">{cat.name}</span>
                          <span className="text-[10px] font-mono text-[#34483A] ml-1 shrink-0 font-medium">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#49382C]/15 flex items-center justify-between text-xs font-sans uppercase tracking-wider font-semibold text-[#49382C] group-hover:text-[#34483A]">
                  <span>Manage Style Libraries</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Card 3: Empty State Messages */}
              <div
                onClick={() => setCurrentView('empty-messages')}
                className="group relative bg-[#F3EDE2] border border-[#49382C]/20 hover:border-[#49382C]/50 rounded-sm p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg cursor-pointer select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FAF8F3] border border-[#49382C]/20 flex items-center justify-center text-[#49382C] group-hover:scale-105 group-hover:bg-[#34483A] group-hover:text-[#FAF8F3] transition-all">
                      <MessageSquare className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#34483A] bg-[#FAF8F3] border border-[#34483A]/20 px-2.5 py-1 rounded-xs font-semibold">
                      {emptyMessagesCount} of {emptyMessagesTotalCount} Active
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-[#49382C] font-normal group-hover:text-[#34483A] transition-colors">
                    Empty State Messages
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#49382C]/75 font-sans leading-relaxed">
                    Manage the humorous placeholder messages displayed in the About section when outfit cards have no manually entered text.
                  </p>

                  {/* Wireframe Mini Preview Box */}
                  <div className="mt-6 p-4 bg-[#FAF8F3] border border-[#49382C]/15 rounded-xs relative overflow-hidden">
                    <div className="aspect-[2.2/1] w-full border border-dashed border-[#49382C]/30 rounded-xs flex flex-col items-center justify-center text-center p-3 bg-[#F3EDE2]/50">
                      <Sparkles className="w-4 h-4 text-[#34483A] mb-1 opacity-80" />
                      <span className="text-[11px] font-serif italic text-[#49382C] font-normal line-clamp-1 max-w-[24ch]">
                        "{sampleEmptyMessage}"
                      </span>
                      <span className="text-[9px] font-mono text-[#49382C]/60 mt-1 uppercase tracking-wider">
                        Active Placeholder Collection
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#49382C]/15 flex items-center justify-between text-xs font-sans uppercase tracking-wider font-semibold text-[#49382C] group-hover:text-[#34483A]">
                  <span>Manage Messages</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

            </div>

            {/* Quick Status / Guidance Banner */}
            <div className="bg-[#EFE9DF]/60 border border-[#49382C]/15 p-5 sm:p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-[#34483A] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#49382C] font-semibold">
                    Local IndexedDB Persistence Active
                  </h4>
                  <p className="text-xs text-[#49382C]/75 font-sans mt-0.5 leading-relaxed">
                    All images and metadata are stored directly in your browser's IndexedDB. Your changes remain intact across browser refreshes and restarts. Visitor-facing pages remain untouched.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onExit}
                className="text-xs font-sans text-[#34483A] hover:underline uppercase tracking-wider font-semibold whitespace-nowrap self-start sm:self-auto"
              >
                Return to Visitor Site →
              </button>
            </div>

          </div>
        )}

        {/* VIEW B: HERO SHOWCASE MANAGEMENT */}
        {currentView === 'hero' && (
          <div className="space-y-6 animate-fade-in">
            {/* Breadcrumb Navigation */}
            <div>
              <button
                type="button"
                onClick={() => setCurrentView('overview')}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#49382C]/80 hover:text-[#34483A] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Developer Overview</span>
              </button>
            </div>

            {/* Reusable Image Management Component */}
            <ImageLibraryManager
              libraryId="hero"
              libraryTitle="Hero Showcase Library"
              librarySubtitle="Manage the images displayed in the homepage panoramic showcase. Multi-file upload, drag & drop, ordering, primary asset designation, and enable/disable toggles are fully enabled."
              aspectRatio="aspect-[2.2/1]"
              onCountChange={handleCountChange}
            />

            {/* Return action footer */}
            <div className="pt-4 border-t border-[#49382C]/15 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView('overview')}
                className="px-4 py-2 text-xs font-sans uppercase tracking-wider border border-[#49382C]/30 rounded-xs hover:bg-[#EFE9DF] transition-colors"
              >
                Back to Overview
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('styles')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-sans uppercase tracking-wider bg-[#49382C] text-[#FAF8F3] hover:bg-[#34483A] rounded-xs shadow-xs transition-colors"
              >
                <span>Navigate to Style Libraries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW C: INDIVIDUAL STYLE LIBRARIES */}
        {currentView === 'styles' && (
          <div className="space-y-6 animate-fade-in">
            {/* Breadcrumb Navigation */}
            <div>
              <button
                type="button"
                onClick={() => setCurrentView('overview')}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#49382C]/80 hover:text-[#34483A] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Developer Overview</span>
              </button>
            </div>

            {/* Collection Switcher: Women's | Men's | Neutral */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#49382C]/15 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#34483A] font-semibold">
                  Active Collection:
                </span>
                <div className="inline-flex items-center p-1 bg-[#FAF8F3] border border-[#49382C]/20 rounded-xs text-xs font-sans tracking-wider uppercase shadow-2xs">
                  {[
                    { key: 'women', label: "Women's" },
                    { key: 'men', label: "Men's" },
                    { key: 'neutral', label: 'Neutral / Shared' }
                  ].map(({ key, label }) => {
                    const count = categories.filter(c => (c.mode || 'women') === key).length;
                    const isActive = activeMode === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setActiveMode(key);
                          const firstInMode = categories.find(c => (c.mode || 'women') === key);
                          if (firstInMode) {
                            setSelectedCategoryId(firstInMode.id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xs transition-all font-semibold ${isActive
                          ? 'bg-[#34483A] text-[#FAF8F3] shadow-xs'
                          : 'text-[#49382C]/70 hover:text-[#34483A]'
                          }`}
                      >
                        <span>{label}</span>
                        <span className={`text-[10px] font-mono ml-1.5 px-1.5 py-0.2 rounded-2xs ${isActive ? 'bg-[#FAF8F3]/20 text-[#FAF8F3]' : 'bg-[#EFE9DF] text-[#49382C]/70'
                          }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedCategory && (
                <div className="text-[11px] font-mono text-[#49382C]/70 hidden sm:block">
                  Category ID: <code className="bg-[#EFE9DF] px-1.5 py-0.5 rounded-2xs text-[#34483A] font-semibold">{selectedCategory.id}</code>
                </div>
              )}
            </div>

            {/* Category Selector Tabs & Management Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#49382C]/15">

              {/* Category Pills for Active Mode */}
              <div className="flex flex-wrap items-center gap-2">
                {modeCategories.map((cat) => {
                  const isActive = cat.id === selectedCategoryId;
                  const count = libraryCounts[`style_${cat.id}`] || 0;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-sans rounded-xs transition-all uppercase tracking-wider ${isActive
                        ? 'bg-[#49382C] text-[#FAF8F3] font-semibold shadow-xs'
                        : 'bg-[#F3EDE2] text-[#49382C] hover:bg-[#EFE9DF] border border-[#49382C]/20'
                        }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-2xs ${isActive ? 'bg-[#FAF8F3] text-[#49382C]' : 'bg-[#EFE9DF] text-[#49382C]/70'
                        }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}

                {/* + New Category Button */}
                <button
                  type="button"
                  onClick={() => {
                    setNewCatName('');
                    setNewCatTagline('');
                    setModalError('');
                    setShowAddCategoryModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans uppercase tracking-wider text-[#34483A] hover:bg-[#34483A]/10 border border-dashed border-[#34483A]/40 rounded-xs transition-colors font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Category</span>
                </button>
              </div>

              {/* Category Actions: Rename / Delete */}
              {selectedCategory && (
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditCatName(selectedCategory.name);
                      setEditCatTagline(selectedCategory.tagline || '');
                      setModalError('');
                      setShowRenameCategoryModal(true);
                    }}
                    title="Rename this category"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-sans border border-[#49382C]/20 rounded-xs hover:bg-[#EFE9DF] text-[#49382C] transition-colors"
                  >
                    <Edit3 className="w-3 h-3 text-[#49382C]/70" />
                    <span>Rename</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteCategoryModal(true)}
                    title="Delete this category"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-sans border border-red-200 rounded-xs hover:bg-red-50 text-[#8B261E] transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              )}

            </div>

            {/* Active Category Image Library */}
            {selectedCategory ? (
              <ImageLibraryManager
                key={selectedCategory.id}
                libraryId={`style_${selectedCategory.id}`}
                libraryTitle={`${selectedCategory.name} Library`}
                librarySubtitle={selectedCategory.tagline || 'Organise lookbook photographs and styling imagery for this aesthetic.'}
                aspectRatio="aspect-[16/10]"
                onCountChange={handleCountChange}
              />
            ) : (
              <div className="p-12 text-center text-xs font-mono text-[#49382C]/60">
                No style categories available. Click "+ New Category" to create one.
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#49382C]/15 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView('overview')}
                className="px-4 py-2 text-xs font-sans uppercase tracking-wider border border-[#49382C]/30 rounded-xs hover:bg-[#EFE9DF] transition-colors"
              >
                Back to Overview
              </button>
              <button
                type="button"
                onClick={onExit}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-sans uppercase tracking-wider bg-[#49382C] text-[#FAF8F3] hover:bg-[#34483A] rounded-xs shadow-xs transition-colors"
              >
                <span>Exit Developer Mode</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW D: EMPTY STATE MESSAGES MANAGEMENT */}
        {currentView === 'empty-messages' && (
          <EmptyStateMessagesManager onBack={() => setCurrentView('overview')} />
        )}

      </main>

      {/* =====================================================================
          3. ADD NEW CATEGORY MODAL
         ===================================================================== */}
      {showAddCategoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowAddCategoryModal(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#FAF8F3] border border-[#49382C]/30 rounded-sm shadow-2xl p-6 text-[#49382C]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#49382C]/15 mb-4">
              <div>
                <h3 className="font-serif text-2xl text-[#49382C] font-normal">
                  Create Style Category
                </h3>
                <span className="text-[10px] font-mono text-[#34483A] uppercase tracking-wider block mt-0.5 font-semibold">
                  Adding to {activeMode === 'women' ? "Women's" : activeMode === 'men' ? "Men's" : "Neutral / Shared"} Collection
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 text-[#49382C]/60 hover:text-[#49382C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#49382C]/80 mb-1 font-semibold">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bohemian Chic, Resort Wear"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  autoFocus
                  className="w-full bg-[#F3EDE2] border border-[#49382C]/35 rounded-xs px-3.5 py-2 text-sm text-[#49382C] placeholder-[#49382C]/40 focus:outline-none focus:border-[#49382C]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#49382C]/80 mb-1 font-semibold">
                  Aesthetic Tagline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Brief description of this styling aesthetic..."
                  value={newCatTagline}
                  onChange={(e) => setNewCatTagline(e.target.value)}
                  className="w-full bg-[#F3EDE2] border border-[#49382C]/35 rounded-xs px-3.5 py-2 text-sm text-[#49382C] placeholder-[#49382C]/40 focus:outline-none focus:border-[#49382C]"
                />
              </div>

              {modalError && (
                <p className="text-xs text-[#8B261E] font-medium">
                  {modalError}
                </p>
              )}

              <div className="pt-3 border-t border-[#49382C]/15 flex items-center justify-end gap-3 text-xs font-sans uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 text-[#49382C]/80 hover:text-[#49382C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#34483A] hover:bg-[#28382D] text-[#FAF8F3] rounded-xs font-semibold shadow-xs"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. RENAME CATEGORY MODAL
         ===================================================================== */}
      {showRenameCategoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowRenameCategoryModal(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#FAF8F3] border border-[#49382C]/30 rounded-sm shadow-2xl p-6 text-[#49382C]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#49382C]/15 mb-4">
              <h3 className="font-serif text-2xl text-[#49382C] font-normal">
                Rename Category
              </h3>
              <button
                type="button"
                onClick={() => setShowRenameCategoryModal(false)}
                className="p-1 text-[#49382C]/60 hover:text-[#49382C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRenameCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#49382C]/80 mb-1 font-semibold">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  autoFocus
                  className="w-full bg-[#F3EDE2] border border-[#49382C]/35 rounded-xs px-3.5 py-2 text-sm text-[#49382C] focus:outline-none focus:border-[#49382C]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#49382C]/80 mb-1 font-semibold">
                  Aesthetic Tagline
                </label>
                <input
                  type="text"
                  value={editCatTagline}
                  onChange={(e) => setEditCatTagline(e.target.value)}
                  className="w-full bg-[#F3EDE2] border border-[#49382C]/35 rounded-xs px-3.5 py-2 text-sm text-[#49382C] focus:outline-none focus:border-[#49382C]"
                />
              </div>

              {modalError && (
                <p className="text-xs text-[#8B261E] font-medium">
                  {modalError}
                </p>
              )}

              <div className="pt-3 border-t border-[#49382C]/15 flex items-center justify-end gap-3 text-xs font-sans uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setShowRenameCategoryModal(false)}
                  className="px-4 py-2 text-[#49382C]/80 hover:text-[#49382C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#34483A] hover:bg-[#28382D] text-[#FAF8F3] rounded-xs font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. DELETE CATEGORY CONFIRMATION MODAL
         ===================================================================== */}
      {showDeleteCategoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowDeleteCategoryModal(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#FAF8F3] border border-[#8B261E]/30 rounded-sm shadow-2xl p-6 text-[#49382C]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-[#8B261E] shrink-0 mt-0.5">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl text-[#49382C] font-normal">
                  Delete Category?
                </h3>
                <p className="mt-1 text-xs text-[#49382C]/75 font-sans leading-relaxed">
                  Are you sure you want to delete <strong className="font-semibold text-[#49382C]">"{selectedCategory.name}"</strong>? All {libraryCounts[`style_${selectedCategory.id}`] || 0} images in this library will be permanently deleted from IndexedDB.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#49382C]/15 flex items-center justify-end gap-3 text-xs font-sans uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setShowDeleteCategoryModal(false)}
                className="px-4 py-2 text-[#49382C]/80 hover:text-[#49382C]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-4 py-2 bg-[#8B261E] hover:bg-red-800 text-white rounded-xs shadow-xs font-semibold"
              >
                Confirm Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
