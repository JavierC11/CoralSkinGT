// ==========================================
// CoralSkin GT - Product Card Component
// ==========================================

export function createProductCard(product, index = 0) {
  const statusMap = {
    available: { text: 'Disponible', class: 'status-available' },
    preorder: { text: 'Por encargo', class: 'status-preorder' },
    out: { text: 'Agotado', class: 'status-out' },
  };

  const badgeMap = {
    new: { text: 'Nuevo', class: 'badge-new' },
    bestseller: { text: 'Best Seller', class: 'badge-bestseller' },
  };

  const status = statusMap[product.status] || statusMap.available;
  const badge = product.badge ? badgeMap[product.badge] : null;

  const bgGradient = `linear-gradient(135deg, ${product.color}35 0%, ${product.color}15 50%, ${product.color}50 100%)`;

  const whatsappMsg = encodeURIComponent(
    `Hola Coral Skin GT! Me interesa el producto: ${product.name} (${product.brand})${product.tone ? ` Tono: ${product.tone}` : ''} - Q${product.price}`
  );

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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
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
