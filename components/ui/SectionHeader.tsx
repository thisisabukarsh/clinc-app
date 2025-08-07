import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  titleClassName = "text-3xl font-bold text-gray-800 mb-4",
  subtitleClassName = "text-lg text-gray-600",
  className = "",
}) => {
  return (
    <div className={`text-center ${className}`}>
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </div>
  );
};
