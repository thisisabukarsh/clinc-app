import React from "react";
import { TopRatedDoctorCard } from "@/components/features/TopRatedDoctorCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CarouselDots } from "@/components/ui/CarouselDots";
import { useTopRatedDoctors } from "@/lib/hooks/useTopRatedDoctors";
import { Doctor } from "@/types";

interface TopRatedDoctorsSectionProps {
  doctors: Doctor[];
  onDoctorClick?: (doctor: Doctor) => void;
  onBookAppointment?: (doctorId: string) => void;
  className?: string;
}

const TopRatedDoctorsSection: React.FC<TopRatedDoctorsSectionProps> = ({
  doctors,
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
      </div>
    </section>
  );
};

export default TopRatedDoctorsSection;
