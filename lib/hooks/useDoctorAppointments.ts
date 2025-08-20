/**
 * Custom hook for managing doctor appointments
 */

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  getDoctorAppointments,
  DoctorAppointment,
  DoctorAppointmentsParams,
} from "@/lib/api/services/doctors";

interface UseDoctorAppointmentsReturn {
  appointments: DoctorAppointment[];
  loading: boolean;
  error: string | null;
  filters: DoctorAppointmentsParams;
  totalAppointments: number;
  todayAppointments: DoctorAppointment[];
  upcomingAppointments: DoctorAppointment[];
  fetchAppointments: (params?: DoctorAppointmentsParams) => Promise<void>;
  updateFilters: (newFilters: Partial<DoctorAppointmentsParams>) => void;
  refreshAppointments: () => Promise<void>;
}

export const useDoctorAppointments = (): UseDoctorAppointmentsReturn => {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DoctorAppointmentsParams>({});

  const fetchAppointments = useCallback(
    async (params?: DoctorAppointmentsParams) => {
      try {
        setLoading(true);
        setError(null);
        const appointmentsData = await getDoctorAppointments(params || filters);
        setAppointments(appointmentsData);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch appointments";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<DoctorAppointmentsParams>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const refreshAppointments = useCallback(async () => {
    await fetchAppointments();
  }, [fetchAppointments]);

  // Computed values
  const totalAppointments = appointments.length;

  const todayAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    return appointmentDate > today;
  });

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    filters,
    totalAppointments,
    todayAppointments,
    upcomingAppointments,
    fetchAppointments,
    updateFilters,
    refreshAppointments,
  };
};
