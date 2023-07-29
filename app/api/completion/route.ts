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
	const { prompt } = await req.json();

	// Request the OpenAI API for the response based on the prompt
	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		stream: true,
		messages: [
			{
				role: 'system',
				content:
					'You are a helpful bot that is going to generate marketing descriptions for events, for a ticketing website.',
			},
			{
				role: 'user',
				content: prompt,
			},
		],
	});

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response);

	// Respond with the stream
	return new StreamingTextResponse(stream);
}
