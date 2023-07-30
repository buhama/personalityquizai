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
	const { questions, prompt } = await req.json();
	console.log(questions);

	// Request the OpenAI API for the response based on the prompt
	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo-16k-0613',
		stream: true,
		messages: [
			{
				role: 'system',
				content:
					'you are part of an ai assistant that creates online quizzes based on prompts. the quiz has already been created, its time to get the result. You are going to be provided with the prompt and the questions and you have to give a result based on the answers with some context as well. Create a list of results and pick from them. Dont pick the most popular one, pick one that is relevant to the answers.',
			},
			{
				role: 'system',
				content:
					'The prompt is: ' +
					prompt +
					'Answer the prompt for the user based on their answers to questions found here ' +
					JSON.stringify(questions) +
					'MAKE SURE TO ANSWER BASED ON THE ANSWERS FROM THE QUESTOINS',
			},

			{
				role: 'system',
				content:
					'The response should be formatted like the end of a buzzfeed quiz or a myers briggs test. Where there is one result and then more information about that result.',
			},
			{
				role: 'system',
				content:
					'Give the response in html format and correctly format it so the result is bolded using <strong> tags, then there is a line break using <br/> tags and then the description of the result. ONLY give the html no other messages',
			},
		],
	});

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response);

	// Respond with the stream
	return new StreamingTextResponse(stream);
}
