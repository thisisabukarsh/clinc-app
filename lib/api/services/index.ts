// Export all API services
export { default as AuthService } from "./auth";

// Export patient services functions
export {
  searchDoctors,
  getDoctorDetails,
  getDoctorSchedule,
  getMyAppointments as getPatientAppointments, // Use the correct function name
  bookAppointment as bookPatientAppointment,
  cancelAppointment as cancelPatientAppointment,
  updateAppointment as updatePatientAppointment,
  getMedicalHistory,
} from "./patients";

// Export appointment services (non-conflicting ones)
export {
  transformScheduleToSlots,
  transformAppointmentData,
} from "./appointments";

// Export doctor services
export * from "./doctors";

// Explicitly export patient-specific types to avoid conflicts
export type {
  DoctorSearchParams,
  APIDoctor,
  PatientAppointment,
  MedicalHistoryRecord,
} from "./patients";

// You can add more services here as you develop them
// export { default as ClinicService } from './clinic';
// export { default as UserService } from './user';
