-- ====================================================
-- CoralSkin GT - Products Table + Storage
-- Ejecutar en Supabase → SQL Editor → New Query → Run
-- ====================================================

-- 1. Crear tabla de productos
CREATE TABLE IF NOT EXISTS public.products (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id      text UNIQUE NOT NULL,
  name            text NOT NULL,
  full_name       text,
  brand           text NOT NULL,
  brand_slug      text NOT NULL,
  category        text NOT NULL,
  category_slug   text NOT NULL,
  type            text DEFAULT '',
  tone            text DEFAULT '',
  price           numeric NOT NULL,
  stock           integer NOT NULL DEFAULT 0,
  status          text DEFAULT 'available',
  badge           text,
  description     text DEFAULT '',
  benefit         text DEFAULT '',
  color           text DEFAULT '#cccccc',
  emoji           text DEFAULT '✨',
  image_url       text DEFAULT '',
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 2. Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.products;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Políticas: lectura pública, escritura pública (admin usa la clave anon)
DROP POLICY IF EXISTS "Lectura publica productos" ON public.products;
CREATE POLICY "Lectura publica productos"
  ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insertar productos" ON public.products;
CREATE POLICY "Insertar productos"
  ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Actualizar productos" ON public.products;
CREATE POLICY "Actualizar productos"
  ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Eliminar productos" ON public.products;
CREATE POLICY "Eliminar productos"
  ON public.products FOR DELETE USING (true);

-- 4. Insertar los 30 productos del inventario
INSERT INTO public.products (product_id, name, full_name, brand, brand_slug, category, category_slug, type, tone, price, stock, status, badge, description, benefit, color, emoji) VALUES
('prod-01', 'Mini Bronzer & Contour', 'MINI BRONZER, CONTOUR', 'By Mario', 'bymario', 'Rostro', 'rostro', 'Contorno', 'Dark', 218, 1, 'available', 'bestseller', 'Contorno compacto que define y esculpe el rostro con acabado natural.', '✨ Fácil de difuminar · 🌑 Acabado mate · 💪 Ideal para pieles medias a oscuras', '#8D5B4C', '🤎'),
('prod-02', 'Soft Pinch Tinted Lip Oil Stain', 'SOFT PINCH TINTED LIP OIL STAIN', 'Rare Beauty', 'rare', 'Labios', 'labios', 'Lip Oil', 'Delight', 310, 1, 'available', 'bestseller', 'Aceite labial con tinte rosa suave que hidrata y aporta brillo jugoso.', '💧 Hidratación intensa · 🌸 Rosa romántico · 🐰 Vegano', '#D47385', '💋'),
('prod-03', 'Peptide Lip Tint Nourishing Glaze', 'PEPTIDE LIP TINT NOURISHING GLAZE', 'Rhode', 'rhode', 'Labios', 'labios', 'Gloss', 'Salty Tan', 265, 1, 'available', 'new', 'Gloss nutritivo con tono nude cálido que realza el color natural.', '🧴 Péptidos nutritivos · 🤎 Nude elegante · 👄 Efecto volumen', '#B88265', '✨'),
('prod-04', 'Peptide Lip Tint Nourishing Glaze', 'PEPTIDE LIP TINT NOURISHING GLAZE', 'Rhode', 'rhode', 'Labios', 'labios', 'Gloss', 'Soft Mauve', 265, 1, 'available', 'new', 'Gloss con tono malva suave para un look romántico y elegante.', '🌷 Hidratación profunda · ✨ Brillo sofisticado · 🐰 Vegano', '#B66D82', '🌷'),
('prod-05', 'Mini Soft Pinch Liquid Blush', 'MINI SOFT PINCH LIQUID BLUSH', 'Rare Beauty', 'rare', 'Rostro', 'rostro', 'Rubor', 'Hope', 218, 1, 'available', 'bestseller', 'Rubor líquido rosa frío que aporta frescura y luminosidad.', '🎨 Ultra pigmentado · 🌿 Vegano · 🌞 Larga duración', '#E891A4', '🌸'),
('prod-06', 'Salicylic Acid 2% Solution Exfoliating Serum', 'SALICYLIC ACID 2% SOLUTION, EXFOLIATING SERUM FOR ACNE', 'The Ordinary', 'theordinary', 'Skin Care', 'skincare', 'Skin Care', '', 105, 1, 'available', NULL, 'Sérum exfoliante que combate el acné y destapa poros.', '🧼 Reduce imperfecciones · ⚡ Controla grasa · ✨ Mejora textura', '#DCE8EC', '🧴'),
('prod-07', 'Mini Soft Pinch Liquid Blush', 'MINI SOFT PINCH LIQUID BLUSH', 'Rare Beauty', 'rare', 'Rostro', 'rostro', 'Rubor', 'Charme', 218, 1, 'available', NULL, 'Rubor líquido coral vibrante que ilumina el rostro.', '🌞 Pigmentación intensa · 🎨 Fácil de difuminar · 🐰 Vegano', '#E2725B', '🍑'),
('prod-08', 'Soft Pinch Tinted Lip Oil Stain', 'SOFT PINCH TINTED LIP OIL STAIN', 'Rare Beauty', 'rare', 'Labios', 'labios', 'Lip Oil', 'Joy', 310, 1, 'available', 'bestseller', 'Aceite labial coral brillante que aporta energía y frescura.', '💧 Hidratación · 🌟 Glossy jugoso · 🐰 Vegano', '#F07865', '💄'),
('prod-09', 'Niacinamide 10% + Zinc 1% Serum', 'NIACINAMIDE 10% + ZINC 1% SERUM FOR OIL SKIN', 'The Ordinary', 'theordinary', 'Skin Care', 'skincare', 'Skin Care', '', 105, 2, 'available', 'bestseller', 'Sérum que regula sebo y reduce imperfecciones.', '✨ Minimiza poros · ⚡ Controla brillo · 🧴 Mejora textura', '#E4ECF0', '💧'),
('prod-10', 'Hyaluronic Acid 2% + B5 Hydrating Serum', 'HYALURONIC ACID 2% + B5 HYDRATING SERUM WITH CERAMIDES', 'The Ordinary', 'theordinary', 'Skin Care', 'skincare', 'Skin Care', '', 148, 1, 'available', NULL, 'Sérum hidratante con ácido hialurónico y vitamina B5.', '💦 Hidratación profunda · 🛡️ Refuerza barrera · 🌸 Piel suave', '#D8EFF5', '💦'),
('prod-11', 'Major Headlines Double Take Crème & Powder Blush Duo', 'MINO MAJOR HEADLINES DOUBLE TAKE CREME & POWDER BLUSH DUO', 'Patrick Ta', 'patrickta', 'Rostro', 'rostro', 'Rubor', 'She Goes To The Gym', 320, 2, 'available', 'new', 'Dúo de rubor crema + polvo en tono rosado vibrante.', '🎨 Versatilidad · 🌟 Acabado modulable · 🕒 Larga duración', '#E45B78', '💖'),
('prod-12', 'Mini Positive Light Liquid Luminizer', 'MINI POSITIVE LIQUID LUMINIZER', 'Rare Beauty', 'rare', 'Rostro', 'rostro', 'Iluminador', 'Flaunt', 240, 1, 'available', NULL, 'Iluminador líquido dorado que aporta brillo radiante.', '🌞 Luminosidad · 💧 Fórmula ligera · 🐰 Vegano', '#F4D06F', '✨'),
('prod-13', 'Mini Soft Pop Blush Stick', 'MINI SOFT POP BLUSH STICK', 'By Mario', 'bymario', 'Rostro', 'rostro', 'Rubor', 'Pale Petal', 218, 1, 'available', NULL, 'Rubor en barra rosa suave para un look natural.', '🎨 Textura cremosa · 🌿 Fácil de aplicar · 🌞 Acabado fresco', '#F1A7B4', '🌸'),
('prod-14', 'The Acne Set with Salicylic Acid', 'THE ACNE SET WITH SALICYLIC ACID', 'The Ordinary', 'theordinary', 'Skin Care', 'skincare', 'Skin Care', '', 226, 1, 'available', 'bestseller', 'Kit con ácido salicílico para combatir imperfecciones.', '🧼 Reduce brotes · ⚡ Controla grasa · ✨ Mejora textura', '#D0E3EB', '📦'),
('prod-15', 'Mini Glycolic Acid Exfoliating Toner', 'MINI GLYOLIC ACID EXFOLIATING AND BRIGHTENING DAILY TONER', 'The Ordinary', 'theordinary', 'Skin Care', 'skincare', 'Skin Care', '', 138, 1, 'available', NULL, 'Tónico exfoliante que ilumina y mejora la textura de la piel.', '🌟 Suaviza textura · 🌞 Reduce manchas · 💧 Piel radiante', '#FFF0D4', '🧴'),
('prod-16', 'Soft Pinch Liquid Blush', 'SOFT PINCH LIQUID BLUSH', 'Rare Beauty', 'rare', 'Rostro', 'rostro', 'Rubor', 'Encourage', 320, 1, 'available', 'bestseller', 'Rubor líquido rosa cálido que aporta vitalidad.', '🎨 Pigmentación intensa · 🌿 Vegano · 🌞 Natural', '#C75D74', '💖'),
('prod-17', 'Mini Pillow Talk Glossy Lip Duo', 'MINI PILLOW TALK GLOSSY LIP DUOS', 'Charlotte Tilbury', 'charlotte', 'Labios', 'labios', 'Lip Gloss', 'Medium', 243, 1, 'available', 'bestseller', 'Dúo de gloss en tono nude rosado medio.', '💧 Hidratación · 🌟 Brillo elegante · 👑 Sensación lujosa', '#A95C68', '👑'),
('prod-18', 'Mini Pillow Talk Glossy Lip Duo', 'MINI PILLOW TALK GLOSSY LIP DUOS', 'Charlotte Tilbury', 'charlotte', 'Labios', 'labios', 'Lip Gloss', 'Original', 243, 1, 'available', 'bestseller', 'Gloss icónico en tono nude rosado clásico.', '🌸 Hidratación · ✨ Brillo sofisticado · 👑 Fórmula cómoda', '#C97D87', '👑'),
('prod-19', 'Camo Liquid Blush', 'Camo Liquid Blush', 'e.l.f.', 'elf', 'Rostro', 'rostro', 'Rubor', 'Faced Lilac', 136, 1, 'available', 'new', 'Rubor líquido en tono lila suave para un look moderno.', '🎨 Pigmentación intensa · 🌟 Acabado jugoso · 🐰 Vegano', '#C8A2C8', '💜'),
('prod-20', 'Camo Liquid Blush', 'Camo Liquid Blush', 'e.l.f.', 'elf', 'Rostro', 'rostro', 'Rubor', 'Cheeky Lychee', 136, 1, 'available', 'new', 'Rubor líquido rosa natural que aporta frescura.', '🌞 Ligero · 🎨 Modulable · 🌟 Radiante', '#F48C9E', '🌸'),
('prod-21', 'Glow Reviver Lip Oil', 'Glow Reviver Lip Oil', 'e.l.f.', 'elf', 'Labios', 'labios', 'Lip Oil', 'Hot as Fudge', 149, 1, 'available', 'bestseller', 'Aceite labial marrón cálido con brillo espejo.', '💧 Hidratación · 🤎 Tono cálido · 👄 Efecto volumen', '#7B3F28', '🍫'),
('prod-22', 'Glow Reviver Lip Oil', 'Glow Reviver Lip Oil', 'e.l.f.', 'elf', 'Labios', 'labios', 'Lip Oil', 'Jam Session', 149, 1, 'available', 'bestseller', 'Aceite labial cereza oscura con acabado glossy.', '🌸 Nutrición intensa · 🍒 Look atrevido · 🐰 Vegano', '#701C34', '🍒'),
('prod-23', 'Halo Glow Contour Beauty Wand', 'Halo Glow Contour Beauty Wand', 'e.l.f.', 'elf', 'Rostro', 'rostro', 'Contorno', 'Light / Medium', 162, 1, 'available', NULL, 'Contorno líquido luminoso para piel clara-media.', '🎨 Fácil de difuminar · 💧 Hidratante con escualano', '#B5836C', '🪄'),
('prod-24', 'Halo Glow Contour Beauty Wand', 'Halo Glow Contour Beauty Wand', 'e.l.f.', 'elf', 'Rostro', 'rostro', 'Contorno', 'Medium / Tan', 162, 1, 'available', NULL, 'Contorno líquido para piel media a bronceada.', '🌟 Esculpe y define · 🌿 Acabado natural', '#8E5A44', '🪄'),
('prod-25', 'Hydrating Core Lip Shine', 'Hydrating Core Lip Shine', 'e.l.f.', 'elf', 'Labios', 'labios', 'Lip Gloss', 'Ecstatic', 136, 1, 'available', NULL, 'Bálsamo con núcleo hidratante y tono berry intenso.', '💧 Hidratación con vitamina E · 🌸 Color translúcido', '#88294B', '💄'),
('prod-26', 'Madagascar Centella Ampoule Moisturizer', 'SKIN1004 Madagascar Centella Ampoule Face Moisturizer', 'Centella', 'centella', 'Skin Care', 'skincare', 'Skin Care', '', 162, 1, 'available', 'new', 'Hidratante facial calmante con extracto puro de centella asiática.', '🌱 Calma irritación · 🛡️ Refuerza barrera · 🌿 Piel sensible', '#D8E2DC', '🌿'),
('prod-27', 'Madagascar Centella Ampoule Soothing Serum', 'SKIN1004 Madagascar Centella Ampoule Korean Skincare', 'Centella', 'centella', 'Skin Care', 'skincare', 'Skin Care', '', 238, 1, 'available', 'bestseller', 'Sérum coreano reparador y calmante para piel sensible.', '🌸 Reduce rojeces · 💧 Hidrata · 🌱 Repara barrera cutánea', '#CED4BF', '🌱'),
('prod-28', 'Bite-Size Eyeshadow Palette', 'Bite-Size Eyeshadow', 'e.l.f.', 'elf', 'Ojos', 'ojos', 'Paleta de Sombras', 'Take Your Pink', 86, 1, 'available', NULL, 'Mini paleta de sombras rosa vibrante ultra compacta.', '🌟 Alta pigmentación · 👜 Compacta · 🐰 Vegana', '#EFA9BA', '🎨'),
('prod-29', 'Bite-Size Eyeshadow Palette', 'Bite-Size Eyeshadow', 'e.l.f.', 'elf', 'Ojos', 'ojos', 'Paleta de Sombras', 'Total Smokeshow', 86, 1, 'available', NULL, 'Mini paleta de sombras en tonos ahumados e intensos.', '🌑 Fácil de difuminar · 🕒 Larga duración · 👁️ Looks de impacto', '#5C5D60', '🖤'),
('prod-30', 'Fat Oil Lip Drip Hydrating Gloss', 'Lip IV Hydrating Lip Gloss', 'NYX', 'nyx', 'Labios', 'labios', 'Lip Oil', 'Drippin in Rose', 187, 1, 'available', 'bestseller', 'Gloss labial rosa brillante con efecto sérum hidratante.', '💧 Hidratación 12h · 🌸 Fórmula vegana · 🌟 Acabado radiante', '#D86580', '💖')
ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  full_name = EXCLUDED.full_name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  badge = EXCLUDED.badge,
  description = EXCLUDED.description,
  benefit = EXCLUDED.benefit,
  color = EXCLUDED.color,
  emoji = EXCLUDED.emoji;

-- 5. Crear bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Políticas de storage: subir y leer imágenes públicamente
DROP POLICY IF EXISTS "Lectura publica imagenes" ON storage.objects;
CREATE POLICY "Lectura publica imagenes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Subir imagenes productos" ON storage.objects;
CREATE POLICY "Subir imagenes productos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Actualizar imagenes productos" ON storage.objects;
CREATE POLICY "Actualizar imagenes productos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Eliminar imagenes productos" ON storage.objects;
CREATE POLICY "Eliminar imagenes productos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
