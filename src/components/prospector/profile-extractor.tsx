
"use client";

import React, { useState, useEffect } from "react";
import { Globe, User, Mail, Phone, Share2, Search, Loader2, Link, AlertCircle, Save, CheckCircle2, TrendingUp, UserCheck, ShieldCheck, Briefcase, Star, AlertTriangle, Lightbulb, Zap, Code, Layout, FileText, Gauge, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { extractProfile, type ExtractProfileOutput } from "@/ai/flows/extract-profile-flow";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { hasDefaultGoogleKey } from "@/ai/check-default-key";

export function ProfileExtractor() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<ExtractProfileOutput | null>(null);
  const [hasServerKey, setHasServerKey] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userRef);

  useEffect(() => {
    hasDefaultGoogleKey().then(setHasServerKey);
  }, []);

  const handleExtract = async () => {
    if (!url) return;
    
    const aiSettings = profile?.aiSettings;
    const hasAnyKey = aiSettings?.googleApiKey || aiSettings?.openaiApiKey || aiSettings?.openrouterApiKey || hasServerKey;
    if (!hasAnyKey) {
      toast({ 
        title: "Credenciales Requeridas", 
        description: "Configura una API Key en Ajustes de IA para activar el Scouting Digital.",
        variant: "destructive" 
      });
      return;
    }

    setIsScanning(true);
    try {
      const data = await extractProfile({
        url,
        userConfig: {
          modelId: aiSettings?.modelId || 'googleai/gemini-2.0-flash',
          googleApiKey: aiSettings?.googleApiKey,
          openaiApiKey: aiSettings?.openaiApiKey,
          openrouterApiKey: aiSettings?.openrouterApiKey,
        }
      });
      setResult(data);
      toast({ title: "Perfil Decodificado", description: `Inteligencia de ${data.businessName} extraída con éxito.` });
    } catch (error) {
      toast({ 
        title: "Error de Scouting", 
        description: "No se pudo procesar la URL. Verifica las credenciales de IA.", 
        variant: "destructive" 
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveLead = () => {
    if (!db || !user?.uid || !result) return;
    setIsSaving(true);
    
    const businessProfilesRef = collection(db, "users", user.uid, "businessProfiles");
    const leadId = Math.random().toString(36).substring(7);

    addDocumentNonBlocking(businessProfilesRef, {
      id: leadId,
      userId: user.uid,
      name: result.businessName,
      url: url,
      ownerName: result.ownerName,
      email: result.email,
      phone: result.phone,
      industry: result.industry,
      leadStatus: "Lead Caliente",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiInsights: {
        marketingGap: result.marketingGap,
        ownerRole: result.ownerRole,
        suggestedApproach: result.suggestedApproach,
        competitors: result.competitors,
        strengths: result.strengths,
        technicalWeaknesses: result.technicalWeaknesses,
        marketingWeaknesses: result.marketingWeaknesses,
        uxWeaknesses: result.uxWeaknesses,
        improvementOpportunities: result.improvementOpportunities,
        contentAnalysis: result.contentAnalysis,
        seoAnalysis: result.seoAnalysis,
        overallScore: result.overallScore
      }
    });

    toast({ title: "Empresa Guardada", description: "El prospecto ha sido añadido a tu Pipeline de Ventas." });
    setIsSaving(false);
  };

  return (
    <div className="space-y-12">
      {/* Search Section - Now full width and more impactful */}
      <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-border/40">
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
        <CardContent className="p-12 lg:p-16">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary border-none px-6 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">Neural Web Scout</Badge>
              <h3 className="text-4xl lg:text-5xl font-headline font-bold text-foreground tracking-tighter">Decodifica el ADN de tu Competencia</h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Analiza cualquier sitio web para extraer el perfil del propietario, debilidades de marketing y estrategias de ataque.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-center bg-secondary/30 p-4 rounded-[2.5rem] border border-border/50 shadow-inner">
              <div className="relative flex-1 w-full">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                  <Globe className="w-6 h-6" />
                </div>
                <Input 
                  placeholder="https://empresa-objetivo.com" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-white border-none h-16 rounded-[2rem] focus:ring-primary shadow-sm text-lg font-medium pl-16 pr-8 w-full"
                />
              </div>
              <Button 
                className="w-full lg:w-fit bg-primary hover:bg-primary/90 text-white h-16 rounded-[2rem] shadow-xl glow-primary font-bold text-lg px-12 transition-all hover:-translate-y-1 active:scale-95" 
                onClick={handleExtract}
                disabled={isScanning || !url}
              >
                {isScanning ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Search className="w-6 h-6 mr-3" />}
                {isScanning ? "Scaneando..." : "Iniciar Scouting"}
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 pt-4">
               <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                 <UserCheck className="w-4 h-4 text-primary" /> Identificación Propietario
               </div>
               <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                 <ShieldCheck className="w-4 h-4 text-accent" /> Análisis de Brechas
               </div>
               <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                 <Briefcase className="w-4 h-4 text-primary" /> Sugerencia de Venta
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="min-h-[400px]">
        {!result && !isScanning && (
          <div className="h-full border border-dashed border-border/60 rounded-[4rem] flex flex-col items-center justify-center text-center p-24 bg-white/50">
            <div className="bg-muted/50 w-28 h-28 rounded-[2.5rem] flex items-center justify-center mb-10 animate-float">
              <Search className="text-muted-foreground/20 w-14 h-14" />
            </div>
            <h3 className="font-headline text-3xl font-bold text-foreground mb-4 tracking-tight">Análisis Neural en Espera</h3>
            <p className="text-lg text-muted-foreground max-w-sm leading-relaxed">
              Introduce una URL para que la IA procese la huella digital y genere un perfil táctico completo.
            </p>
          </div>
        )}

        {isScanning && (
          <div className="h-full flex flex-col items-center justify-center text-center p-24 bg-white rounded-[4rem] shadow-xl border border-border/20 animate-pulse">
            <div className="relative mb-12">
              <div className="w-32 h-32 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin" />
              <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary" />
            </div>
            <h3 className="text-3xl font-headline font-bold text-foreground mb-4 uppercase tracking-[0.3em]">Extrayendo Inteligencia</h3>
            <p className="text-muted-foreground font-medium">Conectando con {profile?.aiSettings?.modelId?.split('/').pop()} para decodificar el sitio...</p>
          </div>
        )}

        {result && !isScanning && (
          <div className="animate-fade-in space-y-10">
            <Card className="border-none shadow-2xl bg-white rounded-[4rem] overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-16 lg:p-20 border-b border-border/40">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
                  <div className="flex items-center gap-10">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                      {result.businessName.charAt(0)}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-5xl font-headline font-bold text-foreground tracking-tighter">{result.businessName}</h3>
                      <div className="flex flex-wrap gap-3">
                        <Badge className="bg-primary/10 text-primary border-none px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full">{result.industry}</Badge>
                        <Badge className="bg-accent/10 text-accent border-none px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full">{result.ownerRole}</Badge>
                        <Badge className={`border-none px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${result.overallScore >= 7 ? 'bg-emerald-100 text-emerald-700' : result.overallScore >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          <Gauge className="w-3 h-3 mr-1" /> Score: {result.overallScore}/10
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="rounded-2xl h-16 px-10 font-bold shadow-2xl bg-primary hover:bg-primary/90 text-white transition-all hover:-translate-y-1 text-lg"
                    onClick={handleSaveLead}
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />}
                    Guardar Lead en CRM
                  </Button>
                </div>
              </div>

              <CardContent className="p-16 lg:p-20 space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-10 rounded-[3rem] bg-secondary/30 border border-border/40 flex items-center gap-8 group hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="bg-white p-5 rounded-2xl shadow-sm text-primary border border-border/40"><User className="w-8 h-8" /></div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Responsable</p>
                      <p className="text-2xl font-bold text-foreground">{result.ownerName}</p>
                    </div>
                  </div>
                  <div className="p-10 rounded-[3rem] bg-secondary/30 border border-border/40 flex items-center gap-8 group hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="bg-white p-5 rounded-2xl shadow-sm text-accent border border-border/40"><Mail className="w-8 h-8" /></div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Email de Negocio</p>
                      <p className="text-2xl font-bold text-foreground">{result.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="p-12 lg:p-16 rounded-[3.5rem] bg-gradient-to-br from-primary to-accent text-white relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4 text-[11px] font-bold tracking-[0.4em] uppercase opacity-70">
                        <TrendingUp className="w-5 h-5" /> Estrategia de Aproximación
                      </div>
                      <p className="text-2xl lg:text-3xl font-medium leading-relaxed italic border-l-4 border-white/20 pl-10 font-headline">
                        "{result.suggestedApproach}"
                      </p>
                    </div>
                  </div>

                  {/* Fortalezas */}
                  <div className="space-y-6">
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-emerald-600 px-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Fortalezas Detectadas
                    </h4>
                    <div className="grid gap-4">
                      {result.strengths.map((strength, i) => (
                        <div key={i} className="bg-emerald-50 border border-emerald-200 p-6 rounded-[2rem] flex items-start gap-4">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground leading-relaxed">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Debilidades Técnicas */}
                  <div className="space-y-6">
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-red-600 px-2 flex items-center gap-2">
                      <Code className="w-5 h-5" /> Debilidades Técnicas
                    </h4>
                    <div className="grid gap-4">
                      {result.technicalWeaknesses.length > 0 ? result.technicalWeaknesses.map((weakness, i) => (
                        <div key={i} className="bg-red-50 border border-red-200 p-6 rounded-[2rem] flex items-start gap-4">
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground leading-relaxed">{weakness}</p>
                        </div>
                      )) : (
                        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-[2rem] flex items-center gap-4">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <p className="text-sm text-foreground">No se detectaron debilidades técnicas significativas</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Debilidades de Marketing */}
                  <div className="space-y-6">
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-amber-600 px-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Debilidades de Marketing
                    </h4>
                    <div className="grid gap-4">
                      {result.marketingWeaknesses.length > 0 ? result.marketingWeaknesses.map((weakness, i) => (
                        <div key={i} className="bg-amber-50 border border-amber-200 p-6 rounded-[2rem] flex items-start gap-4">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground leading-relaxed">{weakness}</p>
                        </div>
                      )) : (
                        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-[2rem] flex items-center gap-4">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <p className="text-sm text-foreground">Buenas prácticas de marketing detectadas</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Debilidades UX/UI */}
                  <div className="space-y-6">
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-purple-600 px-2 flex items-center gap-2">
                      <Layout className="w-5 h-5" /> Debilidades UX/UI
                    </h4>
                    <div className="grid gap-4">
                      {result.uxWeaknesses.length > 0 ? result.uxWeaknesses.map((weakness, i) => (
                        <div key={i} className="bg-purple-50 border border-purple-200 p-6 rounded-[2rem] flex items-start gap-4">
                          <Layout className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground leading-relaxed">{weakness}</p>
                        </div>
                      )) : (
                        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-[2rem] flex items-center gap-4">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <p className="text-sm text-foreground">Buena experiencia de usuario detectada</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Oportunidades de Mejora */}
                  <div className="space-y-6">
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-primary px-2 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" /> Oportunidades de Mejora
                    </h4>
                    <div className="grid gap-4">
                      {result.improvementOpportunities.map((opportunity, i) => (
                        <div key={i} className="bg-primary/10 border border-primary/20 p-6 rounded-[2rem] flex items-start gap-4">
                          <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground leading-relaxed">{opportunity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Análisis de Contenido */}
                  <div className="space-y-6">
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-foreground px-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" /> Análisis de Contenido
                    </h4>
                    <div className="p-10 bg-secondary/20 border border-border/40 rounded-[3rem] text-lg text-muted-foreground leading-relaxed shadow-inner">
                      {result.contentAnalysis}
                    </div>
                  </div>

                  {/* Análisis SEO */}
                  <div className="space-y-6">
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-foreground px-2 flex items-center gap-2">
                      <Zap className="w-5 h-5" /> Análisis SEO
                    </h4>
                    <div className="p-10 bg-secondary/20 border border-border/40 rounded-[3rem] text-lg text-muted-foreground leading-relaxed shadow-inner">
                      {result.seoAnalysis}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                      <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-foreground px-2">Análisis de Brecha (Marketing Gap)</h4>
                      <div className="p-10 bg-secondary/20 border border-border/40 rounded-[3rem] text-lg text-muted-foreground leading-relaxed shadow-inner">
                        {result.marketingGap}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-foreground px-2">Social Hub Detectado</h4>
                      <div className="grid gap-3">
                        {result.socialLinks.map((link, i) => (
                          <div key={i} className="bg-white border border-border/60 p-5 rounded-2xl flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                            <div className="flex items-center gap-4">
                              <Share2 className="w-5 h-5 text-primary" />
                              <span className="text-sm font-bold uppercase tracking-wider">{link.split('.')[1] || 'Perfil'}</span>
                            </div>
                            <Link className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
