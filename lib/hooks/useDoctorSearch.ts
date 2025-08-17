import { useState, useCallback } from "react";
import DoctorService from "@/lib/api/services/doctors";
import { DoctorSearchParams, APIDoctor } from "@/types";

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
      const response = await DoctorService.searchDoctors(params);
      console.log("✅ Search response:", response); // Debug log
      console.log("📊 Response structure:", {
        hasSuccess: "success" in response,
        successValue: response.success,
        hasData: "data" in response,
        dataType: Array.isArray(response.data) ? "array" : typeof response.data,
        dataLength: Array.isArray(response.data) ? response.data.length : "N/A",
      });

      if (response.success) {
        setDoctors(response.data);
        console.log(`📊 Found ${response.data.length} doctors`); // Debug log
      } else {
        console.log("❌ Response success is false:", response);
        setError("Failed to fetch doctors");
        setDoctors([]);
      }
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
