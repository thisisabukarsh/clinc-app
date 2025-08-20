import { useState, useCallback } from "react";
import {
  searchDoctors as searchDoctorsAPI,
  DoctorSearchParams,
  APIDoctor,
} from "@/lib/api/services";

interface UseDoctorSearchReturn {
  doctors: APIDoctor[];
  isLoading: boolean;
  error: string | null;
  searchDoctors: (params: DoctorSearchParams) => Promise<void>;
  clearResults: () => void;
}

export const useDoctorSearch = (): UseDoctorSearchReturn => {
  const [doctors, setDoctors] = useState<APIDoctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDoctors = useCallback(async (params: DoctorSearchParams) => {
    setIsLoading(true);
    setError(null);

    console.log("🔍 Searching doctors with params:", params); // Debug log

    try {
      const doctors = await searchDoctorsAPI(params);
      console.log("✅ Search response:", doctors); // Debug log
      console.log("📊 Response structure:", {
        dataType: Array.isArray(doctors) ? "array" : typeof doctors,
        dataLength: Array.isArray(doctors) ? doctors.length : "N/A",
      });

      setDoctors(doctors);
      console.log(`📊 Found ${doctors.length} doctors`); // Debug log
    } catch (err) {
      console.error("❌ Search error:", err); // Debug log
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setDoctors([]);
    setError(null);
  }, []);

  return {
    doctors,
    isLoading,
    error,
    searchDoctors,
    clearResults,
  };
};
