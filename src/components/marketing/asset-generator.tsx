"use client";

import React, { useState } from "react";
import { Zap, Sparkles, Loader2, Copy, Layout, Palette, FileText, CheckCircle2 } from "lucide-react";
import { generateMarketingAssets, type GenerateMarketingAssetsOutput } from "@/ai/flows/generate-marketing-assets-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AssetGenerator() {
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

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateMarketingAssets(formData);
      setOutput(result);
      toast({ title: "Activos Listos", description: "He creado slogans, logos y folletos para ti." });
    } catch (error) {
      toast({ title: "Error", description: "Hubo un problema. Reintenta.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Contenido guardado." });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <Card className="xl:col-span-4 glass-card border-none shadow-xl h-fit">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-foreground">
            <Sparkles className="w-5 h-5 text-accent" /> Brainstorming Engine
          </CardTitle>
          <CardDescription className="text-muted-foreground">Define los valores de marca para la IA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nombre Comercial</label>
            <Input 
              value={formData.businessName} 
              onChange={(e) => setFormData({...formData, businessName: e.target.value})} 
              className="bg-secondary/50 border-border h-12 rounded-xl focus:ring-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Propuesta de Valor</label>
            <Textarea 
              value={formData.keyFeatures} 
              onChange={(e) => setFormData({...formData, keyFeatures: e.target.value})}
              className="min-h-[120px] bg-secondary/50 border-border rounded-xl focus:ring-primary transition-colors"
            />
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white py-7 text-lg font-headline shadow-lg glow-primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2 fill-accent text-accent" />}
            {loading ? "Calculando..." : "Generar Activos Creativos"}
          </Button>
        </CardContent>
      </Card>

      <div className="xl:col-span-8 space-y-6">
        {!output && !loading && (
          <div className="border border-dashed border-border rounded-3xl h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white/50 shadow-inner">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <Layout className="w-12 h-12 text-primary opacity-50" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-foreground mb-2">Creatividad Instantánea</h3>
            <p className="text-muted-foreground max-w-md">La IA diseñará conceptos de logo, slogans y la estructura de tu próximo folleto publicitario.</p>
          </div>
        )}

        {loading && (
          <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary/20 border-t-accent rounded-full animate-spin" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-pulse" />
            </div>
            <h3 className="text-xl font-headline font-bold text-foreground animate-pulse">Destilando Esencia de Marca...</h3>
          </div>
        )}

        {output && (
          <div className="animate-fade-in space-y-6 pb-12">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-muted border-border p-1 mb-8 rounded-2xl h-14">
                <TabsTrigger value="overview" className="rounded-xl px-8 font-bold uppercase text-[10px] data-[state=active]:bg-white shadow-sm">Resumen Creativo</TabsTrigger>
                <TabsTrigger value="logo" className="rounded-xl px-8 font-bold uppercase text-[10px] data-[state=active]:bg-white shadow-sm">Concepto Logo</TabsTrigger>
                <TabsTrigger value="brochure" className="rounded-xl px-8 font-bold uppercase text-[10px] data-[state=active]:bg-white shadow-sm">Estructura Folleto</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass-card border-none p-6 bg-white shadow-sm">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-md flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Slogans Ganadores
                      </CardTitle>
                    </CardHeader>
                    <div className="space-y-3">
                      {output.slogans.map((slogan, i) => (
                        <div key={i} className="group p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all flex items-center justify-between">
                          <p className="text-sm font-medium italic text-foreground/90">"{slogan}"</p>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(slogan)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-3 h-3 text-muted-foreground" /></Button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="glass-card border-none p-6 bg-white shadow-sm">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-md flex items-center gap-2 text-foreground">
                        <Sparkles className="w-4 h-4 text-primary" /> Estrategias de Atracción
                      </CardTitle>
                    </CardHeader>
                    <div className="space-y-3">
                      {output.marketingIdeas.slice(0, 3).map((idea, i) => (
                        <div key={i} className="p-4 rounded-xl border border-border bg-muted/30 text-xs text-muted-foreground leading-relaxed">
                          <Badge className="mb-2 bg-primary/20 text-primary border-none">Estrategia #{i+1}</Badge>
                          <p>{idea}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="logo">
                <Card className="glass-card border-none p-8 bg-white shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-primary/20 p-4 rounded-2xl">
                      <Palette className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-headline font-bold text-foreground">Dirección de Arte</h3>
                      <p className="text-sm text-muted-foreground">Concepto visual y paleta sugerida por IA.</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 border border-border rounded-2xl p-6 leading-relaxed text-lg text-foreground/80 italic">
                    {output.logoConcept}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="brochure">
                <Card className="glass-card border-none p-8 bg-white shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-accent/20 p-4 rounded-2xl">
                      <FileText className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-headline font-bold text-foreground">Mockup de Contenidos</h3>
                      <p className="text-sm text-muted-foreground">Estructura de secciones para tus materiales impresos o PDF.</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 border border-border rounded-2xl p-8 whitespace-pre-wrap font-mono text-sm text-muted-foreground">
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