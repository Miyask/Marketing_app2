
"use client";

import React, { useState } from "react";
import { Globe, User, Mail, Phone, Share2, Search, Loader2, Link, AlertCircle, Save, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
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
    
    if (!profile?.aiSettings?.apiKey) {
      toast({ 
        title: "API Key Requerida", 
        description: "Configura tu clave en Ajustes de IA para usar el extractor.",
        variant: "destructive" 
      });
      return;
    }

    setIsScanning(true);
    try {
      const data = await extractProfile({
        url,
        userConfig: profile.aiSettings
      });
      setResult(data);
      toast({ title: "Análisis Completado", description: `Inteligencia de ${data.businessName} extraída con éxito.` });
    } catch (error) {
      toast({ 
        title: "Error de Análisis", 
        description: "No se pudo procesar la URL. Revisa la conexión o la clave de API.", 
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
      ownerName: result.owner,
      email: result.email,
      phone: result.phone,
      industry: result.industry,
      leadStatus: "Lead Caliente",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      extractedData: result
    });

    toast({ title: "Empresa Guardada", description: "El perfil estratégico ha sido añadido a tu CRM." });
    setIsSaving(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <Card className="md:col-span-1 border-none shadow-xl bg-white h-fit rounded-[2.5rem] overflow-hidden">
        <div className="h-1.5 bg-accent" />
        <CardHeader className="p-10 pb-4">
          <CardTitle className="text-2xl font-headline font-bold">Digital Scouting</CardTitle>
          <CardDescription className="text-xs">Escanea un sitio web para extraer inteligencia comercial profunda.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-0 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">URL del Objetivo</label>
            <Input 
              placeholder="https://empresa-prospecto.com" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="bg-secondary/50 border-border h-12 rounded-xl focus:ring-accent transition-colors"
            />
          </div>
          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-white h-14 rounded-xl shadow-lg glow-accent font-bold text-md" 
            onClick={handleExtract}
            disabled={isScanning || !url}
          >
            {isScanning ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Globe className="w-5 h-5 mr-2" />}
            {isScanning ? "Decodificando..." : "Analizar Sitio Web"}
          </Button>
          <div className="p-5 rounded-2xl bg-muted/50 border border-border flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              La IA analizará la arquitectura del sitio, metadatos y registros públicos para identificar debilidades de marketing y puntos de contacto clave.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 min-h-[600px]">
        {!result && !isScanning && (
          <div className="h-full border border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center p-16 bg-white shadow-sm">
            <div className="bg-muted/50 w-24 h-24 rounded-3xl flex items-center justify-center mb-8">
              <Link className="text-muted-foreground/30 w-12 h-12" />
            </div>
            <h3 className="font-headline text-3xl font-bold text-foreground mb-4">Inteligencia Pendiente</h3>
            <p className="text-md text-muted-foreground max-w-sm">
              Ingresa la URL de un competidor o potencial cliente para extraer su perfil estratégico mediante IA.
            </p>
          </div>
        )}

        {isScanning && (
          <div className="h-full flex flex-col items-center justify-center text-center p-16 bg-white rounded-[2.5rem] shadow-sm animate-pulse">
            <div className="relative mb-10">
              <div className="w-28 h-28 border-4 border-accent/10 border-t-accent rounded-full animate-spin" />
              <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-accent" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-foreground mb-2 uppercase tracking-widest">Escaneo Neural en Progreso</h3>
            <p className="text-sm text-muted-foreground">Analizando arquitectura de conversión y presencia digital...</p>
          </div>
        )}

        {result && !isScanning && (
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden animate-fade-in h-full">
            <div className="bg-muted/30 p-10 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-3xl bg-accent flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                    {result.businessName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-4xl font-headline font-bold text-foreground mb-2 tracking-tighter">{result.businessName}</h3>
                    <div className="flex gap-3">
                       <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 px-4 py-1 text-[10px] font-bold uppercase tracking-widest">{result.industry}</Badge>
                       <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-1 text-[10px] font-bold uppercase tracking-widest">Verificado por IA</Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  className="rounded-2xl h-14 px-8 font-bold shadow-lg bg-primary hover:bg-primary/90 text-white"
                  onClick={handleSaveLead}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Exportar a CRM
                </Button>
              </div>
            </div>

            <CardContent className="p-12 space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-8 rounded-[2rem] bg-secondary/30 border border-border flex items-center gap-6 group hover:border-accent/30 transition-all">
                  <div className="bg-white p-4 rounded-2xl shadow-sm text-blue-500 border border-border group-hover:scale-110 transition-transform"><User className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-1">Responsable</p>
                    <p className="text-xl font-bold text-foreground">{result.owner}</p>
                  </div>
                </div>
                <div className="p-8 rounded-[2rem] bg-secondary/30 border border-border flex items-center gap-6 group hover:border-accent/30 transition-all">
                  <div className="bg-white p-4 rounded-2xl shadow-sm text-red-500 border border-border group-hover:scale-110 transition-transform"><Mail className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-1">Correo Directo</p>
                    <p className="text-xl font-bold text-foreground">{result.email}</p>
                  </div>
                </div>
                <div className="p-8 rounded-[2rem] bg-secondary/30 border border-border flex items-center gap-6 group hover:border-accent/30 transition-all">
                  <div className="bg-white p-4 rounded-2xl shadow-sm text-emerald-500 border border-border group-hover:scale-110 transition-transform"><Phone className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-1">Teléfono</p>
                    <p className="text-xl font-bold text-foreground">{result.phone}</p>
                  </div>
                </div>
                <div className="p-8 rounded-[2rem] bg-secondary/30 border border-border flex items-center gap-6 group hover:border-accent/30 transition-all">
                  <div className="bg-white p-4 rounded-2xl shadow-sm text-purple-500 border border-border group-hover:scale-110 transition-transform"><Share2 className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-1">Presencia</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {result.social.map((s) => (
                        <Badge key={s} className="text-[9px] bg-white text-foreground border-border font-bold px-2 py-0.5">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground flex items-center gap-3">
                     <AlertCircle className="w-5 h-5 text-accent" /> Marketing Gap Detectada
                   </h4>
                   <p className="text-md text-muted-foreground leading-relaxed italic border-l-4 border-accent/20 pl-6 bg-muted/20 py-6 rounded-r-2xl">
                     "{result.marketingGap}"
                   </p>
                </div>
                <div className="space-y-6">
                   <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" /> Paisaje Competitivo
                   </h4>
                   <div className="flex flex-wrap gap-3">
                      {result.competitors.map((c) => (
                        <Badge key={c} variant="secondary" className="bg-white border-border text-xs px-4 py-1.5 font-bold shadow-sm">{c}</Badge>
                      ))}
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
