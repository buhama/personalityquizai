import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { title, questions } = await req.json();

		if (!title || !questions || questions.length === 0) {
			return NextResponse.json(
				{ error: 'Title and questions are required' },
				{ status: 400 }
			);
		}

		const supabase = await createClient();

		const { data, error } = await supabase
			.from('quizzes')
			.insert({
				id: crypto.randomUUID(),
				title,
				questions_json: questions,
			})
			.select('id')
			.single();

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json(
				{ error: 'Failed to publish quiz' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ id: data.id });
	} catch (error) {
		console.error('Error publishing quiz:', error);
		return NextResponse.json(
			{ error: 'Failed to publish quiz' },
			{ status: 500 }
		);
	}
}
