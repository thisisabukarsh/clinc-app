"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DoctorDashboardLayout } from "@/components/dashboard";
import {
  addMedicalRecord,
  MedicalRecordRequest,
} from "@/lib/api/services/doctors";
import { useDoctorAppointments } from "@/lib/hooks";
import {
  FileText,
  Plus,
  Search,
  Save,
  Calendar,
  User,
  Stethoscope,
  Pill,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function MedicalRecordsPage() {
  const { appointments, loading: appointmentsLoading } =
    useDoctorAppointments();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null
  );
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [saving, setSaving] = useState(false);

  const [recordForm, setRecordForm] = useState({
    appointmentId: "",
    diagnosis: "",
    prescription: "",
    notes: "",
  });

  // Filter completed appointments for medical records
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  );

  const filteredAppointments = completedAppointments.filter((appointment) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      appointment.patientId.userId.name.toLowerCase().includes(query) ||
      appointment.patientId.userId.email.toLowerCase().includes(query)
    );
  });

  const handleAddRecord = (appointmentId: string) => {
    setRecordForm({
      appointmentId,
      diagnosis: "",
      prescription: "",
      notes: "",
    });
    setSelectedAppointment(appointmentId);
    setIsAddingRecord(true);
  };

  const handleSaveRecord = async () => {
    if (!recordForm.diagnosis.trim() || !recordForm.prescription.trim()) {
      toast.error("يرجى ملء التشخيص والوصفة الطبية");
      return;
    }

    try {
      setSaving(true);
      const recordData: MedicalRecordRequest = {
        appointmentId: recordForm.appointmentId,
        diagnosis: recordForm.diagnosis,
        prescription: recordForm.prescription,
        notes: recordForm.notes,
      };

      await addMedicalRecord(recordData);
      toast.success("تم إضافة السجل الطبي بنجاح");

      // Reset form
      setRecordForm({
        appointmentId: "",
        diagnosis: "",
        prescription: "",
        notes: "",
      });
      setIsAddingRecord(false);
      setSelectedAppointment(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل في إضافة السجل الطبي";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatAppointmentDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatAppointmentTime = (timeSlot: string) => {
    try {
      const [hours, minutes] = timeSlot.split(":");
      const hour = parseInt(hours);
      const period = hour >= 12 ? "مساءاً" : "صباحاً";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    } catch {
      return timeSlot;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              السجلات الطبية
            </h1>
            <p className="text-gray-600">إضافة وإدارة السجلات الطبية للمرضى</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="البحث عن مريض..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Medical Records Form Modal */}
          {isAddingRecord && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 ml-2" />
                    إضافة سجل طبي
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Diagnosis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Stethoscope className="w-4 h-4 inline ml-1" />
                      التشخيص *
                    </label>
                    <textarea
                      value={recordForm.diagnosis}
                      onChange={(e) =>
                        setRecordForm({
                          ...recordForm,
                          diagnosis: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل التشخيص الطبي..."
                    />
                  </div>

                  {/* Prescription */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Pill className="w-4 h-4 inline ml-1" />
                      الوصفة الطبية *
                    </label>
                    <textarea
                      value={recordForm.prescription}
                      onChange={(e) =>
                        setRecordForm({
                          ...recordForm,
                          prescription: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل الوصفة الطبية والأدوية..."
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline ml-1" />
                      ملاحظات إضافية
                    </label>
                    <textarea
                      value={recordForm.notes}
                      onChange={(e) =>
                        setRecordForm({ ...recordForm, notes: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ملاحظات إضافية أو تعليمات للمريض..."
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setIsAddingRecord(false);
                      setSelectedAppointment(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={saving}
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveRecord}
                    disabled={
                      saving ||
                      !recordForm.diagnosis.trim() ||
                      !recordForm.prescription.trim()
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-2" />
                        حفظ السجل
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {appointmentsLoading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">جاري تحميل المواعيد...</span>
              </div>
            </div>
          )}

          {/* Completed Appointments List */}
          {!appointmentsLoading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  المواعيد المكتملة ({filteredAppointments.length} موعد)
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  يمكنك إضافة السجلات الطبية للمواعيد المكتملة
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredAppointments.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      لا توجد مواعيد مكتملة
                    </p>
                    <p>لا توجد مواعيد مكتملة يمكن إضافة سجلات طبية لها</p>
                  </div>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900">
                                {appointment.patientId.userId.name}
                              </h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <p className="text-sm text-gray-500 flex items-center">
                                  <User className="w-4 h-4 ml-1" />
                                  {appointment.patientId.userId.email}
                                </p>
                                {appointment.patientId.userId.phone && (
                                  <p className="text-sm text-gray-500">
                                    {appointment.patientId.userId.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 flex items-center">
                                <Calendar className="w-4 h-4 ml-1" />
                                {formatAppointmentDate(
                                  appointment.appointmentDate
                                )}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                {formatAppointmentTime(appointment.timeSlot)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 ml-1" />
                                مكتمل
                              </span>
                              <span className="text-sm text-gray-600">
                                المبلغ: {appointment.amount} دينار
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleAddRecord(appointment._id)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="w-4 h-4 ml-2" />
                                إضافة سجل طبي
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-blue-800">
                  معلومات مهمة
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>يمكنك إضافة السجلات الطبية فقط للمواعيد المكتملة</li>
                    <li>السجل الطبي يتضمن التشخيص والوصفة الطبية</li>
                    <li>يمكن إضافة ملاحظات إضافية أو تعليمات للمريض</li>
                    <li>السجلات الطبية محفوظة بشكل آمن ومشفر</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DoctorDashboardLayout>
    </ProtectedRoute>
  );
}
