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

	useEffect(() => {
		if (!loading && result) {
			let parsedResult = JSON.parse(result);
			parsedResult.function_call.arguments = JSON.parse(
				parsedResult.function_call.arguments
			);

			// Type assertion to help TypeScript understand the type of 'questions'
			const questions: Question[] =
				(parsedResult?.function_call?.arguments?.questions as Question[]) || [];

			setQuestions(questions);
			setResult('');
			console.log('objectResult', parsedResult);
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
		<main className='flex min-h-screen flex-col justify-between p-24'>
			<form onSubmit={(e) => handleSubmit(e)}>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Describe your business...'
				/>
			</form>
			{loading && (
				<div>
					<Skeleton className='w-[100px] h-[20px] rounded-full' />
				</div>
			)}
			{questions?.length > 0 && !loading && (
				<>
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
								>
									<div className='flex flex-col' key={index}>
										{question.options &&
											question.options.map((option: Option, index: number) => {
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
											})}
									</div>
								</RadioGroup>
							</div>
						);
					})}
					<Button
						onClick={() =>
							setFinalResult(
								//final the result with the most points
								results.reduce((prev, current) =>
									prev.points > current.points ? prev : current
								).result
							)
						}
					>
						Submit
					</Button>
					{finalResult && <p>Your final result: {finalResult}</p>}
				</>
			)}
		</main>
	);
}
