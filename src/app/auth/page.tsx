
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
import { sendPasswordResetEmail } from "firebase/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Sparkles, UserCircle, ArrowRight, Loader2, ArrowLeft, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { auth } = useAuth();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const syncUserProfile = async (uid: string, userEmail: string | null, name?: string | null) => {
    if (!db) return;
    const userRef = doc(db, "users", uid);
    try {
      await setDoc(userRef, {
        id: uid,
        email: userEmail || "",
        fullName: name || userEmail?.split('@')[0] || "Usuario Pro",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Error synchronizing profile:", err);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handlePasswordReset = async () => {
    if (!auth) return;
    if (!resetEmail || !validateEmail(resetEmail)) {
      toast({ title: "Email inválido", description: "Por favor ingresa un email válido.", variant: "destructive" });
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({ title: "Email enviado", description: "Revisa tu inbox para instrucciones de recuperación." });
      setResetMode(false);
      setResetEmail("");
    } catch (error: any) {
      let errorMessage = "Error al enviar email de recuperación.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No existe una cuenta con este email.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Demasiados intentos. Intenta más tarde.";
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUserProfile(result.user.uid, result.user.email, result.user.displayName);
      router.push("/");
    } catch (error: any) {
      toast({ title: "Error", description: "Could not sign in with Google.", variant: "destructive" });
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      await syncUserProfile(result.user.uid, null, "Invitado Demo");
      router.push("/");
    } catch (error: any) {
      toast({ title: "Error", description: "Error entering as guest.", variant: "destructive" });
      setLoading(false);
    }
  };

  const handleEmailAuth = async (type: 'login' | 'register') => {
    if (!auth || !email || !password) {
      toast({ title: "Campos vacíos", description: "Por favor completa todos los campos.", variant: "destructive" });
      return;
    }

    if (!validateEmail(email)) {
      toast({ title: "Email inválido", description: "Por favor ingresa un email válido.", variant: "destructive" });
      return;
    }

    if (!validatePassword(password)) {
      toast({ title: "Contraseña débil", description: "La contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return;
    }

    if (type === 'register' && password !== confirmPassword) {
      toast({ title: "Contraseñas no coinciden", description: "Las contraseñas deben ser iguales.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserProfile(result.user.uid, email);
      }
      router.push("/");
    } catch (error: any) {
      let errorMessage = "Error en la autenticación.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No existe una cuenta con este email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Contraseña incorrecta.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Ya existe una cuenta con este email.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "La contraseña es muy débil.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Demasiados intentos. Intenta más tarde.";
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
      setLoading(false);
    }
  };

  if (isUserLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex lg:grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex flex-col justify-center p-12 xl:p-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" /> Marketing Intelligence Platform
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-6">
            Transforma tu estrategia con 
            <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Inteligencia Artificial
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            MarketScout Pro combina análisis de datos avanzado, scouting digital y estrategias de marketing impulsadas por IA para llevar tu negocio al siguiente nivel.
          </p>
          
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur border border-border/50 shadow-sm">
              <div className="text-3xl font-bold gradient-text">50+</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">Modelos IA</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur border border-border/50 shadow-sm">
              <div className="text-3xl font-bold gradient-text">10K+</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">Análisis</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur border border-border/50 shadow-sm">
              <div className="text-3xl font-bold gradient-text">98%</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">Precisión</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Análisis competitivo en tiempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Estrategias de marketing personalizadas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Scouting digital automatizado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md relative z-10">
          <Card className="bg-white/90 backdrop-blur-xl border-border/50 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">MarketScout Pro</CardTitle>
              <CardDescription>Plataforma de inteligencia de marketing</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Button 
                className="w-full h-16 premium-gradient hover:opacity-90 text-white font-bold text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 hover-lift animate-gradient"
                onClick={handleAnonymousSignIn}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UserCircle className="w-6 h-6" />}
                {loading ? "Iniciando..." : "Entrar como Invitado"}
                {!loading && <ArrowRight className="w-5 h-5 ml-auto" />}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-white px-4 text-muted-foreground">O vía email</span></div>
              </div>

              {resetMode ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => setResetMode(false)} className="h-8 px-2">
                      <ArrowLeft className="w-4 h-4 mr-1" /> Volver
                    </Button>
                  </div>
                  <div className="text-center space-y-2 mb-6">
                    <Lock className="w-12 h-12 mx-auto text-primary mb-2" />
                    <h3 className="text-lg font-bold">Recupera tu contraseña</h3>
                    <p className="text-sm text-muted-foreground">Te enviaremos instrucciones a tu email</p>
                  </div>
                  <Input 
                    type="email" 
                    value={resetEmail} 
                    onChange={(e) => setResetEmail(e.target.value)} 
                    placeholder="Tu Email" 
                    className="h-12 bg-muted/30 border-none rounded-xl" 
                  />
                  <Button 
                    className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90" 
                    onClick={handlePasswordReset} 
                    disabled={resetLoading}
                  >
                    {resetLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                    {resetLoading ? "Enviando..." : "Enviar instrucciones"}
                  </Button>
                </div>
              ) : (
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/50 p-1 h-14 rounded-xl border border-border/30">
                    <TabsTrigger value="login" className="font-bold text-sm uppercase data-[state=active]:premium-gradient data-[state=active]:text-white">Login</TabsTrigger>
                    <TabsTrigger value="register" className="font-bold text-sm uppercase data-[state=active]:premium-gradient data-[state=active]:text-white">Registro</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="space-y-5">
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu Email" className="h-14 bg-white/50 border-2 border-border/30 rounded-xl input-glow transition-all hover:bg-white hover:border-primary/30 text-base" />
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="h-14 bg-white/50 border-2 border-border/30 rounded-xl input-glow transition-all hover:bg-white hover:border-primary/30 text-base" />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setResetMode(true)}
                      className="text-sm text-primary hover:text-primary/80 w-full font-medium"
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                    <Button className="w-full h-14 rounded-xl font-bold premium-gradient hover:opacity-90 hover-lift text-base" onClick={() => handleEmailAuth('login')} disabled={loading}>Entrar</Button>
                  </TabsContent>
                  <TabsContent value="register" className="space-y-5">
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email de Empresa" className="h-14 bg-white/50 border-2 border-border/30 rounded-xl input-glow transition-all hover:bg-white hover:border-primary/30 text-base" />
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Crea una Contraseña (mín. 6 caracteres)" className="h-14 bg-white/50 border-2 border-border/30 rounded-xl input-glow transition-all hover:bg-white hover:border-primary/30 text-base" />
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirma tu Contraseña" className="h-14 bg-white/50 border-2 border-border/30 rounded-xl input-glow transition-all hover:bg-white hover:border-primary/30 text-base" />
                    <Button className="w-full h-14 rounded-xl font-bold premium-gradient hover:opacity-90 hover-lift text-base" onClick={() => handleEmailAuth('register')} disabled={loading}>Crear Cuenta</Button>
                  </TabsContent>
                </Tabs>
              )}
              
              <Button variant="outline" className="w-full h-14 border-2 border-border/30 hover:bg-white hover:border-primary/30 rounded-xl font-bold gap-3 text-base hover-lift" onClick={handleGoogleSignIn} disabled={loading}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar con Google
              </Button>
            </CardContent>
            
            <CardFooter className="pt-0"></CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
