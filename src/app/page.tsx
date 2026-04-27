
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import {
  Settings,
  Zap,
  Database,
  BarChart3,
  Rocket,
  Target,
  LogOut,
  Sparkles,
  TrendingUp,
  Loader2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Feature Components
import { PlanGenerator } from "@/components/marketing/plan-generator";
import { AssetGenerator } from "@/components/marketing/asset-generator";
import { LeadList } from "@/components/leads/lead-list";
import { RoiCalculator } from "@/components/roi/roi-calculator";

export default function MarketScoutDashboard() {
  const { user, isUserLoading } = useUser();
  const { auth } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("strategy");

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth");
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    if (auth) await signOut(auth);
  };

  if (isUserLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#02040a] space-y-4">
      <div className="relative">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 text-primary" />
      </div>
      <p className="text-xs font-headline font-bold text-primary animate-pulse tracking-[0.3em] uppercase">Sincronizando Sistema</p>
    </div>
  );

  if (!user) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full overflow-hidden bg-[#02040a]">
        <Sidebar variant="inset" className="border-r border-white/5 bg-sidebar shadow-2xl">
          <SidebarHeader className="p-8">
            <div className="flex items-center gap-4">
              <div className="bg-primary p-2.5 rounded-2xl text-primary-foreground shadow-lg glow-primary animate-float">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-headline font-bold text-white tracking-tight">MarketScout</h1>
                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-primary/30 text-primary">Pro Strategist</Badge>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground/30 px-4 text-[10px] tracking-widest uppercase font-bold mb-2">Estrategia AI</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "strategy"} 
                      onClick={() => setActiveTab("strategy")}
                      className="h-12 rounded-xl data-[active=true]:bg-primary data-[active=true]:text-white transition-all duration-300"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bold">Plan Maestro AI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "generator"} 
                      onClick={() => setActiveTab("generator")}
                      className="h-12 rounded-xl data-[active=true]:bg-primary data-[active=true]:text-white transition-all duration-300"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="font-bold">Activos Creativos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground/30 px-4 text-[10px] tracking-widest uppercase font-bold mb-2">Resultados</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "leads"} onClick={() => setActiveTab("leads")} className="h-12 rounded-xl">
                      <Database className="w-4 h-4" />
                      <span className="font-medium">Gestión Leads</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "roi"} onClick={() => setActiveTab("roi")} className="h-12 rounded-xl">
                      <BarChart3 className="w-4 h-4" />
                      <span className="font-medium">Calculadora ROI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-6">
            <div className="glass-card p-4 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                  {user?.isAnonymous ? "?" : (user?.email?.[0].toUpperCase() || "U")}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate text-white">{user?.isAnonymous ? "Invitado" : (user?.displayName || "Usuario Pro")}</p>
                  <button onClick={handleSignOut} className="text-[10px] text-destructive/80 flex items-center gap-1 hover:text-destructive hover:underline transition-colors">
                    <LogOut className="w-2.5 h-2.5" /> Cerrar Sesión
                  </button>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full h-8 text-[9px] font-bold border-white/10 hover:bg-white/5 uppercase tracking-widest">
                <Settings className="w-3 h-3 mr-1" /> Preferencias
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto bg-transparent">
          <header className="sticky top-0 z-30 flex h-20 items-center gap-4 px-8 border-b border-white/5 bg-[#02040a]/80 backdrop-blur-2xl">
            <SidebarTrigger className="text-white hover:bg-white/5" />
            <div className="flex-1" />
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold tracking-widest uppercase">
                <TrendingUp className="w-3 h-3" /> Estatus: Optimizado
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-6 glow-primary h-10 shadow-xl transition-all active:scale-[0.97]">
                <Rocket className="mr-2 h-4 w-4" /> UPGRADE ELITE
              </Button>
            </div>
          </header>

          <main className="p-8 lg:p-12 max-w-7xl mx-auto w-full">
            <div className="animate-fade-in space-y-16">
              {activeTab === "strategy" && (
                <div className="space-y-10">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-primary font-bold text-xs tracking-[0.4em] uppercase">
                      <Sparkles className="w-4 h-4" /> Consultoría Estratégica 2.0
                    </div>
                    <h2 className="text-6xl font-headline font-bold text-white tracking-tighter leading-tight">
                      Diseña tu Plan <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">Maestro AI</span>
                    </h2>
                    <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed font-medium">
                      Tu hoja de ruta estratégica, analizada y optimizada por modelos de IA especializados en crecimiento empresarial.
                    </p>
                  </div>
                  <PlanGenerator />
                </div>
              )}

              {activeTab === "generator" && (
                <div className="space-y-10">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-accent font-bold text-xs tracking-[0.4em] uppercase">
                      <Zap className="w-4 h-4" /> Creative Engine
                    </div>
                    <h2 className="text-6xl font-headline font-bold text-white tracking-tighter">Activos de <span className="text-accent">Marketing</span></h2>
                  </div>
                  <AssetGenerator />
                </div>
              )}

              {activeTab === "leads" && (
                <div className="space-y-10">
                  <h2 className="text-6xl font-headline font-bold text-white tracking-tighter">CRM <span className="text-primary">&</span> Prospectos</h2>
                  <div className="glass-card rounded-3xl p-6 overflow-hidden">
                    <LeadList />
                  </div>
                </div>
              )}

              {activeTab === "roi" && (
                <div className="space-y-10">
                  <h2 className="text-6xl font-headline font-bold text-white tracking-tighter">Proyección de <span className="text-primary">Impacto</span></h2>
                  <RoiCalculator />
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
