
"use client";

import React, { useState } from "react";
import { Zap, Sparkles, Loader2, Copy, Layout, Palette } from "lucide-react";
import { generateMarketingAssets, type GenerateMarketingAssetsOutput } from "@/ai/flows/generate-marketing-assets-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
      toast({ title: "Activos Listos", description: "He creado slogans e ideas creativas." });
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="xl:col-span-1 glass-card border-none shadow-sm h-fit">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-accent" /> Configuración AI
          </CardTitle>
          <CardDescription className="text-muted-foreground/60">Datos para la generación de activos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Empresa</label>
            <Input value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} className="bg-white/5 border-white/10" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Características</label>
            <Textarea 
              value={formData.keyFeatures} 
              onChange={(e) => setFormData({...formData, keyFeatures: e.target.value})}
              className="min-h-[100px] bg-white/5 border-white/10"
            />
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-headline shadow-lg glow-primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2 fill-accent text-accent" />}
            {loading ? "Generando..." : "Crear Activos Creativos"}
          </Button>
        </CardContent>
      </Card>

      <div className="xl:col-span-2 space-y-6">
        {!output && !loading && (
          <div className="border border-dashed border-white/10 rounded-3xl h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white/5">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <Sparkles className="w-12 h-12 text-primary opacity-50" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-white mb-2">Creatividad Ilimitada</h3>
            <p className="text-muted-foreground max-w-md">Pulsa el botón para generar slogans, conceptos de logo y estructuras de marketing.</p>
          </div>
        )}

        {loading && (
          <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-accent rounded-full animate-spin" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-pulse" />
            </div>
            <h3 className="text-xl font-headline font-bold text-white">Analizando Audiencias...</h3>
          </div>
        )}

        {output && (
          <div className="space-y-6 animate-fade-in pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card border-none shadow-sm h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2 text-white">
                    <Layout className="w-4 h-4 text-primary" /> Slogans
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {output.slogans.map((slogan, i) => (
                    <div key={i} className="group p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-all flex items-center justify-between">
                      <p className="text-sm font-medium italic text-white/90">"{slogan}"</p>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(slogan)} className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50"><Copy className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card border-none shadow-sm h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2 text-white">
                    <Palette className="w-4 h-4 text-primary" /> Concepto Visual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm leading-relaxed text-white/80">{output.logoConcept}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary font-headline">
                  <Zap className="w-5 h-5 fill-accent text-accent" /> Estrategias Creativas
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {output.marketingIdeas.map((idea, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                    <Badge className="mb-2 bg-primary/20 text-primary border-none">Idea #{i+1}</Badge>
                    <p className="text-sm leading-relaxed text-muted-foreground">{idea}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
