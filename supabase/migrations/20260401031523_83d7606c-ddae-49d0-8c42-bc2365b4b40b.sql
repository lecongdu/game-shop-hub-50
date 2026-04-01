
-- Site settings table for deposit configuration
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can view settings" ON public.site_settings
  FOR SELECT USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings" ON public.site_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default deposit config
INSERT INTO public.site_settings (key, value) VALUES (
  'deposit_config',
  '{"bank_name": "Vietcombank", "account_number": "1234567890", "account_holder": "ACCSHOP", "note_prefix": "NAP", "min_amount": 10000}'::jsonb
);
