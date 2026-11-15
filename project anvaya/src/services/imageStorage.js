/**
 * Anvaya IndexedDB Storage Service
 * 
 * Provides persistent client-side storage for:
 * 1. Image Blobs & Metadata (Hero Showcase + Style Libraries)
 * 2. Style Categories (Dynamic addition, renaming, and deletion)
 * 
 * Features:
 * - Stores raw Blobs directly in IndexedDB (zero base64 strings in localStorage)
 * - Indexing by libraryId and display order
 * - Category CRUD operations with cascade deletion of associated images
 * - Live count queries for dashboard badges
 */

const DB_NAME = 'AnvayaAssetDB';
const DB_VERSION = 1;

export const DEFAULT_STYLE_CATEGORIES = [
  // WOMEN'S COLLECTION
  {
    id: 'women_minimalist',
    mode: 'women',
    name: 'Minimalist',
    tagline: 'Refined silhouettes, neutral tones, and intentional negative space.',
    description: 'Clean tailoring, architectural draping, and monochrome foundations without superfluous detailing.',
    sampleColors: ['#FAF8F3', '#D5DDE0', '#788E9C', '#49382C']
  },
  {
    id: 'women_old-money',
    mode: 'women',
    name: 'Old Money',
    tagline: 'Heritage tailoring, bespoke knitwear, and quiet luxury textiles.',
    description: 'Traditional wool flannels, cashmere mocknecks, bridle leather accents, and understated equestrian ease.',
    sampleColors: ['#F3EDE2', '#C9BAA6', '#526649', '#37261C']
  },
  {
    id: 'women_streetwear',
    mode: 'women',
    name: 'Streetwear',
    tagline: 'Architectural volumes, high-density cottons, and elevated utility.',
    description: 'Contemporary oversized silhouettes, Japanese selvedge denim, boxy outerwear, and technical canvas.',
    sampleColors: ['#E7DDD0', '#2C3E50', '#1B2631', '#140F0C']
  },
  {
    id: 'women_smart-casual',
    mode: 'women',
    name: 'Smart Casual',
    tagline: 'Deconstructed blazers, crisp poplin shirting, and modern footwear.',
    description: 'Effortless transitional layers balancing tailored trousers with relaxed knitwear and fine leather loafers.',
    sampleColors: ['#FAF8F3', '#B7A58D', '#49382C', '#34483A']
  },
  {
    id: 'women_vintage-victorian',
    mode: 'women',
    name: 'Vintage / Victorian',
    tagline: 'High-neck shirting, rich brocades, and evocative historical textures.',
    description: 'Intricate ruff details, antique horn buttons, romantic velvet dusk coats, and heritage silhouettes.',
    sampleColors: ['#F4ECE4', '#A9B8C2', '#76543C', '#2E221A']
  },
  {
    id: 'women_casual-everyday',
    mode: 'women',
    name: 'Casual Everyday',
    tagline: 'Tactile rib-knits, washed denim, and breathable French linens.',
    description: 'Approachable, tactile comfort designed for studio mornings, weekend walks, and relaxed living.',
    sampleColors: ['#FAF8F3', '#E2E8EA', '#91745E', '#3D2F25']
  },

  // MEN'S COLLECTION
  {
    id: 'men_minimalist',
    mode: 'men',
    name: 'Minimalist',
    tagline: 'Clean lines, precise tailoring, and muted monochrome foundations.',
    description: 'Architectural shirting, structured wool trousers, and sleek low-profile leather.',
    sampleColors: ['#FAF8F3', '#D5DDE0', '#49382C', '#1B2631']
  },
  {
    id: 'men_old-money',
    mode: 'men',
    name: 'Old Money',
    tagline: 'Heritage tweed, fine gauge knitwear, and classic sartorial proportions.',
    description: 'Double-breasted blazers, cable-knit cashmere, Oxford cotton button-downs, and burnished cordovan.',
    sampleColors: ['#F3EDE2', '#C9BAA6', '#526649', '#37261C']
  },
  {
    id: 'men_streetwear',
    mode: 'men',
    name: 'Streetwear',
    tagline: 'Relaxed proportions, heavyweight loopback jerseys, and functional utilitarian accents.',
    description: 'Boxy drop-shoulder hoodies, wide-leg carpenter denim, and contemporary technical sneakers.',
    sampleColors: ['#E7DDD0', '#2C3E50', '#1B2631', '#140F0C']
  },
  {
    id: 'men_smart-casual',
    mode: 'men',
    name: 'Smart Casual',
    tagline: 'Unstructured tailoring paired with elevated knit polo shirts and chinos.',
    description: 'Soft-shouldered wool-linen jackets, knit polos, pleated trousers, and suede loafers.',
    sampleColors: ['#FAF8F3', '#B7A58D', '#49382C', '#34483A']
  },
  {
    id: 'men_casual-everyday',
    mode: 'men',
    name: 'Casual Everyday',
    tagline: 'Washed selvedge denim, heavyweight tees, and comfortable overshirts.',
    description: 'Relaxed flannel or twill overshirts, combed cotton crewnecks, and rugged leather boots.',
    sampleColors: ['#FAF8F3', '#E2E8EA', '#91745E', '#3D2F25']
  },

  // NEUTRAL / SHARED COLLECTION
  {
    id: 'neutral_minimalist',
    mode: 'neutral',
    name: 'Minimalist',
    tagline: 'Genderless architectural forms, neutral drapery, and pure balance.',
    description: 'Fluid wool trousers, relaxed trench coats, and clean geometric geometries suited for every body.',
    sampleColors: ['#FAF8F3', '#D5DDE0', '#788E9C', '#49382C']
  },
  {
    id: 'neutral_streetwear',
    mode: 'neutral',
    name: 'Streetwear',
    tagline: 'Universal oversized silhouettes, technical nylon, and graphic knitwear.',
    description: 'Voluminous outerwear, wide-leg cargo silhouettes, and modular utility gear.',
    sampleColors: ['#E7DDD0', '#2C3E50', '#1B2631', '#140F0C']
  },
  {
    id: 'neutral_casual-everyday',
    mode: 'neutral',
    name: 'Casual Everyday',
    tagline: 'Relaxed linen shirting, universal denim, and comfortable neutrals.',
    description: 'Breathable layers, soft neutral palettes, and relaxed silhouettes built for everyday ease.',
    sampleColors: ['#FAF8F3', '#E2E8EA', '#91745E', '#3D2F25']
  }
];

