"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DoctorDashboardLayout } from "@/components/dashboard";
import { useDoctorAppointments } from "@/lib/hooks";
import { DoctorAppointment } from "@/lib/api/services/doctors";
import {
  Search,
  Calendar,
  Clock,
  User,
  FileText,
  Loader,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const {
    appointments,
    loading,
    error,
    filters,
    updateFilters,
    refreshAppointments,
  } = useDoctorAppointments();

  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Filter appointments based on search and status
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status === selectedStatus
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (appointment) =>
          appointment.patientId.userId.name.toLowerCase().includes(query) ||
          appointment.patientId.userId.email.toLowerCase().includes(query) ||
          appointment.patientId.userId.phone?.toLowerCase().includes(query)
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        const filterDate = new Date(selectedDate);
        return appointmentDate.toDateString() === filterDate.toDateString();
      });
    }

    return filtered;
  }, [appointments, selectedStatus, searchQuery, selectedDate]);

  const handleStatusChange = (status: typeof selectedStatus) => {
    setSelectedStatus(status);
    // Update API filters
    if (status === "all") {
      updateFilters({ status: undefined });
    } else {
      updateFilters({ status });
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    // Update API filters
    if (date) {
      updateFilters({ date });
    } else {
      updateFilters({ date: undefined });
    }
  };

  const formatAppointmentDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy", { locale: ar });
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

  const getStatusBadge = (status: DoctorAppointment["status"]) => {
    const statusConfig = {
      pending: {
        text: "في الانتظار",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
      },
      confirmed: {
        text: "مؤكد",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      },
      completed: {
        text: "مكتمل",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      },
      cancelled: {
        text: "ملغي",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">المواعيد</h1>
            <p className="text-gray-600">إدارة مواعيد المرضى والمتابعة</p>

            {/* Refresh Button */}
            <div className="mt-4">
              <button
                onClick={() => refreshAppointments()}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {loading ? "جاري التحديث..." : "تحديث المواعيد"}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="البحث بالاسم أو البريد الإلكتروني..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div className="sm:w-48">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as typeof selectedStatus)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">جميع المواعيد</option>
                  <option value="pending">في الانتظار</option>
                  <option value="confirmed">مؤكدة</option>
                  <option value="completed">مكتملة</option>
                  <option value="cancelled">ملغية</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-red-800">
                    خطأ في تحميل المواعيد
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={refreshAppointments}
                      className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                <span className="text-gray-600">جاري تحميل المواعيد...</span>
              </div>
            </div>
          )}

          {/* Appointments List */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  المواعيد ({filteredAppointments.length} موعد)
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredAppointments.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      لا توجد مواعيد
                    </p>
                    <p>لا توجد مواعيد تطابق معايير البحث المحددة</p>
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
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
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
                                <Clock className="w-4 h-4 ml-1" />
                                {formatAppointmentTime(appointment.timeSlot)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-600 flex items-center">
                                <FileText className="w-4 h-4 ml-1" />
                                المبلغ: {appointment.amount} دينار
                              </span>
                              {appointment.patientId.address && (
                                <span className="text-sm text-gray-600">
                                  العنوان: {appointment.patientId.address}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(appointment.status)}
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
        </div>
      </DoctorDashboardLayout>
    </ProtectedRoute>
  );
}
