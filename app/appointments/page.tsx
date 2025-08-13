"use client";

import React, { useState, useMemo } from "react";
import { Appointment } from "@/types";
import { mockAppointments } from "@/lib/mockData";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import AppointmentCard from "@/components/features/AppointmentCard";
import MedicalFileModal from "@/components/features/MedicalFileModal";
import AddReviewModal from "@/components/features/AddReviewModal";
import CancelAppointmentModal from "@/components/features/CancelAppointmentModal";
import EditAppointmentModal from "@/components/features/EditAppointmentModal";

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [isMedicalFileModalOpen, setIsMedicalFileModalOpen] = useState(false);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isCancelAppointmentModalOpen, setIsCancelAppointmentModalOpen] =
    useState(false);
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] =
    useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    if (activeTab === "upcoming") {
      return mockAppointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= now && appointment.status === "upcoming";
      });
    } else {
      return mockAppointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate < now || appointment.status !== "upcoming";
      });
    }
  }, [activeTab]);

  const handleViewMedicalFile = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsMedicalFileModalOpen(true);
  };

  const handleReschedule = (appointmentId: string) => {
    console.log("Reschedule appointment:", appointmentId);
    // TODO: Implement reschedule functionality
  };

  const handleCancel = (appointmentId: string) => {
    const appointment = mockAppointments.find((a) => a.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsCancelAppointmentModalOpen(true);
    }
  };

  const handleLeaveReview = (appointmentId: string) => {
    const appointment = mockAppointments.find((a) => a.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsAddReviewModalOpen(true);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditAppointmentModalOpen(true);
  };

  const handleCancelConfirm = async (appointmentId: string, reason: string) => {
    console.log("Cancelling appointment:", appointmentId, "Reason:", reason);
    // TODO: Implement actual cancellation logic
    // Update appointment status in database
  };

  const handleReviewSubmit = (reviewData: {
    appointmentId: string;
    rating: number;
    comment: string;
  }) => {
    console.log("Review submitted:", reviewData);
    // TODO: Implement review submission logic
    // Save review to database
  };

  const handleEditConfirm = (bookingDetails: {
    doctorId: string;
    doctorName: string;
    date: Date;
    time: string;
    price: number;
    clinic: string;
    location: string;
  }) => {
    console.log("Appointment edited:", bookingDetails);
    // TODO: Implement appointment editing logic
    // Update appointment in database
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
                <div className="bg-[#D9ECFF] rounded-lg p-1 flex">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "upcoming"
                        ? "bg-[#2349FF] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:cursor-pointer"
                    }`}
                  >
                    المواعيد القادمة
                  </button>
                  <button
                    onClick={() => setActiveTab("past")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "past"
                        ? "bg-[#2349FF] text-white shadow-sm"
                        : "bg-[#D9ECFF] text-gray-600 hover:text-gray-900 hover:cursor-pointer"
                    }`}
                  >
                    المواعيد السابقة
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Appointments List */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    onEdit={handleEdit}
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

          {/* Add Review Modal */}
          <AddReviewModal
            isOpen={isAddReviewModalOpen}
            onClose={() => setIsAddReviewModalOpen(false)}
            appointment={selectedAppointment}
            onSubmit={handleReviewSubmit}
          />

          {/* Cancel Appointment Modal */}
          <CancelAppointmentModal
            isOpen={isCancelAppointmentModalOpen}
            onClose={() => setIsCancelAppointmentModalOpen(false)}
            appointment={selectedAppointment}
            onConfirm={handleCancelConfirm}
          />

          {/* Edit Appointment Modal */}
          <EditAppointmentModal
            isOpen={isEditAppointmentModalOpen}
            onClose={() => setIsEditAppointmentModalOpen(false)}
            appointment={selectedAppointment}
            onConfirm={handleEditConfirm}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
