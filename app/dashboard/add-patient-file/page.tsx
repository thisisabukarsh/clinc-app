"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DoctorDashboardLayout } from "@/components/dashboard";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddPatientFilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    diagnosis: "",
    notes: "",
    prescription: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log("Saving patient file:", formData);
    router.push("/dashboard/patient-files");
  };

  const handleBack = () => {
    router.push("/dashboard/patient-files");
  };

  return (
    <ProtectedRoute allowedRoles={["doctor", "patient"]}>
      <DoctorDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة لملفات المرضى</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">اضافة ملف</h1>
            <p className="text-gray-600">إضافة ملف مريض جديد</p>
          </div>

          {/* Add Patient File Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form
              onSubmit={handleSubmit}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Patient and Doctor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المريض
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) =>
                      handleInputChange("patientName", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسم المريض"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الطبيب
                  </label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) =>
                      handleInputChange("doctorName", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسم الطبيب"
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التشخيص
                  </label>
                  <textarea
                    value={formData.diagnosis}
                    onChange={(e) =>
                      handleInputChange("diagnosis", e.target.value)
                    }
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل التشخيص الطبي"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل الملاحظات الطبية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصفة الطبية
                  </label>
                  <textarea
                    value={formData.prescription}
                    onChange={(e) =>
                      handleInputChange("prescription", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل الوصفة الطبية"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>اضافة الملف +</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </DoctorDashboardLayout>
    </ProtectedRoute>
  );
}
