// ==========================================
// CoralSkin GT - Admin Panel
// ==========================================

import { getSupabaseUrl, getSupabaseKey, isSupabaseConfigured } from '../lib/supabase.js';
import { invalidateProductCache } from '../data/productService.js';

const ADMIN_PASSWORD = 'CoralCol5';
const SESSION_KEY = 'coralskin_admin_session';

// --- Auth ---
function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function login(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
}

// --- Supabase helpers ---
function sbHeaders() {
  const key = getSupabaseKey();
  return {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': `Bearer ${key}`,
  };
}

function sbUrl(path) {
  return `${getSupabaseUrl()}/rest/v1/${path}`;
}

function storageUrl(path) {
  return `${getSupabaseUrl()}/storage/v1/${path}`;
}

async function fetchAllProducts() {
  const res = await fetch(sbUrl('products?order=id.asc&limit=200'), { headers: sbHeaders() });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

async function fetchAllOrders() {
  const res = await fetch(sbUrl('orders?order=created_at.desc&limit=100'), { headers: sbHeaders() });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

async function fetchOrderItems(orderId) {
  const res = await fetch(sbUrl(`order_items?order_id=eq.${orderId}`), { headers: sbHeaders() });
  if (!res.ok) return [];
  return res.json();
}

async function updateProduct(productId, updates) {
  const res = await fetch(sbUrl(`products?product_id=eq.${productId}`), {
    method: 'PATCH',
    headers: { ...sbHeaders(), 'Prefer': 'return=representation' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  invalidateProductCache();
  return res.json();
}

async function insertProduct(data) {
  const res = await fetch(sbUrl('products'), {
    method: 'POST',
    headers: { ...sbHeaders(), 'Prefer': 'return=representation' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  invalidateProductCache();
  return res.json();
}

async function uploadImage(file, productId) {
  const ext = file.name.split('.').pop();
  const fileName = `${productId}-${Date.now()}.${ext}`;
  const key = getSupabaseKey();

  const res = await fetch(storageUrl(`object/product-images/${fileName}`), {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!res.ok) throw new Error(`Upload error ${res.status}`);
  return `${getSupabaseUrl()}/storage/v1/object/public/product-images/${fileName}`;
}

// --- Slug helper ---
function toSlug(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^-+|-+$/g, '');
}

// --- Render ---
export function renderAdmin() {
  if (!isLoggedIn()) {
    return `
      <div class="admin-page">
        <div class="admin-login-container">
          <div class="admin-login-card">
            <div class="admin-login-icon">🔐</div>
            <h2>Panel de Administración</h2>
            <p>Coral Skin GT</p>
            <form id="admin-login-form">
              <div class="admin-field">
                <label>Contraseña</label>
                <input type="password" id="admin-password" placeholder="Ingresa la contraseña" autocomplete="off" />
              </div>
              <button type="submit" class="btn btn-primary btn-block">Ingresar</button>
              <div class="admin-error" id="admin-login-error" style="display:none;">
                ❌ Contraseña incorrecta
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="admin-page">
      <div class="admin-container">

        <div class="admin-header">
          <div>
            <h1>🛠️ Panel Admin</h1>
            <p>Coral Skin GT — Gestiona productos y pedidos</p>
          </div>
          <div class="admin-header-actions">
            <button class="btn btn-sm btn-outline" id="admin-logout-btn">Cerrar Sesión</button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="admin-tabs">
          <button class="admin-tab active" data-tab="products">📦 Productos</button>
          <button class="admin-tab" data-tab="orders">📋 Pedidos</button>
          <button class="admin-tab" data-tab="add">➕ Agregar Producto</button>
        </div>

        <!-- Tab: Products -->
        <div class="admin-tab-content active" id="tab-products">
          <div class="admin-toolbar">
            <input type="text" id="admin-search" placeholder="🔍 Buscar producto..." class="admin-search-input" />
            <span class="admin-product-count" id="admin-product-count"></span>
          </div>
          <div id="admin-products-list" class="admin-products-list">
            <div class="admin-loading">⏳ Cargando productos...</div>
          </div>
        </div>

        <!-- Tab: Orders -->
        <div class="admin-tab-content" id="tab-orders">
          <div id="admin-orders-list" class="admin-orders-list">
            <div class="admin-loading">⏳ Cargando pedidos...</div>
          </div>
        </div>

        <!-- Tab: Add Product -->
        <div class="admin-tab-content" id="tab-add">
          <form id="admin-add-form" class="admin-form">
            <h3>Nuevo Producto</h3>
            
            <div class="admin-form-grid">
              <div class="admin-field">
                <label>Nombre del producto *</label>
                <input type="text" name="name" required placeholder="Ej: Soft Pinch Liquid Blush" />
              </div>
              <div class="admin-field">
                <label>Marca *</label>
                <input type="text" name="brand" required placeholder="Ej: Rare Beauty" />
              </div>
              <div class="admin-field">
                <label>Categoría *</label>
                <select name="category" required>
                  <option value="Rostro">Rostro</option>
                  <option value="Labios">Labios</option>
                  <option value="Ojos">Ojos</option>
                  <option value="Skin Care">Skin Care</option>
                </select>
              </div>
              <div class="admin-field">
                <label>Tipo</label>
                <input type="text" name="type" placeholder="Ej: Rubor, Lip Oil, Gloss..." />
              </div>
              <div class="admin-field">
                <label>Tono</label>
                <input type="text" name="tone" placeholder="Ej: Hope, Delight..." />
              </div>
              <div class="admin-field">
                <label>Precio (Q) *</label>
                <input type="number" name="price" required min="1" placeholder="218" />
              </div>
              <div class="admin-field">
                <label>Stock *</label>
                <input type="number" name="stock" required min="0" placeholder="1" />
              </div>
              <div class="admin-field">
                <label>Etiqueta</label>
                <select name="badge">
                  <option value="">Ninguna</option>
                  <option value="bestseller">⭐ Bestseller</option>
                  <option value="new">🆕 Nuevo</option>
                </select>
              </div>
              <div class="admin-field full-width">
                <label>Descripción</label>
                <textarea name="description" rows="2" placeholder="Breve descripción del producto..."></textarea>
              </div>
              <div class="admin-field full-width">
                <label>Beneficios</label>
                <input type="text" name="benefit" placeholder="✨ Beneficio 1 · 🌸 Beneficio 2 · 💧 Beneficio 3" />
              </div>
              <div class="admin-field">
                <label>Color de tarjeta</label>
                <input type="color" name="color" value="#E891A4" />
              </div>
              <div class="admin-field">
                <label>Emoji</label>
                <input type="text" name="emoji" placeholder="🌸" maxlength="4" />
              </div>
              <div class="admin-field full-width">
                <label>📸 Foto del producto</label>
                <div class="admin-upload-zone" id="admin-upload-zone">
                  <input type="file" id="admin-image-input" accept="image/*" style="display:none" />
                  <div class="admin-upload-preview" id="admin-upload-preview">
                    <span>Toca o arrastra una imagen aquí</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="admin-form-actions">
              <button type="submit" class="btn btn-primary btn-lg btn-block" id="admin-save-btn">
                💾 Guardar Producto
              </button>
            </div>
            <div class="admin-message" id="admin-add-message" style="display:none;"></div>
          </form>
        </div>

      </div>
    </div>
  `;
}

// --- Init ---
export function initAdminPage() {
  if (!isLoggedIn()) {
    initLoginForm();
    return;
  }

  initTabs();
  initLogout();
  initSearch();
  loadProducts();
  loadOrders();
  initAddForm();
}

function initLoginForm() {
  const form = document.getElementById('admin-login-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('admin-password').value;
    if (login(pw)) {
      window.location.hash = '#/admin';
      window.location.reload();
    } else {
      document.getElementById('admin-login-error').style.display = 'block';
    }
  });
}

function initLogout() {
  document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.hash = '#/';
  });
}

function initTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const contents = document.querySelectorAll('.admin-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
    });
  });
}

function initSearch() {
  document.getElementById('admin-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.admin-product-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// --- Products List ---
async function loadProducts() {
  const container = document.getElementById('admin-products-list');
  const countEl = document.getElementById('admin-product-count');
  if (!container) return;

  try {
    const products = await fetchAllProducts();
    if (countEl) countEl.textContent = `${products.length} productos`;

    container.innerHTML = products.map(p => `
      <div class="admin-product-card ${!p.is_active ? 'admin-inactive' : ''}" data-id="${p.product_id}">
        <div class="admin-product-image">
          ${p.image_url
            ? `<img src="${p.image_url}" alt="${p.name}" />`
            : `<div class="admin-product-emoji">${p.emoji || '📦'}</div>`
          }
        </div>
        <div class="admin-product-info">
          <div class="admin-product-name">${p.name}</div>
          <div class="admin-product-meta">
            <span class="admin-brand">${p.brand}</span>
            ${p.tone ? `<span class="admin-tone">· ${p.tone}</span>` : ''}
            ${p.badge ? `<span class="admin-badge admin-badge-${p.badge}">${p.badge === 'bestseller' ? '⭐' : '🆕'} ${p.badge}</span>` : ''}
          </div>
        </div>
        <div class="admin-product-controls">
          <div class="admin-control-group">
            <label>Precio</label>
            <div class="admin-inline-edit">
              <span>Q</span>
              <input type="number" class="admin-edit-price" value="${p.price}" min="1" data-id="${p.product_id}" />
            </div>
          </div>
          <div class="admin-control-group">
            <label>Stock</label>
            <input type="number" class="admin-edit-stock" value="${p.stock}" min="0" data-id="${p.product_id}" />
          </div>
          <div class="admin-control-group">
            <label>Activo</label>
            <label class="admin-switch">
              <input type="checkbox" class="admin-toggle-active" ${p.is_active ? 'checked' : ''} data-id="${p.product_id}" />
              <span class="admin-slider"></span>
            </label>
          </div>
          <div class="admin-control-group">
            <button class="btn btn-sm btn-outline admin-save-inline" data-id="${p.product_id}">💾</button>
          </div>
        </div>
      </div>
    `).join('');

    // Inline save handlers
    container.querySelectorAll('.admin-save-inline').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const card = btn.closest('.admin-product-card');
        const price = card.querySelector('.admin-edit-price').value;
        const stock = card.querySelector('.admin-edit-stock').value;
        const active = card.querySelector('.admin-toggle-active').checked;

        btn.textContent = '⏳';
        btn.disabled = true;

        try {
          await updateProduct(id, {
            price: Number(price),
            stock: Number(stock),
            is_active: active,
          });
          btn.textContent = '✅';
          setTimeout(() => { btn.textContent = '💾'; btn.disabled = false; }, 1500);
          card.classList.toggle('admin-inactive', !active);
        } catch (err) {
          btn.textContent = '❌';
          setTimeout(() => { btn.textContent = '💾'; btn.disabled = false; }, 2000);
          alert('Error al guardar: ' + err.message);
        }
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="admin-error-box">❌ Error cargando productos: ${err.message}<br>Verifica que hayas ejecutado el SQL en Supabase.</div>`;
  }
}

// --- Orders List ---
async function loadOrders() {
  const container = document.getElementById('admin-orders-list');
  if (!container) return;

  try {
    const orders = await fetchAllOrders();

    if (orders.length === 0) {
      container.innerHTML = '<div class="admin-empty">📭 No hay pedidos aún</div>';
      return;
    }

    container.innerHTML = orders.map(o => `
      <div class="admin-order-card">
        <div class="admin-order-header">
          <div>
            <span class="admin-order-number">📋 ${o.order_number}</span>
            <span class="admin-order-status admin-status-${o.status}">${o.status}</span>
          </div>
          <span class="admin-order-date">${new Date(o.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="admin-order-body">
          <div class="admin-order-client">
            <span>👤 ${o.customer_name}</span>
            <span>📱 ${o.customer_phone}</span>
          </div>
          <div class="admin-order-address">📍 ${o.shipping_address} (${o.shipping_zone})</div>
          <div class="admin-order-totals">
            <span>Subtotal: Q${o.subtotal}</span>
            <span>Envío: Q${o.shipping_cost}</span>
            <span class="admin-order-total">Total: Q${o.total}</span>
          </div>
          <div class="admin-order-payment">💳 ${o.payment_method}</div>
        </div>
        <div class="admin-order-actions">
          <select class="admin-status-select" data-order="${o.id}">
            <option value="pendiente" ${o.status === 'pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
            <option value="confirmado" ${o.status === 'confirmado' ? 'selected' : ''}>✅ Confirmado</option>
            <option value="enviado" ${o.status === 'enviado' ? 'selected' : ''}>🚚 Enviado</option>
            <option value="entregado" ${o.status === 'entregado' ? 'selected' : ''}>📦 Entregado</option>
            <option value="cancelado" ${o.status === 'cancelado' ? 'selected' : ''}>❌ Cancelado</option>
          </select>
          <button class="btn btn-sm btn-primary admin-update-status" data-order="${o.id}">Actualizar</button>
        </div>
      </div>
    `).join('');

    // Status update handlers
    container.querySelectorAll('.admin-update-status').forEach(btn => {
      btn.addEventListener('click', async () => {
        const orderId = btn.dataset.order;
        const select = container.querySelector(`.admin-status-select[data-order="${orderId}"]`);
        const newStatus = select.value;

        btn.textContent = '⏳';
        btn.disabled = true;

        try {
          await fetch(sbUrl(`orders?id=eq.${orderId}`), {
            method: 'PATCH',
            headers: sbHeaders(),
            body: JSON.stringify({ status: newStatus }),
          });
          btn.textContent = '✅ Listo';
          setTimeout(() => { btn.textContent = 'Actualizar'; btn.disabled = false; }, 1500);
        } catch (err) {
          btn.textContent = '❌ Error';
          setTimeout(() => { btn.textContent = 'Actualizar'; btn.disabled = false; }, 2000);
        }
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="admin-error-box">❌ Error cargando pedidos: ${err.message}</div>`;
  }
}

// --- Add Product Form ---
function initAddForm() {
  const form = document.getElementById('admin-add-form');
  const uploadZone = document.getElementById('admin-upload-zone');
  const imageInput = document.getElementById('admin-image-input');
  const preview = document.getElementById('admin-upload-preview');
  let selectedFile = null;

  // Click to upload
  uploadZone?.addEventListener('click', () => imageInput?.click());

  // Drag & drop
  uploadZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('admin-drag-over');
  });
  uploadZone?.addEventListener('dragleave', () => {
    uploadZone.classList.remove('admin-drag-over');
  });
  uploadZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('admin-drag-over');
    if (e.dataTransfer.files[0]) {
      selectedFile = e.dataTransfer.files[0];
      showPreview(selectedFile);
    }
  });

  imageInput?.addEventListener('change', (e) => {
    if (e.target.files[0]) {
      selectedFile = e.target.files[0];
      showPreview(selectedFile);
    }
  });

  function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-height:200px; border-radius:8px;" />`;
    };
    reader.readAsDataURL(file);
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('admin-save-btn');
    const msgEl = document.getElementById('admin-add-message');
    const fd = new FormData(form);

    btn.textContent = '⏳ Guardando...';
    btn.disabled = true;

    try {
      const catMap = { 'Rostro': 'rostro', 'Labios': 'labios', 'Ojos': 'ojos', 'Skin Care': 'skincare' };
      const productId = 'prod-' + Date.now();

      let imageUrl = '';
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile, productId);
      }

      const data = {
        product_id: productId,
        name: fd.get('name'),
        full_name: fd.get('name').toUpperCase(),
        brand: fd.get('brand'),
        brand_slug: toSlug(fd.get('brand')),
        category: fd.get('category'),
        category_slug: catMap[fd.get('category')] || toSlug(fd.get('category')),
        type: fd.get('type') || '',
        tone: fd.get('tone') || '',
        price: Number(fd.get('price')),
        stock: Number(fd.get('stock')),
        status: 'available',
        badge: fd.get('badge') || null,
        description: fd.get('description') || '',
        benefit: fd.get('benefit') || '',
        color: fd.get('color') || '#E891A4',
        emoji: fd.get('emoji') || '✨',
        image_url: imageUrl,
        is_active: true,
      };

      await insertProduct(data);

      msgEl.style.display = 'block';
      msgEl.className = 'admin-message admin-success';
      msgEl.textContent = '✅ ¡Producto guardado exitosamente! Ya está visible en la tienda.';

      form.reset();
      selectedFile = null;
      preview.innerHTML = '<span>Toca o arrastra una imagen aquí</span>';
      btn.textContent = '💾 Guardar Producto';
      btn.disabled = false;

      // Reload products tab
      loadProducts();

    } catch (err) {
      msgEl.style.display = 'block';
      msgEl.className = 'admin-message admin-error-msg';
      msgEl.textContent = '❌ Error: ' + err.message;
      btn.textContent = '💾 Guardar Producto';
      btn.disabled = false;
    }
  });
}
