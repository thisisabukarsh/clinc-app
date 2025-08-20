"use client";

import React from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  DoctorDashboardLayout,
  DashboardStats,
  AppointmentsSection,
} from "@/components/dashboard";

export default function DoctorDashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              لوحة التحكم
            </h1>
            <p className="text-gray-600">
              مرحباً {user?.name}، إليك نظرة عامة على عيادتك
            </p>
          </div>

          {/* Statistics Section */}
          <DashboardStats />

          {/* Appointments Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppointmentsSection
              title="مواعيد اليوم"
              appointments={mockTodayAppointments}
              type="today"
            />
            <AppointmentsSection
              title="المواعيد القادمة"
              appointments={mockUpcomingAppointments}
              type="upcoming"
            />
          </div>
        </div>
      </DoctorDashboardLayout>
    </ProtectedRoute>
  );
}

// Mock data for development
const mockTodayAppointments = [
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
];

const mockUpcomingAppointments = [
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
