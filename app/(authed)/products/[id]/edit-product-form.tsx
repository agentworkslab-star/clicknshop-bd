'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { X, Plus, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateProductAction } from '../actions';
import { parseStringArray } from '@/lib/utils';

const COMMON_CATEGORIES = ['Fashion', 'Electronics', 'Beauty', 'Food', 'Home', 'Sports', 'Books', 'Other'];

interface Props {
  productId: string;
  initial: any;
}

export function EditProductForm({ productId, initial }: Props) {
  const router = useRouter();
  const boundAction = updateProductAction.bind(null, productId);
  const [state, formAction] = useFormState(boundAction, undefined);
  const [benefits, setBenefits] = useState<string[]>(parseStringArray(initial.benefits));
  const [keywords, setKeywords] = useState<string[]>(parseStringArray(initial.seoKeywords));
  const [images, setImages] = useState<string[]>(parseStringArray(initial.images));
  const [benefitInput, setBenefitInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [category, setCategory] = useState(initial.category || '');
  const [stock, setStock] = useState(initial.stockStatus || 'IN_STOCK');
  const [submitting, setSubmitting] = useState(false);

  if (state?.success) {
    setTimeout(() => router.push('/products'), 800);
  }

  function addTag(value: string, list: string[], setList: any, clear: any) {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
      clear('');
    }
  }

  return (
    <form action={formAction} className="space-y-6" onSubmit={() => setSubmitting(true)}>
      {state?.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}
      {state?.success && (
        <div className="flex items-start gap-2 rounded-md border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{state.success} — Redirecting...</span>
        </div>
      )}

      {benefits.map(b => <input key={b} type="hidden" name="benefits" value={b} />)}
      {keywords.map(k => <input key={k} type="hidden" name="seoKeywords" value={k} />)}
      {images.map(i => <input key={i} type="hidden" name="images" value={i} />)}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="bangla">📦 মূল তথ্য</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="bangla">প্রোডাক্ট নাম *</Label>
                <Input id="name" name="name" required defaultValue={initial.name} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="category" className="bangla">ক্যাটাগরি</Label>
                  <Select name="category" value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {COMMON_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weight" className="bangla">Weight / Size</Label>
                  <Input id="weight" name="weight" defaultValue={initial.weight || ''} />
                </div>
              </div>
              <div>
                <Label htmlFor="sku" className="bangla">SKU</Label>
                <Input id="sku" name="sku" defaultValue={initial.sku || ''} />
              </div>
              <div>
                <Label htmlFor="shortDesc" className="bangla">Short Description</Label>
                <Textarea id="shortDesc" name="shortDesc" rows={2} defaultValue={initial.shortDesc || ''} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="bangla">💰 মূল্য ও স্টক</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="price" className="bangla">মূল্য</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={initial.price?.toString() || ''} />
                </div>
                <div>
                  <Label htmlFor="discountPrice" className="bangla">Discount</Label>
                  <Input id="discountPrice" name="discountPrice" type="number" step="0.01" defaultValue={initial.discountPrice?.toString() || ''} />
                </div>
              </div>
              <div>
                <Label htmlFor="stockStatus" className="bangla">Stock</Label>
                <Select name="stockStatus" value={stock} onValueChange={setStock}>
                  <SelectTrigger id="stockStatus"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_STOCK">স্টকে আছে</SelectItem>
                    <SelectItem value="LOW_STOCK">কম আছে</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">স্টকে নেই</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="bangla">✨ Key Benefits</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input value={benefitInput} onChange={e => setBenefitInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(benefitInput, benefits, setBenefits, setBenefitInput); } }}
                  placeholder="Benefit add করুন" />
                <Button type="button" variant="outline" onClick={() => addTag(benefitInput, benefits, setBenefits, setBenefitInput)}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {benefits.map(b => (
                  <span key={b} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
                    {b} <button type="button" onClick={() => setBenefits(benefits.filter(x => x !== b))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="bangla">🔍 SEO Keywords</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input value={keywordInput} onChange={e => setKeywordInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(keywordInput, keywords, setKeywords, setKeywordInput); } }}
                  placeholder="keyword" />
                <Button type="button" variant="outline" onClick={() => addTag(keywordInput, keywords, setKeywords, setKeywordInput)}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map(k => (
                  <span key={k} className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs">
                    {k} <button type="button" onClick={() => setKeywords(keywords.filter(x => x !== k))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="bangla">📝 Long Description</CardTitle></CardHeader>
            <CardContent>
              <Textarea id="longDesc" name="longDesc" rows={6} defaultValue={initial.longDesc || ''} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="bangla">🖼️ Images</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input value={imageInput} onChange={e => setImageInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(imageInput, images, setImages, setImageInput); } }}
                  placeholder="Image URL" />
                <Button type="button" variant="outline" onClick={() => addTag(imageInput, images, setImages, setImageInput)}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {images.map(i => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border bg-muted">
                    <img src={i} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter(x => x !== i))} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> আপডেট হচ্ছে...</> : <><Save className="mr-2 h-4 w-4" /> আপডেট করুন</>}
      </Button>
    </form>
  );
}