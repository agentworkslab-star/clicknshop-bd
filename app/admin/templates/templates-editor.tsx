'use client';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Edit, Save, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { updateTemplateAction, toggleTemplateActiveAction } from './actions';
import { toast } from 'sonner';

export function AdminTemplatesEditor({ templates }: { templates: any[] }) {
  return (
    <div className="space-y-3">
      {templates.map(t => <TemplateItem key={t.id} template={t} />)}
    </div>
  );
}

function TemplateItem({ template }: { template: any }) {
  const [editing, setEditing] = useState(false);
  const [active, setActive] = useState(template.isActive);
  const boundAction = updateTemplateAction.bind(null, template.id);
  const [state, formAction] = useFormState(boundAction, undefined);

  async function handleToggle() {
    const res = await toggleTemplateActiveAction(template.id);
    if (res?.success) {
      setActive(!active);
      toast.success('Updated');
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{template.name}</h3>
              <Badge variant="outline" className="text-xs">{template.slug}</Badge>
              {active ? <Badge variant="default" className="text-xs">Active</Badge> : <Badge variant="secondary" className="text-xs">Disabled</Badge>}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
            <p className="text-xs text-muted-foreground mt-1">System prompt: {template.systemPrompt.length} chars</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Switch checked={active} onCheckedChange={handleToggle} />
            <Dialog open={editing} onOpenChange={setEditing}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><Edit className="h-3.5 w-3.5" /></Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Template: {template.name}</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                  {state?.error && <Alert type="error" msg={state.error} />}
                  {state?.success && <Alert type="success" msg={state.success} />}
                  <input type="hidden" name="isActive" value={String(active)} />
                  <div>
                    <Label>Name</Label>
                    <Input name="name" defaultValue={template.name} required />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" rows={2} defaultValue={template.description || ''} />
                  </div>
                  <div>
                    <Label>Icon (Lucide icon name)</Label>
                    <Input name="icon" defaultValue={template.icon || 'FileText'} />
                  </div>
                  <div>
                    <Label>System Prompt</Label>
                    <Textarea name="systemPrompt" rows={12} defaultValue={template.systemPrompt} required className="font-mono text-xs" />
                  </div>
                  <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Template</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Alert({ type, msg }: { type: 'success' | 'error'; msg: string }) {
  return (
    <div className={`flex items-start gap-2 rounded-md border p-3 text-sm ${type === 'error' ? 'border-destructive/50 bg-destructive/10 text-destructive' : 'border-green-500/50 bg-green-500/10 text-green-600'}`}>
      {type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
      <span>{msg}</span>
    </div>
  );
}