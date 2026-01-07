import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const supabase = await createClient();

		const { data, error } = await supabase
			.from('quizzes')
			.select('*')
			.eq('id', id)
			.single();

		if (error || !data) {
			return NextResponse.json(
				{ error: 'Quiz not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error('Error fetching quiz:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch quiz' },
			{ status: 500 }
		);
	}
}
