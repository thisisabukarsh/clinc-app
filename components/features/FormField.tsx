import React from "react";
import { ChevronDown } from "lucide-react";

interface FormFieldProps {
  label: string;
  type: "text" | "email" | "password" | "select";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
  options?: string[];
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  fullWidth = false,
  options = [],
}) => {
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white appearance-none ${
                error ? "border-red-500" : ""
              }`}
              required={required}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        );

      default:
        return (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right ${
              error ? "border-red-500" : ""
            }`}
            required={required}
          />
        );
    }
  };

  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {renderInput()}
      {error && <p className="mt-1 text-sm text-red-600 text-right">{error}</p>}
    </div>
  );
};
