"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Edit2, Save, X } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const validateForm = () => {
    const newErrors: any = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const success = await updateProfile(formData);
      if (success) {
        setIsEditing(false);
        setErrors({});
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear field error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
              <p className="text-gray-600 mt-2">
                إدارة معلوماتك الشخصية وإعدادات الحساب
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <div className="lg:col-span-1">
                <Card className="p-6 text-center">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {user?.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  <div className="text-sm text-gray-500">
                    <p>عضو منذ يناير 2025</p>
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card className="p-6 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    إحصائيات سريعة
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">إجمالي المواعيد</span>
                      <span className="font-medium">
                        {user?.appointments?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">المواعيد القادمة</span>
                      <span className="font-medium text-primary-600">2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">المواعيد المكتملة</span>
                      <span className="font-medium text-green-600">1</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      المعلومات الشخصية
                    </h3>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 space-x-reverse"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>تعديل</span>
                      </Button>
                    ) : (
                      <div className="flex space-x-2 space-x-reverse">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          className="flex items-center space-x-1 space-x-reverse"
                        >
                          <X className="w-4 h-4" />
                          <span>إلغاء</span>
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleSave}
                          disabled={isLoading}
                          className="flex items-center space-x-1 space-x-reverse"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isLoading ? "جاري الحفظ..." : "حفظ"}</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {isEditing ? (
                      <>
                        <Input
                          type="text"
                          label="الاسم الكامل"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          error={errors.name}
                          icon={<User className="w-5 h-5" />}
                        />

                        <Input
                          type="email"
                          label="البريد الإلكتروني"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          error={errors.email}
                          icon={<Mail className="w-5 h-5" />}
                        />

                        <Input
                          type="tel"
                          label="رقم الهاتف"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          error={errors.phone}
                          icon={<Phone className="w-5 h-5" />}
                          placeholder="07xxxxxxxx"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3 space-x-reverse py-3 border-b border-gray-100">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">
                              الاسم الكامل
                            </p>
                            <p className="font-medium text-gray-900">
                              {user?.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 space-x-reverse py-3 border-b border-gray-100">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">
                              البريد الإلكتروني
                            </p>
                            <p className="font-medium text-gray-900">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 space-x-reverse py-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">رقم الهاتف</p>
                            <p className="font-medium text-gray-900">
                              {user?.phone || "غير محدد"}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Security Settings */}
                <Card className="p-6 mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    إعدادات الأمان
                  </h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      تغيير كلمة المرور
                    </Button>
                    <Button variant="outline" className="w-full">
                      تفعيل التحقق بخطوتين
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      حذف الحساب
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
