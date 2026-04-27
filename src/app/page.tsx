
"use client";

import React, { useState } from "react";
import {
  Search,
  Users,
  PieChart,
  Settings,
  Zap,
  LayoutDashboard,
  Globe,
  Database,
  ChevronRight,
  TrendingUp,
  Target,
  BarChart3,
  Rocket
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Feature Components (to be implemented)
import { ProfileExtractor } from "@/components/prospector/profile-extractor";
import { ClientDiscovery } from "@/components/prospector/client-discovery";
import { AssetGenerator } from "@/components/marketing/asset-generator";
import { LeadList } from "@/components/leads/lead-list";
import { RoiCalculator } from "@/components/roi/roi-calculator";

export default function MarketScoutDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

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
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Professional Edition</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "discovery"} onClick={() => setActiveTab("discovery")}>
                      <Search className="w-4 h-4" />
                      <span>Búsqueda de Clientes</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "extractor"} onClick={() => setActiveTab("extractor")}>
                      <Globe className="w-4 h-4" />
                      <span>Extractor de Perfiles</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Gestión</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "leads"} onClick={() => setActiveTab("leads")}>
                      <Database className="w-4 h-4" />
                      <span>Gestión de Leads</span>
                      <Badge variant="secondary" className="ml-auto text-[10px] bg-accent/20 text-accent-foreground border-none">12 New</Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "roi"} onClick={() => setActiveTab("roi")}>
                      <BarChart3 className="w-4 h-4" />
                      <span>Predicción & ROI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Marketing AI</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "generator"} onClick={() => setActiveTab("generator")}>
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="font-medium">Generador de Activos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">JD</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">Juan Delgado</p>
                <p className="text-[10px] text-muted-foreground truncate">Empresario / Pro</p>
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
                <Rocket className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
                Nueva Búsqueda
              </Button>
            </div>
          </header>

          <main className="p-6 max-w-7xl mx-auto w-full animate-fade-in">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary">Bienvenido, Juan</h2>
                  <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad de marketing y leads hoy.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Total Leads", value: "1,284", change: "+12.5%", icon: Users, color: "text-blue-500" },
                    { title: "ROI Promedio", value: "324%", change: "+4.2%", icon: TrendingUp, color: "text-emerald-500" },
                    { title: "Competidores", value: "48", change: "Constant", icon: PieChart, color: "text-amber-500" },
                    { title: "Búsquedas", value: "156", change: "+18%", icon: Search, color: "text-purple-500" },
                  ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-card hover:shadow-md transition-all duration-300 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-headline font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className={stat.change.startsWith("+") ? "text-emerald-500 font-medium" : "text-muted-foreground"}>
                            {stat.change}
                          </span>{" "}
                          desde el último mes
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="font-headline">Descubrimiento Reciente</CardTitle>
                          <CardDescription>Empresas encontradas mediante scrapping esta semana.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Ver todo <ChevronRight className="ml-1 w-4 h-4" /></Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <LeadList limit={5} />
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
                    <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
                      <Zap className="w-48 h-48 -mr-12 -mb-12" />
                    </div>
                    <CardHeader>
                      <CardTitle className="font-headline">Marketing AI</CardTitle>
                      <CardDescription className="text-primary-foreground/70">Potencia tu marca con IA estratégica.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <p className="text-sm italic">"Tu última idea: Campaña de fidelización para sector Retail en Barcelona..."</p>
                      </div>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setActiveTab("generator")}>
                        Generar Nuevo Activo
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "discovery" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary">Búsqueda de Clientes (Scrapping)</h2>
                  <p className="text-muted-foreground">Identifica potenciales clientes por sector, localización y palabras clave.</p>
                </div>
                <ClientDiscovery />
              </div>
            )}

            {activeTab === "extractor" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary">Extractor de Perfiles</h2>
                  <p className="text-muted-foreground">Ingresa una URL o nombre para identificar al propietario, email y redes sociales.</p>
                </div>
                <ProfileExtractor />
              </div>
            )}

            {activeTab === "leads" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary">Gestión de Leads</h2>
                  <p className="text-muted-foreground">Tu base de datos centralizada de clientes potenciales y estrategias.</p>
                </div>
                <LeadList />
              </div>
            )}

            {activeTab === "roi" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary">Predicción & ROI</h2>
                  <p className="text-muted-foreground">Calcula el retorno de inversión y estima resultados basados en datos históricos.</p>
                </div>
                <RoiCalculator />
              </div>
            )}

            {activeTab === "generator" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                    <Zap className="text-accent fill-accent/20" /> AI Marketing Generator
                  </h2>
                  <p className="text-muted-foreground">Crea slogans, logos y conceptos de folletos personalizados con un clic.</p>
                </div>
                <AssetGenerator />
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
