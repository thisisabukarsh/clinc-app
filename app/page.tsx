"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import MedicalSpecialtiesSection from "@/components/home/MedicalSpecialtiesSection";
import TopRatedDoctorsSection from "@/components/home/TopRatedDoctorsSection";
import WhyMyClinicsSection from "@/components/home/WhyMyClinicsSection";
import { medicalSpecialties } from "@/lib/mockData";
import { MedicalSpecialty, Doctor } from "@/types";
import { useRouter } from "next/navigation";
import { useAllDoctors } from "@/lib/hooks";

export default function HomePage() {
  const router = useRouter();
  const { doctors, loading, error } = useAllDoctors();

  const handleSpecialtyClick = (specialty: MedicalSpecialty) => {
    console.log("Specialty clicked:", specialty);
    // Handle specialty selection - could navigate to specialty page
    // router.push(`/specialties/${specialty.slug}`);
  };

  const handleDoctorClick = (doctor: Doctor) => {
    // console.log("Doctor clicked:", doctor);
    // Handle doctor selection - could navigate to doctor details page
    router.push(`/doctors/${doctor.id}`);
  };

  const handleBookAppointment = (doctorId: string) => {
    // console.log("Booking appointment for doctor:", doctorId);
    // Handle booking - could open booking modal or navigate to booking page
    router.push(`/doctors/${doctorId}`);
  };

  return (
    <MainLayout>
      <HeroSection />
      <MedicalSpecialtiesSection
        specialties={medicalSpecialties}
        onSpecialtyClick={handleSpecialtyClick}
      />
      <TopRatedDoctorsSection
        doctors={doctors}
        loading={loading}
        error={error}
        onDoctorClick={handleDoctorClick}
        onBookAppointment={handleBookAppointment}
      />
      <WhyMyClinicsSection />
    </MainLayout>
  );
}
