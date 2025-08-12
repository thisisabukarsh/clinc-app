import React from "react";
import { Star, Stethoscope, MapPin, DollarSign } from "lucide-react";
import { Doctor } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface DoctorProfileHeaderProps {
  doctor: Doctor;
  className?: string;
}

export const DoctorProfileHeader: React.FC<DoctorProfileHeaderProps> = ({
  doctor,
  className = "",
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-5 h-5 text-yellow-400 fill-current"
        />
      );
    }

    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-5 h-5 text-yellow-400 fill-current"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className={`text-right ${className}`}>
      {/* Doctor's Name */}
      <h1 className="text-3xl font-bold text-[#0C1541] mb-4">{doctor.name}</h1>

      {/* Rating with Stars */}
      <div className="flex flex-row-reverse items-center justify-end mb-6">
        <span className="text-lg text-gray-700 mr-3">{doctor.rating}</span>
        <div className="flex items-center">{renderStars(doctor.rating)}</div>
      </div>

      {/* Specialty with Stethoscope Icon */}
      <div className="flex flex-row-reverse items-center justify-end mb-4">
        <span className="text-lg text-gray-600 mr-3">{doctor.specialty}</span>
        <Stethoscope className="w-5 h-5 text-gray-800" />
      </div>

      {/* Clinic and Location with Pin Icon */}
      <div className="flex flex-row-reverse items-center justify-end mb-4">
        <span className="text-lg text-gray-600 mr-3">
          {doctor.clinic} - {doctor.location}
        </span>
        <MapPin className="w-5 h-5 text-gray-800" />
      </div>

      {/* Consultation Fee with Money Icon */}
      <div className="flex flex-row-reverse items-center justify-end">
        <span className="text-lg text-gray-600 mr-3">
          {formatCurrency(doctor.price, doctor.currency)}
        </span>
        <DollarSign className="w-5 h-5 text-gray-800" />
      </div>
    </div>
  );
};
