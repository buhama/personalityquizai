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
							required: ['question'],
						},
						options: {
							type: 'array',
							description: 'List of options to choose from.',
							items: {
								type: 'string',
								required: ['option'],
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
				content: `{\n\trole: 'system',\n\tcontent:\n\t\t\"You're going to help me generate personality quizzes for my personality quizzes website. You will be given a prompt and you will generate ${numberOfQuestions} questions for that prompt. Each question will be multiple choice with 4 options. Each question should be something tells you something about that persons personality, be creative. You can create scenarios, ask for preferences, or more`,
			},
			{
				role: 'system',
				content: `There should be ${numberOfQuestions} total. Dont ask the same question more than once. `,
			},
			{
				role: 'system',
				content:
					'Make it so that there arent too many unique results. Do about 3-5 results per 10 questions',
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
