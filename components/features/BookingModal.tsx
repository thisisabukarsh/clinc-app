"use client";

import React from "react";
import { Doctor } from "@/types";
import Modal from "@/components/ui/Modal";
import { AppointmentBooking } from "./AppointmentBooking";

interface BookingDetails {
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
  price: number;
  clinic: string;
  location: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onBookingConfirm?: (bookingDetails: BookingDetails) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onBookingConfirm,
}) => {
  if (!doctor) return null;

  const handleBookingConfirm = (bookingDetails: BookingDetails) => {
    if (onBookingConfirm) {
      onBookingConfirm(bookingDetails);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="max-h-[90vh] overflow-y-auto"
    >
      <AppointmentBooking
        doctor={doctor}
        onBookingConfirm={handleBookingConfirm}
        onCancel={onClose}
        showHeader={true}
        showCancelButton={true}
      />
    </Modal>
  );
};

export default BookingModal;
