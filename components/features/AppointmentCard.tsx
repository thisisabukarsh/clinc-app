"use client";

import React from "react";
import { Calendar, Clock, FileText, Star } from "lucide-react";
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
  onEdit?: (appointment: Appointment) => void;
  className?: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewMedicalFile,
  onReschedule,
  onCancel,
  onLeaveReview,
  onEdit,
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
    <Card className={`p-3 px-4 bg-blue-50 border-blue-100 ${className}`}>
      <div className="flex justify-between items-center" dir="ltr">
        {/* Left Section - Action Buttons */}
        <div className="flex gap-3 items-center justify-center">
          {isUpcoming && (
            <>
              <Button
                onClick={() => onEdit?.(appointment)}
                variant="primary"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg min-w-[120px]"
              >
                تعديل الموعد
              </Button>
              <Button
                onClick={() => onCancel?.(appointment.id)}
                variant="outline"
                size="sm"
                className="bg-blue-100 hover:bg-blue-200 text-gray-700 border-blue-200 px-4 py-2 rounded-lg min-w-[120px]"
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
                  className="bg-blue-100 hover:bg-blue-200 text-gray-700 border-blue-200 px-4 py-2 rounded-lg min-w-[120px]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  الملف الطبي
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLeaveReview?.(appointment.id)}
                className="bg-blue-100 hover:bg-blue-200 text-gray-700 border-blue-200 px-4 py-2 rounded-lg min-w-[120px]"
              >
                <Star className="w-4 h-4 mr-2" />
                تقييم الطبيب
              </Button>
            </>
          )}

          {isCancelled && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onReschedule?.(appointment.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg min-w-[120px]"
            >
              حجز موعد جديد
            </Button>
          )}
        </div>

        {/* Right Section - Doctor Info and Appointment Details */}
        <div className="text-right flex flex-col gap-2">
          {/* Doctor Info */}
          <div className="">
            <h3 className="font-semibold text-gray-900 text-lg">
              {appointment.doctorName}
            </h3>
            {/* <p className="text-sm text-gray-600">طبيب متخصص</p> */}
          </div>

          {/* Status Badge */}
          {/* <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
          >
            {getStatusText()}
          </span> */}

          {/* Appointment Details */}
          <div className="grid grid-cols-2 ">
            <div className="flex flex-row-reverse items-center justify-start space-x-2 text-sm text-gray-600 mx-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex flex-row-reverse items-center justify-start space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{appointment.time}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCard;
