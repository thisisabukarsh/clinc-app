// Doctor related types
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  price: number;
  currency: string;
  image: string;
  clinic: string;
  location: string;
  biography?: string;
  experience?: string;
  education?: string;
}

// Appointment related types
export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  medicalFile?: MedicalFile;
}

// Medical file types
export interface MedicalFile {
  id: string;
  appointmentId: string;
  diagnosis: string;
  notes: string;
  prescription: Prescription[];
  createdAt: string;
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "patient" | "doctor" | "admin";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  appointments: Appointment[];
}

// Clinic related types
export interface Clinic {
  id: string;
  name: string;
  location: string;
  doctors: Doctor[];
  photos: string[];
  description?: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

// Search and filter types
export interface SearchFilters {
  specialty?: string;
  location?: string;
  rating?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

// API Doctor Search Types
export interface DoctorSearchParams {
  specialty?: string;
  location?: string;
  clinicType?: string;
  name?: string;
}

export interface DoctorUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ClinicInfo {
  name: string;
  address: string;
  phone: string;
  description: string;
  images: string[];
  status: "approved" | "pending" | "rejected";
}

export interface APIDoctor {
  _id: string;
  userId: DoctorUser | null; // Can be null based on backend data
  specialty: string;
  location: string;
  fee: number;
  photo?: string; // Optional since some doctors might not have photos
  clinic?: ClinicInfo; // Optional since some doctors might not have clinic info
  // Additional properties that backend returns
  rating?: number;
  biography?: string;
  experience?: string;
  education?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorSearchResponse {
  success: boolean;
  data: APIDoctor[];
}

// Dashboard types
export interface DashboardAppointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  status: "completed" | "upcoming" | "cancelled";
  specialty: string;
  notes: string;
}

export interface DashboardStats {
  totalPatients: number;
  upcomingAppointments: number;
  todayAppointments: number;
}

// UI Component types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface MedicalSpecialty {
  id: string;
  name: string;
  nameAr: string;
  iconUrl: string;
  slug: string;
}

export interface MedicalSpecialtiesSectionProps {
  specialties: MedicalSpecialty[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}
