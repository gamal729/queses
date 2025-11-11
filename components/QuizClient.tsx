'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, XCircle, Award, RefreshCw, AlertCircle, Volume2, VolumeX } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options?: string[];
  correctAnswer: number | boolean;
  correctAnswerText: string;
}

interface Section {
  name: string;
  difficulty: string;
  questions: Question[];
}

interface QuizData {
  quiz: {
    title: string;
    sections: Section[];
  };
}

interface QuizClientProps {
  quizId: string;
}

export default function QuizClient({ quizId }: QuizClientProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Preload sound effects
  useEffect(() => {
    if (typeof window !== 'undefined' && soundEnabled) {
      const trueSound = new Audio('/sounds/true.mp3');
      const falseSound = new Audio('/sounds/false.mp3');
      trueSound.preload = 'auto';
      falseSound.preload = 'auto';
    }
  }, [soundEnabled]);

  const playSound = (isCorrect: boolean) => {
    if (!soundEnabled) return;
    try {
      const sound = new Audio(isCorrect ? '/sounds/true.mp3' : '/sounds/false.mp3');
      sound.volume = 0.5;
      sound.play().catch(err => console.log('Sound play failed:', err));
    } catch (err) {
      console.log('Sound initialization failed:', err);
    }
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/data/${quizId}.json`);
        
        if (!response.ok) {
          throw new Error('فشل تحميل الاختبار');
        }
        
        const data: QuizData = await response.json();
        setQuizData(data);
        
        // Flatten all questions from all sections
        const questions: any[] = [];
        data.quiz.sections.forEach(section => {
          section.questions.forEach(q => {
            questions.push({
              ...q,
              sectionName: section.name,
              difficulty: section.difficulty
            });
          });
        });
        setAllQuestions(questions);
        setLoading(false);
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الاختبار');
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuizData();
    }
  }, [quizId]);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const isTrueFalse = currentQuestion && !currentQuestion?.options;

  const handleAnswerSelect = (answerIndex: number | boolean) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setUserAnswers([...userAnswers, {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect
    }]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Play sound effect
    playSound(isCorrect);
    
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResult(false);
    setIsAnswered(false);
    setScore(0);
  };

  const getScorePercentage = () => {
    return Math.round((score / totalQuestions) * 100);
  };

  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return "ممتاز! 🎉";
    if (percentage >= 75) return "جيد جداً! 👏";
    if (percentage >= 60) return "جيد! 👍";
    return "يحتاج إلى مزيد من المراجعة 📚";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">جاري تحميل الاختبار...</div>
        </div>
      </div>
    );
  }

  if (error || !quizData || allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">خطأ في التحميل</h2>
          <p className="text-gray-600 mb-6">{error || 'لم يتم العثور على الاختبار'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <Award className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            نتيجة الاختبار
          </h1>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 mb-6 shadow-lg">
            <div className="text-6xl font-bold mb-2">{score}/{totalQuestions}</div>
            <div className="text-2xl">{getScorePercentage()}%</div>
          </div>
          <p className="text-2xl font-semibold text-gray-700 mb-8">
            {getScoreMessage()}
          </p>
          
          <div className="space-y-3 mb-8 text-right max-h-96 overflow-y-auto">
            {allQuestions.map((q, idx) => {
              const userAnswer = userAnswers.find(a => a.questionId === q.id);
              return (
                <div key={q.id} className="bg-gray-50 rounded-lg p-4 flex items-start gap-3 hover:bg-gray-100 transition-colors">
                  <div className="mt-1">
                    {userAnswer?.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-1">
                      السؤال {idx + 1}: {q.question}
                    </p>
                    <p className="text-sm text-gray-600">
                      الإجابة الصحيحة: {q.correctAnswerText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={handleRestart}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            إعادة الاختبار
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 mb-0">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex-1 text-center">
              {quizData.quiz.title}
            </h1>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={soundEnabled ? 'تعطيل الصوت' : 'تفعيل الصوت'}
            >
              {soundEnabled ? (
                <Volume2 className="w-6 h-6 text-blue-600" />
              ) : (
                <VolumeX className="w-6 h-6 text-gray-400" />
              )}
            </button>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
              السؤال {currentQuestionIndex + 1} من {totalQuestions}
            </span>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
              النقاط: {score}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {currentQuestion.sectionName}
            </span>
            <h2 className="text-2xl font-bold text-gray-800 text-right leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {isTrueFalse ? (
              <>
                <button
                  onClick={() => handleAnswerSelect(true)}
                  disabled={isAnswered}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === true
                      ? isAnswered
                        ? currentQuestion.correctAnswer === true
                          ? 'bg-green-100 border-green-500'
                          : 'bg-red-100 border-red-500'
                        : 'bg-blue-100 border-blue-500'
                      : isAnswered && currentQuestion.correctAnswer === true
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="font-medium text-lg">✓ صح</span>
                </button>
                <button
                  onClick={() => handleAnswerSelect(false)}
                  disabled={isAnswered}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === false
                      ? isAnswered
                        ? currentQuestion.correctAnswer === false
                          ? 'bg-green-100 border-green-500'
                          : 'bg-red-100 border-red-500'
                        : 'bg-blue-100 border-blue-500'
                      : isAnswered && currentQuestion.correctAnswer === false
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="font-medium text-lg">✗ خطأ</span>
                </button>
              </>
            ) : (
              currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === index
                      ? isAnswered
                        ? index === currentQuestion.correctAnswer
                          ? 'bg-green-100 border-green-500'
                          : 'bg-red-100 border-red-500'
                        : 'bg-blue-100 border-blue-500'
                      : isAnswered && index === currentQuestion.correctAnswer
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))
            )}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div className={`p-4 rounded-lg mb-6 animate-fade-in ${
              userAnswers[userAnswers.length - 1]?.isCorrect 
                ? 'bg-green-100 border border-green-300' 
                : 'bg-red-100 border border-red-300'
            }`}>
              <p className="text-right font-medium">
                {userAnswers[userAnswers.length - 1]?.isCorrect 
                  ? '✓ إجابة صحيحة!' 
                  : `✗ إجابة خاطئة. الإجابة الصحيحة: ${currentQuestion.correctAnswerText}`
                }
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}