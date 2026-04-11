import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "@/components/i18n/TranslationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Plus, RefreshCcw, Trash2, Key, User, Edit2, Search, MoreVertical, Store,
  Upload, GitBranch, X, MapPin, Phone, MessageCircle, Globe, CheckCircle2,
  AlertCircle, LogOut, Navigation, Image as ImageIcon, Shield, ShieldCheck,
  MessageSquare, Hash, FileText
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface Branch {
  id: string; name: string; address: string;
  phone: string; phone2?: string; phone3?: string; whatsapp: string;
  googleMapsUrl?: string; trackingApiUrl?: string;
}

interface TailoringUnit {
  id: string; name: string; managerName: string;
  managerPhone: string; logoUrl?: string; branches: Branch[]; domain?: string;
  isDomainActive?: boolean; subdomain: string;
  smsApi?: string; smsSender?: string; smsTemplate?: string;
  instagram?: string; telegram?: string; whatsapp?: string; eitaa?: string;
  bale?: string; rubika?: string; facebook?: string; twitter?: string;
  youtube?: string; linkedin?: string; tiktok?: string; website?: string;
}

interface AdminUser {
  id: string; name: string; phone: string; role: 'super_admin' | 'admin';
  createdAt: string;
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

  const [units, setUnits] = useState<TailoringUnit[]>([
    {
      id: '1', name: 'مزون مرکزی مگراز', managerName: 'علی مگرازی',
      managerPhone: '09121112233',
      logoUrl: 'https://picsum.photos/seed/m1/100/100',
      subdomain: 'megraz.tailorpanel.com',
      smsApi: '', smsSender: '', smsTemplate: '',
      instagram: '', telegram: '', whatsapp: '',
      branches: [{
        id: 'b1', name: 'شعبه فرشته',
        address: 'تهران، خیابان فرشته، پلاک ۱۲', phone: '۰۲۱۲۲۳۳۴۴۵۵',
        whatsapp: '۰۹۱۲۰۰۰۰۰۰۰', googleMapsUrl: 'https://maps.app.goo.gl/example',
        trackingApiUrl: ''
      }],
      domain: 'megraz.com', isDomainActive: true
    }
  ]);

  const [formData, setFormData] = useState<TailoringUnit>({
    id: '', name: '', managerName: '',
    managerPhone: '', logoUrl: '', branches: [], subdomain: '',
    smsApi: '', smsSender: '', smsTemplate: '',
    instagram: '', telegram: '', whatsapp: '', eitaa: '', bale: '', rubika: '',
    facebook: '', twitter: '', youtube: '', linkedin: '', tiktok: '', website: ''
  });

