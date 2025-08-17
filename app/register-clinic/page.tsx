"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { ClinicRegistrationForm } from "@/components/features/ClinicRegistrationForm";
import AuthService from "@/lib/api/services/auth";

interface ClinicRegistrationData {
  doctorName: string;
  clinicName: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  consultationFee: number;
  currency: string;
  clinicAddress: string;
  doctorPhoto: File | null;
  clinicPhoto: File | null;
}

export default function RegisterClinicPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFormSubmit = async (formData: ClinicRegistrationData) => {
    setIsLoading(true);
    setError("");

    try {
      // Map form data to API request
      const apiRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.doctorName,
        phone: formData.phone,
        role: "doctor" as const,
        address: formData.clinicAddress,
        specialty: formData.specialization,
        location: formData.clinicAddress,
        fee: formData.consultationFee,
      };

      const response = await AuthService.register(apiRequest);

      if (response.success && response.userId) {
        // Redirect to OTP verification page with userId
        router.push(`/verify-otp?userId=${response.userId}`);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "حدث خطأ في تسجيل العيادة. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
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

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Registration Form */}
          <ClinicRegistrationForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
}
