'use client';
import { Building2, Phone, Globe, MessageCircle, Facebook } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function BrandPreview({ data }: { data: any }) {
  const toneLabel = {
    PROFESSIONAL: 'পেশাদার', FRIENDLY: 'বন্ধুসুলভ', FUNNY: 'মজাদার',
    FORMAL: 'আনুষ্ঠানিক', CASUAL: 'ক্যাজুয়াল',
  }[data.tone as string] || data.tone;

  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-card">
      {/* Gradient header */}
      <div
        className="h-24 relative"
        style={{
          background: `linear-gradient(135deg, ${data.primaryColor || '#6366F1'} 0%, ${data.secondaryColor || '#8B5CF6'} 100%)`,
        }}
      >
        <div className="absolute -bottom-10 left-4">
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="h-20 w-20 rounded-lg border-4 border-card bg-white object-cover" />
          ) : (
            <div className="h-20 w-20 rounded-lg border-4 border-card bg-white flex items-center justify-center">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-12 space-y-4">
        <div>
          <h3 className="font-bold text-lg">{data.brandName || 'আপনার Brand'}</h3>
          {data.description && (
            <p className="text-xs text-muted-foreground mt-1 bangla line-clamp-3">{data.description}</p>
          )}
        </div>

        {toneLabel && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bangla">Tone:</span>
            <Badge variant="secondary">{toneLabel}</Badge>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 pt-2 border-t">
          {data.phone && (
            <div className="flex items-center gap-2 text-xs">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{data.phone}</span>
            </div>
          )}
          {data.whatsapp && (
            <div className="flex items-center gap-2 text-xs">
              <MessageCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{data.whatsapp}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-2 text-xs">
              <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate text-primary">{data.website}</span>
            </div>
          )}
          {data.facebookPage && (
            <div className="flex items-center gap-2 text-xs">
              <Facebook className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate text-primary">{data.facebookPage}</span>
            </div>
          )}
        </div>

        {data.targetAudience && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1 bangla">Target Audience:</p>
            <p className="text-xs bangla">{data.targetAudience}</p>
          </div>
        )}

        {data.ctaDefault && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1 bangla">Default CTA:</p>
            <div
              className="rounded-md p-2 text-center text-white text-xs font-semibold"
              style={{ background: `linear-gradient(90deg, ${data.primaryColor || '#6366F1'} 0%, ${data.secondaryColor || '#8B5CF6'} 100%)` }}
            >
              {data.ctaDefault}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-muted/30 border-t text-[10px] text-center text-muted-foreground bangla">
        ⚡ Live Preview
      </div>
    </div>
  );
}