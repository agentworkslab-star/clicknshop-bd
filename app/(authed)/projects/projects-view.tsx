'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FolderOpen, Search, Star, Trash2, Copy, Edit, Download, FileText,
  MoreVertical, Plus, Folder, Filter, Check, X, Eye, FolderPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TEMPLATE_LABELS, timeAgo, copyToClipboard, cn } from '@/lib/utils';
import { exportAsTxt, exportAsDocx, exportAsPdf, exportBulkAsPdf, ExportItem } from '@/lib/export';
import { toast } from 'sonner';
import {
  createFolderAction, deleteFolderAction, moveToFolderAction,
  toggleFavoriteAction, deleteContentAction, deleteBulkAction, duplicateContentAction,
} from './actions';

interface Content {
  id: string; templateType: string; outputText: string; language: string;
  isFavorite: boolean; tags: string[]; folderId: string | null;
  createdAt: string; product?: { name: string } | null;
}

interface Folder { id: string; name: string; color: string; }

export function ProjectsView({ initialContent, folders }: { initialContent: Content[]; folders: Folder[] }) {
  const [contents, setContents] = useState<Content[]>(initialContent);
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [favOnly, setFavOnly] = useState(false);
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewingId, setViewingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return contents.filter(c => {
      if (search) {
        const q = search.toLowerCase();
        if (!c.outputText.toLowerCase().includes(q) &&
          !TEMPLATE_LABELS[c.templateType]?.label.toLowerCase().includes(q) &&
          !c.product?.name?.toLowerCase().includes(q)) return false;
      }
      if (folderFilter !== 'all' && c.folderId !== folderFilter) return false;
      if (favOnly && !c.isFavorite) return false;
      if (templateFilter !== 'all' && c.templateType !== templateFilter) return false;
      return true;
    });
  }, [contents, search, folderFilter, favOnly, templateFilter]);

  async function handleDelete(id: string) {
    if (!confirm('Delete করতে চান?')) return;
    const res = await deleteContentAction(id);
    if (res?.success) {
      setContents(contents.filter(c => c.id !== id));
      toast.success('Delete হয়েছে');
    }
  }

  async function handleToggleFav(id: string) {
    const res = await toggleFavoriteAction(id);
    if (res?.success) {
      setContents(contents.map(c => c.id === id ? { ...c, isFavorite: res.isFavorite! } : c));
    }
  }

  async function handleDuplicate(id: string) {
    const res = await duplicateContentAction(id);
    if (res?.success) {
      toast.success('Duplicate হয়েছে — refresh করুন');
      setTimeout(() => window.location.reload(), 500);
    }
  }

  async function handleMove(id: string, folderId: string | null) {
    await moveToFolderAction(id, folderId);
    setContents(contents.map(c => c.id === id ? { ...c, folderId } : c));
    toast.success('Folder এ move হয়েছে');
  }

  function toggleSelect(id: string) {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`${selected.size}টি delete করতে চান?`)) return;
    const res = await deleteBulkAction(Array.from(selected));
    if (res?.success) {
      setContents(contents.filter(c => !selected.has(c.id)));
      setSelected(new Set());
      toast.success('Bulk delete complete');
    }
  }

  function handleBulkExportPdf() {
    if (selected.size === 0) return;
    const items: ExportItem[] = contents
      .filter(c => selected.has(c.id))
      .map(c => ({
        title: TEMPLATE_LABELS[c.templateType]?.label || c.templateType,
        content: c.outputText,
        meta: { Product: c.product?.name || 'N/A', Language: c.language, Date: new Date(c.createdAt).toLocaleString() },
      }));
    exportBulkAsPdf('Saved Projects Export', items);
    toast.success('PDF exported');
  }

  function handleSingleExport(c: Content, format: 'txt' | 'docx' | 'pdf') {
    const item: ExportItem = {
      title: TEMPLATE_LABELS[c.templateType]?.label || c.templateType,
      content: c.outputText,
      meta: { Product: c.product?.name || 'N/A', Language: c.language, Date: new Date(c.createdAt).toLocaleString() },
    };
    if (format === 'txt') exportAsTxt([item]);
    else if (format === 'pdf') exportAsPdf([item]);
    else exportAsDocx([item]).then(() => toast.success('DOCX exported'));
  }

  async function handleCopy(c: Content) {
    const ok = await copyToClipboard(c.outputText);
    if (ok) toast.success('কপি হয়েছে');
  }

  const viewing = viewingId ? contents.find(c => c.id === viewingId) : null;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search content..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={folderFilter} onValueChange={setFolderFilter}>
              <SelectTrigger className="w-full lg:w-48"><SelectValue placeholder="Folder" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                <SelectItem value="">— Uncategorized —</SelectItem>
                {folders.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={templateFilter} onValueChange={setTemplateFilter}>
              <SelectTrigger className="w-full lg:w-48"><SelectValue placeholder="Template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                {Object.entries(TEMPLATE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant={favOnly ? 'default' : 'outline'} onClick={() => setFavOnly(!favOnly)}>
              <Star className={cn('mr-2 h-4 w-4', favOnly && 'fill-current')} /> Favorites
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground bangla">{filtered.length}টি item</p>
            <NewFolderDialog folders={folders} />
          </div>
        </CardContent>
      </Card>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <Card className="bg-primary/5 border-primary/30">
          <CardContent className="p-3 flex items-center justify-between">
            <p className="text-sm font-medium bangla">{selected.size}টি select করা হয়েছে</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleBulkExportPdf}>
                <Download className="mr-2 h-3.5 w-3.5" /> Export PDF
              </Button>
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="bangla">কোনো saved content নেই</p>
            <Button asChild className="mt-4"><Link href="/ai-writer">Content তৈরি করুন</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => {
            const t = TEMPLATE_LABELS[c.templateType];
            const folder = folders.find(f => f.id === c.folderId);
            return (
              <Card key={c.id} className="hover:-translate-y-1 transition-transform group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Checkbox checked={selected.has(c.id)} onCheckedChange={() => toggleSelect(c.id)} />
                      <Badge variant="outline" className="text-xs">{t?.label || c.templateType}</Badge>
                      {folder && (
                        <Badge variant="secondary" className="text-xs">
                          <span className="w-2 h-2 rounded-full mr-1" style={{ background: folder.color }} />
                          {folder.name}
                        </Badge>
                      )}
                    </div>
                    <button onClick={() => handleToggleFav(c.id)} className="shrink-0">
                      <Star className={cn('h-4 w-4', c.isFavorite ? 'fill-accent-blue text-accent-blue' : 'text-muted-foreground hover:text-accent-blue')} />
                    </button>
                  </div>
                  <p className="text-sm line-clamp-3 mb-3">{c.outputText}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{timeAgo(c.createdAt)}</span>
                    {c.product && <span className="truncate ml-2">{c.product.name}</span>}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Button size="sm" variant="ghost" onClick={() => setViewingId(c.id)}><Eye className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleCopy(c)}><Copy className="h-3.5 w-3.5" /></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleSingleExport(c, 'txt')}>📄 Export as TXT</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSingleExport(c, 'docx')}>📘 Export as DOCX</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSingleExport(c, 'pdf')}>📕 Export as PDF</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost"><MoreVertical className="h-3.5 w-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {folders.length > 0 && (
                          <>
                            <DropdownMenuItem className="font-medium bangla">📁 Move to Folder</DropdownMenuItem>
                            {folders.map(f => (
                              <DropdownMenuItem key={f.id} onClick={() => handleMove(c.id, f.id)}>
                                <span className="w-3 h-3 rounded-full mr-2" style={{ background: f.color }} />
                                {f.name}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem onClick={() => handleMove(c.id, null)}>— Remove from folder —</DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => handleDuplicate(c.id)}><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(c.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewingId(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewing && TEMPLATE_LABELS[viewing.templateType]?.label}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge>{viewing.language}</Badge>
                {viewing.product && <Badge variant="secondary">{viewing.product.name}</Badge>}
                <Badge variant="outline">{timeAgo(viewing.createdAt)}</Badge>
              </div>
              <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap">{viewing.outputText}</div>
              <div className="flex gap-2">
                <Button onClick={() => handleCopy(viewing)}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                <Button variant="outline" onClick={() => handleSingleExport(viewing, 'txt')}>Download TXT</Button>
                <Button variant="outline" onClick={() => handleSingleExport(viewing, 'pdf')}>Download PDF</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewFolderDialog({ folders }: { folders: Folder[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366F1');

  async function handleCreate() {
    if (!name.trim()) return;
    const fd = new FormData();
    fd.append('name', name);
    fd.append('color', color);
    const res = await createFolderAction({}, fd);
    if (res?.success) {
      toast.success(res.success);
      setOpen(false);
      setName('');
      setTimeout(() => window.location.reload(), 500);
    } else toast.error(res?.error);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><FolderPlus className="mr-2 h-4 w-4" /> New Folder</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="bangla">নতুন Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium bangla">Folder নাম</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="যেমন: Festival Posts" />
          </div>
          <div>
            <label className="text-sm font-medium bangla">Color</label>
            <div className="flex gap-2 flex-wrap">
              {['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'].map(c => (
                <button key={c} onClick={() => setColor(c)} className={cn('w-8 h-8 rounded-md border-2', color === c && 'border-foreground')} style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}