export const dynamic = "force-dynamic";
import { Settings as SettingsIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { SettingsView } from './settings-view';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const apiSettings = await prisma.apiSettings.findUnique({ where: { userId: user.id } });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <SettingsIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bangla">Settings</h1>
          <p className="text-sm text-muted-foreground bangla">Profile, API, Preferences, Notifications</p>
        </div>
      </div>
      <SettingsView user={user} apiSettings={apiSettings} />
    </div>
  );
}