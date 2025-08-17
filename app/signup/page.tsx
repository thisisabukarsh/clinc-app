"use client";

import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthService from "@/lib/api/services/auth";
import Heart from "@/components/svgs/Heart";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    dateOfBirth: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    address?: string;
    dateOfBirth?: string;
    general?: string;
  }>({});
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    try {
      if (!formData.name) {
        newErrors.name = "الاسم مطلوب";
      } else if (formData.name.length < 2) {
        newErrors.name = "الاسم يجب أن يكون حرفين على الأقل";
      }

      if (!formData.email) {
        newErrors.email = "البريد الإلكتروني مطلوب";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "البريد الإلكتروني غير صحيح";
      }

      if (formData.phone && !/^(\+962|0)?[7-9][0-9]{8}$/.test(formData.phone)) {
        newErrors.phone = "رقم الهاتف غير صحيح";
      }

      if (!formData.password) {
        newErrors.password = "كلمة المرور مطلوبة";
      } else if (formData.password.length < 6) {
        newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "كلمة المرور غير متطابقة";
      }

      // Optional field validations
      if (formData.address && formData.address.length < 5) {
        newErrors.address = "العنوان يجب أن يكون 5 أحرف على الأقل";
      }

      if (formData.dateOfBirth) {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 13) {
          newErrors.dateOfBirth = "يجب أن يكون العمر 13 سنة على الأقل";
        } else if (age > 120) {
          newErrors.dateOfBirth = "تاريخ الميلاد غير صحيح";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } catch (error) {
      console.error("❌ Error in validateForm:", error);
      return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    try {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error when user starts typing
      if (errors[field as keyof typeof errors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    } catch (error) {
      console.error("❌ Error in handleInputChange:", { field, value, error });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Call the API directly to get the userId
      const response = await AuthService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        role: "patient",
        address: formData.address || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
      });

      if (response.success && response.userId) {
        // Redirect to OTP verification page with userId
        router.push(`/verify-otp?userId=${response.userId}`);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrors({
        general:
          error.response?.data?.message ||
          "حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى.",
      });
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

      {/* Right Side - Signup Form */}
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
              إنشاء حساب جديد
            </h1>
            <p className="text-gray-500 text-sm">انضم إلى أهلي العبور</p>
            <p className="text-sm text-gray-400 mt-1">marciosodesign.com</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                required
              />
              {errors.name && (
                <p className="text-sm text-red-600 text-right">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600 text-right">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="07xxxxxxxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                required
              />
              {errors.phone && (
                <p className="text-sm text-red-600 text-right">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                العنوان
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="أدخل عنوانك"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />
              {errors.address && (
                <p className="text-sm text-red-600 text-right">
                  {errors.address}
                </p>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                تاريخ الميلاد
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600 text-right">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="أدخل كلمة المرور"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 text-right">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 text-right">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