/**
 * Default Seed Outfits for Style Libraries (Editable in Developer Mode)
 */
export const SEED_STYLE_OUTFITS = {
  'style_women_minimalist': [
    {
      title: 'Sculptural Column Maxi Dress & Angular Leather Slides',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_women_old-money': [
    {
      title: 'Cashmere Cable-Knit & High-Waist Pleated Midi',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_women_streetwear': [
    {
      title: 'Cropped Parachute Jacket & Relaxed Cargo Slacks',
      image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_women_smart-casual': [
    {
      title: 'Silk Crepe Blouse & High-Waisted Cigarette Trousers',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_women_vintage-victorian': [
    {
      title: 'Victorian Brocade Longline Coat & Pleated Collar',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_women_casual-everyday': [
    {
      title: 'Breezy Cotton Poplin Button-Down & Linen Shorts',
      image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_men_minimalist': [
    {
      title: 'Boxy Heavyweight Overshirt & Straight Trousers',
      image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_men_old-money': [
    {
      title: 'Italian Double-Breasted Wool Blazer & Pleated Slacks',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_men_streetwear': [
    {
      title: 'Heavyweight Flannel Overshirt & Wide Carpenter Slacks',
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_men_smart-casual': [
    {
      title: 'Fine Merino Mockneck & Unstructured Linen Blazer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_men_casual-everyday': [
    {
      title: 'Waffle-Knit Raglan & Relaxed Olive Chinos',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_neutral_minimalist': [
    {
      title: 'Double-Faced Camel Coat & Tailored Loafers',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
      about: ''
    },
    {
      title: 'Relaxed Raw Linen Button-Down & Ecru Chinos',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_neutral_streetwear': [
    {
      title: 'Oversized Vintage Washed Tee & Wide-Leg Raw Denim',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ],
  'style_neutral_casual-everyday': [
    {
      title: 'Classic Brushed Sweatshirt & Relaxed Canvas Pants',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85',
      about: ''
    }
  ]
};

/**
 * Dispatch cross-component real-time sync event
 */
export function dispatchAssetsUpdated(detail = {}) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('anvaya_assets_updated', { detail }));
  }
}

/**
 * Open or initialize the IndexedDB instance
 */
function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Images Object Store
      if (!db.objectStoreNames.contains('images')) {
        const imageStore = db.createObjectStore('images', { keyPath: 'id' });
        imageStore.createIndex('libraryId', 'libraryId', { unique: false });
        imageStore.createIndex('order', 'order', { unique: false });
      }

      // 2. Categories Object Store
      if (!db.objectStoreNames.contains('categories')) {
        const catStore = db.createObjectStore('categories', { keyPath: 'id' });
        DEFAULT_STYLE_CATEGORIES.forEach((cat) => {
          catStore.add(cat);
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generate a unique ID for images and custom categories
 */
export function generateUniqueId(prefix = 'img') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Validate image file
 */
export function validateImageFile(file, maxBytes = 15 * 1024 * 1024) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `"${file.name}" has an unsupported format. Please upload JPEG, PNG, or WebP.`
    };
  }
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `"${file.name}" exceeds the 15MB limit (${formatBytes(file.size)}).`
    };
  }
  return { valid: true };
}

/* =========================================================================
   IMAGE CRUD OPERATIONS
   ========================================================================= */

/**
 * Retrieve all images for a specific library (e.g. 'hero' or 'style_minimalist')
 * Sorted by order ascending.
 * 
 * NOTE: No auto-seeding. Only explicitly uploaded photographs are returned.
 * Empty libraries return an empty array — the UI shows an empty state.
 */
export async function getImagesByLibrary(libraryId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readonly');
    const store = tx.objectStore('images');
    const index = store.index('libraryId');
    const request = index.getAll(libraryId);

    request.onsuccess = () => {
      const images = request.result || [];
      // Sort by order ascending
      images.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      resolve(images);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Add multiple images to a library in a single transaction
 */
export async function addImagesToLibrary(libraryId, files) {
  const db = await openDB();
  const existing = await getImagesByLibrary(libraryId);
  let nextOrder = existing.length;
  const hasPrimary = existing.some((img) => img.isPrimary);

  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    const addedImages = [];

    files.forEach((file, index) => {
      const isFirstOfLibrary = !hasPrimary && index === 0;
      const record = {
        id: generateUniqueId('img'),
        libraryId,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        blob: file, // Store raw Blob
        order: nextOrder++,
        enabled: true,
        isPrimary: isFirstOfLibrary,
        title: '',
        about: '',
        createdAt: new Date().toISOString()
      };
      store.add(record);
      addedImages.push(record);
    });

    tx.oncomplete = () => {
      dispatchAssetsUpdated({ type: 'images_added', libraryId });
      resolve(addedImages);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Update an existing image's metadata (e.g. enabled, isPrimary, order)
 */
export async function updateImageMetadata(id, updates) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const record = getReq.result;
      if (!record) {
        reject(new Error(`Image with ID ${id} not found.`));
        return;
      }
      const updated = { ...record, ...updates };
      store.put(updated);
    };

    tx.oncomplete = () => {
      dispatchAssetsUpdated({ type: 'image_updated', id, updates });
      resolve(true);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Set an image as primary for a library and unmark all others in that library
 */
export async function setPrimaryImage(libraryId, imageId) {
  const db = await openDB();
  const images = await getImagesByLibrary(libraryId);

  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');

    images.forEach((img) => {
      const isPrimary = img.id === imageId;
      if (img.isPrimary !== isPrimary) {
        store.put({ ...img, isPrimary });
      }
    });

    tx.oncomplete = () => {
      dispatchAssetsUpdated({ type: 'primary_set', libraryId, imageId });
      resolve(true);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Reorder images in a library according to an array of image IDs
 */
export async function reorderLibraryImages(libraryId, orderedIds) {
  const db = await openDB();
  const images = await getImagesByLibrary(libraryId);
  const imgMap = new Map(images.map((img) => [img.id, img]));

  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');

    orderedIds.forEach((id, newIndex) => {
      const img = imgMap.get(id);
      if (img && img.order !== newIndex) {
        store.put({ ...img, order: newIndex });
      }
    });

    tx.oncomplete = () => {
      dispatchAssetsUpdated({ type: 'images_reordered', libraryId });
      resolve(true);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Delete a single image by ID
 */
export async function deleteImage(libraryId, imageId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    store.delete(imageId);

    tx.oncomplete = async () => {
      // If the deleted image was primary, assign primary to the first remaining image
      const remaining = await getImagesByLibrary(libraryId);
      if (remaining.length > 0 && !remaining.some((img) => img.isPrimary)) {
        await setPrimaryImage(libraryId, remaining[0].id);
      }
      dispatchAssetsUpdated({ type: 'image_deleted', libraryId, imageId });
      resolve(true);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Delete all images associated with a library
 */
export async function deleteImagesByLibrary(libraryId) {
  const db = await openDB();
  const images = await getImagesByLibrary(libraryId);

  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    images.forEach((img) => store.delete(img.id));

    tx.oncomplete = () => {
      dispatchAssetsUpdated({ type: 'library_cleared', libraryId });
      resolve(true);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Replace an image's underlying file/blob and metadata
 */
export async function replaceImageFile(imageId, file) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    const getReq = store.get(imageId);

    getReq.onsuccess = () => {
      const record = getReq.result;
      if (!record) {
        reject(new Error(`Image with ID ${imageId} not found.`));
        return;
      }
      const updated = {
        ...record,
        blob: file,
        imageUrl: null, // clear seed external URL once custom file uploaded
        filename: file.name,
        fileSize: file.size,
        fileType: file.type
      };
      store.put(updated);
    };

    tx.oncomplete = () => {
      dispatchAssetsUpdated({ type: 'image_replaced', imageId });
      resolve(true);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get count of images for all libraries as a map { [libraryId]: count }
 */
export async function getAllLibraryCounts() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readonly');
    const store = tx.objectStore('images');
    const request = store.getAll();

    request.onsuccess = () => {
      const images = request.result || [];
      const counts = {};
      images.forEach((img) => {
        counts[img.libraryId] = (counts[img.libraryId] || 0) + 1;
      });
      resolve(counts);
    };
    request.onerror = () => reject(request.error);
  });
}

/* =========================================================================
   STYLE CATEGORIES CRUD OPERATIONS
   ========================================================================= */

/**
 * Retrieve all style categories (optionally filtered by mode: 'women' | 'men' | 'neutral')
 */
export async function getAllCategories(mode = null) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    const request = store.getAll();

    request.onsuccess = () => {
      let categories = request.result || [];
      if (categories.length === 0) {
        DEFAULT_STYLE_CATEGORIES.forEach((cat) => {
          store.add(cat);
        });
        categories = [...DEFAULT_STYLE_CATEGORIES];
      } else {
        // Ensure legacy categories without 'mode' are assigned 'women'
        let modified = false;
        categories = categories.map((cat) => {
          if (!cat.mode) {
            modified = true;
            const updated = { ...cat, mode: 'women' };
            store.put(updated);
            return updated;
          }
          return cat;
        });

        // Seed default Men and Neutral categories if absent
        const hasMen = categories.some((c) => c.mode === 'men');
        const hasNeutral = categories.some((c) => c.mode === 'neutral');

        if (!hasMen || !hasNeutral) {
          DEFAULT_STYLE_CATEGORIES.forEach((cat) => {
            if ((!hasMen && cat.mode === 'men') || (!hasNeutral && cat.mode === 'neutral')) {
              if (!categories.some((c) => c.id === cat.id)) {
                store.add(cat);
                categories.push(cat);
              }
            }
          });
        }
      }

      if (mode) {
        categories = categories.filter((c) => c.mode === mode);
      }
      resolve(categories);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Add or update a style category
 */
export async function saveCategory(category) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    store.put(category);

    tx.oncomplete = () => {
      dispatchAssetsUpdated({ type: 'category_saved', category });
      resolve(category);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Delete a style category and all its stored images
 */
export async function deleteCategory(categoryId) {
  const db = await openDB();
  // Cascade delete images
  await deleteImagesByLibrary(`style_${categoryId}`);

  return new Promise((resolve, reject) => {
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    store.delete(categoryId);

    tx.oncomplete = () => {
      dispatchAssetsUpdated({ type: 'category_deleted', categoryId });
      resolve(true);
    };
    tx.onerror = () => reject(tx.error);
  });
}

