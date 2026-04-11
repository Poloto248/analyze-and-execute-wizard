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
  Plus, RefreshCcw, Trash2, Key, User, Edit2, Search, MoreVertical, Store,
  Upload, GitBranch, X, MapPin, Phone, MessageCircle, Globe, CheckCircle2,
  AlertCircle, LogOut, Navigation, Image as ImageIcon
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

interface Branch {
  id: string; name: string; apiId: string; address: string;
  phone: string; phone2?: string; phone3?: string; whatsapp: string; googleMapsUrl?: string;
}

interface TailoringUnit {
  id: string; name: string; managerName: string; uniqueId: string; apiId: string;
  managerPhone: string; logoUrl?: string; branches: Branch[]; domain?: string; isDomainActive?: boolean;
}

function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDomainDialogOpen, setIsDomainDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [units, setUnits] = useState<TailoringUnit[]>([
    {
      id: '1', name: 'مزون مرکزی مگراز', managerName: 'علی مگرازی',
      uniqueId: 'MGZ-MAIN-01', apiId: 'api_77889911', managerPhone: '09121112233',
      logoUrl: 'https://picsum.photos/seed/m1/100/100',
      branches: [{
        id: 'b1', name: 'شعبه فرشته', apiId: 'api_br_11',
        address: 'تهران، خیابان فرشته، پلاک ۱۲', phone: '۰۲۱۲۲۳۳۴۴۵۵',
        whatsapp: '۰۹۱۲۰۰۰۰۰۰۰', googleMapsUrl: 'https://maps.app.goo.gl/example'
      }],
      domain: 'megraz.com', isDomainActive: true
    }
  ]);

  const [formData, setFormData] = useState<TailoringUnit>({
    id: '', name: '', managerName: '', uniqueId: '', apiId: '',
    managerPhone: '', logoUrl: '', branches: []
  });

  const [domainData, setDomainData] = useState({ unitId: '', domain: '', status: 'pending' as 'active' | 'pending' });
  const [isCheckingDns, setIsCheckingDns] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') { setIsAuthenticated(true); } else { navigate({ to: '/admin/login' }); }
  }, [navigate]);

  const handleLogout = () => { localStorage.removeItem('admin_authenticated'); navigate({ to: '/admin/login' }); };

  const generateId = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, uniqueId: `UNIT-${new Date().getFullYear()}-${random}` }));
  };

  const generateApiId = () => `api_${Math.random().toString(36).substring(2, 10)}`;

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
      id: Date.now().toString(), name: '', apiId: generateApiId(),
      address: '', phone: '', whatsapp: '', googleMapsUrl: ''
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
    if (!formData.name || !formData.uniqueId || !formData.managerPhone || !formData.managerName) return;
    if (isEditing) { setUnits(units.map(u => u.id === formData.id ? formData : u)); }
    else { setUnits([{ ...formData, id: Date.now().toString() }, ...units]); }
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
    setFormData({ id: '', name: '', managerName: '', uniqueId: '', apiId: '', managerPhone: '', logoUrl: '', branches: [] });
    setIsEditing(false);
  };

  const startEdit = (unit: TailoringUnit) => { setFormData(JSON.parse(JSON.stringify(unit))); setIsEditing(true); setIsFormOpen(true); };
  const startSetDomain = (unit: TailoringUnit) => { setDomainData({ unitId: unit.id, domain: unit.domain || '', status: unit.isDomainActive ? 'active' : 'pending' }); setIsDomainDialogOpen(true); };
  const deleteUnit = (id: string) => { setUnits(units.filter(u => u.id !== id)); };

  if (!isAuthenticated) return null;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline">{t('admin_dashboard')}</h1>
          <p className="text-sm text-muted-foreground mt-1">مدیریت سراسری مجموعه‌های خیاطی، مزون‌ها و شعب</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={handleLogout} className="flex-1 md:flex-none">
            <LogOut className="ml-2 w-4 h-4" />خروج
          </Button>
          <Button onClick={() => { resetForm(); setIsFormOpen(true); }} className="flex-1 md:flex-none">
            <Plus className="ml-2 w-4 h-4" />{t('add_new_unit')}
          </Button>
        </div>
      </header>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            {t('tailoring_units')}
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{units.length}</span>
          </h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="جستجو در مجموعه‌ها..." className="pr-10" />
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
                  <TableHead className="hidden xl:table-cell">{t('unit_id')}</TableHead>
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
                            <span className="text-xs text-muted-foreground sm:hidden">{unit.managerName}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-sm"><User className="w-3 h-3 text-muted-foreground" />{unit.managerName}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1.5">
                          <Badge variant="secondary" className="gap-1.5 px-3 w-fit"><GitBranch className="w-3.5 h-3.5" />{unit.branches.length} {t('branches')}</Badge>
                          {unit.domain && (
                            <Badge variant={unit.isDomainActive ? "default" : "outline"} className={`gap-1.5 px-3 w-fit ${unit.isDomainActive ? 'bg-green-100 text-green-800' : 'text-orange-600 border-orange-200'}`}>
                              <Globe className="w-3.5 h-3.5" />{unit.domain}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">{unit.uniqueId}</span>
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
      </div>

      {/* Add/Edit Unit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 pb-2 shrink-0">
            <DialogTitle className="text-xl flex items-center gap-2">
              {isEditing ? <Edit2 className="w-5 h-5 text-secondary" /> : <Plus className="w-5 h-5 text-primary" />}
              {isEditing ? t('edit') : t('add_new_unit')}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>{t('unit_logo')}</Label>
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
                  <div className="space-y-2"><Label>{t('unit_name')}</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="نام مجموعه" /></div>
                  <div className="space-y-2"><Label>{t('manager_name')}</Label><Input value={formData.managerName} onChange={(e) => setFormData({ ...formData, managerName: e.target.value })} placeholder="نام مدیر" /></div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2"><Label>{t('manager_phone')}</Label><Input value={formData.managerPhone} onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })} placeholder="0912XXXXXXX" type="tel" /></div>
                  <div className="space-y-2">
                    <Label>{t('unit_id')}</Label>
                    <div className="flex gap-2">
                      <Input value={formData.uniqueId} readOnly className="bg-muted/30" />
                      <Button variant="secondary" size="icon" onClick={generateId} type="button"><RefreshCcw className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('api_id')}</Label>
                    <div className="flex gap-2">
                      <Input value={formData.apiId} onChange={(e) => setFormData({ ...formData, apiId: e.target.value })} placeholder="api_..." />
                      <Button variant="secondary" size="icon" onClick={() => setFormData({ ...formData, apiId: generateApiId() })} type="button"><Key className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2"><GitBranch className="w-5 h-5 text-secondary" />{t('branches')}</h3>
                  <Button variant="outline" size="sm" onClick={handleAddBranch}><Plus className="w-4 h-4 ml-1" />{t('add_branch')}</Button>
                </div>
                {formData.branches.map((branch) => (
                  <Card key={branch.id} className="p-4 space-y-3 relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 left-2" onClick={() => handleRemoveBranch(branch.id)}><X className="w-4 h-4 text-destructive" /></Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1"><Label className="text-xs">{t('branch_name')}</Label><Input value={branch.name} onChange={(e) => handleBranchChange(branch.id, 'name', e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-xs">{t('branch_phone')}</Label><Input value={branch.phone} onChange={(e) => handleBranchChange(branch.id, 'phone', e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-xs">{t('branch_whatsapp')}</Label><Input value={branch.whatsapp} onChange={(e) => handleBranchChange(branch.id, 'whatsapp', e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-xs">{t('branch_address')}</Label><Input value={branch.address} onChange={(e) => handleBranchChange(branch.id, 'address', e.target.value)} /></div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 pt-2 shrink-0 border-t">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>{t('cancel')}</Button>
            <Button onClick={handleSave}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Domain Dialog */}
      <Dialog open={isDomainDialogOpen} onOpenChange={setIsDomainDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-blue-500" />{t('set_domain')}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('domain_name')}</Label>
              <Input value={domainData.domain} onChange={(e) => setDomainData({ ...domainData, domain: e.target.value })} placeholder="example.com" dir="ltr" />
            </div>
            <div className="flex items-center gap-2">
              {domainData.status === 'active' ? (
                <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 ml-1" />{t('dns_active')}</Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600 border-orange-200"><AlertCircle className="w-3 h-3 ml-1" />{t('dns_pending')}</Badge>
              )}
            </div>
            <Button variant="outline" className="w-full" onClick={handleCheckDns} disabled={isCheckingDns}>
              {isCheckingDns ? '...' : t('check_dns')}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDomainDialogOpen(false)}>{t('cancel')}</Button>
            <Button onClick={handleSaveDomain}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
