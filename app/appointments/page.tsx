"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppointmentCard from "@/components/features/AppointmentCard";
import MedicalFileModal from "@/components/features/MedicalFileModal";
import { mockAppointments } from "@/lib/mockData";
import { Appointment } from "@/types";

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isMedicalFileModalOpen, setIsMedicalFileModalOpen] = useState(false);

  // Filter appointments based on active tab
  const filteredAppointments = mockAppointments.filter((appointment) => {
    if (activeTab === "upcoming") {
      return appointment.status === "upcoming";
    } else {
      return (
        appointment.status === "completed" || appointment.status === "cancelled"
      );
    }
  });

  const handleViewMedicalFile = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsMedicalFileModalOpen(true);
  };

  const handleReschedule = (appointmentId: string) => {
    console.log("Reschedule appointment:", appointmentId);
    // TODO: Implement reschedule functionality
  };

  const handleCancel = (appointmentId: string) => {
    console.log("Cancel appointment:", appointmentId);
    // TODO: Implement cancel functionality
  };

  const handleLeaveReview = (appointmentId: string) => {
    console.log("Leave review for appointment:", appointmentId);
    // TODO: Implement review functionality
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="bg-gray-50 min-h-screen">
          {/* Header */}
          <section className="bg-white shadow-soft">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
                مواعيدي
              </h1>

              {/* Tabs */}
              <div className="flex justify-center">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "upcoming"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    المواعيد القادمة
                  </button>
                  <button
                    onClick={() => setActiveTab("past")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "past"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    المواعيد السابقة
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Appointments List */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onViewMedicalFile={handleViewMedicalFile}
                    onReschedule={handleReschedule}
                    onCancel={handleCancel}
                    onLeaveReview={handleLeaveReview}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab === "upcoming"
                    ? "لا توجد مواعيد قادمة"
                    : "لا توجد مواعيد سابقة"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === "upcoming"
                    ? "احجز موعدك الأول مع أفضل الأطباء"
                    : "ستظهر مواعيدك المكتملة والملغية هنا"}
                </p>
                {activeTab === "upcoming" && (
                  <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                    احجز موعد جديد
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Medical File Modal */}
          <MedicalFileModal
            isOpen={isMedicalFileModalOpen}
            onClose={() => setIsMedicalFileModalOpen(false)}
            appointment={selectedAppointment}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
