"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Key, ShieldCheck, Loader2, Save, Info, BrainCircuit, Globe, Bot } from "lucide-react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
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
    apiKey: "AIzaSyDD7PB0c6UY-ymus8QBhA2-DODNspE3aI8",
  });

  useEffect(() => {
    if (profile?.aiSettings) {
      setSettings({
        modelId: profile.aiSettings.modelId || "googleai/gemini-1.5-flash",
        apiKey: profile.aiSettings.apiKey || "AIzaSyDD7PB0c6UY-ymus8QBhA2-DODNspE3aI8",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!userRef) {
      toast({ title: "Modo Local", description: "Tus ajustes se usarán solo para esta sesión ya que no has iniciado sesión.", variant: "default" });
      return;
    }
    setLoading(true);
    try {
      await updateDoc(userRef, {
        aiSettings: settings,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Configuración Guardada", description: "Tus ajustes de IA han sido actualizados." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar en la base de datos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-headline font-bold text-foreground">Configuración de Inteligencia</h2>
        <p className="text-muted-foreground">Gestiona tus API Keys y modelos para un control total.</p>
      </div>

      <Alert className="bg-primary/10 border-primary/20 text-primary">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <AlertTitle className="font-bold">Privacidad de Datos</AlertTitle>
        <AlertDescription className="text-xs opacity-70">
          Tus credenciales se almacenan de forma segura y se utilizan exclusivamente para procesar tus solicitudes.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="glass-card border-none shadow-xl bg-white rounded-[2rem]">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <BrainCircuit className="w-5 h-5 text-primary" /> Proveedor Google AI
              </CardTitle>
              <CardDescription>Introduce tu clave de Gemini para activar las funciones estratégicas.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                  Google Gemini API Key
                </label>
                <Input 
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                  placeholder="AIzaSy..."
                  className="bg-secondary/50 border-border h-12 text-foreground focus:ring-primary transition-colors rounded-xl"
                />
                <p className="text-[10px] text-muted-foreground">Obtén tu clave gratuita en Google AI Studio.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                  Modelo de IA
                </label>
                <Select 
                  value={settings.modelId} 
                  onValueChange={(val) => setSettings({...settings, modelId: val})}
                >
                  <SelectTrigger className="bg-secondary/50 border-border h-14 text-foreground rounded-xl transition-colors">
                    <SelectValue placeholder="Selecciona un modelo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border text-foreground">
                    <SelectItem value="googleai/gemini-1.5-flash">Gemini 1.5 Flash (Ultrarrápido)</SelectItem>
                    <SelectItem value="googleai/gemini-1.5-pro">Gemini 1.5 Pro (Estratégico)</SelectItem>
                    <SelectItem value="googleai/gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-6">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-lg glow-primary rounded-xl"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Guardar Configuración
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="glass-card border-none p-6 space-y-4 bg-white shadow-xl rounded-[2rem]">
            <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <Info className="w-6 h-6" />
            </div>
            <h4 className="font-headline font-bold text-foreground text-lg">¿Por qué usar tu API Key?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              MarketScout Pro utiliza el modelo "Bring Your Own Key". Esto te garantiza privacidad total y el uso de tus propias cuotas de Google AI Studio, permitiéndote generar planes complejos sin límites impuestos por la plataforma.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}