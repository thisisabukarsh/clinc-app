"use client";

import React, { useState } from "react";
import { FormField } from "./FormField";
import { ImageUploadSection } from "./ImageUploadSection";
import Button from "@/components/ui/Button";

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

interface ClinicRegistrationFormProps {
  onSubmit: (data: ClinicRegistrationData) => void;
  className?: string;
  isLoading?: boolean;
}

export const ClinicRegistrationForm: React.FC<ClinicRegistrationFormProps> = ({
  onSubmit,
  className = "",
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ClinicRegistrationData>({
    doctorName: "",
    clinicName: "",
    email: "",
    password: "",
    phone: "",
    specialization: "طب اسنان",
    consultationFee: 20,
    currency: "دينار اردني",
    clinicAddress: "",
    doctorPhoto: null,
    clinicPhoto: null,
  });

  const [errors, setErrors] = useState<Partial<ClinicRegistrationData>>({});

  const specializations = [
    "طب اسنان",
    "طب عام",
    "طب أطفال",
    "طب نساء وتوليد",
    "طب قلب",
    "طب عيون",
    "طب جلدية",
    "طب عظام",
    "طب نفسي",
    "طب أورام",
  ];

  const currencies = [
    "دينار اردني",
    "دولار أمريكي",
    "يورو",
    "جنيه مصري",
    "ريال سعودي",
  ];

  const handleInputChange = (
    field: keyof ClinicRegistrationData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (
    field: "doctorPhoto" | "clinicPhoto",
    file: File
  ) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ClinicRegistrationData> = {};

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = "اسم الطبيب مطلوب";
    }

    if (!formData.clinicName.trim()) {
      newErrors.clinicName = "اسم العيادة مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^07\d{8}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 07";
    }

    if (!formData.clinicAddress.trim()) {
      newErrors.clinicAddress = "عنوان العيادة مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}
    >
      {/* Form Fields */}
      <div className="space-y-6 mb-8">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="إسم الطبيب"
            type="text"
            value={formData.doctorName}
            onChange={(value) => handleInputChange("doctorName", value)}
            error={errors.doctorName}
            placeholder="أدخل اسم الطبيب"
            required
          />
          <FormField
            label="إسم العيادة"
            type="text"
            value={formData.clinicName}
            onChange={(value) => handleInputChange("clinicName", value)}
            error={errors.clinicName}
            placeholder="أدخل اسم العيادة"
            required
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="البريد الالكتروني"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            error={errors.email}
            placeholder="أدخل البريد الإلكتروني"
            required
          />
          <FormField
            label="كلمة المرور"
            type="password"
            value={formData.password}
            onChange={(value) => handleInputChange("password", value)}
            error={errors.password}
            placeholder="أدخل كلمة المرور"
            required
          />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="رقم الهاتف"
            type="text"
            value={formData.phone}
            onChange={(value) => handleInputChange("phone", value)}
            error={errors.phone}
            placeholder="07xxxxxxxx"
            required
          />
          <FormField
            label="الاختصاص"
            type="select"
            value={formData.specialization}
            onChange={(value) => handleInputChange("specialization", value)}
            options={specializations}
            required
          />
        </div>

        {/* Fourth Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 text-right">
              سعر الكشفية
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.consultationFee}
                onChange={(e) =>
                  handleInputChange(
                    "consultationFee",
                    parseInt(e.target.value) || 0
                  )
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                placeholder="20"
                min="0"
                required
              />
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Fifth Row - Full Width */}
        <div>
          <FormField
            label="عنوان العيادة"
            type="text"
            value={formData.clinicAddress}
            onChange={(value) => handleInputChange("clinicAddress", value)}
            error={errors.clinicAddress}
            placeholder="أدخل عنوان العيادة الكامل"
            required
            fullWidth
          />
        </div>
      </div>

      {/* Image Upload Sections */}
      <div className="space-y-6 mb-8">
        <ImageUploadSection
          label="صورة الطبيب"
          onFileUpload={(file) => handleFileUpload("doctorPhoto", file)}
          acceptedFileTypes="image/*"
          placeholderText="قم بتنزيل الصورة هنا"
        />
        <ImageUploadSection
          label="صورة العيادة"
          onFileUpload={(file) => handleFileUpload("clinicPhoto", file)}
          acceptedFileTypes="image/*"
          placeholderText="قم بتنزيل الصورة هنا"
        />
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <Button
          type="submit"
          variant="primary"
          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg text-lg font-semibold min-w-[200px]"
          disabled={isLoading}
        >
          {isLoading ? "جاري التسجيل..." : "تسجيل العيادة"}
        </Button>
      </div>
    </form>
  );
};
