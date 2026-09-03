// ==========================================
// CoralSkin GT - Checkout Page Component
// ==========================================

import { getCart, getCartSubtotal, clearCart } from '../store/cartStore.js';
import { storeConfig } from '../data/products.js';
import { createOrder } from '../lib/supabase.js';

export function renderCheckout() {
  const cart = getCart();
  const subtotal = getCartSubtotal();
  const defaultShipping = storeConfig.shippingOptions[0];
  const initialTotal = subtotal + defaultShipping.price;

  if (cart.length === 0) {
    return `
      <div class="checkout-page section">
        <div class="container" style="text-align: center; max-width: 600px; padding: 100px 20px;">
          <div style="font-size: 4rem; margin-bottom: 20px;">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p style="color: var(--clr-text-light); margin: 15px 0 30px;">
            Aún no has agregado ningún producto. Descubre las marcas exclusivas disponibles en nuestro catálogo.
          </p>
          <a href="#/catalogo" class="btn btn-primary btn-lg">Explorar Catálogo</a>
        </div>
      </div>
    `;
  }

  return `
    <div class="checkout-page section" id="checkout-page">
      <div class="container">
        <div class="checkout-header animate-fade-in-up">
          <a href="#/catalogo" class="checkout-back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver a la tienda
          </a>
          <h1>Finalizar tu Pedido</h1>
          <p>Completa tus datos de entrega para coordinar el envío de tus productos 100% originales.</p>
        </div>

        <div class="checkout-grid">
          <!-- Left Column: Form -->
          <div class="checkout-form-container">
            <form id="checkout-form" class="checkout-form card animate-fade-in-up delay-1">
              
              <!-- Section 1: Datos Personales -->
              <div class="form-section">
                <div class="form-section-title">
                  <span class="step-num">1</span>
                  <h3>Datos del Cliente</h3>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="customer-name">Nombre y Apellido *</label>
                    <input type="text" class="form-input" id="customer-name" name="customerName" placeholder="Ej. Andrea Gómez" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="customer-phone">Teléfono / WhatsApp *</label>
                    <input type="tel" class="form-input" id="customer-phone" name="customerPhone" placeholder="Ej. 5348 1870" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="customer-email">Correo Electrónico (Opcional)</label>
                  <input type="email" class="form-input" id="customer-email" name="customerEmail" placeholder="tucorreo@ejemplo.com" />
                </div>
              </div>

              <!-- Section 2: Dirección y Zona de Envío -->
              <div class="form-section">
                <div class="form-section-title">
                  <span class="step-num">2</span>
                  <h3>Dirección de Entrega en Guatemala</h3>
                </div>

                <div class="form-group">
                  <label class="form-label">Zona o Región de Envío *</label>
                  <div class="shipping-options-grid">
                    ${storeConfig.shippingOptions.map((opt, idx) => `
                      <label class="shipping-option-card ${idx === 0 ? 'selected' : ''}">
                        <input type="radio" name="shippingZone" value="${opt.id}" data-price="${opt.price}" ${idx === 0 ? 'checked' : ''} />
                        <div class="shipping-option-content">
                          <span class="shipping-option-name">${opt.name}</span>
                          <span class="shipping-option-price">Q${opt.price}</span>
                        </div>
                      </label>
                    `).join('')}
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="shipping-address">Dirección Exacta (Calle, Avenida, Casa/Apto) *</label>
                    <input type="text" class="form-input" id="shipping-address" name="shippingAddress" placeholder="Ej. 5ta Avenida 12-34, Zona 10, Edificio Las Rosas Apto 4B" required />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="shipping-dept">Departamento *</label>
                    <select class="form-input" id="shipping-dept" name="shippingDepartment" required>
                      <option value="Guatemala" selected>Guatemala</option>
                      <option value="Sacatepéquez">Sacatepéquez (Antigua)</option>
                      <option value="Chimaltenango">Chimaltenango</option>
                      <option value="Escuintla">Escuintla</option>
                      <option value="Quetzaltenango">Quetzaltenango (Xela)</option>
                      <option value="Alta Verapaz">Alta Verapaz</option>
                      <option value="Baja Verapaz">Baja Verapaz</option>
                      <option value="Chiquimula">Chiquimula</option>
                      <option value="El Progreso">El Progreso</option>
                      <option value="Huehuetenango">Huehuetenango</option>
                      <option value="Izabal">Izabal</option>
                      <option value="Jalapa">Jalapa</option>
                      <option value="Jutiapa">Jutiapa</option>
                      <option value="Petén">Petén</option>
                      <option value="Quiché">Quiché</option>
                      <option value="Retalhuleu">Retalhuleu</option>
                      <option value="San Marcos">San Marcos</option>
                      <option value="Santa Rosa">Santa Rosa</option>
                      <option value="Sololá">Sololá</option>
                      <option value="Suchitepéquez">Suchitepéquez</option>
                      <option value="Totonicapán">Totonicapán</option>
                      <option value="Zacapa">Zacapa</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="shipping-reference">Referencia de Entrega</label>
                    <input type="text" class="form-input" id="shipping-reference" name="shippingReference" placeholder="Ej. Frente al parque, portón blanco" />
                  </div>
                </div>
              </div>

              <!-- Section 3: Método de Pago -->
              <div class="form-section">
                <div class="form-section-title">
                  <span class="step-num">3</span>
                  <h3>Método de Pago</h3>
                </div>

                <div class="payment-methods-grid">
                  <label class="payment-method-card selected" id="pm-card-transferencia">
                    <input type="radio" name="paymentMethod" value="transferencia" checked />
                    <div class="pm-icon">💳</div>
                    <div class="pm-info">
                      <strong>Transferencia Bancaria</strong>
                      <span>Banco Industrial (Ahorro)</span>
                    </div>
                  </label>

                  <label class="payment-method-card" id="pm-card-deposito">
                    <input type="radio" name="paymentMethod" value="deposito" />
                    <div class="pm-icon">🏦</div>
                    <div class="pm-info">
                      <strong>Depósito Bancario</strong>
                      <span>Agencia o Agente BI</span>
                    </div>
                  </label>

                  <label class="payment-method-card" id="pm-card-contra_entrega">
                    <input type="radio" name="paymentMethod" value="contra_entrega" />
                    <div class="pm-icon">📦</div>
                    <div class="pm-info">
                      <strong>Pago Contra Entrega</strong>
                      <span>Efectivo al recibir el paquete</span>
                    </div>
                  </label>
                </div>

                <!-- Bank details box -->
                <div id="bank-details-box" class="bank-details-box animate-fade-in">
                  <div class="bank-box-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    <h4>Datos para Transferencia / Depósito</h4>
                  </div>
                  <div class="bank-box-details">
                    <div class="bank-row">
                      <span class="label">Banco:</span>
                      <span class="val"><strong>${storeConfig.bankInfo.bank}</strong></span>
                    </div>
                    <div class="bank-row">
                      <span class="label">Tipo de Cuenta:</span>
                      <span class="val">${storeConfig.bankInfo.accountType}</span>
                    </div>
                    <div class="bank-row">
                      <span class="label">Número de Cuenta:</span>
                      <span class="val account-number">
                        <strong>${storeConfig.bankInfo.accountNumber}</strong>
                        <button type="button" class="copy-btn" id="copy-account-btn" title="Copiar cuenta">📋 Copiar</button>
                      </span>
                    </div>
                    <div class="bank-row">
                      <span class="label">A nombre de:</span>
                      <span class="val"><strong>${storeConfig.bankInfo.beneficiary}</strong></span>
                    </div>
                  </div>
                  <p class="bank-box-instructions">
                    💡 Al completar tu pedido, serás dirigido a enviar tu comprobante a nuestro WhatsApp oficial para despacho inmediato.
                  </p>
                </div>
              </div>

              <!-- Section 4: Notas adicionales -->
              <div class="form-section">
                <div class="form-group">
                  <label class="form-label" for="order-notes">Instrucciones o Notas Especiales (Opcional)</label>
                  <textarea class="form-textarea" id="order-notes" name="notes" placeholder="Ej. Entregar en horario matutino o dejar en garita..." style="min-height: 80px;"></textarea>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg btn-block" id="btn-submit-order">
                <span id="btn-submit-text">Confirmar Pedido y Continuar (Q<span id="btn-submit-total">${initialTotal}</span>)</span>
                <span id="btn-submit-spinner" style="display: none;">Procesando pedido...</span>
              </button>
            </form>
          </div>

          <!-- Right Column: Order Summary -->
          <div class="checkout-summary-container">
            <div class="checkout-summary-card card animate-fade-in-up delay-2">
              <h3>Resumen de Compra</h3>
              
              <div class="checkout-items-list">
                ${cart.map(item => `
                  <div class="checkout-item">
                    <div class="checkout-item-badge">
                      <div class="checkout-item-img" style="background: ${item.color}33;">
                        <span>${item.emoji}</span>
                      </div>
                      <span class="checkout-item-qty">${item.quantity}</span>
                    </div>
                    <div class="checkout-item-details">
                      <div class="item-brand">${item.brand}</div>
                      <div class="item-name">${item.name}</div>
                      ${item.tone ? `<div class="item-tone">Tono: ${item.tone}</div>` : ''}
                    </div>
                    <div class="checkout-item-price">Q${item.price * item.quantity}</div>
                  </div>
                `).join('')}
              </div>

              <div class="checkout-totals">
                <div class="total-row">
                  <span>Subtotal productos (${cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>Q${subtotal}</span>
                </div>
                <div class="total-row">
                  <span>Envío</span>
                  <span id="summary-shipping-price">Q${defaultShipping.price}</span>
                </div>
                <div class="total-row total-highlight">
                  <span>Total a Pagar</span>
                  <span id="summary-total-price">Q${initialTotal}</span>
                </div>
              </div>

              <div class="checkout-guarantee">
                <div class="guarantee-item">
                  <span>🛡️</span>
                  <div>
                    <strong>100% Originales</strong>
                    <p>Importados directo desde Sephora USA</p>
                  </div>
                </div>
                <div class="guarantee-item">
                  <span>💬</span>
                  <div>
                    <strong>Soporte WhatsApp</strong>
                    <p>Confirmación inmediata de tu pedido</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initCheckoutPage() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const subtotal = getCartSubtotal();
  let currentShippingPrice = storeConfig.shippingOptions[0].price;

  // Handle shipping zone change
  const shippingRadios = document.querySelectorAll('input[name="shippingZone"]');
  shippingRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.shipping-option-card').forEach(card => card.classList.remove('selected'));
      e.target.closest('.shipping-option-card').classList.add('selected');
      
      currentShippingPrice = parseInt(e.target.dataset.price, 10);
      updateTotals();
    });
  });

  // Handle payment method change
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const bankBox = document.getElementById('bank-details-box');
  
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.payment-method-card').forEach(card => card.classList.remove('selected'));
      e.target.closest('.payment-method-card').classList.add('selected');

      if (e.target.value === 'contra_entrega') {
        bankBox.style.display = 'none';
      } else {
        bankBox.style.display = 'block';
      }
    });
  });

  // Copy account number
  document.getElementById('copy-account-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(storeConfig.bankInfo.accountNumber).then(() => {
      const btn = document.getElementById('copy-account-btn');
      btn.textContent = '✅ ¡Copiado!';
      setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2500);
    });
  });

  function updateTotals() {
    const total = subtotal + currentShippingPrice;
    const summaryShipping = document.getElementById('summary-shipping-price');
    const summaryTotal = document.getElementById('summary-total-price');
    const btnTotal = document.getElementById('btn-submit-total');

    if (summaryShipping) summaryShipping.textContent = `Q${currentShippingPrice}`;
    if (summaryTotal) summaryTotal.textContent = `Q${total}`;
    if (btnTotal) btnTotal.textContent = total;
  }

  // Handle Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('btn-submit-order');
    const submitText = document.getElementById('btn-submit-text');
    const submitSpinner = document.getElementById('btn-submit-spinner');

    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitSpinner.style.display = 'inline-block';

    const formData = new FormData(form);
    const cart = getCart();

    const shippingOpt = storeConfig.shippingOptions.find(o => o.id === formData.get('shippingZone')) || storeConfig.shippingOptions[0];
    const total = subtotal + shippingOpt.price;

    const orderData = {
      customerName: formData.get('customerName'),
      customerPhone: formData.get('customerPhone'),
      customerEmail: formData.get('customerEmail') || '',
      shippingZone: shippingOpt.name,
      shippingAddress: formData.get('shippingAddress'),
      shippingDepartment: formData.get('shippingDepartment'),
      shippingReference: formData.get('shippingReference') || '',
      paymentMethod: formData.get('paymentMethod'),
      subtotal: subtotal,
      shippingCost: shippingOpt.price,
      total: total,
      notes: formData.get('notes') || '',
    };

    try {
      const result = await createOrder(orderData, cart);
      
      // Clear cart
      clearCart();

      // Redirect to success page
      window.location.hash = '#/pedido-confirmado';
    } catch (err) {
      console.error('Error creating order', err);
      alert('Ocurrió un error al procesar el pedido. Por favor intenta de nuevo.');
      submitBtn.disabled = false;
      submitText.style.display = 'inline-block';
      submitSpinner.style.display = 'none';
    }
  });
}
