// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "patient" | "doctor" | "admin";
  address?: string;
  dateOfBirth?: string;
  // Additional fields for doctors
  specialty?: string;
  location?: string;
  fee?: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "patient" | "doctor" | "admin";
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    isEmailVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  userId: string;
  emailSent?: boolean;
  // Development mode fields
  otp?: string;
  devMessage?: string;
}

export interface VerifyEmailOTPRequest {
  userId: string;
  otp: string;
}

export interface VerifyEmailOTPResponse {
  success: boolean;
  message: string;
}

export interface ResendEmailOTPRequest {
  userId: string;
}

export interface ResendEmailOTPResponse {
  success: boolean;
  message: string;
  emailSent?: boolean;
  // Development mode fields
  otp?: string;
  devMessage?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  userId: string;
  // Development mode fields
  otp?: string;
  devMessage?: string;
}

export interface VerifyPasswordResetOTPRequest {
  userId: string;
  otp: string;
}

export interface VerifyPasswordResetOTPResponse {
  success: boolean;
  message: string;
  canResetPassword: boolean;
}

export interface ResetPasswordRequest {
  userId: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Generic API Types
export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, any>;
}

export interface UpdateRequest {
  id: string;
  data: Record<string, any>;
}

export interface DeleteRequest {
  id: string;
}
