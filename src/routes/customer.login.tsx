import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "@/components/i18n/TranslationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Smartphone, Lock, ArrowRight, ArrowLeft, MapPin, Phone, Instagram, Send, MessageCircle,
  PackageSearch, Store, ChevronLeft, Share2, Navigation, Clock
} from "lucide-react";

export const Route = createFileRoute("/customer/login")({
  component: CustomerLoginPage,
});

const toEng = (str: string) => {
  if (!str) return '';
  const p = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  let res = str;
  for (let i = 0; i < 10; i++) { res = res.replace(p[i], i.toString()); }
  return res.replace(/[^0-9+]/g, '');
};

const formatSocialLink = (val: string, platform: string) => {
  if (!val) return '#';
  if (val.startsWith('http')) return val;
  switch (platform) {
    case 'instagram': return `https://instagram.com/${val}`;
    case 'telegram': return `https://t.me/${val}`;
    case 'whatsapp': return `https://wa.me/${toEng(val)}`;
    default: return val;
  }
};

function CustomerLoginPage() {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const storeInfo = {
    name: "خیاطی لباس بلوچی اتحاد",
    about: "ارائه خدمات تخصصی طراحی و دوخت لباس‌های سنتی و بلوچی با بالاترین استانداردهای کیفی.",
    logoUrl: "https://picsum.photos/seed/m1/200/200",
    address: "زاهدان، خیابان اصلی، روبروی مرکز تجاری، پلاک ۴۵",
    mainPhone: "۰۵۴۳۳۲۲۱۱۰۰",
    social: {
      instagram: "ettehad_baloch",
      telegram: "ettehad_baloch",
      whatsapp: "09150000000",
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      if (step === 1) { setStep(2); } else { navigate({ to: '/customer/dashboard' }); }
      setIsLoading(false);
    }, 800);
  };

  const socialPlatforms = [
    { id: 'instagram', label: 'اینستاگرام', icon: <Instagram className="w-6 h-6" />, color: 'bg-pink-50 text-pink-600' },
    { id: 'telegram', label: 'تلگرام', icon: <Send className="w-6 h-6" />, color: 'bg-sky-50 text-sky-600' },
    { id: 'whatsapp', label: 'واتس‌اپ', icon: <MessageCircle className="w-6 h-6" />, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="bg-card/80 backdrop-blur-xl border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 rounded-xl border-2 shadow-lg">
              <AvatarImage src={storeInfo.logoUrl} className="object-cover" />
              <AvatarFallback className="bg-primary/10"><Store className="w-6 h-6 text-primary" /></AvatarFallback>
            </Avatar>
            <h1 className="font-bold text-lg md:text-xl font-headline tracking-tight text-right">{storeInfo.name}</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="rounded-full gap-2 text-muted-foreground">
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t('back')}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-16">
          <div className="space-y-6 text-center lg:text-right">
            <h2 className="text-3xl md:text-4xl font-black font-headline leading-tight">
              رهگیری هوشمند <br />
              <span className="text-primary">سفارشات {storeInfo.name}</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto lg:mx-0">{storeInfo.about}</p>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 justify-start text-right">
              <MapPin className="w-5 h-5 text-primary" />
              نشانی و تماس با مجموعه
            </h3>
            <div className="bg-card rounded-[2.5rem] p-6 md:p-8 border shadow-sm space-y-6 text-right">
              <h4 className="font-bold text-xl">دفتر مرکزی</h4>
              <div className="bg-muted p-5 rounded-2xl border">
                <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest block">نشانی مجموعه</span>
                <p className="text-sm font-medium leading-relaxed mt-2">{storeInfo.address}</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <a href={`tel:${toEng(storeInfo.mainPhone)}`} className="flex items-center gap-2.5 py-2 px-4 rounded-xl bg-card border hover:border-primary transition-all shadow-sm">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-bold font-mono">{storeInfo.mainPhone}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 justify-center text-center">
              <Share2 className="w-5 h-5 text-primary" />
              شبکه‌های اجتماعی ما
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {socialPlatforms.map((social, idx) => {
                const value = storeInfo.social[social.id as keyof typeof storeInfo.social];
                if (!value) return null;
                return (
                  <a key={idx} href={formatSocialLink(value, social.id)} target="_blank" rel="noopener noreferrer"
                    className="p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 border group">
                    <div className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {social.icon}
                    </div>
                    <span className="font-bold text-sm">{social.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 w-full">
          <div className="sticky top-28 lg:pl-4">
            <Card className="rounded-[2.5rem] border-none shadow-2xl bg-card overflow-hidden max-w-md mx-auto lg:ms-auto">
              <div className="h-2 bg-primary w-full" />
              <CardHeader className="text-center pt-10 pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PackageSearch className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-black font-headline">رهگیری هوشمند سفارشات</CardTitle>
                <CardDescription className="text-sm">برای مشاهده وضعیت دوخت وارد شوید</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {step === 1 ? (
                    <div className="space-y-2 text-right">
                      <Label className="font-bold text-xs mr-2 uppercase tracking-wider">شماره موبایل</Label>
                      <div className="relative">
                        <Input 
                          className="h-14 text-xl tracking-[0.2em] text-center rounded-2xl border-2 pr-12"
                          placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          type="tel"
                        />
                        <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-right">
                      <Label className="font-bold text-xs mr-2 uppercase tracking-wider">{t('otp_code')}</Label>
                      <div className="relative">
                        <Input 
                          className="h-14 text-2xl tracking-[1em] text-center rounded-2xl border-2 pr-12"
                          placeholder="----"
                          maxLength={4}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          type="number"
                          autoFocus
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <Button variant="link" className="w-full text-primary" onClick={() => setStep(1)} type="button">
                        تغییر شماره موبایل
                      </Button>
                    </div>
                  )}
                  <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg rounded-2xl font-bold shadow-lg shadow-primary/20">
                    {isLoading ? '...' : step === 1 ? t('send_otp') : t('verify_login')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
