"use client";

import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              لماذا عياداتي؟
            </h2>
            <p className="text-lg text-gray-600">
              نقدم لك تجربة حجز مواعيد طبية مميزة وسهلة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "⏰",
                title: "حجز سريع",
                desc: "احجز موعدك في ثوانٍ معدودة دون انتظار",
              },
              {
                icon: "🔔",
                title: "تذكيرات تلقائية",
                desc: "نذكرك بمواعيدك قبل الموعد بوقت كافي",
              },
              {
                icon: "🏥",
                title: "شبكة واسعة",
                desc: "أكثر من 500 طبيب و50 عيادة في خدمتك",
              },
              {
                icon: "💬",
                title: "آراء حقيقية",
                desc: "تقييمات وآراء حقيقية من المرضى",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-shadow duration-300"
              >
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">طبيب معتمد</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-primary-100">مريض راضي</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-primary-100">عيادة مشتركة</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-primary-100">دعم فني</div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
