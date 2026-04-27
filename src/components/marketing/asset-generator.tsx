
"use client";

import React, { useState } from "react";
import { Zap, Sparkles, Loader2, Copy, Layout, Palette, FileText, CheckCircle2, Info } from "lucide-react";
import { generateMarketingAssets, type GenerateMarketingAssetsOutput } from "@/ai/flows/generate-marketing-assets-flow";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AssetGenerator() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<GenerateMarketingAssetsOutput | null>(null);
  
  const [formData, setFormData] = useState({
    businessName: "GastroFusion Delivery",
    industry: "FoodTech / Restauración",
    targetAudience: "Jóvenes profesionales urbanos que buscan comida sana y rápida.",
    keyFeatures: "Ingredientes KM0, entrega en menos de 20 min, packagings 100% biodegradables.",
    marketingGoal: "Reconocimiento de marca y fidelización"
  });

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userRef);

  const handleGenerate = async () => {
    if (!profile?.aiSettings?.apiKey) {
      toast({ 
        title: "API Key requerida", 
        description: "Configura tu API Key en Ajustes de IA para activar el motor creativo.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateMarketingAssets({
        ...formData,
      });
      setOutput(result);
      toast({ title: "Activos Listos", description: "He creado slogans, logos y folletos para ti." });
    } catch (error) {
      toast({ title: "Error", description: "Hubo un problema con la IA. Reintenta.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Contenido guardado en el portapapeles." });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
      <Card className="xl:col-span-4 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
        <div className="h-1.5 bg-accent" />
        <CardHeader className="p-10 pb-6">
          <CardTitle className="text-2xl font-headline font-bold flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-accent" /> Brainstorming
          </CardTitle>
          <CardDescription className="text-sm">Define la esencia de tu marca para que la IA diseñe tus activos.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-0 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Nombre Comercial</label>
            <Input 
              value={formData.businessName} 
              onChange={(e) => setFormData({...formData, businessName: e.target.value})} 
              className="bg-secondary/50 border-border h-12 rounded-xl focus:ring-accent transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Público Objetivo</label>
            <Input 
              value={formData.targetAudience} 
              onChange={(e) => setFormData({...formData, targetAudience: e.target.value})} 
              className="bg-secondary/50 border-border h-12 rounded-xl focus:ring-accent transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Propuesta de Valor</label>
            <Textarea 
              value={formData.keyFeatures} 
              onChange={(e) => setFormData({...formData, keyFeatures: e.target.value})}
              className="min-h-[120px] bg-secondary/50 border-border rounded-xl focus:ring-accent transition-colors p-4"
            />
          </div>
          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-white py-7 text-lg font-headline shadow-lg glow-accent rounded-xl"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2 fill-white" />}
            {loading ? "Creando Activos..." : "Generar Suite Creativa"}
          </Button>
        </CardContent>
      </Card>

      <div className="xl:col-span-8 space-y-6 min-h-[600px]">
        {!output && !loading && (
          <div className="h-full border border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center p-16 bg-white shadow-sm">
            <div className="bg-accent/10 p-6 rounded-3xl mb-6">
              <Layout className="w-12 h-12 text-accent opacity-50" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-foreground mb-4">Identidad Instantánea</h3>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              La IA diseñará conceptos de logo, slogans y la estructura de tu próximo folleto publicitario basándose en tu perfil.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-pulse bg-white rounded-[2.5rem] shadow-sm">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-accent/10 border-t-accent rounded-full animate-spin" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-pulse" />
            </div>
            <h3 className="text-xl font-headline font-bold text-foreground">Destilando Esencia de Marca...</h3>
          </div>
        )}

        {output && (
          <div className="animate-fade-in space-y-8 pb-12">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-muted border-border p-1 mb-8 rounded-[2rem] h-16 w-full max-w-md mx-auto">
                <TabsTrigger value="overview" className="rounded-2xl flex-1 font-bold uppercase text-[10px] data-[state=active]:bg-white shadow-sm">Overview</TabsTrigger>
                <TabsTrigger value="logo" className="rounded-2xl flex-1 font-bold uppercase text-[10px] data-[state=active]:bg-white shadow-sm">Concepto Logo</TabsTrigger>
                <TabsTrigger value="brochure" className="rounded-2xl flex-1 font-bold uppercase text-[10px] data-[state=active]:bg-white shadow-sm">Folleto</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-none p-8 bg-white shadow-sm rounded-[2rem]">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="bg-emerald-500/10 p-2 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
                       <h4 className="text-lg font-headline font-bold text-foreground">Slogans Sugeridos</h4>
                    </div>
                    <div className="space-y-4">
                      {output.slogans.map((slogan, i) => (
                        <div key={i} className="group p-5 rounded-2xl bg-secondary/30 border border-border hover:border-accent/30 transition-all flex items-center justify-between">
                          <p className="text-sm font-medium italic text-foreground/90 leading-relaxed">"{slogan}"</p>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(slogan)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy className="w-3 h-3 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="border-none p-8 bg-white shadow-sm rounded-[2rem]">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="bg-accent/10 p-2 rounded-lg"><Info className="w-5 h-5 text-accent" /></div>
                       <h4 className="text-lg font-headline font-bold text-foreground">Marketing Ideas</h4>
                    </div>
                    <div className="space-y-4">
                      {output.marketingIdeas.slice(0, 3).map((idea, i) => (
                        <div key={i} className="p-5 rounded-2xl border border-border bg-secondary/30 text-xs text-muted-foreground leading-relaxed">
                          <Badge className="mb-3 bg-accent/20 text-accent border-none px-2 py-0.5 rounded-md font-bold text-[9px]">CANAL {i+1}</Badge>
                          <p>{idea}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="logo">
                <Card className="border-none p-10 bg-white shadow-sm rounded-[2.5rem]">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="bg-accent/10 p-5 rounded-2xl">
                      <Palette className="w-10 h-10 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-headline font-bold text-foreground tracking-tighter">Art Direction</h3>
                      <p className="text-sm text-muted-foreground">Manual de estilo visual sugerido por IA.</p>
                    </div>
                  </div>
                  <div className="bg-secondary/30 border border-border rounded-[2rem] p-10 leading-relaxed text-xl text-foreground/80 italic font-light font-headline">
                    "{output.logoConcept}"
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="brochure">
                <Card className="border-none p-10 bg-white shadow-sm rounded-[2.5rem]">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="bg-primary/10 p-5 rounded-2xl">
                      <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-headline font-bold text-foreground tracking-tighter">Sales Brochure</h3>
                      <p className="text-sm text-muted-foreground">Estructura de secciones para materiales PDF o impresos.</p>
                    </div>
                  </div>
                  <div className="bg-secondary/30 border border-border rounded-[2rem] p-10 whitespace-pre-wrap font-mono text-xs text-muted-foreground leading-loose">
                    {output.brochureOutline}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
