import React from "react";
import Image from "next/image";

interface DeviceMockupProps {
  className?: string;
  priority?: boolean;
}

const DeviceMockup: React.FC<DeviceMockupProps> = ({
  className = "",
  priority = false,
}) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/ipadandmobile-mockup.png"
        alt="تطبيق عياداتي على الأجهزة"
        width={700}
        height={400}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
};

export default DeviceMockup;
