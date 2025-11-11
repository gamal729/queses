import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const quizzes = [
    { id: '1', title: 'اختبار تاريخ وتطور الحاسبات', description: 'اختبر معرفتك بتاريخ الحواسيب وتطورها عبر الزمن' },
    { id: '2', title: 'اختبار الأنظمة الموزعة', description: 'اختبر فهمك لأنظمة الحوسبة الموزعة ومفاهيمها الأساسية' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col items-center">
      <div className="max-w-2xl w-full mt-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-900">اختبارات الحاسب</h1>
        
        <div className="space-y-6">
          {quizzes.map((quiz) => (
            <Link href={`/ques/${quiz.id}`} key={quiz.id} className="block">
              <Card className="hover:shadow-lg transition-shadow border-indigo-200 overflow-hidden">
                <div className="bg-indigo-600 h-1" />
                <CardHeader>
                  <CardTitle className="text-2xl text-indigo-800">{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    ابدأ الاختبار
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}