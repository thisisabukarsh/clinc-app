"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import MedicalSpecialtiesSection from "@/components/home/MedicalSpecialtiesSection";
import TopRatedDoctorsSection from "@/components/home/TopRatedDoctorsSection";
import WhyMyClinicsSection from "@/components/home/WhyMyClinicsSection";
import { MedicalSpecialty, Doctor } from "@/types";
import { useRouter } from "next/navigation";
import { useAllDoctors } from "@/lib/hooks";
import { medicalSpecialties as mockSpecialties } from "@/lib/mockData";

export default function HomePage() {
  const router = useRouter();
  const { doctors, loading, error } = useAllDoctors();

  // Extract real medical specialties from doctor data, with mock data fallback
  const realMedicalSpecialties: MedicalSpecialty[] = React.useMemo(() => {
    // If we have real doctor data, use it
    if (doctors && doctors.length > 0) {
      // Get unique specialties from real doctor data
      const uniqueSpecialties = [
        ...new Set(doctors.map((doctor) => doctor.specialty)),
      ];

      // Map to MedicalSpecialty format with proper icons
      return uniqueSpecialties.map((specialty, index) => {
        // Map specialty names to appropriate icons
        const getIconForSpecialty = (spec: string): string => {
          const specLower = spec.toLowerCase();
          if (specLower.includes("قلب") || specLower.includes("cardiology"))
            return "🫀";
          if (specLower.includes("جلد") || specLower.includes("dermatology"))
            return "🩹";
          if (specLower.includes("اسنان") || specLower.includes("dentistry"))
            return "🦷";
          if (specLower.includes("اطفال") || specLower.includes("pediatrics"))
            return "👶";
          if (specLower.includes("نساء") || specLower.includes("gynecology"))
            return "👩‍⚕️";
          if (specLower.includes("عظام") || specLower.includes("orthopedics"))
            return "🦴";
          if (specLower.includes("عيون") || specLower.includes("ophthalmology"))
            return "👁️";
          if (specLower.includes("اذن") || specLower.includes("ent"))
            return "👂";
          if (specLower.includes("باطنية") || specLower.includes("internal"))
            return "🫁";
          if (specLower.includes("عصبية") || specLower.includes("neurology"))
            return "🧠";
          return "👨‍⚕️"; // Default icon
        };

        return {
          id: `specialty-${index}`,
          name: specialty,
          nameAr: specialty, // Use Arabic name as is
          iconUrl: getIconForSpecialty(specialty),
          slug: specialty.toLowerCase().replace(/\s+/g, "-"),
        };
      });
    }

    // Fallback to mock data if no real data available
    return mockSpecialties;
  }, [doctors]);

  const handleSpecialtyClick = (specialty: MedicalSpecialty) => {
    console.log("Specialty clicked:", specialty);
    // Navigate to doctors page with specialty filter
    router.push(`/doctors?specialty=${encodeURIComponent(specialty.name)}`);
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
        specialties={realMedicalSpecialties}
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
