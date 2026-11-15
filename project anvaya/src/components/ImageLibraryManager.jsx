import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ImageIcon,
  Edit3
} from 'lucide-react';
import {
  getImagesByLibrary,
  addImagesToLibrary,
  updateImageMetadata,
  setPrimaryImage,
  reorderLibraryImages,
  deleteImage,
  replaceImageFile,
  validateImageFile,
  formatBytes
} from '../services/imageStorage';
import { getEmptyStateMessages } from '../services/emptyStateMessages';

/**
 * Reusable Image Library Management Component
 * 
 * Works for both:
 * 1. Hero Showcase (libraryId: 'hero')
 * 2. Any Individual Style Library (libraryId: 'style_' + categoryId)
 */
export default function ImageLibraryManager({
  libraryId,
  libraryTitle,
  librarySubtitle,
  aspectRatio = 'aspect-[16/10]',
  onCountChange
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirmImage, setDeleteConfirmImage] = useState(null);
  const [uploadWarning, setUploadWarning] = useState(null);

  // Outfit Title, About Content, and Photo Replacement States
  const [editingImage, setEditingImage] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAbout, setEditAbout] = useState('');
  const [editEmptyAboutMode, setEditEmptyAboutMode] = useState('auto'); // 'auto' | 'specific' | 'none'
  const [editEmptyAboutMessageId, setEditEmptyAboutMessageId] = useState('');
  const [emptyMessagesList, setEmptyMessagesList] = useState([]);
  const [replacingTargetImage, setReplacingTargetImage] = useState(null);
  const replaceFileInputRef = useRef(null);

  // Object URL mapping: image.id -> blobUrl
  const objectUrlsRef = useRef(new Map());
  const fileInputRef = useRef(null);

  /**
   * Safe URL creation and caching (supports both IndexedDB Blobs and seed image URLs)
   */
  const getOrCreateObjectUrl = useCallback((image) => {
    if (!image) return '';
    if (image.blob) {
      if (objectUrlsRef.current.has(image.id)) {
        return objectUrlsRef.current.get(image.id);
      }
      const url = URL.createObjectURL(image.blob);
      objectUrlsRef.current.set(image.id, url);
      return url;
    }
    if (image.imageUrl) {
      return image.imageUrl;
    }
    return '';
  }, []);

  /**
   * Revoke single URL
   */
  const revokeObjectUrl = useCallback((id) => {
    if (objectUrlsRef.current.has(id)) {
      URL.revokeObjectURL(objectUrlsRef.current.get(id));
      objectUrlsRef.current.delete(id);
    }
  }, []);

  /**
   * Load images for this library from IndexedDB
   */
  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      const records = await getImagesByLibrary(libraryId);
      setImages(records);
      if (onCountChange) {
        onCountChange(libraryId, records.length);
      }
    } catch (err) {
      console.error('Failed to load images from IndexedDB:', err);
      setSavingStatus('error');
    } finally {
      setLoading(false);
    }
  }, [libraryId, onCountChange]);

  useEffect(() => {
    loadImages();

    // Cleanup URLs on unmount or library change
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, [loadImages]);

  /**
   * Process multiple files for upload
   */
  const handleUploadFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);
    const validFiles = [];
    const rejectedErrors = [];

    filesArray.forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        rejectedErrors.push(validation.error);
      }
    });

    if (rejectedErrors.length > 0) {
      setUploadWarning(rejectedErrors.join(' • '));
    } else {
      setUploadWarning(null);
    }

    if (validFiles.length === 0) return;

    try {
      setSavingStatus('saving');
      const added = await addImagesToLibrary(libraryId, validFiles);

      // Update local state with new items
      const updatedList = [...images, ...added];
      setImages(updatedList);
      if (onCountChange) {
        onCountChange(libraryId, updatedList.length);
      }
      setSavingStatus('saved');
    } catch (err) {
      console.error('Failed to save images to IndexedDB:', err);
      setSavingStatus('error');
    }
  };

  /**
   * Drag & Drop event handlers
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  /**
   * Toggle enabled / disabled
   */
  const handleToggleEnabled = async (image) => {
    try {
      setSavingStatus('saving');
      const newEnabled = !image.enabled;
      await updateImageMetadata(image.id, { enabled: newEnabled });
      setImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...img, enabled: newEnabled } : img))
      );
      setSavingStatus('saved');
    } catch (err) {
      console.error('Failed to update enabled status:', err);
      setSavingStatus('error');
    }
  };

  /**
   * Set primary image
   */
  const handleSetPrimary = async (image) => {
    if (image.isPrimary) return;
    try {
      setSavingStatus('saving');
      await setPrimaryImage(libraryId, image.id);
      setImages((prev) =>
        prev.map((img) => ({ ...img, isPrimary: img.id === image.id }))
      );
      setSavingStatus('saved');
    } catch (err) {
      console.error('Failed to set primary image:', err);
      setSavingStatus('error');
    }
  };

  /**
   * Reorder image (move left/right or up/down)
   */
  const handleMoveImage = async (currentIndex, targetIndex) => {
    if (targetIndex < 0 || targetIndex >= images.length) return;
    try {
      setSavingStatus('saving');
      const reordered = [...images];
      const [movedItem] = reordered.splice(currentIndex, 1);
      reordered.splice(targetIndex, 0, movedItem);

      // Reassign order numbers
      const updatedWithOrder = reordered.map((img, idx) => ({ ...img, order: idx }));
      setImages(updatedWithOrder);

      const orderedIds = updatedWithOrder.map((img) => img.id);
      await reorderLibraryImages(libraryId, orderedIds);
      setSavingStatus('saved');
    } catch (err) {
      console.error('Failed to reorder images:', err);
      setSavingStatus('error');
    }
  };

  /**
   * Confirm and delete image
   */
  const handleConfirmDelete = async () => {
    if (!deleteConfirmImage) return;
    const targetId = deleteConfirmImage.id;
    try {
      setSavingStatus('saving');
      await deleteImage(libraryId, targetId);
      revokeObjectUrl(targetId);

      const remaining = images.filter((img) => img.id !== targetId);
      // Ensure primary is reassigned if deleted was primary
      if (deleteConfirmImage.isPrimary && remaining.length > 0) {
        remaining[0].isPrimary = true;
      }
      setImages(remaining);
      if (onCountChange) {
        onCountChange(libraryId, remaining.length);
      }
      setDeleteConfirmImage(null);
      setSavingStatus('saved');
    } catch (err) {
      console.error('Failed to delete image:', err);
      setSavingStatus('error');
    }
  };

  /**
   * Open modal to edit outfit Title and About content
   */
  const handleOpenEditModal = (image) => {
    setEditingImage(image);
    setEditTitle(image.title || '');
    setEditAbout(image.about || '');
    setEditEmptyAboutMode(image.emptyAboutMode || 'auto');
    setEditEmptyAboutMessageId(image.emptyAboutMessageId || '');
    setEmptyMessagesList(getEmptyStateMessages());
  };

  /**
   * Save outfit Title and About content changes
   */
  const handleSaveEditModal = async () => {
    if (!editingImage) return;
    try {
      setSavingStatus('saving');
      const cleanTitle = editTitle.trim();
      const cleanAbout = editAbout.trim();

      await updateImageMetadata(editingImage.id, {
        title: cleanTitle,
        about: cleanAbout,
        emptyAboutMode: editEmptyAboutMode,
        emptyAboutMessageId: editEmptyAboutMessageId,
      });

      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id
            ? {
              ...img,
              title: cleanTitle,
              about: cleanAbout,
              emptyAboutMode: editEmptyAboutMode,
              emptyAboutMessageId: editEmptyAboutMessageId
            }
            : img
        )
      );

      setEditingImage(null);
      setSavingStatus('saved');
    } catch (err) {
      console.error('Failed to save outfit details:', err);
      setSavingStatus('error');
    }
  };

  /**
   * Trigger replacing the photograph of an existing outfit
   */
  const handleTriggerReplacePhoto = (image) => {
    setReplacingTargetImage(image);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.value = '';
      replaceFileInputRef.current.click();
    }
  };

  /**
   * Handle replacement photo file selected
   */
  const handleReplaceFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !replacingTargetImage) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadWarning(validation.error);
      return;
    }

    try {
      setSavingStatus('saving');
      await replaceImageFile(replacingTargetImage.id, file);
      revokeObjectUrl(replacingTargetImage.id);
      await loadImages();

      // If we are currently editing this outfit in the modal, update editingImage
      if (editingImage && editingImage.id === replacingTargetImage.id) {
        setEditingImage((prev) => ({
          ...prev,
          blob: file,
          imageUrl: null,
          filename: file.name,
          fileSize: file.size
        }));
      }

      setReplacingTargetImage(null);
      setSavingStatus('saved');
    } catch (err) {
      console.error('Failed to replace outfit photograph:', err);
      setSavingStatus('error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* 1. SECTION HEADER WITH PERSISTENCE STATUS */}
      <div className="border-b border-[#49382C]/15 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#34483A] font-semibold">
              Asset Collection
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#49382C]/60 bg-[#EFE9DF] px-2 py-0.5 rounded-xs">
              {images.length} {images.length === 1 ? 'image' : 'images'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#49382C] font-normal tracking-tight">
            {libraryTitle}
          </h1>
          {librarySubtitle && (
            <p className="mt-1 text-xs sm:text-sm text-[#49382C]/75 font-sans max-w-2xl leading-relaxed">
              {librarySubtitle}
            </p>
          )}
        </div>

        {/* Live Storage Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 bg-[#FAF8F3] border border-[#49382C]/20 rounded-xs text-[11px] font-mono shrink-0 shadow-2xs">
          {savingStatus === 'saving' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[#49382C]">Saving to IndexedDB...</span>
            </>
          ) : savingStatus === 'error' ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span className="text-red-700 font-semibold">Storage sync error</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[#34483A]" />
              <span className="text-[#34483A] font-medium">Saved to IndexedDB</span>
            </>
          )}
        </div>
      </div>

      {/* Upload Warnings Toast */}
      {uploadWarning && (
        <div className="p-3.5 bg-[#FAF8F3] border-l-4 border-amber-600 border-y border-r border-[#49382C]/20 text-xs text-[#49382C] flex items-center justify-between gap-3 rounded-xs shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{uploadWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadWarning(null)}
            className="text-[#49382C]/60 hover:text-[#49382C] p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. MULTIPLE IMAGE DRAG & DROP UPLOAD ZONE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className={`relative border-2 border-dashed rounded-sm p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 select-none ${isDragging
          ? 'border-[#34483A] bg-[#34483A]/10 scale-[1.005]'
          : 'border-[#49382C]/25 hover:border-[#49382C]/50 bg-[#F3EDE2]/60 hover:bg-[#F3EDE2]'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => handleUploadFiles(e.target.files)}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-[#49382C]/20 flex items-center justify-center mx-auto text-[#34483A] shadow-xs">
            <UploadCloud className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <span className="font-serif text-lg sm:text-xl text-[#49382C] font-normal block">
              {isDragging ? 'Drop image files here' : 'Select or drop multiple images'}
            </span>
            <span className="text-xs text-[#49382C]/70 font-sans mt-1 block">
              Click to browse files or drag and drop images directly into this area.
            </span>
          </div>
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#49382C]/60">
            <span className="px-2 py-0.5 bg-[#FAF8F3] border border-[#49382C]/15 rounded-xs">
              JPEG, PNG, WebP
            </span>
            <span className="px-2 py-0.5 bg-[#FAF8F3] border border-[#49382C]/15 rounded-xs">
              Up to 15MB each
            </span>
            <span className="px-2 py-0.5 bg-[#FAF8F3] border border-[#49382C]/15 rounded-xs text-[#34483A]">
              Multi-file support
            </span>
          </div>
        </div>
      </div>

      {/* 3. THUMBNAIL GALLERY */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl sm:text-2xl text-[#49382C] font-normal">
            Collection Gallery
          </h2>
          <span className="text-xs text-[#49382C]/70 font-sans">
            {images.length === 0 ? 'No images uploaded yet' : `${images.length} assets registered`}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#49382C]/60">
            Loading images from IndexedDB...
          </div>
        ) : images.length === 0 ? (
          /* Clean Empty State */
          <div className="p-10 sm:p-14 bg-[#FAF8F3] border border-[#49382C]/20 rounded-sm text-center">
            <ImageIcon className="w-10 h-10 text-[#49382C]/30 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-[#49382C] font-normal">
              No images in this library
            </h3>
            <p className="mt-1 text-xs text-[#49382C]/65 font-sans max-w-sm mx-auto">
              Use the upload area above to add multiple high-resolution photographs to {libraryTitle}.
            </p>
          </div>
        ) : (
          /* Multi-Image Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {images.map((image, index) => {
              const url = getOrCreateObjectUrl(image);
              const isFirst = index === 0;
              const isLast = index === images.length - 1;

              return (
                <div
                  key={image.id}
                  className={`group relative bg-[#FAF8F3] border rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${image.isPrimary
                    ? 'border-[#34483A] ring-1 ring-[#34483A]'
                    : 'border-[#49382C]/20 hover:border-[#49382C]/50'
                    } ${!image.enabled ? 'opacity-60 bg-[#EFE9DF]/50' : ''}`}
                >

                  {/* Top Badges Bar */}
                  <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-1.5">
                      {/* Order Tag */}
                      <span className="px-1.5 py-0.5 bg-[#1E140F]/80 backdrop-blur-xs text-[#FAF8F3] text-[9px] font-mono rounded-xs shadow-xs">
                        #{index + 1}
                      </span>
                      {/* Primary Badge */}
                      {image.isPrimary && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#34483A] text-[#FAF8F3] text-[9px] font-mono uppercase tracking-wider rounded-xs shadow-xs font-semibold">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          Primary
                        </span>
                      )}
                    </div>

                    {/* Disabled Badge */}
                    {!image.enabled && (
                      <span className="px-2 py-0.5 bg-[#49382C]/80 backdrop-blur-xs text-[#FAF8F3] text-[9px] font-mono uppercase tracking-wider rounded-xs">
                        Disabled
                      </span>
                    )}
                  </div>

                  {/* Image Thumbnail Frame */}
                  <div className={`w-full ${aspectRatio} relative bg-[#EFE9DF] overflow-hidden`}>
                    <img
                      src={url}
                      alt={image.filename}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!image.enabled ? 'grayscale contrast-75' : ''
                        }`}
                      loading="lazy"
                    />

                    {/* Overlay Action Shortcuts on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(image)}
                        title="Enlarge preview"
                        className="p-2 bg-[#FAF8F3] text-[#49382C] rounded-full hover:bg-[#34483A] hover:text-[#FAF8F3] shadow-md transition-colors"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(image)}
                        title={image.isPrimary ? "Already primary image" : "Set as primary"}
                        disabled={image.isPrimary}
                        className={`p-2 rounded-full shadow-md transition-colors ${image.isPrimary
                          ? 'bg-[#34483A] text-[#FAF8F3]'
                          : 'bg-[#FAF8F3] text-[#49382C] hover:bg-[#34483A] hover:text-[#FAF8F3]'
                          }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${image.isPrimary ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Card Footer & Controls */}
                  <div className="p-3 bg-[#FAF8F3] border-t border-[#49382C]/10 flex flex-col gap-2">
                    {/* Title & Edit Details Trigger */}
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className="font-serif text-xs font-semibold text-[#49382C] truncate" title={image.title || '-Untitled-'}>
                        {image.title && image.title.trim() ? image.title.trim() : '-Untitled-'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(image)}
                        className="p-1 text-[#34483A] hover:bg-[#34483A]/10 rounded-xs transition-colors shrink-0"
                        title="Edit outfit title and about content"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* About Status & File Info */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#49382C]/65">
                      <span className="truncate">
                        {image.about && image.about.trim()
                          ? 'About text set'
                          : image.emptyAboutMode === 'none'
                            ? 'Placeholder: None'
                            : image.emptyAboutMode === 'specific'
                              ? 'Specific placeholder'
                              : 'Auto placeholder'}
                      </span>
                      <span className="shrink-0 ml-1">
                        {formatBytes(image.fileSize)}
                      </span>
                    </div>

                    {/* Action Toolbar */}
                    <div className="pt-2 border-t border-[#49382C]/10 flex items-center justify-between gap-1">

                      {/* Reorder Buttons */}
                      <div className="inline-flex items-center gap-0.5 border border-[#49382C]/20 rounded-xs bg-[#F3EDE2]/50 p-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, index - 1)}
                          disabled={isFirst}
                          title="Move earlier in order"
                          className="p-1 text-[#49382C]/70 hover:text-[#49382C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, index + 1)}
                          disabled={isLast}
                          title="Move later in order"
                          className="p-1 text-[#49382C]/70 hover:text-[#49382C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Replace Photo Button */}
                        <button
                          type="button"
                          onClick={() => handleTriggerReplacePhoto(image)}
                          title="Replace outfit photograph"
                          className="p-1.5 rounded-xs text-[#34483A] hover:bg-[#34483A]/10 border border-[#34483A]/30 transition-colors"
                        >
                          <UploadCloud className="w-3 h-3" />
                        </button>

                        {/* Toggle Enabled */}
                        <button
                          type="button"
                          onClick={() => handleToggleEnabled(image)}
                          title={image.enabled ? "Disable image (hide without deleting)" : "Enable image"}
                          className={`p-1.5 rounded-xs transition-colors border ${image.enabled
                            ? 'border-[#34483A]/30 text-[#34483A] hover:bg-[#34483A]/10'
                            : 'border-[#49382C]/20 text-[#49382C]/50 hover:bg-[#EFE9DF]'
                            }`}
                        >
                          {image.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmImage(image)}
                          title="Delete image"
                          className="p-1.5 rounded-xs text-[#8B261E] hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
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

      {/* =====================================================================
          4. PREVIEW MODAL (FULL RESOLUTION INSPECTION)
         ===================================================================== */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#FAF8F3] border border-[#49382C]/30 rounded-sm shadow-2xl p-4 sm:p-6 text-[#49382C] flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#49382C]/15 mb-4">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-[#49382C] font-normal truncate max-w-md">
                  {previewImage.filename}
                </h3>
                <span className="text-[10px] font-mono text-[#49382C]/70">
                  {formatBytes(previewImage.fileSize)} • Registered in {libraryTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 text-[#49382C]/60 hover:text-[#49382C] rounded-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="flex-1 min-h-0 bg-[#140F0C] rounded-xs overflow-hidden flex items-center justify-center p-2">
              <img
                src={getOrCreateObjectUrl(previewImage)}
                alt={previewImage.filename}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="pt-4 mt-2 border-t border-[#49382C]/15 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
              <div className="flex items-center gap-2">
                {previewImage.isPrimary && (
                  <span className="inline-flex items-center gap-1 text-[#34483A] font-semibold font-mono text-[11px]">
                    <Star className="w-3 h-3 fill-current" /> Primary Asset
                  </span>
                )}
                {!previewImage.enabled && (
                  <span className="text-[#8B261E] font-mono text-[11px]">
                    Currently Disabled
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleSetPrimary(previewImage);
                    setPreviewImage(prev => ({ ...prev, isPrimary: true }));
                  }}
                  disabled={previewImage.isPrimary}
                  className="px-3 py-1.5 border border-[#49382C]/30 rounded-xs hover:bg-[#EFE9DF] disabled:opacity-40"
                >
                  {previewImage.isPrimary ? 'Already Primary' : 'Set as Primary'}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-1.5 bg-[#49382C] text-[#FAF8F3] rounded-xs hover:bg-[#34483A]"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================================
          5. DELETE CONFIRMATION DIALOG
         ===================================================================== */}
      {deleteConfirmImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setDeleteConfirmImage(null)}
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
                  Remove Image Asset?
                </h3>
                <p className="mt-1 text-xs text-[#49382C]/75 font-sans leading-relaxed">
                  Are you sure you want to delete <strong className="font-semibold text-[#49382C]">"{deleteConfirmImage.filename}"</strong> from {libraryTitle}? This action will permanently remove the image from local storage.
                </p>
              </div>
            </div>

            {/* Thumbnail Mini Preview */}
            <div className="mt-4 p-2 bg-[#F3EDE2] border border-[#49382C]/15 rounded-xs flex items-center gap-3">
              <img
                src={getOrCreateObjectUrl(deleteConfirmImage)}
                alt=""
                className="w-14 h-14 object-cover rounded-2xs border border-[#49382C]/20"
              />
              <div className="text-xs truncate">
                <span className="font-serif block truncate font-medium">{deleteConfirmImage.filename}</span>
                <span className="text-[10px] font-mono text-[#49382C]/60 block">{formatBytes(deleteConfirmImage.fileSize)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-3 border-t border-[#49382C]/15 flex items-center justify-end gap-3 text-xs font-sans uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setDeleteConfirmImage(null)}
                className="px-4 py-2 text-[#49382C]/80 hover:text-[#49382C]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-[#8B261E] hover:bg-red-800 text-white rounded-xs shadow-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          6. EDIT OUTFIT DETAILS MODAL (TITLE, ABOUT CONTENT, REPLACE PHOTO)
         ===================================================================== */}
      {editingImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
          onClick={() => setEditingImage(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#FAF8F3] border border-[#49382C]/30 rounded-sm shadow-2xl p-6 text-[#49382C] flex flex-col max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#49382C]/15 mb-4">
              <div>
                <h3 className="font-serif text-xl text-[#49382C] font-normal">
                  Edit Outfit Details
                </h3>
                <span className="text-[10px] font-mono text-[#49382C]/60 uppercase tracking-wider">
                  {libraryTitle} • Specimen #{images.findIndex(img => img.id === editingImage.id) + 1}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="p-1 text-[#49382C]/60 hover:text-[#49382C] rounded-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo Preview & Replace Control */}
              <div className="p-3 bg-[#EFE9DF]/60 border border-[#49382C]/15 rounded-xs flex items-center gap-4">
                <div className="w-16 h-20 bg-[#FAF8F3] border border-[#49382C]/20 rounded-xs overflow-hidden shrink-0">
                  <img
                    src={getOrCreateObjectUrl(editingImage)}
                    alt="Outfit preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-serif text-xs font-medium text-[#49382C] block truncate mb-1">
                    {editingImage.filename}
                  </span>
                  <span className="text-[10px] font-mono text-[#49382C]/60 block mb-2">
                    {formatBytes(editingImage.fileSize)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTriggerReplacePhoto(editingImage)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans text-[#34483A] bg-[#FAF8F3] hover:bg-[#34483A] hover:text-[#FAF8F3] border border-[#34483A]/30 rounded-xs transition-colors shadow-2xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#49382C]/80 mb-1 font-semibold">
                  Outfit Title (Card Front)
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="-Untitled-"
                  className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#49382C]/25 text-[#49382C] font-serif text-sm rounded-xs focus:border-[#34483A] focus:outline-none"
                />
                <p className="text-[10px] text-[#49382C]/60 mt-1">
                  Displayed directly beneath the photograph. If left blank, defaults to <span className="font-mono text-espresso font-semibold">-Untitled-</span>.
                </p>
              </div>

              {/* About Content Textarea */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#49382C]/80 mb-1 font-semibold">
                  About Content (Card Reverse)
                </label>
                <textarea
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  rows={4}
                  placeholder="Enter custom styling notes, aesthetic details, or male/female styling information..."
                  className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#49382C]/25 text-[#49382C] font-serif text-xs sm:text-sm rounded-xs focus:border-[#34483A] focus:outline-none leading-relaxed"
                />
                <p className="text-[10px] text-[#49382C]/60 mt-1">
                  Manual About text takes priority. If left blank, the placeholder settings below determine the reverse card content.
                </p>
              </div>

              {/* Placeholder Settings (When About is Empty) */}
              <div className="p-3 bg-[#EFE9DF]/60 border border-[#49382C]/15 rounded-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#49382C] font-semibold">
                    Placeholder Mode (When About is Empty)
                  </label>
                  <span className="text-[9.5px] font-mono text-[#34483A] font-medium">
                    {editEmptyAboutMode === 'auto' ? 'Automatic Distribution' : editEmptyAboutMode === 'specific' ? 'Specific Message' : 'None (Blank)'}
                  </span>
                </div>

                {/* 3 Mode Options */}
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setEditEmptyAboutMode('auto')}
                    className={`py-1.5 px-2 rounded-xs border text-center transition-all cursor-pointer ${editEmptyAboutMode === 'auto'
                      ? 'bg-[#34483A] text-[#FAF8F3] border-[#34483A] font-semibold shadow-2xs'
                      : 'bg-[#FAF8F3] text-[#49382C]/75 border-[#49382C]/20 hover:bg-[#EAE4D7]'
                      }`}
                  >
                    Automatic
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditEmptyAboutMode('specific')}
                    className={`py-1.5 px-2 rounded-xs border text-center transition-all cursor-pointer ${editEmptyAboutMode === 'specific'
                      ? 'bg-[#34483A] text-[#FAF8F3] border-[#34483A] font-semibold shadow-2xs'
                      : 'bg-[#FAF8F3] text-[#49382C]/75 border-[#49382C]/20 hover:bg-[#EAE4D7]'
                      }`}
                  >
                    Specific Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditEmptyAboutMode('none')}
                    className={`py-1.5 px-2 rounded-xs border text-center transition-all cursor-pointer ${editEmptyAboutMode === 'none'
                      ? 'bg-[#34483A] text-[#FAF8F3] border-[#34483A] font-semibold shadow-2xs'
                      : 'bg-[#FAF8F3] text-[#49382C]/75 border-[#49382C]/20 hover:bg-[#EAE4D7]'
                      }`}
                  >
                    None
                  </button>
                </div>

                {/* Specific Message Selector Dropdown */}
                {editEmptyAboutMode === 'specific' && (
                  <div className="pt-1.5 space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#49382C]/80">
                      Choose Specific Placeholder Message:
                    </label>
                    <select
                      value={editEmptyAboutMessageId}
                      onChange={(e) => setEditEmptyAboutMessageId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#FAF8F3] border border-[#49382C]/25 text-[#49382C] font-serif text-xs rounded-xs focus:border-[#34483A] focus:outline-none"
                    >
                      <option value="">-- Select a message from collection --</option>
                      {emptyMessagesList.map((m) => (
                        <option key={m.id} value={m.id}>
                          "{m.text}" {!m.enabled ? '(Disabled)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <p className="text-[9.5px] text-[#49382C]/65 leading-relaxed">
                  {editEmptyAboutMode === 'auto' && '• Distributes active messages across cards with minimal repetition. No message is reused until all are used.'}
                  {editEmptyAboutMode === 'specific' && '• This card always displays the selected placeholder message and does not participate in automatic distribution.'}
                  {editEmptyAboutMode === 'none' && '• No placeholder message is displayed on this card; the reverse About panel remains completely blank.'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 mt-4 border-t border-[#49382C]/15 flex items-center justify-end gap-2 text-xs font-sans">
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="px-3.5 py-1.5 border border-[#49382C]/20 text-[#49382C]/80 hover:bg-[#EFE9DF] rounded-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditModal}
                className="px-4 py-1.5 bg-[#34483A] hover:bg-[#27372C] text-[#FAF8F3] font-medium rounded-xs transition-colors shadow-2xs inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input for Direct Photo Replacement */}
      <input
        type="file"
        ref={replaceFileInputRef}
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleReplaceFileSelected}
        className="hidden"
      />

    </div>
  );
}

