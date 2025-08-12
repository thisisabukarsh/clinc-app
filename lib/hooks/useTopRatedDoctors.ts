import { useState, useMemo } from "react";
import { Doctor } from "@/types";

interface UseTopRatedDoctorsProps {
  doctors: Doctor[];
  itemsPerPage?: number;
}

interface UseTopRatedDoctorsReturn {
  currentDoctors: Doctor[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useTopRatedDoctors = ({
  doctors,
  itemsPerPage = 4,
}: UseTopRatedDoctorsProps): UseTopRatedDoctorsReturn => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = useMemo(() => {
    return Math.ceil(doctors.length / itemsPerPage);
  }, [doctors.length, itemsPerPage]);

  const currentDoctors = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return doctors.slice(startIndex, endIndex);
  }, [doctors, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  return {
    currentDoctors,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  };
};
