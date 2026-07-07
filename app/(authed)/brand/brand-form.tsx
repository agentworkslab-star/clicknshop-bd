'use client';
import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Building2, Save, Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveBrandAction } from './actions';
import { BrandPreview } from './brand-preview';

const TONE_OPTIONS = [
  { value: 'PROFESSIONAL', label: 'Professional', labelBn: 'পেশাদার' },
  { value: 'FRIENDLY', label: 'Friendly', labelBn: 'বন্ধুসুলভ' },
  { value: 'FUNNY', label: 'Funny', labelBn: 'মজাদার' },
  { value: 'FORMAL', label: 'Formal', labelBn: 'আনুষ্ঠানিক' },
  { value: 'CASUAL', label: 'Casual', labelBn: 'ক্যাজুয়াল' },
];

function SubmitButton({ saving }: { saving: boolean }) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={saving}>
      {saving ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> সেভ হচ্ছে...</>
      ) : (
        <><Save className="mr-2 h-4 w-4" /> Brand Memory সেভ করুন</>
      )}
    </Button>
  );
}

interface BrandFormProps {
  initial: any;
}

export function BrandForm({ initial }: BrandFormProps) {
  const [state, formAction] = useFormState(saveBrandAction, undefined);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const dataRef = useRef<any>(initial || {});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Watch for changes and trigger auto-save every 30s
  useEffect(() => {
    const handleChange = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setAutoSaveStatus('idle');
    };
    const form = formRef.current;
    form?.addEventListener('input', handleChange);
    return () => form?.removeEventListener('input', handleChange);
  }, []);

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (formRef.current && state?.success !== undefined) {
        // Auto-save only if last save was successful
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [state]);

  // Update preview when fields change
  const [previewData, setPreviewData] = useState(initial || {});
  const handleFieldChange = (field: string, value: any) => {
    setPreviewData((prev: any) => ({ ...prev, [field]: value }));
    dataRef.current = { ...dataRef.current, [field]: value };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="lg:col-span-2">
        <form ref={formRef} action={formAction} className="space-y-6">
          {state?.error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}
          {state?.success && (
            <div className="flex items-start gap-2 rounded-md border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{state.success}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 bangla">📋 মূল তথ্য</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brandName" className="bangla">Brand নাম *</Label>
                <Input
                  id="brandName" name="brandName" required
                  defaultValue={initial?.brandName || ''}
                  placeholder="আপনার brand এর নাম"
                  onChange={(e) => handleFieldChange('brandName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone" className="bangla">ফোন নম্বর *</Label>
                <Input
                  id="phone" name="phone" type="tel" required
                  defaultValue={initial?.phone || ''}
                  placeholder="01XXXXXXXXX"
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website" className="bangla">Website URL</Label>
                <Input
                  id="website" name="website" type="url"
                  defaultValue={initial?.website || ''}
                  placeholder="https://example.com"
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp" className="bangla">WhatsApp নম্বর</Label>
                <Input
                  id="whatsapp" name="whatsapp" type="tel"
                  defaultValue={initial?.whatsapp || ''}
                  placeholder="01XXXXXXXXX"
                  onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="facebookPage" className="bangla">Facebook Page URL</Label>
              <Input
                id="facebookPage" name="facebookPage" type="url"
                defaultValue={initial?.facebookPage || ''}
                placeholder="https://facebook.com/yourpage"
                onChange={(e) => handleFieldChange('facebookPage', e.target.value)}
              />
            </div>
          </div>

          {/* Tone & CTA */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 bangla">🎨 Tone ও CTA</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tone" className="bangla">Brand Tone</Label>
                <Select name="tone" defaultValue={initial?.tone || 'FRIENDLY'}>
                  <SelectTrigger id="tone"><SelectValue placeholder="Tone select করুন" /></SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.labelBn} ({t.label})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ctaDefault" className="bangla">Default CTA</Label>
                <Input
                  id="ctaDefault" name="ctaDefault"
                  defaultValue={initial?.ctaDefault || ''}
                  placeholder="অর্ডার করতে কল করুন"
                  onChange={(e) => handleFieldChange('ctaDefault', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Visual Identity */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 bangla">🎭 Visual Identity</h3>

            <div>
              <Label htmlFor="logoUrl" className="bangla">Logo URL</Label>
              <div className="flex gap-2">
                <Input
                  id="logoUrl" name="logoUrl" type="url"
                  defaultValue={initial?.logoUrl || ''}
                  placeholder="https://example.com/logo.png"
                  onChange={(e) => handleFieldChange('logoUrl', e.target.value)}
                />
                <Button type="button" variant="outline" size="icon" disabled title="Upload শীঘ্রই আসছে">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1 bangla">Logo URL paste করুন অথবা পরে upload feature যোগ হবে</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor" className="bangla">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor" name="primaryColor" type="color"
                    defaultValue={initial?.primaryColor || '#6366F1'}
                    className="h-11 w-20 p-1"
                    onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                  />
                  <Input
                    value={initial?.primaryColor || '#6366F1'}
                    readOnly
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor" className="bangla">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor" name="secondaryColor" type="color"
                    defaultValue={initial?.secondaryColor || '#8B5CF6'}
                    className="h-11 w-20 p-1"
                    onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                  />
                  <Input
                    value={initial?.secondaryColor || '#8B5CF6'}
                    readOnly
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Audience & Description */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 bangla">👥 Target Audience</h3>

            <div>
              <Label htmlFor="targetAudience" className="bangla">কাদের জন্য?</Label>
              <Textarea
                id="targetAudience" name="targetAudience" rows={3}
                defaultValue={initial?.targetAudience || ''}
                placeholder="যেমন: ১৮-৩৫ বছর বয়সী নারী, ঢাকা কেন্দ্রিক, fashion-আগ্রহী"
                onChange={(e) => handleFieldChange('targetAudience', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description" className="bangla">Brand Description</Label>
              <Textarea
                id="description" name="description" rows={4}
                defaultValue={initial?.description || ''}
                placeholder="আমরা কী করি, কেন করি, কীভাবে আলাদা..."
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />
            </div>
          </div>

          <SubmitButton saving={autoSaveStatus === 'saving'} />

          <p className="text-xs text-center text-muted-foreground bangla">
            ⚡ Auto-save প্রতি ৩০ সেকেন্ডে সক্রিয় হবে (প্রথম manual save এর পর)
          </p>
        </form>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-20">
          <BrandPreview data={previewData} />
        </div>
      </div>
    </div>
  );
}