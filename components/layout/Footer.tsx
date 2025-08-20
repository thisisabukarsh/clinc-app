import React from "react";
import Link from "next/link";
import { CONTACT_INFO } from "@/lib/constants";
import Button from "@/components/ui/Button";
import Heart from "@/components/svgs/Heart";
import { Facebook, Instagram, MessageCircle, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer
      className="relative text-white overflow-hidden"
      dir="ltr"
      style={{
        backgroundImage: `url('/footer-medical-background.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Background overlay */}

      {/* Heart decoration */}
      <div className="absolute top-16 left-16 opacity-20">
        <Heart width={150} height={150} fill="rgba(255,255,255,0.1)" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-start">
          {/* Leftmost - Auth Buttons */}
          <div className="flex flex-col gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 ">
              إنشاء حساب
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:text-black bg-white/10 backdrop-blur-sm"
            >
              تسجيل دخول
            </Button>
          </div>

          {/* Left of Center - Social Media Icons */}
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(
                /[^0-9]/g,
                ""
              )}?text=مرحبا، أريد الاستفسار عن خدماتكم الطبية`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-110"
              title="تواصل معنا عبر واتساب"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* Center - Links Grid */}
          <div className="flex gap-16">
            {/* روابط مهمة */}
            <div className="text-right">
              <h3 className="text-lg font-semibold mb-6 text-white">
                روابط مهمة<span></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/register"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    سجل عياداتك
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    ابحث عن عيادة
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    ابحث عن طبيب
                  </Link>
                </li>
                <li>
                  <Link
                    href="/appointments"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    مواعيدي
                  </Link>
                </li>
              </ul>
            </div>

            {/* روابط إضافية */}
            <div className="text-right">
              <h3 className="text-lg font-semibold mb-6 text-white">
                روابط إضافية
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/services"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    الخدمات الطبية
                  </Link>
                </li>
                <li>
                  <Link
                    href="/specialties"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    الاطباء الأكثر تقييما
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locations"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    إجابيات الموقع
                  </Link>
                </li>
              </ul>
            </div>

            {/* من نحن */}
            <div className="text-right">
              <h3 className="text-lg font-semibold mb-6 text-white">من نحن</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    قصتنا
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    كيفية عملنا
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vision"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    رؤيتنا ومهمتنا
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Rightmost - Heart Logo */}
          <div className="flex items-center">
            <Heart width={200} height={200} fill="#D8DEFF" />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/70">
            Copy Right © 2025 Mawa3idi | Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
