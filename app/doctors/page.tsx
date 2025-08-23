"use client";

import React, { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { SearchSection } from "@/components/doctors/SearchSection";
import { TopRatedDoctorCard } from "@/components/features/TopRatedDoctorCard";
import { useRouter } from "next/navigation";
import { useDoctorSearch } from "@/lib/hooks/useDoctorSearch";
import { DoctorSearchParams, APIDoctor } from "@/lib/api/services";

export default function DoctorsPage() {
  const router = useRouter();
  const { doctors, isLoading, error, searchDoctors } = useDoctorSearch();

  // Load initial doctors on component mount
  useEffect(() => {
    searchDoctors({});
  }, [searchDoctors]);

  const handleSearch = (query: string, specialty: string, location: string) => {
    const params: DoctorSearchParams = {};

    if (query) params.name = query;
    if (specialty) params.specialty = specialty;
    if (location) params.location = location;

    console.log("Search params:", params); // Debug log
    searchDoctors(params);
  };

  const handleBookAppointment = (doctorId: string) => {
    router.push(`/doctors/${doctorId}`);
  };

  // Transform API doctor to match the component's expected format
  const transformDoctor = (apiDoctor: APIDoctor) => {
    // Debug: Log what we actually receive
    console.log("🔍 Transforming doctor:", apiDoctor);

    // Safety check: Ensure we have valid data
    if (!apiDoctor) {
      console.error("❌ Invalid doctor data:", apiDoctor);
      return null;
    }

    // Handle doctor image with proper fallback
    let doctorImage = "/doctor.png"; // Default fallback

    if (apiDoctor.photo) {
      // If photo path starts with /uploads, prepend the API base URL
      if (apiDoctor.photo.startsWith("/uploads")) {
        doctorImage = `https://threeiadti-be.onrender.com${apiDoctor.photo}`;
      } else if (apiDoctor.photo.startsWith("http")) {
        // If it's already a full URL, use it as is
        doctorImage = apiDoctor.photo;
      } else {
        // Otherwise, construct the full URL
        doctorImage = `https://threeiadti-be.onrender.com/uploads/doctors/${apiDoctor.photo}`;
      }
    }

    // Handle different data structures from backend
    let doctorName = "";
    let doctorSpecialty = "";
    let doctorFee = 0;
    let doctorLocation = "";
    let clinicName = "";

    // Structure 1: Has userId object
    if (apiDoctor.userId && apiDoctor.userId.name) {
      doctorName = apiDoctor.userId.name;
      doctorSpecialty = apiDoctor.specialty || "";
      doctorFee = apiDoctor.fee || 0;
      doctorLocation = apiDoctor.location || "";
      clinicName = apiDoctor.clinic?.name || "عيادة خاصة";
    }
    // Structure 2: Has clinic object but no userId
    else if (apiDoctor.clinic && apiDoctor.clinic.name) {
      doctorName = apiDoctor.userId?.name || "دكتور";
      doctorSpecialty = apiDoctor.specialty || "";
      doctorFee = apiDoctor.fee || 0;
      doctorLocation = apiDoctor.location || "";
      clinicName = apiDoctor.clinic.name;
    }
    // Invalid structure
    else {
      console.error("❌ Invalid doctor data structure:", apiDoctor);
      return null;
    }

    return {
      id: apiDoctor._id,
      name: doctorName,
      specialty: doctorSpecialty,
      rating: 4.5, // Default rating - TODO: Add rating system to backend
      price: doctorFee,
      currency: "JD", // Jordanian Dinar (consistent with homepage)
      image: doctorImage,
      clinic: clinicName,
      location: doctorLocation,
      biography: `Experienced ${doctorSpecialty} specialist providing quality healthcare.`,
      experience: "5+ years",
      education: "Medical Degree",
    };
  };

  const transformedDoctors = doctors
    .map(transformDoctor)
    .filter(
      (doctor): doctor is NonNullable<ReturnType<typeof transformDoctor>> =>
        doctor !== null
    ); // Remove null values

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen mt-16">
        {/* Header Section */}
        <SearchSection onSearch={handleSearch} />

        {/* Results Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              النتائج ({transformedDoctors.length} طبيب)
            </h2>

            {/* Sort Options */}
            {/* <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-sm text-gray-600"> ترتيب حسب : </span>
              &nbsp; &nbsp;
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>التقييم الأعلى</option>
                <option>السعر الأقل</option>
                <option>السعر الأعلى</option>
              </select>
            </div> */}
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                حدث خطأ في البحث
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">جاري البحث...</p>
            </div>
          )}

          {/* Doctors Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {transformedDoctors.map((doctor, index) => (
                <TopRatedDoctorCard
                  key={index}
                  doctor={doctor}
                  onClick={() => handleBookAppointment(doctor.id)}
                  onBookAppointment={handleBookAppointment}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && transformedDoctors.length === 0 && (
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
