import QuizClient from '@/components/QuizClient';
import { use } from 'react';


export default function QuizPage({ params }:
  {params :Promise<{ id: string ,quizId: string}>}) {
  const {id ,quizId} = use(params);
  return <QuizClient quizId={quizId} courseId={id}/>;
}