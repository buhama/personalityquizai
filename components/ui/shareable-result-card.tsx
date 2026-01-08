'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { Copy, Loader2 } from 'lucide-react';

interface ShareableResultCardProps {
	title: string;
	result: string;
}

export function ShareableResultCard({ title, result }: ShareableResultCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [copying, setCopying] = useState(false);

	const handleCopy = async () => {
		if (!cardRef.current) return;

		try {
			setCopying(true);
			const canvas = await html2canvas(cardRef.current, {
				backgroundColor: '#1a1a2e',
				scale: 4,
				useCORS: true,
				allowTaint: true,
				logging: false,
			});

			canvas.toBlob(async (blob) => {
				if (blob) {
					try {
						await navigator.clipboard.write([
							new ClipboardItem({ 'image/png': blob })
						]);
						toast.success('Copied!');
					} catch {
						const url = canvas.toDataURL('image/png');
						const link = document.createElement('a');
						link.download = 'quiz-result.png';
						link.href = url;
						link.click();
					}
				}
			}, 'image/png');
		} catch (err) {
			console.error('Failed to copy:', err);
		} finally {
			setCopying(false);
		}
	};

	return (
		<div className='relative'>
			<div
				ref={cardRef}
				className='w-[320px] min-h-[320px] sm:w-[400px] sm:min-h-[400px] bg-purple-900/30 rounded-2xl p-8 flex flex-col items-center justify-between border border-purple-500/30'
			>
				<div className='text-center'>
					<p className='text-purple-300/60 text-sm'>{title}</p>
				</div>

				<div className='text-center flex-1 flex flex-col items-center justify-center'>
					<p className='text-white text-3xl sm:text-4xl font-bold text-center leading-tight'>{result}</p>
				</div>

				<div className='text-center'>
					<p className='text-purple-400/50 text-xs'>personalityquizai.vercel.app</p>
				</div>
			</div>

			<button
				onClick={handleCopy}
				disabled={copying}
				className='absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-purple-300 bg-purple-900/80 border border-purple-500/30 hover:bg-purple-800/80 transition-colors disabled:opacity-50'
			>
				{copying ? (
					<Loader2 className='h-3 w-3 animate-spin' />
				) : (
					<Copy className='h-3 w-3' />
				)}
				<span>{copying ? 'Copying' : 'Copy'}</span>
			</button>
		</div>
	);
}
