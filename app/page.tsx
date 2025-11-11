import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

async function getCourses() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/courses/courses.json`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    const data = await res.json();
    return data.courses;
  } catch (error) {
    console.error('Error loading courses:', error);
    return [];
  }
}

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">منصة الاختبارات</h1>
          </div>
          <p className="mt-2 text-gray-600">اختر المادة وابدأ الاختبار</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">لا توجد مواد متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105">
                  <div className={`bg-gradient-to-r ${course.color} p-6 text-white`}>
                    <div className="text-5xl mb-3">{course.icon}</div>
                    <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                    <p className="text-white/90 text-sm">{course.description}</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">عدد الاختبارات المتاحة</p>
                        <p className="text-3xl font-bold text-gray-800">{course.quizCount}</p>
                      </div>
                      <div className="bg-indigo-100 p-4 rounded-full group-hover:bg-indigo-200 transition-colors">
                        <ArrowRight className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {courses.length > 0 && (
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">إحصائيات المنصة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {courses.length}
                </div>
                <p className="text-gray-600">مادة دراسية</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {courses.reduce((sum: number, c: any) => sum + c.quizCount, 0)}
                </div>
                <p className="text-gray-600">اختبار متاح</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
                <p className="text-gray-600">فرصة للنجاح</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2024 منصة الاختبارات - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}