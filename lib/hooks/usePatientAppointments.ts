import { useState, useCallback, useEffect } from "react";
import {
  getPatientAppointments,
  cancelAppointment,
  getMedicalHistory,
  GetAppointmentsParams,
  PatientAppointmentResponse,
  MedicalHistoryResponse,
} from "@/lib/api/services";
import { toast } from "react-hot-toast";

interface UsePatientAppointmentsProps {
  initialFilters?: GetAppointmentsParams;
}

export const usePatientAppointments = ({
  initialFilters,
}: UsePatientAppointmentsProps = {}) => {
  const [appointments, setAppointments] = useState<
    PatientAppointmentResponse[]
  >([]);
  const [medicalHistory, setMedicalHistory] =
    useState<MedicalHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GetAppointmentsParams | undefined>(
    initialFilters
  );

  const fetchAppointments = useCallback(
    async (params?: GetAppointmentsParams) => {
      setLoading(true);
      setError(null);

      try {
        console.log("🔄 Fetching appointments...", { params });
        const data = await getPatientAppointments(params);
        console.log("✅ Appointments fetched successfully:", data);
        setAppointments(data);
        setError(null); // Clear any previous errors
        return data;
      } catch (error: unknown) {
        console.error("❌ HOOK ERROR - Failed to fetch appointments:", error);
        console.error("❌ HOOK ERROR type:", typeof error);
        console.error(
          "❌ HOOK ERROR stringified:",
          JSON.stringify(error, null, 2)
        );
        let errorMessage = "فشل في تحميل المواعيد";

        if (error instanceof Error) {
          // Check if it's a network error or API not found
          if (
            error.message.includes("404") ||
            error.message.includes("Network Error")
          ) {
            errorMessage = "الخادم غير متاح حالياً. يرجى المحاولة لاحقاً";
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
        // Don't show toast for network errors in development
        const errorObj = error as { message?: string };
        if (!errorObj?.message?.includes("404")) {
          toast.error(errorMessage);
        }
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchMedicalHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMedicalHistory();
      setMedicalHistory(data);
      return data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل في تحميل التاريخ الطبي";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelAppointmentById = useCallback(async (appointmentId: string) => {
    setLoading(true);

    try {
      const result = await cancelAppointment(appointmentId);

      if (result.success) {
        toast.success("تم إلغاء الموعد بنجاح");

        // Update local state by removing the cancelled appointment
        setAppointments((prev) =>
          prev.filter((app) => app._id !== appointmentId)
        );

        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل في إلغاء الموعد";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters: GetAppointmentsParams) => {
      setFilters(newFilters);
      fetchAppointments(newFilters);
    },
    [fetchAppointments]
  );

  const refreshAppointments = useCallback(() => {
    fetchAppointments(filters);
  }, [fetchAppointments, filters]);

  // Initial fetch
  useEffect(() => {
    fetchAppointments(filters);
  }, [fetchAppointments, filters]);

  return {
    appointments,
    medicalHistory,
    loading,
    error,
    filters,
    fetchAppointments,
    fetchMedicalHistory,
    cancelAppointmentById,
    updateFilters,
    refreshAppointments,
  };
};
