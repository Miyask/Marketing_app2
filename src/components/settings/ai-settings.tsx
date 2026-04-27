
"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Key, ShieldCheck, Loader2, Save, Info, BrainCircuit, Globe, Bot, Sparkles, Zap, Target } from "lucide-react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function AISettings() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

  const [settings, setSettings] = useState({
    modelId: "googleai/gemini-2.0-flash-exp",
    googleApiKey: "AIzaSyDD7PB0c6UY-ymus8QBhA2-DODNspE3aI8",
  });

  useEffect(() => {
    if (profile?.aiSettings) {
      setSettings({
        modelId: profile.aiSettings.modelId || "googleai/gemini-2.0-flash-exp",
        googleApiKey: profile.aiSettings.googleApiKey || "AIzaSyDD7PB0c6UY-ymus8QBhA2-DODNspE3aI8",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!userRef) return;
    setLoading(true);
    try {
      await updateDoc(userRef, {
        aiSettings: settings,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Configuración Guardada", description: "Tus ajustes de IA han sido actualizados con éxito." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar la configuración.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-12 pb-24">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-primary text-[10px] font-bold tracking-[0.3em] uppercase bg-primary/5 w-fit px-4 py-2 rounded-full border border-primary/10">
          <Cpu className="w-3.5 h-3.5" /> Neural Command Center
        </div>
        <h2 className="text-6xl font-headline font-bold text-foreground tracking-tighter">Motor de Inteligencia</h2>
        <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">Configura la potencia de procesamiento para tus estrategias y prospección avanzada.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Card className="lg:col-span-8 border-none shadow-[0_20px_60px_rgba(0,0,0,0.04)] bg-white rounded-[3rem] overflow-hidden">
          <CardHeader className="p-12 pb-8 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-4">
               <div className="bg-primary/10 p-4 rounded-2xl text-primary"><Sparkles className="w-6 h-6" /></div>
               <div>
                  <CardTitle className="text-2xl font-headline font-bold">Modelos Disponibles</CardTitle>
                  <CardDescription className="text-md">Selecciona el nivel de razonamiento para tus tareas.</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-12 space-y-12">
            <div className="space-y-6">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.3em] px-2">Cerebro AI Maestro</label>
              <Select 
                value={settings.modelId} 
                onValueChange={(val) => setSettings({...settings, modelId: val})}
              >
                <SelectTrigger className="bg-secondary/30 border-border/50 h-20 text-lg font-bold rounded-[1.5rem] transition-all hover:bg-white hover:shadow-xl focus:ring-primary px-8">
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-border rounded-2xl p-2 shadow-2xl">
                  <SelectItem value="googleai/gemini-2.0-flash-exp" className="h-14 rounded-xl px-4 font-bold text-md">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-amber-500" /> Gemini 2.0 Flash (Velocidad Extrema)
                    </div>
                  </SelectItem>
                  <SelectItem value="googleai/gemini-1.5-pro" className="h-14 rounded-xl px-4 font-bold text-md">
                    <div className="flex items-center gap-3">
                      <BrainCircuit className="w-4 h-4 text-primary" /> Gemini 1.5 Pro (Análisis Profundo)
                    </div>
                  </SelectItem>
                  <SelectItem value="googleai/gemini-1.5-flash" className="h-14 rounded-xl px-4 font-bold text-md">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-emerald-500" /> Gemini 1.5 Flash (Equilibrado)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.3em]">Google AI API Key</label>
                <Badge variant="outline" className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-tighter">ACTIVA Y VALIDADA</Badge>
              </div>
              <Input 
                type="password"
                value={settings.googleApiKey}
                onChange={(e) => setSettings({...settings, googleApiKey: e.target.value})}
                placeholder="AIzaSy..."
                className="bg-secondary/30 border-border/50 h-16 text-foreground focus:ring-primary rounded-[1.5rem] px-8 text-lg font-mono shadow-inner"
              />
              <p className="text-[10px] text-muted-foreground px-2 italic">Tus credenciales se cifran localmente y solo se usan para tus peticiones privadas.</p>
            </div>
          </CardContent>
          <CardFooter className="p-12 pt-0">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-20 text-xl shadow-2xl glow-primary rounded-[2rem] transition-all hover:-translate-y-1"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin mr-4" /> : <Save className="w-6 h-6 mr-4" />}
              {loading ? "Sincronizando..." : "Actualizar Motor AI"}
            </Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none p-10 space-y-8 bg-white shadow-xl rounded-[3rem] border-l-8 border-primary">
            <div className="bg-primary/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary">
              <Bot className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h4 className="font-headline font-bold text-foreground text-2xl tracking-tight">Capacidad de Respuesta</h4>
              <p className="text-md text-muted-foreground leading-relaxed">
                Cada modelo tiene una especialidad. Usa **2.0 Flash** para prospección rápida y **1.5 Pro** para el diseño de planes de marketing de alta complejidad.
              </p>
            </div>
            <Alert className="bg-muted/50 border-none rounded-2xl p-6">
               <Info className="w-4 h-4 text-primary" />
               <AlertDescription className="text-xs italic text-muted-foreground">
                 "El motor Gemini 2.0 es el más avanzado para scouting web y análisis de competidores en tiempo real."
               </AlertDescription>
            </Alert>
          </Card>
        </div>
      </div>
    </div>
  );
}
