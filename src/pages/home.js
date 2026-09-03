// ==========================================
// CoralSkin GT - Home Page Component
// ==========================================

import { testimonials } from '../data/products.js';
import { fetchProducts, deriveBrands } from '../data/productService.js';
import { createProductCard } from '../components/productCard.js';

export function renderHome() {
  // Brands are loaded dynamically after mount; show placeholder first
  return `
    <!-- Hero Section -->
    <section class="hero" id="hero-section">
      <div class="hero-bg">
        <img src="public/hero-bg.png" alt="Coral Skin GT - Belleza y Skincare Original" loading="eager" onerror="this.style.display='none'" />
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-tag">
          <span class="dot"></span>
          100% Originales · Importados desde Sephora USA
        </div>
        <h1>
          Tu Belleza, <br>
          Nuestra <span class="highlight">Pasión</span>
        </h1>
        <p class="hero-subtitle">
          Descubre las marcas más codiciadas de maquillaje y skincare del mundo en Guatemala: 
          <strong>Rhode, Rare Beauty, The Ordinary, Patrick Ta, By Mario</strong> y más.
        </p>
        <div class="hero-actions">
          <a href="#/catalogo" class="btn btn-primary btn-lg" id="hero-catalog-btn">Ver Catálogo Completo</a>
          <a href="https://wa.me/50253481870?text=Hola%20Coral%20Skin%20GT!%20Quiero%20hacer%20un%20pedido" 
             class="btn btn-outline btn-lg" style="border-color: rgba(255,255,255,0.6); color: white;" 
             target="_blank" rel="noopener" id="hero-whatsapp-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.317 0-4.47-.753-6.209-2.028l-.353-.271-3.656 1.225 1.225-3.656-.271-.353A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
            </svg>
            Pedir por WhatsApp
          </a>
        </div>
        <div class="hero-stats" id="hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-number" id="stat-brands">...</span>
            <span class="hero-stat-label">Marcas Exclusivas</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-number" id="stat-products">...</span>
            <span class="hero-stat-label">Productos en Stock</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-number">100%</span>
            <span class="hero-stat-label">Autenticidad</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Brands Carousel/Grid -->
    <section class="brands-section" id="brands-section">
      <div class="brands-container">
        <p class="brands-label">Marcas exclusivas que manejamos</p>
        <div class="brands-grid" id="brands-grid">
          <!-- Filled dynamically -->
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-section section" id="featured-section">
      <div class="featured-container">
        <div class="section-header">
          <h2>Productos Destacados</h2>
          <p>Los más buscados en Guatemala, listos para entrega inmediata</p>
        </div>
        <div class="products-grid" id="featured-products-grid">
          <div class="loading-placeholder" style="grid-column: 1/-1; text-align:center; padding:40px 20px; color:#888;">
            <div style="font-size:2rem; margin-bottom:12px;">⏳</div>
            Cargando productos destacados...
          </div>
        </div>
        <div class="featured-cta">
          <a href="#/catalogo" class="btn btn-outline" id="featured-view-all-btn">Ver Todos los Productos</a>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="why-section section" id="why-section">
      <div class="why-container">
        <div class="section-header">
          <h2>¿Por Qué Comprar en Coral Skin GT?</h2>
          <p>Garantía de calidad, confianza y entregas seguras en toda Guatemala</p>
        </div>
        <div class="features-grid">
          <div class="feature-card reveal">
            <div class="feature-icon">✨</div>
            <h3>100% Originales de USA</h3>
            <p>Comprados directamente en tiendas oficiales de Sephora y marcas autorizadas en Estados Unidos.</p>
          </div>
          <div class="feature-card reveal">
            <div class="feature-icon">💳</div>
            <h3>Pagos Fáciles</h3>
            <p>Paga por transferencia Banco Industrial, depósito o contra entrega en zonas de cobertura.</p>
          </div>
          <div class="feature-card reveal">
            <div class="feature-icon">🚚</div>
            <h3>Envíos a Todo el País</h3>
            <p>Tarifas claras: Q25 para Ciudad de Guatemala y Q45 para todos los departamentos del interior.</p>
          </div>
          <div class="feature-card reveal">
            <div class="feature-icon">💬</div>
            <h3>Asesoría Personalizada</h3>
            <p>Te ayudamos a elegir el tono y producto ideal para tu tipo de piel por WhatsApp.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section section" id="testimonials-section">
      <div class="testimonials-container">
        <div class="section-header">
          <h2>Opiniones de Nuestras Clientas</h2>
          <p>La confianza y satisfacción de quienes ya compran en Coral Skin GT</p>
        </div>
        <div class="testimonials-grid">
          ${testimonials.map((t, i) => `
            <div class="testimonial-card reveal delay-${i + 1}">
              <p class="testimonial-text">"${t.text}"</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">${t.initials}</div>
                <div>
                  <div class="testimonial-name">${t.name}</div>
                  <div class="testimonial-role">${t.role}</div>
                  <div class="testimonial-stars">${'★'.repeat(t.stars)}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" id="cta-section">
      <div class="cta-container">
        <h2>¿Lista para elevar tu rutina de belleza?</h2>
        <p>Añade tus favoritos al carrito o escríbenos directamente para asesorarte.</p>
        <div class="cta-actions">
          <a href="#/catalogo" class="btn btn-primary btn-lg" id="cta-catalog-btn">Explorar Catálogo</a>
          <a href="https://wa.me/50253481870?text=Hola%20Coral%20Skin%20GT!%20Quiero%20hacer%20un%20pedido" 
             class="btn btn-whatsapp btn-lg" target="_blank" rel="noopener" id="cta-whatsapp-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.317 0-4.47-.753-6.209-2.028l-.353-.271-3.656 1.225 1.225-3.656-.271-.353A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
            </svg>
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  `;
}

/**
 * Called after the home page is rendered to load dynamic content.
 */
export async function initHomePage() {
  const products = await fetchProducts();
  const brands = deriveBrands(products);
  const brandList = brands.filter(b => b.slug !== 'all');

  // Update hero stats
  const statBrands = document.getElementById('stat-brands');
  const statProducts = document.getElementById('stat-products');
  if (statBrands) statBrands.textContent = `${brandList.length}+`;
  if (statProducts) statProducts.textContent = `${products.length}`;

  // Update brands grid
  const brandsGrid = document.getElementById('brands-grid');
  if (brandsGrid) {
    brandsGrid.innerHTML = brandList.map(b => `<a href="#/catalogo" class="brand-item">${b.name.toUpperCase()}</a>`).join('');
  }

  // Update featured products
  const featuredGrid = document.getElementById('featured-products-grid');
  if (featuredGrid) {
    const featured = products.filter(p => p.badge === 'bestseller' || p.badge === 'new').slice(0, 8);
    featuredGrid.innerHTML = featured.map((product, i) => createProductCard(product, i)).join('');
  }

  // Update "View All" button text
  const viewAllBtn = document.getElementById('featured-view-all-btn');
  if (viewAllBtn) {
    viewAllBtn.textContent = `Ver Todos los ${products.length} Productos`;
  }
}
