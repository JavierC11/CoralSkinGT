// ==========================================
// CoralSkin GT - Catalog Page Component
// ==========================================

import { fetchProducts, deriveCategories, deriveBrands } from '../data/productService.js';
import { createProductCard } from '../components/productCard.js';

// Initial render shows a loading skeleton; real products are injected after fetch
export function renderCatalog() {
  return `
    <div class="catalog-page" id="catalog-page">
      <div class="catalog-container">
        
        <div class="catalog-header animate-fade-in-up">
          <h1>Catálogo Exclusivo</h1>
          <p>Explora nuestra colección de cosméticos y cuidado de la piel 100% originales importados de USA.</p>
        </div>

        <!-- Search box -->
        <div class="catalog-search-wrapper animate-fade-in-up delay-1">
          <div class="catalog-search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="catalog-search-input" placeholder="Buscar por producto, marca o tono (ej. Rare Beauty, Rhode, Delight)..." />
          </div>
        </div>

        <!-- Category Filters (filled dynamically) -->
        <div class="filter-section animate-fade-in-up delay-1">
          <div class="filter-group-label">Categorías:</div>
          <div class="filter-tabs" id="category-filters">
            <button class="filter-tab active" data-category="all" id="filter-cat-all">Todos</button>
          </div>
        </div>

        <!-- Brand Filters (filled dynamically) -->
        <div class="filter-section animate-fade-in-up delay-2">
          <div class="filter-group-label">Marcas:</div>
          <div class="filter-tabs brand-tabs" id="brand-filters">
            <button class="filter-tab active" data-brand="all" id="filter-brand-all">Todas</button>
          </div>
        </div>

        <!-- Product Count -->
        <div class="catalog-meta-row animate-fade-in delay-3">
          <span class="catalog-count" id="product-count">
            Cargando productos...
          </span>
          <div class="catalog-notice">⚡ Todos listos para entrega inmediata</div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" id="catalog-products-grid">
          <div class="loading-placeholder" style="grid-column: 1/-1; text-align:center; padding:60px 20px; color:#888;">
            <div style="font-size:2rem; margin-bottom:12px;">⏳</div>
            Cargando catálogo...
          </div>
        </div>

        <!-- No Results -->
        <div class="no-results" id="no-results" style="display: none;">
          <div class="no-results-icon">🔍</div>
          <h3>No encontramos productos con estos filtros</h3>
          <p>Intenta con otra combinación de marca, categoría o término de búsqueda.</p>
          <button class="btn btn-outline btn-sm" id="btn-reset-filters" style="margin-top: 15px;">Restablecer Filtros</button>
        </div>

      </div>
    </div>
  `;
}

