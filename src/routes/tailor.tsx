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
  Upload, GitBranch, LogOut, Info, Navigation, Image as ImageIcon
} from "lucide-react";

export const Route = createFileRoute("/tailor")({
  component: TailorSettings,
});

interface Branch {
  id: string; name: string; apiId: string; address: string;
  phone: string; phone2?: string; phone3?: string; whatsapp: string; googleMapsUrl: string;
}

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
    branches: [
      { id: '1', name: 'شعبه مرکزی (زاهدان)', apiId: 'api_br_11', address: 'زاهدان، خیابان اصلی، روبروی مرکز تجاری، پلاک ۴۵', phone: '۰۵۴۳۳۲۲۱۱۰۰', phone2: '', phone3: '', whatsapp: '۰۹۱۵۰۰۰۰۰۰۰', googleMapsUrl: 'https://maps.app.goo.gl/example' }
    ] as Branch[]
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

  const handleBranchChange = (id: string, field: keyof Branch, value: string) => {
    setSettings(prev => ({ ...prev, branches: prev.branches.map(b => b.id === id ? { ...b, [field]: value } : b) }));
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

            {/* Branches */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 px-2"><GitBranch className="w-6 h-6 text-secondary" />{t('branches')}</h3>
              {settings.branches.map((branch) => (
                <Card key={branch.id} className="rounded-[2rem] border-none shadow-lg overflow-hidden">
                  <CardHeader className="bg-secondary/5 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center"><GitBranch className="w-4 h-4 text-secondary" /></div>
                      <Input className="h-8 font-bold text-lg p-0 focus-visible:ring-0 bg-transparent border-none" placeholder="نام شعبه" value={branch.name} onChange={(e) => handleBranchChange(branch.id, 'name', e.target.value)} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(['phone', 'phone2', 'phone3'] as const).map((field, idx) => (
                        <div key={field} className="space-y-1.5">
                          <Label className="text-xs font-bold text-muted-foreground">تلفن {idx + 1}{idx === 0 ? ' (اصلی)' : ''}</Label>
                          <div className="relative"><Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={(branch as any)[field] || ''} onChange={(e) => handleBranchChange(branch.id, field, e.target.value)} placeholder="۰۵۴..." className="h-10 pr-9" /></div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">واتس‌اپ شعبه</Label><div className="relative"><MessageCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={branch.whatsapp} onChange={(e) => handleBranchChange(branch.id, 'whatsapp', e.target.value)} className="h-10 pr-9" /></div></div>
                      <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">لینک مسیریابی</Label><div className="relative"><Navigation className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={branch.googleMapsUrl} onChange={(e) => handleBranchChange(branch.id, 'googleMapsUrl', e.target.value)} dir="ltr" className="h-10 pr-9 text-xs font-mono" /></div></div>
                    </div>
                    <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">آدرس شعبه</Label><div className="relative"><MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={branch.address} onChange={(e) => handleBranchChange(branch.id, 'address', e.target.value)} className="h-10 pr-9" /></div></div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
