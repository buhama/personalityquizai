'use client';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShareableResultCard } from '@/components/ui/shareable-result-card';
import { Question, Option, Points } from '@/models/Quiz';
import React, { useEffect, useState } from 'react';

interface QuizClientProps {
	title: string;
	questions: Question[];
}

export default function QuizClient({ title, questions }: QuizClientProps) {
	const [results, setResults] = useState<Points[]>([]);
	const [finalResult, setFinalResult] = useState<string>('');
	const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

	useEffect(() => {
		if (questions.length > 0) {
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
	}, [questions]);

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

	const handleRetake = () => {
		setFinalResult('');
		setSelectedOptions(new Array(questions.length).fill(null));
		const resetResults = results.map((r) => ({ ...r, points: 0 }));
		setResults(resetResults);
	};

	if (finalResult) {
		return (
			<main className='flex min-h-screen flex-col items-center justify-center py-12 px-6'>
				<h1 className='text-xl font-medium text-gray-400 mb-6'>{title}</h1>

				<ShareableResultCard title={title} result={finalResult} />

				<div className='flex gap-3 mt-10'>
					<Button onClick={handleRetake} variant='outline' size='sm'>
						Retake
					</Button>
					<Button onClick={() => (window.location.href = '/')} size='sm'>
						Make your own
					</Button>
				</div>
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

					<Button type='submit'>Submit</Button>
				</form>
			)}
		</main>
	);
}
