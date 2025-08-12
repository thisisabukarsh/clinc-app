import React from "react";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  arabicNumber: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  arabicNumber,
  className = "",
}) => {
  return (
    <div className="relative z-10">
      <div
        className={`relative bg-white max-w-[355px] mx-auto rounded-2xl shadow-lg p-6 text-right  ${className}`}
      >
        {/* Arabic Number - Top left corner, no background */}
        <div className="absolute top-6 right-4 z-10">
          <span className="text-9xl font-bold text-[#92C2FF]">
            {arabicNumber}
          </span>
        </div>

        {/* SVG Icon - Much larger, extends significantly beyond card boundaries */}
        <div className="absolute -top-20 -right-24 -z-10">
          {/* Main Icon - Much larger size to extend beyond card */}
          <div className="w-40 h-40 ">{icon}</div>
        </div>

        {/* Content - Positioned below icon */}
        <div className="relative pt-16 z-20">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};
