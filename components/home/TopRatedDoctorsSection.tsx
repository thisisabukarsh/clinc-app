import React from "react";
import { TopRatedDoctorCard } from "@/components/features/TopRatedDoctorCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CarouselDots } from "@/components/ui/CarouselDots";
import { useTopRatedDoctors } from "@/lib/hooks/useTopRatedDoctors";
import { Doctor } from "@/types";

interface TopRatedDoctorsSectionProps {
  doctors: Doctor[];
  loading?: boolean;
  error?: string | null;
  onDoctorClick?: (doctor: Doctor) => void;
  onBookAppointment?: (doctorId: string) => void;
  className?: string;
}

const TopRatedDoctorsSection: React.FC<TopRatedDoctorsSectionProps> = ({
  doctors,
  loading = false,
  error = null,
  onDoctorClick,
  onBookAppointment,
  className = "",
}) => {
  const { currentDoctors, currentPage, totalPages, goToPage } =
    useTopRatedDoctors({ doctors, itemsPerPage: 4 });

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeader
          title="الأطباء الأعلى تقييماً"
          subtitle="اختر من مجموعة من الأطباء الذين حصلوا على أعلى التقييمات من الزوار"
          titleClassName="text-3xl font-bold text-gray-800 mb-4"
          subtitleClassName="text-lg text-gray-600 mb-12"
        />

        {loading ? (
          // Loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border shadow-sm p-6 animate-pulse"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              فشل في تحميل الأطباء
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              المحاولة مرة أخرى
            </button>
          </div>
        ) : currentDoctors.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا يوجد أطباء متاحون حالياً
            </h3>
            <p className="text-gray-600">يرجى المحاولة لاحقاً</p>
          </div>
        ) : (
          // Normal state with data
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {currentDoctors.map((doctor) => (
                <TopRatedDoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onClick={onDoctorClick}
                  onBookAppointment={onBookAppointment}
                />
              ))}
            </div>

            <CarouselDots
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default TopRatedDoctorsSection;
