import { useState, useCallback } from "react";
import {
  getDoctorSchedule,
  bookPatientAppointment,
  transformScheduleToSlots,
} from "@/lib/api/services";
import { toast } from "react-hot-toast";

interface AppointmentSlot {
  time: string;
  available: boolean;
  price: number;
}

interface UseAppointmentBookingProps {
  doctorId: string;
  doctorPrice: number;
  onSuccess?: (bookingDetails: unknown) => void;
}

export const useAppointmentBooking = ({
  doctorId,
  doctorPrice,
  onSuccess,
}: UseAppointmentBookingProps) => {
  const [timeSlots, setTimeSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(
    async (date: Date) => {
      setLoading(true);
      setError(null);

      try {
        const formattedDate = date.toISOString().split("T")[0];
        const schedule = await getDoctorSchedule(doctorId, formattedDate);
        const slots = transformScheduleToSlots(schedule, doctorPrice);
        setTimeSlots(slots);
      } catch (error: unknown) {
        console.error("Error fetching doctor schedule:", error);

        let errorMessage = "فشل في تحميل المواعيد المتاحة";

        if (error instanceof Error) {
          // Handle specific error types
          if (
            error.message.includes("404") ||
            error.message.includes("Doctor not found")
          ) {
            errorMessage = "الطبيب غير موجود. يرجى اختيار طبيب آخر.";
          } else if (
            error.message.includes("400") ||
            error.message.includes("Invalid")
          ) {
            errorMessage = "خطأ في البيانات المرسلة. يرجى المحاولة مرة أخرى.";
          } else if (
            error.message.includes("500") ||
            error.message.includes("Internal server")
          ) {
            errorMessage = "خطأ في الخادم. يرجى المحاولة لاحقاً.";
          } else if (
            error.message.includes("Network") ||
            error.message.includes("ECONNREFUSED")
          ) {
            errorMessage = "مشكلة في الاتصال. تأكد من الاتصال بالإنترنت.";
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
        setTimeSlots([]);

        // Don't show toast for 404 errors as they're handled in the UI
        if (!errorMessage.includes("غير موجود")) {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [doctorId, doctorPrice]
  );

  const bookAppointmentSlot = useCallback(
    async (appointmentDate: Date, timeSlot: string) => {
      setLoading(true);

      try {
        const formattedDate = appointmentDate.toISOString().split("T")[0];

        const response = await bookPatientAppointment({
          doctorId,
          appointmentDate: formattedDate,
          timeSlot,
        });

        toast.success("تم حجز الموعد بنجاح!");

        if (onSuccess) {
          onSuccess(response);
        }

        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "فشل في حجز الموعد";
        toast.error(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [doctorId, onSuccess]
  );

  const retryFetchSchedule = useCallback(
    (date: Date) => {
      fetchSchedule(date);
    },
    [fetchSchedule]
  );

  return {
    timeSlots,
    loading,
    error,
    fetchSchedule,
    bookAppointmentSlot,
    retryFetchSchedule,
  };
};
