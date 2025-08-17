"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { X, ArrowLeft } from "lucide-react";
import Heart from "@/components/svgs/Heart";
import AuthService from "@/lib/api/services/auth";

function ResetPasswordOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Redirect if no userId
  useEffect(() => {
    if (!userId) {
      router.push("/forgot-password");
    }
  }, [userId, router]);

  const handleOtpChange = (value: string) => {
    try {
      // Only allow numbers and limit to 6 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setOtp(numericValue);

      // Clear error when user starts typing
      if (error) {
        setError("");
      }
    } catch (error) {
      console.error("❌ Error in handleOtpChange:", { value, error });
    }
  };

  const validateOtp = () => {
    try {
      if (!otp) {
        setError("يرجى إدخال رمز التحقق");
        return false;
      }

      if (otp.length !== 6) {
        setError("رمز التحقق يجب أن يكون 6 أرقام");
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Error in validateOtp:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOtp() || !userId) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await AuthService.verifyPasswordResetOTP({
        userId,
        otp,
      });

      if (response.success && response.canResetPassword) {
        // Redirect to reset password page
        router.push(`/reset-password?userId=${userId}&otp=${otp}`);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "حدث خطأ في التحقق من الرمز. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userId) return;

    setIsResending(true);
    setResendMessage("");
    setError("");

    try {
      // For now, just show a message since we need email for resend
      setResendMessage("يرجى العودة إلى صفحة نسيت كلمة المرور لإعادة الإرسال");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "حدث خطأ في إعادة إرسال الرمز. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsResending(false);
    }
  };

  // Don't render if no userId
  if (!userId) {
    return null;
  }

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

      {/* Right Side - OTP Form */}
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
              تأكيد رمز إعادة تعيين كلمة المرور
            </h1>
            <p className="text-gray-600 text-sm">
              أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز التحقق
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-bold tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Success Message */}
            {resendMessage && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
                {resendMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "جاري التحقق..." : "تأكيد الرمز"}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
              </button>
            </div>

            {/* Back to Forgot Password */}
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm"
              >
                <ArrowLeft className="w-4 h-4 ml-1" />
                العودة إلى نسيت كلمة المرور
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Heart width={80} height={80} fill="#3B82F6" />
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordOTPContent />
    </Suspense>
  );
}
