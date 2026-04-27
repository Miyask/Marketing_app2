
"use client";

import React, { useState } from "react";
import { Globe, User, Mail, Phone, Share2, Search, Loader2, Link, AlertCircle, Save, CheckCircle2, TrendingUp, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { extractProfile, type ExtractProfileOutput } from "@/ai/flows/extract-profile-flow";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export function ProfileExtractor() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<ExtractProfileOutput | null>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userRef);

  const handleExtract = async () => {
    if (!url) return;
    
    // Check if at least one API key is present
    const aiSettings = profile?.aiSettings;
    if (!aiSettings?.googleApiKey && !aiSettings?.openaiApiKey && !aiSettings?.openrouterApiKey) {
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
        userConfig: aiSettings
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
        competitors: result.competitors
      }
    });

    toast({ title: "Empresa Guardada", description: "El prospecto ha sido añadido a tu Pipeline de Ventas." });
    setIsSaving(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <Card className="md:col-span-1 border-none shadow-xl bg-white h-fit rounded-[2.5rem] overflow-hidden border border-border/40">
        <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
        <CardHeader className="p-10 pb-4">
          <CardTitle className="text-2xl font-headline font-bold">Digital Scouting</CardTitle>
          <CardDescription className="text-xs">Introduce una URL para identificar al propietario y sus debilidades de marketing.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-0 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">URL Objetivo</label>
            <Input 
              placeholder="https://empresa.com" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="bg-secondary/30 border-border/50 h-14 rounded-2xl focus:ring-primary transition-all text-sm font-medium px-6"
            />
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-2xl shadow-lg glow-primary font-bold text-md transition-all hover:-translate-y-1" 
            onClick={handleExtract}
            disabled={isScanning || !url}
          >
            {isScanning ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Globe className="w-5 h-5 mr-3" />}
            {isScanning ? "Decodificando..." : "Analizar Perfil"}
          </Button>
          <div className="p-6 rounded-[2rem] bg-muted/30 border border-border/40 flex items-start gap-4">
            <UserCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
              El motor de IA analizará la huella digital para encontrar al responsable directo y generar una estrategia de aproximación personalizada.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 min-h-[600px]">
        {!result && !isScanning && (
          <div className="h-full border border-dashed border-border/60 rounded-[3rem] flex flex-col items-center justify-center text-center p-20 bg-white/50">
            <div className="bg-muted/50 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 animate-float">
              <Search className="text-muted-foreground/30 w-12 h-12" />
            </div>
            <h3 className="font-headline text-3xl font-bold text-foreground mb-4">Análisis en Espera</h3>
            <p className="text-md text-muted-foreground max-w-sm leading-relaxed">
              Ingresa la web de un competidor o cliente potencial para extraer su ADN comercial.
            </p>
          </div>
        )}

        {isScanning && (
          <div className="h-full flex flex-col items-center justify-center text-center p-20 bg-white rounded-[3rem] shadow-sm border border-border/20 animate-pulse">
            <div className="relative mb-10">
              <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-foreground mb-2 uppercase tracking-[0.2em]">Escaneo Neural</h3>
            <p className="text-sm text-muted-foreground">Identificando tomadores de decisiones...</p>
          </div>
        )}

        {result && !isScanning && (
          <div className="animate-fade-in space-y-8">
            <Card className="border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden">
              <div className="bg-primary/5 p-12 border-b border-border/40">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-xl glow-primary">
                      {result.businessName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-4xl font-headline font-bold text-foreground tracking-tighter">{result.businessName}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-primary/10 text-primary border-none px-4 py-1 text-[10px] font-bold uppercase tracking-widest">{result.industry}</Badge>
                        <Badge className="bg-accent/10 text-accent border-none px-4 py-1 text-[10px] font-bold uppercase tracking-widest">{result.ownerRole}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="rounded-2xl h-14 px-8 font-bold shadow-xl bg-primary hover:bg-primary/90 text-white transition-all hover:-translate-y-1"
                    onClick={handleSaveLead}
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Save className="w-4 h-4 mr-3" />}
                    Guardar en CRM
                  </Button>
                </div>
              </div>

              <CardContent className="p-12 space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[2rem] bg-muted/30 border border-border/40 flex items-center gap-6 group hover:bg-white hover:shadow-md transition-all">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-primary border border-border/40"><User className="w-6 h-6" /></div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Identidad</p>
                      <p className="text-xl font-bold text-foreground">{result.ownerName}</p>
                    </div>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-muted/30 border border-border/40 flex items-center gap-6 group hover:bg-white hover:shadow-md transition-all">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-accent border border-border/40"><Mail className="w-6 h-6" /></div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Email Directo</p>
                      <p className="text-xl font-bold text-foreground">{result.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-10 rounded-[2.5rem] bg-primary text-white relative overflow-hidden group">
                    <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">
                        <TrendingUp className="w-4 h-4" /> Aproximación Estratégica
                      </div>
                      <p className="text-xl font-medium leading-relaxed italic border-l-4 border-white/20 pl-8">
                        "{result.suggestedApproach}"
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground px-1">Marketing Gap</h4>
                      <div className="p-6 bg-muted/30 border border-border/40 rounded-[2rem] text-sm text-muted-foreground leading-relaxed">
                        {result.marketingGap}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground px-1">Redes Detectadas</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.socialLinks.map((link, i) => (
                          <Badge key={i} variant="outline" className="bg-white border-border/60 text-[10px] px-4 py-1.5 font-bold flex items-center gap-2">
                            <Share2 className="w-3 h-3 text-primary" /> {link.split('.')[1] || 'Perfil'}
                          </Badge>
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
