"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SearchBar from "@/components/features/SearchBar";
import DoctorCard from "@/components/features/DoctorCard";
import { mockDoctors } from "@/lib/mockData";
import { Doctor } from "@/types";

export default function DoctorsPage() {
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(mockDoctors);
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string, specialty: string, location: string) => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      let filtered = doctors;

      // Filter by search query
      if (query) {
        filtered = filtered.filter(
          (doctor) =>
            doctor.name.toLowerCase().includes(query.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(query.toLowerCase()) ||
            doctor.clinic.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Filter by specialty
      if (specialty && specialty !== "اسنان") {
        filtered = filtered.filter((doctor) => doctor.specialty === specialty);
      }

      // Filter by location
      if (location && location !== "عمان") {
        filtered = filtered.filter((doctor) => doctor.location === location);
      }

      setFilteredDoctors(filtered);
      setLoading(false);
    }, 500);
  };

  const handleBookAppointment = (doctorId: string) => {
    // TODO: Navigate to booking page or open booking modal
    console.log("Booking appointment for doctor:", doctorId);
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <section className="bg-white shadow-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              ابحث عن طبيب
            </h1>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} className="max-w-4xl mx-auto" />
          </div>
        </section>

        {/* Results Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              النتائج ({filteredDoctors.length} طبيب)
            </h2>

            {/* Sort Options */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-sm text-gray-600">ترتيب حسب:</span>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>التقييم الأعلى</option>
                <option>السعر الأقل</option>
                <option>السعر الأعلى</option>
                <option>الأقرب</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">جاري البحث...</p>
            </div>
          )}

          {/* Doctors Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onBookAppointment={handleBookAppointment}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                لم يتم العثور على نتائج
              </h3>
              <p className="text-gray-600">
                جرب تغيير معايير البحث أو البحث بكلمات مختلفة
              </p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
