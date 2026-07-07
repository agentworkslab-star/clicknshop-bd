import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { RegisterForm } from './register-form';
import { ThemeToggle } from '@/components/theme-toggle';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-accent-purple/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-accent-cyan/20 blur-3xl" />
      </div>

      <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-11 w-11 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow-purple">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-gradient">BizAI Pro</span>
        </Link>

        <div className="card p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold bangla">Account তৈরি করুন</h1>
            <p className="text-sm text-secondary mt-1 bangla">ফ্রি — কোনো credit card লাগবে না</p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center text-sm text-secondary bangla">
            Account আছে?{' '}
            <Link href="/login" className="text-accent-blue font-medium hover:underline">
              Login করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}