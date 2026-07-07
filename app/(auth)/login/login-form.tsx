'use client';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '../actions';
import { demoLoginAction } from '../demo-action';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> লগইন হচ্ছে...</>
      ) : (
        <>লগইন করুন</>
      )}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="bangla">ইমেইল</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="email" name="email" type="email" placeholder="you@example.com" required className="pl-10" autoComplete="email" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="bangla">পাসওয়ার্ড</Label>
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">ভুলে গেছেন?</Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="password" name="password" type="password" placeholder="••••••••" required className="pl-10" autoComplete="current-password" />
        </div>
      </div>

      <SubmitButton />

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground bangla">অথবা</span>
        </div>
      </div>

      {/* Try Demo Button - Quick login without typing credentials */}
      <form action={demoLoginAction}>
        <Button type="submit" variant="secondary" className="w-full" size="lg">
          <Sparkles className="mr-2 h-4 w-4" /> Try Demo (এক ক্লিকে দেখুন)
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2 bangla">
          Demo data সহ auto-login হবে — কোনো credential লাগবে না
        </p>
      </form>
    </form>
  );
}