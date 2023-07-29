'use client';

import { Input } from '@/components/ui/input';
import { useCompletion } from 'ai/react';
import Image from 'next/image';
import React, { useState } from 'react';

export default function Home() {
	const [input, setInput] = useState('');
	const [result, setResult] = useState('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
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
			}
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<form onSubmit={(e) => handleSubmit(e)}>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Describe your business...'
				/>
			</form>
			<div className='whitespace-pre-wrap my-6'>{result}</div>
		</main>
	);
}
