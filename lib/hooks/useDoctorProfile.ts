/**
 * Custom hook for managing doctor profile data
 */

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  getDoctorProfile,
  updateDoctorProfile,
  DoctorProfileResponse,
  UpdateDoctorProfileRequest,
} from "@/lib/api/services/doctors";

interface UseDoctorProfileReturn {
  profile: DoctorProfileResponse | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (
    profileData: UpdateDoctorProfileRequest,
    doctorPhoto?: File
  ) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useDoctorProfile = (): UseDoctorProfileReturn => {
  const [profile, setProfile] = useState<DoctorProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await getDoctorProfile();
      setProfile(profileData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (profileData: UpdateDoctorProfileRequest, doctorPhoto?: File) => {
      try {
        setUpdating(true);
        setError(null);
        const updatedProfile = await updateDoctorProfile(
          profileData,
          doctorPhoto
        );
        setProfile(updatedProfile);
        toast.success("تم تحديث الملف الشخصي بنجاح");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update profile";
        setError(errorMessage);
        toast.error(errorMessage);
        throw error;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updating,
    fetchProfile,
    updateProfile,
    refreshProfile,
  };
};
