import ApiHelper from "../client";
import { DoctorSearchParams, DoctorSearchResponse, APIDoctor } from "@/types";

// Mock data for testing when backend is not available
const MOCK_DOCTORS: APIDoctor[] = [
  {
    _id: "doctor_001",
    userId: {
      _id: "doc_user_001",
      name: "د. أحمد العلي",
      email: "dr.ahmed.ali@example.com",
      phone: "+962796789012",
    },
    specialty: "Cardiology",
    location: "Amman",
    fee: 120,
    photo: "/uploads/doctors/doctor-1.jpg",
    clinic: {
      name: "مركز القلب المتقدم",
      address: "شارع الملكة رانيا، عمان",
      phone: "+962796789012",
      description: "مركز متخصص في أمراض القلب والأوعية الدموية",
      images: [
        "/uploads/clinics/clinic-1-1.jpg",
        "/uploads/clinics/clinic-1-2.jpg",
      ],
      status: "approved",
    },
  },
  {
    _id: "doctor_002",
    userId: {
      _id: "doc_user_002",
      name: "د. فاطمة الزهراء",
      email: "dr.fatima.zahra@example.com",
      phone: "+962797890123",
    },
    specialty: "Dentistry",
    location: "Amman",
    fee: 80,
    photo: "/uploads/doctors/doctor-2.jpg",
    clinic: {
      name: "عيادة الأسنان المتميزة",
      address: "شارع الجامعة، عمان",
      phone: "+962797890123",
      description: "عيادة متخصصة في طب الأسنان التجميلي والعلاجي",
      images: [
        "/uploads/clinics/clinic-2-1.jpg",
        "/uploads/clinics/clinic-2-2.jpg",
      ],
      status: "approved",
    },
  },
  {
    _id: "doctor_003",
    userId: {
      _id: "doc_user_003",
      name: "د. محمد السيد",
      email: "dr.mohamed.sayed@example.com",
      phone: "+962798901234",
    },
    specialty: "Ophthalmology",
    location: "Zarqa",
    fee: 100,
    photo: "/uploads/doctors/doctor-3.jpg",
    clinic: {
      name: "مركز العيون المتطور",
      address: "شارع الأمير محمد، الزرقاء",
      phone: "+962798901234",
      description: "مركز متخصص في جراحة العيون وتصحيح البصر",
      images: [
        "/uploads/clinics/clinic-3-1.jpg",
        "/uploads/clinics/clinic-3-2.jpg",
      ],
      status: "approved",
    },
  },
];

/**
 * Doctor Service
 * Handles all doctor-related API calls
 */
class DoctorService {
  private static readonly BASE_PATH = "/patient/doctors";

  /**
   * Search for doctors with filters
   */
  static async searchDoctors(
    params: DoctorSearchParams
  ): Promise<DoctorSearchResponse> {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.specialty) queryParams.append("specialty", params.specialty);
      if (params.location) queryParams.append("location", params.location);
      if (params.clinicType)
        queryParams.append("clinicType", params.clinicType);
      if (params.name) queryParams.append("name", params.name);

      const queryString = queryParams.toString();
      const url = `${this.BASE_PATH}/search${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("🌐 Making API call to:", url); // Debug log
      console.log("📋 Search params:", params); // Debug log

      const response = await ApiHelper.get<DoctorSearchResponse>(url);
      console.log("📡 API response:", response); // Debug log

      // Extract the actual data from ApiResponse wrapper
      const responseData = response.data;
      console.log("📦 Extracted response data:", responseData);

      // Check if response has the expected structure
      if (responseData && responseData.success) {
        console.log("✅ Response has success: true, returning data");

        // Check if the data array contains valid doctor objects
        if (responseData.data && Array.isArray(responseData.data)) {
          const hasValidDoctors = responseData.data.some(
            (doctor) => doctor && (doctor.userId?.name || doctor.clinic?.name) // Valid if has either userId.name OR clinic.name
          );

          if (!hasValidDoctors) {
            console.warn(
              "⚠️ Backend returned empty objects, falling back to mock data"
            );
            return this.getMockDoctors(params);
          }
        }

        return responseData;
      } else if (responseData && Array.isArray(responseData)) {
        console.log(
          "✅ Response has direct array, wrapping in success response"
        );

        // Check if the array contains valid doctor objects
        const hasValidDoctors = responseData.some(
          (doctor) => doctor && (doctor.userId?.name || doctor.clinic?.name) // Valid if has either userId.name OR clinic.name
        );

        if (!hasValidDoctors) {
          console.warn(
            "⚠️ Backend returned empty objects, falling back to mock data"
          );
          return this.getMockDoctors(params);
        }

        return { success: true, data: responseData };
      } else {
        console.log("❌ Unexpected response structure:", responseData);
        return { success: true, data: [] };
      }
    } catch (error) {
      console.error("❌ Search doctors error:", error);
      console.error("🔍 Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        params,
      });

      // Fallback to mock data for testing
      console.log("🔄 Falling back to mock data for testing");
      return this.getMockDoctors(params);
    }
  }

  /**
   * Get mock doctors for testing when backend is not available
   */
  private static getMockDoctors(
    params: DoctorSearchParams
  ): DoctorSearchResponse {
    let filteredDoctors = [...MOCK_DOCTORS];

    // Filter by specialty
    if (params.specialty) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.specialty === params.specialty
      );
    }

    // Filter by location
    if (params.location) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.location === params.location
      );
    }

    // Filter by name
    if (params.name) {
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.userId?.name?.toLowerCase().includes(params.name!.toLowerCase())
      );
    }

    console.log(
      `🎭 Mock data: Found ${filteredDoctors.length} doctors after filtering`
    );
    return {
      success: true,
      data: filteredDoctors,
    };
  }
}

export default DoctorService;
