"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Mail, Lock, Loader2, Sparkles, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { auth } = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Bienvenido", description: "Has iniciado sesión correctamente." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (type: 'login' | 'register') => {
    if (!auth || !email || !password) return;
    setLoading(true);
    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      toast({ title: "Éxito", description: type === 'login' ? "Sesión iniciada." : "Cuenta creada." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
      
      <div className="w-full max-w-[1000px] grid md:grid-cols-2 gap-12 items-center z-10">
        <div className="hidden md:flex flex-col space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold w-fit">
            <Sparkles className="w-3 h-3" /> INTELIGENCIA ARTIFICIAL APLICADA
          </div>
          <h1 className="text-6xl font-headline font-bold leading-tight">
            Diseña el futuro de tu <span className="text-primary">Marketing</span>.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            MarketScout Pro utiliza modelos de IA de última generación para transformar datos en estrategias ganadoras en segundos.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-primary font-bold text-2xl">95%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Ahorro de Tiempo</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-primary font-bold text-2xl">AI-Driven</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Estrategias Pro</div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="text-center md:hidden mb-8 space-y-2">
            <div className="bg-primary w-12 h-12 rounded-2xl flex items-center justify-center text-primary-foreground mx-auto shadow-lg glow-primary">
              <Target className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-headline font-bold text-primary">MarketScout Pro</h1>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white">Entrar</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-white">Unirse</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="animate-fade-in">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle>Bienvenido</CardTitle>
                  <CardDescription>Accede a tu panel estratégico.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.com" className="bg-white/5 border-white/10 focus:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/5 border-white/10 focus:ring-primary" />
                  </div>
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 glow-primary font-bold" onClick={() => handleEmailAuth('login')} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
                    Iniciar Sesión
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-transparent px-2 text-muted-foreground">O continúa con</span></div>
                  </div>
                  <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5" onClick={handleGoogleSignIn} disabled={loading}>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google Workspace
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="animate-fade-in">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle>Crea tu cuenta</CardTitle>
                  <CardDescription>Empieza a dominar tu mercado hoy mismo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email Corporativo</Label>
                    <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.com" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Contraseña</Label>
                    <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/5 border-white/10" />
                  </div>
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 glow-primary font-bold" onClick={() => handleEmailAuth('register')} disabled={loading}>
                    Registrarse Gratis
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}