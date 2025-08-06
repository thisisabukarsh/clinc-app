"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Doctor } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import BookingModal from "./BookingModal";

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctorId: string) => void;
  className?: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBookAppointment,
  className = "",
}) => {
  const router = useRouter();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleCardClick = () => {
    router.push(`/doctors/${doctor.id}`);
  };

  const handleBookClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = (bookingDetails: {
    doctorId: string;
    doctorName: string;
    date: Date;
    time: string;
    price: number;
    clinic: string;
    location: string;
  }) => {
    console.log("Booking confirmed:", bookingDetails);
    onBookAppointment(doctor.id);
    alert(
      `تم حجز موعد مع ${
        bookingDetails.doctorName
      } في ${bookingDetails.date.toLocaleDateString("ar")} الساعة ${
        bookingDetails.time
      }`
    );
  };

  return (
    <Card
      className={`p-6 text-center hover:shadow-medium transition-shadow cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Doctor Image */}
      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
        {doctor.image ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-2xl">👨‍⚕️</span>
        )}
      </div>

      {/* Doctor Name */}
      <h3 className="font-semibold text-gray-900 mb-2 text-lg">
        {doctor.name}
      </h3>

      {/* Rating */}
      <div className="flex justify-center items-center mb-2">
        {renderStars(doctor.rating)}
        <span className="text-sm text-gray-600 mr-2">{doctor.rating}</span>
      </div>

      {/* Specialty and Price */}
      <p className="text-sm text-gray-600 mb-4">
        {doctor.specialty} - {formatCurrency(doctor.price, doctor.currency)}
      </p>

      {/* Clinic Location */}
      <p className="text-xs text-gray-500 mb-4">
        {doctor.clinic} - {doctor.location}
      </p>

      {/* Book Appointment Button */}
      <Button onClick={handleBookClick} className="w-full" variant="primary">
        حجز موعد
      </Button>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        doctor={doctor}
        onBookingConfirm={handleBookingConfirm}
      />
    </Card>
  );
};

export default DoctorCard;
