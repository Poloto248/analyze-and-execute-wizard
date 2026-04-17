import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/components/i18n/TranslationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Trash2, Key, User, Edit2, Search, MoreVertical, Store,
  Upload, GitBranch, X, Phone, MessageCircle, Globe, CheckCircle2,
  AlertCircle, LogOut, Navigation, Image as ImageIcon, Shield, ShieldCheck,
  MessageSquare, Hash, FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface Branch {
  id: string; name: string; address: string;
  phone: string; phone2?: string; phone3?: string; whatsapp: string;
  googleMapsUrl?: string; trackingApiUrl?: string;
}

interface Shop {
  id: string; name: string; manager_name: string;
  manager_phone: string; logo_url?: string; subdomain: string;
  domain?: string; is_domain_active?: boolean;
  sms_api?: string; sms_sender?: string; sms_template?: string;
  instagram?: string; telegram?: string; whatsapp?: string; eitaa?: string;
  bale?: string; rubika?: string; facebook?: string; twitter?: string;
  youtube?: string; linkedin?: string; tiktok?: string; website?: string;
  about?: string; address?: string;
  branches: Branch[];
}

interface AdminUser {
  id: string; name: string; phone: string; role: 'super_admin' | 'admin';
  created_at: string;
}

function generateSlug(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]/g, '') || 'shop';
}

