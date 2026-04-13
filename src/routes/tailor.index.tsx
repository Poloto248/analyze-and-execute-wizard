import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/components/i18n/TranslationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Instagram, Send, MapPin, Store, Phone, Share2, MessageCircle,
  Upload, LogOut, Info, Image as ImageIcon, GitBranch, Globe,
  MessageSquare, Settings, LayoutDashboard
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/tailor/")({
  component: TailorDashboard,
});

interface Branch {
  id: string; name: string; address: string;
  phone: string; phone2?: string; phone3?: string; whatsapp: string;
  google_maps_url?: string; tracking_api_url?: string;
}

interface ShopData {
  id: string; name: string; manager_name: string; manager_phone: string;
  logo_url?: string; subdomain: string; domain?: string; is_domain_active?: boolean;
  sms_api?: string; sms_sender?: string; sms_template?: string;
  instagram?: string; telegram?: string; whatsapp?: string;
  eitaa?: string; bale?: string; rubika?: string;
  facebook?: string; twitter?: string; youtube?: string;
  linkedin?: string; tiktok?: string; website?: string;
  about?: string; address?: string;
}

function TailorDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [shop, setShop] = useState<ShopData | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [editName, setEditName] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editAbout, setEditAbout] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editTelegram, setEditTelegram] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editEitaa, setEditEitaa] = useState('');
  const [editBale, setEditBale] = useState('');
  const [editRubika, setEditRubika] = useState('');
  const [editBranches, setEditBranches] = useState<Branch[]>([]);
  const [branchSaving, setBranchSaving] = useState(false);

  const fetchShopData = useCallback(async (shopId: string) => {
    const { data: shopData } = await supabase.from('shops').select('*').eq('id', shopId).maybeSingle();
    if (!shopData) {
      setLoading(false);
      navigate({ to: '/tailor/login' });
      return;
    }
    setShop(shopData as ShopData);
    setEditName(shopData.name);
    setEditLogoUrl(shopData.logo_url || '');
    setEditPhone(shopData.manager_phone);
    setEditAddress(shopData.address || '');
    setEditAbout(shopData.about || '');
    setEditInstagram(shopData.instagram || '');
    setEditTelegram(shopData.telegram || '');
    setEditWhatsapp(shopData.whatsapp || '');
    setEditEitaa(shopData.eitaa || '');
    setEditBale(shopData.bale || '');
    setEditRubika(shopData.rubika || '');

    const { data: branchesData } = await supabase.from('branches').select('*').eq('shop_id', shopId);
    const mapped = (branchesData || []) as Branch[];
    setBranches(mapped);
    setEditBranches(JSON.parse(JSON.stringify(mapped)));
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;
    const auth = localStorage.getItem('tailor_authenticated');
    const shopId = localStorage.getItem('tailor_shop_id');
    if (auth !== 'true' || !shopId) {
      setLoading(false);
      navigate({ to: '/tailor/login' });
      return;
    }
    fetchShopData(shopId);
  }, [navigate, fetchShopData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setEditLogoUrl(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!shop) return;
    await supabase.from('shops').update({
      name: editName,
      logo_url: editLogoUrl || null,
      address: editAddress || null,
      about: editAbout || null,
      instagram: editInstagram || null,
      telegram: editTelegram || null,
      whatsapp: editWhatsapp || null,
      eitaa: editEitaa || null,
      bale: editBale || null,
      rubika: editRubika || null,
    }).eq('id', shop.id);
    await fetchShopData(shop.id);
  };

  const handleBranchChange = (id: string, field: keyof Branch, value: string) => {
    setEditBranches(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleSaveBranches = async () => {
    if (!shop) return;
    setBranchSaving(true);
    for (const branch of editBranches) {
      await supabase.from('branches').update({
        address: branch.address || null,
        phone: branch.phone || null,
        phone2: branch.phone2 || null,
        phone3: branch.phone3 || null,
        whatsapp: branch.whatsapp || null,
        google_maps_url: branch.google_maps_url || null,
      }).eq('id', branch.id);
    }
    await fetchShopData(shop.id);
    setBranchSaving(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tailor_authenticated');
      localStorage.removeItem('tailor_shop_id');
    }
    navigate({ to: '/tailor/login' });
  };

  if (!isMounted || loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">در حال بارگذاری...</p></div>;
  if (!shop) return null;

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="bg-card border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto p-4 md:p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 rounded-xl border">
              <AvatarImage src={shop.logo_url || ''} alt={shop.name} />
              <AvatarFallback><Store /></AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-headline">پنل مدیریت فروشگاه</h1>
              <p className="text-xs text-muted-foreground">{shop.name} • {shop.subdomain}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="w-4 h-4" />نمای کلی</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Settings className="w-4 h-4" />تنظیمات</TabsTrigger>
            <TabsTrigger value="branches" className="gap-2"><GitBranch className="w-4 h-4" />شعبه‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><GitBranch className="w-6 h-6 text-primary" /></div>
                  <div><p className="text-2xl font-bold">{branches.length}</p><p className="text-sm text-muted-foreground">شعبه</p></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center"><Globe className="w-6 h-6 text-secondary" /></div>
                  <div>
                    <p className="text-sm font-bold" dir="ltr">{shop.subdomain}</p>
                    <p className="text-sm text-muted-foreground">زیردامنه</p>
                    {shop.domain && <Badge variant={shop.is_domain_active ? "default" : "outline"} className="mt-1 text-xs">{shop.domain}</Badge>}
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><MessageSquare className="w-6 h-6 text-primary" /></div>
                  <div>
                    <p className="text-sm font-bold">{shop.sms_api ? 'فعال' : 'غیرفعال'}</p>
                    <p className="text-sm text-muted-foreground">سرویس پیامک</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Info className="w-4 h-4" />اطلاعات مدیر</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">نام مدیر:</span><span className="font-bold">{shop.manager_name}</span></div>
                <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">شماره تماس:</span><span className="font-mono" dir="ltr">{shop.manager_phone}</span></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="shadow-xl border-none overflow-hidden rounded-[2rem]">
                  <CardHeader className="bg-muted/30 pb-6 border-b">
                    <CardTitle className="flex items-center gap-2"><Store className="w-5 h-5 text-secondary" />اطلاعات اصلی مجموعه</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative group">
                        <Avatar className="w-32 h-32 rounded-3xl border-4 border-card shadow-xl">
                          <AvatarImage src={editLogoUrl} className="object-cover" />
                          <AvatarFallback className="bg-muted"><ImageIcon className="w-12 h-12 opacity-20" /></AvatarFallback>
                        </Avatar>
                        <Label htmlFor="logo-upload" className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-transform hover:scale-110">
                          <Upload className="w-5 h-5" />
                        </Label>
                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </div>
                      <div className="flex-1 w-full space-y-4">
                        <div className="space-y-2"><Label className="font-bold">نام مجموعه</Label><Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-12 text-lg rounded-xl" /></div>
                        <div className="space-y-2">
                          <Label className="font-bold">شماره تماس مدیر</Label>
                          <Input value={editPhone} disabled className="h-12 rounded-xl bg-muted/50" />
                          <p className="text-xs text-muted-foreground">برای تغییر شماره با ادمین کل تماس بگیرید</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2"><Label className="font-bold">آدرس دفتر مرکزی</Label><Textarea value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="rounded-xl min-h-[80px]" /></div>
                    <div className="space-y-2"><Label className="font-bold flex items-center gap-2"><Info className="w-4 h-4 text-secondary" />درباره مجموعه</Label><Textarea value={editAbout} onChange={(e) => setEditAbout(e.target.value)} className="rounded-xl min-h-[120px]" placeholder="توضیحات کوتاهی درباره تخصص و سوابق مجموعه..." /></div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-dashed border-2 border-muted-foreground/20 rounded-[2rem]">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <p className="text-sm">مدیریت شعبه‌ها و تنظیمات SMS فقط از طریق پنل ادمین کل امکان‌پذیر است.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="shadow-xl border-none overflow-hidden rounded-[2rem]">
                  <CardHeader className="bg-muted/30 pb-6 border-b">
                    <CardTitle className="flex items-center gap-2"><Share2 className="w-5 h-5 text-secondary" />شبکه‌های اجتماعی</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2"><Label className="flex items-center gap-2 font-bold"><Instagram className="w-4 h-4" />اینستاگرام</Label><Input value={editInstagram} onChange={(e) => setEditInstagram(e.target.value)} dir="ltr" className="rounded-xl h-11" /></div>
                    <div className="space-y-2"><Label className="flex items-center gap-2 font-bold"><Send className="w-4 h-4" />تلگرام</Label><Input value={editTelegram} onChange={(e) => setEditTelegram(e.target.value)} dir="ltr" className="rounded-xl h-11" /></div>
                    <div className="space-y-2"><Label className="flex items-center gap-2 font-bold"><MessageCircle className="w-4 h-4" />واتس‌اپ</Label><Input value={editWhatsapp} onChange={(e) => setEditWhatsapp(e.target.value)} dir="ltr" className="rounded-xl h-11" /></div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-none overflow-hidden rounded-[2rem]">
                  <CardHeader className="bg-muted/30 pb-6 border-b">
                    <CardTitle className="flex items-center gap-2">شبکه‌های ایرانی</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2"><Label className="font-bold">ایتا</Label><Input value={editEitaa} onChange={(e) => setEditEitaa(e.target.value)} dir="ltr" className="rounded-xl h-11" /></div>
                    <div className="space-y-2"><Label className="font-bold">بله</Label><Input value={editBale} onChange={(e) => setEditBale(e.target.value)} dir="ltr" className="rounded-xl h-11" /></div>
                    <div className="space-y-2"><Label className="font-bold">روبیکا</Label><Input value={editRubika} onChange={(e) => setEditRubika(e.target.value)} dir="ltr" className="rounded-xl h-11" /></div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="fixed bottom-0 inset-x-0 bg-card/80 backdrop-blur-xl border-t p-4 z-30">
              <div className="max-w-6xl mx-auto flex gap-3 justify-end">
                <Button variant="outline" className="rounded-xl" onClick={() => shop && fetchShopData(shop.id)}>انصراف</Button>
                <Button className="rounded-xl px-8 font-bold" onClick={handleSave}>ذخیره تغییرات</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="branches" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <GitBranch className="w-5 h-5" />شعبه‌ها
                <Badge variant="secondary">{branches.length}</Badge>
              </h2>
            </div>

            {branches.length === 0 ? (
              <Card className="shadow-sm border-dashed border-2">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <p>هنوز شعبه‌ای توسط ادمین کل اضافه نشده است.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map((branch) => (
                  <Card key={branch.id} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{branch.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {branch.address && <p className="text-muted-foreground">{branch.address}</p>}
                      <div className="flex flex-wrap gap-3">
                        {branch.phone && <Badge variant="outline" className="gap-1"><Phone className="w-3 h-3" />{branch.phone}</Badge>}
                        {branch.phone2 && <Badge variant="outline" className="gap-1"><Phone className="w-3 h-3" />{branch.phone2}</Badge>}
                        {branch.whatsapp && <Badge variant="outline" className="gap-1"><MessageCircle className="w-3 h-3" />{branch.whatsapp}</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
