"use client";

import React from "react";
import { Calendar, Clock, FileText, CheckCircle } from "lucide-react";
import { DashboardAppointment } from "@/types";

type Appointment = DashboardAppointment;

interface AppointmentsSectionProps {
  title: string;
  appointments: Appointment[];
  type: "today" | "upcoming";
}

const StatusBadge: React.FC<{ status: Appointment["status"] }> = ({
  status,
}) => {
  const statusConfig = {
    completed: {
      label: "مكتمل",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    upcoming: {
      label: "قادم",
      className: "bg-orange-100 text-orange-800 border-orange-200",
    },
    cancelled: {
      label: "ملغي",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const ActionButton: React.FC<{
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "primary" | "secondary";
  onClick: () => void;
}> = ({ label, icon: Icon, variant, onClick }) => {
  const baseClasses =
    "inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

const AppointmentCard: React.FC<{ appointment: Appointment }> = ({
  appointment,
}) => {
  const handleViewFile = () => {
    // TODO: Implement patient file view
    console.log("View file for patient:", appointment.patientId);
  };

  const handleMarkExamined = () => {
    // TODO: Implement mark as examined
    console.log("Mark as examined:", appointment.id);
  };

  const isCompleted = appointment.status === "completed";
  const isCancelled = appointment.status === "cancelled";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      {/* Patient Info */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-900 mb-1">
          {appointment.patientName}
        </h4>
        <p className="text-sm text-gray-600 mb-2">{appointment.specialty}</p>

        {/* Date & Time */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center justify-between">
        <StatusBadge status={appointment.status} />

        <div className="flex items-center space-x-2">
          <ActionButton
            label="الملف"
            icon={FileText}
            variant={isCancelled ? "secondary" : "primary"}
            onClick={handleViewFile}
          />
          <ActionButton
            label="تم الفحص"
            icon={CheckCircle}
            variant={isCompleted || isCancelled ? "secondary" : "primary"}
            onClick={handleMarkExamined}
          />
        </div>
      </div>
    </div>
  );
};

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({
  title,
  appointments,
  type,
}) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          الكل
        </span>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد مواعيد {type === "today" ? "لهذا اليوم" : "قادمة"}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppointmentsSection;
