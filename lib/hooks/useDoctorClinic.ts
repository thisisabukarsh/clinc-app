/**
 * Custom hook for managing doctor clinic data
 */

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  getClinicStatus,
  updateClinicInfo,
  submitClinicForApproval,
  ClinicInfo,
  UpdateClinicRequest,
} from "@/lib/api/services/doctors";

interface UseDoctorClinicReturn {
  clinicInfo: ClinicInfo | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  submitting: boolean;
  fetchClinicStatus: () => Promise<void>;
  updateClinic: (
    clinicData: UpdateClinicRequest,
    clinicImages?: File[]
  ) => Promise<void>;
  submitForApproval: (
    clinicData: UpdateClinicRequest,
    clinicImages?: File[]
  ) => Promise<void>;
  refreshClinicStatus: () => Promise<void>;
}

export const useDoctorClinic = (): UseDoctorClinicReturn => {
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClinicStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const clinicData = await getClinicStatus();
      setClinicInfo(clinicData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch clinic status";
      setError(errorMessage);
      // Don't show toast for 404 errors (clinic not found)
      if (!errorMessage.includes("404")) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClinic = useCallback(
    async (clinicData: UpdateClinicRequest, clinicImages?: File[]) => {
      try {
        setUpdating(true);
        setError(null);
        const updatedClinic = await updateClinicInfo(clinicData, clinicImages);
        setClinicInfo(updatedClinic);
        toast.success("تم تحديث معلومات العيادة بنجاح");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update clinic";
        setError(errorMessage);
        toast.error(errorMessage);
        throw error;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  const submitForApproval = useCallback(
    async (clinicData: UpdateClinicRequest, clinicImages?: File[]) => {
      try {
        setSubmitting(true);
        setError(null);
        const submittedClinic = await submitClinicForApproval(
          clinicData,
          clinicImages
        );
        setClinicInfo(submittedClinic);
        toast.success(
          "تم إرسال العيادة للمراجعة بنجاح. سيتم إعلامك عند الموافقة"
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to submit clinic";
        setError(errorMessage);
        toast.error(errorMessage);
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const refreshClinicStatus = useCallback(async () => {
    await fetchClinicStatus();
  }, [fetchClinicStatus]);

  useEffect(() => {
    fetchClinicStatus();
  }, [fetchClinicStatus]);

  return {
    clinicInfo,
    loading,
    error,
    updating,
    submitting,
    fetchClinicStatus,
    updateClinic,
    submitForApproval,
    refreshClinicStatus,
  };
};
