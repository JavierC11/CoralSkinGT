// ==========================================
// CoralSkin GT - Main Application
// Hash-based SPA Router & Global Initializer
// ==========================================

import { renderHome, initHomePage } from './pages/home.js';
import { renderCatalog, initCatalogFilters } from './pages/catalog.js';
import { renderAbout } from './pages/about.js';
import { renderContact, initContactForm } from './pages/contact.js';
import { renderCheckout, initCheckoutPage } from './pages/checkout.js';
import { renderOrderSuccess, initOrderSuccessPage } from './pages/orderSuccess.js';
import { renderAdmin, initAdminPage } from './pages/admin.js';

import { initCartDrawer, toggleCart, openCart } from './components/cart.js';
import { addToCart, getCartCount, subscribeCart } from './store/cartStore.js';
import { fetchProducts } from './data/productService.js';

// --- Router Registry ---
const routes = {
  '/': { render: renderHome, title: 'Coral Skin GT | Belleza y Skincare Original', page: 'home' },
  '/catalogo': { render: renderCatalog, title: 'Catálogo de Cosméticos | Coral Skin GT', page: 'catalog' },
  '/nosotros': { render: renderAbout, title: 'Sobre Nosotros | Coral Skin GT', page: 'about' },
  '/contacto': { render: renderContact, title: 'Contacto | Coral Skin GT', page: 'contact' },
  '/checkout': { render: renderCheckout, title: 'Finalizar Compra | Coral Skin GT', page: 'checkout' },
  '/pedido-confirmado': { render: renderOrderSuccess, title: '¡Pedido Confirmado! | Coral Skin GT', page: 'order-success' },
  '/admin': { render: renderAdmin, title: 'Admin | Coral Skin GT', page: 'admin' },
};

function getRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash.split('?')[0]; // Remove query params
}

function navigate() {
  const path = getRoute();
  const route = routes[path] || routes['/'];
  const app = document.getElementById('app');

  if (!app) return;

  // Update title
  document.title = route.title;

  // Page transition
  app.classList.add('page-transitioning');

  setTimeout(() => {
    // Render page
    app.innerHTML = route.render();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Remove transition class
    requestAnimationFrame(() => {
      app.classList.remove('page-transitioning');
    });

    // Update active nav link
    updateActiveNav(route.page);

    // Initialize page-specific logic
    initPageLogic(route.page);

    // Initialize scroll reveals
    initScrollReveal();
  }, 120);
}

function updateActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

function initPageLogic(page) {
  switch (page) {
    case 'home':
      initHomePage();
      break;
    case 'catalog':
      initCatalogFilters();
      break;
    case 'contact':
      initContactForm();
      break;
    case 'checkout':
      initCheckoutPage();
      break;
    case 'order-success':
      initOrderSuccessPage();
      break;
    case 'admin':
      initAdminPage();
      break;
  }
}

// --- Navbar & Global Handlers ---
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const cartBtn = document.getElementById('nav-cart-btn');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu?.classList.toggle('open');
    document.body.style.overflow = menu?.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  menu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('active');
      menu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Navbar Cart Trigger
  cartBtn?.addEventListener('click', () => {
    toggleCart();
  });
}

// --- Update Cart Counter Badge ---
function updateCartBadge() {
  const badge = document.getElementById('nav-cart-badge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.classList.toggle('has-items', count > 0);
    
    // Tiny bounce effect
    badge.classList.remove('badge-pop');
    void badge.offsetWidth;
    badge.classList.add('badge-pop');
  }
}

// --- Global Click Delegation for "Add to Cart" ---
function initGlobalCartListeners() {
  document.addEventListener('click', async (e) => {
    const addBtn = e.target.closest('.btn-add-cart');
    if (!addBtn) return;

    e.preventDefault();
    const productId = addBtn.dataset.id;

    // Look up product in the dynamic product list
    const products = await fetchProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
      addToCart(product, 1);
      
      // Visual feedback on the clicked button
      const originalText = addBtn.innerHTML;
      addBtn.innerHTML = '✅ ¡Agregado!';
      addBtn.classList.add('btn-added');

      setTimeout(() => {
        addBtn.innerHTML = originalText;
        addBtn.classList.remove('btn-added');
      }, 1500);

      // Open cart drawer so user sees their product
      openCart();
    }
  });
}

// --- Scroll Reveal Animation Observer ---
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  reveals.forEach(el => observer.observe(el));
}

// --- App Initialization ---
function init() {
  initNavbar();
  initCartDrawer();
  initGlobalCartListeners();
  
  // Keep cart counter in sync
  updateCartBadge();
  subscribeCart(updateCartBadge);

  // Hash change routing
  window.addEventListener('hashchange', navigate);

  // Initial navigation
  navigate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
