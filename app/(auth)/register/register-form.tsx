'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerAction } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Account তৈরি হচ্ছে...</>
      ) : (
        <>ফ্রি Account তৈরি করুন</>
      )}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="bangla">নাম</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="name" name="name" type="text" placeholder="আপনার নাম" required className="pl-10" autoComplete="name" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="bangla">ইমেইল</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="email" name="email" type="email" placeholder="you@example.com" required className="pl-10" autoComplete="email" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="bangla">পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} className="pl-10" autoComplete="new-password" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="bangla">পাসওয়ার্ড নিশ্চিত করুন</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required minLength={8} className="pl-10" autoComplete="new-password" />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}