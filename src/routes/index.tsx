import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "@/components/i18n/TranslationContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, UserCircle, Scissors } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-secondary font-headline leading-tight">
          {t('full_app_name')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {language === 'fa' ? 'سیستم مدیریت هوشمند و اختصاصی واحدهای خیاطی و مزون' : 'Smart and Exclusive Management System for Tailoring Studios'}
        </p>
        <div className="flex justify-center gap-2">
          <Button 
            variant={language === 'fa' ? "default" : "outline"} 
            onClick={() => setLanguage('fa')}
            className="rounded-full px-6"
          >
            فارسی
          </Button>
          <Button 
            variant={language === 'en' ? "default" : "outline"} 
            onClick={() => setLanguage('en')}
            className="rounded-full px-6"
          >
            English
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Link to="/admin/login">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full border-2 hover:border-primary group">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="mt-4">{t('admin_dashboard')}</CardTitle>
              <CardDescription>
                {language === 'fa' ? 'مدیریت کل واحدها، شعب و دامنه‌ها' : 'Global management of units, branches and domains'}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/tailor/login">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full border-2 hover:border-secondary group">
            <CardHeader className="text-center">
              <div className="mx-auto bg-secondary/10 p-4 rounded-full w-fit group-hover:bg-secondary/20 transition-colors">
                <Scissors className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="mt-4">{t('tailor_settings')}</CardTitle>
              <CardDescription>
                {language === 'fa' ? 'پنل اختصاصی مدیریت مجموعه خیاطی' : 'Dedicated tailoring unit management panel'}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/customer/login">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full border-2 hover:border-chart-3 group">
            <CardHeader className="text-center">
              <div className="mx-auto bg-chart-3/10 p-4 rounded-full w-fit group-hover:bg-chart-3/20 transition-colors">
                <UserCircle className="w-8 h-8 text-chart-3" />
              </div>
              <CardTitle className="mt-4">{t('customer_panel')}</CardTitle>
              <CardDescription>
                {language === 'fa' ? 'پنل رهگیری هوشمند سفارش توسط مشتری' : 'Smart customer order tracking panel'}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
