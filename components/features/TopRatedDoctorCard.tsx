import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { Doctor } from "@/types";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import DoctorImage from "@/components/ui/DoctorImage";

interface TopRatedDoctorCardProps {
  doctor: Doctor;
  onClick?: (doctor: Doctor) => void;
  onBookAppointment?: (doctorId: string) => void;
  className?: string;
}

export const TopRatedDoctorCard: React.FC<TopRatedDoctorCardProps> = ({
  doctor,
  onClick,
  onBookAppointment,
  className = "",
}) => {
  const handleCardClick = () => {
    onClick?.(doctor);
  };

  const handleBookClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    onBookAppointment?.(doctor.id);
  };

  return (
    <div
      className={`relative bg-blue-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Doctor Image - Full view top section */}
      <div className="relative h-72 bg-blue-50">
        {/* Speckled background effect */}
        {/* <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white via-transparent to-white"></div>
        </div> */}

        {/* Doctor Image - Full view, no border, no radius */}
        <div className="absolute inset-0 flex items-center justify-center -bottom-6">
          <div className="relative w-full h-full ">
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                // Fallback to default doctor image on error
                const target = e.target as HTMLImageElement;
                target.src = "/doctor.png";
              }}
            />
          </div>
        </div>
      </div>

      {/* Doctor Details - Smaller white section overlapping the image */}
      <div className="relative bg-white rounded-t-3xl -mt-6 p-4">
        {/* Doctor Name - Top right */}
        <h3 className="font-bold text-gray-800 text-lg text-right mb-2">
          {doctor.name}
        </h3>

        {/* Rating - Right aligned below name */}

        {/* Specialty and Price - Left aligned */}
        <div className="flex justify-start items-center mb-4 text-xs text-gray-500 space-x-2">
          <div className="flex justify-center items-center">
            <span className="text-sm text-gray-600 ml-2 font-medium">
              {doctor.rating}
            </span>
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </div>
          <span>{doctor.specialty}</span>
          <span className=" text-gray-300">•</span>
          <span>{formatCurrency(doctor.price, doctor.currency)}</span>
        </div>

        {/* Book Appointment Button - Full width at bottom */}
        <Button
          onClick={handleBookClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm"
          variant="primary"
        >
          حجز موعد
        </Button>
      </div>
    </div>
  );
};
