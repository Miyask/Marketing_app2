
"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Key, ShieldCheck, Loader2, Save, Info, BrainCircuit } from "lucide-react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AISettings() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  const [settings, setSettings] = useState({
    modelId: "googleai/gemini-1.5-flash",
    apiKey: ""
  });

  useEffect(() => {
    if (profile?.aiSettings) {
      setSettings({
        modelId: profile.aiSettings.modelId || "googleai/gemini-1.5-flash",
        apiKey: profile.aiSettings.apiKey || ""
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
      toast({ title: "Configuración Guardada", description: "Tu IA ahora utilizará tus credenciales personales." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar la configuración.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isProfileLoading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8">
      <Alert className="bg-primary/10 border-primary/20 text-white">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="font-bold">Privacidad de Credenciales</AlertTitle>
        <AlertDescription className="text-xs opacity-70">
          Tus API Keys se almacenan de forma segura en tu perfil privado. MarketScout Pro usará estas claves para realizar peticiones directamente a los proveedores de IA bajo tu propia cuota.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 glass-card border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-headline">
              <Key className="w-5 h-5 text-primary" /> Credenciales de Proveedor
            </CardTitle>
            <CardDescription>Introduce tu clave de API para activar el motor de marketing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                Google Gemini API Key
                <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[8px]">RECOMENDADO</span>
              </label>
              <div className="relative">
                <Input 
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                  placeholder="AIzaSy..."
                  className="bg-white/5 border-white/10 h-12 pr-12 focus:border-primary/50 transition-all"
                />
                <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 opacity-50" />
              </div>
              <p className="text-[10px] text-muted-foreground">Consigue tu clave gratis en Google AI Studio (aistudio.google.com).</p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Modelo Predeterminado</label>
              <Select 
                value={settings.modelId} 
                onValueChange={(val) => setSettings({...settings, modelId: val})}
              >
                <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white">
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent className="bg-[#02040a] border-white/10 text-white">
                  <SelectItem value="googleai/gemini-1.5-flash">Gemini 1.5 Flash (Rápido y Eficiente)</SelectItem>
                  <SelectItem value="googleai/gemini-1.5-pro">Gemini 1.5 Pro (Razonamiento Avanzado)</SelectItem>
                  <SelectItem value="googleai/gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental Next-Gen)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-6">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-lg glow-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Guardar Configuración
            </Button>
          </CardFooter>
        </Card>

        <Card className="glass-card border-none p-6 space-y-6">
          <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-4">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h4 className="font-headline font-bold text-white text-lg">¿Por qué usar tu API Key?</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-xs text-muted-foreground"><span className="text-white font-bold">Sin límites</span>: Usa la cuota de tu propia cuenta de Google.</p>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-xs text-muted-foreground"><span className="text-white font-bold">Privacidad</span>: Tus datos se procesan con tus propias políticas de seguridad.</p>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-xs text-muted-foreground"><span className="text-white font-bold">Coste Cero</span>: Gemini Flash suele ser gratuito para desarrolladores.</p>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
