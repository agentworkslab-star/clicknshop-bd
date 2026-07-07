import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6 bangla">পেজ পাওয়া যায়নি</p>
        <Button asChild><Link href="/dashboard"><Home className="mr-2 h-4 w-4" /> Dashboard এ যান</Link></Button>
      </div>
    </div>
  );
}