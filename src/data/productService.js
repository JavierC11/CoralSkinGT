// ====================================================
// CoralSkin GT - Product Service (Supabase-powered)
// ====================================================
// Fetches products from Supabase. Falls back to local
// products.js if the network request fails.

import { getSupabaseUrl, getSupabaseKey, isSupabaseConfigured } from '../lib/supabase.js';
import { products as localProducts, categories as localCategories, brands as localBrands } from './products.js';

// In-memory cache so we don't re-fetch on every page navigation
let _cachedProducts = null;
let _cacheTimestamp = 0;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Fetch products from Supabase.
 * Returns the cached list if it's still fresh.
 * Falls back to local hardcoded data on any error.
 */
export async function fetchProducts() {
  // Return cache if still valid
  if (_cachedProducts && (Date.now() - _cacheTimestamp < CACHE_TTL_MS)) {
    return _cachedProducts;
  }

  if (!isSupabaseConfigured()) {
    console.info('[ProductService] Supabase not configured, using local products.');
    _cachedProducts = localProducts;
    _cacheTimestamp = Date.now();
    return localProducts;
  }

  try {
    const url = getSupabaseUrl();
    const key = getSupabaseKey();

    const res = await fetch(
      `${url}/rest/v1/products?is_active=eq.true&order=id.asc`,
      {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Supabase responded ${res.status}`);
    }

    const rows = await res.json();

    // Map DB columns to the same shape the UI already expects
    _cachedProducts = rows.map(row => ({
      id: row.product_id,
      name: row.name,
      fullName: row.full_name || row.name,
      brand: row.brand,
      brandSlug: row.brand_slug,
      category: row.category,
      categorySlug: row.category_slug,
      type: row.type || '',
      tone: row.tone || '',
      price: Number(row.price),
      stock: Number(row.stock),
      status: row.status || 'available',
      badge: row.badge || null,
      description: row.description || '',
      benefit: row.benefit || '',
      color: row.color || '#ccc',
      emoji: row.emoji || '✨',
      imageUrl: row.image_url || '',
    }));

    _cacheTimestamp = Date.now();
    console.info(`[ProductService] Loaded ${_cachedProducts.length} products from Supabase.`);
    return _cachedProducts;
  } catch (err) {
    console.warn('[ProductService] Supabase fetch failed, using local fallback.', err);
    _cachedProducts = localProducts;
    _cacheTimestamp = Date.now();
    return localProducts;
  }
}

/**
 * Derive unique categories from the fetched product list.
 */
export function deriveCategories(products) {
  const slugSet = new Set();
  const cats = [{ name: 'Todos', slug: 'all' }];

  for (const p of products) {
    if (!slugSet.has(p.categorySlug)) {
      slugSet.add(p.categorySlug);
      cats.push({ name: p.category, slug: p.categorySlug });
    }
  }

  return cats;
}

/**
 * Derive unique brands from the fetched product list.
 */
export function deriveBrands(products) {
  const slugSet = new Set();
  const brandArr = [{ name: 'Todas', slug: 'all' }];

  for (const p of products) {
    if (!slugSet.has(p.brandSlug)) {
      slugSet.add(p.brandSlug);
      brandArr.push({ name: p.brand, slug: p.brandSlug });
    }
  }

  return brandArr;
}

/**
 * Force-refresh the cache on next fetch.
 */
export function invalidateProductCache() {
  _cachedProducts = null;
  _cacheTimestamp = 0;
}
