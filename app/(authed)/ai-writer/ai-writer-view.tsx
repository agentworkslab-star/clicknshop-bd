'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  PenTool, Facebook, Package, Search, Tag, Image as ImageIcon, Video, Sparkles,
  Send, Copy, Save, Download, Edit2, RefreshCw, Loader2, AlertCircle, CheckCircle2,
  Volume2, Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, copyToClipboard, downloadFile, TEMPLATE_LABELS } from '@/lib/utils';
import { toast } from 'sonner';

const TEMPLATES = [
  { id: 'FACEBOOK_POST', icon: Facebook, label: 'Facebook Post', labelBn: 'ফেসবুক পোস্ট', color: 'from-blue-500 to-blue-600' },
  { id: 'PRODUCT_DESCRIPTION', icon: Package, label: 'Product Description', labelBn: 'প্রোডাক্ট বর্ণনা', color: 'from-purple-500 to-purple-600' },
  { id: 'SEO_META', icon: Search, label: 'SEO Title & Meta', labelBn: 'SEO টাইটেল ও মেটা', color: 'from-green-500 to-green-600' },
  { id: 'OFFER_POST', icon: Tag, label: 'Offer / Promotion', labelBn: 'অফার / প্রমোশন', color: 'from-red-500 to-red-600' },
  { id: 'BANNER_TEXT', icon: ImageIcon, label: 'Banner Text', labelBn: 'ব্যানার টেক্সট', color: 'from-pink-500 to-pink-600' },
  { id: 'REEL_SCRIPT', icon: Video, label: 'Reel Script', labelBn: 'রিল স্ক্রিপ্ট', color: 'from-orange-500 to-orange-600' },
  { id: 'IMAGE_PROMPT', icon: Sparkles, label: 'Image Prompt', labelBn: 'ইমেজ প্রম্পট', color: 'from-violet-500 to-violet-600' },
];

interface Product { id: string; name: string; }

