'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, Grid3x3, List, Filter, Download, Upload, Edit, Trash2, Copy, Sparkles, MoreVertical, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency, parseStringArray } from '@/lib/utils';
import { toast } from 'sonner';
import { deleteProductAction, duplicateProductAction } from './actions';

interface Product {
  id: string; name: string; category: string | null; weight: string | null;
  shortDesc: string | null; longDesc: string | null;
  benefits: string; price: any; discountPrice: any;
  seoKeywords: string; images: string; stockStatus: string;
  sku: string | null; createdAt: Date; updatedAt: Date;
}

const STOCK_COLORS = {
  IN_STOCK: 'bg-green-500/10 text-green-600',
  OUT_OF_STOCK: 'bg-red-500/10 text-red-600',
  LOW_STOCK: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
};

const STOCK_LABELS = {
  IN_STOCK: 'স্টকে আছে', OUT_OF_STOCK: 'স্টকে নেই', LOW_STOCK: 'কম আছে',
};

export function ProductsView({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

  const filtered = products
    .filter(p => {
      if (search) {
        const q = search.toLowerCase();
        const keywords = parseStringArray(p.seoKeywords);
        return p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.shortDesc?.toLowerCase().includes(q) ||
          keywords.some(k => k.toLowerCase().includes(q));
      }
      return true;
    })
    .filter(p => category === 'all' || p.category === category)
    .filter(p => stockFilter === 'all' || p.stockStatus === stockFilter)
    .sort((a, b) => {
      switch (sort) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price-low': return Number(a.price || 0) - Number(b.price || 0);
        case 'price-high': return Number(b.price || 0) - Number(a.price || 0);
        case 'newest': default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" ডিলিট করতে চান?`)) return;
    const res = await deleteProductAction(id);
    if (res?.success) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('প্রোডাক্ট ডিলিট হয়েছে');
    } else toast.error('ডিলিট করতে সমস্যা হয়েছে');
  }

  async function handleDuplicate(id: string) {
    const res = await duplicateProductAction(id);
    if (res?.success) {
      toast.success(res.success);
      window.location.reload();
    } else toast.error('কপি করতে সমস্যা হয়েছে');
  }

  function exportCSV() {
    const headers = ['Name', 'Category', 'Price', 'Discount', 'Stock', 'SKU'];
    const rows = filtered.map(p => [
      p.name, p.category || '', p.price || '', p.discountPrice || '', p.stockStatus, p.sku || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `products-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV export হয়েছে');
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="নাম, ক্যাটাগরি, কীওয়ার্ড..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full lg:w-40"><SelectValue placeholder="ক্যাটাগরি" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full lg:w-36"><SelectValue placeholder="স্টক" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব</SelectItem>
                <SelectItem value="IN_STOCK">স্টকে আছে</SelectItem>
                <SelectItem value="LOW_STOCK">কম আছে</SelectItem>
                <SelectItem value="OUT_OF_STOCK">স্টকে নেই</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full lg:w-40"><SelectValue placeholder="সর্ট" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">নতুন আগে</SelectItem>
                <SelectItem value="name">নাম (A-Z)</SelectItem>
                <SelectItem value="price-low">মূল্য (কম → বেশি)</SelectItem>
                <SelectItem value="price-high">মূল্য (বেশি → কম)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}><Grid3x3 className="h-4 w-4" /></Button>
              <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}><List className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground bangla">{filtered.length}টি প্রোডাক্ট পাওয়া গেছে</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="mr-2 h-4 w-4" /> CSV Export</Button>
          <Button variant="outline" size="sm" disabled title="CSV Import শীঘ্রই"><Upload className="mr-2 h-4 w-4" /> Import</Button>
          <Button asChild size="sm"><Link href="/products/new"><Plus className="mr-2 h-4 w-4" /> নতুন প্রোডাক্ট</Link></Button>
        </div>
      </div>

      {/* Products */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="bangla">কোনো প্রোডাক্ট নেই</p>
            <Button asChild className="mt-4"><Link href="/products/new">প্রথম প্রোডাক্ট যোগ করুন</Link></Button>
          </CardContent>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} onDelete={handleDelete} onDuplicate={handleDuplicate} />)}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filtered.map(p => <ProductRow key={p.id} product={p} onDelete={handleDelete} onDuplicate={handleDuplicate} />)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProductCard({ product, onDelete, onDuplicate }: any) {
  const p: Product = product;
  const benefits = parseStringArray(p.benefits);
  const images = parseStringArray(p.images);
  const hasDiscount = p.discountPrice && Number(p.discountPrice) < Number(p.price);
  return (
    <Card className="overflow-hidden hover:-translate-y-1 transition-transform group">
      <div className="aspect-square bg-muted relative">
        {images[0] ? (
          <img src={images[0]} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Package className="h-16 w-16 text-muted-foreground/30" /></div>
        )}
        <Badge className={`absolute top-2 right-2 ${STOCK_COLORS[p.stockStatus as keyof typeof STOCK_COLORS]}`}>
          {STOCK_LABELS[p.stockStatus as keyof typeof STOCK_LABELS]}
        </Badge>
      </div>
      <CardContent className="p-4">
        {p.category && <p className="text-xs text-muted-foreground mb-1">{p.category}</p>}
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{p.name}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          {p.price && (
            <span className={`font-bold ${hasDiscount ? 'text-green-600' : ''}`}>
              {formatCurrency(hasDiscount ? p.discountPrice : p.price)}
            </span>
          )}
          {hasDiscount && <span className="text-xs line-through text-muted-foreground">{formatCurrency(p.price)}</span>}
        </div>
        <div className="flex items-center justify-between gap-1">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href={`/ai-writer?product=${p.id}`}><Sparkles className="h-3.5 w-3.5 mr-1" /> AI</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href={`/products/${p.id}`}><Edit className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(p.id)}><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(p.id, p.name)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductRow({ product, onDelete, onDuplicate }: any) {
  const p: Product = product;
  const images = parseStringArray(p.images);
  const hasDiscount = p.discountPrice && Number(p.discountPrice) < Number(p.price);
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-accent transition-colors">
      <div className="h-14 w-14 rounded-md bg-muted shrink-0 overflow-hidden">
        {images[0] ? <img src={images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="h-6 w-6 text-muted-foreground/30" /></div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{p.name}</p>
        <p className="text-xs text-muted-foreground">{p.category || 'No category'}</p>
      </div>
      <Badge variant="outline" className={STOCK_COLORS[p.stockStatus as keyof typeof STOCK_COLORS]}>{STOCK_LABELS[p.stockStatus as keyof typeof STOCK_LABELS]}</Badge>
      <div className="text-right hidden md:block">
        {p.price && <div className={`font-semibold ${hasDiscount ? 'text-green-600' : ''}`}>{formatCurrency(hasDiscount ? p.discountPrice : p.price)}</div>}
      </div>
      <div className="flex gap-1">
        <Button asChild size="sm" variant="outline"><Link href={`/ai-writer?product=${p.id}`}><Sparkles className="h-3.5 w-3.5" /></Link></Button>
        <Button asChild size="sm" variant="ghost"><Link href={`/products/${p.id}`}><Edit className="h-3.5 w-3.5" /></Link></Button>
        <Button size="sm" variant="ghost" onClick={() => onDuplicate(p.id)}><Copy className="h-3.5 w-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(p.id, p.name)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}