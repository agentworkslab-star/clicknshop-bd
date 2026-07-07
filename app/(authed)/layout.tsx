import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/dashboard'); // Bypass: never redirect to login

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-[260px]">
        <Topbar user={{ ...user, role: (user.role === 'ADMIN' ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN' }} />
        <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl animate-fade-in pb-24 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}