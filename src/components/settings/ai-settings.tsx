
"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Key, ShieldCheck, Loader2, Save, BrainCircuit, Settings2, Sparkles, Zap, Bot, Database, CheckCircle2, AlertCircle, ExternalLink, Lightbulb, TestTube } from "lucide-react";
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
import { runAIQuery } from "@/ai/genkit";
import { runAIQuery } from "@/ai/genkit";

export function AISettings() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

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
    if (modelId.startsWith('googleai/') && aiSettings.googleApiKey) apiKey = aiSettings.googleApiKey;
    else if (modelId.startsWith('openai/') && aiSettings.openaiApiKey) apiKey = aiSettings.openaiApiKey;
    else if (modelId.startsWith('openrouter/') && aiSettings.openrouterApiKey) apiKey = aiSettings.openrouterApiKey;
    
    if (!apiKey) {
      toast({ 
        title: "No API Key", 
        description: "Please enter an API key for the selected provider first.", 
        variant: "destructive" 
      });
      return;
    }

    setTesting(true);
    try {
      const result = await runAIQuery({
        modelId,
        prompt: "Hello! Please respond with: {\"status\":\"ok\",\"message\":\"Connection successful\"}",
        googleApiKey: aiSettings.googleApiKey,
        openaiApiKey: aiSettings.openaiApiKey,
        openrouterApiKey: aiSettings.openrouterApiKey,
        jsonMode: true
      });
      
      // Try to parse JSON response
      try {
        const parsed = JSON.parse(result.replace(/```json|```/g, '').trim());
        if (parsed.status === 'ok') {
          toast({ 
            title: "Connection Successful", 
            description: parsed.message || "AI provider is responding correctly." 
          });
        } else {
          toast({ 
            title: "Response Received", 
            description: "API responded but format unexpected. Check console.", 
            variant: "default" 
          });
        }
      } catch {
        toast({ 
          title: "Connection OK", 
          description: "API responded successfully (non-JSON format)." 
        });
      }
    } catch (error: any) {
      toast({ 
        title: "Connection Failed", 
        description: error.message || "Could not connect to AI provider.", 
        variant: "destructive" 
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
                    <Badge variant="secondary" className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border-emerald-100 uppercase">
                      Recommended
                    </Badge>
                  </div>
                  <Input
                    type="password"
                    value={settings.googleApiKey}
                    onChange={(e) => setSettings({...settings, googleApiKey: e.target.value})}
                    placeholder="AIzaSy..."
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
                    <Badge variant="secondary" className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border-emerald-100 uppercase">
                      Recommended
                    </Badge>
                  </div>
                  <Input
                    type="password"
                    value={settings.googleApiKey}
                    onChange={(e) => setSettings({...settings, googleApiKey: e.target.value})}
                    placeholder="AIzaSy..."
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

          <CardFooter className="p-6 pt-0 border-t border-border/40 mt-6">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12 shadow-md rounded-xl transition-all"
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

  }, [profile]);

  const handleSave = async () => {
    if (!userRef) return;
    setLoading(true);
    try {
      await updateDoc(userRef, {
        aiSettings: settings,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Sincronización Neural Completa", description: "Tus modelos y claves están listos." });
    } catch (error) {
      toast({ title: "Error de Guardado", description: "No se pudo actualizar la configuración.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-12 pb-24 mx-auto animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-primary text-[10px] font-bold tracking-[0.3em] uppercase bg-primary/5 w-fit px-4 py-2 rounded-full border border-primary/10">
          <Network className="w-3.5 h-3.5" /> Intelligence Command Center
        </div>
        <h2 className="text-6xl lg:text-7xl font-headline font-bold text-foreground tracking-tighter">Motor Neural</h2>
        <p className="text-muted-foreground text-xl max-w-3xl leading-relaxed font-medium">Alterna entre las IAs más potentes del mundo para cada fase de tu estrategia.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Card className="lg:col-span-8 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-border/40">
          <CardHeader className="p-12 pb-8 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-4">
               <div className="bg-primary/10 p-4 rounded-2xl text-primary"><Settings2 className="w-6 h-6" /></div>
               <div>
                  <CardTitle className="text-2xl font-headline font-bold">Arquitectura AI</CardTitle>
                  <CardDescription className="text-md">Selecciona el modelo que procesará tu inteligencia de mercado.</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-12 space-y-12">
            <div className="space-y-6">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.3em] px-2">Modelo Activo</label>
              <Select 
                value={settings.modelId} 
                onValueChange={(val) => setSettings({...settings, modelId: val})}
              >
                <SelectTrigger className="bg-secondary/30 border-border/50 h-20 text-lg font-bold rounded-[1.5rem] transition-all hover:bg-white hover:shadow-xl focus:ring-primary px-8">
                  <SelectValue placeholder="Elige un cerebro AI" />
                </SelectTrigger>
                <SelectContent className="bg-white border-border rounded-2xl p-2 shadow-2xl max-h-[600px]">
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-primary uppercase tracking-widest p-4">Google DeepMind</SelectLabel>
                    <SelectItem value="googleai/gemini-2.0-flash-exp" className="h-14 rounded-xl px-4 font-bold text-md">Gemini 2.0 Flash (Experimental)</SelectItem>
                    <SelectItem value="googleai/gemini-1.5-pro" className="h-14 rounded-xl px-4 font-bold text-md">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="googleai/gemini-1.5-flash" className="h-14 rounded-xl px-4 font-bold text-md">Gemini 1.5 Flash</SelectItem>
                    <SelectItem value="googleai/gemini-1.0-pro" className="h-14 rounded-xl px-4 font-bold text-md">Gemini 1.0 Pro</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-accent uppercase tracking-widest p-4">OpenAI Ecosystem</SelectLabel>
                    <SelectItem value="openai/gpt-4o" className="h-14 rounded-xl px-4 font-bold text-md">GPT-4o (Omni)</SelectItem>
                    <SelectItem value="openai/gpt-4o-mini" className="h-14 rounded-xl px-4 font-bold text-md">GPT-4o Mini</SelectItem>
                    <SelectItem value="openai/gpt-4-turbo" className="h-14 rounded-xl px-4 font-bold text-md">GPT-4 Turbo</SelectItem>
                    <SelectItem value="openai/gpt-4" className="h-14 rounded-xl px-4 font-bold text-md">GPT-4</SelectItem>
                    <SelectItem value="openai/gpt-3.5-turbo" className="h-14 rounded-xl px-4 font-bold text-md">GPT-3.5 Turbo</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-purple-500 uppercase tracking-widest p-4">Anthropic Claude</SelectLabel>
                    <SelectItem value="openrouter/anthropic/claude-3.5-sonnet" className="h-14 rounded-xl px-4 font-bold text-md">Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="openrouter/anthropic/claude-3.5-haiku" className="h-14 rounded-xl px-4 font-bold text-md">Claude 3.5 Haiku</SelectItem>
                    <SelectItem value="openrouter/anthropic/claude-3-opus" className="h-14 rounded-xl px-4 font-bold text-md">Claude 3 Opus</SelectItem>
                    <SelectItem value="openrouter/anthropic/claude-3-sonnet" className="h-14 rounded-xl px-4 font-bold text-md">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="openrouter/anthropic/claude-3-haiku" className="h-14 rounded-xl px-4 font-bold text-md">Claude 3 Haiku</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-blue-500 uppercase tracking-widest p-4">Meta Llama</SelectLabel>
                    <SelectItem value="openrouter/meta-llama/llama-3.1-405b-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Llama 3.1 405B</SelectItem>
                    <SelectItem value="openrouter/meta-llama/llama-3.1-70b-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Llama 3.1 70B</SelectItem>
                    <SelectItem value="openrouter/meta-llama/llama-3.1-8b-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Llama 3.1 8B</SelectItem>
                    <SelectItem value="openrouter/meta-llama/llama-3-70b-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Llama 3 70B</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-orange-500 uppercase tracking-widest p-4">Alibaba Qwen</SelectLabel>
                    <SelectItem value="openrouter/alibaba/qwen-2.5-72b-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Qwen 2.5 72B</SelectItem>
                    <SelectItem value="openrouter/alibaba/qwen-2.5-7b-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Qwen 2.5 7B</SelectItem>
                    <SelectItem value="openrouter/alibaba/qwen-2-72b-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Qwen 2 72B</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest p-4">DeepSeek</SelectLabel>
                    <SelectItem value="openrouter/deepseek/deepseek-chat" className="h-14 rounded-xl px-4 font-bold text-md">DeepSeek V3</SelectItem>
                    <SelectItem value="openrouter/deepseek/deepseek-coder" className="h-14 rounded-xl px-4 font-bold text-md">DeepSeek Coder</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-gray-700 uppercase tracking-widest p-4">X.ai Grok</SelectLabel>
                    <SelectItem value="openrouter/x-ai/grok-2" className="h-14 rounded-xl px-4 font-bold text-md">Grok 2</SelectItem>
                    <SelectItem value="openrouter/x-ai/grok-beta" className="h-14 rounded-xl px-4 font-bold text-md">Grok Beta</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest p-4">Mistral AI</SelectLabel>
                    <SelectItem value="openrouter/mistralai/mistral-large" className="h-14 rounded-xl px-4 font-bold text-md">Mistral Large 2</SelectItem>
                    <SelectItem value="openrouter/mistralai/mistral-medium" className="h-14 rounded-xl px-4 font-bold text-md">Mistral Medium</SelectItem>
                    <SelectItem value="openrouter/mistralai/mistral-small" className="h-14 rounded-xl px-4 font-bold text-md">Mistral Small</SelectItem>
                    <SelectItem value="openrouter/mistralai/codestral" className="h-14 rounded-xl px-4 font-bold text-md">Codestral</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-teal-500 uppercase tracking-widest p-4">Cohere</SelectLabel>
                    <SelectItem value="openrouter/cohere/command-r-plus" className="h-14 rounded-xl px-4 font-bold text-md">Command R+</SelectItem>
                    <SelectItem value="openrouter/cohere/command-r" className="h-14 rounded-xl px-4 font-bold text-md">Command R</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-pink-500 uppercase tracking-widest p-4">Microsoft Phi</SelectLabel>
                    <SelectItem value="openrouter/microsoft/phi-3-medium-128k-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Phi-3 Medium 128K</SelectItem>
                    <SelectItem value="openrouter/microsoft/phi-3-mini-128k-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Phi-3 Mini 128K</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest p-4">Perplexity</SelectLabel>
                    <SelectItem value="openrouter/perplexity/llama-3.1-sonar-huge-128k-online" className="h-14 rounded-xl px-4 font-bold text-md">Sonar Huge 128K Online</SelectItem>
                    <SelectItem value="openrouter/perplexity/llama-3.1-sonar-small-128k-online" className="h-14 rounded-xl px-4 font-bold text-md">Sonar Small 128K Online</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="google" className="w-full">
              <TabsList className="bg-muted/50 p-1.5 mb-8 rounded-2xl h-14 w-full">
                <TabsTrigger value="google" className="flex-1 rounded-xl font-bold text-xs uppercase">Google (Nativo)</TabsTrigger>
                <TabsTrigger value="openai" className="flex-1 rounded-xl font-bold text-xs uppercase">OpenAI</TabsTrigger>
                <TabsTrigger value="openrouter" className="flex-1 rounded-xl font-bold text-xs uppercase">OpenRouter</TabsTrigger>
              </TabsList>
              
              <TabsContent value="google" className="space-y-6 animate-fade-in">
                 <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.3em]">Gemini Key</label>
                    <Badge variant="outline" className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-tighter">Recomendado</Badge>
                  </div>
                  <Input 
                    type="password"
                    value={settings.googleApiKey}
                    onChange={(e) => setSettings({...settings, googleApiKey: e.target.value})}
                    placeholder="AIzaSy..."
                    className="bg-secondary/30 border-border/50 h-16 text-foreground focus:ring-primary rounded-[1.5rem] px-8 text-lg font-mono shadow-inner"
                  />
                </div>
              </TabsContent>

              <TabsContent value="openai" className="space-y-6 animate-fade-in">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.3em]">OpenAI Key</label>
                    <Badge variant="outline" className="text-[9px] font-bold bg-amber-50 text-amber-600 border-amber-100 uppercase tracking-tighter">GPT Suite</Badge>
                  </div>
                  <Input 
                    type="password"
                    value={settings.openaiApiKey}
                    onChange={(e) => setSettings({...settings, openaiApiKey: e.target.value})}
                    placeholder="sk-..."
                    className="bg-secondary/30 border-border/50 h-16 text-foreground focus:ring-primary rounded-[1.5rem] px-8 text-lg font-mono shadow-inner"
                  />
                </div>
              </TabsContent>

              <TabsContent value="openrouter" className="space-y-6 animate-fade-in">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.3em]">OpenRouter Key</label>
                    <Badge variant="outline" className="text-[9px] font-bold bg-blue-50 text-blue-600 border-blue-100 uppercase tracking-tighter">Global AI Hub</Badge>
                  </div>
                  <Input 
                    type="password"
                    value={settings.openrouterApiKey}
                    onChange={(e) => setSettings({...settings, openrouterApiKey: e.target.value})}
                    placeholder="sk-or-v1-..."
                    className="bg-secondary/30 border-border/50 h-16 text-foreground focus:ring-primary rounded-[1.5rem] px-8 text-lg font-mono shadow-inner"
                  />
                </div>
                <Alert className="bg-blue-50/50 border-blue-100 rounded-[2rem] p-6">
                  <Info className="w-5 h-5 text-blue-500" />
                  <AlertDescription className="text-xs text-blue-700 font-medium leading-relaxed">
                    Usa OpenRouter para acceder a modelos como <strong>Qwen 2.5</strong>, <strong>Llama 3.1</strong> y <strong>Claude 3.5</strong> con una sola configuración.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="p-12 pt-0">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-20 text-xl shadow-2xl glow-primary rounded-[2rem] transition-all hover:-translate-y-1"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin mr-4" /> : <Database className="w-6 h-6 mr-4" />}
              {loading ? "Sincronizando..." : "Actualizar Central de Inteligencia"}
            </Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none p-10 space-y-8 bg-white shadow-xl rounded-[3rem] border-l-8 border-primary relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="bg-primary/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary relative z-10">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-4 relative z-10">
              <h4 className="font-headline font-bold text-foreground text-2xl tracking-tight">Potencia Qwen & Llama</h4>
              <p className="text-md text-muted-foreground leading-relaxed">
                Aprovecha la capacidad de razonamiento de <strong>Qwen 2.5 72B</strong> para análisis de mercado complejos o <strong>Claude 3.5</strong> para copywriting de alta conversión.
              </p>
            </div>
          </Card>

          <Card className="border-none p-10 space-y-8 bg-white shadow-xl rounded-[3rem] border-l-8 border-accent relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
            <div className="bg-accent/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-accent relative z-10">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <div className="space-y-4 relative z-10">
              <h4 className="font-headline font-bold text-foreground text-2xl tracking-tight">Agilidad Neural</h4>
              <p className="text-md text-muted-foreground leading-relaxed">
                MarketScout Pro es agnóstico. Cambia de IA según el coste o la precisión que requiera tu campaña en cada momento.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
