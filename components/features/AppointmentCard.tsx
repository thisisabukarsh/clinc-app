"use client";

import React from "react";
import { Calendar, Clock, User, FileText, Star } from "lucide-react";
import { Appointment } from "@/types";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface AppointmentCardProps {
  appointment: Appointment;
  onViewMedicalFile?: (appointment: Appointment) => void;
  onReschedule?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
  onLeaveReview?: (appointmentId: string) => void;
  className?: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewMedicalFile,
  onReschedule,
  onCancel,
  onLeaveReview,
  className = "",
}) => {
  const isUpcoming = appointment.status === "upcoming";
  const isCompleted = appointment.status === "completed";
  const isCancelled = appointment.status === "cancelled";

  const getStatusColor = () => {
    switch (appointment.status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    switch (appointment.status) {
      case "upcoming":
        return "موعد قادم";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return "غير محدد";
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        {/* Doctor Info */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {appointment.doctorName}
            </h3>
            <p className="text-sm text-gray-600">طبيب متخصص</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
        >
          {getStatusText()}
        </span>
      </div>

      {/* Appointment Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{appointment.time}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {isUpcoming && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onReschedule?.(appointment.id)}
            >
              إعادة جدولة
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel?.(appointment.id)}
            >
              إلغاء
            </Button>
          </>
        )}

        {isCompleted && (
          <>
            {appointment.medicalFile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewMedicalFile?.(appointment)}
              >
                <FileText className="w-4 h-4 ml-1" />
                عرض الملف الطبي
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLeaveReview?.(appointment.id)}
            >
              <Star className="w-4 h-4 ml-1" />
              تقييم الطبيب
            </Button>
          </>
        )}

        {isCancelled && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onReschedule?.(appointment.id)}
          >
            حجز موعد جديد
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AppointmentCard;
