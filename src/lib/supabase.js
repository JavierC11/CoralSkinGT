// ====================================================
// CoralSkin GT - Supabase & Orders Client
// ====================================================

// Supabase project credentials
export const SUPABASE_CONFIG = {
  url: 'https://wdidzptylrghvhrouejx.supabase.co',
  anonKey: 'sb_publishable_kiG7wEiPs-nOYZQgO2K5nA_4euizGdb',
};

export function getSupabaseUrl() {
  const rawUrl = localStorage.getItem('SUPABASE_URL') || SUPABASE_CONFIG.url;
  if (!rawUrl) return '';
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

export function getSupabaseKey() {
  return (localStorage.getItem('SUPABASE_ANON_KEY') || SUPABASE_CONFIG.anonKey || '').trim();
}

export function isSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  return Boolean(
    url && 
    key && 
    !url.includes('xyzcompany') && 
    key.startsWith('sb_publishable_')
  );
}

export function saveSupabaseConfig(url, anonKey) {
  if (url) localStorage.setItem('SUPABASE_URL', url.trim());
  if (anonKey) localStorage.setItem('SUPABASE_ANON_KEY', anonKey.trim());
}

/**
 * Creates a new order in Supabase (or local fallback if Supabase is not connected yet).
 */
export async function createOrder(orderData, items) {
  const orderNumber = 'CS-' + Math.floor(100000 + Math.random() * 900000);
  const orderPayload = {
    ...orderData,
    order_number: orderNumber,
    created_at: new Date().toISOString(),
    status: 'pendiente',
  };

  // 1. Try Supabase REST if configured
  if (isSupabaseConfigured()) {
    try {
      const url = getSupabaseUrl();
      const key = getSupabaseKey();

      const res = await fetch(`${url}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          order_number: orderNumber,
          customer_name: orderPayload.customerName,
          customer_phone: orderPayload.customerPhone,
          customer_email: orderPayload.customerEmail || '',
          shipping_address: orderPayload.shippingAddress,
          shipping_zone: orderPayload.shippingZone,
          shipping_department: orderPayload.shippingDepartment || 'Guatemala',
          payment_method: orderPayload.paymentMethod,
          subtotal: orderPayload.subtotal,
          shipping_cost: orderPayload.shippingCost,
          total: orderPayload.total,
          status: 'pendiente',
          notes: orderPayload.notes || '',
        }),
      });

      if (res.ok) {
        const [savedOrder] = await res.json();
        const orderId = savedOrder ? savedOrder.id : 'order-' + Date.now();

        // Insert order items
        if (items && items.length) {
          const itemsPayload = items.map(item => ({
            order_id: orderId,
            product_name: item.name,
            product_brand: item.brand,
            product_tone: item.tone || '',
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.price * item.quantity,
          }));

          await fetch(`${url}/rest/v1/order_items`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': key,
              'Authorization': `Bearer ${key}`,
            },
            body: JSON.stringify(itemsPayload),
          });
        }

        saveOrderLocally({ ...orderPayload, id: orderId, items });
        return { success: true, order: { ...orderPayload, id: orderId, items } };
      } else {
        console.warn('Supabase responded with status:', res.status, await res.text());
      }
    } catch (err) {
      console.warn('Supabase request failed, falling back to local storage order.', err);
    }
  }

  // 2. Local fallback storage (always succeeds)
  const localId = 'local-' + Date.now();
  const fullOrder = { ...orderPayload, id: localId, items };
  saveOrderLocally(fullOrder);
  return { success: true, order: fullOrder };
}

function saveOrderLocally(order) {
  try {
    const orders = getLocalOrders();
    orders.unshift(order);
    localStorage.setItem('coralskin_orders', JSON.stringify(orders));
    localStorage.setItem('coralskin_latest_order', JSON.stringify(order));
  } catch (e) {
    console.error('Error saving order locally', e);
  }
}

export function getLocalOrders() {
  try {
    const raw = localStorage.getItem('coralskin_orders');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function getLatestOrder() {
  try {
    const raw = localStorage.getItem('coralskin_latest_order');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Builds formatted WhatsApp message for order confirmation & proof of payment
 */
export function generateWhatsAppOrderMessage(order) {
  const itemsText = (order.items || [])
    .map(it => `• ${it.quantity}x *${it.name}* ${it.tone ? `(Tono: ${it.tone})` : ''} - Q${it.price * it.quantity}`)
    .join('\n');

  const paymentTextMap = {
    transferencia: '💳 Transferencia Bancaria (Banco Industrial)',
    deposito: '🏦 Depósito en Cuenta (Banco Industrial)',
    contra_entrega: '📦 Pago Contra Entrega (Efectivo al recibir)',
  };

  const message = `✨ *NUEVO PEDIDO - CORAL SKIN GT* ✨
📋 *No. Pedido:* ${order.order_number}

👤 *Cliente:* ${order.customerName}
📱 *Teléfono:* ${order.customerPhone}
📍 *Dirección:* ${order.shippingAddress} (${order.shippingZone})

🛍️ *Productos:*
${itemsText}

💵 *Subtotal:* Q${order.subtotal}
🚚 *Envío (${order.shippingZone}):* Q${order.shippingCost}
💰 *TOTAL A PAGAR:* *Q${order.total}*

💳 *Método de Pago:* ${paymentTextMap[order.paymentMethod] || order.paymentMethod}
${order.notes ? `📝 *Notas:* ${order.notes}\n` : ''}
${order.paymentMethod !== 'contra_entrega' ? '📎 *Adjunto comprobante de pago a continuación:*' : '📦 *Listo para coordinar entrega.*'}`;

  return encodeURIComponent(message);
}
