"use client";

import React from "react";
import { Copy, Eye } from "lucide-react";

interface OTPDisplayProps {
  otp?: string;
  devMessage?: string;
  className?: string;
}

export default function OTPDisplay({
  otp,
  devMessage,
  className = "",
}: OTPDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  // Only show in development and when OTP is available
  if (!otp || process.env.NODE_ENV === "production") {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy OTP:", error);
    }
  };

  return (
    <div
      className={`bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Eye className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800">
              {devMessage || "🧪 Development Mode"}
            </h3>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-xs text-amber-700">رمز التحقق:</span>
              <code className="bg-white px-2 py-1 rounded text-lg font-bold text-amber-900 tracking-wider">
                {otp}
              </code>
            </div>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="ml-3 inline-flex items-center px-3 py-1 border border-amber-300 shadow-sm text-xs font-medium rounded text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          <Copy className="w-3 h-3 ml-1" />
          {copied ? "تم النسخ" : "نسخ"}
        </button>
      </div>
      <div className="mt-2">
        <p className="text-xs text-amber-600">
          💡 هذا الرمز يظهر فقط في وضع التطوير لتسهيل الاختبار
        </p>
      </div>
    </div>
  );
}
