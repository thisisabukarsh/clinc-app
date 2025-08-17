"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, ArrowLeft } from "lucide-react";
import Heart from "@/components/svgs/Heart";
import AuthService from "@/lib/api/services/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("يرجى إدخال البريد الإلكتروني");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("البريد الإلكتروني غير صحيح");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await AuthService.forgotPassword({ email });

      if (response.success && response.userId) {
        setSuccess("تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
        // Redirect to password reset OTP page after a short delay
        setTimeout(() => {
          router.push(`/reset-password-otp?userId=${response.userId}`);
        }, 2000);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "حدث خطأ في إرسال رمز إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="ltr">
      {/* Left Side - Blurred Background */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/blur-hospital.png')`,
          }}
        />
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Exit Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full max-w-md">
          {/* Heart Icon */}
          <div className="flex justify-center mb-8">
            <Heart width={80} height={80} fill="#3B82F6" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              نسيت كلمة المرور؟
            </h1>
            <p className="text-gray-600 text-sm">
              أدخل بريدك الإلكتروني وسنرسل لك رمز إعادة تعيين كلمة المرور
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "جاري الإرسال..." : "إرسال رمز إعادة التعيين"}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 ml-1" />
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
