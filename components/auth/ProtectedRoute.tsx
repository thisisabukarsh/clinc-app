"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo);
      } else {
        setShouldRender(true);
      }
    }
  }, [user, isLoading, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">جاري التحقق من الهوية...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message
  if (!user && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            تسجيل الدخول مطلوب
          </h2>
          <p className="text-gray-600 mb-6">
            يجب تسجيل الدخول للوصول إلى هذه الصفحة
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/login")}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content
  return shouldRender ? <>{children}</> : null;
};

export default ProtectedRoute;
