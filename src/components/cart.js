// ==========================================
// CoralSkin GT - Sliding Cart Drawer Component
// ==========================================

import { getCart, updateQuantity, removeFromCart, getCartSubtotal, clearCart, subscribeCart } from '../store/cartStore.js';

export function renderCartDrawer() {
  const cart = getCart();
  const subtotal = getCartSubtotal();
  const isEmpty = cart.length === 0;

  return `
    <div id="cart-drawer-overlay" class="cart-overlay"></div>
    <aside id="cart-drawer" class="cart-drawer" aria-label="Carrito de compras">
      <div class="cart-header">
        <div class="cart-header-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h3>Tu Carrito</h3>
          <span class="cart-count-badge">${cart.reduce((s, i) => s + i.quantity, 0)}</span>
        </div>
        <button id="cart-close-btn" class="cart-close-btn" aria-label="Cerrar carrito">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="cart-body">
        ${isEmpty ? `
          <div class="cart-empty">
            <div class="cart-empty-icon">🛍️</div>
            <h4>Tu carrito está vacío</h4>
            <p>Descubre nuestros productos originales traídos de Sephora USA.</p>
            <a href="#/catalogo" class="btn btn-primary btn-sm" id="cart-go-catalog-btn">Ver Catálogo</a>
          </div>
        ` : `
          <div class="cart-items-list">
            ${cart.map(item => `
              <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img" style="background: ${item.color}33;">
                  <span>${item.emoji}</span>
                </div>
                <div class="cart-item-info">
                  <div class="cart-item-brand">${item.brand}</div>
                  <h4 class="cart-item-name">${item.name}</h4>
                  ${item.tone ? `<div class="cart-item-tone">Tono: <strong>${item.tone}</strong></div>` : ''}
                  <div class="cart-item-price">Q${item.price}</div>
                  
                  <div class="cart-item-actions">
                    <div class="cart-qty-control">
                      <button class="qty-btn btn-qty-minus" data-id="${item.id}" aria-label="Disminuir">-</button>
                      <span class="qty-val">${item.quantity}</span>
                      <button class="qty-btn btn-qty-plus" data-id="${item.id}" aria-label="Aumentar" ${item.quantity >= item.stock ? 'disabled' : ''}>+</button>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" title="Eliminar producto">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      ${!isEmpty ? `
        <div class="cart-footer">
          <div class="cart-summary-row">
            <span>Subtotal</span>
            <span class="cart-subtotal-val">Q${subtotal}</span>
          </div>
          <p class="cart-shipping-note">🚚 Envío calculado en el siguiente paso.</p>
          <div class="cart-footer-actions">
            <a href="#/checkout" class="btn btn-primary btn-lg btn-block" id="cart-checkout-btn">
              Proceder al Checkout (Q${subtotal})
            </a>
            <button class="btn btn-outline btn-sm btn-block" id="cart-clear-btn" style="margin-top: 8px;">
              Vaciar carrito
            </button>
          </div>
        </div>
      ` : ''}
    </aside>
  `;
}

export function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

export function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer && drawer.classList.contains('open')) {
    closeCart();
  } else {
    openCart();
  }
}

export function initCartDrawer() {
  // Ensure cart container exists
  let container = document.getElementById('cart-drawer-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'cart-drawer-container';
    document.body.appendChild(container);
  }

  function renderAndAttach() {
    const isCurrentlyOpen = document.getElementById('cart-drawer')?.classList.contains('open');
    container.innerHTML = renderCartDrawer();
    
    if (isCurrentlyOpen) {
      document.getElementById('cart-drawer')?.classList.add('open');
      document.getElementById('cart-drawer-overlay')?.classList.add('open');
    }

    // Attach listeners
    document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);
    document.getElementById('cart-drawer-overlay')?.addEventListener('click', closeCart);
    document.getElementById('cart-go-catalog-btn')?.addEventListener('click', closeCart);
    document.getElementById('cart-checkout-btn')?.addEventListener('click', closeCart);

    document.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = getCart().find(i => i.id === id);
        if (item) updateQuantity(id, item.quantity - 1);
      });
    });

    document.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = getCart().find(i => i.id === id);
        if (item) updateQuantity(id, item.quantity + 1);
      });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        removeFromCart(id);
      });
    });

    document.getElementById('cart-clear-btn')?.addEventListener('click', () => {
      if (confirm('¿Deseas vaciar todo el carrito?')) {
        clearCart();
      }
    });
  }

  renderAndAttach();
  subscribeCart(() => renderAndAttach());

  // Listen for ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });
}
