
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Mail, Lock, Loader2, Sparkles, Rocket, ShieldCheck, UserCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { auth } = useAuth();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
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

  const syncUserProfile = (uid: string, userEmail: string | null, name?: string | null) => {
    if (!db) return;
    const userRef = doc(db, "users", uid);
    // Sincronización no bloqueante para mayor fluidez
    setDoc(userRef, {
      id: uid,
      email: userEmail || "",
      fullName: name || userEmail?.split('@')[0] || "Usuario Pro",
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true }).catch(err => console.error("Error silenciado en sync:", err));
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      syncUserProfile(result.user.uid, result.user.email, result.user.displayName);
      toast({ title: "Bienvenido", description: "Accediendo con Google..." });
    } catch (error: any) {
      toast({ title: "Error", description: "No se pudo iniciar sesión con Google.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      syncUserProfile(result.user.uid, "anonymous", "Invitado");
      toast({ title: "Modo Demo", description: "Entrando como invitado al instante." });
    } catch (error: any) {
      toast({ title: "Error", description: "Error al entrar como invitado.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (type: 'login' | 'register') => {
    if (!auth || !email || !password) {
      toast({ title: "Faltan campos", description: "Rellena email y contraseña o entra como invitado.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      let result;
      if (type === 'login') {
        result = await signInWithEmailAndPassword(auth, email, password);
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
        syncUserProfile(result.user.uid, email);
      }
      toast({ title: "Éxito", description: "Accediendo al panel..." });
    } catch (error: any) {
      toast({ title: "Error", description: "Credenciales incorrectas o error de red.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#02040a] space-y-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
      </div>
      <p className="text-sm font-headline font-bold text-primary animate-pulse tracking-widest uppercase">Validando Acceso</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#02040a]">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[150px] animate-pulse" />
      
      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-16 items-center z-10">
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold w-fit tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" /> Ecosistema de Marketing Inteligente
          </div>
          <h1 className="text-7xl font-headline font-bold leading-[1.1] text-white">
            Domina tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Mercado</span> con IA.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
            MarketScout Pro es el copiloto definitivo para agencias y emprendedores que buscan planes estratégicos en segundos.
          </p>
          
          <div className="flex flex-col gap-4 pt-6">
            <div className="flex items-center gap-4 text-white/80">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10"><ShieldCheck className="w-5 h-5 text-primary" /></div>
              <span className="font-medium">Seguridad de nivel corporativo</span>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10"><Rocket className="w-5 h-5 text-accent" /></div>
              <span className="font-medium">Generación de planes en tiempo real</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="text-center lg:hidden mb-12 space-y-4">
            <div className="bg-primary w-16 h-16 rounded-3xl flex items-center justify-center text-primary-foreground mx-auto shadow-2xl glow-primary">
              <Target className="w-9 h-9" />
            </div>
            <h1 className="text-4xl font-headline font-bold text-white tracking-tighter">MarketScout <span className="text-primary">Pro</span></h1>
          </div>

          <Card className="glass-card border-none rounded-3xl p-6 shadow-2xl border border-white/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white font-headline">Panel de Acceso</CardTitle>
              <CardDescription className="text-muted-foreground/60">Entra para empezar a diseñar tu estrategia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Acceso Directo de Invitado */}
              <Button 
                className="w-full h-16 bg-white/5 hover:bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 group"
                onClick={handleAnonymousSignIn}
                disabled={loading}
              >
                <UserCircle className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                Entrar como Invitado
                <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] font-bold"><span className="bg-[#02040a] px-4 text-muted-foreground/30">Otras formas</span></div>
              </div>

              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-bold flex gap-3 text-white" 
                  onClick={handleGoogleSignIn} 
                  disabled={loading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuar con Google
                </Button>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/5 border border-white/5 p-1 h-10 rounded-xl">
                    <TabsTrigger value="login" className="text-[10px] font-bold">LOGIN</TabsTrigger>
                    <TabsTrigger value="register" className="text-[10px] font-bold">REGISTRO</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="space-y-3">
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-11 bg-white/5 border-white/10 text-white text-sm" />
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="h-11 bg-white/5 border-white/10 text-white text-sm" />
                    <Button className="w-full h-12 bg-primary hover:bg-primary/90 font-bold rounded-xl" onClick={() => handleEmailAuth('login')} disabled={loading}>
                      Entrar
                    </Button>
                  </TabsContent>
                  <TabsContent value="register" className="space-y-3">
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu Email" className="h-11 bg-white/5 border-white/10 text-white text-sm" />
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nueva Contraseña" className="h-11 bg-white/5 border-white/10 text-white text-sm" />
                    <Button className="w-full h-12 bg-primary hover:bg-primary/90 font-bold rounded-xl" onClick={() => handleEmailAuth('register')} disabled={loading}>
                      Crear Cuenta
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="text-center text-[10px] text-muted-foreground/30 font-medium">
              Al entrar, aceptas nuestras condiciones de uso.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
