
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
import { Target, Mail, Lock, Loader2, Sparkles, Rocket, ShieldCheck, UserCircle } from "lucide-react";
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

  const syncUserProfile = async (uid: string, userEmail: string | null, name?: string | null) => {
    if (!db) return;
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      id: uid,
      email: userEmail || "",
      fullName: name || userEmail?.split('@')[0] || "Usuario Pro",
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true });
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUserProfile(result.user.uid, result.user.email, result.user.displayName);
      toast({ title: "Bienvenido", description: "Has iniciado sesión con Google." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      await syncUserProfile(result.user.uid, "anonymous", "Invitado");
      toast({ title: "Acceso Invitado", description: "Entrando al modo de prueba." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (type: 'login' | 'register') => {
    if (!auth || !email || !password) {
      toast({ title: "Datos incompletos", description: "Por favor, rellena todos los campos.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      let result;
      if (type === 'login') {
        result = await signInWithEmailAndPassword(auth, email, password);
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserProfile(result.user.uid, email);
      }
      toast({ title: "Éxito", description: type === 'login' ? "Sesión iniciada." : "Cuenta creada con éxito." });
    } catch (error: any) {
      toast({ title: "Error de acceso", description: "Verifica tus credenciales o conexión.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
      </div>
      <p className="text-sm font-headline font-bold text-primary animate-pulse tracking-widest uppercase">Verificando Credenciales</p>
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

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5 border border-white/10 p-1.5 h-14 rounded-2xl">
              <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all">ENTRAR</TabsTrigger>
              <TabsTrigger value="register" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all">REGISTRARSE</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 animate-fade-in">
              <Card className="glass-card border-none rounded-3xl p-4">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Bienvenido de nuevo</CardTitle>
                  <CardDescription className="text-muted-foreground/60">Introduce tus credenciales para acceder al panel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Email Corporativo</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" className="pl-10 h-12 bg-white/5 border-white/10 focus:ring-primary rounded-xl text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12 bg-white/5 border-white/10 focus:ring-primary rounded-xl text-white" />
                    </div>
                  </div>
                  <Button className="w-full h-14 bg-primary hover:bg-primary/90 glow-primary font-bold text-lg rounded-xl shadow-xl transition-all active:scale-[0.98]" onClick={() => handleEmailAuth('login')} disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Rocket className="w-5 h-5 mr-2" />}
                    Iniciar Sesión
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col space-y-6">
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                    <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-bold"><span className="bg-[#02040a] px-4 text-muted-foreground/40">Alternativas</span></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button variant="outline" className="h-14 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-bold flex gap-2" onClick={handleGoogleSignIn} disabled={loading}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" className="h-14 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-bold flex gap-2" onClick={handleAnonymousSignIn} disabled={loading}>
                      <UserCircle className="w-5 h-5 text-accent" />
                      Invitado
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 animate-fade-in">
              <Card className="glass-card border-none rounded-3xl p-4">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Crea tu cuenta</CardTitle>
                  <CardDescription className="text-muted-foreground/60">Únete a la nueva era del marketing estratégico.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Email de Empresa</Label>
                    <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.com" className="h-12 bg-white/5 border-white/10 focus:ring-primary rounded-xl text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Nueva Contraseña</Label>
                    <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 bg-white/5 border-white/10 focus:ring-primary rounded-xl text-white" />
                  </div>
                  <Button className="w-full h-14 bg-primary hover:bg-primary/90 glow-primary font-bold text-lg rounded-xl transition-all shadow-xl" onClick={() => handleEmailAuth('register')} disabled={loading}>
                    Comenzar Ahora
                  </Button>
                </CardContent>
                <CardFooter className="text-center text-[10px] text-muted-foreground/40 font-medium">
                  Al registrarte, aceptas nuestros términos de servicio y políticas de privacidad de datos de marketing.
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
