// ==========================================
// CoralSkin GT - About Page Component
// ==========================================

import { storeConfig } from '../data/products.js';

export function renderAbout() {
  return `
    <div class="about-page" id="about-page">
      <!-- Hero -->
      <section class="about-hero">
        <div class="about-hero-container">
          <h1 class="animate-fade-in-up">Nuestra Historia</h1>
          <p class="animate-fade-in-up delay-2">
            En <strong>Coral Skin GT</strong> creemos que el cuidado de tu piel y tu maquillaje deben ser una experiencia de lujo, auténtica y accesible en Guatemala.
          </p>
        </div>
      </section>

      <!-- Story -->
      <div class="about-content">
        <div class="about-grid">
          <div class="about-image reveal">
            <img src="public/about-img.png" alt="Coral Skin GT - Belleza Original" loading="lazy" onerror="this.style.display='none'" />
          </div>
          <div class="about-text reveal">
            <h2>De la Pasión por el Skincare a tu Hogar</h2>
            <p>
              <strong>Coral Skin GT</strong> nació para resolver una necesidad real: encontrar productos auténticos de marcas virales y de culto que normalmente solo se consiguen en Sephora y tiendas especializadas de Estados Unidos.
            </p>
            <p>
              Seleccionamos cada fórmula y tono de marcas prestigiosas como 
              <strong>Rhode, Rare Beauty, The Ordinary, By Mario, Patrick Ta, Charlotte Tilbury, Centella (SKIN1004), e.l.f. y NYX</strong>.
            </p>
            <p>
              Garantizamos originalidad absoluta en cada producto, brindándote la tranquilidad de que estás cuidando tu rostro con lo mejor de la cosmética mundial, con envíos rápidos a cualquier rincón de Guatemala.
            </p>
            <a href="https://wa.me/${storeConfig.whatsappNumber}?text=Hola%20Coral%20Skin%20GT!%20Quiero%20conocer%20más%20sobre%20sus%20productos" 
               class="btn btn-primary" target="_blank" rel="noopener" id="about-whatsapp-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.317 0-4.47-.753-6.209-2.028l-.353-.271-3.656 1.225 1.225-3.656-.271-.353A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
              </svg>
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>

      <!-- Values -->
      <section class="about-values">
        <div class="about-values-container">
          <div class="section-header">
            <h2>Nuestros Pilares</h2>
            <p>Principios que respaldan cada pedido que entregamos</p>
          </div>
          <div class="values-grid">
            <div class="value-card reveal">
              <div class="value-icon">💎</div>
              <h3>Autenticidad Comprobada</h3>
              <p>Cero imitaciones. Todos los artículos provienen de canales autorizados y compras directas en Sephora USA.</p>
            </div>
            <div class="value-card reveal delay-1">
              <div class="value-icon">💖</div>
              <h3>Curaduría de Tendencia</h3>
              <p>Traemos los productos más virales y aclamados por la crítica de belleza internacional.</p>
            </div>
            <div class="value-card reveal delay-2">
              <div class="value-icon">🤝</div>
              <h3>Transparencia y Calidez</h3>
              <p>Trato cercano y transparente desde que realizas tu pedido hasta que lo recibes en tu puerta.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Process -->
      <section class="process-section">
        <div class="process-container">
          <div class="section-header">
            <h2>¿Cómo Comprar en Coral Skin GT?</h2>
            <p>Proceso fácil, rápido y seguro</p>
          </div>
          <div class="process-steps">
            <div class="process-step reveal">
              <div class="step-number">1</div>
              <h3>Añade a tu Carrito</h3>
              <p>Elige tus cosméticos o sérums favoritos directamente desde nuestro catálogo online.</p>
            </div>
            <div class="process-step reveal delay-1">
              <div class="step-number">2</div>
              <h3>Completa tu Checkout</h3>
              <p>Ingresa tu dirección de entrega y selecciona tu método de pago preferido.</p>
            </div>
            <div class="process-step reveal delay-2">
              <div class="step-number">3</div>
              <h3>Confirma por WhatsApp</h3>
              <p>Con un solo clic nos envías el resumen y comprobante para preparar tu paquete de inmediato.</p>
            </div>
            <div class="process-step reveal delay-3">
              <div class="step-number">4</div>
              <h3>¡Recibe y Disfruta!</h3>
              <p>Recibe tu orden en tu domicilio en Ciudad de Guatemala o cualquier departamento.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}
