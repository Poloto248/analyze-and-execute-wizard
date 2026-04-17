-- Create singleton system_settings table for global SMS (Kavenegar) configuration
CREATE TABLE public.system_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  sms_provider text NOT NULL DEFAULT 'kavenegar',
  kavenegar_api_key text,
  kavenegar_sender text,
  kavenegar_otp_template text,
  otp_length integer NOT NULL DEFAULT 4,
  otp_expiry_seconds integer NOT NULL DEFAULT 120,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to system_settings"
ON public.system_settings
FOR ALL
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed singleton row
INSERT INTO public.system_settings (singleton, sms_provider, otp_length, otp_expiry_seconds)
VALUES (true, 'kavenegar', 4, 120);