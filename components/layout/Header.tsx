"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { NAVIGATION_ITEMS, APP_CONFIG } from "@/lib/constants";
import { useAuth } from "@/lib/contexts/AuthContext";
import Button from "@/components/ui/Button";
import LoginModal from "@/components/features/LoginModal";
import RegisterModal from "@/components/features/RegisterModal";

const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <header className="bg-white shadow-soft border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 space-x-reverse"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">ع</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {APP_CONFIG.name}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-600 hover:text-primary-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {user ? (
              <>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-1 space-x-reverse"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل خروج</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  تسجيل دخول
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsRegisterModalOpen(true)}
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
