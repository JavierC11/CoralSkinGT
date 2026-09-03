-- ==========================================================
-- CoralSkin GT - Supabase SQL Schema
-- Copia y pega este script en el "SQL Editor" de tu proyecto Supabase
-- ==========================================================

-- 1. Tabla de Pedidos (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT NOT NULL,
  shipping_zone TEXT NOT NULL,
  shipping_department TEXT DEFAULT 'Guatemala',
  payment_method TEXT NOT NULL, -- 'transferencia' | 'deposito' | 'contra_entrega'
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_cost NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pendiente', -- 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Detalles del Pedido (Order Items)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_brand TEXT NOT NULL,
  product_tone TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Habilitar Row Level Security (RLS) y permitir inserción anónima para checkout
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede crear un pedido desde la web
CREATE POLICY "Permitir crear pedidos anonimos" 
ON public.orders FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir crear items anonimos" 
ON public.order_items FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Política: Solo usuarios autenticados (Admin) pueden ver y modificar pedidos
CREATE POLICY "Permitir lectura de pedidos al admin" 
ON public.orders FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir lectura de items al admin" 
ON public.order_items FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir actualizar pedidos al admin" 
ON public.orders FOR UPDATE 
TO authenticated 
USING (true);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
