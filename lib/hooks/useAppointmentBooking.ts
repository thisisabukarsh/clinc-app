import { useState, useCallback } from "react";
import {
  getDoctorSchedule,
  bookAppointment,
  transformScheduleToSlots,
  AppointmentSlot,
} from "@/lib/api/services";
import { toast } from "react-hot-toast";

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
        const errorMessage =
          error instanceof Error
            ? error.message
            : "فشل في تحميل المواعيد المتاحة";
        setError(errorMessage);
        setTimeSlots([]);
        toast.error(errorMessage);
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

        const response = await bookAppointment({
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
