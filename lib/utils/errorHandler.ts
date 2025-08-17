import { ApiError, ValidationError } from "@/types/api";

/**
 * Error Handler Utility
 * Provides consistent error handling and user-friendly messages
 */
class ErrorHandler {
  /**
   * Extract user-friendly error message from API error
   */
  static getErrorMessage(error: unknown): string {
    // If it's already a string, return it
    if (typeof error === "string") {
      return error;
    }

    // If it's an object, check for error properties
    if (error && typeof error === "object") {
      const err = error as Record<string, unknown>;

      // Check for specific error properties
      if (typeof err.message === "string") {
        return err.message;
      }

      // Check for validation errors
      if (err.details && typeof err.details === "object") {
        const validationErrors = this.extractValidationErrors(err.details);
        if (validationErrors.length > 0) {
          return validationErrors[0].message;
        }
      }

      // Check for axios error structure
      if (err.response && typeof err.response === "object") {
        const response = err.response as Record<string, unknown>;
        if (response.data && typeof response.data === "object") {
          const data = response.data as Record<string, unknown>;
          if (typeof data.message === "string") {
            return data.message;
          }
        }
        if (typeof response.statusText === "string") {
          return response.statusText;
        }
      }
    }

    // Default error message
    return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
  }

  /**
   * Extract validation errors from error details
   */
  static extractValidationErrors(details: unknown): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!details || typeof details !== "object") {
      return errors;
    }

    // Handle different validation error formats
    const detailsObj = details as Record<string, unknown>;
    Object.keys(detailsObj).forEach((field) => {
      const fieldErrors = detailsObj[field];

      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((message) => {
          if (typeof message === "string") {
            errors.push({ field, message });
          }
        });
      } else if (typeof fieldErrors === "string") {
        errors.push({ field, message: fieldErrors });
      }
    });

    return errors;
  }

  /**
   * Get Arabic error messages for common HTTP status codes
   */
  static getStatusMessage(status: number): string {
    const statusMessages: Record<number, string> = {
      400: "طلب غير صحيح. يرجى التحقق من البيانات المدخلة.",
      401: "غير مصرح لك بالوصول. يرجى تسجيل الدخول.",
      403: "ممنوع الوصول. ليس لديك صلاحية لهذا الإجراء.",
      404: "الصفحة أو البيانات المطلوبة غير موجودة.",
      409: "تضارب في البيانات. قد تكون البيانات موجودة مسبقاً.",
      422: "البيانات المدخلة غير صحيحة.",
      429: "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.",
      500: "خطأ في الخادم. يرجى المحاولة لاحقاً.",
      502: "خطأ في الاتصال بالخادم.",
      503: "الخدمة غير متوفرة حالياً.",
      504: "انتهت مهلة الاتصال بالخادم.",
    };

    return statusMessages[status] || "حدث خطأ غير متوقع.";
  }

  /**
   * Handle specific authentication errors
   */
  static handleAuthError(error: ApiError): string {
    if (error.status === 401) {
      if (error.code === "INVALID_CREDENTIALS") {
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      }
      if (error.code === "EMAIL_NOT_VERIFIED") {
        return "يرجى تفعيل حسابك من خلال البريد الإلكتروني.";
      }
      if (error.code === "ACCOUNT_SUSPENDED") {
        return "تم تعليق حسابك. يرجى التواصل مع الدعم الفني.";
      }
      return "فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.";
    }

    if (error.status === 409) {
      if (error.code === "EMAIL_EXISTS") {
        return "البريد الإلكتروني مُستخدم مسبقاً.";
      }
      if (error.code === "PHONE_EXISTS") {
        return "رقم الهاتف مُستخدم مسبقاً.";
      }
    }

    return this.getErrorMessage(error);
  }

  /**
   * Handle form validation errors
   */
  static handleFormErrors(error: ApiError): Record<string, string> {
    const formErrors: Record<string, string> = {};

    if (error.details && typeof error.details === "object") {
      const validationErrors = this.extractValidationErrors(error.details);
      validationErrors.forEach(({ field, message }) => {
        formErrors[field] = message;
      });
    }

    return formErrors;
  }

  /**
   * Check if error is a network error
   */
  static isNetworkError(error: unknown): boolean {
    if (!error || typeof error !== "object") {
      return false;
    }

    const err = error as Record<string, unknown>;

    return (
      !err.response ||
      err.code === "NETWORK_ERROR" ||
      err.code === "ECONNREFUSED" ||
      (typeof err.message === "string" && err.message.includes("Network Error"))
    );
  }

  /**
   * Get network error message
   */
  static getNetworkErrorMessage(): string {
    return "خطأ في الاتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.";
  }

  /**
   * Log error for debugging (only in development)
   */
  static logError(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 Error ${context ? `in ${context}` : ""}`);
      console.error("Error object:", error);
      console.error("Error message:", this.getErrorMessage(error));
      if (error && typeof error === "object" && "stack" in error) {
        console.error("Stack trace:", error.stack);
      }
      console.groupEnd();
    }
  }

  /**
   * Create a user-friendly error object
   */
  static createUserError(
    message: string,
    code?: string,
    details?: unknown
  ): ApiError {
    return {
      message,
      status: 400,
      code,
      details,
    };
  }
}

export default ErrorHandler;
