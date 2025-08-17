import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-600 mb-8">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
        </p>
        <div className="space-x-4 space-x-reverse">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            العودة للصفحة الرئيسية
          </Link>
          <Link
            href="/doctors"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors inline-block"
          >
            البحث عن الأطباء
          </Link>
        </div>
      </div>
    </div>
  );
}