export function AIWriterView({ products, brand }: { products: Product[]; brand: any }) {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get('product') || '';
  const [template, setTemplate] = useState('FACEBOOK_POST');
  const [productId, setProductId] = useState(initialProduct);
  const [language, setLanguage] = useState<'BN' | 'EN' | 'BI'>('BN');
  const [length, setLength] = useState<'SHORT' | 'MEDIUM' | 'LONG'>('MEDIUM');
  const [tone, setTone] = useState(brand?.tone || 'FRIENDLY');
  const [emoji, setEmoji] = useState(true);
  const [includeCta, setIncludeCta] = useState(true);
  const [instructions, setInstructions] = useState('');
  const [output, setOutput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  async function handleGenerate() {
    setError(null);
    setOutput('');
    setContentId(null);
    setStreaming(true);
    setEditMode(false);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template, productId: productId || undefined, language, length, tone,
          emoji, cta: includeCta, additionalInstructions: instructions || undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        setError(err.error || 'Generation failed');
        setStreaming(false);
        toast.error(err.error || 'Generation failed');
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No stream');

      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                setOutput(prev => prev + data.text);
              } else if (data.error) {
                setError(data.error);
                toast.error(data.error);
              } else if (data.done) {
                if (data.id) setContentId(data.id);
                toast.success('Content তৈরি হয়েছে!');
              }
            } catch {}
          }
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setError(e.message || 'Generation failed');
        toast.error(e.message || 'Generation failed');
      }
    } finally {
      setStreaming(false);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  async function handleCopy() {
    const ok = await copyToClipboard(output);
    if (ok) toast.success('কপি হয়েছে!');
    else toast.error('কপি ব্যর্থ');
  }

  function handleDownload() {
    const t = TEMPLATE_LABELS[template];
    downloadFile(output, `${t?.label || template}-${Date.now()}.txt`, 'text/plain');
    toast.success('Download হয়েছে');
  }

  function handleRegenerate() {
    handleGenerate();
  }

  function handleShare() {
    const url = `${window.location.origin}/projects`;
    copyToClipboard(url);
    toast.success('Link কপি হয়েছে!');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-7rem)]">
      {/* LEFT — Templates */}
      <div className="lg:col-span-3 overflow-y-auto pr-2">
        <h3 className="font-semibold mb-3 bangla">📋 Template</h3>
        <div className="space-y-2">
          {TEMPLATES.map(t => {
            const active = template === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={cn(
                  'w-full text-left rounded-lg p-3 transition-all flex items-center gap-3 border',
                  active
                    ? `bg-gradient-to-br ${t.color} text-white border-transparent shadow-soft`
                    : 'bg-card hover:bg-accent'
                )}
              >
                <t.icon className="h-5 w-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{t.labelBn}</div>
                  <div className={cn('text-xs truncate', active ? 'opacity-80' : 'text-muted-foreground')}>{t.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MIDDLE — Input Form */}
      <div className="lg:col-span-4 overflow-y-auto pr-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PenTool className="h-4 w-4" /> Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="bangla">Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger><SelectValue placeholder="Product select করুন (ঐচ্ছিক)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">— None —</SelectItem>
                  {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="bangla">ভাষা</Label>
                <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BN">বাংলা</SelectItem>
                    <SelectItem value="EN">English</SelectItem>
                    <SelectItem value="BI">Bilingual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="bangla">দৈর্ঘ্য</Label>
                <Select value={length} onValueChange={(v: any) => setLength(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHORT">ছোট</SelectItem>
                    <SelectItem value="MEDIUM">মাঝারি</SelectItem>
                    <SelectItem value="LONG">বড়</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="bangla">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROFESSIONAL">পেশাদার</SelectItem>
                  <SelectItem value="FRIENDLY">বন্ধুসুলভ</SelectItem>
                  <SelectItem value="FUNNY">মজাদার</SelectItem>
                  <SelectItem value="FORMAL">আনুষ্ঠানিক</SelectItem>
                  <SelectItem value="CASUAL">ক্যাজুয়াল</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="bangla">Emoji ব্যবহার করুন</Label>
              <Switch checked={emoji} onCheckedChange={setEmoji} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="bangla">CTA যোগ করুন</Label>
              <Switch checked={includeCta} onCheckedChange={setIncludeCta} />
            </div>

            <div>
              <Label className="bangla">Additional Instructions</Label>
              <Textarea
                rows={3} value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="যেমন: ঈদ উপলক্ষে ২০% ছাড় mention কর..."
              />
            </div>

            <Button onClick={handleGenerate} disabled={streaming} className="w-full" size="lg">
              {streaming ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generate হচ্ছে...</> : <><Send className="mr-2 h-4 w-4" /> Generate Content</>}
            </Button>
            {streaming && (
              <Button onClick={handleStop} variant="outline" className="w-full" size="sm">
                ⏹ বন্ধ করুন
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT — Output */}
      <div className="lg:col-span-5 overflow-hidden flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" /> Output
              {streaming && <Badge variant="secondary" className="ml-2"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Streaming</Badge>}
              {!streaming && output && <Badge variant="default" className="ml-2"><CheckCircle2 className="h-3 w-3 mr-1" /> Complete</Badge>}
            </CardTitle>
            {contentId && (
              <Badge variant="outline" className="text-xs">ID: {contentId.slice(0, 8)}</Badge>
            )}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            {error && (
              <div className="mb-3 flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium bangla">ত্রুটি</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!output && !streaming && !error && (
              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="bangla">Template select করুন ও Generate বাটনে click করুন</p>
                </div>
              </div>
            )}

            {(output || streaming) && (
              <>
                <div
                  ref={outputRef}
                  className="flex-1 overflow-y-auto rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap font-sans"
                >
                  {editMode ? (
                    <Textarea
                      value={output}
                      onChange={e => setOutput(e.target.value)}
                      className="min-h-[400px] font-sans text-sm"
                    />
                  ) : (
                    <div className={cn(streaming && 'streaming-cursor')}>{output}</div>
                  )}
                </div>

                {output && !streaming && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={handleCopy}><Copy className="mr-2 h-3.5 w-3.5" /> Copy</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditMode(!editMode)}><Edit2 className="mr-2 h-3.5 w-3.5" /> {editMode ? 'Done' : 'Edit'}</Button>
                    <Button size="sm" variant="outline" onClick={handleRegenerate}><RefreshCw className="mr-2 h-3.5 w-3.5" /> Regenerate</Button>
                    <Button size="sm" variant="outline" onClick={handleDownload}><Download className="mr-2 h-3.5 w-3.5" /> Download</Button>
                    <Button size="sm" variant="outline" onClick={handleShare}><Share2 className="mr-2 h-3.5 w-3.5" /> Share</Button>
                    <Button size="sm" asChild>
                      <a href="/projects"><Save className="mr-2 h-3.5 w-3.5" /> View Saved</a>
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}