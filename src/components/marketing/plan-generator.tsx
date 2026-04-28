"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Calendar, ShieldAlert, CheckCircle2, ChevronRight, Cpu, BarChart3, Presentation, Save, Target, Rocket } from "lucide-react";
import { generateMarketingPlan, type MarketingPlanOutput } from "@/ai/flows/generate-marketing-plan-flow";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { hasDefaultGoogleKey } from "@/ai/check-default-key";

export function PlanGenerator() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MarketingPlanOutput | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasServerKey, setHasServerKey] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userRef);

  useEffect(() => {
    hasDefaultGoogleKey().then(setHasServerKey);
  }, []);

  const [formData, setFormData] = useState({
    businessName: "Elite Solar Dynamics",
    industry: "Energía Fotovoltaica B2B",
    targetAudience: "Directores de Operaciones en naves logísticas industriales.",
    budget: "3.000€ - 6.000€ mensuales",
    objectives: "Captar 20 leads cualificados y cerrar 5 instalaciones al mes."
  });

  const handleGenerate = async () => {
    const aiSettings = profile?.aiSettings;
    const modelId = aiSettings?.modelId || 'googleai/gemini-2.0-flash';
    
    let hasKey = false;
    if (modelId.startsWith('googleai/') && (aiSettings?.googleApiKey || hasServerKey)) hasKey = true;
    else if (modelId.startsWith('openai/') && aiSettings?.openaiApiKey) hasKey = true;
    else if (modelId.startsWith('openrouter/') && aiSettings?.openrouterApiKey) hasKey = true;
    
    if (!hasKey) {
      toast({ 
        title: "API Key requerida", 
        description: "Configura tu API Key en Ajustes de IA para activar el generador de estrategias.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateMarketingPlan({
        ...formData,
        userConfig: {
          modelId: aiSettings?.modelId || 'googleai/gemini-2.0-flash',
          googleApiKey: aiSettings?.googleApiKey,
          openaiApiKey: aiSettings?.openaiApiKey,
          openrouterApiKey: aiSettings?.openrouterApiKey,
        }
      });
      setPlan(result);
      toast({ title: "Estrategia Generada", description: "El plan maestro ha sido completado con éxito." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo conectar con el motor de IA.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = () => {
    if (!db || !user?.uid || !plan) return;
    setIsSaving(true);
    
    const campaignsRef = collection(db, "users", user.uid, "campaigns");
    const campaignId = Math.random().toString(36).substring(7);
    
    addDocumentNonBlocking(campaignsRef, {
      id: campaignId,
      userId: user.uid,
      name: plan.strategyTitle,
      status: "Planificado",
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      planData: plan
    });

    toast({ title: "Campaña Guardada", description: "El plan se ha guardado en tu pipeline de crecimiento." });
    setIsSaving(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <Card className="xl:col-span-4 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-2">
        <div className="bg-muted/30 rounded-[2.5rem] p-10 space-y-10">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold tracking-[0.2em] px-4 py-1">CONFIGURACIÓN</Badge>
            <h3 className="text-3xl font-headline font-bold text-foreground tracking-tighter">Parámetros</h3>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-[0.2em] px-1">Negocio</label>
              <Input 
                value={formData.businessName} 
                onChange={(e) => setFormData({...formData, businessName: e.target.value})} 
                className="bg-white border-border/40 h-14 rounded-2xl focus:ring-primary shadow-sm text-sm" 
                placeholder="Nombre de la empresa"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-[0.2em] px-1">Industria</label>
              <Input 
                value={formData.industry} 
                onChange={(e) => setFormData({...formData, industry: e.target.value})} 
                className="bg-white border-border/40 h-14 rounded-2xl focus:ring-primary shadow-sm text-sm" 
                placeholder="Sector industrial"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-[0.2em] px-1">Objetivos</label>
              <Textarea 
                value={formData.objectives} 
                onChange={(e) => setFormData({...formData, objectives: e.target.value})} 
                className="min-h-[120px] bg-white border-border/40 rounded-2xl p-5 focus:ring-primary shadow-sm text-sm" 
                placeholder="¿Qué quieres conseguir?"
              />
            </div>

            <div className="p-6 rounded-[2rem] bg-white border border-border/40 flex items-center gap-5 shadow-sm">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Motor Activo</p>
                <p className="text-xs font-bold text-foreground">{profile?.aiSettings?.modelId?.split('/').pop() || "Gemini 1.5 Flash"}</p>
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white h-16 text-lg font-bold rounded-2xl glow-primary shadow-xl transition-all hover:-translate-y-1" 
              onClick={handleGenerate} 
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Sparkles className="w-6 h-6 mr-3" />}
              {loading ? "Calculando..." : "Generar Plan"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="xl:col-span-8 min-h-[700px]">
        {!plan && !loading && (
          <div className="h-full border border-dashed border-border/60 rounded-[3rem] flex flex-col items-center justify-center text-center p-20 bg-white/50 shadow-inner">
            <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mb-8 animate-float">
              <Target className="w-12 h-12 text-primary/30" />
            </div>
            <h3 className="text-4xl font-headline font-bold text-foreground tracking-tighter mb-4">Listo para el Análisis</h3>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-lg">
              Define los pilares de tu negocio y la IA diseñará una estrategia maestra personalizada.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center space-y-8 animate-pulse bg-white rounded-[3rem] p-24 shadow-sm border border-border/30">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-headline font-bold text-foreground uppercase tracking-[0.3em]">PROCESANDO VECTORES</p>
              <p className="text-sm text-muted-foreground">Destilando inteligencia de mercado...</p>
            </div>
          </div>
        )}

        {plan && (
          <div className="space-y-12 animate-fade-in">
            <Card className="border-none bg-primary text-white overflow-hidden rounded-[3.5rem] p-12 lg:p-16 shadow-[0_30px_60px_-15px_rgba(24,95,53,0.3)] relative group">
              <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <Badge className="bg-white/20 text-white border-none px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase backdrop-blur-md">MAESTRÍA VALIDADA</Badge>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-2xl h-12 px-6 backdrop-blur-md font-bold"
                    onClick={handleSavePlan}
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Save className="w-4 h-4 mr-3" />}
                    Guardar Estrategia
                  </Button>
                </div>
                <h3 className="text-6xl lg:text-7xl font-headline font-bold mb-8 tracking-tighter leading-none">{plan.strategyTitle}</h3>
                <p className="text-2xl text-white/80 leading-relaxed mb-12 max-w-4xl font-light italic pl-8 border-l-4 border-white/20">{plan.executiveSummary}</p>
                
                <div className="flex flex-wrap gap-8">
                   <div className="bg-white/10 px-8 py-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md transition-all hover:bg-white/15">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2">ROI ESTIMADO</p>
                      <p className="text-4xl font-headline font-bold">{plan.estimatedRoi}</p>
                   </div>
                   <div className="bg-white/10 px-8 py-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md transition-all hover:bg-white/15">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2">CANALES CLAVE</p>
                      <p className="text-2xl font-headline font-bold flex items-center gap-3">
                        <Rocket className="w-6 h-6" /> {plan.recommendedChannels.length} Recomendados
                      </p>
                   </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="border-none shadow-xl p-10 bg-white rounded-[3rem] hover:shadow-2xl transition-all">
                <div className="flex items-center gap-5 mb-10">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary shadow-sm"><ShieldAlert className="w-7 h-7" /></div>
                  <h4 className="text-2xl font-headline font-bold text-foreground tracking-tight">Análisis DAFO AI</h4>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h5 className="text-[11px] font-bold uppercase text-accent tracking-[0.3em] px-1">Fortalezas Estratégicas</h5>
                    <div className="grid gap-3">
                      {plan.swotAnalysis.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-4 text-sm text-muted-foreground bg-muted/30 p-5 rounded-[1.5rem] border border-border/40 group hover:bg-white hover:shadow-md transition-all">
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" /> <span className="font-medium">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[11px] font-bold uppercase text-primary tracking-[0.3em] px-1">Debilidades Detectadas</h5>
                    <div className="grid gap-3">
                      {plan.swotAnalysis.weaknesses.map((s, i) => (
                        <div key={i} className="flex items-start gap-4 text-sm text-muted-foreground bg-muted/30 p-5 rounded-[1.5rem] border border-border/40 group hover:bg-white hover:shadow-md transition-all">
                          <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span className="font-medium">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-none shadow-xl p-10 bg-white rounded-[3rem] hover:shadow-2xl transition-all">
                <div className="flex items-center gap-5 mb-10 text-accent">
                  <div className="bg-accent/10 p-4 rounded-2xl text-accent shadow-sm"><Calendar className="w-7 h-7" /></div>
                  <h4 className="text-2xl font-headline font-bold text-foreground tracking-tight">Hoja de Ruta 30 Días</h4>
                </div>
                <div className="space-y-5">
                  {plan.contentCalendarPreview.map((item, i) => (
                    <div key={i} className="p-6 bg-muted/30 rounded-[2rem] border border-border/40 relative group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className="text-[10px] border-none bg-primary text-white uppercase font-bold px-3 py-1 rounded-full shadow-sm">{item.week}</Badge>
                      </div>
                      <p className="text-lg font-bold text-foreground mb-2 leading-tight">{item.topic}</p>
                      <p className="text-sm text-muted-foreground/80 leading-relaxed">{item.actionItem}</p>
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
