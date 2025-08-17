/**
 * Environment Configuration
 * Centralized configuration for environment variables
 */

// Validate required environment variables
const requiredEnvVars = ["NEXT_PUBLIC_API_BASE_URL"] as const;

// Development defaults
const developmentDefaults = {
  NEXT_PUBLIC_API_BASE_URL: "http://localhost:5000/api",
  NEXT_PUBLIC_APP_ENV: "development",
} as const;

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];

  if (!value) {
    // Use development defaults in development mode
    if (process.env.NODE_ENV === "development" && key in developmentDefaults) {
      return developmentDefaults[key as keyof typeof developmentDefaults];
    }

    if (fallback !== undefined) {
      return fallback;
    }

    console.warn(`Environment variable ${key} is not set`);
    return "";
  }

  return value;
}

/**
 * Validate environment configuration
 */
function validateEnv(): void {
  const missing: string[] = [];

  requiredEnvVars.forEach((key) => {
    const value = getEnvVar(key);
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing);
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }
  }
}

// Validate on module load
validateEnv();

/**
 * Application Environment Configuration
 */
export const env = {
  // App Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_ENV: getEnvVar("NEXT_PUBLIC_APP_ENV", "development"),

  // API Configuration
  API_BASE_URL: getEnvVar("NEXT_PUBLIC_API_BASE_URL"),
  API_TIMEOUT: parseInt(getEnvVar("NEXT_PUBLIC_API_TIMEOUT", "30000"), 10),

  // App URLs
  APP_URL: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),

  // Feature Flags
  ENABLE_ANALYTICS:
    getEnvVar("NEXT_PUBLIC_ENABLE_ANALYTICS", "false") === "true",
  ENABLE_ERROR_REPORTING:
    getEnvVar("NEXT_PUBLIC_ENABLE_ERROR_REPORTING", "false") === "true",

  // Debug Settings
  DEBUG_API: getEnvVar("NEXT_PUBLIC_DEBUG_API", "false") === "true",

  // Development helpers
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

export default env;
