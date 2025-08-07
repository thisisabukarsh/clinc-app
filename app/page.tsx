"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/sections/HeroSection";
import MedicalSpecialtiesSection from "@/components/sections/MedicalSpecialtiesSection";
import { medicalSpecialties } from "@/lib/mockData";
import { MedicalSpecialty } from "@/types";

export default function HomePage() {
  const handleSpecialtyClick = (specialty: MedicalSpecialty) => {
    console.log("Specialty clicked:", specialty);
    // Handle specialty selection - could navigate to specialty page
    // router.push(`/specialties/${specialty.slug}`);
  };

  return (
    <MainLayout>
      <HeroSection />
      <MedicalSpecialtiesSection
        specialties={medicalSpecialties}
        onSpecialtyClick={handleSpecialtyClick}
      />
    </MainLayout>
  );
}
