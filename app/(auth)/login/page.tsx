import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { LoginForm } from './login-form';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-blue/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-purple/20 blur-3xl" />
      </div>

      <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-11 w-11 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow-blue">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-gradient">BizAI Pro</span>
        </Link>

        <div className="card p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold bangla">স্বাগতম!</h1>
            <p className="text-sm text-secondary mt-1 bangla">আপনার account-এ login করুন</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm text-secondary bangla">
            Account নেই?{' '}
            <Link href="/register" className="text-accent-blue font-medium hover:underline">
              Register করুন
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-4">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}