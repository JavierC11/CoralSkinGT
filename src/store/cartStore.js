// ==========================================
// CoralSkin GT - Cart Store (localStorage)
// ==========================================

const CART_STORAGE_KEY = 'coralskin_cart_v1';
const listeners = new Set();

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    notifyListeners();
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex > -1) {
    const newQty = cart[existingIndex].quantity + qty;
    const maxStock = product.stock || 10;
    cart[existingIndex].quantity = Math.min(newQty, maxStock);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      tone: product.tone || '',
      price: product.price,
      emoji: product.emoji || '✨',
      color: product.color || '#E8B4B8',
      stock: product.stock || 10,
      quantity: Math.min(qty, product.stock || 10),
    });
  }

  saveCart(cart);
  return cart;
}

export function updateQuantity(productId, qty) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === productId);

  if (index > -1) {
    if (qty <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const maxStock = cart[index].stock || 10;
      cart[index].quantity = Math.min(qty, maxStock);
    }
    saveCart(cart);
  }
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function subscribeCart(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  const cart = getCart();
  listeners.forEach(cb => {
    try { cb(cart); } catch (e) { console.error(e); }
  });
  window.dispatchEvent(new CustomEvent('coralskin:cart-updated', { detail: { cart } }));
}
