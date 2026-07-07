'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, Package, PenTool, ImageIcon,
  FolderOpen, Settings, Sparkles, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: LayoutDashboard },
  { href: '/brand', label: 'Brand Memory', labelBn: 'ব্র্যান্ড মেমোরি', icon: Building2 },
  { href: '/products', label: 'Product Library', labelBn: 'প্রোডাক্ট লাইব্রেরি', icon: Package },
  { href: '/ai-writer', label: 'AI Writer', labelBn: 'AI রাইটার', icon: PenTool },
  { href: '/image-prompt', label: 'Image Prompt', labelBn: 'ইমেজ প্রম্পট', icon: ImageIcon },
  { href: '/projects', label: 'Saved Projects', labelBn: 'সেভড প্রজেক্ট', icon: FolderOpen },
  { href: '/settings', label: 'Settings', labelBn: 'সেটিংস', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar — LEFT SIDE, DARK */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-200',
          'bg-surface-2 border-r border-default',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-default">
          <Link href="/dashboard" className={cn('flex items-center gap-2 overflow-hidden', collapsed && 'justify-center w-full')}>
            <div className="h-9 w-9 rounded-lg bg-brand-gradient flex items-center justify-center shrink-0 glow-blue">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {!collapsed && <span className="font-bold text-lg text-gradient whitespace-nowrap">ClickNShop.bd</span>}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-brand-gradient text-white glow-blue'
                    : 'text-secondary hover:bg-glass-hover hover:text-primary',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.labelBn : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="bangla">{item.labelBn}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-default">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-secondary hover:bg-glass-hover hover:text-primary transition-colors"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : (
              <><ChevronsLeft className="h-4 w-4" /> <span className="bangla">সংকুচিত</span></>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-2 border-t border-default backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1 p-1">
          {menuItems.slice(0, 5).map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-md py-2 px-1 text-[10px] font-medium transition-colors',
                  active ? 'bg-accent-blue/20 text-accent-blue' : 'text-secondary'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="bangla truncate w-full text-center">{item.labelBn}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
