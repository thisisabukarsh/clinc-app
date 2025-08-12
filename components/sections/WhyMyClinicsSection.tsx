import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureCard } from "@/components/features/FeatureCard";
import BellRing from "@/components/svgs/bellRing";
import HealthCareIcon from "@/components/svgs/HealthCareIcon";
import LikeHand from "@/components/svgs/LikeHand";
import Schedule from "@/components/svgs/Schedule";

interface WhyMyClinicsSectionProps {
  className?: string;
}

const WhyMyClinicsSection: React.FC<WhyMyClinicsSectionProps> = ({
  className = "",
}) => {
  const features = [
    {
      icon: <BellRing width={160} height={160} fill="#FFD478" />,
      title: "تذكير تلقائي بالمواعيد",
      description:
        "راح يوصلك تذكير تلقائي قبل موعدك بوقت كافي. ما راح تنسى موعدك أو تتفاجأ فيه، لأن إحنا منذكرك على طول. التزامك صار أسهل، وتنظيم وقتك أذكى.",
      arabicNumber: "١",
    },
    {
      icon: <Schedule width={160} height={160} fill="#93FFA0" />,
      title: "سهولة حجزك خلال ثواني",
      description:
        "احجز موعدك بكل سهولة خلال خطوات بسيطة وواجهة سلسة. ما في داعي للاتصال أو الانتظار الطويل، كلشي أونلاين وبسرعة. وفر وقتك وخلي التجربة مريحة من البداية.",
      arabicNumber: "٢",
    },
    {
      icon: <HealthCareIcon width={160} height={160} fill="#FF6969" />,
      title: "كل العيادات بمكان واحد",
      description:
        "عياداتي بجمع عدد كبير من العيادات والأطباء في مختلف التخصصات. ابحث، واحجز بسهولة من مكان واحد بدون ما تتنقل بين مواقع متعددة. كل الخيارات بين إيديك لتختار الأنسب.",
      arabicNumber: "٣",
    },
    {
      icon: <LikeHand width={160} height={160} fill="#63ACFF" />,
      title: "آراء ومراجعات حقيقية",
      description:
        "اقرأ تجارب ناس سبقوك وحجزوا عند نفس الطبيب. تقييمات ومراجعات حقيقية بتساعدك تاخذ قرارك بثقة وشفافية. إحنا بنهتم تكون اختياراتك مبنية على تجارب موثوقة.",
      arabicNumber: "٤",
    },
  ];

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeader
          title="ليش عياداتي ؟"
          subtitle="لأنك بتستاهل طريقة أسهل، أسرع، وأذكى لحجز مواعيدك الطبية"
          titleClassName="text-3xl font-bold mb-4"
          subtitleClassName="text-lg text-gray-700"
        />

        {/* Features Grid - 2x2 responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-26">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              arabicNumber={feature.arabicNumber}
              className="hover:shadow-xl transition-all duration-300 "
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMyClinicsSection;
