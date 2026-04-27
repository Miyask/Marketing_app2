"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Calendar, ShieldAlert, CheckCircle2, ChevronRight, Cpu, BarChart3, Presentation } from "lucide-react";
import { generateMarketingPlan, type MarketingPlanOutput } from "@/ai/flows/generate-marketing-plan-flow";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function PlanGenerator() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MarketingPlanOutput | null>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userRef);

  const [formData, setFormData] = useState({
    businessName: "Elite Solar Dynamics",
    industry: "Energía Fotovoltaica B2B",
    targetAudience: "Directores de Operaciones en naves logísticas industriales.",
    budget: "3.000€ - 6.000€ mensuales",
    objectives: "Captar 20 leads cualificados y cerrar 5 instalaciones al mes."
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateMarketingPlan({
        ...formData,
        userConfig: profile?.aiSettings
      });
      setPlan(result);
      toast({ title: "Estrategia Generada", description: "El plan maestro ha sido completado con éxito." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo conectar con el motor de IA.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
      <Card className="xl:col-span-4 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
        <div className="h-1.5 bg-primary" />
        <CardHeader className="p-10 pb-6">
          <CardTitle className="text-2xl font-headline font-bold flex items-center gap-3">
            <Presentation className="w-6 h-6 text-primary" /> Parámetros
          </CardTitle>
          <CardDescription className="text-sm">Define los pilares para que la IA diseñe tu estrategia.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-0 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Negocio</label>
            <Input 
              value={formData.businessName} 
              onChange={(e) => setFormData({...formData, businessName: e.target.value})} 
              className="bg-secondary/50 border-border h-12 rounded-xl focus:ring-primary transition-colors" 
              placeholder="Nombre de la empresa"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Industria</label>
            <Input 
              value={formData.industry} 
              onChange={(e) => setFormData({...formData, industry: e.target.value})} 
              className="bg-secondary/50 border-border h-12 rounded-xl focus:ring-primary transition-colors" 
              placeholder="Sector industrial"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Objetivos</label>
            <Textarea 
              value={formData.objectives} 
              onChange={(e) => setFormData({...formData, objectives: e.target.value})} 
              className="min-h-[100px] bg-secondary/50 border-border rounded-xl p-4 focus:ring-primary transition-colors" 
              placeholder="¿Qué quieres conseguir?"
            />
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase text-muted-foreground">Motor IA Activo</p>
              <p className="text-xs font-bold text-foreground">{profile?.aiSettings?.modelId?.split('/').pop() || "Gemini 1.5 Flash"}</p>
            </div>
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-bold rounded-xl glow-primary shadow-lg" 
            onClick={handleGenerate} 
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Sparkles className="w-5 h-5 mr-3" />}
            {loading ? "Calculando..." : "Generar Plan Maestro"}
          </Button>
        </CardContent>
      </Card>

      <div className="xl:col-span-8 space-y-10 min-h-[600px]">
        {!plan && !loading && (
          <div className="h-full border border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center p-16 bg-white shadow-sm">
            <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-foreground mb-4">Listo para el Análisis</h3>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Define tu negocio a la izquierda y pulsa el botón para generar una estrategia completa.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center space-y-6 animate-pulse">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground uppercase tracking-widest">Escaneando Vectores...</p>
          </div>
        )}

        {plan && (
          <div className="space-y-8 animate-fade-in pb-20">
            <Card className="border-none bg-primary text-white overflow-hidden rounded-[2.5rem] p-10 shadow-xl relative group">
              <div className="relative z-10">
                <Badge className="mb-6 bg-white/20 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest">ESTRATEGIA VALIDADA POR IA</Badge>
                <h3 className="text-5xl font-headline font-bold mb-6 tracking-tighter">{plan.strategyTitle}</h3>
                <p className="text-xl text-white/90 leading-relaxed mb-10 max-w-3xl font-light italic pl-6 border-l-2 border-white/20">{plan.executiveSummary}</p>
                
                <div className="flex flex-wrap gap-6">
                   <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">ROI Proyectado</p>
                      <p className="text-3xl font-headline font-bold">{plan.estimatedRoi}</p>
                   </div>
                   <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Canales Clave</p>
                      <p className="text-xl font-headline font-bold">{plan.recommendedChannels.length} Recomendados</p>
                   </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm p-8 bg-white rounded-[2rem]">
                <div className="flex items-center gap-4 mb-6 text-primary">
                  <ShieldAlert className="w-6 h-6" />
                  <h4 className="text-xl font-headline font-bold text-foreground">Análisis SWOT</h4>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-bold uppercase text-accent tracking-widest">Fortalezas</h5>
                    {plan.swotAnalysis.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" /> {s}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-bold uppercase text-primary tracking-widest">Debilidades</h5>
                    {plan.swotAnalysis.weaknesses.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                        <ChevronRight className="w-4 h-4 text-primary shrink-0" /> {s}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="border-none shadow-sm p-8 bg-white rounded-[2rem]">
                <div className="flex items-center gap-4 mb-6 text-accent">
                  <Calendar className="w-6 h-6" />
                  <h4 className="text-xl font-headline font-bold text-foreground">Roadmap de Ejecución</h4>
                </div>
                <div className="space-y-4">
                  {plan.contentCalendarPreview.map((item, i) => (
                    <div key={i} className="p-5 bg-muted/30 rounded-2xl border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="text-[9px] border-none bg-primary/10 text-primary uppercase font-bold px-2 py-0.5">{item.week}</Badge>
                      </div>
                      <p className="text-md font-bold text-foreground mb-1">{item.topic}</p>
                      <p className="text-xs text-muted-foreground">{item.actionItem}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}