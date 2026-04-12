import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/tailor/login")({
  component: TailorLoginPage,
});

function TailorLoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shopId, setShopId] = useState('');
  const [shopName, setShopName] = useState('');

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('لطفاً شماره موبایل معتبر وارد کنید.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await supabase
        .from('shops')
        .select('id, name')
        .eq('manager_phone', phone)
        .maybeSingle();

      if (!data) {
        setError('شماره موبایل در سیستم ثبت نشده است. با ادمین کل تماس بگیرید.');
        setLoading(false);
        return;
      }
      setShopId(data.id);
      setShopName(data.name);
      setStep(2);
    } catch {
      setError('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
    }
    setLoading(false);
  };

  const handleVerify = () => {
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md bg-card shadow-2xl rounded-3xl overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <svg className="w-10 h-10 text-secondary -rotate-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>
            </div>
            <h1 className="text-3xl font-bold">ورود مدیر مجموعه</h1>
            <p className="text-muted-foreground text-lg">ورود به پنل مدیریت مجموعه خیاطی</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-xl text-sm">
                <svg className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                {error}
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">شماره موبایل خود را وارد کنید</label>
                <div className="relative">
                  <input
                    className="flex h-14 w-full rounded-2xl border-2 border-input bg-transparent px-3 py-1 text-xl tracking-widest text-center shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:border-secondary pr-12"
                    placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(''); }}
                    type="tel"
                    autoFocus
                  />
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">شماره‌ای که ادمین کل برای شما ثبت کرده را وارد کنید</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  فروشگاه: <span className="font-bold text-foreground">{shopName}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">کد تایید</label>
                  <div className="relative">
                    <input
                      className="flex h-14 w-full rounded-2xl border-2 border-input bg-transparent px-3 py-1 text-2xl tracking-[1em] text-center shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:border-secondary pr-12"
                      placeholder="----"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
                      type="tel"
                      inputMode="numeric"
                      autoFocus
                    />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">فعلاً هر کد ۴ رقمی قبول می‌شود</p>
                </div>
                <button
                  className="w-full text-sm text-secondary hover:underline"
                  onClick={() => { setStep(1); setError(''); setOtp(''); }}
                >
                  تغییر شماره موبایل
                </button>
              </div>
            )}

            <button
              className="w-full h-14 text-lg rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold shadow-lg shadow-secondary/20 disabled:opacity-50 transition-colors"
              onClick={step === 1 ? handleSendOtp : handleVerify}
              disabled={loading}
            >
              {loading ? 'در حال بررسی...' : step === 1 ? 'ارسال رمز یکبار مصرف' : 'تایید و ورود'}
            </button>
          </div>
        </div>

        <div className="p-6 bg-muted/30 text-center border-t">
          <button className="text-muted-foreground text-sm hover:text-foreground transition-colors" onClick={() => navigate({ to: '/' })}>
            ← بازگشت
          </button>
        </div>
      </div>
    </div>
  );
}
