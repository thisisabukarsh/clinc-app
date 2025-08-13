"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { topRatedDoctors, clinicImages } from "@/lib/mockData";
import { DoctorProfileHeader } from "@/components/doctor-page";
import { AppointmentBooking, ClinicImageSlider } from "@/components/features";
import Button from "@/components/ui/Button";
import BookingModal from "@/components/features/BookingModal";
import MainLayout from "@/components/layout/MainLayout";

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id as string;
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Find the doctor by ID
  const doctor = topRatedDoctors.find((d) => d.id === doctorId);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Doctor not found
          </h1>
          <p className="text-gray-600">
            The doctor you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const handleBookAppointment = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const handleBookingConfirm = (bookingDetails: any) => {
    console.log("Booking confirmed:", bookingDetails);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 mt-16">
        {/* Hero Section with Doctor Info */}
        <div className="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex lg:flex-row flex-col gap-16 justify-between w-full">
              <div className="flex flex-col gap-8 w-full lg:w-1/2">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Doctor Image */}
                  <div className="lg:col-span-1 flex justify-center">
                    <div className="w-64 h-64 bg-gray-200 rounded-3xl flex items-center justify-center overflow-hidden">
                      {doctor.image ? (
                        <Image
                          src={doctor.image}
                          alt={doctor.name}
                          width={256}
                          height={256}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-6xl">👨‍⚕️</span>
                      )}
                    </div>
                  </div>
                  {/* Doctor Info */}
                  <DoctorProfileHeader doctor={doctor} />
                </div>

                {/* Combined Doctor Information */}
                <div className=" w-full">
                  <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
                    <BookOpen className="w-6 h-6 text-black ml-3 mt-1" />
                    نبذة عن الطبيب
                  </h2>

                  {/* Flowing Paragraph Style */}
                  <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                    <p>{doctor.about}</p>

                    <p>
                      <span className="font-semibold ">المؤهلات العلمية:</span>{" "}
                      {doctor.education}
                    </p>

                    <p>
                      <span className="font-semibold ">الخبرة:</span>{" "}
                      {doctor.experience}
                    </p>

                    <p>
                      <span className="font-semibold ">الموقع:</span>{" "}
                      {doctor.clinic} - {doctor.location}
                    </p>

                    <p>
                      <span className="font-semibold ">ساعات العمل:</span>{" "}
                      {doctor.availability}، ومدة الاستشارة{" "}
                      {doctor.consultationTime}
                    </p>

                    <p>
                      <span className="font-semibold ">اللغات:</span> يتحدث
                      الطبيب {doctor.languages.join(" و ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Clinic Images Slider */}
              <div className="lg:w-1/2 ">
                {/* Book Appointment Button */}
                {/* <div className="text-center mt-8">
                  <Button
                    onClick={handleBookAppointment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
                    variant="primary"
                  >
                    حجز موعد
                  </Button>
                </div> */}
                <AppointmentBooking
                  doctor={doctor}
                  onBookingConfirm={handleBookingConfirm}
                  onCancel={handleCloseBookingModal}
                  showHeader={true}
                  showCancelButton={false}
                  className="my-custom-styles"
                />
              </div>
            </div>
            <div className="mt-16">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                صور العيادة
              </h3>
              <ClinicImageSlider
                images={clinicImages}
                autoPlay={true}
                autoPlayInterval={4000}
                showArrows={true}
                showDots={true}
                showCaptions={true}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {/* <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          doctor={doctor}
        /> */}
      </div>
    </MainLayout>
  );
}
