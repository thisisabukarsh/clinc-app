"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DoctorDashboardLayout } from "@/components/dashboard";
import { Edit, Upload, Save } from "lucide-react";

export default function DoctorSettingsPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: "محمد عمر",
    specialty: "طب اسنان",
    clinicName: "عيادة القدس",
    examinationFee: "20",
    currency: "دينار اردني",
    clinicAddress: "عمان - جبل الحسين - شارع .... - مبنى ..... - طابق 2",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving settings:", formData);
    setIsEditing(false);
  };

  const handleImageUpload = (type: "doctor" | "clinic") => {
    // TODO: Implement image upload functionality
    console.log("Uploading image for:", type);
  };

  return (
    <ProtectedRoute allowedRoles={["doctor", "patient"]}>
      <DoctorDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
            <p className="text-gray-600">إدارة معلومات الطبيب والعيادة</p>
          </div>

          {/* Settings Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Doctor Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إسم الطبيب
                  </label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) =>
                      handleInputChange("doctorName", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاختصاص
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) =>
                      handleInputChange("specialty", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Clinic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    إسم العيادة
                  </label>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) =>
                    handleInputChange("clinicName", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      سعر الكشفية
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={formData.examinationFee}
                        onChange={(e) =>
                          handleInputChange("examinationFee", e.target.value)
                        }
                        disabled={!isEditing}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) =>
                          handleInputChange("currency", e.target.value)
                        }
                        disabled={!isEditing}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="دينار اردني">دينار اردني</option>
                        <option value="دولار أمريكي">دولار أمريكي</option>
                        <option value="يورو">يورو</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    عنوان العيادة
                  </label>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.clinicAddress}
                  onChange={(e) =>
                    handleInputChange("clinicAddress", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              {/* Image Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صورة الطبيب
                  </label>
                  <div
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => handleImageUpload("doctor")}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-blue-600">
                      قم بتنزيل الصورة هنا
                    </p>
                  </div>
                </div>

                {/* Clinic Logo/Stamp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شعار العيادة
                  </label>
                  <div
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => handleImageUpload("clinic")}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-blue-600">
                      قم بتنزيل الصورة هنا
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center pt-6">
                {isEditing ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      <span>حفظ التعديلات</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    <span>تعديل المعلومات</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DoctorDashboardLayout>
    </ProtectedRoute>
  );
}
