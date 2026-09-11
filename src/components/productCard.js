// ==========================================
// CoralSkin GT - Product Card Component
// ==========================================

export function createProductCard(product, index = 0) {
  const badgeMap = {
    new: { text: 'Nuevo', class: 'badge-new' },
    bestseller: { text: 'Best Seller', class: 'badge-bestseller' },
  };

  const badge = product.badge ? badgeMap[product.badge] : null;
  const bgGradient = `linear-gradient(135deg, ${product.color}35 0%, ${product.color}15 50%, ${product.color}50 100%)`;

  const whatsappMsg = encodeURIComponent(
    `Hola Coral Skin GT! Me interesa el producto: ${product.name} (${product.brand})${product.tone ? ` Tono: ${product.tone}` : ''} - Q${product.price}`
  );

  // Check if this product has multiple tone variants
  const variants = product.variants || [product];
  const hasVariants = variants.length > 1;

  // Build tone selector dots HTML
  const toneSelector = hasVariants ? `
    <div class="tone-selector">
      ${variants.map((v, i) => `
        <button type="button" 
          class="tone-option ${i === 0 ? 'active' : ''}" 
          style="background-color: ${v.color};"
          title="${v.tone || 'Sin tono'}"
          data-id="${v.id}"
          data-tone="${v.tone || ''}"
          data-color="${v.color || '#ccc'}"
          data-image="${v.imageUrl || ''}"
          data-emoji="${v.emoji || '✨'}"
          data-description="${(v.description || '').replace(/"/g, '&quot;')}"
          data-benefit="${(v.benefit || '').replace(/"/g, '&quot;')}"
        ></button>
      `).join('')}
    </div>
  ` : '';

  return `
    <div class="product-card animate-fade-in-up delay-${Math.min((index % 4) + 1, 4)}" id="product-${product.id}">
      <div class="product-card-image">
        ${badge ? `<span class="product-badge ${badge.class}">${badge.text}</span>` : ''}
        ${product.imageUrl
          ? `<img src="${product.imageUrl}" alt="${product.name}" class="product-img-real" loading="lazy" />`
          : `<div class="product-img-placeholder" style="background: ${bgGradient};">
              <span>${product.emoji}</span>
            </div>`
        }
        
        <div class="product-card-overlay">
          <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="${product.id}" id="btn-add-${product.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Agregar al Carrito
          </button>
          
          <a href="https://wa.me/50253481870?text=${whatsappMsg}" 
             target="_blank" rel="noopener" 
             class="btn btn-whatsapp btn-sm btn-icon-only"
             title="Consultar por WhatsApp"
             id="order-wa-${product.id}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.82 14.01c-.24.68-1.41 1.3-1.95 1.38-.49.07-1.1.1-1.77-.11-.41-.13-.93-.31-1.6-.6-2.8-1.22-4.6-4.03-4.74-4.21-.14-.19-1.13-1.5-1.13-2.87 0-1.37.72-2.04.97-2.32.26-.28.56-.35.75-.35.19 0 .37 0 .54.01.17.01.4-.07.63.48.24.56.8 1.97.87 2.11.07.14.12.31.02.5-.1.19-.14.31-.28.47-.14.17-.29.37-.41.5-.14.14-.28.29-.12.57.16.28.73 1.21 1.57 1.96 1.08.96 1.99 1.26 2.27 1.4.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.37-.24.63-.14.26.1 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="product-card-body">
        <div class="product-brand-row">
          <span class="product-brand">${product.brand}</span>
          ${product.stock <= 2 ? `<span class="stock-badge">¡Solo ${product.stock} disponible!</span>` : ''}
        </div>
        
        <h3 class="product-name">${product.name}</h3>
        
        ${product.tone ? `
          <div class="product-tone-badge">
            <span class="tone-dot" style="background-color: ${product.color};"></span>
            Tono: <strong>${product.tone}</strong>
          </div>
        ` : ''}

        ${toneSelector}

        <p class="product-description">${product.description}</p>
        
        ${product.benefit ? `<p class="product-benefit">${product.benefit}</p>` : ''}

        <div class="product-footer">
          <div class="product-price">
            <span class="currency">Q</span>${product.price}
          </div>
          
          <button type="button" class="btn btn-primary btn-sm btn-add-cart-inline btn-add-cart" data-id="${product.id}">
            + Agregar
          </button>
        </div>
      </div>
    </div>
  `;
}
