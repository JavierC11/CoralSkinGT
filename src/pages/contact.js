// ==========================================
// CoralSkin GT - Contact Page Component
// ==========================================

import { storeConfig } from '../data/products.js';

export function renderContact() {
  return `
    <div class="contact-page" id="contact-page">
      <!-- Hero -->
      <section class="contact-hero">
        <div class="contact-hero-container">
          <h1 class="animate-fade-in-up">Atención al Cliente</h1>
          <p class="animate-fade-in-up delay-2">¿Tienes dudas sobre tonos, stock o envíos? Estamos listos para ayudarte con gusto.</p>
        </div>
      </section>

      <!-- Content -->
      <div class="contact-content">
        <div class="contact-grid">
          <!-- Contact Info -->
          <div class="contact-info reveal">
            <h2>Canales de Comunicación</h2>
            <p>Escríbenos directamente a nuestro WhatsApp oficial para atención inmediata sobre tus compras.</p>

            <div class="contact-methods">
              <a href="https://wa.me/${storeConfig.whatsappNumber}?text=Hola%20Coral%20Skin%20GT!%20Tengo%20una%20consulta" target="_blank" rel="noopener" class="contact-method" id="contact-whatsapp">
                <div class="contact-method-icon whatsapp">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.317 0-4.47-.753-6.209-2.028l-.353-.271-3.656 1.225 1.225-3.656-.271-.353A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                  </svg>
                </div>
                <div class="contact-method-text">
                  <h4>WhatsApp de Pedidos</h4>
                  <p>${storeConfig.phone}</p>
                </div>
              </a>

              <a href="https://www.instagram.com" target="_blank" rel="noopener" class="contact-method" id="contact-instagram">
                <div class="contact-method-icon instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <div class="contact-method-text">
                  <h4>Instagram</h4>
                  <p>@coralskin_gt</p>
                </div>
              </a>

              <a href="https://www.facebook.com" target="_blank" rel="noopener" class="contact-method" id="contact-facebook">
                <div class="contact-method-icon facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div class="contact-method-text">
                  <h4>Facebook</h4>
                  <p>Coral Skin GT</p>
                </div>
              </a>
            </div>

            <!-- Schedule -->
            <div class="schedule-section">
              <h4>🕐 Horarios de Atención</h4>
              <div class="schedule-row">
                <span class="day">Lunes - Viernes</span>
                <span class="hours">8:30 AM - 7:30 PM</span>
              </div>
              <div class="schedule-row">
                <span class="day">Sábado</span>
                <span class="hours">9:00 AM - 6:00 PM</span>
              </div>
              <div class="schedule-row">
                <span class="day">Domingo</span>
                <span class="hours">10:00 AM - 2:00 PM</span>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-section reveal">
            <h2>Escríbenos un Mensaje</h2>
            <form class="contact-form" id="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="contact-name">Nombre *</label>
                  <input type="text" class="form-input" id="contact-name" placeholder="Tu nombre" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-email">Email o Teléfono *</label>
                  <input type="text" class="form-input" id="contact-email" placeholder="tu@email.com o número" required />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="contact-subject">Asunto</label>
                <input type="text" class="form-input" id="contact-subject" placeholder="Consulta de producto, stock o pedido..." required />
              </div>
              <div class="form-group">
                <label class="form-label" for="contact-message">Mensaje</label>
                <textarea class="form-textarea" id="contact-message" placeholder="¿En qué podemos ayudarte?" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" id="contact-submit-btn">
                Enviar Consulta
              </button>
            </form>
            <div class="form-success" id="form-success" style="display: none;">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6BBF8A" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
              </svg>
              <h3>¡Mensaje Recibido!</h3>
              <p>Te responderemos a la brevedad. Para respuesta inmediata también puedes escribirnos por WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        success.classList.add('animate-scale-in');
      }
    }, 800);
  });
}
