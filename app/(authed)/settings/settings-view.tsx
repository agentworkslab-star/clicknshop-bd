'use client';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { User, Key, Settings as SettingsIcon, Bell, Sparkles, Save, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  updateProfileAction, changePasswordAction, updateApiSettingsAction,
  testApiConnectionAction, updatePreferencesAction, updateNotificationsAction,
} from './actions';
import { toast } from 'sonner';

interface Props {
  user: any;
  apiSettings: any;
}

function SubmitBtn({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> সেভ হচ্ছে...</> : <>{children}</>}</Button>;
}

export function SettingsView({ user, apiSettings }: Props) {
  const [showKey, setShowKey] = useState(false);
  const [temperature, setTemperature] = useState([apiSettings?.temperature || 0.7]);
  const [maxTokens, setMaxTokens] = useState(apiSettings?.maxTokens || 1024);
  const [model, setModel] = useState(apiSettings?.modelPreference || 'llama-3.3-70b-versatile');
  const [testing, setTesting] = useState(false);

  // Forms
  const [profileState, profileAction] = useFormState(updateProfileAction, undefined);
  const [passState, passAction] = useFormState(changePasswordAction, undefined);
  const [apiState, apiAction] = useFormState(updateApiSettingsAction, undefined);
  const [prefsState, prefsAction] = useFormState(updatePreferencesAction, undefined);
  const [notifState, notifAction] = useFormState(updateNotificationsAction, undefined);

  async function handleTestConnection() {
    setTesting(true);
    const res = await testApiConnectionAction();
    setTesting(false);
    if (res.success) toast.success(res.success);
    else toast.error(res.error || 'Test failed');
  }

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto p-1">
        <TabsTrigger value="profile" className="gap-2 py-2"><User className="h-4 w-4" /> <span className="hidden sm:inline bangla">প্রোফাইল</span></TabsTrigger>
        <TabsTrigger value="api" className="gap-2 py-2"><Sparkles className="h-4 w-4" /> <span className="hidden sm:inline bangla">API</span></TabsTrigger>
        <TabsTrigger value="preferences" className="gap-2 py-2"><SettingsIcon className="h-4 w-4" /> <span className="hidden sm:inline bangla">পছন্দ</span></TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2 py-2"><Bell className="h-4 w-4" /> <span className="hidden sm:inline bangla">নোটিফ</span></TabsTrigger>
        <TabsTrigger value="security" className="gap-2 py-2"><Key className="h-4 w-4" /> <span className="hidden sm:inline bangla">সিকিউরিটি</span></TabsTrigger>
      </TabsList>

      {/* PROFILE */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle className="bangla">প্রোফাইল</CardTitle>
            <CardDescription className="bangla">আপনার ব্যক্তিগত তথ্য</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={profileAction} className="space-y-4">
              {profileState?.error && <Alert type="error" msg={profileState.error} />}
              {profileState?.success && <Alert type="success" msg={profileState.success} />}
              <div>
                <Label htmlFor="name" className="bangla">নাম</Label>
                <Input id="name" name="name" defaultValue={user.brandName} required />
              </div>
              <div>
                <Label htmlFor="email" className="bangla">ইমেইল</Label>
                <Input id="email" name="email" type="email" defaultValue={user.email} disabled />
                <p className="text-xs text-muted-foreground mt-1 bangla">ইমেইল পরিবর্তন যোগাযোগ প্রয়োজন</p>
              </div>
              <div>
                <Label htmlFor="phone" className="bangla">ফোন</Label>
                <Input id="phone" name="phone" defaultValue={user.phone || ''} />
              </div>
              <div>
                <Label htmlFor="avatarUrl" className="bangla">Avatar URL</Label>
                <Input id="avatarUrl" name="avatarUrl" defaultValue={user.avatarUrl || ''} placeholder="https://..." />
              </div>
              <SubmitBtn><Save className="mr-2 h-4 w-4" /> সেভ করুন</SubmitBtn>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* API */}
      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle className="bangla">API Configuration</CardTitle>
            <CardDescription className="bangla">Groq API key ব্যবহার করে AI content generate হয়</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={apiAction} className="space-y-4">
              {apiState?.error && <Alert type="error" msg={apiState.error} />}
              {apiState?.success && <Alert type="success" msg={apiState.success} />}

              <div>
                <Label htmlFor="groqApiKey" className="bangla">Groq API Key (AES-256 encrypted)</Label>
                <div className="flex gap-2">
                  <Input id="groqApiKey" name="groqApiKey" type={showKey ? 'text' : 'password'}
                    placeholder={apiSettings?.groqApiKeyEncrypted ? '••••••••••• (set)' : 'gsk_...'}
                    autoComplete="off" />
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowKey(!showKey)}>
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 bangla">
                  ফ্রি key নিন: <a href="https://console.groq.com/keys" target="_blank" rel="noopener" className="text-primary underline">console.groq.com/keys</a>
                </p>
              </div>

              <div>
                <Label htmlFor="modelPreference" className="bangla">Model</Label>
                <Select name="modelPreference" value={model} onValueChange={setModel}>
                  <SelectTrigger id="modelPreference"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama-3.3-70b-versatile">LLaMA 3.3 70B (Best Quality)</SelectItem>
                    <SelectItem value="llama-3.1-8b-instant">LLaMA 3.1 8B (Fastest)</SelectItem>
                    <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B (Long Context)</SelectItem>
                    <SelectItem value="gemma2-9b-it">Gemma 2 9B (Alternative)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="bangla">Temperature: {temperature[0].toFixed(2)}</Label>
                <Slider value={temperature} onValueChange={setTemperature} min={0.1} max={1} step={0.05} className="mt-2" />
                <input type="hidden" name="temperature" value={temperature[0]} />
                <p className="text-xs text-muted-foreground mt-1 bangla">কম = predictable, বেশি = creative</p>
              </div>

              <div>
                <Label htmlFor="maxTokens" className="bangla">Max Tokens</Label>
                <Input id="maxTokens" name="maxTokens" type="number" min="100" max="8000" step="100"
                  value={maxTokens} onChange={e => setMaxTokens(Number(e.target.value))} />
              </div>

              <div className="flex gap-2">
                <SubmitBtn><Save className="mr-2 h-4 w-4" /> সেভ করুন</SubmitBtn>
                <Button type="button" variant="outline" onClick={handleTestConnection} disabled={testing}>
                  {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                  Test Connection
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* PREFERENCES */}
      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle className="bangla">পছন্দসমূহ</CardTitle>
            <CardDescription className="bangla">UI এবং regional settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={prefsAction} className="space-y-4">
              {prefsState?.success && <Alert type="success" msg={prefsState.success} />}
              <div>
                <Label htmlFor="defaultLanguage" className="bangla">Default Language</Label>
                <Select name="defaultLanguage" defaultValue="BN">
                  <SelectTrigger id="defaultLanguage"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BN">বাংলা</SelectItem>
                    <SelectItem value="EN">English</SelectItem>
                    <SelectItem value="BI">Bilingual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency" className="bangla">Currency Symbol</Label>
                <Select name="currency" defaultValue="৳">
                  <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="৳">৳ (Taka)</SelectItem>
                    <SelectItem value="$">$ (Dollar)</SelectItem>
                    <SelectItem value="₹">₹ (Rupee)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fontSize" className="bangla">Font Size</Label>
                <Select name="fontSize" defaultValue="medium">
                  <SelectTrigger id="fontSize"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <SubmitBtn><Save className="mr-2 h-4 w-4" /> সেভ করুন</SubmitBtn>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* NOTIFICATIONS */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle className="bangla">নোটিফিকেশন</CardTitle>
            <CardDescription className="bangla">কীভাবে notification পেতে চান</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={notifAction} className="space-y-4">
              {notifState?.success && <Alert type="success" msg={notifState.success} />}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium bangla">ইমেইল Notification</p>
                  <p className="text-xs text-muted-foreground bangla">Content generate হলে ইমেইল পান</p>
                </div>
                <Switch name="emailNotifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium bangla">Browser Push</p>
                  <p className="text-xs text-muted-foreground bangla">Browser notification দেখান</p>
                </div>
                <Switch name="pushNotifications" />
              </div>
              <SubmitBtn><Save className="mr-2 h-4 w-4" /> সেভ করুন</SubmitBtn>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* SECURITY */}
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle className="bangla">পাসওয়ার্ড পরিবর্তন</CardTitle>
            <CardDescription className="bangla">নিয়মিত পাসওয়ার্ড পরিবর্তন করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={passAction} className="space-y-4">
              {passState?.error && <Alert type="error" msg={passState.error} />}
              {passState?.success && <Alert type="success" msg={passState.success} />}
              <div>
                <Label htmlFor="current" className="bangla">বর্তমান পাসওয়ার্ড</Label>
                <Input id="current" name="current" type="password" required />
              </div>
              <div>
                <Label htmlFor="new" className="bangla">নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)</Label>
                <Input id="new" name="new" type="password" minLength={8} required />
              </div>
              <div>
                <Label htmlFor="confirm" className="bangla">নিশ্চিত করুন</Label>
                <Input id="confirm" name="confirm" type="password" minLength={8} required />
              </div>
              <SubmitBtn><Save className="mr-2 h-4 w-4" /> পরিবর্তন করুন</SubmitBtn>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function Alert({ type, msg }: { type: 'success' | 'error'; msg: string }) {
  return (
    <div className={`flex items-start gap-2 rounded-md border p-3 text-sm ${type === 'error' ? 'border-destructive/50 bg-destructive/10 text-destructive' : 'border-green-500/50 bg-green-500/10 text-green-600'}`}>
      {type === 'error' ? <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />}
      <span>{msg}</span>
    </div>
  );
}