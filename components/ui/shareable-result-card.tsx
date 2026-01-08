'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { Button } from './button';

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
						toast.success('Image copied to clipboard!');
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
		<div className='flex flex-col items-center gap-4'>
			<div
				ref={cardRef}
				className='w-[320px] min-h-[320px] sm:w-[400px] sm:min-h-[400px] bg-purple-900/30 rounded-2xl p-8 flex flex-col items-center justify-between border border-purple-500/30'
			>
				<div className='text-center'>
					<p className='text-purple-300/70 text-sm uppercase tracking-widest'>I took the quiz</p>
					<p className='text-white/90 text-lg font-medium mt-1'>{title}</p>
				</div>

				<div className='text-center flex-1 flex flex-col items-center justify-center py-4'>
					<p className='text-purple-300/60 text-xs uppercase tracking-wider mb-2'>My result is</p>
					<p className='text-white text-2xl sm:text-3xl font-bold text-center leading-tight'>{result}</p>
				</div>

				<div className='text-center'>
					<p className='text-purple-400/50 text-xs'>personalityquiz.ai</p>
				</div>
			</div>

			<Button onClick={handleCopy} disabled={copying} variant='outline' size='sm'>
				{copying ? 'Copying...' : 'Copy Image'}
			</Button>
		</div>
	);
}
