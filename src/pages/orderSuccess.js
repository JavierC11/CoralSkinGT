// ==========================================
// CoralSkin GT - Order Success Component
// ==========================================

import { getLatestOrder, generateWhatsAppOrderMessage } from '../lib/supabase.js';
import { storeConfig } from '../data/products.js';

export function renderOrderSuccess() {
  const order = getLatestOrder();

  if (!order) {
    return `
      <div class="order-success-page section">
        <div class="container" style="text-align: center; max-width: 600px; padding: 100px 20px;">
          <div style="font-size: 4rem; margin-bottom: 20px;">📦</div>
          <h2>No se encontró ningún pedido reciente</h2>
          <p style="color: var(--clr-text-light); margin: 15px 0 30px;">
            Te invitamos a explorar nuestro catálogo y realizar tu pedido.
          </p>
          <a href="#/catalogo" class="btn btn-primary btn-lg">Ir a la Tienda</a>
        </div>
      </div>
    `;
  }

  const isTransferOrDeposit = order.paymentMethod === 'transferencia' || order.paymentMethod === 'deposito';
  const whatsappUrl = `https://wa.me/${storeConfig.whatsappNumber}?text=${generateWhatsAppOrderMessage(order)}`;

  return `
    <div class="order-success-page section" id="order-success-page">
      <div class="container" style="max-width: 800px;">
        <div class="order-success-card card animate-scale-in">
          
          <!-- Success Header -->
          <div class="success-icon-badge">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h1 class="success-title">¡Pedido Registrado con Éxito!</h1>
          <p class="success-subtitle">
            Gracias por tu compra en <strong>Coral Skin GT</strong>. Tu orden ha sido generada correctamente.
          </p>

          <div class="order-id-badge">
            <span>Número de Pedido:</span>
            <strong>${order.order_number}</strong>
          </div>

          <!-- Action Steps Banner -->
          <div class="whatsapp-action-box">
            <div class="wa-box-header">
              <div class="wa-icon">💬</div>
              <div class="wa-box-text">
                <h3>Paso Final: Confirmar por WhatsApp</h3>
                <p>
                  ${isTransferOrDeposit 
                    ? 'Haz clic abajo para enviarnos los datos de tu pedido y adjuntar tu comprobante de pago.' 
                    : 'Haz clic abajo para enviarnos tu pedido y coordinar la entrega contra entrega.'}
                </p>
              </div>
            </div>
            
            <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg btn-block" id="btn-wa-confirm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.317 0-4.47-.753-6.209-2.028l-.353-.271-3.656 1.225 1.225-3.656-.271-.353A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
              </svg>
              Enviar Pedido a WhatsApp (+502 5348 1870)
            </a>
          </div>

          <!-- Bank info reminder if needed -->
          ${isTransferOrDeposit ? `
            <div class="order-bank-reminder">
              <h4>Datos de la Cuenta para tu Pago:</h4>
              <div class="bank-pill-row">
                <div class="bank-pill"><strong>Banco:</strong> ${storeConfig.bankInfo.bank}</div>
                <div class="bank-pill"><strong>Tipo:</strong> ${storeConfig.bankInfo.accountType}</div>
                <div class="bank-pill"><strong>Cuenta:</strong> ${storeConfig.bankInfo.accountNumber}</div>
                <div class="bank-pill"><strong>Titular:</strong> ${storeConfig.bankInfo.beneficiary}</div>
              </div>
            </div>
          ` : ''}

          <!-- Order Summary Details -->
          <div class="order-details-summary">
            <h3>Detalle del Pedido</h3>
            
            <div class="order-customer-grid">
              <div>
                <span class="detail-label">Destinatario</span>
                <strong>${order.customerName}</strong>
              </div>
              <div>
                <span class="detail-label">Teléfono</span>
                <strong>${order.customerPhone}</strong>
              </div>
              <div>
                <span class="detail-label">Zona y Departamento</span>
                <strong>${order.shippingDepartment} (${order.shippingZone})</strong>
              </div>
              <div>
                <span class="detail-label">Dirección de Entrega</span>
                <strong>${order.shippingAddress}</strong>
              </div>
            </div>

            <div class="order-items-table">
              <div class="table-header">
                <span>Producto</span>
                <span>Cant.</span>
                <span>Total</span>
              </div>
              ${(order.items || []).map(item => `
                <div class="table-row">
                  <div class="table-product">
                    <strong>${item.name}</strong>
                    <span class="table-meta">${item.brand} ${item.tone ? `· Tono: ${item.tone}` : ''}</span>
                  </div>
                  <div class="table-qty">${item.quantity}</div>
                  <div class="table-price">Q${item.price * item.quantity}</div>
                </div>
              `).join('')}
            </div>

            <div class="order-totals-receipt">
              <div class="receipt-row">
                <span>Subtotal:</span>
                <span>Q${order.subtotal}</span>
              </div>
              <div class="receipt-row">
                <span>Costo de Envío:</span>
                <span>Q${order.shippingCost}</span>
              </div>
              <div class="receipt-row receipt-total">
                <span>Total a Pagar:</span>
                <span>Q${order.total}</span>
              </div>
            </div>
          </div>

          <div class="order-actions">
            <a href="#/catalogo" class="btn btn-outline">Seguir Comprando</a>
            <a href="#/" class="btn btn-dark">Ir al Inicio</a>
          </div>

        </div>
      </div>
    </div>
  `;
}

export function initOrderSuccessPage() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
