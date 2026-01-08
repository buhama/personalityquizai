import { ImageResponse } from '@vercel/og';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	// Fetch quiz data
	const supabase = await createClient();
	const { data: quiz, error } = await supabase
		.from('quizzes')
		.select('title, questions_json')
		.eq('id', id)
		.single();

	if (error || !quiz) {
		// Return a default image for invalid quizzes
		return new ImageResponse(
			(
				<div
					style={{
						height: '100%',
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
					}}
				>
					<div
						style={{
							display: 'flex',
							fontSize: 48,
							fontWeight: 'bold',
							color: 'white',
						}}
					>
						Quiz Not Found
					</div>
				</div>
			),
			{
				width: 1200,
				height: 630,
			}
		);
	}

	const questionCount = quiz.questions_json?.length || 0;

	// Extract possible results from the quiz
	const results = new Set<string>();
	quiz.questions_json?.forEach((q: { options?: { points?: { result: string }[] }[] }) => {
		q.options?.forEach((o) => {
			o.points?.forEach((p) => {
				results.add(p.result);
			});
		});
	});
	const resultCount = results.size;

	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
					padding: '60px',
					position: 'relative',
				}}
			>
				{/* Decorative elements */}
				<div
					style={{
						position: 'absolute',
						top: '40px',
						right: '60px',
						width: '120px',
						height: '120px',
						borderRadius: '50%',
						background: 'rgba(168, 85, 247, 0.2)',
						filter: 'blur(40px)',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						bottom: '100px',
						left: '100px',
						width: '200px',
						height: '200px',
						borderRadius: '50%',
						background: 'rgba(99, 102, 241, 0.15)',
						filter: 'blur(60px)',
					}}
				/>

				{/* Header */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '16px',
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '56px',
							height: '56px',
							borderRadius: '12px',
							background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
						}}
					>
						<svg
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
							<line x1="12" y1="17" x2="12.01" y2="17" />
						</svg>
					</div>
					<span
						style={{
							color: 'rgba(168, 85, 247, 0.8)',
							fontSize: '24px',
							fontWeight: '500',
							letterSpacing: '0.05em',
						}}
					>
						PERSONALITY QUIZ
					</span>
				</div>

				{/* Quiz Title */}
				<div
					style={{
						display: 'flex',
						flex: 1,
						alignItems: 'center',
					}}
				>
					<h1
						style={{
							color: 'white',
							fontSize: quiz.title.length > 50 ? '56px' : '72px',
							fontWeight: 'bold',
							lineHeight: 1.2,
							maxWidth: '900px',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{quiz.title}
					</h1>
				</div>

				{/* Footer stats */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-end',
					}}
				>
					<div
						style={{
							display: 'flex',
							gap: '40px',
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '4px',
							}}
						>
							<span
								style={{
									color: 'rgba(255, 255, 255, 0.5)',
									fontSize: '18px',
									textTransform: 'uppercase',
									letterSpacing: '0.1em',
								}}
							>
								Questions
							</span>
							<span
								style={{
									color: 'white',
									fontSize: '36px',
									fontWeight: 'bold',
								}}
							>
								{questionCount}
							</span>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '4px',
							}}
						>
							<span
								style={{
									color: 'rgba(255, 255, 255, 0.5)',
									fontSize: '18px',
									textTransform: 'uppercase',
									letterSpacing: '0.1em',
								}}
							>
								Possible Results
							</span>
							<span
								style={{
									color: 'white',
									fontSize: '36px',
									fontWeight: 'bold',
								}}
							>
								{resultCount}
							</span>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							color: 'rgba(255, 255, 255, 0.6)',
							fontSize: '20px',
						}}
					>
						<span>personalityquiz.ai</span>
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}
