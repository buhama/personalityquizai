import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import QuizClient from './quiz-client';
import Link from 'next/link';

interface Props {
	params: Promise<{ id: string }>;
}

async function getQuiz(id: string) {
	const supabase = await createClient();
	const { data: quiz, error } = await supabase
		.from('quizzes')
		.select('title, questions_json')
		.eq('id', id)
		.single();

	if (error || !quiz) {
		return null;
	}

	return quiz;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const quiz = await getQuiz(id);

	if (!quiz) {
		return {
			title: 'Quiz Not Found | Personality Quiz AI',
			description: 'This quiz could not be found.',
		};
	}

	const questionCount = quiz.questions_json?.length || 0;
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://personalityquiz.ai';

	return {
		title: `${quiz.title} | Personality Quiz AI`,
		description: `Take this personality quiz with ${questionCount} questions and discover your result! Created with Personality Quiz AI.`,
		openGraph: {
			title: quiz.title,
			description: `Take this personality quiz with ${questionCount} questions and discover your result!`,
			type: 'website',
			url: `${baseUrl}/quiz/${id}`,
			siteName: 'Personality Quiz AI',
			images: [
				{
					url: `${baseUrl}/api/og/${id}`,
					width: 1200,
					height: 630,
					alt: quiz.title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: quiz.title,
			description: `Take this personality quiz with ${questionCount} questions and discover your result!`,
			images: [`${baseUrl}/api/og/${id}`],
		},
	};
}

export default async function QuizPage({ params }: Props) {
	const { id } = await params;
	const quiz = await getQuiz(id);

	if (!quiz) {
		return (
			<main className='flex min-h-screen flex-col items-center justify-center gap-4 py-20 px-10'>
				<h1 className='text-2xl font-bold text-red-400'>Quiz not found</h1>
				<p className='text-gray-400'>This quiz may have been deleted or the link is invalid.</p>
				<Link href='/'>
					<Button>Create your own quiz</Button>
				</Link>
			</main>
		);
	}

	return <QuizClient title={quiz.title} questions={quiz.questions_json} />;
}
