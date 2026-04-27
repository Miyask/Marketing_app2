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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Sparkles, Rocket, ShieldCheck, UserCircle, ArrowRight, Loader2 } from "lucide-react";
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
    try {
      await setDoc(userRef, {
        id: uid,
        email: userEmail || "",
        fullName: name || userEmail?.split('@')[0] || "Usuario Pro",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        aiSettings: {
          modelId: "googleai/gemini-1.5-flash",
          apiKey: "AIzaSyDD7PB0c6UY-ymus8QBhA2-DODNspE3aI8"
        }
      }, { merge: true });
    } catch (err) {
      console.error("Error synchronizing profile:", err);
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
      toast({ title: "Campos vacíos", description: "Please fill in email and password.", variant: "destructive" });
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
      toast({ title: "Error", description: "Invalid email or password.", variant: "destructive" });
      setLoading(false);
    }
  };

  if (isUserLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-20 items-center z-10">
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold w-fit tracking-widest uppercase">
            <Sparkles className="w-3 h-3" /> Marketing Intelligence Suite
          </div>
          <h1 className="text-7xl font-headline font-bold leading-[1.1] text-foreground">
            Estrategias que <span className="text-primary">Conectan</span>.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
            MarketScout Pro transforma datos en planes maestros. Diseña tu éxito comercial con el poder de la IA predictiva.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-6">
            <div className="flex flex-col gap-2">
              <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-primary" /></div>
              <span className="font-bold text-sm">Privacidad Total</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-accent/10 w-10 h-10 rounded-xl flex items-center justify-center"><Rocket className="w-5 h-5 text-accent" /></div>
              <span className="font-bold text-sm">Escalabilidad</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-8 bg-white">
            <CardHeader className="text-center pb-8">
              <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl glow-primary">
                <Target className="w-8 h-8" />
              </div>
              <CardTitle className="text-3xl font-headline">Bienvenido</CardTitle>
              <CardDescription>Accede para empezar a liderar tu mercado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-md rounded-2xl shadow-lg glow-primary transition-all flex items-center justify-center gap-3"
                onClick={handleAnonymousSignIn}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCircle className="w-5 h-5" />}
                {loading ? "Iniciando..." : "Entrar como Invitado"}
                {!loading && <ArrowRight className="w-4 h-4 ml-auto" />}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-white px-4 text-muted-foreground">O vía email</span></div>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 h-11 rounded-xl">
                  <TabsTrigger value="login" className="font-bold text-xs uppercase">Login</TabsTrigger>
                  <TabsTrigger value="register" className="font-bold text-xs uppercase">Registro</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="space-y-4">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu Email" className="h-12 bg-muted/30 border-none rounded-xl" />
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="h-12 bg-muted/30 border-none rounded-xl" />
                  <Button className="w-full h-12 rounded-xl font-bold" onClick={() => handleEmailAuth('login')} disabled={loading}>Entrar</Button>
                </TabsContent>
                <TabsContent value="register" className="space-y-4">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email de Empresa" className="h-12 bg-muted/30 border-none rounded-xl" />
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Crea una Contraseña" className="h-12 bg-muted/30 border-none rounded-xl" />
                  <Button className="w-full h-12 rounded-xl font-bold bg-accent hover:bg-accent/90" onClick={() => handleEmailAuth('register')} disabled={loading}>Crear Cuenta</Button>
                </TabsContent>
              </Tabs>
              
              <Button variant="outline" className="w-full h-12 border-border hover:bg-muted/50 rounded-xl font-bold gap-3" onClick={handleGoogleSignIn} disabled={loading}>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar con Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
