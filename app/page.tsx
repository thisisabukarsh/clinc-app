import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-primary-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              عيادتك أقرب مما تتوقع
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              نجعل حجز المواعيد الطبية سهلاً وآمناً
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center bg-white rounded-xl shadow-soft p-2">
                <input
                  type="text"
                  placeholder="ابحث عن طبيب..."
                  className="flex-1 px-4 py-3 text-right border-none outline-none"
                />
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                  🔍
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Medical Specialties */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            التخصصات الطبية المتاحة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["اسنان", "جلدية", "قلب", "عظام", "اطفال", "نسائية"].map(
              (specialty) => (
                <div
                  key={specialty}
                  className="bg-white rounded-xl p-6 text-center shadow-soft hover:shadow-medium transition-shadow"
                >
                  <div className="text-4xl mb-4">🏥</div>
                  <h3 className="font-semibold text-gray-900">{specialty}</h3>
                </div>
              )
            )}
          </div>
        </section>

        {/* Top Rated Doctors */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            أفضل الأطباء تقييماً
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 text-center shadow-soft"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-gray-900 mb-2">د. مي محمد</h3>
                <div className="flex justify-center items-center mb-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm text-gray-600 mr-1">4.8</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">اخصائي نسائية</p>
                <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  حجز موعد
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            لماذا عياداتنا؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "⏰", title: "حجز سريع", desc: "في ثوانٍ معدودة" },
              { icon: "🔔", title: "تذكيرات تلقائية", desc: "للمواعيد" },
              { icon: "🏥", title: "حل شامل", desc: "في مكان واحد" },
              { icon: "💬", title: "آراء حقيقية", desc: "وتقييمات" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
