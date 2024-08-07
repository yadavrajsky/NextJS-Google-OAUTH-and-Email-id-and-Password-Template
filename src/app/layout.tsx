import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { Toaster } from 'react-hot-toast';

import SessionProvider from '@/providers/SessionProvider';
import NavMenu from '@/components/NavMenu';
import connectToDB from '@/lib/db';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession();
	return (
		<html lang="en">
			<body className={inter.className}>
				<SessionProvider session={session}>
					<NavMenu />
					{children}
				</SessionProvider>
				<Toaster />
			</body>
		</html>
	);
}
