
import React, { useState, useEffect } from "react";
import { Cpu, Loader2, Save, Settings2, CheckCircle2, ExternalLink, Lightbulb, TestTube, Zap, Bot, ShieldCheck, Sparkles } from "lucide-react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { hasDefaultGoogleKey } from "@/ai/check-default-key";

export function AISettings() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [hasServerKey, setHasServerKey] = useState(false);

  useEffect(() => {
    hasDefaultGoogleKey().then(setHasServerKey);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

  const [settings, setSettings] = useState({
    modelId: "googleai/gemini-2.0-flash-exp",
    googleApiKey: "",
    openaiApiKey: "",
    openrouterApiKey: "",
  });

  useEffect(() => {
    if (profile?.aiSettings) {
      setSettings({
        modelId: profile.aiSettings.modelId || "googleai/gemini-2.0-flash-exp",
        googleApiKey: profile.aiSettings.googleApiKey || "",
        openaiApiKey: profile.aiSettings.openaiApiKey || "",
        openrouterApiKey: profile.aiSettings.openrouterApiKey || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!userRef) return;
    setLoading(true);
    try {
      await updateDoc(userRef, {
        aiSettings: settings,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Configuration Saved", description: "Your AI settings have been updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update settings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    const aiSettings = settings;
    const modelId = aiSettings.modelId;

    let apiKey = "";
    let endpoint = "";
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    let body: any;

    if (modelId.startsWith('googleai/')) {
      apiKey = aiSettings.googleApiKey;
      if (!apiKey && hasServerKey) {
        toast({ title: "Clave del servidor activa", description: "Gemini funciona con la clave configurada en el servidor. Todo listo." });
        return;
      }
      if (!apiKey) {
        toast({ title: "API Key required", description: "Please enter your Google AI API key.", variant: "destructive" });
        return;
      }
      const realModelId = modelId.replace('googleai/', '');
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${realModelId}:generateContent?key=${apiKey}`;
      body = {
        contents: [{ role: 'user', parts: [{ text: "Hello, please respond with a simple 'OK'." }] }],
        generationConfig: { maxOutputTokens: 50, temperature: 0.7 }
      };
    } else if (modelId.startsWith('openai/')) {
      apiKey = aiSettings.openaiApiKey;
      if (!apiKey) {
        toast({ title: "API Key required", description: "Please enter your OpenAI API key.", variant: "destructive" });
        return;
      }
      const realModelId = modelId.replace('openai/', '');
      endpoint = 'https://api.openai.com/v1/chat/completions';
      headers.Authorization = `Bearer ${apiKey}`;
      body = {
        model: realModelId,
        messages: [{ role: 'user', content: 'Hello, please respond with a simple "OK".' }],
      };
    } else if (modelId.startsWith('openrouter/')) {
      apiKey = aiSettings.openrouterApiKey;
      if (!apiKey) {
        toast({ title: "API Key required", description: "Please enter your OpenRouter API key.", variant: "destructive" });
        return;
      }
      const realModelId = modelId.replace('openrouter/', '');
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
      headers.Authorization = `Bearer ${apiKey}`;
      headers['HTTP-Referer'] = 'https://marketscout-pro.app';
      headers['X-Title'] = 'MarketScout Pro';
      body = {
        model: realModelId,
        messages: [{ role: 'user', content: 'Hello, please respond with a simple "OK".' }],
      };
    } else {
      toast({ title: "Unsupported model", description: "Selected AI model is not supported for testing.", variant: "destructive" });
      return;
    }

    setTesting(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.message || JSON.stringify(data);
        throw new Error(errorMessage);
      }

      toast({
        title: "Connection Successful",
        description: "Your API key is valid and the AI model is responding.",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect to AI provider. Check your API key.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const getProviderFromModel = (modelId: string) => {
    if (modelId.startsWith('googleai/')) return 'google';
    if (modelId.startsWith('openai/')) return 'openai';
    if (modelId.startsWith('openrouter/')) return 'openrouter';
    return 'google';
  };

  const currentProvider = getProviderFromModel(settings.modelId);

  return (
    <div className="max-w-6xl space-y-8 pb-24 mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-primary text-xs font-bold tracking-[0.2em] uppercase bg-primary/5 w-fit px-4 py-2 rounded-full border border-primary/10">
          <Cpu className="w-4 h-4" />
          AI Configuration
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Neural Engine Settings
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
          Configure your AI provider credentials to power the intelligent features across the platform.
        </p>
      </div>

      {hasServerKey && (
        <Alert className="bg-emerald-50 border-emerald-200 rounded-2xl">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <AlertDescription className="text-sm text-emerald-800 font-medium">
            <strong>Gemini AI está activo por defecto.</strong> Todas las funciones de IA funcionan automáticamente con Google Gemini. 
            Si lo deseas, puedes configurar tu propia API Key para usar otro proveedor o modelo diferente.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Settings Card */}
        <Card className="lg:col-span-7 border-border/50 shadow-lg bg-card">
          <CardHeader className="pb-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">AI Provider</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  Select the AI model and configure your API credentials
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Model Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Active Model
              </label>
              <Select value={settings.modelId} onValueChange={(val) => setSettings({...settings, modelId: val})}>
                <SelectTrigger className="bg-muted/50 border-border/60 h-12 text-base font-medium rounded-xl">
                  <SelectValue placeholder="Select an AI model" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl shadow-lg max-h-[500px]">
                  <SelectGroup>
                    <SelectLabel className="text-xs font-bold text-primary uppercase tracking-wider px-3 py-2">
                      Google DeepMind
                    </SelectLabel>
                    <SelectItem value="googleai/gemini-2.0-flash-exp" className="h-11 rounded-lg px-3">
                      Gemini 2.0 Flash (Experimental)
                    </SelectItem>
                    <SelectItem value="googleai/gemini-1.5-pro" className="h-11 rounded-lg px-3">
                      Gemini 1.5 Pro
                    </SelectItem>
                    <SelectItem value="googleai/gemini-1.5-flash" className="h-11 rounded-lg px-3">
                      Gemini 1.5 Flash
                    </SelectItem>
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel className="text-xs font-bold text-accent uppercase tracking-wider px-3 py-2">
                      OpenAI
                    </SelectLabel>
                    <SelectItem value="openai/gpt-4o" className="h-11 rounded-lg px-3">
                      GPT-4o (Omni)
                    </SelectItem>
                    <SelectItem value="openai/gpt-4o-mini" className="h-11 rounded-lg px-3">
                      GPT-4o Mini
                    </SelectItem>
                    <SelectItem value="openai/gpt-4-turbo" className="h-11 rounded-lg px-3">
                      GPT-4 Turbo
                    </SelectItem>
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel className="text-xs font-bold text-purple-500 uppercase tracking-wider px-3 py-2">
                      Anthropic (via OpenRouter)
                    </SelectLabel>
                    <SelectItem value="openrouter/anthropic/claude-3.5-sonnet" className="h-11 rounded-lg px-3">
                      Claude 3.5 Sonnet
                    </SelectItem>
                    <SelectItem value="openrouter/anthropic/claude-3.5-haiku" className="h-11 rounded-lg px-3">
                      Claude 3.5 Haiku
                    </SelectItem>
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel className="text-xs font-bold text-blue-500 uppercase tracking-wider px-3 py-2">
                      Meta Llama (via OpenRouter)
                    </SelectLabel>
                    <SelectItem value="openrouter/meta-llama/llama-3.1-405b-instruct" className="h-11 rounded-lg px-3">
                      Llama 3.1 405B
                    </SelectItem>
                    <SelectItem value="openrouter/meta-llama/llama-3.1-70b-instruct" className="h-11 rounded-lg px-3">
                      Llama 3.1 70B
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-6" />

            {/* API Keys Tabs */}
            <Tabs value={currentProvider} className="w-full">
              <TabsList className="bg-muted/50 p-1 w-full h-11 rounded-xl">
                <TabsTrigger value="google" className="flex-1 rounded-lg text-xs font-semibold uppercase">
                  Google AI
                </TabsTrigger>
                <TabsTrigger value="openai" className="flex-1 rounded-lg text-xs font-semibold uppercase">
                  OpenAI
                </TabsTrigger>
                <TabsTrigger value="openrouter" className="flex-1 rounded-lg text-xs font-semibold uppercase">
                  OpenRouter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="google" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Gemini API Key
                    </label>
                    <div className="flex items-center gap-2">
                      {hasServerKey && (
                        <Badge variant="secondary" className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border-emerald-100 uppercase">
                          Activa por defecto
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border-emerald-100 uppercase">
                        Recommended
                      </Badge>
                    </div>
                  </div>
                  {hasServerKey && !settings.googleApiKey && (
                    <Alert className="bg-blue-50 border-blue-100 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      <AlertDescription className="text-xs text-blue-700">
                        Ya hay una clave Gemini configurada en el servidor. No necesitas añadir la tuya, pero puedes hacerlo para usar tu propia cuenta.
                      </AlertDescription>
                    </Alert>
                  )}
                  <Input
                    type="password"
                    value={settings.googleApiKey}
                    onChange={(e) => setSettings({...settings, googleApiKey: e.target.value})}
                    placeholder={hasServerKey ? "(Usando clave del servidor — opcional override)" : "AIzaSy..."}
                    className="bg-muted/50 border-border/60 h-12 text-sm font-mono shadow-sm rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Get your key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      Google AI Studio <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="openai" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      OpenAI API Key
                    </label>
                  </div>
                  <Input
                    type="password"
                    value={settings.openaiApiKey}
                    onChange={(e) => setSettings({...settings, openaiApiKey: e.target.value})}
                    placeholder="sk-..."
                    className="bg-muted/50 border-border/60 h-12 text-sm font-mono shadow-sm rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      OpenAI Dashboard <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="openrouter" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      OpenRouter API Key
                    </label>
                  </div>
                  <Input
                    type="password"
                    value={settings.openrouterApiKey}
                    onChange={(e) => setSettings({...settings, openrouterApiKey: e.target.value})}
                    placeholder="sk-or-v1-..."
                    className="bg-muted/50 border-border/60 h-12 text-sm font-mono shadow-sm rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Get your key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      OpenRouter Dashboard <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
                <Alert className="bg-muted/50 border-border/60 rounded-xl mt-4">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <AlertDescription className="text-xs text-muted-foreground">
                    OpenRouter provides access to multiple AI models (Claude, Llama, Qwen, etc.) with a single API key.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="p-6 pt-0 border-t border-border/40 mt-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-border/60 hover:bg-muted/50 h-12 rounded-xl transition-all"
              onClick={handleTest}
              disabled={testing}
            >
              {testing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <TestTube className="w-5 h-5 mr-2" />}
              {testing ? "Testing..." : "Test Connection"}
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold h-12 shadow-md rounded-xl transition-all"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
              {loading ? "Saving..." : "Save Configuration"}
            </Button>
          </CardFooter>
        </Card>

        {/* Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/50 shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-bold text-foreground">Fast & Reliable</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Gemini Flash offers excellent performance for most use cases with competitive pricing and speed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-xl">
                  <Bot className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-bold text-foreground">Multiple Providers</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Switch between Google, OpenAI, and OpenRouter providers depending on your needs and budget.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-md bg-card border-l-4">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-bold text-foreground">Secure Storage</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your API keys are encrypted and stored securely in Firebase. Never shared with third parties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
