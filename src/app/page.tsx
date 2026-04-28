
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
  Menu,
  Bell,
  User as UserIcon
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <Sidebar variant="sidebar" className="border-r border-border/30 bg-white/80 backdrop-blur-xl shadow-xl">
          <SidebarHeader className="p-8 pb-10 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className="premium-gradient p-4 rounded-2xl text-white shadow-xl animate-pulse-glow">
                <Target className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none">MarketScout</h1>
                <span className="text-[10px] font-bold gradient-text uppercase tracking-[0.2em] mt-1">Intelligence</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground/50 px-4 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">Estrategia AI</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "strategy"} 
                      onClick={() => setActiveTab("strategy")}
                      className="h-14 rounded-xl data-[active=true]:premium-gradient data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:glow-purple transition-all px-5 mb-2 hover-lift"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span className="font-bold text-sm ml-2">Análisis Maestro</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "assets"} 
                      onClick={() => setActiveTab("assets")}
                      className="h-14 rounded-xl data-[active=true]:premium-gradient data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:glow-purple transition-all px-5 hover-lift"
                    >
                      <Zap className="w-5 h-5" />
                      <span className="font-bold text-sm ml-2">Activos Creativos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-muted-foreground/50 px-4 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">Crecimiento</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "discovery"} onClick={() => setActiveTab("discovery")} className="h-14 rounded-xl px-5 mb-2 hover:bg-primary/10 hover:text-primary transition-all hover-lift">
                      <Search className="w-5 h-5" />
                      <span className="font-semibold text-sm ml-2">Market Discovery</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "extractor"} onClick={() => setActiveTab("extractor")} className="h-14 rounded-xl px-5 hover:bg-primary/10 hover:text-primary transition-all hover-lift">
                      <Globe className="w-5 h-5" />
                      <span className="font-semibold text-sm ml-2">Digital Scouting</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-muted-foreground/50 px-4 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">Gestión</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "leads"} onClick={() => setActiveTab("leads")} className="h-14 rounded-xl px-5 mb-2 hover:bg-primary/10 hover:text-primary transition-all hover-lift">
                      <Database className="w-5 h-5" />
                      <span className="font-semibold text-sm ml-2">Pipeline Leads</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "roi"} onClick={() => setActiveTab("roi")} className="h-14 rounded-xl px-5 hover:bg-primary/10 hover:text-primary transition-all hover-lift">
                      <BarChart3 className="w-5 h-5" />
                      <span className="font-semibold text-sm ml-2">Simulador ROI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-8">
            <div className="modern-card p-6 rounded-3xl shadow-xl space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 rounded-2xl border-2 border-primary/30 shadow-lg">
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback className="premium-gradient text-white font-bold text-lg">
                    {user?.email?.[0].toUpperCase() || "M"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-foreground">{user?.displayName || user?.email?.split('@')[0] || "Consultor"}</p>
                  <Badge variant="secondary" className="text-[9px] h-5 px-3 uppercase tracking-tighter premium-gradient text-white border-none font-bold mt-1">PRO PLAN</Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl h-12 px-4 hover-lift"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-3" /> Cerrar Sesión
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto">
          <header className="sticky top-0 z-40 flex h-20 items-center gap-6 px-8 border-b border-border/30 bg-white/90 backdrop-blur-xl shadow-sm">
            <SidebarTrigger className="text-foreground hover:bg-primary/10 hover:text-primary rounded-xl p-2 h-10 w-10 hover-lift" />
            <div className="h-8 w-px bg-border/40 mx-2" />
            <div className="flex flex-col">
              <h2 className="text-sm font-bold gradient-text flex items-center gap-3 uppercase tracking-widest">
                {activeTab === "strategy" && "Central Estratégica"}
                {activeTab === "assets" && "Laboratorio Creativo"}
                {activeTab === "discovery" && "Inteligencia de Mercado"}
                {activeTab === "extractor" && "Digital Scouting"}
                {activeTab === "leads" && "Sales Pipeline"}
                {activeTab === "roi" && "Métricas Financieras"}
                {activeTab === "settings" && "Neural Settings"}
              </h2>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white/50 p-1.5 rounded-2xl border border-border/30 shadow-sm">
                 <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm hover-lift"><Bell className="w-4 h-4 text-muted-foreground" /></Button>
                 <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm hover-lift"><UserIcon className="w-4 h-4 text-muted-foreground" /></Button>
              </div>
              <Button 
                onClick={() => setActiveTab("settings")}
                variant="outline" 
                className="rounded-xl border-2 border-border/30 bg-white hover:bg-primary/5 hover:border-primary/30 hover:text-primary h-11 px-6 text-xs font-bold shadow-sm transition-all hover-lift"
              >
                <Cpu className="w-5 h-5 mr-3 text-primary" /> Motor IA
              </Button>
            </div>
          </header>

          <main className="p-8 lg:p-16 xl:p-20 max-w-[1600px] mx-auto w-full">
            <div className="animate-fade-in space-y-16">
              {activeTab === "strategy" && (
                <div className="space-y-16">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-primary text-[10px] font-bold tracking-[0.3em] uppercase bg-primary/5 w-fit px-4 py-1.5 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5" /> Core Estratégico
                    </div>
                    <h2 className="text-6xl lg:text-7xl xl:text-8xl font-headline font-bold text-foreground tracking-tighter leading-[0.9] max-w-4xl">
                      Diseña tu próximo <br/><span className="text-primary">Salto Maestro</span>.
                    </h2>
                    <p className="text-xl text-muted-foreground/80 max-w-2xl leading-relaxed font-medium">
                      MarketScout transforma datos en planes de crecimiento. Crea estrategias de nivel consultoría en segundos.
                    </p>
                  </div>
                  <PlanGenerator />
                </div>
              )}

              {activeTab === "assets" && (
                <div className="space-y-16">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-accent text-[10px] font-bold tracking-[0.3em] uppercase bg-accent/5 w-fit px-4 py-1.5 rounded-full">
                      <Zap className="w-3.5 h-3.5" /> Creative Engine
                    </div>
                    <h2 className="text-6xl lg:text-7xl xl:text-8xl font-headline font-bold text-foreground tracking-tighter leading-[0.9]">
                      Identidad de <br/><span className="text-accent">Alto Impacto</span>.
                    </h2>
                  </div>
                  <AssetGenerator />
                </div>
              )}

              {activeTab === "discovery" && (
                <div className="space-y-16">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-primary text-[10px] font-bold tracking-[0.3em] uppercase bg-primary/5 w-fit px-4 py-1.5 rounded-full">
                      <Search className="w-3.5 h-3.5" /> Market Discovery
                    </div>
                    <h2 className="text-6xl lg:text-7xl xl:text-8xl font-headline font-bold text-foreground tracking-tighter leading-[0.9]">
                      Encuentra tus <br/><span className="text-primary">Oportunidades</span>.
                    </h2>
                  </div>
                  <ClientDiscovery />
                </div>
              )}

              {activeTab === "extractor" && (
                <div className="space-y-16">
                  <div className="flex flex-col gap-4 text-center items-center">
                    <div className="flex items-center gap-3 text-accent text-[10px] font-bold tracking-[0.3em] uppercase bg-accent/5 w-fit px-4 py-1.5 rounded-full">
                      <Globe className="w-3.5 h-3.5" /> Scouting Digital
                    </div>
                    <h2 className="text-6xl lg:text-7xl xl:text-8xl font-headline font-bold text-foreground tracking-tighter leading-[0.9]">
                      Extracción de <br/><span className="text-accent">Perfiles Web</span>.
                    </h2>
                  </div>
                  <ProfileExtractor />
                </div>
              )}

              {activeTab === "leads" && (
                <div className="space-y-12">
                  <h2 className="text-6xl font-headline font-bold text-foreground tracking-tighter leading-none">
                    Pipeline de <span className="text-primary">Ventas</span>.
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm border border-border/50 rounded-[3rem] p-12 shadow-xl">
                    <LeadList />
                  </div>
                </div>
              )}

              {activeTab === "roi" && (
                <div className="space-y-16">
                  <h2 className="text-6xl lg:text-7xl font-headline font-bold text-foreground tracking-tighter leading-[0.9]">
                    Simulador <span className="text-primary">ROI 360°</span>.
                  </h2>
                  <RoiCalculator />
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-16">
                  <h2 className="text-6xl lg:text-7xl font-headline font-bold text-foreground tracking-tighter leading-[0.9]">
                    Ajustes de <span className="text-primary">Inteligencia</span>.
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
