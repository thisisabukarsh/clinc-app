import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: string = "دينار اردني"
): string {
  return `${amount} ${currency}`;
}

/**
 * Format date for Arabic locale
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format time for Arabic locale
 */
export function formatTime(time: string): string {
  return time; // Assuming time is already in Arabic format
}

/**
 * Generate star rating display
 */
export function generateStars(rating: number, maxStars: number = 5): boolean[] {
  return Array.from({ length: maxStars }, (_, i) => i < rating);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
