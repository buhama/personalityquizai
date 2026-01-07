'use client';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Question, Option, Points } from '@/models/Quiz';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function QuizPage() {
	const params = useParams();
	const id = params.id as string;

	const [title, setTitle] = useState('');
	const [questions, setQuestions] = useState<Question[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [results, setResults] = useState<Points[]>([]);
	const [finalResult, setFinalResult] = useState<string>('');
	const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

	useEffect(() => {
		async function fetchQuiz() {
			try {
				const response = await fetch(`/api/quiz/${id}`);
				if (!response.ok) {
					throw new Error('Quiz not found');
				}
				const data = await response.json();
				setTitle(data.title);
				setQuestions(data.questions_json);
			} catch (e) {
				setError('Quiz not found');
			} finally {
				setLoading(false);
			}
		}

		if (id) {
			fetchQuiz();
		}
	}, [id]);

	useEffect(() => {
		if (questions.length > 0 && !loading) {
			const allPoints: Points[] = questions.flatMap((question) =>
				question.options.flatMap((option) =>
					option.points.map((point) => ({
						...point,
						points: 0,
					}))
				)
			);

			const uniqueResults = allPoints.reduce((acc, current) => {
				const x = acc.find((item) => item.result === current.result);
				if (!x) {
					return acc.concat([current]);
				} else {
					return acc;
				}
			}, [] as Points[]);

			setResults(uniqueResults);
			setSelectedOptions(new Array(questions.length).fill(null));
		}
	}, [questions, loading]);

	const handleOptionChange = (
		selectedOption: Option,
		questionIndex: number
	) => {
		const previousOption = selectedOptions[questionIndex];

		let newResults = [...results];

		if (previousOption) {
			newResults = newResults.map((result) => {
				const prevPoint = previousOption.points.find(
					(point) => point.result === result.result
				);
				return prevPoint
					? { ...result, points: result.points - prevPoint.points }
					: result;
			});
		}

		newResults = newResults.map((result) => {
			const selectedPoint = selectedOption.points.find(
				(point) => point.result === result.result
			);
			return selectedPoint
				? { ...result, points: result.points + selectedPoint.points }
				: result;
		});

		setResults(newResults);
		setSelectedOptions((prevSelectedOptions) => {
			const newSelectedOptions = [...prevSelectedOptions];
			newSelectedOptions[questionIndex] = selectedOption;
			return newSelectedOptions;
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (results.length > 0) {
			const maxPoints = Math.max(...results.map((r) => r.points));
			const topResult = results.find((r) => r.points === maxPoints);
			setFinalResult(topResult?.result || 'No results');
		} else {
			setFinalResult('No results');
		}
	};

	if (loading) {
		return (
			<main className='flex min-h-screen flex-col gap-10 py-20 px-10 md:py-24 md:px-24 md:max-w-4xl mx-auto'>
				<div className='w-full flex items-center'>
					<div className='w-full'>
						<div className='flex w-full justify-center space-x-4'>
							<Skeleton className='h-12 w-12 rounded-full' />
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[250px]' />
								<Skeleton className='h-4 w-[200px]' />
							</div>
						</div>
						<div className='text-xs flex justify-center w-full text-center mt-4 text-gray-400'>
							<p>Loading quiz...</p>
						</div>
					</div>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className='flex min-h-screen flex-col items-center justify-center gap-4 py-20 px-10'>
				<h1 className='text-2xl font-bold text-red-400'>Quiz not found</h1>
				<p className='text-gray-400'>This quiz may have been deleted or the link is invalid.</p>
				<Button onClick={() => window.location.href = '/'}>
					Create your own quiz
				</Button>
			</main>
		);
	}

	return (
		<main className='flex min-h-screen flex-col gap-10 py-20 px-10 md:py-24 md:px-24 md:max-w-4xl mx-auto'>
			<div>
				<h1 className='text-2xl font-bold text-purple-400 mb-2'>{title}</h1>
				<p className='text-sm text-gray-400'>Answer all questions to find out your result!</p>
			</div>

			{questions?.length > 0 && (
				<form onSubmit={handleSubmit} className='space-y-4'>
					{questions.map((question: Question, questionIndex: number) => (
						<div key={question.question}>
							<p className='font-bold'>{question.question}</p>
							<RadioGroup
								onValueChange={(newValue) => {
									const selectedOption = question.options.find(
										(o) => o.option === newValue
									) as Option;
									handleOptionChange(selectedOption, questionIndex);
								}}
								required
							>
								<div className='flex flex-col'>
									{question.options?.map((option: Option, index: number) => (
										<div
											className='flex space-x-2 items-center'
											key={index}
										>
											<RadioGroupItem
												value={option.option}
												id={`${questionIndex}-${option.option}`}
											/>
											<label htmlFor={`${questionIndex}-${option.option}`}>
												{option.option}
											</label>
										</div>
									))}
								</div>
							</RadioGroup>
						</div>
					))}

					{finalResult && (
						<div className='p-4 bg-purple-900/30 border border-purple-500 rounded-lg'>
							<p className='text-lg font-bold'>
								Your result:{' '}
								<span className='text-purple-400'>{finalResult}</span>
							</p>
						</div>
					)}

					<div className='flex gap-2'>
						<Button type='submit'>Submit</Button>
						<Button
							type='button'
							variant='outline'
							onClick={() => window.location.href = '/'}
						>
							Create your own quiz
						</Button>
					</div>
				</form>
			)}
		</main>
	);
}
