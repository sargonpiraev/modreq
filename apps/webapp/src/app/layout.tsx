import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';

const display = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700'],
});

const body = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'modreq — Modify HTTP Headers',
  description:
    'Free Chrome extension to replace or append HTTP request headers and override cookies. A simple ModHeader alternative.',
  openGraph: {
    title: 'modreq — Modify HTTP Headers',
    description:
      'Replace or append request headers. Override cookies. Local-only rules for developers and QA.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
