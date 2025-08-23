import React from "react";
import Image from "next/image";

interface MedicalSpecialty {
  id: string;
  name: string;
  nameAr: string;
  iconUrl: string;
  slug: string;
}

interface MedicalSpecialtyCardProps {
  specialty: MedicalSpecialty;
  onClick?: (specialty: MedicalSpecialty) => void;
  className?: string;
}

export const MedicalSpecialtyCard: React.FC<MedicalSpecialtyCardProps> = ({
  specialty,
  onClick,
  className = "",
}) => {
  const handleClick = () => {
    onClick?.(specialty);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon Container */}
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          {specialty.iconUrl.startsWith("http") ||
          specialty.iconUrl.startsWith("/") ? (
            <div className="relative w-10 h-10">
              <Image
                src={specialty.iconUrl}
                alt={specialty.name}
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="text-3xl">{specialty.iconUrl}</div>
          )}
        </div>

        {/* Specialty Name */}
        <h3 className="text-gray-800 font-semibold text-sm leading-tight">
          {specialty.nameAr}
        </h3>
      </div>
    </div>
  );
};
