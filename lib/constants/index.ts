import { NavItem } from "@/types";

// Navigation items
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    label: "الرئيسية",
    href: "/",
  },
  {
    label: "مواعيدي",
    href: "/appointments",
  },
  {
    label: "ابحث عن طبيب",
    href: "/doctors",
  },
  {
    label: "الملف الشخصي",
    href: "/profile",
  },
];

// Medical specialties
export const MEDICAL_SPECIALTIES = [
  { id: "dentistry", name: "اسنان", icon: "🦷" },
  { id: "gynecology", name: "اخصائي نسائية", icon: "👩‍⚕️" },
  { id: "dermatology", name: "جلدية", icon: "🔬" },
  { id: "cardiology", name: "قلب", icon: "❤️" },
  { id: "orthopedics", name: "عظام", icon: "🦴" },
  { id: "pediatrics", name: "اطفال", icon: "👶" },
  { id: "neurology", name: "اعصاب", icon: "🧠" },
  { id: "ophthalmology", name: "عيون", icon: "👁️" },
];

// Cities/Locations
export const CITIES = [
  "عمان",
  "الزرقاء",
  "اربد",
  "السلط",
  "الكرك",
  "العقبة",
  "الطفيلة",
  "معان",
  "البلقاء",
  "الطفيلة",
];

// Social media links
export const SOCIAL_LINKS = [
  { name: "Facebook", icon: "facebook", url: "#" },
  { name: "Instagram", icon: "instagram", url: "#" },
  { name: "WhatsApp", icon: "whatsapp", url: "#" },
  { name: "Twitter", icon: "twitter", url: "#" },
];

// Footer links
export const FOOTER_LINKS = {
  important: [
    { label: "سجل عيادتك", href: "/register-clinic" },
    { label: "ابحث عن عيادة", href: "/clinics" },
    { label: "ابحث عن طبيب", href: "/doctors" },
    { label: "مواعيدي", href: "/appointments" },
  ],
  additional: [
    { label: "التخصصات الطبية", href: "/specialties" },
    { label: "الاطباء الاعلى تقييما", href: "/top-doctors" },
    { label: "إحصائيات الموقع", href: "/statistics" },
  ],
  about: [
    { label: "قصتنا", href: "/about" },
    { label: "كيفية عملنا", href: "/how-it-works" },
    { label: "رؤيتنا وهدفنا", href: "/vision" },
  ],
};

// App configuration
export const APP_CONFIG = {
  name: "عياداتي",
  description: "منصة حجز المواعيد الطبية",
  version: "1.0.0",
  currency: "دينار اردني",
  defaultLanguage: "ar",
  defaultDirection: "rtl",
};

// Rating stars configuration
export const RATING_CONFIG = {
  maxStars: 5,
  starColor: "#fbbf24", // yellow-400
  emptyStarColor: "#e5e7eb", // gray-200
};
