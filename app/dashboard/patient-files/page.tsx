"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DoctorDashboardLayout } from "@/components/dashboard";
import { Search, Plus, FileText, Clock, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorPatientFilesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const patientFiles = [
    {
      id: "1",
      patientName: "محمد جمال",
      patientId: "p001",
      lastVisit: "15 سبتمبر 2025",
      lastVisitTime: "02:34 مساءاً",
      specialty: "طب عام",
      diagnosis: "فحص دوري - صحة جيدة",
    },
    {
      id: "2",
      patientName: "فاطمة أحمد",
      patientId: "p002",
      lastVisit: "14 سبتمبر 2025",
      lastVisitTime: "10:00 صباحاً",
      specialty: "طب أسنان",
      diagnosis: "تنظيف أسنان - لا توجد مشاكل",
    },
    {
      id: "3",
      patientName: "أحمد علي",
      patientId: "p003",
      lastVisit: "13 سبتمبر 2025",
      lastVisitTime: "03:30 مساءاً",
      specialty: "طب عام",
      diagnosis: "متابعة علاج - تحسن ملحوظ",
    },
    {
      id: "4",
      patientName: "سارة محمد",
      patientId: "p004",
      lastVisit: "12 سبتمبر 2025",
      lastVisitTime: "09:00 صباحاً",
      specialty: "طب عيون",
      diagnosis: "فحص نظر - يحتاج نظارة جديدة",
    },
    {
      id: "5",
      patientName: "علي حسن",
      patientId: "p005",
      lastVisit: "11 سبتمبر 2025",
      lastVisitTime: "11:30 صباحاً",
      specialty: "طب عام",
      diagnosis: "علاج التهاب - تم الشفاء",
    },
    {
      id: "6",
      patientName: "نور الدين",
      patientId: "p006",
      lastVisit: "10 سبتمبر 2025",
      lastVisitTime: "04:00 مساءاً",
      specialty: "طب أسنان",
      diagnosis: "حشو أسنان - تم الإصلاح",
    },
  ];

  const filteredPatientFiles = patientFiles.filter(
    (patient) =>
      patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewFile = (patientId: string) => {
    // TODO: Implement patient file view
    console.log("View file for patient:", patientId);
  };

  const handleAddPatientFile = () => {
    router.push("/dashboard/add-patient-file");
  };

  return (
    <ProtectedRoute allowedRoles={["doctor", "patient"]}>
      <DoctorDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ملفات المرضى
            </h1>
            <p className="text-gray-600">إدارة سجلات المرضى والملفات الطبية</p>
          </div>

          {/* Action Button and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Add Patient File Button */}
              <button
                onClick={handleAddPatientFile}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>اضافة ملف مريض</span>
              </button>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ابحث عن ملف مريض"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
            </div>
          </div>

          {/* Patient Files List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {filteredPatientFiles.length > 0 ? (
                filteredPatientFiles.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Patient Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {patient.patientName}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {patient.specialty}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          {patient.diagnosis}
                        </p>

                        {/* Last Visit Info */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{patient.lastVisit}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{patient.lastVisitTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleViewFile(patient.patientId)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          <span>الملف</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>لا توجد ملفات مرضى تطابق البحث</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DoctorDashboardLayout>
    </ProtectedRoute>
  );
}
