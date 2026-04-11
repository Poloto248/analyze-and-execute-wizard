import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "@/components/i18n/TranslationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Smartphone, Lock, ArrowRight, ArrowLeft, Scissors } from "lucide-react";

export const Route = createFileRoute("/tailor/login")({
  component: TailorLoginPage,
});

function TailorLoginPage() {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      navigate({ to: '/tailor' });
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
            {step === 1 ? (
              <div className="space-y-2">
                <Label>{t('enter_phone')}</Label>
                <div className="relative">
                  <Input 
                    className="h-14 text-xl tracking-widest text-center rounded-2xl border-2 focus:border-secondary pr-12"
                    placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
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
                      className="h-14 text-2xl tracking-[1em] text-center rounded-2xl border-2 focus:border-secondary pr-12"
                      placeholder="----"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      type="number"
                      autoFocus
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <Button variant="link" className="w-full text-secondary" onClick={() => setStep(1)}>
                  تغییر شماره موبایل
                </Button>
              </div>
            )}

            <Button 
              className="w-full h-14 text-lg rounded-2xl bg-secondary hover:bg-secondary/90 font-bold shadow-lg shadow-secondary/20"
              onClick={handleNext}
            >
              {step === 1 ? t('send_otp') : t('verify_login')}
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
