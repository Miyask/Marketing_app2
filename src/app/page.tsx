
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
  BookOpen
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
      <div className="flex min-h-screen bg-background w-full overflow-hidden">
        <Sidebar variant="inset" className="border-r border-sidebar-border shadow-sm">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-headline font-bold text-primary">MarketScout</h1>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Strategic AI</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Marketing Estratégico</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "strategy"} onClick={() => setActiveTab("strategy")}>
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="font-semibold">Plan Maestro AI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "generator"} onClick={() => setActiveTab("generator")}>
                      <Zap className="w-4 h-4" />
                      <span>Activos Creativos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Gestión & ROI</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "leads"} onClick={() => setActiveTab("leads")}>
                      <Database className="w-4 h-4" />
                      <span>Leads & Campañas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "roi"} onClick={() => setActiveTab("roi")}>
                      <BarChart3 className="w-4 h-4" />
                      <span>Predicción ROI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Herramientas de Apoyo</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "extractor"} onClick={() => setActiveTab("extractor")}>
                      <Globe className="w-4 h-4" />
                      <span>Análisis de URL</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.email?.[0].toUpperCase() || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{user?.displayName || "Usuario"}</p>
                <button onClick={handleSignOut} className="text-[10px] text-destructive flex items-center gap-1 hover:underline">
                  <LogOut className="w-2.5 h-2.5" /> Cerrar Sesión
                </button>
              </div>
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="hidden sm:flex border-primary/20 hover:border-primary/50 text-primary">
                <Rocket className="mr-2 h-4 w-4" /> Pro Plan
              </Button>
            </div>
          </header>

          <main className="p-6 max-w-7xl mx-auto w-full animate-fade-in">
            {activeTab === "strategy" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                    <BookOpen className="w-8 h-8" /> Generador de Planes de Marketing
                  </h2>
                  <p className="text-muted-foreground">Crea una hoja de ruta estratégica para cualquier negocio en segundos.</p>
                </div>
                <PlanGenerator />
              </div>
            )}

            {activeTab === "generator" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary">Generador de Activos</h2>
                  <p className="text-muted-foreground">Slogans, conceptos de logo y estructuras de folletos.</p>
                </div>
                <AssetGenerator />
              </div>
            )}

            {activeTab === "leads" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary">Gestión de Leads</h2>
                  <p className="text-muted-foreground">Tus prospectos detectados y su estatus comercial.</p>
                </div>
                <LeadList />
              </div>
            )}

            {activeTab === "roi" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary">Predicción de Retorno</h2>
                  <p className="text-muted-foreground">Calculadora de ROI basada en inversión y CPA.</p>
                </div>
                <RoiCalculator />
              </div>
            )}

            {activeTab === "extractor" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary">Extractor de Perfiles</h2>
                  <p className="text-muted-foreground">Análisis rápido de URLs para identificar contactos.</p>
                </div>
                <ProfileExtractor />
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
