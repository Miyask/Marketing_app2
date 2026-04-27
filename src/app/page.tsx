"use client";

import React, { useState } from "react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import {
  Settings,
  Zap,
  Database,
  BarChart3,
  Target,
  LogOut,
  Sparkles,
  TrendingUp,
  Cpu,
  Search,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  Menu
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
import { AISettings } from "@/components/settings/ai-settings";
import { ProfileExtractor } from "@/components/prospector/profile-extractor";
import { ClientDiscovery } from "@/components/prospector/client-discovery";

export default function MarketScoutDashboard() {
  const { user } = useUser();
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState("strategy");

  const handleSignOut = async () => {
    if (auth) await signOut(auth);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-svh w-full overflow-hidden bg-background">
        <Sidebar variant="sidebar" className="border-r border-border bg-sidebar">
          <SidebarHeader className="p-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2.5 rounded-xl text-white shadow-lg glow-primary animate-float">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-headline font-bold text-foreground tracking-tighter">MarketScout</h1>
                <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] -mt-1">Pro Intelligence</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground/60 px-4 text-[9px] tracking-[0.2em] uppercase font-bold mb-3">Estrategia AI</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "strategy"} 
                      onClick={() => setActiveTab("strategy")}
                      className="h-11 rounded-xl data-[active=true]:bg-primary data-[active=true]:text-white transition-all px-4"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bold">Análisis Maestro</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "assets"} 
                      onClick={() => setActiveTab("assets")}
                      className="h-11 rounded-xl data-[active=true]:bg-primary data-[active=true]:text-white transition-all px-4"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="font-bold">Activos Creativos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-muted-foreground/60 px-4 text-[9px] tracking-[0.2em] uppercase font-bold mb-3">Crecimiento</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "discovery"} onClick={() => setActiveTab("discovery")} className="h-11 rounded-xl px-4">
                      <Search className="w-4 h-4" />
                      <span className="font-medium">Market Discovery</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "extractor"} onClick={() => setActiveTab("extractor")} className="h-11 rounded-xl px-4">
                      <Globe className="w-4 h-4" />
                      <span className="font-medium">Extractor de Datos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-muted-foreground/60 px-4 text-[9px] tracking-[0.2em] uppercase font-bold mb-3">CRM & ROI</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "leads"} onClick={() => setActiveTab("leads")} className="h-11 rounded-xl px-4">
                      <Database className="w-4 h-4" />
                      <span className="font-medium">Leads Pipeline</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "roi"} onClick={() => setActiveTab("roi")} className="h-11 rounded-xl px-4">
                      <BarChart3 className="w-4 h-4" />
                      <span className="font-medium">Proyección ROI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-6">
            <div className="bg-white border border-border p-4 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  {user?.email?.[0].toUpperCase() || "M"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate text-foreground">{user?.displayName || user?.email?.split('@')[0] || "Consultor"}</p>
                  <Badge variant="secondary" className="text-[8px] h-3.5 px-1.5 uppercase tracking-tighter bg-primary/5 text-primary border-none">Plan Pro</Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg h-8"
                onClick={handleSignOut}
              >
                <LogOut className="w-3 h-3 mr-2" /> Cerrar Sesión
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto bg-transparent">
          <header className="sticky top-0 z-40 flex h-20 items-center gap-4 px-10 border-b border-border bg-white/80 backdrop-blur-md">
            <SidebarTrigger className="text-foreground" />
            <div className="h-6 w-px bg-border mx-2" />
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                {activeTab === "strategy" && "Central Estratégica AI"}
                {activeTab === "assets" && "Generador de Activos"}
                {activeTab === "discovery" && "Inteligencia de Mercado"}
                {activeTab === "extractor" && "Extractor de Perfiles"}
                {activeTab === "leads" && "Gestión de Leads"}
                {activeTab === "roi" && "Simulador Financiero"}
                {activeTab === "settings" && "Configuración Neural"}
              </h2>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setActiveTab("settings")}
                variant="outline" 
                className="rounded-xl border-border bg-white hover:bg-muted/50 text-foreground h-10 px-4 text-xs font-bold"
              >
                <Cpu className="w-4 h-4 mr-2 text-primary" /> Ajustes IA
              </Button>
            </div>
          </header>

          <main className="p-10 lg:p-14 max-w-[1300px] mx-auto w-full">
            <div className="animate-fade-in space-y-10">
              {activeTab === "strategy" && (
                <div className="space-y-10">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-primary text-xs font-bold tracking-widest uppercase">
                      <TrendingUp className="w-4 h-4" /> Strategic Core
                    </div>
                    <h2 className="text-6xl font-headline font-bold text-foreground tracking-tighter leading-[1] max-w-3xl">
                      Diseña tu próximo <span className="text-primary">Salto Estratégico</span>.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">Crea planes maestros personalizados con análisis de mercado profundo en segundos.</p>
                  </div>
                  <PlanGenerator />
                </div>
              )}

              {activeTab === "assets" && (
                <div className="space-y-10">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-widest uppercase">
                      <Zap className="w-4 h-4" /> Creative Engine
                    </div>
                    <h2 className="text-6xl font-headline font-bold text-foreground tracking-tighter leading-[1]">
                      Identidad de <span className="text-accent">Alto Impacto</span>.
                    </h2>
                  </div>
                  <AssetGenerator />
                </div>
              )}

              {activeTab === "discovery" && (
                <div className="space-y-10">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-primary text-xs font-bold tracking-widest uppercase">
                      <Search className="w-4 h-4" /> Market Discovery
                    </div>
                    <h2 className="text-6xl font-headline font-bold text-foreground tracking-tighter leading-[1]">
                      Encuentra tus <span className="text-primary">Oportunidades</span>.
                    </h2>
                  </div>
                  <ClientDiscovery />
                </div>
              )}

              {activeTab === "extractor" && (
                <div className="space-y-10">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-widest uppercase">
                      <Globe className="w-4 h-4" /> Digital Scouting
                    </div>
                    <h2 className="text-6xl font-headline font-bold text-foreground tracking-tighter leading-[1]">
                      Extracción de <span className="text-accent">Perfiles Web</span>.
                    </h2>
                  </div>
                  <ProfileExtractor />
                </div>
              )}

              {activeTab === "leads" && (
                <div className="space-y-10">
                  <h2 className="text-6xl font-headline font-bold text-foreground tracking-tighter">
                    Pipeline de <span className="text-primary">Ventas</span>.
                  </h2>
                  <div className="bg-white border border-border rounded-[2rem] p-8 shadow-sm">
                    <LeadList />
                  </div>
                </div>
              )}

              {activeTab === "roi" && (
                <div className="space-y-10">
                  <h2 className="text-6xl font-headline font-bold text-foreground tracking-tighter leading-[1]">
                    Simulador <span className="text-primary">ROI 360°</span>.
                  </h2>
                  <RoiCalculator />
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-10">
                  <h2 className="text-6xl font-headline font-bold text-foreground tracking-tighter leading-[1]">
                    Motores de <span className="text-primary">IA</span>.
                  </h2>
                  <AISettings />
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
