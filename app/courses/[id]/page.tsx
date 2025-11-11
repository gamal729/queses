import Link from 'next/link';
import { ArrowRight, FileQuestion, Clock, Award, Home } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

async function getCourseData(courseId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/courses/courses.json`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    const data = await res.json();
    return data.courses.find((course: any) => course.id === courseId);
  } catch (error) {
    console.error('Error loading course:', error);
    return null;
  }
}

export default async function CoursePage({ params }: Props) {
  const { id } = await params;
  const course = await getCourseData(id);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">المادة غير موجودة</h1>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'سهل':
        return 'bg-green-100 text-green-700';
      case 'متوسط':
        return 'bg-yellow-100 text-yellow-700';
      case 'صعب':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4 font-medium"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <div className="text-5xl">{course.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="mt-1 text-gray-600">{course.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">الاختبارات المتاحة</h2>
          <p className="text-gray-600">اختر الاختبار الذي تريد البدء به</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {course.quizzes.map((quiz: any) => (
            <Link
              key={quiz.id}
              href={`/courses/${id}/ques/${quiz.id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-102">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{quiz.description}</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-full group-hover:bg-indigo-200 transition-colors">
                      <FileQuestion className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileQuestion className="w-5 h-5" />
                      <span className="font-medium">{quiz.questions} سؤال</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{quiz.estimatedTime}</span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>

                    <div className="mr-auto">
                      <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                        ابدأ الاختبار
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Course Stats */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">معلومات المادة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <FileQuestion className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {course.quizzes.length}
              </div>
              <p className="text-gray-600">اختبار متاح</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-600 mb-2">
                {course.quizzes.reduce((sum: number, q: any) => sum + q.questions, 0)}
              </div>
              <p className="text-gray-600">إجمالي الأسئلة</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {course.quizzes.reduce((sum: number, q: any) => {
                  const time = parseInt(q.estimatedTime.split(' ')[0]);
                  return sum + time;
                }, 0)}
              </div>
              <p className="text-gray-600">دقيقة إجمالي</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}