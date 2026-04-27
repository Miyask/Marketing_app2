
"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Target, Calendar, BarChart, ShieldAlert, CheckCircle2, Layout } from "lucide-react";
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
    businessName: "",
    industry: "",
    targetAudience: "",
    budget: "",
    objectives: ""
  });

  const handleGenerate = async () => {
    if (!formData.businessName || !formData.industry) {
      toast({ title: "Datos incompletos", description: "Rellena los campos básicos para continuar.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await generateMarketingPlan(formData);
      setPlan(result);
      toast({ title: "¡Plan Generado!", description: "Tu estrategia de marketing está lista." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo generar el plan. Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-4 border-none shadow-sm h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Crear Estrategia
          </CardTitle>
          <CardDescription>Define los pilares de tu negocio para la IA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Nombre Empresa</label>
            <Input value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} placeholder="Ej: Blue Horizon Co." />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Industria / Sector</label>
            <Input value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} placeholder="Ej: Energía Solar B2B" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Presupuesto Estimado</label>
            <Input value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} placeholder="Ej: 500€ - 1000€ mensual" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Objetivos Principales</label>
            <Textarea value={formData.objectives} onChange={(e) => setFormData({...formData, objectives: e.target.value})} placeholder="Ej: Captar 50 leads nuevos al mes..." className="min-h-[80px]" />
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
            {loading ? "Diseñando Plan..." : "Generar Plan Maestro"}
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-8 space-y-6">
        {!plan && !loading && (
          <div className="h-[500px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-8 bg-muted/5">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Layout className="w-8 h-8 text-primary opacity-50" />
            </div>
            <h3 className="text-xl font-headline font-bold">Tu Plan de Marketing aparecerá aquí</h3>
            <p className="text-muted-foreground max-w-sm">Introduce los detalles de tu negocio a la izquierda para que nuestra IA diseñe una estrategia completa.</p>
          </div>
        )}

        {loading && (
          <div className="h-[500px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="animate-pulse font-medium">Analizando mercado y audiencias...</p>
          </div>
        )}

        {plan && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-white/20 text-white border-none">Estrategia Generada</Badge>
                <CardTitle className="text-3xl font-headline font-bold">{plan.strategyTitle}</CardTitle>
                <CardDescription className="text-primary-foreground/80">{plan.executiveSummary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BarChart className="w-4 h-4" /> ROI Estimado: {plan.estimatedRoi}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-500" /> Análisis SWOT</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Fortalezas</h5>
                    <ul className="text-sm space-y-1">{plan.swotAnalysis.strengths.map((s, i) => <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {s}</li>)}</ul>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase text-red-600 mb-1">Debilidades</h5>
                    <ul className="text-sm space-y-1">{plan.swotAnalysis.weaknesses.map((s, i) => <li key={i} className="flex items-center gap-2">○ {s}</li>)}</ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /> Calendario 4 Semanas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.contentCalendarPreview.map((item, i) => (
                    <div key={i} className="p-2 bg-muted/30 rounded border-l-2 border-primary">
                      <p className="text-[10px] font-bold text-primary">{item.week}</p>
                      <p className="text-xs font-semibold">{item.topic}</p>
                      <p className="text-[10px] text-muted-foreground">{item.actionItem}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
