import React from "react";
import { MedicalSpecialtyCard } from "@/components/features/MedicalSpecialtyCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CarouselDots } from "@/components/ui/CarouselDots";
import { useMedicalSpecialties } from "@/lib/hooks/useMedicalSpecialties";
import { MedicalSpecialty } from "@/types";

interface MedicalSpecialtiesSectionProps {
  specialties: MedicalSpecialty[];
  onSpecialtyClick?: (specialty: MedicalSpecialty) => void;
  className?: string;
}

const MedicalSpecialtiesSection: React.FC<MedicalSpecialtiesSectionProps> = ({
  specialties,
  onSpecialtyClick,
  className = "",
}) => {
  const { currentSpecialties, currentPage, totalPages, goToPage } =
    useMedicalSpecialties({ specialties, itemsPerPage: 5 });

  return (
    <section className={`py-16 bg-white mt-56 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeader
          title="التخصصات الطبية المتوفرة"
          subtitle="نوفر مجموعة شاملة من التخصصات الطبية لتلبية جميع احتياجاتك الصحية"
          titleClassName="text-3xl font-bold text-gray-800 mb-4"
          subtitleClassName="text-lg text-gray-600 mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {currentSpecialties.map((specialty) => (
            <MedicalSpecialtyCard
              key={specialty.id}
              specialty={specialty}
              onClick={onSpecialtyClick}
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

export default MedicalSpecialtiesSection;