function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("shops");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDomainDialogOpen, setIsDomainDialogOpen] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [shops, setShops] = useState<Shop[]>([]);
  const emptyForm: Shop = {
    id: '', name: '', manager_name: '', manager_phone: '', logo_url: '', subdomain: '',
    sms_api: '', sms_sender: '', sms_template: '',
    instagram: '', telegram: '', whatsapp: '', eitaa: '', bale: '', rubika: '',
    facebook: '', twitter: '', youtube: '', linkedin: '', tiktok: '', website: '',
    about: '', address: '', branches: []
  };
  const [formData, setFormData] = useState<Shop>({ ...emptyForm });
  const [domainData, setDomainData] = useState({ unitId: '', domain: '', status: 'pending' as 'active' | 'pending' });
  const [isCheckingDns, setIsCheckingDns] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminFormData, setAdminFormData] = useState<AdminUser>({ id: '', name: '', phone: '', role: 'admin', created_at: '' });
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);

  const fetchShops = useCallback(async () => {
    const { data: shopsData } = await supabase.from('shops').select('*').order('created_at', { ascending: false });
    if (!shopsData) return;
    const { data: branchesData } = await supabase.from('branches').select('*');
    const result: Shop[] = shopsData.map((s: any) => ({
      id: s.id, name: s.name, manager_name: s.manager_name, manager_phone: s.manager_phone,
      logo_url: s.logo_url, subdomain: s.subdomain, domain: s.domain, is_domain_active: s.is_domain_active,
      sms_api: s.sms_api, sms_sender: s.sms_sender, sms_template: s.sms_template,
      instagram: s.instagram, telegram: s.telegram, whatsapp: s.whatsapp,
      eitaa: s.eitaa, bale: s.bale, rubika: s.rubika,
      facebook: s.facebook, twitter: s.twitter, youtube: s.youtube,
      linkedin: s.linkedin, tiktok: s.tiktok, website: s.website,
      about: s.about, address: s.address,
      branches: (branchesData || []).filter((b: any) => b.shop_id === s.id).map((b: any) => ({
        id: b.id, name: b.name, address: b.address || '', phone: b.phone || '',
        phone2: b.phone2, phone3: b.phone3, whatsapp: b.whatsapp || '',
        googleMapsUrl: b.google_maps_url, trackingApiUrl: b.tracking_api_url,
      }))
    }));
    setShops(result);
  }, []);

  const fetchAdmins = useCallback(async () => {
    const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
    if (data) {
      setAdmins(data.map((a: any) => ({
        id: a.id, name: a.name, phone: a.phone, role: a.role,
        created_at: new Date(a.created_at).toLocaleDateString('fa-IR'),
      })));
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      Promise.all([fetchShops(), fetchAdmins()]).then(() => setLoading(false));
    } else {
      navigate({ to: '/admin/login' });
    }
  }, [navigate, fetchShops, fetchAdmins]);

  const handleLogout = () => { localStorage.removeItem('admin_authenticated'); navigate({ to: '/admin/login' }); };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setFormData(prev => ({ ...prev, logo_url: reader.result as string })); };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBranch = () => {
    const newBranch: Branch = { id: crypto.randomUUID(), name: '', address: '', phone: '', whatsapp: '', googleMapsUrl: '', trackingApiUrl: '' };
    setFormData(prev => ({ ...prev, branches: [...prev.branches, newBranch] }));
  };
  const handleRemoveBranch = (id: string) => { setFormData(prev => ({ ...prev, branches: prev.branches.filter(b => b.id !== id) })); };
  const handleBranchChange = (id: string, field: keyof Branch, value: string) => {
    setFormData(prev => ({ ...prev, branches: prev.branches.map(b => b.id === id ? { ...b, [field]: value } : b) }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.manager_phone || !formData.manager_name) return;
    const subdomain = formData.subdomain || `${generateSlug(formData.name)}.tailorpanel.com`;
    const shopPayload = {
      name: formData.name, manager_name: formData.manager_name, manager_phone: formData.manager_phone,
      logo_url: formData.logo_url || null, subdomain,
      domain: formData.domain || null, is_domain_active: formData.is_domain_active || false,
      sms_api: formData.sms_api || null, sms_sender: formData.sms_sender || null, sms_template: formData.sms_template || null,
      instagram: formData.instagram || null, telegram: formData.telegram || null, whatsapp: formData.whatsapp || null,
      eitaa: formData.eitaa || null, bale: formData.bale || null, rubika: formData.rubika || null,
      facebook: formData.facebook || null, twitter: formData.twitter || null, youtube: formData.youtube || null,
      linkedin: formData.linkedin || null, tiktok: formData.tiktok || null, website: formData.website || null,
      about: formData.about || null, address: formData.address || null,
    };

    let shopId = formData.id;
    if (isEditing) {
      await supabase.from('shops').update(shopPayload).eq('id', shopId);
      // Delete old branches, re-insert
      await supabase.from('branches').delete().eq('shop_id', shopId);
    } else {
      const { data } = await supabase.from('shops').insert(shopPayload).select('id').single();
      if (data) shopId = data.id;
    }
    // Insert branches
    if (formData.branches.length > 0) {
      const branchRows = formData.branches.map(b => ({
        shop_id: shopId, name: b.name, address: b.address || null, phone: b.phone || null,
        phone2: b.phone2 || null, phone3: b.phone3 || null, whatsapp: b.whatsapp || null,
        google_maps_url: b.googleMapsUrl || null, tracking_api_url: b.trackingApiUrl || null,
      }));
      await supabase.from('branches').insert(branchRows);
    }
    await fetchShops();
    resetForm(); setIsFormOpen(false);
  };

  const handleSaveDomain = async () => {
    await supabase.from('shops').update({ domain: domainData.domain, is_domain_active: domainData.status === 'active' }).eq('id', domainData.unitId);
    await fetchShops();
    setIsDomainDialogOpen(false);
  };

  const handleCheckDns = () => {
    setIsCheckingDns(true);
    setTimeout(() => {
      setIsCheckingDns(false);
      setDomainData(prev => ({ ...prev, status: Math.random() > 0.5 ? 'active' : 'pending' }));
    }, 2000);
  };

  const resetForm = () => { setFormData({ ...emptyForm }); setIsEditing(false); };

  const startEdit = (shop: Shop) => { setFormData(JSON.parse(JSON.stringify(shop))); setIsEditing(true); setIsFormOpen(true); };
  const startSetDomain = (shop: Shop) => { setDomainData({ unitId: shop.id, domain: shop.domain || '', status: shop.is_domain_active ? 'active' : 'pending' }); setIsDomainDialogOpen(true); };
  const deleteUnit = async (id: string) => { await supabase.from('shops').delete().eq('id', id); await fetchShops(); };

  const handleSaveAdmin = async () => {
    if (!adminFormData.name || !adminFormData.phone) return;
    if (isEditingAdmin) {
      await supabase.from('admin_users').update({ name: adminFormData.name, phone: adminFormData.phone, role: adminFormData.role }).eq('id', adminFormData.id);
    } else {
      await supabase.from('admin_users').insert({ name: adminFormData.name, phone: adminFormData.phone, role: adminFormData.role });
    }
    await fetchAdmins();
    setAdminFormData({ id: '', name: '', phone: '', role: 'admin', created_at: '' });
    setIsEditingAdmin(false); setIsAdminDialogOpen(false);
  };
  const startEditAdmin = (admin: AdminUser) => { setAdminFormData({ ...admin }); setIsEditingAdmin(true); setIsAdminDialogOpen(true); };
  const deleteAdmin = async (id: string) => { await supabase.from('admin_users').delete().eq('id', id); await fetchAdmins(); };

  if (!isMounted || !isAuthenticated) return null;
  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">در حال بارگذاری...</p></div>;

  return (
    <div dir="rtl" className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8 text-right">
      <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4">
        <Button variant="outline" onClick={handleLogout}><LogOut className="ml-2 w-4 h-4" />خروج</Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline">{t('admin_dashboard')}</h1>
          <p className="text-sm text-muted-foreground mt-1">پنل مدیریت سراسری (سوپر ادمین)</p>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="text-right">
        <TabsList className="grid w-full grid-cols-2 max-w-md mr-0 ml-auto">
          <TabsTrigger value="shops" className="gap-2 flex-row-reverse"><Store className="w-4 h-4" />مدیریت فروشگاه‌ها</TabsTrigger>
          <TabsTrigger value="admins" className="gap-2 flex-row-reverse"><Shield className="w-4 h-4" />مدیریت ادمین‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="shops" className="space-y-4 mt-6">
          <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 flex-row-reverse">
              {t('tailoring_units')}
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{shops.length}</span>
            </h2>
            <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={() => { resetForm(); setIsFormOpen(true); }}><Plus className="ml-2 w-4 h-4" />{t('add_new_unit')}</Button>
            </div>
          </div>
          <Card className="shadow-sm border-none overflow-hidden">
            <div className="overflow-x-auto" dir="rtl">
              <Table>
                 <TableHeader className="bg-muted/50">
                   <TableRow>
                     <TableHead className="min-w-[200px] text-right">{t('unit_name')}</TableHead>
                     <TableHead className="hidden sm:table-cell text-right">{t('manager_name')}</TableHead>
                     <TableHead className="hidden sm:table-cell text-right">تعداد شعب</TableHead>
                     <TableHead className="text-left">{t('actions')}</TableHead>
                   </TableRow>
                 </TableHeader>
                <TableBody>
                  {shops.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">هیچ مجموعه‌ای یافت نشد.</TableCell></TableRow>
                  ) : shops.map((shop) => (
                    <TableRow key={shop.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3 flex-row-reverse justify-end">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-sm md:text-base">{shop.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono" dir="ltr">{shop.subdomain}</span>
                          </div>
                          <Avatar className="w-10 h-10 rounded-xl border-2 border-primary/10">
                            <AvatarImage src={shop.logo_url} alt={shop.name} />
                            <AvatarFallback className="bg-primary/5"><Store className="w-5 h-5 text-primary" /></AvatarFallback>
                          </Avatar>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right">
                        <div className="flex items-center gap-2 text-sm flex-row-reverse justify-end"><User className="w-3 h-3 text-muted-foreground" />{shop.manager_name}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right">
                        <Badge variant="secondary" className="gap-1 flex-row-reverse">
                          <GitBranch className="w-3 h-3" />
                          {shop.branches.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => startEdit(shop)}><Edit2 className="w-4 h-4 ml-2" />{t('edit')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => startSetDomain(shop)}><Globe className="w-4 h-4 ml-2 text-blue-500" />{t('set_domain')}</DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteUnit(shop.id)}><Trash2 className="w-4 h-4 ml-2" />{t('delete')}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              مدیریت ادمین‌ها
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{admins.length}</span>
            </h2>
            <Button onClick={() => { setAdminFormData({ id: '', name: '', phone: '', role: 'admin', created_at: '' }); setIsEditingAdmin(false); setIsAdminDialogOpen(true); }}>
              <Plus className="ml-2 w-4 h-4" />افزودن ادمین جدید
            </Button>
          </div>
          <Card className="shadow-sm border-none overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                 <TableHeader className="bg-muted/50">
                   <TableRow>
                     <TableHead className="text-right">نام</TableHead>
                     <TableHead className="text-right">شماره تماس</TableHead>
                     <TableHead className="text-right">سطح دسترسی</TableHead>
                     <TableHead className="hidden sm:table-cell text-right">تاریخ ایجاد</TableHead>
                     <TableHead className="text-center">عملیات</TableHead>
                   </TableRow>
                 </TableHeader>
                <TableBody>
                  {admins.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">هیچ ادمینی یافت نشد.</TableCell></TableRow>
                  ) : admins.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${admin.role === 'super_admin' ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                            {admin.role === 'super_admin' ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                          </div>
                          <span className="font-bold">{admin.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm" dir="ltr">{admin.phone}</TableCell>
                      <TableCell>
                        <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'} className={admin.role === 'super_admin' ? 'bg-amber-100 text-amber-800' : ''}>
                          {admin.role === 'super_admin' ? 'سوپر ادمین' : 'ادمین'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{admin.created_at}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditAdmin(admin)}><Edit2 className="w-4 h-4 ml-2" />ویرایش</DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteAdmin(admin.id)}><Trash2 className="w-4 h-4 ml-2" />حذف</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Shop Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh]" dir="rtl">
          <DialogHeader className="p-6 pb-2 shrink-0">
            <DialogTitle className="text-xl flex items-center gap-2 text-right">
              {isEditing ? <Edit2 className="w-5 h-5 text-secondary" /> : <Plus className="w-5 h-5 text-primary" />}
              {isEditing ? 'ویرایش فروشگاه' : 'افزودن فروشگاه جدید'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            <div className="space-y-6 pb-6 text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>لوگوی فروشگاه</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 rounded-2xl border-2 border-dashed border-muted-foreground/20">
                        <AvatarImage src={formData.logo_url} className="object-cover" />
                        <AvatarFallback className="bg-muted/50"><ImageIcon className="w-8 h-8 opacity-20" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/20 transition-colors">
                          <Upload className="w-4 h-4" />آپلود تصویر
                        </Label>
                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2"><Label>نام فروشگاه</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="نام مجموعه" /></div>
                  <div className="space-y-2"><Label>نام مدیر</Label><Input value={formData.manager_name} onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })} placeholder="نام مدیر" /></div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2"><Label>شماره مدیر (برای ورود OTP)</Label><Input value={formData.manager_phone} onChange={(e) => setFormData({ ...formData, manager_phone: e.target.value })} placeholder="0912XXXXXXX" type="tel" /></div>
                </div>
              </div>

              <Separator />
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary" />شبکه‌های اجتماعی ایرانی</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>ایتا</Label><Input value={formData.eitaa || ''} onChange={(e) => setFormData({ ...formData, eitaa: e.target.value })} placeholder="https://eitaa.com/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>بله</Label><Input value={formData.bale || ''} onChange={(e) => setFormData({ ...formData, bale: e.target.value })} placeholder="https://ble.ir/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>روبیکا</Label><Input value={formData.rubika || ''} onChange={(e) => setFormData({ ...formData, rubika: e.target.value })} placeholder="https://rubika.ir/..." dir="ltr" /></div>
                </div>
              </div>

              <Separator />
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-secondary" />شبکه‌های اجتماعی بین‌المللی</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>اینستاگرام</Label><Input value={formData.instagram || ''} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="https://instagram.com/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>تلگرام</Label><Input value={formData.telegram || ''} onChange={(e) => setFormData({ ...formData, telegram: e.target.value })} placeholder="https://t.me/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>واتس‌اپ</Label><Input value={formData.whatsapp || ''} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="https://wa.me/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>فیس‌بوک</Label><Input value={formData.facebook || ''} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} placeholder="https://facebook.com/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>توییتر / X</Label><Input value={formData.twitter || ''} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} placeholder="https://x.com/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>یوتیوب</Label><Input value={formData.youtube || ''} onChange={(e) => setFormData({ ...formData, youtube: e.target.value })} placeholder="https://youtube.com/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>لینکدین</Label><Input value={formData.linkedin || ''} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>تیک‌تاک</Label><Input value={formData.tiktok || ''} onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })} placeholder="https://tiktok.com/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>وب‌سایت</Label><Input value={formData.website || ''} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://..." dir="ltr" /></div>
                </div>
              </div>

              <Separator />
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-500" />تنظیمات پیامک (SMS)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-muted-foreground" />API SMS</Label><Input value={formData.sms_api || ''} onChange={(e) => setFormData({ ...formData, sms_api: e.target.value })} placeholder="کلید API سرویس پیامکی" dir="ltr" /></div>
                  <div className="space-y-2"><Label className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5 text-muted-foreground" />شماره خط ارسال‌کننده</Label><Input value={formData.sms_sender || ''} onChange={(e) => setFormData({ ...formData, sms_sender: e.target.value })} placeholder="مثلاً 30007732" dir="ltr" /></div>
                  <div className="space-y-2"><Label className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-muted-foreground" />الگو (Template)</Label><Input value={formData.sms_template || ''} onChange={(e) => setFormData({ ...formData, sms_template: e.target.value })} placeholder="کد الگوی پیامکی" dir="ltr" /></div>
                </div>
              </div>

              <Separator />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2"><GitBranch className="w-5 h-5 text-secondary" />مدیریت شعبه‌ها</h3>
                  <Button variant="outline" size="sm" onClick={handleAddBranch}><Plus className="w-4 h-4 ml-1" />افزودن شعبه</Button>
                </div>
                {formData.branches.length === 0 && <p className="text-sm text-muted-foreground text-center py-6 border rounded-lg border-dashed">هنوز شعبه‌ای اضافه نشده است.</p>}
                {formData.branches.map((branch) => (
                  <Card key={branch.id} className="p-4 space-y-3 relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 left-2" onClick={() => handleRemoveBranch(branch.id)}><X className="w-4 h-4 text-destructive" /></Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1"><Label className="text-xs">نام شعبه</Label><Input value={branch.name} onChange={(e) => handleBranchChange(branch.id, 'name', e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-xs">تلفن ۱</Label><Input value={branch.phone} onChange={(e) => handleBranchChange(branch.id, 'phone', e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-xs">تلفن ۲</Label><Input value={branch.phone2 || ''} onChange={(e) => handleBranchChange(branch.id, 'phone2', e.target.value)} placeholder="شماره دوم (اختیاری)" /></div>
                      <div className="space-y-1"><Label className="text-xs">واتس‌اپ</Label><Input value={branch.whatsapp} onChange={(e) => handleBranchChange(branch.id, 'whatsapp', e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-xs">آدرس</Label><Input value={branch.address} onChange={(e) => handleBranchChange(branch.id, 'address', e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-xs">لینک مسیریابی</Label><Input value={branch.googleMapsUrl || ''} onChange={(e) => handleBranchChange(branch.id, 'googleMapsUrl', e.target.value)} dir="ltr" /></div>
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1"><Navigation className="w-3 h-3 text-muted-foreground" />API رهگیری سفارش (placeholder)</Label>
                        <Input value={branch.trackingApiUrl || ''} onChange={(e) => handleBranchChange(branch.id, 'trackingApiUrl', e.target.value)} placeholder="https://api.example.com/tracking" dir="ltr" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-2 shrink-0 border-t">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>انصراف</Button>
            <Button onClick={handleSave}>ذخیره</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Domain Dialog */}
      <Dialog open={isDomainDialogOpen} onOpenChange={setIsDomainDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-blue-500" />{t('set_domain')}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>دامنه اختصاصی</Label><Input value={domainData.domain} onChange={(e) => setDomainData({ ...domainData, domain: e.target.value })} placeholder="example.com" dir="ltr" /></div>
            <div className="flex items-center gap-2">
              {domainData.status === 'active' ? <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 ml-1" />فعال</Badge> : <Badge variant="outline" className="text-orange-600 border-orange-200"><AlertCircle className="w-3 h-3 ml-1" />در انتظار</Badge>}
            </div>
            <Button variant="outline" className="w-full" onClick={handleCheckDns} disabled={isCheckingDns}>{isCheckingDns ? 'در حال بررسی...' : 'بررسی DNS'}</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDomainDialogOpen(false)}>انصراف</Button>
            <Button onClick={handleSaveDomain}>ذخیره</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Dialog */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" />{isEditingAdmin ? 'ویرایش ادمین' : 'افزودن ادمین جدید'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>نام</Label><Input value={adminFormData.name} onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })} placeholder="نام ادمین" /></div>
            <div className="space-y-2"><Label>شماره تماس</Label><Input value={adminFormData.phone} onChange={(e) => setAdminFormData({ ...adminFormData, phone: e.target.value })} placeholder="09XXXXXXXXX" type="tel" dir="ltr" /></div>
            <div className="space-y-2">
              <Label>سطح دسترسی</Label>
              <Select value={adminFormData.role} onValueChange={(val: 'super_admin' | 'admin') => setAdminFormData({ ...adminFormData, role: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">ادمین</SelectItem>
                  <SelectItem value="super_admin">سوپر ادمین</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdminDialogOpen(false)}>انصراف</Button>
            <Button onClick={handleSaveAdmin}>ذخیره</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
