'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { SampleQuestions, getRandomQuestion } from '@/lib/utils';
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
	const [sample, setSample] = useState('');
	const [input, setInput] = useState('');
	const [result, setResult] = useState('');
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState<Question[]>([]);

	const [usingSample, setUsingSample] = useState<boolean>(true); // TODO: Remove this
	const [radioAnswer, setRadioAnswer] = useState('');
	const [results, setResults] = useState<Points[]>([]);
	const [finalResult, setFinalResult] = useState<string>('');
	const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);
	const [selectedOptions, setSelectedOptions] = useState<Option[]>(
		new Array(questions.length).fill(null)
	);

	useEffect(() => {
		if (usingSample) {
			const randomQuestions = getRandomQuestion();
			setQuestions(randomQuestions.data);
			setSample(randomQuestions.prompt);
		}
	}, []);

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
			setUsingSample(false);
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

	const handleOptionChange = (
		selectedOption: Option,
		questionIndex: number
	) => {
		const previousOption = selectedOptions[questionIndex];

		let newResults = [...results];

		// If an option was previously selected, subtract its points from the total
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

		// Add the selected option's points to the total
		newResults = newResults.map((result) => {
			const selectedPoint = selectedOption.points.find(
				(point) => point.result === result.result
			);
			return selectedPoint
				? { ...result, points: result.points + selectedPoint.points }
				: result;
		});

		// Update the state with the new totals and the new selected option
		console.log('newResults', newResults);
		setResults(newResults);
		setSelectedOptions((prevSelectedOptions) => {
			const newSelectedOptions = [...prevSelectedOptions];
			newSelectedOptions[questionIndex] = selectedOption;
			return newSelectedOptions;
		});
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
				<div className='w-full flex items-center'>
					<div className='w-full'>
						<div className='flex w-full justify-center space-x-4'>
							<Skeleton className='h-12 w-12 rounded-full' />
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[250px]' />
								<Skeleton className='h-4 w-[200px]' />
							</div>
						</div>
						<div className='text-xs flex justify-center w-full text-center mt-4 text-gray-400 animate-pulse'>
							<p className='w-[250px]'>
								Loading... This can take a while depending on the number of
								questions
							</p>
						</div>
					</div>
				</div>
			)}
			{usingSample && (
				<p className='text-lg font-bold -mb-8'>
					Current Sample: <span className='text-purple-400'> {sample}</span>
				</p>
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
						{questions.map((question: Question, questionIndex: number) => {
							return (
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
										<div className='flex flex-col' key={questionIndex}>
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
						{finalResult && (
							<p className='text-lg font-bold'>
								Your final result:{' '}
								<span className='text-purple-400'> {finalResult}</span>
							</p>
						)}

						<Button type='submit'>Submit</Button>
					</form>
				</>
			)}
		</main>
	);
}
