
-- Fix: Drop and recreate view without SECURITY DEFINER
DROP VIEW IF EXISTS public.product_stock;

CREATE VIEW public.product_stock WITH (security_invoker = true) AS
SELECT 
  p.id,
  p.name,
  p.category,
  p.description,
  p.price,
  p.image,
  p.is_active,
  p.created_at,
  COUNT(pa.id) FILTER (WHERE pa.is_sold = false) AS stock,
  COUNT(pa.id) FILTER (WHERE pa.is_sold = true) AS sold
FROM products p
LEFT JOIN product_accounts pa ON pa.product_id = p.id
GROUP BY p.id;
