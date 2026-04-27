"use client";

import React, { useState } from "react";
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
  Cpu,
  Search,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight
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
        <Sidebar variant="inset" className="border-r border-white/5 bg-sidebar shadow-2xl">
          <SidebarHeader className="p-8">
            <div className="flex items-center gap-4">
              <div className="bg-primary p-3 rounded-2xl text-primary-foreground shadow-2xl glow-primary animate-float">
                <Target className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-headline font-bold text-white tracking-tighter">MarketScout</h1>
                <span className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.2em] -mt-1">Intelligence</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-white/20 px-4 text-[9px] tracking-[0.3em] uppercase font-bold mb-4">Core Strategy</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "strategy"} 
                      onClick={() => setActiveTab("strategy")}
                      className="h-12 rounded-2xl data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:glow-primary transition-all duration-300 px-4"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bold tracking-tight">Estrategia AI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "assets"} 
                      onClick={() => setActiveTab("assets")}
                      className="h-12 rounded-2xl data-[active=true]:bg-primary data-[active=true]:text-white transition-all px-4"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="font-bold tracking-tight">Activos Creativos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-white/20 px-4 text-[9px] tracking-[0.3em] uppercase font-bold mb-4">Growth Intelligence</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "discovery"} onClick={() => setActiveTab("discovery")} className="h-12 rounded-2xl px-4">
                      <Search className="w-4 h-4" />
                      <span className="font-medium">Market Discovery</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "extractor"} onClick={() => setActiveTab("extractor")} className="h-12 rounded-2xl px-4">
                      <Globe className="w-4 h-4" />
                      <span className="font-medium">Data Extractor</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-white/20 px-4 text-[9px] tracking-[0.3em] uppercase font-bold mb-4">Conversion & CRM</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "leads"} onClick={() => setActiveTab("leads")} className="h-12 rounded-2xl px-4">
                      <Database className="w-4 h-4" />
                      <span className="font-medium">Lead CRM</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "roi"} onClick={() => setActiveTab("roi")} className="h-12 rounded-2xl px-4">
                      <BarChart3 className="w-4 h-4" />
                      <span className="font-medium">Performance ROI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-6">
            <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-xl">
                  {user?.email?.[0].toUpperCase() || "P"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate text-white">{user?.displayName || user?.email?.split('@')[0] || "Consultant"}</p>
                  <Badge variant="outline" className="text-[8px] h-4 px-1.5 border-primary/20 text-primary uppercase bg-primary/5">Premium Member</Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                onClick={handleSignOut}
              >
                <LogOut className="w-3.5 h-3.5 mr-2" /> Salir de la central
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto bg-transparent">
          <header className="sticky top-0 z-40 flex h-24 items-center gap-4 px-12 border-b border-white/5 bg-background/80 backdrop-blur-3xl">
            <SidebarTrigger className="text-white hover:bg-white/5" />
            <div className="h-8 w-px bg-white/5 mx-2" />
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                <LayoutDashboard className="w-4 h-4 text-primary" /> 
                {activeTab === "strategy" && "Strategic Analysis Center"}
                {activeTab === "assets" && "Creative Asset Generation"}
                {activeTab === "discovery" && "Prospect Intelligence"}
                {activeTab === "extractor" && "Advanced Data Extraction"}
                {activeTab === "leads" && "Lead Pipeline Management"}
                {activeTab === "roi" && "ROI Performance Projections"}
                {activeTab === "settings" && "AI Neural Configuration"}
              </h2>
              <span className="text-[10px] text-muted-foreground/60">Live Intelligence Hub v2.5</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="hidden xl:flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> API SECURE CONNECTION
              </div>
              <Button 
                onClick={() => setActiveTab("settings")}
                variant="outline" 
                className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white h-11 px-5"
              >
                <Cpu className="w-4 h-4 mr-2 text-primary" /> IA Ajustes
              </Button>
            </div>
          </header>

          <main className="p-12 lg:p-16 max-w-[1400px] mx-auto w-full">
            <div className="animate-fade-in space-y-12">
              {activeTab === "strategy" && (
                <div className="space-y-12">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary text-xs font-bold tracking-[0.5em] uppercase px-1">
                      <TrendingUp className="w-4 h-4" /> Strategic Direction
                    </div>
                    <h2 className="text-7xl font-headline font-bold text-white tracking-tighter leading-[0.9] max-w-4xl">
                      Diseña tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent/80 to-accent">Dominio</span> del Mercado.
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">Generación de planes maestros 360° mediante motores de inteligencia predictiva.</p>
                  </div>
                  <PlanGenerator />
                </div>
              )}

              {activeTab === "assets" && (
                <div className="space-y-12">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-[0.5em] uppercase px-1">
                      <Zap className="w-4 h-4" /> Brand Identity
                    </div>
                    <h2 className="text-7xl font-headline font-bold text-white tracking-tighter leading-[0.9]">
                      Activos de <span className="text-accent">Alto Impacto</span>.
                    </h2>
                  </div>
                  <AssetGenerator />
                </div>
              )}

              {activeTab === "discovery" && (
                <div className="space-y-12">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary text-xs font-bold tracking-[0.5em] uppercase px-1">
                      <Search className="w-4 h-4" /> Market Exploration
                    </div>
                    <h2 className="text-7xl font-headline font-bold text-white tracking-tighter leading-[0.9]">
                      Buscador de <span className="text-primary">Oportunidades</span>.
                    </h2>
                  </div>
                  <ClientDiscovery />
                </div>
              )}

              {activeTab === "extractor" && (
                <div className="space-y-12">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-[0.5em] uppercase px-1">
                      <Globe className="w-4 h-4" /> Digital Intelligence
                    </div>
                    <h2 className="text-7xl font-headline font-bold text-white tracking-tighter leading-[0.9]">
                      Extracción de <span className="text-accent">Datos Web</span>.
                    </h2>
                  </div>
                  <ProfileExtractor />
                </div>
              )}

              {activeTab === "leads" && (
                <div className="space-y-12">
                  <h2 className="text-7xl font-headline font-bold text-white tracking-tighter leading-[0.9]">
                    Pipeline de <span className="text-primary">Ventas</span>.
                  </h2>
                  <div className="glass-card rounded-[2.5rem] p-8 overflow-hidden">
                    <LeadList />
                  </div>
                </div>
              )}

              {activeTab === "roi" && (
                <div className="space-y-12">
                  <h2 className="text-7xl font-headline font-bold text-white tracking-tighter leading-[0.9]">
                    Proyecciones <span className="text-primary">ROI 360</span>.
                  </h2>
                  <RoiCalculator />
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-12">
                  <h2 className="text-7xl font-headline font-bold text-white tracking-tighter leading-[0.9]">
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
