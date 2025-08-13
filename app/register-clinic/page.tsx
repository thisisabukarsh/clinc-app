"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ClinicRegistrationForm } from "@/components/features/ClinicRegistrationForm";

interface ClinicRegistrationData {
  doctorName: string;
  clinicName: string;
  email: string;
  password: string;
  specialization: string;
  consultationFee: number;
  currency: string;
  clinicAddress: string;
  doctorPhoto: File | null;
  clinicPhoto: File | null;
}

export default function RegisterClinicPage() {
  const handleFormSubmit = (formData: ClinicRegistrationData) => {
    console.log("Clinic registration submitted:", formData);
    // TODO: Implement clinic registration logic
  };

  return (
    <MainLayout>
      <div className="min-h-screen mt-16 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              تسجيل العيادة
            </h1>
            <p className="text-lg text-gray-600">
              انضم إلى شبكة عياداتي وابدأ في استقبال المرضى
            </p>
          </div>

          {/* Registration Form */}
          <ClinicRegistrationForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </MainLayout>
  );
}
