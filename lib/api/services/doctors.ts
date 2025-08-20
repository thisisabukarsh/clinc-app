/**
 * Doctor API Services
 * Handles all doctor-related API calls for the dashboard
 */

import { ApiHelper } from "../client";

// Doctor Profile Types
export interface DoctorProfileResponse {
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
    submittedAt: string;
    reviewedAt?: string;
    rejectionReason?: string;
  };
}

export interface UpdateDoctorProfileRequest {
  specialty: string;
  location: string;
  fee: number;
}

// Clinic Types
export interface ClinicInfo {
  name: string;
  address: string;
  phone: string;
  description: string;
  images?: string[];
  status?: "pending" | "approved" | "rejected";
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface UpdateClinicRequest {
  name: string;
  address: string;
  phone: string;
  description: string;
}

// Schedule Types
export interface ScheduleSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DoctorSchedule {
  _id?: string;
  doctorId: string;
  dayOfWeek: number; // 0-6 (Sunday=0)
  slots: ScheduleSlot[];
  isAvailable: boolean;
}

export interface UpdateScheduleRequest {
  dayOfWeek: number;
  slots: ScheduleSlot[];
  isAvailable: boolean;
}

// Appointment Types
export interface DoctorAppointment {
  _id: string;
  patientId: {
    userId: {
      name: string;
      email: string;
      phone?: string;
    };
    address?: string;
    dateOfBirth?: string;
  };
  appointmentDate: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
}

export interface DoctorAppointmentsParams extends Record<string, unknown> {
  date?: string;
  status?: string;
}

// Statistics Types
export interface DoctorStatistics {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
}

export interface StatisticsParams extends Record<string, unknown> {
  startDate: string;
  endDate: string;
}

// Medical Records Types
export interface MedicalRecordRequest {
  appointmentId: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
}

export interface MedicalRecordResponse {
  _id: string;
  patientId: string;
  appointmentId: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
  visitDate: string;
}

// Report Upload Types
export interface ReportUploadRequest {
  patientId: string;
  appointmentId?: string;
  reportType: string;
  description: string;
}

export interface ReportUploadResponse {
  _id: string;
  patientId: string;
  appointmentId?: string;
  reportType: string;
  description: string;
  fileUrl: string;
  uploadedBy: string;
  uploadDate: string;
}

/**
 * Get doctor profile
 */
export const getDoctorProfile = async (): Promise<DoctorProfileResponse> => {
  try {
    const response = await ApiHelper.get<DoctorProfileResponse>(
      "/doctor/profile"
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch doctor profile");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while fetching doctor profile"
    );
  }
};

/**
 * Update doctor profile
 */
export const updateDoctorProfile = async (
  profileData: UpdateDoctorProfileRequest,
  doctorPhoto?: File
): Promise<DoctorProfileResponse> => {
  try {
    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append("specialty", profileData.specialty);
    formData.append("location", profileData.location);
    formData.append("fee", profileData.fee.toString());

    if (doctorPhoto) {
      formData.append("doctorPhoto", doctorPhoto);
    }

    const response = await ApiHelper.putFormData<DoctorProfileResponse>(
      "/doctor/profile",
      formData
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to update doctor profile");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while updating doctor profile"
    );
  }
};

/**
 * Get clinic status
 */
export const getClinicStatus = async (): Promise<ClinicInfo> => {
  try {
    const response = await ApiHelper.get<ClinicInfo>("/doctor/clinic/status");

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch clinic status");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while fetching clinic status"
    );
  }
};

/**
 * Update clinic information
 */
export const updateClinicInfo = async (
  clinicData: UpdateClinicRequest,
  clinicImages?: File[]
): Promise<ClinicInfo> => {
  try {
    const formData = new FormData();
    formData.append("name", clinicData.name);
    formData.append("address", clinicData.address);
    formData.append("phone", clinicData.phone);
    formData.append("description", clinicData.description);

    if (clinicImages && clinicImages.length > 0) {
      clinicImages.forEach((image) => {
        formData.append("clinicImages", image);
      });
    }

    const response = await ApiHelper.putFormData<ClinicInfo>(
      "/doctor/clinic",
      formData
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.message || "Failed to update clinic information"
      );
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while updating clinic information"
    );
  }
};

/**
 * Submit clinic for approval
 */
export const submitClinicForApproval = async (
  clinicData: UpdateClinicRequest,
  clinicImages?: File[]
): Promise<ClinicInfo> => {
  try {
    const formData = new FormData();
    formData.append("name", clinicData.name);
    formData.append("address", clinicData.address);
    formData.append("phone", clinicData.phone);
    formData.append("description", clinicData.description);

    if (clinicImages && clinicImages.length > 0) {
      clinicImages.forEach((image) => {
        formData.append("clinicImages", image);
      });
    }

    const response = await ApiHelper.postFormData<ClinicInfo>(
      "/doctor/clinic/submit",
      formData
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.message || "Failed to submit clinic for approval"
      );
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while submitting clinic for approval"
    );
  }
};

/**
 * Get doctor appointments
 */
export const getDoctorAppointments = async (
  params?: DoctorAppointmentsParams
): Promise<DoctorAppointment[]> => {
  try {
    const response = await ApiHelper.get<DoctorAppointment[]>(
      "/doctor/appointments",
      params
    );

    if (!response.success) {
      throw new Error(
        response.message || "Failed to fetch doctor appointments"
      );
    }

    return response.data || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while fetching doctor appointments"
    );
  }
};

/**
 * Get doctor statistics
 */
export const getDoctorStatistics = async (
  params: StatisticsParams
): Promise<DoctorStatistics> => {
  try {
    const response = await ApiHelper.get<DoctorStatistics>(
      "/doctor/statistics",
      params
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch doctor statistics");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while fetching doctor statistics"
    );
  }
};

/**
 * Add medical record
 */
export const addMedicalRecord = async (
  recordData: MedicalRecordRequest
): Promise<MedicalRecordResponse> => {
  try {
    const response = await ApiHelper.post<MedicalRecordResponse>(
      "/doctor/medical-records",
      recordData
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to add medical record");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while adding medical record");
  }
};

/**
 * Upload patient report
 */
export const uploadPatientReport = async (
  reportData: ReportUploadRequest,
  reportFile: File
): Promise<ReportUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("patientId", reportData.patientId);
    if (reportData.appointmentId) {
      formData.append("appointmentId", reportData.appointmentId);
    }
    formData.append("reportType", reportData.reportType);
    formData.append("description", reportData.description);
    formData.append("medicalReport", reportFile);

    const response = await ApiHelper.postFormData<ReportUploadResponse>(
      "/doctor/reports/upload",
      formData
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to upload patient report");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while uploading patient report"
    );
  }
};

/**
 * Update doctor schedule
 */
export const updateDoctorSchedule = async (
  scheduleData: UpdateScheduleRequest
): Promise<DoctorSchedule> => {
  try {
    const response = await ApiHelper.post<DoctorSchedule>(
      "/doctor/schedule",
      scheduleData
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to update schedule");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while updating schedule");
  }
};
