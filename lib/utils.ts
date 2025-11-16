import { Question } from '@/app/page';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


export const SampleQuestions: { prompt: string; data: Question[] }[] = [
	{
		prompt: 'What is your attachment style',
		data: [
			{
				question: 'How do you react when someone is upset with you?',
				options: [
					{
						option: 'I try to fix things immediately',
						points: [
							{ result: 'Anxious-Preoccupied', points: 3 },
							{ result: 'Secure', points: 1 },
						],
					},
					{
						option: 'I withdraw and need space',
						points: [
							{ result: 'Dismissive-Avoidant', points: 3 },
							{ result: 'Fearful-Avoidant', points: 1 },
						],
					},
					{
						option: 'I stay calm and try to understand',
						points: [
							{ result: 'Secure', points: 3 },
							{ result: 'Anxious-Preoccupied', points: 1 },
						],
					},
					{
						option: 'I fluctuate between needing them and wanting space',
						points: [
							{ result: 'Fearful-Avoidant', points: 3 },
							{ result: 'Dismissive-Avoidant', points: 1 },
						],
					},
				],
			},
			{
				question: 'How do you feel about relationships?',
				options: [
					{
						option: "I worry about my partner's commitment",
						points: [
							{ result: 'Anxious-Preoccupied', points: 3 },
							{ result: 'Fearful-Avoidant', points: 1 },
						],
					},
					{
						option: 'I value my independence more',
						points: [
							{ result: 'Dismissive-Avoidant', points: 3 },
							{ result: 'Secure', points: 1 },
						],
					},
					{
						option: 'I find it easy to get close to others',
						points: [
							{ result: 'Secure', points: 3 },
							{ result: 'Anxious-Preoccupied', points: 1 },
						],
					},
					{
						option: 'I am scared of getting too close or being distant',
						points: [
							{ result: 'Fearful-Avoidant', points: 3 },
							{ result: 'Dismissive-Avoidant', points: 1 },
						],
					},
				],
			},
			{
				question: "What's your first reaction after a fight?",
				options: [
					{
						option: 'I need reassurance and connection',
						points: [
							{ result: 'Anxious-Preoccupied', points: 3 },
							{ result: 'Secure', points: 1 },
						],
					},
					{
						option: 'I like to deal with it on my own',
						points: [
							{ result: 'Dismissive-Avoidant', points: 3 },
							{ result: 'Fearful-Avoidant', points: 1 },
						],
					},
					{
						option: 'I address the issue and seek mutual understanding',
						points: [
							{ result: 'Secure', points: 3 },
							{ result: 'Anxious-Preoccupied', points: 1 },
						],
					},
					{
						option: 'I avoid discussing the problem',
						points: [
							{ result: 'Fearful-Avoidant', points: 3 },
							{ result: 'Dismissive-Avoidant', points: 1 },
						],
					},
				],
			},
		],
	},
	// {
	// 	prompt: 'What is your hatred language',
	// 	data: [
	// 		{
	// 			question: 'What annoys you most in a conversation?',
	// 			options: [
	// 				{
	// 					option: 'Being interrupted',
	// 					points: [
	// 						{ result: 'Disrespect', points: 3 },
	// 						{ result: 'Irrelevance', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Negativity',
	// 					points: [
	// 						{ result: 'Pessimism', points: 3 },
	// 						{ result: 'Disrespect', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Lack of depth',
	// 					points: [
	// 						{ result: 'Superficiality', points: 3 },
	// 						{ result: 'Pessimism', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Off-topic blabbering',
	// 					points: [
	// 						{ result: 'Irrelevance', points: 3 },
	// 						{ result: 'Superficiality', points: 1 },
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			question: 'What behavior from others makes you uncomfortable?',
	// 			options: [
	// 				{
	// 					option: 'Disregard for personal boundaries',
	// 					points: [
	// 						{ result: 'Disrespect', points: 3 },
	// 						{ result: 'Irrelevance', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Constant complaining',
	// 					points: [
	// 						{ result: 'Pessimism', points: 3 },
	// 						{ result: 'Disrespect', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Shallow interactions',
	// 					points: [
	// 						{ result: 'Superficiality', points: 3 },
	// 						{ result: 'Pessimism', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Random, irrelevant chatter',
	// 					points: [
	// 						{ result: 'Irrelevance', points: 3 },
	// 						{ result: 'Superficiality', points: 1 },
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			question: 'How do you react when someone breaks a promise?',
	// 			options: [
	// 				{
	// 					option: 'Feel deeply disrespected',
	// 					points: [
	// 						{ result: 'Disrespect', points: 3 },
	// 						{ result: 'Superficiality', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Focus on the negative impact',
	// 					points: [
	// 						{ result: 'Pessimism', points: 3 },
	// 						{ result: 'Irrelevance', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Bemoan the lack of depth in their commitment',
	// 					points: [
	// 						{ result: 'Superficiality', points: 3 },
	// 						{ result: 'Disrespect', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Annoyed by the deviation from the main commitment',
	// 					points: [
	// 						{ result: 'Irrelevance', points: 3 },
	// 						{ result: 'Pessimism', points: 1 },
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			question: 'What’s your biggest pet peeve in a relationship?',
	// 			options: [
	// 				{
	// 					option: 'Disrespect of personal boundaries',
	// 					points: [
	// 						{ result: 'Disrespect', points: 3 },
	// 						{ result: 'Superficiality', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Excessive negativity',
	// 					points: [
	// 						{ result: 'Pessimism', points: 3 },
	// 						{ result: 'Irrelevance', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Lack of deep, meaningful conversation',
	// 					points: [
	// 						{ result: 'Superficiality', points: 3 },
	// 						{ result: 'Disrespect', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Constantly straying from important topics',
	// 					points: [
	// 						{ result: 'Irrelevance', points: 3 },
	// 						{ result: 'Pessimism', points: 1 },
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			question: 'Which communication style bothers you the most?',
	// 			options: [
	// 				{
	// 					option: 'Rude and dismissive',
	// 					points: [
	// 						{ result: 'Disrespect', points: 3 },
	// 						{ result: 'Superficiality', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Overly critical and negative',
	// 					points: [
	// 						{ result: 'Pessimism', points: 3 },
	// 						{ result: 'Irrelevance', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Superficial and vague',
	// 					points: [
	// 						{ result: 'Superficiality', points: 3 },
	// 						{ result: 'Disrespect', points: 1 },
	// 					],
	// 				},
	// 				{
	// 					option: 'Wandering and off-topic',
	// 					points: [
	// 						{ result: 'Irrelevance', points: 3 },
	// 						{ result: 'Pessimism', points: 1 },
	// 					],
	// 				},
	// 			],
	// 		},
	// 	],
	// },
	// {
	// 	prompt: 'What startup should you start',
	// 	data: [
	// 		{
	// 			question: 'What are you most passionate about?',
	// 			options: [
	// 				{
	// 					option: 'Creating new technologies',
	// 					points: [
	// 						{
	// 							result: 'Tech Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Promoting healthier living',
	// 					points: [
	// 						{
	// 							result: 'Health and Wellness Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Influencing through media',
	// 					points: [
	// 						{
	// 							result: 'Media Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Improving the environment',
	// 					points: [
	// 						{
	// 							result: 'Sustainable Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			question: 'What type of work environment suits you best?',
	// 			options: [
	// 				{
	// 					option: 'Fast-paced and innovative',
	// 					points: [
	// 						{
	// 							result: 'Tech Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Balanced and holistic',
	// 					points: [
	// 						{
	// 							result: 'Health and Wellness Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Creative and dynamic',
	// 					points: [
	// 						{
	// 							result: 'Media Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Eco-friendly and conservation-focused',
	// 					points: [
	// 						{
	// 							result: 'Sustainable Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			question: 'Which of these excites you the most?',
	// 			options: [
	// 				{
	// 					option: 'Building the next big app',
	// 					points: [
	// 						{
	// 							result: 'Tech Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Designing a wellness program',
	// 					points: [
	// 						{
	// 							result: 'Health and Wellness Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Creating content that inspires',
	// 					points: [
	// 						{
	// 							result: 'Media Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Developing a sustainable product',
	// 					points: [
	// 						{
	// 							result: 'Sustainable Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			question: 'What’s the most important aspect of a business to you?',
	// 			options: [
	// 				{
	// 					option: 'Disruptive innovation',
	// 					points: [
	// 						{
	// 							result: 'Tech Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Improving wellbeing',
	// 					points: [
	// 						{
	// 							result: 'Health and Wellness Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Engaging storytelling',
	// 					points: [
	// 						{
	// 							result: 'Media Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'Positive environmental impact',
	// 					points: [
	// 						{
	// 							result: 'Sustainable Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			question: 'Where do you see the most opportunity for impact?',
	// 			options: [
	// 				{
	// 					option: 'In the digital space',
	// 					points: [
	// 						{
	// 							result: 'Tech Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'In personal health and fitness',
	// 					points: [
	// 						{
	// 							result: 'Health and Wellness Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'In multimedia platforms',
	// 					points: [
	// 						{
	// 							result: 'Media Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 				{
	// 					option: 'In green technologies',
	// 					points: [
	// 						{
	// 							result: 'Sustainable Startup',
	// 							points: 2,
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 	],
	// },
];

export const getRandomQuestion = (): { prompt: string; data: Question[] } => {
	const index = Math.floor(Math.random() * SampleQuestions.length);
	return SampleQuestions[index];
};
