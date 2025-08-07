import { useState, useMemo } from "react";
import { MedicalSpecialty } from "@/types";

interface UseMedicalSpecialtiesProps {
  specialties: MedicalSpecialty[];
  itemsPerPage?: number;
}

interface UseMedicalSpecialtiesReturn {
  currentSpecialties: MedicalSpecialty[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useMedicalSpecialties = ({
  specialties,
  itemsPerPage = 5,
}: UseMedicalSpecialtiesProps): UseMedicalSpecialtiesReturn => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = useMemo(() => {
    return Math.ceil(specialties.length / itemsPerPage);
  }, [specialties.length, itemsPerPage]);

  const currentSpecialties = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return specialties.slice(startIndex, endIndex);
  }, [specialties, currentPage, itemsPerPage]);

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
    currentSpecialties,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  };
};
