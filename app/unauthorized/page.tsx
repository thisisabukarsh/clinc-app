"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-6xl mb-4">🚫</div>
        <ShieldX className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          غير مصرح لك بالوصول
        </h1>
        <p className="text-gray-600 mb-6">
          عذراً، ليس لديك الصلاحيات المطلوبة للوصول إلى هذه الصفحة
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للوحة التحكم
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            الصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}
