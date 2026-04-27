"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import {
  Search,
  Users,
  Settings,
  Zap,
  LayoutDashboard,
  Globe,
  Database,
  BarChart3,
  Rocket,
  Target,
  LogOut,
  Sparkles,
  BookOpen,
  ChevronRight,
  TrendingUp
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Feature Components
import { PlanGenerator } from "@/components/marketing/plan-generator";
import { AssetGenerator } from "@/components/marketing/asset-generator";
import { LeadList } from "@/components/leads/lead-list";
import { RoiCalculator } from "@/components/roi/roi-calculator";
import { ProfileExtractor } from "@/components/prospector/profile-extractor";

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

  if (isUserLoading) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full overflow-hidden bg-background">
        <Sidebar variant="inset" className="border-r border-white/5 shadow-2xl">
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
              <SidebarGroupLabel className="text-muted-foreground/50 px-4">CORE STRATEGY</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "strategy"} 
                      onClick={() => setActiveTab("strategy")}
                      className="h-11 rounded-xl data-[active=true]:bg-primary data-[active=true]:text-white transition-all duration-300"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="font-medium">Plan Maestro AI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "generator"} 
                      onClick={() => setActiveTab("generator")}
                      className="h-11 rounded-xl data-[active=true]:bg-primary data-[active=true]:text-white transition-all duration-300"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Activos Creativos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground/50 px-4">PERFORMANCE</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "leads"} onClick={() => setActiveTab("leads")} className="h-11 rounded-xl">
                      <Database className="w-4 h-4" />
                      <span>CRM & Campañas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "roi"} onClick={() => setActiveTab("roi")} className="h-11 rounded-xl">
                      <BarChart3 className="w-4 h-4" />
                      <span>Predicción ROI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-6">
            <div className="glass-card p-4 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                  {user?.email?.[0].toUpperCase() || "U"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-white">{user?.displayName || "Usuario Pro"}</p>
                  <button onClick={handleSignOut} className="text-[10px] text-destructive flex items-center gap-1 hover:underline">
                    <LogOut className="w-2.5 h-2.5" /> Desconectar
                  </button>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full h-8 text-[10px] border-white/10 hover:bg-white/5">
                <Settings className="w-3 h-3 mr-1" /> CONFIGURACIÓN
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto bg-transparent">
          <header className="sticky top-0 z-30 flex h-20 items-center gap-4 px-8 border-b border-white/5 bg-background/50 backdrop-blur-xl">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
                <TrendingUp className="w-3 h-3" /> SISTEMA OPERATIVO
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-6 glow-primary">
                <Rocket className="mr-2 h-4 w-4" /> SUBIR A ELITE
              </Button>
            </div>
          </header>

          <main className="p-8 max-w-7xl mx-auto w-full">
            <div className="animate-fade-in space-y-12">
              {activeTab === "strategy" && (
                <div className="space-y-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                      <Sparkles className="w-4 h-4" /> Inteligencia Estratégica
                    </div>
                    <h2 className="text-5xl font-headline font-bold text-white tracking-tighter">
                      Plan Maestro <span className="text-primary italic">AI</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                      Transformamos tu visión de negocio en una hoja de ruta accionable con precisión algorítmica.
                    </p>
                  </div>
                  <PlanGenerator />
                </div>
              )}

              {activeTab === "generator" && (
                <div className="space-y-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-accent font-bold text-sm tracking-widest uppercase">
                      <Zap className="w-4 h-4" /> Laboratorio Creativo
                    </div>
                    <h2 className="text-5xl font-headline font-bold text-white">Generador de Activos</h2>
                  </div>
                  <AssetGenerator />
                </div>
              )}

              {activeTab === "leads" && (
                <div className="space-y-8">
                  <h2 className="text-5xl font-headline font-bold text-white">Gestión de Leads</h2>
                  <LeadList />
                </div>
              )}

              {activeTab === "roi" && (
                <div className="space-y-8">
                  <h2 className="text-5xl font-headline font-bold text-white tracking-tighter">Simulador de <span className="text-primary">Retorno</span></h2>
                  <RoiCalculator />
                </div>
              )}

              {activeTab === "extractor" && (
                <div className="space-y-8">
                  <h2 className="text-5xl font-headline font-bold text-white">Análisis de Mercado</h2>
                  <ProfileExtractor />
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}