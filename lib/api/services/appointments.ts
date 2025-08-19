import { ApiHelper } from "../client";

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

/**
 * Get doctor's schedule for a specific date
 */
export const getDoctorSchedule = async (
  doctorId: string,
  date: string
): Promise<DoctorScheduleResponse> => {
  try {
    const response = await ApiHelper.get<DoctorScheduleResponse>(
      `/api/patient/doctors/${doctorId}/schedule`,
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
      "/api/patient/appointments/book",
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
