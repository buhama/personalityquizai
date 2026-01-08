import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://personalityquiz.ai';

export const metadata: Metadata = {
	title: 'Personality Quiz AI',
	description: 'Create your own personality quizzes with AI. Generate fun, shareable quizzes in seconds.',
	metadataBase: new URL(baseUrl),
	openGraph: {
		title: 'Personality Quiz AI',
		description: 'Create your own personality quizzes with AI. Generate fun, shareable quizzes in seconds.',
		type: 'website',
		siteName: 'Personality Quiz AI',
		url: baseUrl,
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Personality Quiz AI',
		description: 'Create your own personality quizzes with AI. Generate fun, shareable quizzes in seconds.',
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
