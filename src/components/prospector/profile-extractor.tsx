
"use client";

import React, { useState } from "react";
import { Globe, User, Mail, Phone, Share2, Search, Loader2, Link, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { extractProfile, type ExtractProfileOutput } from "@/ai/flows/extract-profile-flow";

export function ProfileExtractor() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
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
      toast({ title: "Extracción Exitosa", description: `Datos de ${data.businessName} recuperados.` });
    } catch (error) {
      toast({ 
        title: "Error de Análisis", 
        description: "No se pudo procesar la URL. Revisa la clave de API.", 
        variant: "destructive" 
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-1 border-none shadow-xl bg-white h-fit rounded-[2rem] overflow-hidden">
        <div className="h-1.5 bg-accent" />
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-xl font-headline font-bold">Digital Scouting</CardTitle>
          <CardDescription className="text-xs">Escanea un sitio web para extraer inteligencia comercial.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">URL del Prospecto</label>
            <Input 
              placeholder="https://ejemplo.com" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="bg-secondary/50 border-border h-12 rounded-xl focus:ring-accent transition-colors"
            />
          </div>
          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-white h-12 rounded-xl shadow-lg glow-accent font-bold" 
            onClick={handleExtract}
            disabled={isScanning || !url}
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
            {isScanning ? "Escaneando URL..." : "Analizar Sitio Web"}
          </Button>
          <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[9px] text-muted-foreground leading-relaxed">
              El motor IA analizará la estructura del sitio para identificar patrones de marketing, competencia y datos de contacto.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 min-h-[500px]">
        {!result && !isScanning && (
          <div className="h-full border border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 bg-white shadow-sm">
            <div className="bg-muted/50 w-20 h-20 rounded-3xl flex items-center justify-center mb-6">
              <Link className="text-muted-foreground/30 w-10 h-10" />
            </div>
            <h3 className="font-headline text-2xl font-bold text-foreground mb-4">Listo para el Análisis</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ingresa la URL de un competidor o potencial cliente para extraer su perfil estratégico.
            </p>
          </div>
        )}

        {isScanning && (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] shadow-sm animate-pulse">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-accent/10 border-t-accent rounded-full animate-spin" />
              <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-bounce" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-foreground mb-2">Decodificando Sitio Web</h3>
            <p className="text-sm text-muted-foreground">Analizando metadatos, registros y arquitectura...</p>
          </div>
        )}

        {result && !isScanning && (
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden animate-fade-in h-full">
            <div className="bg-muted/20 p-8 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {result.businessName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-3xl font-headline font-bold text-foreground mb-1">{result.businessName}</h3>
                    <div className="flex gap-2">
                       <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 px-3">{result.industry}</Badge>
                       <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3">Detectado por IA</Badge>
                    </div>
                  </div>
                </div>
                <Button className="rounded-xl h-12 px-6 font-bold shadow-md">Exportar Lead</Button>
              </div>
            </div>

            <CardContent className="p-10 space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-secondary/30 border border-border flex items-center gap-4 group hover:border-accent/30 transition-colors">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-blue-500 border border-border group-hover:scale-110 transition-transform"><User className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Decisión Maker</p>
                    <p className="text-lg font-bold text-foreground">{result.owner}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-secondary/30 border border-border flex items-center gap-4 group hover:border-accent/30 transition-colors">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-red-500 border border-border group-hover:scale-110 transition-transform"><Mail className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Email de Contacto</p>
                    <p className="text-lg font-bold text-foreground">{result.email}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-secondary/30 border border-border flex items-center gap-4 group hover:border-accent/30 transition-colors">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-emerald-500 border border-border group-hover:scale-110 transition-transform"><Phone className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Línea Directa</p>
                    <p className="text-lg font-bold text-foreground">{result.phone}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-secondary/30 border border-border flex items-center gap-4 group hover:border-accent/30 transition-colors">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-purple-500 border border-border group-hover:scale-110 transition-transform"><Share2 className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Canales Sociales</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.social.map((s) => (
                        <Badge key={s} className="text-[8px] bg-white text-foreground border-border font-bold">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <h4 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-accent" /> Debilidad de Marketing
                   </h4>
                   <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-accent/20 pl-4">
                     "{result.marketingGap}"
                   </p>
                </div>
                <div className="space-y-4">
                   <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Competencia Directa</h4>
                   <div className="flex flex-wrap gap-2">
                      {result.competitors.map((c) => (
                        <Badge key={c} variant="secondary" className="bg-white border-border text-xs px-3 py-1 font-medium">{c}</Badge>
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
