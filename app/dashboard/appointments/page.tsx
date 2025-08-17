"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DoctorDashboardLayout } from "@/components/dashboard";
import { Search, Filter } from "lucide-react";

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "completed" | "upcoming" | "cancelled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allAppointments = [
    {
      id: "1",
      patientName: "محمد جمال",
      patientId: "p001",
      date: "15 سبتمبر 2025",
      time: "02:34 مساءاً",
      status: "completed" as const,
      specialty: "طب عام",
      notes: "فحص دوري",
    },
    {
      id: "2",
      patientName: "فاطمة أحمد",
      patientId: "p002",
      date: "15 سبتمبر 2025",
      time: "04:00 مساءاً",
      status: "upcoming" as const,
      specialty: "طب أسنان",
      notes: "تنظيف أسنان",
    },
    {
      id: "3",
      patientName: "أحمد علي",
      patientId: "p003",
      date: "15 سبتمبر 2025",
      time: "05:30 مساءاً",
      status: "cancelled" as const,
      specialty: "طب عام",
      notes: "إلغى المريض",
    },
    {
      id: "4",
      patientName: "سارة محمد",
      patientId: "p004",
      date: "16 سبتمبر 2025",
      time: "10:00 صباحاً",
      status: "upcoming" as const,
      specialty: "طب عيون",
      notes: "فحص نظر",
    },
    {
      id: "5",
      patientName: "علي حسن",
      patientId: "p005",
      date: "16 سبتمبر 2025",
      time: "11:30 صباحاً",
      status: "upcoming" as const,
      specialty: "طب عام",
      notes: "متابعة علاج",
    },
    {
      id: "6",
      patientName: "نور الدين",
      patientId: "p006",
      date: "17 سبتمبر 2025",
      time: "09:00 صباحاً",
      status: "upcoming" as const,
      specialty: "طب أسنان",
      notes: "حشو أسنان",
    },
  ];

  const filteredAppointments = allAppointments.filter((appointment) => {
    const matchesStatus =
      selectedStatus === "all" || appointment.status === selectedStatus;
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "upcoming":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "upcoming":
        return "قادم";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["doctor", "patient"]}>
      <DoctorDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              المواعيد
            </h1>
            <p className="text-gray-600 text-center">
              إدارة جميع مواعيد العيادة
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Status Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedStatus("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedStatus("cancelled")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === "cancelled"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  ملغي
                </button>
                <button
                  onClick={() => setSelectedStatus("completed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === "completed"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  مكتمل
                </button>
                <button
                  onClick={() => setSelectedStatus("upcoming")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === "upcoming"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  قادم
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="إبحث عن مريض"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Patient Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {appointment.patientName}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {appointment.specialty}
                        </p>

                        {/* Date & Time */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <span>📅</span>
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>🕐</span>
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusLabel(appointment.status)}
                        </span>

                        <div className="flex gap-2">
                          <button className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                            <span>📄</span>
                            <span>الملف</span>
                          </button>
                          <button
                            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              appointment.status === "completed" ||
                              appointment.status === "cancelled"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            <span>✓</span>
                            <span>تم الفحص</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-3 block">📅</span>
                  <p>لا توجد مواعيد تطابق المعايير المحددة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DoctorDashboardLayout>
    </ProtectedRoute>
  );
}
