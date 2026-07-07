import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import Link from 'next/link';
import { Shield, Users, FileText, BarChart3, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/admin', label: 'Overview', labelBn: 'সারসংক্ষেপ', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', labelBn: 'ইউজার', icon: Users },
  { href: '/admin/templates', label: 'Templates', labelBn: 'টেমপ্লেট', icon: FileText },
  { href: '/admin/logs', label: 'Logs', labelBn: 'লগ', icon: Activity },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/dashboard'); // Bypass: always allow
  if (user.role !== 'ADMIN') redirect('/dashboard'); // Bypass still: just redirect to user dashboard

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <div className="lg:pl-[260px]">
        <Topbar user={{ ...user, role: (user.role === 'ADMIN' ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN' }} />
        <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bangla">Admin Panel</h1>
              <p className="text-sm text-muted-foreground bangla">System management ও analytics</p>
            </div>
          </div>
          {/* Admin Tabs */}
          <nav className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(t => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-accent whitespace-nowrap"
              >
                <t.icon className="h-4 w-4" />
                <span className="bangla">{t.labelBn}</span>
              </Link>
            ))}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}