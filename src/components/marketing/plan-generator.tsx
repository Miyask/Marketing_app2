"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Target, Calendar, ShieldAlert, CheckCircle2, FileText, ChevronRight, Cpu, BarChart3, Presentation } from "lucide-react";
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
    budget: "2.500€ - 5.000€ mensuales",
    objectives: "Conseguir 15 auditorías energéticas firmadas al mes."
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateMarketingPlan({
        ...formData,
        userConfig: profile?.aiSettings
      });
      setPlan(result);
      toast({ title: "Estrategia de Alto Nivel", description: "El motor IA ha completado el análisis estratégico." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo conectar con el motor de IA.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <Card className="xl:col-span-4 glass-card border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="h-2 bg-gradient-to-r from-primary via-indigo-500 to-accent" />
        <CardHeader className="p-10 pb-6">
          <CardTitle className="text-3xl font-headline font-bold text-white flex items-center gap-4">
            <Presentation className="w-8 h-8 text-primary" /> Setup
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm leading-relaxed">Configura los vectores de entrada para que la IA diseñe tu estrategia maestra.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-0 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.3em] px-1">Unidad de Negocio</label>
            <Input value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} className="bg-white/5 border-white/5 h-14 rounded-2xl text-white text-lg focus:ring-primary" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.3em] px-1">Vertical de Industria</label>
            <Input value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="bg-white/5 border-white/5 h-14 rounded-2xl text-white focus:ring-primary" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.3em] px-1">KPIs & Objetivos</label>
            <Textarea value={formData.objectives} onChange={(e) => setFormData({...formData, objectives: e.target.value})} className="min-h-[120px] bg-white/5 border-white/5 rounded-2xl text-white leading-relaxed p-4 focus:ring-primary" />
          </div>

          <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-4">
            <div className="bg-primary/20 p-2 rounded-xl">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Active Engine</p>
              <p className="text-xs font-bold text-white truncate">{profile?.aiSettings?.modelId?.split('/').pop() || "Gemini 1.5 Pro"}</p>
            </div>
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white h-16 text-xl font-headline font-bold rounded-2xl glow-primary shadow-2xl transition-all active:scale-95" 
            onClick={handleGenerate} 
            disabled={loading}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Sparkles className="w-6 h-6 mr-3 fill-accent text-accent" />}
            {loading ? "Calculando Estrategia..." : "Generar Plan Maestro"}
          </Button>
        </CardContent>
      </Card>

      <div className="xl:col-span-8 space-y-12 min-h-[700px]">
        {!plan && !loading && (
          <div className="h-full border border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center p-20 bg-white/[0.02] backdrop-blur-3xl animate-fade-in">
            <div className="w-32 h-32 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mb-10 border border-primary/10 animate-float shadow-2xl">
              <BarChart3 className="w-16 h-16 text-primary opacity-30" />
            </div>
            <h3 className="text-4xl font-headline font-bold text-white mb-6 tracking-tight">Intelligence Ready</h3>
            <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
              Introduce los parámetros de tu negocio a la izquierda y deja que nuestro motor de IA estratégica diseñe tu próxima campaña de éxito.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center space-y-8 animate-pulse">
            <div className="relative">
              <div className="w-32 h-32 border-b-4 border-primary rounded-full animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-headline font-bold text-white tracking-widest uppercase">Escaneando Mercado</p>
              <p className="text-muted-foreground">Procesando vectores estratégicos con {profile?.aiSettings?.modelId?.split('/').pop() || "Gemini"}...</p>
            </div>
          </div>
        )}

        {plan && (
          <div className="space-y-10 animate-fade-in pb-20">
            <Card className="border-none bg-gradient-to-br from-primary via-primary/80 to-indigo-900 text-white overflow-hidden rounded-[3rem] p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative group">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <Badge className="mb-8 bg-white/20 text-white border-none backdrop-blur-xl px-6 py-2 rounded-full text-xs font-bold tracking-widest">ESTRATEGIA VALIDADA POR IA</Badge>
                <h3 className="text-6xl font-headline font-bold mb-8 tracking-tighter leading-[0.9]">{plan.strategyTitle}</h3>
                <p className="text-2xl text-white/90 leading-relaxed mb-12 max-w-4xl font-light italic border-l-2 border-white/20 pl-8">{plan.executiveSummary}</p>
                
                <div className="flex flex-wrap items-center gap-8">
                   <div className="bg-white/10 backdrop-blur-2xl px-8 py-6 rounded-[2rem] border border-white/10 shadow-xl">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2">ROI Proyectado</p>
                      <p className="text-4xl font-headline font-bold">{plan.estimatedRoi}</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-2xl px-8 py-6 rounded-[2rem] border border-white/10 shadow-xl">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2">Canales Clave</p>
                      <p className="text-xl font-headline font-bold uppercase tracking-tight">{plan.recommendedChannels.length} Recomendados</p>
                   </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-card border-none p-10 rounded-[2.5rem]">
                <div className="flex items-center gap-4 mb-8 text-primary">
                  <ShieldAlert className="w-7 h-7" />
                  <h4 className="text-2xl font-headline font-bold text-white tracking-tight">Análisis SWOT 360°</h4>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold uppercase text-emerald-400 tracking-[0.3em] flex items-center gap-3">
                      <span className="w-3 h-0.5 bg-emerald-400" /> Fortalezas Clave
                    </h5>
                    <div className="grid gap-3">
                      {plan.swotAnalysis.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-4 text-sm text-white/70 bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold uppercase text-amber-400 tracking-[0.3em] flex items-center gap-3">
                      <span className="w-3 h-0.5 bg-amber-400" /> Desafíos de Mercado
                    </h5>
                    <div className="grid gap-3">
                      {plan.swotAnalysis.weaknesses.map((s, i) => (
                        <div key={i} className="flex items-start gap-4 text-sm text-white/70 bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all">
                          <ChevronRight className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /> {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="glass-card border-none p-10 rounded-[2.5rem]">
                <div className="flex items-center gap-4 mb-8 text-indigo-400">
                  <Calendar className="w-7 h-7" />
                  <h4 className="text-2xl font-headline font-bold text-white tracking-tight">Roadmap de Ejecución</h4>
                </div>
                <div className="space-y-4">
                  {plan.contentCalendarPreview.map((item, i) => (
                    <div key={i} className="group relative p-6 bg-white/[0.03] rounded-3xl border border-white/5 hover:bg-white/[0.06] hover:border-primary/20 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="text-[9px] border-primary/20 text-primary uppercase font-bold tracking-widest px-3 py-1 bg-primary/5">{item.week}</Badge>
                      </div>
                      <p className="text-lg font-bold text-white mb-2 tracking-tight">{item.topic}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.actionItem}</p>
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
