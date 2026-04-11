import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "@/components/i18n/TranslationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Instagram, Send, MapPin, Store, Phone, Share2, MessageCircle,
  Upload, LogOut, Info, Image as ImageIcon
} from "lucide-react";

export const Route = createFileRoute("/tailor")({
  component: TailorSettings,
});

function TailorSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    title: 'خیاطی لباس بلوچی اتحاد',
    logoUrl: 'https://picsum.photos/seed/m1/200/200',
    phone: '۰۵۴۳۳۲۲۱۱۰۰',
    instagram: 'ettehad_baloch',
    telegram: 'ettehad_baloch',
    whatsapp: '09150000000',
    eitaa: 'ettehad_baloch',
    bale: 'ettehad_baloch',
    rubika: 'ettehad_baloch',
    address: 'زاهدان، خیابان اصلی، روبروی مرکز تجاری، پلاک ۴۵',
    about: 'ارائه خدمات تخصصی طراحی و دوخت لباس‌های سنتی و بلوچی با بالاترین استانداردهای کیفی.',
  });

  useEffect(() => {
    const saved = localStorage.getItem('tailor_store_settings');
    if (saved) { try { setSettings(JSON.parse(saved)); } catch (e) { console.error(e); } }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setSettings(prev => ({ ...prev, logoUrl: reader.result as string })); };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('tailor_store_settings', JSON.stringify(settings));
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="bg-card border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto p-4 md:p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 rounded-xl border">
              <AvatarImage src={settings.logoUrl} alt={settings.title} />
              <AvatarFallback><Store /></AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-headline">{t('tailor_settings')}</h1>
              <p className="text-xs text-muted-foreground">{settings.title}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => navigate({ to: '/' })}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Info */}
            <Card className="shadow-xl border-none overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-muted/30 pb-6 border-b">
                <CardTitle className="flex items-center gap-2"><Store className="w-5 h-5 text-secondary" />اطلاعات اصلی مجموعه</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 rounded-3xl border-4 border-card shadow-xl">
                      <AvatarImage src={settings.logoUrl} className="object-cover" />
                      <AvatarFallback className="bg-muted"><ImageIcon className="w-12 h-12 opacity-20" /></AvatarFallback>
                    </Avatar>
                    <Label htmlFor="logo-upload" className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-transform hover:scale-110">
                      <Upload className="w-5 h-5" />
                    </Label>
                    <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div className="space-y-2"><Label className="font-bold">{t('shop_title')}</Label><Input value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} className="h-12 text-lg rounded-xl" /></div>
                    <div className="space-y-2">
                      <Label className="font-bold">{t('phone_number')} (اصلی)</Label>
                      <div className="relative"><Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="h-12 pr-12 rounded-xl" /></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2"><Label className="font-bold">آدرس دفتر مرکزی</Label><Textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="rounded-xl min-h-[80px]" /></div>
                <div className="space-y-2"><Label className="font-bold flex items-center gap-2"><Info className="w-4 h-4 text-secondary" />{t('about_unit')}</Label><Textarea value={settings.about} onChange={(e) => setSettings({ ...settings, about: e.target.value })} className="rounded-xl min-h-[120px]" placeholder="توضیحات کوتاهی درباره تخصص و سوابق مجموعه..." /></div>
              </CardContent>
            </Card>

            {/* Notice: Branches managed by admin */}
            <Card className="shadow-sm border-dashed border-2 border-muted-foreground/20 rounded-[2rem]">
              <CardContent className="p-6 text-center text-muted-foreground">
                <p className="text-sm">مدیریت شعبه‌ها فقط از طریق پنل ادمین کل امکان‌پذیر است.</p>
              </CardContent>
            </Card>
          </div>

          {/* Social Links Sidebar */}
          <div className="space-y-8">
            <Card className="shadow-xl border-none overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-blue-50/50 pb-6 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-800"><Share2 className="w-5 h-5" />{t('social_links')}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2"><Label className="flex items-center gap-2 text-pink-600 font-bold"><Instagram className="w-4 h-4" />{t('instagram')}</Label><Input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} dir="ltr" className="rounded-xl h-11" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-2 text-blue-400 font-bold"><Send className="w-4 h-4" />{t('telegram')}</Label><Input value={settings.telegram} onChange={(e) => setSettings({ ...settings, telegram: e.target.value })} dir="ltr" className="rounded-xl h-11" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-2 text-green-600 font-bold"><MessageCircle className="w-4 h-4" />{t('whatsapp')}</Label><Input value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} dir="ltr" className="rounded-xl h-11" /></div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-none overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-orange-50/50 pb-6 border-b border-orange-100">
                <CardTitle className="flex items-center gap-2 text-orange-800">{t('internal_social_links')}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2"><Label className="font-bold">{t('eitaa')}</Label><Input value={settings.eitaa} onChange={(e) => setSettings({ ...settings, eitaa: e.target.value })} dir="ltr" className="rounded-xl h-11" /></div>
                <div className="space-y-2"><Label className="font-bold">{t('bale')}</Label><Input value={settings.bale} onChange={(e) => setSettings({ ...settings, bale: e.target.value })} dir="ltr" className="rounded-xl h-11" /></div>
                <div className="space-y-2"><Label className="font-bold">{t('rubika')}</Label><Input value={settings.rubika} onChange={(e) => setSettings({ ...settings, rubika: e.target.value })} dir="ltr" className="rounded-xl h-11" /></div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-0 inset-x-0 bg-card/80 backdrop-blur-xl border-t p-4 z-30">
          <div className="max-w-5xl mx-auto flex gap-3 justify-end">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate({ to: '/' })}>{t('cancel')}</Button>
            <Button className="rounded-xl px-8 font-bold" onClick={handleSave}>{t('save')}</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
