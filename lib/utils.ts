import { Question } from '@/app/page';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const SampleQuestions: Question[] = [
	{
		question: 'What is your ideal vacation destination?',
		options: [
			{
				option: 'Relaxing on a private island',
				points: [
					{
						result: 'Richard Branson',
						points: 2,
					},
				],
			},
			{
				option: 'Exploring ancient ruins',
				points: [
					{
						result: 'Elon Musk',
						points: 2,
					},
				],
			},
			{
				option: 'Touring world-class museums',
				points: [
					{
						result: 'Jeff Bezos',
						points: 2,
					},
				],
			},
			{
				option: 'Adventurous safari',
				points: [
					{
						result: 'Mark Zuckerberg',
						points: 2,
					},
				],
			},
		],
	},
	{
		question: 'Which product would you invest in?',
		options: [
			{
				option: 'Space exploration',
				points: [
					{
						result: 'Elon Musk',
						points: 2,
					},
				],
			},
			{
				option: 'E-commerce',
				points: [
					{
						result: 'Jeff Bezos',
						points: 2,
					},
				],
			},
			{
				option: 'Social media',
				points: [
					{
						result: 'Mark Zuckerberg',
						points: 2,
					},
				],
			},
			{
				option: 'Travel and leisure',
				points: [
					{
						result: 'Richard Branson',
						points: 2,
					},
				],
			},
		],
	},
];
