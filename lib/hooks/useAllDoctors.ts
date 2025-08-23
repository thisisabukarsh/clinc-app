/**
 * Hook for fetching all doctors for public display
 */

import { useState, useEffect } from "react";
import { Doctor } from "@/types";
import { getAllDoctors } from "@/lib/api/services";

interface UseAllDoctorsReturn {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAllDoctors = (): UseAllDoctorsReturn => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching all doctors...");
      const fetchedDoctors = await getAllDoctors();

      console.log("✅ Doctors fetched successfully:", fetchedDoctors.length);
      setDoctors(fetchedDoctors);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch doctors";
      console.error("❌ Error fetching doctors:", errorMessage);
      setError(errorMessage);
      // Keep empty array on error to prevent UI crashes
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors,
    loading,
    error,
    refetch: fetchDoctors,
  };
};
