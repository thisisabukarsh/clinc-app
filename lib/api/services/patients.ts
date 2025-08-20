/**
 * Patient API Services
 * Handles all patient-related API calls including doctor search and appointments
 */

import { ApiHelper } from "../client";
import { ApiResponse } from "@/types/api";

// Search and Doctor Types
export interface DoctorSearchParams extends Record<string, unknown> {
  specialty?: string;
  location?: string;
  clinicType?: string;
  name?: string;
}

export interface APIDoctor {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  specialty: string;
  location: string;
  fee: number;
  photo?: string;
  clinic?: {
    name: string;
    address: string;
    phone: string;
    description: string;
    images: string[];
    status: "pending" | "approved" | "rejected";
  };
}

export interface DoctorScheduleSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DoctorSchedule {
  _id: string;
  doctorId: string;
  dayOfWeek: number; // 0-6 (Sunday=0)
  slots: DoctorScheduleSlot[];
  isAvailable: boolean;
}

// Appointment Types
export interface BookAppointmentRequest {
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
}

export interface AppointmentResponse {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
}

export interface PatientAppointment {
  _id: string;
  patientId: string;
  appointmentDate: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
  doctorId: {
    _id: string;
    userId: {
      name: string;
      email: string;
    };
    specialty: string;
    location: string;
    fee: number;
    clinic?: {
      name: string;
      address: string;
    };
  };
}

// Medical History Types
export interface MedicalHistoryRecord {
  _id: string;
  patientId: string;
  appointmentId: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
  visitDate: string;
  doctorId: {
    userId: {
      name: string;
    };
    specialty: string;
  };
}

/**
 * Search for doctors
 */
export const searchDoctors = async (
  params: DoctorSearchParams = {}
): Promise<APIDoctor[]> => {
  try {
    const response = await ApiHelper.get<APIDoctor[]>(
      "/patient/doctors/search",
      params
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to search doctors");
    }

    return response.data || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while searching doctors");
  }
};

/**
 * Get doctor details by ID
 */
export const getDoctorDetails = async (
  doctorId: string
): Promise<APIDoctor> => {
  try {
    const response = await ApiHelper.get<APIDoctor>(
      `/patient/doctors/${doctorId}`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch doctor details");
    }

    if (!response.data) {
      throw new Error("Doctor not found");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while fetching doctor details"
    );
  }
};

/**
 * Get doctor schedule
 */
export const getDoctorSchedule = async (
  doctorId: string,
  date?: string
): Promise<{
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
}> => {
  try {
    const params = date ? { date } : {};
    const response = await ApiHelper.get<{
      date: string;
      availableSlots: string[];
      bookedSlots: string[];
    }>(`/patient/doctors/${doctorId}/schedule`, params);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch doctor schedule");
    }

    return response.data || { date: "", availableSlots: [], bookedSlots: [] };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while fetching doctor schedule"
    );
  }
};

/**
 * Book an appointment
 */
export const bookAppointment = async (
  appointmentData: BookAppointmentRequest
): Promise<AppointmentResponse> => {
  try {
    const response = await ApiHelper.post<AppointmentResponse>(
      "/patient/appointments/book",
      appointmentData
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to book appointment");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while booking appointment");
  }
};

/**
 * Get patient's appointments
 */
export const getMyAppointments = async (): Promise<PatientAppointment[]> => {
  try {
    const response = await ApiHelper.get<PatientAppointment[]>(
      "/patient/appointments"
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch appointments");
    }

    return response.data || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching appointments");
  }
};

/**
 * Cancel an appointment
 */
export const cancelAppointment = async (
  appointmentId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await ApiHelper.put<null>(
      `/patient/appointments/${appointmentId}/cancel`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to cancel appointment");
    }

    return {
      success: true,
      message: response.message || "Appointment cancelled successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while cancelling appointment"
    );
  }
};

/**
 * Update an existing appointment
 */
export const updateAppointment = async (
  appointmentId: string,
  appointmentData: {
    doctorId: string;
    appointmentDate: string;
    timeSlot: string;
  }
): Promise<PatientAppointment> => {
  try {
    const response = await ApiHelper.put<PatientAppointment>(
      `/patient/appointments/${appointmentId}/update`,
      appointmentData
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to update appointment");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while updating appointment");
  }
};

/**
 * Get patient's medical history
 */
export const getMedicalHistory = async (): Promise<{
  medicalRecords: MedicalHistoryRecord[];
  reports: unknown[];
}> => {
  try {
    const response = await ApiHelper.get<{
      medicalRecords: MedicalHistoryRecord[];
      reports: unknown[];
    }>("/patient/medical-history");

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch medical history");
    }

    return response.data || { medicalRecords: [], reports: [] };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while fetching medical history"
    );
  }
};

// Patient Service object for easier imports
const PatientService = {
  searchDoctors,
  getDoctorSchedule,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  updateAppointment,
  getMedicalHistory,
};

export default PatientService;
