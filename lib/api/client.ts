import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosProgressEvent,
} from "axios";
import { ApiResponse, ApiError } from "@/types/api";
import toast from "react-hot-toast";

// Track last toast message to prevent spam
let lastToastTime = 0;
let lastToastMessage = "";

// Simple API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://threeiadti-be.onrender.com/api";

const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Debug log
console.log("🔧 Simple API Config:", {
  baseURL: API_BASE_URL,
  envVar: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Create axios instance
const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = "auth_token";

  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Simple request logging
    console.log(
      `🔄 REQUEST: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );

    // Skip token for authentication endpoints
    const isAuthEndpoint =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/forgot-password") ||
      config.url?.includes("/auth/verify-email-otp") ||
      config.url?.includes("/auth/resend-email-otp");

    if (!isAuthEndpoint) {
      const token = TokenManager.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add request timestamp for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          data: config.data,
          params: config.params,
          headers: config.headers,
          token: isAuthEndpoint
            ? "Not Required"
            : TokenManager.getToken()
            ? "Present"
            : "Missing",
          isAuthEndpoint,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config;

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `❌ API Error: ${originalRequest?.method?.toUpperCase()} ${
          originalRequest?.url
        }`,
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        }
      );
    }

    // Handle 401 Unauthorized - Clear tokens and show login message
    if (error.response?.status === 401) {
      TokenManager.clearTokens();

      // Prevent spam of login messages (debounce)
      const now = Date.now();
      const loginMessage = "يرجى تسجيل الدخول للمتابعة";

      if (now - lastToastTime > 3000 || lastToastMessage !== loginMessage) {
        toast.error(loginMessage, {
          duration: 4000,
          style: {
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
            fontSize: "14px",
            fontWeight: "500",
          },
          icon: "🔐",
        });

        lastToastTime = now;
        lastToastMessage = loginMessage;
      }

      // Let the calling component handle the redirect
      // This prevents infinite redirects and gives better UX
    }

    // Transform error to our standard format
    const responseData = error.response?.data as unknown as Record<
      string,
      unknown
    >;

    // Get user-friendly error message
    let userMessage = (responseData?.message as string) || error.message;

    // Handle common status codes with Arabic messages
    if (error.response?.status) {
      switch (error.response.status) {
        case 401:
          userMessage = "يرجى تسجيل الدخول للمتابعة";
          break;
        case 403:
          userMessage = "ليس لديك صلاحية للوصول إلى هذا المحتوى";
          break;
        case 404:
          userMessage = "المحتوى المطلوب غير موجود";
          break;
        case 500:
          userMessage = "حدث خطأ في الخادم، يرجى المحاولة لاحقاً";
          break;
        case 503:
          userMessage = "الخدمة غير متاحة حالياً، يرجى المحاولة لاحقاً";
          break;
        default:
          userMessage = userMessage || "حدث خطأ غير متوقع";
      }
    }

    const apiError: ApiError = {
      message: userMessage,
      status: error.response?.status || 500,
      code: (responseData?.code as string) || error.code,
      details: responseData?.errors || null,
    };

    return Promise.reject(apiError);
  }
);

// API Helper Functions
class ApiHelper {
  /**
   * Make a GET request
   */
  static async get<T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  /**
   * Make a POST request
   */
  static async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  static async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  /**
   * Make a PUT request with form data
   */
  static async putFormData<T>(
    url: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  /**
   * Make a POST request with form data
   */
  static async postFormData<T>(
    url: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  static async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await apiClient.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  static async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await apiClient.delete<ApiResponse<T>>(url);
    return response.data;
  }

  /**
   * Upload files with progress tracking
   */
  static async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress,
    });
    return response.data;
  }
}

// Export everything
export { apiClient, TokenManager, ApiHelper };
export default ApiHelper;
