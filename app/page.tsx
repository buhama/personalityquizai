'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { SampleQuestions } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

export interface Question {
	question: string;
	options: Option[];
}

export interface Option {
	option: string;
	points: Points[];
}

export interface Points {
	result: string;
	points: number;
}

export default function Home() {
	const [input, setInput] = useState('');
	const [result, setResult] = useState('');
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState<Question[]>(SampleQuestions);
	const [radioAnswer, setRadioAnswer] = useState('');
	const [results, setResults] = useState<Points[]>([]);
	const [finalResult, setFinalResult] = useState<string>('');
	const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);

	useEffect(() => {
		if (!loading && result.length > 0) {
			let parsedResult = JSON.parse(result);
			parsedResult.function_call.arguments = JSON.parse(
				parsedResult.function_call.arguments
			);

			// Type assertion to help TypeScript understand the type of 'questions'
			const questions: Question[] =
				(parsedResult?.function_call?.arguments?.questions as Question[]) || [];

			setQuestions(questions);
			setResult('');
		}
	}, [loading, result]);

	useEffect(() => {
		if (questions.length > 0 && !loading) {
			// Step 1: Flatten the array of questions and options to get all points
			const allPoints: Points[] = questions.flatMap((question) =>
				question.options.flatMap((option) =>
					option.points.map((point) => ({
						...point,
						points: 0, // Set points to 0 for each point
					}))
				)
			);

			// get unique results
			const uniqueResults = allPoints.reduce((acc, current) => {
				const x = acc.find((item) => item.result === current.result);
				if (!x) {
					return acc.concat([current]);
				} else {
					return acc;
				}
			}, [] as Points[]);

			console.log('uniqueResults', uniqueResults);

			setResults(uniqueResults);
		}
	}, [questions, loading]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setLoading(true);
			const response = await fetch('api/completion', {
				method: 'POST',
				body: JSON.stringify({
					prompt: input,
					numberOfQuestions,
				}),
			});
			if (!response.ok) {
				throw new Error(response.statusText);
			}

			// This data is a ReadableStream
			const data = response.body;
			if (!data) {
				throw new Error('No data');
			}

			const reader = data.getReader();
			const decoder = new TextDecoder();
			let done = false;

			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				const chunkValue = decoder.decode(value);
				setResult((prev) => `${prev}${chunkValue}`);
				console.log('chunkValue', chunkValue);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const handleOptionChange = (option: Option) => {
		const optionPoints = option.points;
		const newResults = results.map((result) => {
			const optionPoint = optionPoints.find(
				(point) => point.result === result.result
			);
			if (optionPoint) {
				return {
					...result,
					points: optionPoint.points,
				};
			}
			return result;
		});

		console.log('newResults', newResults);

		setResults([...newResults]);
	};
	return (
		<main className='flex min-h-screen flex-col gap-10 py-20 px-10 md:py-24 md:px-24 md:max-w-4xl mx-auto'>
			<div>
				<h2 className='text-xl font-bold pb-2'>
					Create your own personality quiz!
				</h2>
				<form
					onSubmit={(e) => handleSubmit(e)}
					className='flex items-end gap-2'
				>
					<div className='w-full'>
						<p className='font-bold text-xs pb-1'>Your question</p>
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='What game of thrones character are you?'
						/>
					</div>
					<div>
						<p className='font-bold text-xs pb-1'># of questions</p>
						<Input
							value={numberOfQuestions}
							onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
							type='number'
							placeholder='Number of questions'
							className='w-28'
						/>
					</div>
					<Button>Start</Button>
				</form>
			</div>
			{loading && (
				<div>
					<div className='flex items-center space-x-4'>
						<Skeleton className='h-12 w-12 rounded-full' />
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[250px]' />
							<Skeleton className='h-4 w-[200px]' />
						</div>
					</div>
				</div>
			)}
			{questions?.length > 0 && !loading && (
				<>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const maxPoints = Math.max(...results.map((r) => r.points));
							const topResults = results
								.filter((r) => r.points === maxPoints)
								.map((r) => r.result);
							setFinalResult(
								topResults.length > 1
									? `Tie between ${topResults.join(' & ')}`
									: topResults[0]
							);
						}}
						className='space-y-4'
					>
						{questions.map((question: Question, index: number) => {
							return (
								<div key={question.question}>
									<p className='font-bold'>{question.question}</p>
									<RadioGroup
										onValueChange={(newValue) =>
											handleOptionChange(
												questions
													.flatMap((q) => q.options)
													.find((o) => o.option === newValue) as Option
											)
										}
										required
									>
										<div className='flex flex-col' key={index}>
											{question.options &&
												question.options.map(
													(option: Option, index: number) => {
														return (
															<div
																className='flex space-x-2 items-center'
																key={index}
															>
																<RadioGroupItem
																	value={option.option}
																	id={option.option}
																/>
																<label htmlFor={option.option}>
																	{option.option}
																</label>
															</div>
														);
													}
												)}
										</div>
									</RadioGroup>
								</div>
							);
						})}
						<Button type='submit'>Submit</Button>
					</form>
					{finalResult && <p>Your final result: {finalResult}</p>}
				</>
			)}
		</main>
	);
}