export async function initCatalogFilters() {
  // Fetch products from Supabase (or local fallback)
  const products = await fetchProducts();
  const categories = deriveCategories(products);
  const brands = deriveBrands(products);

  let activeBrand = 'all';
  let activeCategory = 'all';
  let searchQuery = '';

  const catContainer = document.getElementById('category-filters');
  const brandContainer = document.getElementById('brand-filters');
  const searchInput = document.getElementById('catalog-search-input');
  const resetBtn = document.getElementById('btn-reset-filters');
  const grid = document.getElementById('catalog-products-grid');
  const countEl = document.getElementById('product-count');
  const noResults = document.getElementById('no-results');

  if (!grid) return;

  // --- Group products by name+brand (for variant/tone grouping) ---
  function groupProducts(productList) {
    const groups = new Map();
    for (const p of productList) {
      const key = `${p.name}|||${p.brand}`;
      if (!groups.has(key)) {
        groups.set(key, { ...p, variants: [p] });
      } else {
        groups.get(key).variants.push(p);
      }
    }
    return Array.from(groups.values());
  }

  // Populate filter buttons dynamically
  if (catContainer) {
    catContainer.innerHTML = categories.map(c => `
      <button class="filter-tab ${c.slug === 'all' ? 'active' : ''}" data-category="${c.slug}" id="filter-cat-${c.slug}">
        ${c.name}
      </button>
    `).join('');
  }

  if (brandContainer) {
    brandContainer.innerHTML = brands.map(b => `
      <button class="filter-tab ${b.slug === 'all' ? 'active' : ''}" data-brand="${b.slug}" id="filter-brand-${b.slug}">
        ${b.name}
      </button>
    `).join('');
  }

  // Initial render
  const grouped = groupProducts(products);
  grid.innerHTML = grouped.map((product, i) => createProductCard(product, i)).join('');
  initToneSelectors(grid);
  if (countEl) {
    countEl.innerHTML = `Mostrando <strong>${grouped.length}</strong> productos disponibles`;
  }

  // --- Filter logic ---
  function filterProducts() {
    const q = searchQuery.toLowerCase().trim();

    const filtered = products.filter(p => {
      const brandMatch = activeBrand === 'all' || p.brandSlug === activeBrand;
      const catMatch = activeCategory === 'all' || p.categorySlug === activeCategory;
      
      const searchMatch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        (p.tone && p.tone.toLowerCase().includes(q)) ||
        (p.type && p.type.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      return brandMatch && catMatch && searchMatch;
    });

    const filteredGrouped = groupProducts(filtered);

    grid.style.opacity = '0';
    grid.style.transform = 'translateY(10px)';

    setTimeout(() => {
      if (filteredGrouped.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
      } else {
        grid.style.display = 'grid';
        noResults.style.display = 'none';
        grid.innerHTML = filteredGrouped.map((product, i) => createProductCard(product, i)).join('');
        initToneSelectors(grid);
      }

      if (countEl) {
        countEl.innerHTML = `Mostrando <strong>${filteredGrouped.length}</strong> de ${grouped.length} productos`;
      }

      requestAnimationFrame(() => {
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      });
    }, 150);
  }

  // --- Tone selector logic ---
  function initToneSelectors(container) {
    container.querySelectorAll('.tone-option').forEach(dot => {
      dot.addEventListener('click', () => {
        const card = dot.closest('.product-card');
        if (!card) return;

        // Update active dot
        card.querySelectorAll('.tone-option').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        // Get variant data from data attributes
        const variantId = dot.dataset.id;
        const variantTone = dot.dataset.tone;
        const variantColor = dot.dataset.color;
        const variantImage = dot.dataset.image;
        const variantEmoji = dot.dataset.emoji;
        const variantDescription = dot.dataset.description || '';
        const variantBenefit = dot.dataset.benefit || '';

        // Update card content
        const toneLabel = card.querySelector('.product-tone-badge strong');
        if (toneLabel) toneLabel.textContent = variantTone;

        const toneDot = card.querySelector('.product-tone-badge .tone-dot');
        if (toneDot) toneDot.style.backgroundColor = variantColor;

        const descEl = card.querySelector('.product-description');
        if (descEl && variantDescription) descEl.textContent = variantDescription;

        const benefitEl = card.querySelector('.product-benefit');
        if (benefitEl && variantBenefit) benefitEl.innerHTML = variantBenefit;

        // Update image
        const imgContainer = card.querySelector('.product-card-image');
        const existingImg = imgContainer?.querySelector('.product-img-real');
        const existingPlaceholder = imgContainer?.querySelector('.product-img-placeholder');

        if (variantImage) {
          if (existingImg) {
            existingImg.src = variantImage;
            existingImg.alt = variantTone;
          } else if (existingPlaceholder) {
            const img = document.createElement('img');
            img.src = variantImage;
            img.alt = variantTone;
            img.className = 'product-img-real';
            img.loading = 'lazy';
            existingPlaceholder.replaceWith(img);
          }
        } else {
          // No image - show emoji placeholder
          if (existingImg) {
            const bgGradient = `linear-gradient(135deg, ${variantColor}35 0%, ${variantColor}15 50%, ${variantColor}50 100%)`;
            const div = document.createElement('div');
            div.className = 'product-img-placeholder';
            div.style.background = bgGradient;
            div.innerHTML = `<span>${variantEmoji || '✨'}</span>`;
            existingImg.replaceWith(div);
          } else if (existingPlaceholder) {
            const bgGradient = `linear-gradient(135deg, ${variantColor}35 0%, ${variantColor}15 50%, ${variantColor}50 100%)`;
            existingPlaceholder.style.background = bgGradient;
            existingPlaceholder.querySelector('span').textContent = variantEmoji || '✨';
          }
        }

        // Update add-to-cart buttons with new variant ID
        card.querySelectorAll('.btn-add-cart').forEach(b => b.dataset.id = variantId);

        // Update WhatsApp link
        const waLink = card.querySelector('.btn-whatsapp');
        if (waLink) {
          const waMsg = encodeURIComponent(
            `Hola Coral Skin GT! Me interesa el producto: ${card.querySelector('.product-name')?.textContent} (${card.querySelector('.product-brand')?.textContent}) Tono: ${variantTone} - Q${card.querySelector('.product-price')?.textContent?.replace(/[^\d]/g, '')}`
          );
          waLink.href = `https://wa.me/50253481870?text=${waMsg}`;
        }
      });
    });
  }

  // Attach event listeners to the dynamically-created buttons
  const brandBtns = document.querySelectorAll('#brand-filters .filter-tab');
  const catBtns = document.querySelectorAll('#category-filters .filter-tab');

  brandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      brandBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeBrand = btn.dataset.brand;
      filterProducts();
    });
  });

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      filterProducts();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterProducts();
  });

  resetBtn?.addEventListener('click', () => {
    activeBrand = 'all';
    activeCategory = 'all';
    searchQuery = '';
    if (searchInput) searchInput.value = '';

    brandBtns.forEach(b => b.classList.toggle('active', b.dataset.brand === 'all'));
    catBtns.forEach(c => c.classList.toggle('active', c.dataset.category === 'all'));
    filterProducts();
  });

  grid.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
}
