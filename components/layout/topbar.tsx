'use client';
import { Bell, Search, ChevronDown, LogOut, Settings as SettingsIcon, Building2, Shield, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { logoutAction } from '@/app/(authed)/actions';

interface User {
  id: string;
  brandName: string;
  name?: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl: string | null;
}

export function Topbar({ user }: { user: User }) {
  const displayName = user.brandName || user.name || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-2/80 backdrop-blur-xl border-b border-default">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
            <input
              type="search"
              placeholder="Search products, content, templates..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-glass border border-default text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all"
            />
          </div>
        </div>
        <div className="md:hidden flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <button className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary hover:bg-glass-hover hover:text-primary transition-colors" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-glass-hover transition-colors">
                <Avatar className="h-9 w-9 ring-2 ring-accent-blue/30">
                  <AvatarImage src={user.avatarUrl || undefined} />
                  <AvatarFallback className="bg-brand-gradient text-white text-xs font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold leading-none text-primary">{displayName}</div>
                  <div className="text-xs text-secondary leading-none mt-0.5">{user.email}</div>
                </div>
                <ChevronDown className="hidden md:block h-4 w-4 text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-2 py-2">
                <p className="text-sm font-semibold text-primary">{displayName}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-blue/20 px-2 py-0.5 text-xs font-semibold text-accent-blue border border-accent-blue/30">
                  <Shield className="h-3 w-3" />
                  {user.role === 'ADMIN' ? 'Administrator' : 'Personal User'}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="bangla flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/brand" className="bangla flex items-center gap-2 cursor-pointer">
                  <Building2 className="h-4 w-4" /> Brand Memory
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="bangla flex items-center gap-2 cursor-pointer">
                  <SettingsIcon className="h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              {user.role === 'ADMIN' && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="bangla flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" /> Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <form action={logoutAction}>
                <button type="submit" className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-glass-hover text-red-400 flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" /> <span className="bangla">Logout</span>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
