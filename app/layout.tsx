import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Personality Quiz AI',
	description: 'Create your own personality quizzes',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<head>
				<script>test</script>
			</head>
			<body className={inter.className}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
