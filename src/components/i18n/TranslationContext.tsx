import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fa' | 'en';

interface Translations {
  [key: string]: {
    fa: string;
    en: string;
  };
}

const translations: Translations = {
  "app_name": { fa: "رهگیری سفارش خیاطی اتحاد", en: "Ettehad Order Tracking" },
  "full_app_name": { fa: "نرم افزار رهگیری سفارش خیاطی لباس بلوچی اتحاد", en: "Ettehad Baloch Tailoring Order Tracking" },
  "admin_dashboard": { fa: "داشبورد مدیریت کل", en: "Admin Dashboard" },
  "tailor_settings": { fa: "تنظیمات فروشگاه", en: "Shop Settings" },
  "customer_panel": { fa: "پنل مشتریان", en: "Customer Panel" },
  "save": { fa: "ذخیره", en: "Save" },
  "edit": { fa: "ویرایش", en: "Edit" },
  "delete": { fa: "حذف", en: "Delete" },
  "cancel": { fa: "لغو", en: "Cancel" },
  "back": { fa: "بازگشت", en: "Back" },
  "admin_login": { fa: "ورود به مدیریت کل", en: "Admin Login" },
  "admin_login_welcome": { fa: "ورود مدیر سیستم", en: "System Admin Login" },
  "tailoring_units": { fa: "مجموعه‌های خیاطی", en: "Tailoring Units" },
  "add_new_unit": { fa: "افزودن مجموعه خیاطی جدید", en: "Add New Tailoring Unit" },
  "unit_name": { fa: "نام مجموعه (فروشگاه)", en: "Shop Name" },
  "unit_logo": { fa: "لوگو مجموعه", en: "Unit Logo" },
  "manager_name": { fa: "نام و نام خانوادگی مدیر", en: "Manager Full Name" },
  "unit_id": { fa: "شناسه یکتا", en: "Unique ID" },
  "api_id": { fa: "شناسه API", en: "API ID" },
  "manager_phone": { fa: "شماره موبایل مدیر", en: "Manager Phone" },
  "actions": { fa: "عملیات", en: "Actions" },
  "branches": { fa: "شعب مجموعه", en: "Unit Branches" },
  "add_branch": { fa: "افزودن شعبه جدید", en: "Add New Branch" },
  "branch_name": { fa: "نام شعبه", en: "Branch Name" },
  "branch_address": { fa: "آدرس شعبه", en: "Branch Address" },
  "branch_phone": { fa: "تلفن شعبه", en: "Branch Phone" },
  "branch_whatsapp": { fa: "واتساپ شعبه", en: "Branch WhatsApp" },
  "set_domain": { fa: "تنظیم دامنه", en: "Set Domain" },
  "domain_name": { fa: "نام دامنه", en: "Domain Name" },
  "check_dns": { fa: "بررسی DNS", en: "Check DNS" },
  "dns_instructions": { fa: "راهنمای تنظیمات DNS", en: "DNS Setup Instructions" },
  "dns_active": { fa: "فعال", en: "Active" },
  "dns_pending": { fa: "در انتظار بررسی", en: "Pending" },
  "domain_placeholder": { fa: "example.com", en: "example.com" },
  "tailor_login": { fa: "ورود مدیر مجموعه", en: "Manager Login" },
  "shop_title": { fa: "عنوان فروشگاه", en: "Shop Title" },
  "about_unit": { fa: "درباره مجموعه", en: "About Unit" },
  "instagram": { fa: "اینستاگرام", en: "Instagram" },
  "telegram": { fa: "تلگرام", en: "Telegram" },
  "whatsapp": { fa: "واتس‌اپ", en: "WhatsApp" },
  "eitaa": { fa: "ایتا", en: "Eitaa" },
  "bale": { fa: "بله", en: "Bale" },
  "rubika": { fa: "روبیکا", en: "Rubika" },
  "phone_number": { fa: "شماره تماس", en: "Phone Number" },
  "address": { fa: "آدرس", en: "Address" },
  "social_links": { fa: "لینک‌های شبکه‌های اجتماعی", en: "Social Links" },
  "internal_social_links": { fa: "شبکه‌های اجتماعی داخلی", en: "Internal Social Media" },
  "login_welcome": { fa: "خوش آمدید", en: "Welcome" },
  "enter_phone": { fa: "شماره موبایل خود را وارد کنید", en: "Enter your mobile number" },
  "send_otp": { fa: "ارسال رمز یکبار مصرف", en: "Send OTP" },
  "otp_code": { fa: "کد تایید", en: "Verification Code" },
  "verify_login": { fa: "تایید و ورود", en: "Verify & Login" },
  "track_order": { fa: "رهگیری سفارش", en: "Track Order" },
  "active_orders": { fa: "سفارشات جاری", en: "Active Orders" },
  "order_history": { fa: "تاریخچه سفارشات", en: "Order History" },
  "order_status": { fa: "وضعیت سفارش", en: "Order Status" },
  "status_registered": { fa: "ثبت سفارش", en: "Order Registered" },
  "status_cutting": { fa: "در حال برش", en: "Cutting" },
  "status_sewing": { fa: "در حال دوخت", en: "Sewing" },
  "status_ready": { fa: "آماده تحویل", en: "Ready for Delivery" },
  "order_details": { fa: "جزئیات سفارش", en: "Order Details" },
  "contact_us": { fa: "تماس با ما", en: "Contact Us" },
  "order_date": { fa: "تاریخ ثبت", en: "Order Date" },
  "delivery_date": { fa: "تاریخ تحویل", en: "Delivery Date" }
};

interface TranslationContextType {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const dir = language === 'fa' ? 'rtl' : 'ltr';

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage, dir }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("useTranslation must be used within a TranslationProvider");
  return context;
};
