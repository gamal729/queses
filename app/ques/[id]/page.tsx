import QuizClient from '@/components/QuizClient';
import { use } from 'react';

// interface Props {
//   params: { id: string };
// }

export default function QuizPage({ params }:
  {params :Promise<{ id: string}>}) {
  const {id} = use(params);
  return <QuizClient quizId={id} />;
}