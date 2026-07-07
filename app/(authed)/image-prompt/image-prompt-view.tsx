'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Copy, Save, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon,
  RefreshCw, Camera, Palette, Box, Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn, copyToClipboard, downloadFile } from '@/lib/utils';
import { toast } from 'sonner';

const PURPOSES = [
  'Facebook Ad Banner', 'Product Showcase', 'Lifestyle Photo',
  'Festival Post (ঈদ/পূজা/পহেলা বৈশাখ)', 'Sale/Offer Banner',
  'Logo Concept', 'Reel Thumbnail', 'Custom',
];
const STYLES = ['Photorealistic', 'Illustration', '3D Render', 'Watercolor', 'Minimalist', 'Cinematic', 'Anime'];
const MOODS = ['Bright', 'Dark', 'Warm', 'Cool', 'Festive', 'Luxury'];
const ASPECTS = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '16:9', label: 'Landscape (16:9)' },
  { value: '9:16', label: 'Portrait (9:16)' },
  { value: '4:5', label: 'Instagram Post (4:5)' },
  { value: '3:2', label: 'Classic (3:2)' },
];
const CAMERAS = ['Close-up', 'Wide', 'Top view', 'Eye level', 'Low angle', 'High angle'];
const LIGHTINGS = ['Natural', 'Studio', 'Golden hour', 'Neon', 'Dramatic', 'Soft'];

interface Product { id: string; name: string; }

export function ImagePromptView({ products, brand }: { products: Product[]; brand: any }) {
  const [productId, setProductId] = useState('');
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [mood, setMood] = useState(MOODS[0]);
  const [aspect, setAspect] = useState('1:1');
  const [camera, setCamera] = useState('');
  const [lighting, setLighting] = useState('');
  const [elements, setElements] = useState('');
  const [inheritColors, setInheritColors] = useState(true);
  const [customColor, setCustomColor] = useState('');
  const [output, setOutput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentId, setContentId] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  async function handleGenerate() {
    setError(null); setOutput(''); setContentId(null); setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'IMAGE_PROMPT',
          productId: productId || undefined,
          language: 'EN',
          length: 'MEDIUM',
          emoji: false,
          cta: false,
          additionalInstructions: '',
          imagePurpose: purpose,
          imageStyle: style,
          imageMood: mood,
          imageAspect: aspect,
          imageElements: elements,
          camera, lighting,
          colorPalette: inheritColors && brand ? `${brand.primaryColor}, ${brand.secondaryColor}` : customColor,
        }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
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
              if (data.text) setOutput(prev => prev + data.text);
              else if (data.error) { setError(data.error); toast.error(data.error); }
              else if (data.done) {
                if (data.id) setContentId(data.id);
                toast.success('Image prompt তৈরি হয়েছে!');
              }
            } catch {}
          }
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setError(e.message);
        toast.error(e.message);
      }
    } finally {
      setStreaming(false);
    }
  }

  function handleStop() { abortRef.current?.abort(); setStreaming(false); }

  async function handleCopy() {
    const ok = await copyToClipboard(output);
    if (ok) toast.success('কপি হয়েছে!');
  }

  function handleDownload() {
    downloadFile(output, `image-prompt-${Date.now()}.txt`);
    toast.success('Download হয়েছে');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT — Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla">
            <ImageIcon className="h-5 w-5" /> Image Prompt Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3 text-xs bangla">
            ⚠️ এই tool শুধু TEXT PROMPT তৈরি করে। Image generate করে না। Prompt copy করে Midjourney / DALL-E / Leonardo AI তে paste করুন।
          </div>

          <div>
            <Label className="bangla">Product / Subject</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue placeholder="Library থেকে select (ঐচ্ছিক)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">— Custom / Manual —</SelectItem>
                {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="bangla flex items-center gap-1"><Box className="h-3 w-3" /> Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PURPOSES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="bangla">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="bangla">Mood</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="bangla">Aspect Ratio</Label>
              <Select value={aspect} onValueChange={setAspect}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASPECTS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="bangla flex items-center gap-1"><Camera className="h-3 w-3" /> Camera (ঐচ্ছিক)</Label>
              <Select value={camera} onValueChange={setCamera}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">— None —</SelectItem>
                  {CAMERAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="bangla flex items-center gap-1"><Sun className="h-3 w-3" /> Lighting (ঐচ্ছিক)</Label>
              <Select value={lighting} onValueChange={setLighting}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">— None —</SelectItem>
                  {LIGHTINGS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="bangla flex items-center gap-1"><Palette className="h-3 w-3" /> Color Palette</Label>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground bangla">Brand colors ব্যবহার করুন</span>
              <Switch checked={inheritColors} onCheckedChange={setInheritColors} disabled={!brand} />
            </div>
            {!inheritColors && (
              <Input value={customColor} onChange={e => setCustomColor(e.target.value)} placeholder="e.g., warm orange, deep blue, pastel" />
            )}
            {brand && inheritColors && (
              <div className="flex gap-2 items-center text-xs text-muted-foreground">
                <span className="w-6 h-6 rounded border" style={{ background: brand.primaryColor || '#6366F1' }} />
                <span className="w-6 h-6 rounded border" style={{ background: brand.secondaryColor || '#8B5CF6' }} />
                <span>{brand.primaryColor}, {brand.secondaryColor}</span>
              </div>
            )}
          </div>

          <div>
            <Label className="bangla">Additional Elements</Label>
            <Textarea rows={3} value={elements} onChange={e => setElements(e.target.value)}
              placeholder="যেমন: ঈদের চাঁদ, খেজুর, সোনালী আলো, বাংলাদেশের পতাকা" />
          </div>

          <Button onClick={handleGenerate} disabled={streaming} className="w-full" size="lg">
            {streaming ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Image Prompt</>}
          </Button>
          {streaming && (
            <Button onClick={handleStop} variant="outline" className="w-full" size="sm">⏹ বন্ধ করুন</Button>
          )}
        </CardContent>
      </Card>

      {/* RIGHT — Output */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4" /> Generated Prompt
            {streaming && <Badge variant="secondary" className="ml-2"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Streaming</Badge>}
            {!streaming && output && <Badge variant="default" className="ml-2"><CheckCircle2 className="h-3 w-3 mr-1" /> Done</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {error && (
            <div className="mb-3 flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!output && !streaming && !error && (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
              <div>
                <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="bangla">Configuration complete করে Generate করুন</p>
              </div>
            </div>
          )}

          {(output || streaming) && (
            <>
              <div ref={outputRef} className="flex-1 max-h-[60vh] overflow-y-auto rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap font-mono">
                <div className={cn(streaming && 'streaming-cursor')}>{output}</div>
              </div>
              {output && !streaming && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={handleCopy}><Copy className="mr-2 h-3.5 w-3.5" /> Copy Full</Button>
                  <Button size="sm" variant="outline" onClick={handleDownload}><Save className="mr-2 h-3.5 w-3.5" /> Download</Button>
                  <Button size="sm" variant="outline" onClick={handleGenerate}><RefreshCw className="mr-2 h-3.5 w-3.5" /> Regenerate</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}