  const [domainData, setDomainData] = useState({ unitId: '', domain: '', status: 'pending' as 'active' | 'pending' });
  const [isCheckingDns, setIsCheckingDns] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: '1', name: 'مدیر اصلی سیستم', phone: '09120000000', role: 'super_admin', createdAt: '1404/01/01' }
  ]);
  const [adminFormData, setAdminFormData] = useState<AdminUser>({
    id: '', name: '', phone: '', role: 'admin', createdAt: ''
  });
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') { setIsAuthenticated(true); } else { navigate({ to: '/admin/login' }); }
  }, [navigate]);

  const handleLogout = () => { localStorage.removeItem('admin_authenticated'); navigate({ to: '/admin/login' }); };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setFormData(prev => ({ ...prev, logoUrl: reader.result as string })); };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBranch = () => {
    const newBranch: Branch = {
      id: Date.now().toString(), name: '', address: '', phone: '', whatsapp: '', googleMapsUrl: '', trackingApiUrl: ''
    };
    setFormData(prev => ({ ...prev, branches: [...prev.branches, newBranch] }));
  };

  const handleRemoveBranch = (id: string) => {
    setFormData(prev => ({ ...prev, branches: prev.branches.filter(b => b.id !== id) }));
  };

  const handleBranchChange = (id: string, field: keyof Branch, value: string) => {
    setFormData(prev => ({
      ...prev, branches: prev.branches.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.managerPhone || !formData.managerName) return;
    const subdomain = formData.subdomain || `${generateSlug(formData.name)}.tailorpanel.com`;
    const toSave = { ...formData, subdomain };
    if (isEditing) { setUnits(units.map(u => u.id === toSave.id ? toSave : u)); }
    else { setUnits([{ ...toSave, id: Date.now().toString() }, ...units]); }
    resetForm(); setIsFormOpen(false);
  };

  const handleSaveDomain = () => {
    setUnits(units.map(u => u.id === domainData.unitId ? { ...u, domain: domainData.domain, isDomainActive: domainData.status === 'active' } : u));
    setIsDomainDialogOpen(false);
  };

  const handleCheckDns = () => {
    setIsCheckingDns(true);
    setTimeout(() => {
      setIsCheckingDns(false);
      const randomSuccess = Math.random() > 0.5;
      setDomainData(prev => ({ ...prev, status: randomSuccess ? 'active' : 'pending' }));
    }, 2000);
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', managerName: '', managerPhone: '', logoUrl: '', branches: [], subdomain: '', smsApi: '', smsSender: '', smsTemplate: '', instagram: '', telegram: '', whatsapp: '', eitaa: '', bale: '', rubika: '', facebook: '', twitter: '', youtube: '', linkedin: '', tiktok: '', website: '' });
    setIsEditing(false);
  };

  const startEdit = (unit: TailoringUnit) => { setFormData(JSON.parse(JSON.stringify(unit))); setIsEditing(true); setIsFormOpen(true); };
  const startSetDomain = (unit: TailoringUnit) => { setDomainData({ unitId: unit.id, domain: unit.domain || '', status: unit.isDomainActive ? 'active' : 'pending' }); setIsDomainDialogOpen(true); };
  const deleteUnit = (id: string) => { setUnits(units.filter(u => u.id !== id)); };

  const handleSaveAdmin = () => {
    if (!adminFormData.name || !adminFormData.phone) return;
    if (isEditingAdmin) {
      setAdmins(admins.map(a => a.id === adminFormData.id ? adminFormData : a));
    } else {
      setAdmins([{ ...adminFormData, id: Date.now().toString(), createdAt: new Date().toLocaleDateString('fa-IR') }, ...admins]);
    }
    setAdminFormData({ id: '', name: '', phone: '', role: 'admin', createdAt: '' });
    setIsEditingAdmin(false);
    setIsAdminDialogOpen(false);
  };

  const startEditAdmin = (admin: AdminUser) => {
    setAdminFormData({ ...admin }); setIsEditingAdmin(true); setIsAdminDialogOpen(true);
  };
  const deleteAdmin = (id: string) => { setAdmins(admins.filter(a => a.id !== id)); };

  if (!isMounted || !isAuthenticated) return null;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline">{t('admin_dashboard')}</h1>
          <p className="text-sm text-muted-foreground mt-1">پنل مدیریت سراسری (سوپر ادمین)</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="ml-2 w-4 h-4" />خروج
        </Button>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="shops" className="gap-2"><Store className="w-4 h-4" />مدیریت فروشگاه‌ها</TabsTrigger>
          <TabsTrigger value="admins" className="gap-2"><Shield className="w-4 h-4" />مدیریت ادمین‌ها</TabsTrigger>
        </TabsList>

        {/* ═══════════════════ TAB: SHOPS ═══════════════════ */}
        <TabsContent value="shops" className="space-y-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              {t('tailoring_units')}
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{units.length}</span>
            </h2>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="جستجو در مجموعه‌ها..." className="pr-10" />
              </div>
              <Button onClick={() => { resetForm(); setIsFormOpen(true); }}>
                <Plus className="ml-2 w-4 h-4" />{t('add_new_unit')}
              </Button>
            </div>
          </div>

          <Card className="shadow-sm border-none overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="min-w-[200px]">{t('unit_name')}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t('manager_name')}</TableHead>
                    <TableHead className="hidden md:table-cell">شعب و دامنه</TableHead>
                    <TableHead className="text-center">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        هیچ مجموعه‌ای یافت نشد.
                      </TableCell>
                    </TableRow>
                  ) : (
                    units.map((unit) => (
                      <TableRow key={unit.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 rounded-xl border-2 border-primary/10">
                              <AvatarImage src={unit.logoUrl} alt={unit.name} />
                              <AvatarFallback className="bg-primary/5"><Store className="w-5 h-5 text-primary" /></AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm md:text-base">{unit.name}</span>
                              <span className="text-[10px] text-muted-foreground font-mono" dir="ltr">{unit.subdomain}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2 text-sm"><User className="w-3 h-3 text-muted-foreground" />{unit.managerName}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col gap-1.5">
                            <Badge variant="secondary" className="gap-1.5 px-3 w-fit"><GitBranch className="w-3.5 h-3.5" />{unit.branches.length} شعبه</Badge>
                            {unit.domain && (
                              <Badge variant={unit.isDomainActive ? "default" : "outline"} className={`gap-1.5 px-3 w-fit ${unit.isDomainActive ? 'bg-green-100 text-green-800' : 'text-orange-600 border-orange-200'}`}>
                                <Globe className="w-3.5 h-3.5" />{unit.domain}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => startEdit(unit)}><Edit2 className="w-4 h-4 ml-2" />{t('edit')}</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => startSetDomain(unit)}><Globe className="w-4 h-4 ml-2 text-blue-500" />{t('set_domain')}</DropdownMenuItem>
                              <Separator className="my-1" />
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteUnit(unit.id)}><Trash2 className="w-4 h-4 ml-2" />{t('delete')}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ═══════════════════ TAB: ADMINS ═══════════════════ */}
        <TabsContent value="admins" className="space-y-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              مدیریت ادمین‌ها
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{admins.length}</span>
            </h2>
            <Button onClick={() => { setAdminFormData({ id: '', name: '', phone: '', role: 'admin', createdAt: '' }); setIsEditingAdmin(false); setIsAdminDialogOpen(true); }}>
              <Plus className="ml-2 w-4 h-4" />افزودن ادمین جدید
            </Button>
          </div>

          <Card className="shadow-sm border-none overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>نام</TableHead>
                    <TableHead>شماره تماس</TableHead>
                    <TableHead>سطح دسترسی</TableHead>
                    <TableHead className="hidden sm:table-cell">تاریخ ایجاد</TableHead>
                    <TableHead className="text-center">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">هیچ ادمینی یافت نشد.</TableCell>
                    </TableRow>
                  ) : (
                    admins.map((admin) => (
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
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{admin.createdAt}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══════════ Add/Edit Shop Dialog ═══════════ */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 pb-2 shrink-0">
            <DialogTitle className="text-xl flex items-center gap-2">
              {isEditing ? <Edit2 className="w-5 h-5 text-secondary" /> : <Plus className="w-5 h-5 text-primary" />}
              {isEditing ? 'ویرایش فروشگاه' : 'افزودن فروشگاه جدید'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>لوگوی فروشگاه</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 rounded-2xl border-2 border-dashed border-muted-foreground/20">
                        <AvatarImage src={formData.logoUrl} className="object-cover" />
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
                  <div className="space-y-2"><Label>نام مدیر</Label><Input value={formData.managerName} onChange={(e) => setFormData({ ...formData, managerName: e.target.value })} placeholder="نام مدیر" /></div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2"><Label>شماره مدیر</Label><Input value={formData.managerPhone} onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })} placeholder="0912XXXXXXX" type="tel" /></div>
                </div>
              </div>

              <Separator />

              {/* Social Media - Iranian */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary" />شبکه‌های اجتماعی ایرانی</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>ایتا</Label><Input value={formData.eitaa || ''} onChange={(e) => setFormData({ ...formData, eitaa: e.target.value })} placeholder="https://eitaa.com/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>بله</Label><Input value={formData.bale || ''} onChange={(e) => setFormData({ ...formData, bale: e.target.value })} placeholder="https://ble.ir/..." dir="ltr" /></div>
                  <div className="space-y-2"><Label>روبیکا</Label><Input value={formData.rubika || ''} onChange={(e) => setFormData({ ...formData, rubika: e.target.value })} placeholder="https://rubika.ir/..." dir="ltr" /></div>
                </div>
              </div>

              <Separator />

              {/* Social Media - International */}
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

              {/* SMS API Settings */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-500" />تنظیمات پیامک (SMS)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-muted-foreground" />API SMS</Label>
                    <Input value={formData.smsApi || ''} onChange={(e) => setFormData({ ...formData, smsApi: e.target.value })} placeholder="کلید API سرویس پیامکی" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5 text-muted-foreground" />شماره خط ارسال‌کننده</Label>
                    <Input value={formData.smsSender || ''} onChange={(e) => setFormData({ ...formData, smsSender: e.target.value })} placeholder="مثلاً 30007732" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-muted-foreground" />الگو (Template)</Label>
                    <Input value={formData.smsTemplate || ''} onChange={(e) => setFormData({ ...formData, smsTemplate: e.target.value })} placeholder="کد الگوی پیامکی" dir="ltr" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Branches */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2"><GitBranch className="w-5 h-5 text-secondary" />مدیریت شعبه‌ها</h3>
                  <Button variant="outline" size="sm" onClick={handleAddBranch}><Plus className="w-4 h-4 ml-1" />افزودن شعبه</Button>
                </div>
                {formData.branches.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6 border rounded-lg border-dashed">هنوز شعبه‌ای اضافه نشده است.</p>
                )}
                {formData.branches.map((branch) => (
                  <Card key={branch.id} className="p-4 space-y-3 relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 left-2" onClick={() => handleRemoveBranch(branch.id)}><X className="w-4 h-4 text-destructive" /></Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1"><Label className="text-xs">نام شعبه</Label><Input value={branch.name} onChange={(e) => handleBranchChange(branch.id, 'name', e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-xs">تلفن</Label><Input value={branch.phone} onChange={(e) => handleBranchChange(branch.id, 'phone', e.target.value)} /></div>
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
          </ScrollArea>
          <DialogFooter className="p-6 pt-2 shrink-0 border-t">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>انصراف</Button>
            <Button onClick={handleSave}>ذخیره</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ Domain Dialog ═══════════ */}
      <Dialog open={isDomainDialogOpen} onOpenChange={setIsDomainDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-blue-500" />{t('set_domain')}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>دامنه اختصاصی</Label>
              <Input value={domainData.domain} onChange={(e) => setDomainData({ ...domainData, domain: e.target.value })} placeholder="example.com" dir="ltr" />
            </div>
            <div className="flex items-center gap-2">
              {domainData.status === 'active' ? (
                <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 ml-1" />فعال</Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600 border-orange-200"><AlertCircle className="w-3 h-3 ml-1" />در انتظار</Badge>
              )}
            </div>
            <Button variant="outline" className="w-full" onClick={handleCheckDns} disabled={isCheckingDns}>
              {isCheckingDns ? 'در حال بررسی...' : 'بررسی DNS'}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDomainDialogOpen(false)}>انصراف</Button>
            <Button onClick={handleSaveDomain}>ذخیره</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ Add/Edit Admin Dialog ═══════════ */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              {isEditingAdmin ? 'ویرایش ادمین' : 'افزودن ادمین جدید'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>نام</Label>
              <Input value={adminFormData.name} onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })} placeholder="نام ادمین" />
            </div>
            <div className="space-y-2">
              <Label>شماره تماس</Label>
              <Input value={adminFormData.phone} onChange={(e) => setAdminFormData({ ...adminFormData, phone: e.target.value })} placeholder="09XXXXXXXXX" type="tel" dir="ltr" />
            </div>
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
