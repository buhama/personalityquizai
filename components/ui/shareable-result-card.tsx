interface ShareableResultCardProps {
	title: string;
	result: string;
}

export function ShareableResultCard({ title, result }: ShareableResultCardProps) {
	return (
		<div className='flex flex-col items-center gap-6 my-8'>
			<div className='w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] bg-purple-900/30 rounded-2xl p-8 flex flex-col items-center justify-between border border-purple-500/30'>
				<div className='text-center'>
					<p className='text-purple-300/70 text-sm uppercase tracking-widest'>I took the quiz</p>
					<p className='text-white/90 text-lg font-medium mt-1 line-clamp-2'>{title}</p>
				</div>

				<div className='text-center flex-1 flex flex-col items-center justify-center'>
					<p className='text-purple-300/60 text-xs uppercase tracking-wider mb-2'>My result is</p>
					<p className='text-white text-2xl sm:text-3xl font-bold text-center leading-tight'>{result}</p>
				</div>

				<div className='text-center'>
					<p className='text-purple-400/50 text-xs'>personalityquiz.ai</p>
				</div>
			</div>

			<p className='text-gray-400 text-sm text-center'>Screenshot and share your result!</p>
		</div>
	);
}
