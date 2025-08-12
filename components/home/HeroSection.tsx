import React from "react";
import SearchBar from "@/components/features/SearchBar";

const HeroSection: React.FC = () => {
  return (
    <section
      // dir="ltr"
      className="relative"
      style={{
        backgroundImage: `url('/7972 1.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex flex-row items-center min-h-[60vh]">
          {/* Left Side - Device Mockups */}

          {/* Right Side - Content */}
          <div className="lg:w-1/2 text-right space-y-6 order-1 lg:order-2 lg:pl-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                عياداتك أقرب مما
                <br />
                <span className="text-white">تتوقع , إحنا بنسهلها</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl lg:max-w-2xl ml-auto">
                إحنا بعياداتي نساعدك تلاقي الدكتور المناسب والعيادة الأقرب
                لبيتك، ونهتم فيك وبعائلتك.
              </p>
            </div>
          </div>
        </div>

        {/* Search Component - Positioned as overlay at bottom */}
        <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
