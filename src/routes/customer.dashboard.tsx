import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "@/components/i18n/TranslationContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Instagram, MapPin, Phone, Package, Scissors, Zap, CheckCircle2, LogOut,
  ChevronLeft, History, Clock, User, MessageCircle, FileText,
  Home, Share2, Send, Upload
} from "lucide-react";

export const Route = createFileRoute("/customer/dashboard")({
  component: CustomerDashboard,
});

const ORDER_STATUSES = [
  { id: 'registered', key: 'status_registered', icon: Package, color: 'bg-blue-500', label: 'ثبت نهایی' },
  { id: 'cutting', key: 'status_cutting', icon: Scissors, color: 'bg-orange-500', label: 'برش پارچه' },
  { id: 'sewing', key: 'status_sewing', icon: Zap, color: 'bg-yellow-500', label: 'در حال دوخت' },
  { id: 'ready', key: 'status_ready', icon: CheckCircle2, color: 'bg-primary', label: 'آماده تحویل' },
];

const MOCK_INVOICES = [
  {
    id: 'INV-1402-4589', date: '1402/11/05', unit: 'شعبه مرکزی اتحاد', totalItems: 4, overallStatus: 'sewing',
    finance: { total: '8,500,000', paid: '4,000,000', remaining: '4,500,000' },
    items: [
      { id: 'ORD-101', title: 'کت و شلوار مجلسی - سورمه‌ای', quantity: '۱', status: 'sewing' },
      { id: 'ORD-102', title: 'پیراهن یقه دیپلمات سفید', quantity: '۲', status: 'cutting' },
      { id: 'ORD-103', title: 'شلوار کلاسیک طوسی', quantity: '۱', status: 'registered' }
    ]
  },
  {
    id: 'INV-1402-4612', date: '1402/11/12', unit: 'شعبه مرکزی اتحاد', totalItems: 3, overallStatus: 'cutting',
    finance: { total: '3,200,000', paid: '3,200,000', remaining: '0' },
    items: [
      { id: 'ORD-201', title: 'پیراهن سنتی بلوچی (پردیس)', quantity: '۳', status: 'cutting' }
    ]
  }
];

const MOCK_PAST_INVOICES = [
  {
    id: 'INV-1402-3920', date: '1402/08/20', unit: 'شعبه مرکزی اتحاد', totalItems: 2, overallStatus: 'ready',
    finance: { total: '2,800,000', paid: '2,800,000', remaining: '0' },
    items: [
      { id: 'ORD-301', title: 'شلوار پارچه‌ای کلاسیک', quantity: '۲', status: 'ready' }
    ]
  }
];

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

function CustomerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'support' | 'profile'>('active');

  const [storeSettings, setStoreSettings] = useState({
    title: 'خیاطی لباس بلوچی اتحاد',
    phone: '05433221100',
    instagram: 'ettehad_baloch',
    telegram: 'ettehad_baloch',
    whatsapp: '09150000000',
    address: 'زاهدان، خیابان اصلی، روبروی مرکز تجاری، پلاک ۴۵'
  });

  const [userProfile] = useState({
    name: 'علی مگرازی',
    phone: '۰۹۱۲۰۰۰۰۰۰۰',
    avatarUrl: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('tailor_store_settings');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setStoreSettings(prev => ({
          ...prev,
          title: data.title || prev.title,
          phone: data.phone || prev.phone,
          instagram: data.instagram || prev.instagram,
          telegram: data.telegram || prev.telegram,
          whatsapp: data.whatsapp || prev.whatsapp,
          address: data.address || prev.address,
        }));
      } catch (e) { console.error(e); }
    }
  }, []);

  const currentInvoice = [...MOCK_INVOICES, ...MOCK_PAST_INVOICES].find(inv => inv.id === selectedInvoiceId);

  const handleOpenDetails = (id: string) => { setSelectedInvoiceId(id); setIsDetailsOpen(true); };
  const handleLogout = () => { navigate({ to: '/customer/login' }); };

  return (
    <div className="min-h-screen bg-background pb-32 font-body">
      {/* Header */}
      <div className="bg-foreground text-background p-8 md:p-12 relative z-10 rounded-b-[3rem]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 text-right">
            <Avatar className="w-14 h-14 rounded-2xl border-2 border-background/10 shadow-lg cursor-pointer" onClick={() => setActiveTab('profile')}>
              <AvatarImage src={userProfile.avatarUrl} className="object-cover" />
              <AvatarFallback className="bg-foreground/80"><User className="w-8 h-8 text-background/40" /></AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black font-headline tracking-tight">
                {activeTab === 'active' && t('active_orders')}
                {activeTab === 'history' && t('order_history')}
                {activeTab === 'support' && t('contact_us')}
                {activeTab === 'profile' && 'پروفایل کاربری'}
              </h1>
              <p className="text-background/40 text-sm">خوش آمدید، {userProfile.name.split(' ')[0]} عزیز</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-background hover:bg-background/10 rounded-2xl w-12 h-12" onClick={handleLogout}>
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 mt-8">
        {activeTab === 'active' && (
          <div className="space-y-6">
            {MOCK_INVOICES.map((invoice) => (
              <Card key={invoice.id} className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-card cursor-pointer hover:shadow-2xl transition-all text-right"
                onClick={() => handleOpenDetails(invoice.id)}>
                <CardHeader className="pb-4 border-b">
                  <div className="flex justify-between items-center">
                    <Badge className={`${ORDER_STATUSES.find(s => s.id === invoice.overallStatus)?.color} text-primary-foreground px-4 py-1.5 rounded-xl`}>
                      {t(`status_${invoice.overallStatus}`)}
                    </Badge>
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-black flex items-center gap-2 justify-end">
                        فاکتور #{invoice.id.split('-').pop()}
                        <FileText className="w-5 h-5 text-primary" />
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs justify-end">
                        <span>{invoice.unit}</span><span className="opacity-20">•</span>
                        <span>تاریخ ثبت: {invoice.date}</span><Clock className="w-3.5 h-3.5" />
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold">{invoice.items.length} نوع لباس ({invoice.totalItems} دست)</span>
                      <span className="text-muted-foreground">تعداد اقلام فاکتور:</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold">{invoice.finance.total} تومان</span>
                      <span className="text-muted-foreground">مبلغ کل فاکتور:</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-1 gap-2">
                      {invoice.items.map((item, idx) => {
                        const status = ORDER_STATUSES.find(s => s.id === item.status);
                        return (
                          <div key={idx} className="flex items-center gap-3 bg-muted p-3 rounded-2xl border justify-between">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className={`w-2 h-2 rounded-full ${status?.color}`} />
                              <span className="text-[10px] font-bold">{status?.label}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-1 justify-end">
                              <span className="text-xs font-bold truncate text-right">{item.title}</span>
                              <span className="text-[10px] text-muted-foreground shrink-0">{item.quantity} دست</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Button className="w-full h-12 rounded-2xl bg-muted text-foreground hover:bg-muted/80 font-bold mt-4"
                      onClick={(e) => { e.stopPropagation(); handleOpenDetails(invoice.id); }}>
                      مشاهده جزئیات بیشتر<ChevronLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {MOCK_PAST_INVOICES.map((invoice) => (
              <Card key={invoice.id} className="rounded-[2.5rem] border-none shadow-xl bg-card/60 text-right overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="px-4 py-1.5 rounded-xl">تحویل شده</Badge>
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-black flex items-center gap-2 justify-end">
                        فاکتور #{invoice.id.split('-').pop()}<History className="w-5 h-5 text-muted-foreground" />
                      </CardTitle>
                      <CardDescription className="text-xs text-right">تاریخ تحویل نهایی: {invoice.date}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full h-12 rounded-2xl font-bold" onClick={() => handleOpenDetails(invoice.id)}>مشاهده سوابق</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-8 pb-12">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-card p-8 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black">چطور می‌توانیم کمک کنیم؟</h3>
                <p className="text-muted-foreground text-sm">پشتیبانی و اطلاعات {storeSettings.title}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild className="h-20 rounded-[1.5rem] bg-foreground text-background font-bold gap-3 text-lg">
                  <a href={`tel:${toEng(storeSettings.phone)}`}><Phone className="w-6 h-6" />تماس مستقیم با مدیریت</a>
                </Button>
                <Button asChild variant="outline" className="h-20 rounded-[1.5rem] font-bold gap-3 text-lg">
                  <a href={formatSocialLink(storeSettings.whatsapp, 'whatsapp')} target="_blank" rel="noopener noreferrer"><MessageCircle className="w-6 h-6 text-green-500" />پیام در واتس‌اپ</a>
                </Button>
              </div>
              <Separator />
              <div className="space-y-6">
                <h4 className="font-bold flex items-center justify-center gap-2 text-center"><Share2 className="w-5 h-5 text-primary" />شبکه‌های اجتماعی ما</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'instagram', label: 'اینستاگرام', icon: <Instagram className="w-5 h-5 text-pink-500" /> },
                    { id: 'telegram', label: 'تلگرام', icon: <Send className="w-5 h-5 text-sky-500" /> },
                  ].map((social, idx) => {
                    const value = storeSettings[social.id as keyof typeof storeSettings] as string;
                    if (!value) return null;
                    return (
                      <a key={idx} href={formatSocialLink(value, social.id)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-muted rounded-2xl border hover:bg-muted/80 transition-colors">
                        <span className="text-sm font-bold flex-1 text-right">{social.label}</span>{social.icon}
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold flex items-center justify-center gap-2"><MapPin className="w-5 h-5 text-primary" />نشانی مجموعه</h4>
                <div className="bg-muted p-6 rounded-[2rem] border text-right">
                  <p className="text-sm font-medium leading-relaxed">{storeSettings.address}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 pb-12">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-card p-8 space-y-6 text-right">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 rounded-3xl border-4 border-card shadow-xl">
                  <AvatarImage src={userProfile.avatarUrl} className="object-cover" />
                  <AvatarFallback className="bg-muted"><User className="w-12 h-12 text-muted-foreground" /></AvatarFallback>
                </Avatar>
                <div className="space-y-2 flex-1">
                  <h3 className="text-2xl font-black">{userProfile.name}</h3>
                  <p className="text-muted-foreground font-mono">{userProfile.phone}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-card/80 backdrop-blur-xl border-t z-30">
        <div className="max-w-4xl mx-auto flex justify-around py-3">
          {[
            { id: 'active' as const, icon: Home, label: 'سفارشات' },
            { id: 'history' as const, icon: History, label: 'سوابق' },
            { id: 'support' as const, icon: MessageCircle, label: 'تماس' },
            { id: 'profile' as const, icon: User, label: 'پروفایل' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all ${activeTab === tab.id ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}>
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 justify-end">
              <span>جزئیات فاکتور #{currentInvoice?.id.split('-').pop()}</span>
              <FileText className="w-5 h-5 text-primary" />
            </DialogTitle>
          </DialogHeader>
          {currentInvoice && (
            <div className="space-y-6 py-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-2xl text-center">
                  <p className="text-xs text-muted-foreground mb-1">مبلغ کل</p>
                  <p className="font-black text-lg">{currentInvoice.finance.total}</p>
                </div>
                <div className="bg-muted p-4 rounded-2xl text-center">
                  <p className="text-xs text-muted-foreground mb-1">مانده حساب</p>
                  <p className="font-black text-lg text-destructive">{currentInvoice.finance.remaining}</p>
                </div>
              </div>
              <Separator />
              <h4 className="font-bold">اقلام فاکتور:</h4>
              <div className="space-y-3">
                {currentInvoice.items.map((item, idx) => {
                  const status = ORDER_STATUSES.find(s => s.id === item.status);
                  const statusIdx = ORDER_STATUSES.findIndex(s => s.id === item.status);
                  return (
                    <div key={idx} className="bg-muted p-4 rounded-2xl border space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge className={`${status?.color} text-primary-foreground rounded-xl`}>{status?.label}</Badge>
                        <span className="font-bold text-sm">{item.title}</span>
                      </div>
                      {/* Timeline */}
                      <div className="flex items-center justify-between px-2">
                        {ORDER_STATUSES.map((s, sIdx) => (
                          <div key={s.id} className="flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${sIdx <= statusIdx ? s.color + ' text-primary-foreground' : 'bg-muted-foreground/20'}`}>
                              <s.icon className="w-3 h-3" />
                            </div>
                            <span className="text-[8px] font-bold text-muted-foreground">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
