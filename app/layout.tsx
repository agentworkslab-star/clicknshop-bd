import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ClickNShop.bd — AI-Powered Bangla Marketing Workspace',
    template: '%s | ClickNShop.bd',
  },
  description: 'Generate emotionally engaging, scroll-stopping Bangla and Bangla-English mixed marketing scripts, hooks, and ad copy in seconds.',
  keywords: ['ClickNShop', 'Bangla AI', 'marketing copy', 'Facebook ads', 'Bangla copywriter', 'AI content', 'Bangladeshi marketing', 'clicknshop.bd'],
  authors: [{ name: 'ClickNShop.bd' }],
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ClickNShop.bd',
    title: 'ClickNShop.bd — AI-Powered Bangla Marketing Workspace',
    description: 'Generate emotionally engaging Bangla marketing scripts in seconds.',
    url: 'https://clicknshop.bd',
  },
  alternates: {
    canonical: 'https://clicknshop.bd',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0b3d0b" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}