/**
 * Custom hook for managing doctor statistics
 */

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  getDoctorStatistics,
  DoctorStatistics,
  StatisticsParams,
} from "@/lib/api/services/doctors";

interface UseDoctorStatisticsReturn {
  statistics: DoctorStatistics | null;
  loading: boolean;
  error: string | null;
  dateRange: StatisticsParams;
  fetchStatistics: (params: StatisticsParams) => Promise<void>;
  updateDateRange: (newRange: StatisticsParams) => void;
  refreshStatistics: () => Promise<void>;
}

export const useDoctorStatistics = (
  initialDateRange?: StatisticsParams
): UseDoctorStatisticsReturn => {
  // Default to current month if no initial range provided
  const getDefaultDateRange = (): StatisticsParams => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      startDate: startOfMonth.toISOString().split("T")[0],
      endDate: endOfMonth.toISOString().split("T")[0],
    };
  };

  const [statistics, setStatistics] = useState<DoctorStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<StatisticsParams>(
    initialDateRange || getDefaultDateRange()
  );

  const fetchStatistics = useCallback(async (params: StatisticsParams) => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await getDoctorStatistics(params);
      setStatistics(statsData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch statistics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDateRange = useCallback((newRange: StatisticsParams) => {
    setDateRange(newRange);
  }, []);

  const refreshStatistics = useCallback(async () => {
    await fetchStatistics(dateRange);
  }, [fetchStatistics, dateRange]);

  useEffect(() => {
    fetchStatistics(dateRange);
  }, [fetchStatistics, dateRange]);

  return {
    statistics,
    loading,
    error,
    dateRange,
    fetchStatistics,
    updateDateRange,
    refreshStatistics,
  };
};
