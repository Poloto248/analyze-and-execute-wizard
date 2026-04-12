import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "@/components/i18n/TranslationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Smartphone, Lock, ArrowRight, ArrowLeft, Scissors, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/tailor/login")({
  component: TailorLoginPage,
});

function TailorLoginPage() {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shopId, setShopId] = useState('');

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    // Check if phone exists in shops as manager_phone
    const { data } = await supabase
      .from('shops')
      .select('id, name, manager_phone')
      .eq('manager_phone', phone)
      .maybeSingle();

    if (!data) {
      setError('شماره موبایل در سیستم ثبت نشده است. با ادمین کل تماس بگیرید.');
      setLoading(false);
      return;
    }
    setShopId(data.id);
    // OTP not implemented yet - just go to step 2
    setStep(2);
    setLoading(false);
  };

  const handleVerify = () => {
    // OTP verification placeholder - accept any 4-digit code
    if (otp.length === 4) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tailor_shop_id', shopId);
        localStorage.setItem('tailor_authenticated', 'true');
      }
      navigate({ to: '/tailor' });
    } else {
      setError('کد تأیید باید ۴ رقمی باشد.');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      handleSendOtp();
    } else {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <Scissors className="w-10 h-10 text-secondary -rotate-3" />
            </div>
            <h1 className="text-3xl font-bold font-headline">{t('tailor_login')}</h1>
            <CardDescription className="text-lg">ورود به پنل مدیریت مجموعه خیاطی</CardDescription>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-2">
                <Label>{t('enter_phone')}</Label>
                <div className="relative">
                  <Input
                    className="h-14 text-xl tracking-widest text-center rounded-2xl border-2 focus:border-secondary pr-12"
                    placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(''); }}
                    type="tel"
                  />
                  <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">شماره‌ای که ادمین کل برای شما ثبت کرده را وارد کنید</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('otp_code')}</Label>
                  <div className="relative">
                    <Input
                      className="h-14 text-2xl tracking-[1em] text-center rounded-2xl border-2 focus:border-secondary pr-12"
                      placeholder="----"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value); setError(''); }}
                      type="number"
                      autoFocus
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">فعلاً هر کد ۴ رقمی قبول می‌شود (OTP پیاده‌سازی نشده)</p>
                </div>
                <Button variant="link" className="w-full text-secondary" onClick={() => { setStep(1); setError(''); }}>
                  تغییر شماره موبایل
                </Button>
              </div>
            )}

            <Button
              className="w-full h-14 text-lg rounded-2xl bg-secondary hover:bg-secondary/90 font-bold shadow-lg shadow-secondary/20"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? 'در حال بررسی...' : step === 1 ? t('send_otp') : t('verify_login')}
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
