
"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Target, Calendar, BarChart, ShieldAlert, CheckCircle2, Layout, FileText, ChevronRight } from "lucide-react";
import { generateMarketingPlan, type MarketingPlanOutput } from "@/ai/flows/generate-marketing-plan-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function PlanGenerator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MarketingPlanOutput | null>(null);
  const [formData, setFormData] = useState({
    businessName: "EcoBoost Solar Solutions",
    industry: "Energía Renovable B2B",
    targetAudience: "Gerentes de naves industriales interesados en ahorro energético y sostenibilidad.",
    budget: "1.500€ - 3.000€ mensuales",
    objectives: "Conseguir 20 reuniones cualificadas con directores de planta al mes."
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateMarketingPlan(formData);
      setPlan(result);
      toast({ title: "¡Estrategia Generada!", description: "He analizado tu sector y creado un plan maestro." });
    } catch (error) {
      toast({ title: "Error", description: "La IA está ocupada. Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <Card className="lg:col-span-4 glass-card border-none overflow-hidden h-fit">
        <div className="h-2 bg-gradient-to-r from-primary to-accent" />
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Target className="w-5 h-5 text-primary" /> Parámetros
          </CardTitle>
          <CardDescription>Datos pre-cargados para que pruebes ahora mismo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Empresa</label>
            <Input value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} placeholder="Nombre" className="bg-white/5 border-white/10 h-11" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Sector</label>
            <Input value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} placeholder="Sector" className="bg-white/5 border-white/10 h-11" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Objetivos</label>
            <Textarea value={formData.objectives} onChange={(e) => setFormData({...formData, objectives: e.target.value})} placeholder="Metas" className="min-h-[100px] bg-white/5 border-white/10" />
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-headline font-bold glow-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Sparkles className="w-6 h-6 mr-2" />}
            {loading ? "Calculando..." : "Generar Plan Ahora"}
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-8 space-y-8 min-h-[600px]">
        {!plan && !loading && (
          <div className="h-full border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-white/5 backdrop-blur-sm">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20 animate-float">
              <FileText className="w-12 h-12 text-primary opacity-50" />
            </div>
            <h3 className="text-3xl font-headline font-bold text-white mb-4">Motor de Estrategia AI</h3>
            <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
              Pulsa el botón de la izquierda para ver cómo la IA diseña una estrategia de 360 grados para el ejemplo.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-b-4 border-primary rounded-full animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-xl font-headline font-bold text-white">Analizando Oportunidades</p>
              <p className="text-muted-foreground animate-pulse">Escaneando competidores y tendencias del sector...</p>
            </div>
          </div>
        )}

        {plan && (
          <div className="space-y-8 animate-fade-in pb-12">
            <Card className="border-none bg-gradient-to-br from-primary to-primary/60 text-white overflow-hidden rounded-3xl p-8 shadow-2xl relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-40 h-40" />
              </div>
              <div className="relative z-10">
                <Badge className="mb-4 bg-white/20 text-white border-none backdrop-blur-md px-4 py-1">ESTRATEGIA GENERADA</Badge>
                <h3 className="text-5xl font-headline font-bold mb-6 tracking-tighter leading-none">{plan.strategyTitle}</h3>
                <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl border-l-4 border-white/30 pl-6">{plan.executiveSummary}</p>
                <div className="flex items-center gap-6">
                   <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">ROI Proyectado</p>
                      <p className="text-3xl font-headline font-bold">{plan.estimatedRoi}</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Confianza IA</p>
                      <p className="text-3xl font-headline font-bold">98%</p>
                   </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card border-none p-6 rounded-3xl">
                <div className="flex items-center gap-2 mb-6 text-primary">
                  <ShieldAlert className="w-6 h-6" />
                  <h4 className="text-xl font-headline font-bold text-white">Análisis SWOT</h4>
                </div>
                <div className="space-y-6">
                  <div>
                    <h5 className="text-xs font-bold uppercase text-emerald-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Fortalezas
                    </h5>
                    <ul className="space-y-2">
                      {plan.swotAnalysis.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-xl border border-white/5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase text-amber-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Desafíos
                    </h5>
                    <ul className="space-y-2">
                      {plan.swotAnalysis.weaknesses.map((s, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-xl border border-white/5">
                          <ChevronRight className="w-4 h-4 text-amber-500 mt-0.5" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="glass-card border-none p-6 rounded-3xl">
                <div className="flex items-center gap-2 mb-6 text-blue-400">
                  <Calendar className="w-6 h-6" />
                  <h4 className="text-xl font-headline font-bold text-white">Roadmap Mensual</h4>
                </div>
                <div className="space-y-4">
                  {plan.contentCalendarPreview.map((item, i) => (
                    <div key={i} className="group relative p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-[9px] border-primary/30 text-primary uppercase px-2">{item.week}</Badge>
                      </div>
                      <p className="text-sm font-bold text-white mb-1">{item.topic}</p>
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
