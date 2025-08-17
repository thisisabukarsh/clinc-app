import ApiHelper from "../client";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegistrationResponse,
  VerifyEmailOTPRequest,
  VerifyEmailOTPResponse,
  ResendEmailOTPRequest,
  ResendEmailOTPResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ApiResponse,
} from "@/types/api";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  private static readonly BASE_PATH = "/auth";

  /**
   * Login user
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Since the response is not wrapped in ApiResponse, we get it directly
      const response = await ApiHelper.post<AuthResponse>(
        `${this.BASE_PATH}/login`,
        credentials
      );
      // The response.data contains the AuthResponse directly
      return response.data || (response as AuthResponse);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  static async register(
    userData: RegisterRequest
  ): Promise<RegistrationResponse> {
    try {
      const response = await ApiHelper.post<RegistrationResponse>(
        `${this.BASE_PATH}/register`,
        userData
      );
      return response.data || (response as RegistrationResponse);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Verify email OTP
   */
  static async verifyEmailOTP(
    data: VerifyEmailOTPRequest
  ): Promise<VerifyEmailOTPResponse> {
    try {
      const response = await ApiHelper.post<VerifyEmailOTPResponse>(
        `${this.BASE_PATH}/verify-email-otp`,
        data
      );
      return response.data || (response as VerifyEmailOTPResponse);
    } catch (error) {
      console.error("Verify email OTP error:", error);
      throw error;
    }
  }

  /**
   * Resend email OTP
   */
  static async resendEmailOTP(
    data: ResendEmailOTPRequest
  ): Promise<ResendEmailOTPResponse> {
    try {
      const response = await ApiHelper.post<ResendEmailOTPResponse>(
        `${this.BASE_PATH}/resend-email-otp`,
        data
      );
      return response.data || (response as ResendEmailOTPResponse);
    } catch (error) {
      console.error("Resend email OTP error:", error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await ApiHelper.post<null>(`${this.BASE_PATH}/logout`);
      return response;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(
    request: RefreshTokenRequest
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await ApiHelper.post<AuthResponse>(
        `${this.BASE_PATH}/refresh`,
        request
      );
      return response;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<ApiResponse<AuthResponse["user"]>> {
    try {
      const response = await ApiHelper.get<AuthResponse["user"]>(
        `${this.BASE_PATH}/profile`
      );
      return response;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    data: Partial<AuthResponse["user"]>
  ): Promise<ApiResponse<AuthResponse["user"]>> {
    try {
      const response = await ApiHelper.put<AuthResponse["user"]>(
        `${this.BASE_PATH}/profile`,
        data
      );
      return response;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  /**
   * Change password
   */
  static async changePassword(
    request: ChangePasswordRequest
  ): Promise<ApiResponse<null>> {
    try {
      const response = await ApiHelper.post<null>(
        `${this.BASE_PATH}/change-password`,
        request
      );
      return response;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  static async forgotPassword(
    request: ForgotPasswordRequest
  ): Promise<ApiResponse<null>> {
    try {
      const response = await ApiHelper.post<null>(
        `${this.BASE_PATH}/forgot-password`,
        request
      );
      return response;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ApiResponse<null>> {
    try {
      const response = await ApiHelper.post<null>(
        `${this.BASE_PATH}/reset-password`,
        request
      );
      return response;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<ApiResponse<null>> {
    try {
      const response = await ApiHelper.post<null>(
        `${this.BASE_PATH}/verify-email`,
        { token }
      );
      return response;
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  }

  /**
   * Resend email verification
   */
  static async resendEmailVerification(): Promise<ApiResponse<null>> {
    try {
      const response = await ApiHelper.post<null>(
        `${this.BASE_PATH}/resend-verification`
      );
      return response;
    } catch (error) {
      console.error("Resend verification error:", error);
      throw error;
    }
  }

  /**
   * Check if email exists
   */
  static async checkEmail(
    email: string
  ): Promise<ApiResponse<{ exists: boolean }>> {
    try {
      const response = await ApiHelper.get<{ exists: boolean }>(
        `${this.BASE_PATH}/check-email`,
        { email }
      );
      return response;
    } catch (error) {
      console.error("Check email error:", error);
      throw error;
    }
  }

  /**
   * Validate token
   */
  static async validateToken(): Promise<
    ApiResponse<{ valid: boolean; user?: AuthResponse["user"] }>
  > {
    try {
      const response = await ApiHelper.get<{
        valid: boolean;
        user?: AuthResponse["user"];
      }>(`${this.BASE_PATH}/validate-token`);
      return response;
    } catch (error) {
      console.error("Token validation error:", error);
      throw error;
    }
  }
}

export default AuthService;
