// ==========================================
// CoralSkin GT - Admin Panel
// ==========================================

import { getSupabaseUrl, getSupabaseKey, isSupabaseConfigured } from '../lib/supabase.js';
import { invalidateProductCache } from '../data/productService.js';

const SESSION_KEY = 'coralskin_admin_token';

// --- Auth ---
function isLoggedIn() {
  return !!sessionStorage.getItem(SESSION_KEY);
}

async function login(email, password) {
  const res = await fetch(`${getSupabaseUrl()}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': getSupabaseKey(),
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) return false;

  const data = await res.json();
  sessionStorage.setItem(SESSION_KEY, data.access_token);
  return true;
}

// --- Supabase helpers ---
function sbHeaders() {
  const token = sessionStorage.getItem(SESSION_KEY) || getSupabaseKey();
  return {
    'Content-Type': 'application/json',
    'apikey': getSupabaseKey(),
    'Authorization': `Bearer ${token}`, // Usa el token seguro si está logueado
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
                <label>Correo Electrónico</label>
                <input type="email" id="admin-email" placeholder="admin@coralskingt.com" required autocomplete="email" />
              </div>
              <div class="admin-field" style="margin-top: 10px;">
                <label>Contraseña</label>
                <input type="password" id="admin-password" placeholder="Ingresa la contraseña" required autocomplete="current-password" />
              </div>
              <button type="submit" class="btn btn-primary btn-block" id="admin-login-btn">Ingresar</button>
              <div class="admin-error" id="admin-login-error" style="display:none;">
                ❌ Credenciales incorrectas
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
                <label class="admin-upload-zone" id="admin-upload-zone" for="admin-image-input">
                  <input type="file" id="admin-image-input" accept="image/*" style="display:none" />
                  <div class="admin-upload-preview" id="admin-upload-preview">
                    <span>Toca o arrastra una imagen aquí</span>
                  </div>
                </label>
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
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('admin-login-btn');
    const errEl = document.getElementById('admin-login-error');
    
    btn.textContent = 'Verificando...';
    btn.disabled = true;
    errEl.style.display = 'none';

    const email = document.getElementById('admin-email').value;
    const pw = document.getElementById('admin-password').value;
    
    const success = await login(email, pw);
    
    if (success) {
      window.location.hash = '#/admin';
      window.location.reload();
    } else {
      errEl.style.display = 'block';
      btn.textContent = 'Ingresar';
      btn.disabled = false;
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
          <label for="upload-${p.product_id}" class="admin-image-label" title="Cambiar foto">
            ${p.image_url
              ? `<img src="${p.image_url}" alt="${p.name}" />`
              : `<div class="admin-product-emoji">${p.emoji || '📦'}</div>`
            }
            <div class="admin-image-overlay">📷</div>
          </label>
          <input type="file" id="upload-${p.product_id}" class="admin-inline-upload" data-id="${p.product_id}" accept="image/*" style="display:none" />
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
          <div class="admin-control-group">
            <button class="btn btn-sm btn-outline admin-edit-btn" data-id="${p.product_id}" title="Editar todos los campos">✏️</button>
          </div>
        </div>

        <!-- Formulario expandible de edición completa -->
        <div class="admin-edit-form" id="edit-form-${p.product_id}" style="display:none;">
          <div class="admin-edit-form-grid">
            <div class="admin-field">
              <label>Nombre</label>
              <input type="text" class="edit-name" value="${p.name || ''}" />
            </div>
            <div class="admin-field">
              <label>Marca</label>
              <input type="text" class="edit-brand" value="${p.brand || ''}" />
            </div>
            <div class="admin-field">
              <label>Categoría</label>
              <select class="edit-category">
                <option value="Rostro" ${p.category === 'Rostro' ? 'selected' : ''}>Rostro</option>
                <option value="Labios" ${p.category === 'Labios' ? 'selected' : ''}>Labios</option>
                <option value="Ojos" ${p.category === 'Ojos' ? 'selected' : ''}>Ojos</option>
                <option value="Skin Care" ${p.category === 'Skin Care' ? 'selected' : ''}>Skin Care</option>
              </select>
            </div>
            <div class="admin-field">
              <label>Tipo</label>
              <input type="text" class="edit-type" value="${p.type || ''}" />
            </div>
            <div class="admin-field">
              <label>Tono</label>
              <input type="text" class="edit-tone" value="${p.tone || ''}" />
            </div>
            <div class="admin-field">
              <label>Etiqueta</label>
              <select class="edit-badge">
                <option value="" ${!p.badge ? 'selected' : ''}>Ninguna</option>
                <option value="bestseller" ${p.badge === 'bestseller' ? 'selected' : ''}>⭐ Bestseller</option>
                <option value="new" ${p.badge === 'new' ? 'selected' : ''}>🆕 Nuevo</option>
              </select>
            </div>
            <div class="admin-field">
              <label>Color tarjeta</label>
              <input type="color" class="edit-color" value="${p.color || '#E891A4'}" />
            </div>
            <div class="admin-field">
              <label>Emoji</label>
              <input type="text" class="edit-emoji" value="${p.emoji || ''}" maxlength="4" />
            </div>
            <div class="admin-field full-width">
              <label>Descripción</label>
              <textarea class="edit-description" rows="2">${p.description || ''}</textarea>
            </div>
            <div class="admin-field full-width">
              <label>Beneficios</label>
              <input type="text" class="edit-benefit" value="${(p.benefit || '').replace(/"/g, '&quot;')}" />
            </div>
          </div>
          <div class="admin-edit-form-actions">
            <button class="btn btn-primary btn-sm admin-save-full" data-id="${p.product_id}">💾 Guardar todo</button>
            <button class="btn btn-outline btn-sm admin-cancel-edit" data-id="${p.product_id}">Cancelar</button>
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

    // Inline image upload handlers
    container.querySelectorAll('.admin-inline-upload').forEach(input => {
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const id = input.dataset.id;
        const label = container.querySelector(`label[for="upload-${id}"]`);
        const originalContent = label.innerHTML;

        label.innerHTML = '<div style="font-size:1.5rem;">⏳</div>';

        try {
          const imageUrl = await uploadImage(file, id);
          await updateProduct(id, { image_url: imageUrl });
          label.innerHTML = `<img src="${imageUrl}" alt="Uploaded" /><div class="admin-image-overlay">📷</div>`;
        } catch (err) {
          alert('Error al subir la imagen: ' + err.message);
          label.innerHTML = originalContent;
        }
      });
    });

    // Edit button handlers (toggle edit form)
    container.querySelectorAll('.admin-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const form = document.getElementById(`edit-form-${id}`);
        if (!form) return;
        const isOpen = form.style.display !== 'none';
        // Close all other open forms first
        container.querySelectorAll('.admin-edit-form').forEach(f => f.style.display = 'none');
        form.style.display = isOpen ? 'none' : 'block';
      });
    });

    // Cancel edit handlers
    container.querySelectorAll('.admin-cancel-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const form = document.getElementById(`edit-form-${btn.dataset.id}`);
        if (form) form.style.display = 'none';
      });
    });

    // Full save handlers
    container.querySelectorAll('.admin-save-full').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const card = btn.closest('.admin-product-card');
        const form = document.getElementById(`edit-form-${id}`);

        const catVal = form.querySelector('.edit-category').value;
        const catSlugMap = { 'Rostro': 'rostro', 'Labios': 'labios', 'Ojos': 'ojos', 'Skin Care': 'skincare' };

        const brandVal = form.querySelector('.edit-brand').value.trim();
        const brandSlug = brandVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const updates = {
          name: form.querySelector('.edit-name').value.trim(),
          brand: brandVal,
          brand_slug: brandSlug,
          category: catVal,
          category_slug: catSlugMap[catVal] || 'rostro',
          type: form.querySelector('.edit-type').value.trim(),
          tone: form.querySelector('.edit-tone').value.trim(),
          badge: form.querySelector('.edit-badge').value || null,
          color: form.querySelector('.edit-color').value,
          emoji: form.querySelector('.edit-emoji').value.trim(),
          description: form.querySelector('.edit-description').value.trim(),
          benefit: form.querySelector('.edit-benefit').value.trim(),
        };

        btn.textContent = '⏳ Guardando...';
        btn.disabled = true;

        try {
          await updateProduct(id, updates);
          btn.textContent = '✅ Guardado';
          // Update the card header with new info
          card.querySelector('.admin-product-name').textContent = updates.name;
          const metaEl = card.querySelector('.admin-product-meta');
          metaEl.innerHTML = `
            <span class="admin-brand">${updates.brand}</span>
            ${updates.tone ? `<span class="admin-tone">· ${updates.tone}</span>` : ''}
            ${updates.badge ? `<span class="admin-badge admin-badge-${updates.badge}">${updates.badge === 'bestseller' ? '⭐' : '🆕'} ${updates.badge}</span>` : ''}
          `;
          setTimeout(() => {
            btn.textContent = '💾 Guardar todo';
            btn.disabled = false;
            form.style.display = 'none';
          }, 1500);
          invalidateProductCache();
        } catch (err) {
          btn.textContent = '❌ Error';
          setTimeout(() => { btn.textContent = '💾 Guardar todo'; btn.disabled = false; }, 2000);
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
