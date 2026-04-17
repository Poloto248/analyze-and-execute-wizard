import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "@/components/i18n/TranslationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Smartphone, Lock, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

const FIXED_OTP = "1234";

function AdminLoginPage() {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (step === 1) {
      const trimmed = phone.trim();
      if (!/^09\d{9}$/.test(trimmed)) {
        toast.error("شماره موبایل معتبر نیست");
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, phone, role')
        .eq('phone', trimmed)
        .maybeSingle();
      setLoading(false);
      if (error || !data) {
        toast.error("این شماره به‌عنوان ادمین ثبت نشده است");
        return;
      }
      toast.success("کد تایید: " + FIXED_OTP);
      setStep(2);
    } else {
      if (otp !== FIXED_OTP) {
        toast.error("کد تایید نادرست است");
        return;
      }
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_phone', phone.trim());
      navigate({ to: '/admin' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden bg-card">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <ShieldCheck className="w-10 h-10 text-primary -rotate-3" />
            </div>
            <h1 className="text-3xl font-bold font-headline">{t('admin_login_welcome')}</h1>
            <CardDescription className="text-lg">دسترسی محدود به مدیران ارشد سیستم</CardDescription>
          </div>

          <div className="space-y-6">
            {step === 1 ? (
              <div className="space-y-2">
                <Label>{t('enter_phone')}</Label>
                <div className="relative">
                  <Input 
                    className="h-14 text-xl tracking-widest text-center rounded-2xl border-2 focus:border-primary pr-12"
                    placeholder="09120000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    dir="ltr"
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                  <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('otp_code')}</Label>
                  <div className="relative">
                    <Input 
                      className="h-14 text-2xl tracking-[1em] text-center rounded-2xl border-2 focus:border-primary pr-12"
                      placeholder="----"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      type="number"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <Button variant="link" className="w-full text-primary" onClick={() => { setStep(1); setOtp(''); }}>
                  تغییر شماره موبایل
                </Button>
              </div>
            )}

            <Button 
              className="w-full h-14 text-lg rounded-2xl font-bold shadow-lg shadow-primary/20"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? "در حال بررسی..." : (step === 1 ? t('send_otp') : t('verify_login'))}
            </Button>
          </div>
        </div>

        <div className="p-6 bg-muted/30 text-center border-t">
          <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate({ to: '/' })}>
            {dir === 'rtl' ? <ArrowRight className="ml-2 w-4 h-4" /> : <ArrowLeft className="mr-2 w-4 h-4" />}
            {t('back')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
