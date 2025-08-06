"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { NAVIGATION_ITEMS, APP_CONFIG } from "@/lib/constants";
import { useAuth } from "@/lib/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import LoginModal from "@/components/features/LoginModal";
import RegisterModal from "@/components/features/RegisterModal";

const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Right Side (first in RTL) */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Logo width={40} height={40} />
              <span className="text-xl font-bold text-gray-900">
                {APP_CONFIG.name}
              </span>
            </Link>
          </div>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center gap-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary-600 ${
                  pathname === item.href ? "text-primary-600" : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Authentication Section - Left Side (last in RTL) */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-1"
                >
                  <span>تسجيل خروج</span>
                  <LogOut className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm font-medium"
                >
                  تسجيل دخول
                </button>
                <Button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  إنشاء حساب
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Authentication Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </header>
  );
};

export default Header;
