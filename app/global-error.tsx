'use client';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="bn">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <div className="h-16 w-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2 bangla">কিছু সমস্যা হয়েছে</h1>
            <p className="text-muted-foreground mb-6 bangla">দুঃখিত, একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।</p>
            {error.message && (
              <p className="text-xs text-muted-foreground bg-muted rounded p-2 mb-4 font-mono">{error.message}</p>
            )}
            <div className="flex gap-2 justify-center">
              <Button onClick={reset}><RefreshCw className="mr-2 h-4 w-4" /> আবার চেষ্টা করুন</Button>
              <Button variant="outline" asChild><Link href="/"><Home className="mr-2 h-4 w-4" /> হোমে যান</Link></Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}