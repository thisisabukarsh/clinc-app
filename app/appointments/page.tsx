"use client";

import React, { useState, useMemo } from "react";
import { Appointment } from "@/types";
import { usePatientAppointments } from "@/lib/hooks";
import {
  transformAppointmentData,
  updatePatientAppointment,
} from "@/lib/api/services";
import MainLayout from "@/components/layout/MainLayout";
import AppointmentCard from "@/components/features/AppointmentCard";
import MedicalFileModal from "@/components/features/MedicalFileModal";
import AddReviewModal from "@/components/features/AddReviewModal";
import CancelAppointmentModal from "@/components/features/CancelAppointmentModal";
import EditAppointmentModal from "@/components/features/EditAppointmentModal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "react-hot-toast";

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

  const {
    appointments,
    loading,
    error,
    cancelAppointmentById,
    refreshAppointments,
  } = usePatientAppointments();

  // Utility function to check if appointment can be cancelled
  const canCancelAppointment = (appointment: {
    appointmentDate: string;
    timeSlot?: string;
    status: string;
  }) => {
    const appointmentDateTime = new Date(appointment.appointmentDate);

    // Parse time slot and add to appointment date
    if (appointment.timeSlot) {
      const [hours, minutes] = appointment.timeSlot.split(":").map(Number);
      appointmentDateTime.setHours(hours, minutes || 0, 0, 0);
    }

    const now = new Date();
    const hoursDiff =
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return (
      hoursDiff >= 24 &&
      (appointment.status === "confirmed" || appointment.status === "pending")
    );
  };

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    if (activeTab === "upcoming") {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);

        // Include confirmed and pending appointments that are today or in the future
        return (
          appointmentDate >= now &&
          (appointment.status === "confirmed" ||
            appointment.status === "pending")
        );
      });
    } else {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);

        // Include past appointments or cancelled/completed appointments
        return (
          appointmentDate < now ||
          appointment.status === "cancelled" ||
          appointment.status === "completed"
        );
      });
    }
  }, [activeTab, appointments]);

  const handleViewMedicalFile = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsMedicalFileModalOpen(true);
  };

  const handleReschedule = (appointmentId: string) => {
    const appointment = appointments.find((a) => a._id === appointmentId);
    if (appointment) {
      const transformedAppointment = transformAppointmentData(appointment);
      setSelectedAppointment(transformedAppointment);
      setIsEditAppointmentModalOpen(true);
    }
    console.log("Reschedule appointment:", appointmentId);
  };

  const handleCancel = (appointmentId: string) => {
    const appointment = appointments.find((a) => a._id === appointmentId);
    if (appointment) {
      // Check if appointment can be cancelled (24-hour rule)
      if (!canCancelAppointment(appointment)) {
        // Show error message for appointments that can't be cancelled
        const appointmentDateTime = new Date(appointment.appointmentDate);
        if (appointment.timeSlot) {
          const [hours, minutes] = appointment.timeSlot.split(":").map(Number);
          appointmentDateTime.setHours(hours, minutes || 0, 0, 0);
        }

        const now = new Date();
        const hoursDiff =
          (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          toast.error(
            `لا يمكن إلغاء الموعد. يجب أن يكون لديك 24 ساعة على الأقل قبل الموعد للإلغاء.\nالوقت المتبقي: ${Math.round(
              hoursDiff
            )} ساعة`,
            {
              duration: 5000,
              style: {
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#991B1B",
              },
            }
          );
        } else {
          toast.error("لا يمكن إلغاء هذا الموعد");
        }
        return;
      }

      const transformedAppointment = transformAppointmentData(appointment);
      setSelectedAppointment(transformedAppointment);
      setIsCancelAppointmentModalOpen(true);
    }
  };

  const handleLeaveReview = (appointmentId: string) => {
    const appointment = appointments.find((a) => a._id === appointmentId);
    if (appointment) {
      const transformedAppointment = transformAppointmentData(appointment);
      setSelectedAppointment(transformedAppointment);
      setIsAddReviewModalOpen(true);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditAppointmentModalOpen(true);
  };

  const handleCancelConfirm = async (appointmentId: string) => {
    try {
      await cancelAppointmentById(appointmentId);
      setIsCancelAppointmentModalOpen(false);
      setSelectedAppointment(null);

      // Show success message
      const appointmentData = appointments.find((a) => a._id === appointmentId);
      const doctorName = appointmentData?.doctorId?.userId?.name || "الطبيب";

      // Refresh appointments to get updated list
      await refreshAppointments();

      // Success notification
      toast.success(`تم إلغاء موعدك مع ${doctorName} بنجاح`, {
        duration: 4000,
        style: {
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#166534",
        },
      });
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      // Error handling is already done in the hook
    }
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

  const handleEditConfirm = async (bookingDetails: {
    doctorId: string;
    doctorName: string;
    date: Date;
    time: string;
    price: number;
    clinic: string;
    location: string;
  }) => {
    if (!selectedAppointment) {
      toast.error("لم يتم العثور على الموعد المحدد");
      return;
    }

    try {
      console.log("Updating appointment:", bookingDetails);

      // Prepare the update data
      const updateData = {
        doctorId: bookingDetails.doctorId,
        appointmentDate: bookingDetails.date.toISOString().split("T")[0], // Format as YYYY-MM-DD
        timeSlot: bookingDetails.time,
      };

      // Update the appointment using the new API
      await updatePatientAppointment(selectedAppointment.id, updateData);

      // Close the modal
      setIsEditAppointmentModalOpen(false);
      setSelectedAppointment(null);

      // Refresh appointments to get updated list
      await refreshAppointments();

      // Show success message
      toast.success(`تم تحديث موعدك مع ${bookingDetails.doctorName} بنجاح`, {
        duration: 4000,
        style: {
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#166534",
        },
      });
    } catch (error) {
      console.error("Failed to update appointment:", error);

      // Show error message
      let errorMessage = "حدث خطأ أثناء تحديث الموعد";

      if (error instanceof Error) {
        if (error.message.includes("24")) {
          errorMessage = "لا يمكن تعديل الموعد قبل أقل من 24 ساعة";
        } else if (
          error.message.includes("محجوز") ||
          error.message.includes("booked")
        ) {
          errorMessage = "الموعد الجديد محجوز بالفعل. يرجى اختيار موعد آخر";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage, {
        duration: 5000,
        style: {
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          color: "#991B1B",
        },
      });
    }
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <MainLayout>
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen pt-20">
          {/* Header */}
          <section className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0h8m-8 0a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2"
                    />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  مواعيدي الطبية
                </h1>
                <p className="text-gray-600 text-lg">
                  إدارة مواعيدك الطبية بسهولة ويسر
                </p>
              </div>

              {/* Stats */}
              {!loading && appointments.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {
                        appointments.filter(
                          (a) =>
                            a.status === "confirmed" || a.status === "pending"
                        ).length
                      }
                    </div>
                    <div className="text-xs sm:text-sm text-blue-800 font-medium">
                      نشط
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">
                      {
                        appointments.filter((a) => a.status === "completed")
                          .length
                      }
                    </div>
                    <div className="text-xs sm:text-sm text-green-800 font-medium">
                      مكتمل
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <div className="text-2xl sm:text-3xl font-bold text-red-600">
                      {
                        appointments.filter((a) => a.status === "cancelled")
                          .length
                      }
                    </div>
                    <div className="text-xs sm:text-sm text-red-800 font-medium">
                      ملغي
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-600">
                      {appointments.length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-800 font-medium">
                      المجموع
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex justify-center">
                <div className="bg-gray-100 rounded-xl p-1 flex shadow-inner w-full max-w-md">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`relative flex-1 px-4 sm:px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      activeTab === "upcoming"
                        ? "bg-white text-blue-600 shadow-md transform scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span className="relative z-10 whitespace-nowrap">
                      المواعيد القادمة
                    </span>
                    {activeTab === "upcoming" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg opacity-50"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("past")}
                    className={`relative flex-1 px-4 sm:px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      activeTab === "past"
                        ? "bg-white text-blue-600 shadow-md transform scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span className="relative z-10 whitespace-nowrap">
                      المواعيد السابقة
                    </span>
                    {activeTab === "past" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg opacity-50"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Appointments List */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  جاري تحميل المواعيد
                </h3>
                <p className="text-gray-600">
                  يرجى الانتظار بينما نجلب أحدث مواعيدك...
                </p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-l-4 border-red-500">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  حدث خطأ
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                  onClick={refreshAppointments}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeTab === "upcoming"
                      ? "المواعيد القادمة"
                      : "المواعيد السابقة"}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {filteredAppointments.length} موعد{" "}
                    {activeTab === "upcoming" ? "قادم" : "سابق"}
                  </p>
                </div>

                <div className="grid gap-6">
                  {filteredAppointments.map((appointment) => {
                    const transformedAppointment =
                      transformAppointmentData(appointment);
                    const canCancel = canCancelAppointment(appointment);
                    return (
                      <div
                        key={appointment._id}
                        className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                      >
                        <AppointmentCard
                          appointment={transformedAppointment}
                          onViewMedicalFile={handleViewMedicalFile}
                          onReschedule={handleReschedule}
                          onCancel={handleCancel}
                          onLeaveReview={handleLeaveReview}
                          onEdit={handleEdit}
                          canCancel={canCancel}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Enhanced Empty State */
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                  {activeTab === "upcoming" ? (
                    <svg
                      className="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0h8m-8 0a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {activeTab === "upcoming"
                    ? "لا توجد مواعيد قادمة"
                    : "لا توجد مواعيد سابقة"}
                </h3>

                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  {activeTab === "upcoming"
                    ? "ابدأ رحلتك الصحية واحجز موعدك الأول مع أفضل الأطباء المتخصصين"
                    : "ستظهر هنا جميع مواعيدك المكتملة والملغية للمراجعة والمتابعة"}
                </p>

                {activeTab === "upcoming" && (
                  <div className="space-y-4">
                    <button
                      onClick={() => (window.location.href = "/doctors")}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      احجز موعد جديد
                    </button>
                    <div className="text-sm text-gray-500">
                      أو تصفح قائمة الأطباء المتاحين
                    </div>
                  </div>
                )}

                {activeTab === "past" && (
                  <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      💡 نصيحة
                    </h4>
                    <p className="text-blue-800 text-sm">
                      يمكنك مراجعة تاريخك الطبي والتقارير من خلال المواعيد
                      المكتملة
                    </p>
                  </div>
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
