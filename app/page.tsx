'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { getRandomQuestion } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import LogRocket from 'logrocket';

export interface Question {
	question: string;
	options: string[];
	answer?: string;
}

export default function Home() {
	const [sample, setSample] = useState('');
	const [input, setInput] = useState('');
	const [result, setResult] = useState('');
	const [loading, setLoading] = useState(false);
	const [answerLoading, setAnswerLoading] = useState(false); // TODO: Remove this
	const [questions, setQuestions] = useState<Question[]>([]);

	const [usingSample, setUsingSample] = useState<boolean>(true); // TODO: Remove this
	const [finalResult, setFinalResult] = useState<string>('');
	const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);

	useEffect(() => {
		if (usingSample) {
			const randomQuestions = getRandomQuestion();
			setQuestions(randomQuestions.data);
			setSample(randomQuestions.prompt);
		}

		LogRocket.init('lpw8gr/aipersonalityquiz');
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (loading) return;
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

	const handleOptionChange = (value: string, index: number) => {
		const newQuestions = [...questions];
		newQuestions[index].answer = value;
	};

	const getResult = async () => {
		if (answerLoading) return;
		try {
			setAnswerLoading(true);
			setFinalResult('');
			const newQuestions = questions.map((question) => {
				return {
					question: question.question,
					answer: question.answer,
				};
			});

			const response = await fetch('api/get-answer', {
				method: 'POST',
				body: JSON.stringify({
					prompt: input || sample,
					questions: newQuestions,
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
				setFinalResult((prev) => `${prev}${chunkValue}`);
				console.log('final result', chunkValue);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setAnswerLoading(false);
		}
	};

	return (
		<main className='flex min-h-screen flex-col gap-10 py-20 px-10 md:py-24 md:px-24 md:max-w-4xl mx-auto'>
			<div>
				<h2 className='text-xl font-bold pb-2'>
					Create your own personality quiz!
				</h2>
				<form
					onSubmit={(e) => handleSubmit(e)}
					className='flex md:flex-row flex-col md:items-end gap-2'
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
							className='md:w-28'
						/>
					</div>
					<Button className='mt-2 md:mt-0'>Start</Button>
					<hr className='md:hidden mt-10' />
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
						onSubmit={async (e) => {
							e.preventDefault();
							await getResult();
						}}
						className='space-y-4'
					>
						{questions.map((question: Question, questionIndex: number) => {
							return (
								<div key={question.question}>
									<p className='font-bold'>{question.question}</p>
									<RadioGroup
										onValueChange={(newValue) => {
											handleOptionChange(newValue, questionIndex);
										}}
										required
									>
										<div className='flex flex-col' key={questionIndex}>
											{question.options &&
												question.options.map(
													(option: string, index: number) => {
														return (
															<div
																className='flex space-x-2 items-center'
																key={index}
															>
																<RadioGroupItem value={option} id={option} />
																<label htmlFor={option}>{option}</label>
															</div>
														);
													}
												)}
										</div>
									</RadioGroup>
									{questions[questionIndex].answer === 'Other' && (
										<Input className='w-1/2 mt-3' placeholder='Other' />
									)}
								</div>
							);
						})}
						{finalResult && (
							<div>
								<p className='text-lg font-bold'>Your final result: </p>
								<p dangerouslySetInnerHTML={{ __html: finalResult }} />
							</div>
						)}

						<Button type='submit'>Submit</Button>
					</form>
				</>
			)}
		</main>
	);
}
