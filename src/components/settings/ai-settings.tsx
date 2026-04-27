
"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Key, ShieldCheck, Loader2, Save, Info, BrainCircuit, Network, Settings2, Sparkles, Zap, Bot, Database } from "lucide-react";
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

export function AISettings() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

  const [settings, setSettings] = useState({
    modelId: "googleai/gemini-2.0-flash-exp",
    googleApiKey: "AIzaSyDD7PB0c6UY-ymus8QBhA2-DODNspE3aI8",
    openaiApiKey: "",
    openrouterApiKey: "",
  });

  useEffect(() => {
    if (profile?.aiSettings) {
      setSettings({
        modelId: profile.aiSettings.modelId || "googleai/gemini-2.0-flash-exp",
        googleApiKey: profile.aiSettings.googleApiKey || "AIzaSyDD7PB0c6UY-ymus8QBhA2-DODNspE3aI8",
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
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-accent uppercase tracking-widest p-4">OpenAI Ecosystem</SelectLabel>
                    <SelectItem value="openai/gpt-4o" className="h-14 rounded-xl px-4 font-bold text-md">GPT-4o (Omni)</SelectItem>
                    <SelectItem value="openai/gpt-4o-mini" className="h-14 rounded-xl px-4 font-bold text-md">GPT-4o Mini</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-blue-500 uppercase tracking-widest p-4">OpenRouter (Elite Models)</SelectLabel>
                    <SelectItem value="openrouter/anthropic/claude-3.5-sonnet" className="h-14 rounded-xl px-4 font-bold text-md">Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="openrouter/meta-llama/llama-3.1-405b-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Llama 3.1 405B (Meta)</SelectItem>
                    <SelectItem value="openrouter/alibaba/qwen-2.5-72b-instruct" className="h-14 rounded-xl px-4 font-bold text-md">Qwen 2.5 72B (Alibaba)</SelectItem>
                    <SelectItem value="openrouter/deepseek/deepseek-chat" className="h-14 rounded-xl px-4 font-bold text-md">DeepSeek V3</SelectItem>
                    <SelectItem value="openrouter/x-ai/grok-2" className="h-14 rounded-xl px-4 font-bold text-md">Grok 2 (Beta)</SelectItem>
                    <SelectItem value="openrouter/mistralai/mistral-large" className="h-14 rounded-xl px-4 font-bold text-md">Mistral Large 2</SelectItem>
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
