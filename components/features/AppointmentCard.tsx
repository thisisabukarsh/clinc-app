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
  canCancel?: boolean;
  className?: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewMedicalFile,
  onReschedule,
  onCancel,
  onLeaveReview,
  onEdit,
  canCancel = true,
  className = "",
}) => {
  const isUpcoming = appointment.status === "upcoming";
  const isCompleted = appointment.status === "completed";
  const isCancelled = appointment.status === "cancelled";

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
              {canCancel ? (
                <Button
                  onClick={() => onCancel?.(appointment.id)}
                  variant="outline"
                  size="sm"
                  className="bg-blue-100 hover:bg-blue-200 text-gray-700 border-blue-200 px-4 py-2 rounded-lg min-w-[120px]"
                >
                  إلغاء
                </Button>
              ) : (
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="bg-gray-100 text-gray-400 border-gray-200 px-4 py-2 rounded-lg min-w-[120px] cursor-not-allowed"
                  >
                    إلغاء
                  </Button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    لا يمكن الإلغاء قبل أقل من 24 ساعة
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              )}
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
