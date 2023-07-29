import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'edge';

const apiConfig = new Configuration({
	apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAIApi(apiConfig);

export async function POST(req: Request) {
	// Extract the `messages` from the body of the request
	const { prompt, numberOfQuestions } = await req.json();
	console.log('prompt', prompt);
	console.log('numberOfQuestions', numberOfQuestions);
	const schema = {
		type: 'object',
		properties: {
			questions: {
				type: 'array',
				description: `List of ${numberOfQuestions} questions to ask the user. Each question also has a list of options and each option has a list of points to assign to each result.`,
				items: {
					type: 'object',
					properties: {
						question: {
							type: 'string',
							description: 'The question to ask the user.',
						},
						options: {
							type: 'array',
							description: 'List of options to choose from.',
							items: {
								type: 'object',
								properties: {
									option: {
										type: 'string',
										description: 'The option to choose from.',
									},
									points: {
										type: 'array',
										description: 'List of points to assign to each result.',
										items: {
											type: 'object',
											properties: {
												result: {
													type: 'string',
													description: 'The result to assign points to.',
												},
												points: {
													type: 'number',
													description:
														'The number of points to assign to the result.',
												},
											},
											required: ['result', 'points'],
										},
									},
								},
								required: ['option', 'points'],
							},
						},
					},
				},
			},
		},
	};

	// Request the OpenAI API for the response based on the prompt
	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo-16k-0613',
		stream: true,
		messages: [
			{
				role: 'system',
				content: `{\n\trole: 'system',\n\tcontent:\n\t\t\"You're going to help me generate personality quizzes for my personality quizzes website. You will be given a prompt and you will generate ${numberOfQuestions} questions for that prompt. Each question will be multiple choice with 4 options. Each question should be something tells you something about that persons personality, be creative. You can create scenarios, ask for preferences, or more. Then depending on the users choices, I will assign a result to the user. Each answer should assign a points value to one of the potential results. The questions JSON should include how many points go towards each result based on the answer Create both the questions and answers JSON for this prompt. Here are the types \\n\\ninterface Questions {\\n   question: string;\\n   options: Options[];\\n}\\n\\ninterface Options {\\n   option: string;\\n   points: { result: Result, points: number }[];\\n}\"\n}`,
			},
			{
				role: 'system',
				content: `There should be ${numberOfQuestions} total`,
			},
			{
				role: 'system',
				content:
					'Make it so that there arent too many results. Do about 3-5 results per 10 questions',
			},
			{
				role: 'user',
				content: prompt,
			},
		],
		functions: [{ name: 'get_questions', parameters: schema }],
		function_call: { name: 'get_questions' },
	});

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response);

	// Respond with the stream
	return new StreamingTextResponse(stream);
}
