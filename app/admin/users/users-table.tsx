'use client';
import { useState } from 'react';
import { Search, MoreVertical, Trash2, Shield, ShieldOff, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import { toggleSuspendAction, changeRoleAction, deleteUserAction } from './actions';
import { toast } from 'sonner';

export function AdminUsersTable({ users }: { users: any[] }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u =>
    u.brandName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSuspend(id: string) {
    const res = await toggleSuspendAction(id);
    if (res?.success) { toast.success('Updated'); setTimeout(() => window.location.reload(), 500); }
  }
  async function handleRole(id: string, role: 'USER' | 'ADMIN') {
    const res = await changeRoleAction(id, role);
    if (res?.success) { toast.success('Role updated'); setTimeout(() => window.location.reload(), 500); }
  }
  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" delete করতে চান?`)) return;
    const res = await deleteUserAction(id);
    if (res?.success) { toast.success('Deleted'); setTimeout(() => window.location.reload(), 500); }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Products</th>
              <th className="text-left p-3">Contents</th>
              <th className="text-left p-3">Joined</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const initials = u.brandName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <tr key={u.id} className="border-t hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{u.brandName}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {u.role === 'ADMIN' ? <Badge variant="destructive">ADMIN</Badge> : <Badge variant="secondary">USER</Badge>}
                  </td>
                  <td className="p-3">
                    {u.isSuspended ? <Badge variant="outline" className="text-red-500">Suspended</Badge> : <Badge variant="outline" className="text-green-600">Active</Badge>}
                  </td>
                  <td className="p-3">{u._count?.products || 0}</td>
                  <td className="p-3">{u._count?.contents || 0}</td>
                  <td className="p-3 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSuspend(u.id)}>
                          {u.isSuspended ? <><UserCheck className="mr-2 h-4 w-4" /> Activate</> : <><ShieldOff className="mr-2 h-4 w-4" /> Suspend</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRole(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}>
                          {u.role === 'ADMIN' ? <><ShieldOff className="mr-2 h-4 w-4" /> Demote to User</> : <><Shield className="mr-2 h-4 w-4" /> Promote to Admin</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(u.id, u.brandName)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}