
"use client";

import React, { useState } from "react";
import { Zap, Sparkles, Loader2, Copy, FileText, Layout, Palette } from "lucide-react";
import { generateMarketingAssets, type GenerateMarketingAssetsOutput } from "@/ai/flows/generate-marketing-assets-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
    businessName: "",
    industry: "",
    targetAudience: "",
    keyFeatures: "",
    marketingGoal: "Reconocimiento de marca"
  });

  const handleGenerate = async () => {
    if (!formData.businessName || !formData.industry) {
      toast({ title: "Faltan datos", description: "Por favor rellena al menos el nombre y la industria.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await generateMarketingAssets(formData);
      setOutput(result);
      toast({ title: "Éxito", description: "Estrategia generada con éxito." });
    } catch (error) {
      toast({ title: "Error", description: "Hubo un problema al conectar con la IA.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Contenido copiado al portapapeles." });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="xl:col-span-1 border-none shadow-sm h-fit">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> Configuración AI
          </CardTitle>
          <CardDescription>Define tu negocio para obtener activos de marketing personalizados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Nombre del Negocio</label>
            <Input 
              value={formData.businessName} 
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              placeholder="Ej: InnovaTech"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Industria</label>
            <Input 
              value={formData.industry} 
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
              placeholder="Ej: SaaS de Logística"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Audiencia Objetivo</label>
            <Input 
              value={formData.targetAudience} 
              onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              placeholder="Ej: Pequeñas empresas de transporte"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Características Clave</label>
            <Textarea 
              value={formData.keyFeatures} 
              onChange={(e) => setFormData({...formData, keyFeatures: e.target.value})}
              placeholder="Ej: Automatización, Bajo coste, Soporte 24/7"
              className="min-h-[100px]"
            />
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-headline shadow-lg shadow-primary/10"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2 fill-accent text-accent" />}
            {loading ? "Generando..." : "Generar Estrategia"}
          </Button>
        </CardContent>
      </Card>

      <div className="xl:col-span-2 space-y-6">
        {!output && !loading && (
          <Card className="border-dashed border-2 bg-transparent h-[600px] flex flex-col items-center justify-center text-center p-12">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-primary mb-2">Tu motor creativo espera</h3>
            <p className="text-muted-foreground max-w-md">Completa los datos de la izquierda y deja que nuestra IA especializada en marketing diseñe tu próxima campaña ganadora.</p>
          </Card>
        )}

        {loading && (
          <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-accent rounded-full animate-spin" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold">Procesando Estrategia</h3>
              <p className="text-muted-foreground">Analizando competidores y audiencias para tu sector...</p>
            </div>
          </div>
        )}

        {output && (
          <div className="space-y-6 animate-fade-in pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Layout className="w-4 h-4 text-primary" /> Slogans Sugeridos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {output.slogans.map((slogan, i) => (
                    <div key={i} className="group p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-white transition-all flex items-center justify-between">
                      <p className="text-sm font-medium italic">"{slogan}"</p>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(slogan)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Concepto de Logo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <p className="text-sm leading-relaxed">{output.logoConcept}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Zap className="w-5 h-5 fill-accent text-accent" /> Estrategias de Marketing Tailored
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {output.marketingIdeas.map((idea, i) => (
                  <div key={i} className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
                    <Badge className="mb-2 bg-primary/10 text-primary border-none">Idea #{i+1}</Badge>
                    <p className="text-sm leading-relaxed text-muted-foreground">{idea}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-md flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Estructura de Folleto / Brochure
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-muted/10 p-6 rounded-lg whitespace-pre-wrap text-sm font-body leading-loose border">
                  {output.brochureOutline}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/5 flex justify-end gap-2 p-4">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(output.brochureOutline)}>Copiado Rápido</Button>
                <Button size="sm" className="bg-primary text-primary-foreground">Descargar PDF</Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
