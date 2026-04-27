"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, DollarSign, ArrowUpRight, BarChart3, Info, Wallet, PieChart, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function RoiCalculator() {
  const [cost, setCost] = useState(3000);
  const [expectedClients, setExpectedClients] = useState(20);
  const [valuePerClient, setValuePerClient] = useState(1500);

  const stats = useMemo(() => {
    const revenue = expectedClients * valuePerClient;
    const profit = revenue - cost;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;
    const cpa = cost / (expectedClients || 1);
    return { revenue, profit, roi, cpa };
  }, [cost, expectedClients, valuePerClient]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <Card className="xl:col-span-4 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-2">
        <div className="bg-muted/30 rounded-[2.5rem] p-10 space-y-12">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold tracking-[0.2em] px-4 py-1">INPUTS FINANCIEROS</Badge>
            <h3 className="text-3xl font-headline font-bold text-foreground tracking-tighter">Parámetros</h3>
          </div>
          
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                  Presupuesto Total <TooltipProvider><Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5"/></TooltipTrigger><TooltipContent className="bg-white border-border p-3 text-xs shadow-xl">Inversión total destinada a publicidad y canales.</TooltipContent></Tooltip></TooltipProvider>
                </label>
                <span className="text-2xl font-headline font-bold text-primary">{cost.toLocaleString()}€</span>
              </div>
              <Slider value={[cost]} onValueChange={(v) => setCost(v[0])} max={30000} step={100} className="py-2" />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Conversiones Esperadas</label>
                <span className="text-2xl font-headline font-bold text-primary">{expectedClients} Leads</span>
              </div>
              <Slider value={[expectedClients]} onValueChange={(v) => setExpectedClients(v[0])} max={300} step={1} className="py-2" />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Valor por Cliente (LTV)</label>
                <span className="text-2xl font-headline font-bold text-primary">{valuePerClient.toLocaleString()}€</span>
              </div>
              <Slider value={[valuePerClient]} onValueChange={(v) => setValuePerClient(v[0])} max={15000} step={100} className="py-2" />
            </div>
          </div>

          <div className="p-8 bg-white border border-border/40 rounded-[2.5rem] shadow-sm flex items-center gap-5">
             <div className="bg-primary/10 p-4 rounded-2xl"><PieChart className="w-6 h-6 text-primary" /></div>
             <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Estrategia Activa</p>
                <p className="text-sm font-bold">Inversión Balanceada</p>
             </div>
          </div>
        </div>
      </Card>

      <div className="xl:col-span-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card className="border-none shadow-2xl rounded-[3.5rem] p-12 bg-white relative overflow-hidden group hover:-translate-y-2 transition-all">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
              <TrendingUp className="w-48 h-48 text-primary" />
            </div>
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-none text-[10px] px-4 py-1 uppercase font-bold tracking-[0.2em]">RENTABILIDAD</Badge>
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">ROI Proyectado</p>
              <div className="text-8xl font-headline font-bold text-foreground tracking-tighter leading-none">
                {stats.roi.toFixed(0)}<span className="text-primary">%</span>
              </div>
              <div className="flex items-center gap-3 text-primary font-bold text-sm pt-6">
                <div className="bg-primary/10 p-1 rounded-lg"><ArrowUpRight className="w-5 h-5" /></div>
                Crecimiento Exponencial Detectado
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-2xl rounded-[3.5rem] p-12 bg-white relative overflow-hidden group hover:-translate-y-2 transition-all">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
              <DollarSign className="w-48 h-48 text-accent" />
            </div>
            <Badge variant="secondary" className="mb-6 bg-accent/10 text-accent border-none text-[10px] px-4 py-1 uppercase font-bold tracking-[0.2em]">BENEFICIO NETO</Badge>
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Utilidad Estimada</p>
              <div className="text-8xl font-headline font-bold text-foreground tracking-tighter leading-none">
                {stats.profit.toLocaleString()}<span className="text-accent">€</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium pt-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" /> Resultado libre de costos operativos.
              </p>
            </div>
          </Card>
        </div>

        <Card className="border-none shadow-2xl rounded-[3.5rem] p-16 bg-white overflow-hidden relative">
          <div className="absolute bottom-[-10%] left-[-5%] w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16 relative z-10">
            <div className="flex items-center gap-6">
              <div className="bg-primary p-5 rounded-[2rem] text-white shadow-lg glow-primary">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-3xl font-headline font-bold text-foreground tracking-tight">Desglose de KPIs</h4>
                <p className="text-sm text-muted-foreground font-medium">Métricas clave de rendimiento financiero 360°.</p>
              </div>
            </div>
            <Badge className="bg-muted px-4 py-2 rounded-2xl text-[11px] font-bold tracking-widest uppercase border-border/40">ANÁLISIS EN TIEMPO REAL</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            <div className="space-y-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Ingresos Brutos</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-headline font-bold text-foreground">{stats.revenue.toLocaleString()}€</p>
              </div>
              <div className="w-12 h-1 bg-primary/20 rounded-full" />
            </div>
            <div className="space-y-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">CPA (Coste Adquisición)</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-headline font-bold text-foreground">{stats.cpa.toFixed(1)}€</p>
              </div>
              <div className="w-12 h-1 bg-accent/20 rounded-full" />
            </div>
            <div className="space-y-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Ratio LTV/CAC</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-headline font-bold text-foreground">{(valuePerClient / (stats.cpa || 1)).toFixed(1)}x</p>
              </div>
              <div className="w-12 h-1 bg-emerald-500/20 rounded-full" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
