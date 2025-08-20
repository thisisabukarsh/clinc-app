import { ApiHelper } from "../client";
import { Appointment } from "@/types";
import type { PatientAppointment } from "./patients";

// Types for appointment scheduling
export interface DoctorScheduleResponse {
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
}

export interface BookAppointmentRequest {
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
}

export interface BookAppointmentResponse {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  amount: number;
  createdAt: string;
}

export interface AppointmentSlot {
  time: string;
  available: boolean;
  price: number;
}

// New types for patient appointments
export interface PatientAppointmentResponse {
  _id: string;
  doctorId: {
    _id: string;
    userId: {
      name: string;
      email: string;
      phone: string;
    };
    specialty: string;
    location: string;
    fee: number;
  };
  appointmentDate: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
  createdAt: string;
}

export interface GetAppointmentsParams extends Record<string, unknown> {
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  startDate?: string;
  endDate?: string;
}

export interface CancelAppointmentResponse {
  success: boolean;
  message: string;
}

export interface MedicalRecord {
  _id: string;
  appointmentId: {
    _id: string;
    doctorId: {
      userId: {
        name: string;
      };
    };
    appointmentDate: string;
  };
  diagnosis: string;
  prescription: string;
  visitDate: string;
  createdAt: string;
}

export interface MedicalReport {
  _id: string;
  reportType: string;
  description: string;
  fileUrl: string;
  uploadedBy: {
    name: string;
  };
  uploadDate: string;
}

export interface MedicalHistoryResponse {
  medicalRecords: MedicalRecord[];
  reports: MedicalReport[];
}

/**
 * Get doctor's schedule for a specific date
 */
export const getDoctorSchedule = async (
  doctorId: string,
  date: string
): Promise<DoctorScheduleResponse> => {
  try {
    const response = await ApiHelper.get<DoctorScheduleResponse>(
      `/patient/doctors/${doctorId}/schedule`,
      { date }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch doctor schedule");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching doctor schedule:", error);
    throw error;
  }
};

/**
 * Book an appointment with a doctor
 */
export const bookAppointment = async (
  bookingData: BookAppointmentRequest
): Promise<BookAppointmentResponse> => {
  try {
    const response = await ApiHelper.post<BookAppointmentResponse>(
      "/patient/appointments/book",
      bookingData
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to book appointment");
    }

    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

/**
 * Get patient's appointments with optional filters
 */
export const getPatientAppointments = async (
  params?: GetAppointmentsParams
): Promise<PatientAppointmentResponse[]> => {
  try {
    const response = await ApiHelper.get<PatientAppointmentResponse[]>(
      "/patient/appointments",
      params
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch appointments");
    }

    // The response.data should be an array of appointments
    return response.data || [];
  } catch (error: unknown) {
    // Enhanced error handling for development
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response: { status: number } };
      console.error(
        "🚨 Axios error response status:",
        axiosError.response?.status
      );
      if (axiosError.response?.status === 404) {
        throw new Error(
          "API endpoint not found. Make sure the backend server is running on port 5000."
        );
      }
    }

    if (
      error &&
      typeof error === "object" &&
      ("code" in error || "message" in error)
    ) {
      const networkError = error as { code?: string; message?: string };
      if (
        networkError.code === "ECONNREFUSED" ||
        networkError.message?.includes("Network Error")
      ) {
        throw new Error(
          "Cannot connect to server. Please ensure the backend is running."
        );
      }
    }

    throw error;
  }
};

/**
 * Cancel an appointment
 */
export const cancelAppointment = async (
  appointmentId: string
): Promise<CancelAppointmentResponse> => {
  try {
    const response = await ApiHelper.put<CancelAppointmentResponse>(
      `/patient/appointments/${appointmentId}/cancel`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to cancel appointment");
    }

    return {
      success: response.success,
      message: response.message || "Appointment cancelled successfully",
    };
  } catch (error) {
    console.error("Error canceling appointment:", error);
    throw error;
  }
};

/**
 * Get patient's medical history
 */
export const getMedicalHistory = async (): Promise<MedicalHistoryResponse> => {
  try {
    const response = await ApiHelper.get<MedicalHistoryResponse>(
      "/patient/medical-history"
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch medical history");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching medical history:", error);
    throw error;
  }
};

/**
 * Transform API schedule data to component format
 */
export const transformScheduleToSlots = (
  schedule: DoctorScheduleResponse,
  basePrice: number
): AppointmentSlot[] => {
  const allSlots = [
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  return allSlots.map((time) => ({
    time,
    available: schedule.availableSlots.includes(time),
    price: basePrice,
  }));
};

/**
 * Transform API appointment data to component format
 */
export const transformAppointmentData = (
  apiAppointment: PatientAppointmentResponse | PatientAppointment
): Appointment => {
  // Map API status to component status
  const mapStatus = (
    status: string
  ): "upcoming" | "completed" | "cancelled" => {
    switch (status) {
      case "pending":
      case "confirmed":
        return "upcoming";
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return "upcoming";
    }
  };

  return {
    id: apiAppointment._id,
    doctorId: apiAppointment.doctorId._id,
    doctorName: apiAppointment.doctorId.userId.name,
    date: apiAppointment.appointmentDate,
    time: apiAppointment.timeSlot,
    status: mapStatus(apiAppointment.status),
  };
};
