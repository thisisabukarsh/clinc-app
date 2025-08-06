import React from "react";
import Link from "next/link";
import { FOOTER_LINKS, SOCIAL_LINKS, APP_CONFIG } from "@/lib/constants";
import Button from "@/components/ui/Button";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Social Media */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">ع</span>
              </div>
              <span className="text-xl font-bold">{APP_CONFIG.name}</span>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4 space-x-reverse mb-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                >
                  <span className="text-sm">
                    {social.icon === "facebook"
                      ? "📘"
                      : social.icon === "instagram"
                      ? "📷"
                      : social.icon === "whatsapp"
                      ? "📱"
                      : "🐦"}
                  </span>
                </a>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="primary" size="sm">
                إنشاء حساب
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-gray-800"
              >
                تسجيل دخول
              </Button>
            </div>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط مهمة</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.important.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط إضافية</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.additional.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">من نحن</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            Copy Right © 2025 Mawa3idi | Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
