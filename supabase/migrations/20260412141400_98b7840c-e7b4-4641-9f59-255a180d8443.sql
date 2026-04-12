
-- Create shops table
CREATE TABLE public.shops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  manager_phone TEXT NOT NULL,
  logo_url TEXT,
  subdomain TEXT NOT NULL,
  domain TEXT,
  is_domain_active BOOLEAN DEFAULT false,
  sms_api TEXT,
  sms_sender TEXT,
  sms_template TEXT,
  instagram TEXT,
  telegram TEXT,
  whatsapp TEXT,
  eitaa TEXT,
  bale TEXT,
  rubika TEXT,
  facebook TEXT,
  twitter TEXT,
  youtube TEXT,
  linkedin TEXT,
  tiktok TEXT,
  website TEXT,
  about TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create branches table
CREATE TABLE public.branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  phone2 TEXT,
  phone3 TEXT,
  whatsapp TEXT,
  google_maps_url TEXT,
  tracking_api_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow all access for now
CREATE POLICY "Allow all access to shops" ON public.shops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to branches" ON public.branches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to admin_users" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX idx_branches_shop_id ON public.branches(shop_id);
CREATE INDEX idx_shops_manager_phone ON public.shops(manager_phone);
CREATE INDEX idx_shops_subdomain ON public.shops(subdomain);
CREATE INDEX idx_admin_users_phone ON public.admin_users(phone);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Default super admin
INSERT INTO public.admin_users (name, phone, role) VALUES ('مدیر اصلی سیستم', '09120000000', 'super_admin');
