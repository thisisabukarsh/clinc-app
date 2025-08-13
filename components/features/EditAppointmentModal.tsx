"use client";

import React from "react";
import { Appointment } from "@/types";
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

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onConfirm?: (bookingDetails: BookingDetails) => void;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onConfirm,
}) => {
  if (!appointment) return null;

  // Create a mock doctor object from the appointment for the AppointmentBooking component
  const mockDoctor = {
    id: appointment.doctorId || appointment.id,
    name: appointment.doctorName,
    specialty: "طبيب متخصص",
    price: 0, // Will be overridden by appointment data
    currency: "JOD",
    clinic: "العيادة",
    location: "الموقع",
    rating: 0,
    experience: "",
    education: "",
    languages: ["العربية"],
    availability: "",
    consultationTime: "",
    about: "",
    image: "",
    certifications: [],
  };

  const handleBookingConfirm = (bookingDetails: BookingDetails) => {
    if (onConfirm) {
      onConfirm(bookingDetails);
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
        doctor={mockDoctor}
        onBookingConfirm={handleBookingConfirm}
        onCancel={onClose}
        showHeader={true}
        showCancelButton={true}
        className="border-0 shadow-none"
      />
    </Modal>
  );
};

export default EditAppointmentModal;
