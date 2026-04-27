"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, DollarSign, ArrowUpRight, BarChart3, Info, Wallet } from "lucide-react";
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
      <Card className="xl:col-span-4 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
        <div className="h-1.5 bg-primary" />
        <CardHeader className="p-10 pb-6">
          <CardTitle className="text-2xl font-headline font-bold flex items-center gap-3">
            <Wallet className="w-6 h-6 text-primary" /> Parámetros
          </CardTitle>
          <CardDescription>Simula el impacto económico de tu inversión.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-0 space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                Presupuesto Total <TooltipProvider><Tooltip><TooltipTrigger><Info className="w-3 h-3"/></TooltipTrigger><TooltipContent>Inversión total en canales publicitarios.</TooltipContent></Tooltip></TooltipProvider>
              </label>
              <span className="text-xl font-headline font-bold text-primary">{cost.toLocaleString()}€</span>
            </div>
            <Slider value={[cost]} onValueChange={(v) => setCost(v[0])} max={30000} step={100} className="py-2" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Conversiones Estimadas</label>
              <span className="text-xl font-headline font-bold text-primary">{expectedClients} Leads</span>
            </div>
            <Slider value={[expectedClients]} onValueChange={(v) => setExpectedClients(v[0])} max={300} step={1} className="py-2" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Valor Medio (LTV)</label>
              <span className="text-xl font-headline font-bold text-primary">{valuePerClient.toLocaleString()}€</span>
            </div>
            <Slider value={[valuePerClient]} onValueChange={(v) => setValuePerClient(v[0])} max={15000} step={100} className="py-2" />
          </div>
        </CardContent>
      </Card>

      <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-[2.5rem] p-10 bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <TrendingUp className="w-40 h-40 text-primary" />
          </div>
          <Badge variant="secondary" className="mb-4 bg-primary/5 text-primary border-none text-[9px] px-3 uppercase font-bold tracking-widest">Rentabilidad</Badge>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ROI Proyectado</p>
            <div className="text-7xl font-headline font-bold text-foreground tracking-tighter">
              {stats.roi.toFixed(0)}<span className="text-primary">%</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs pt-4">
              <ArrowUpRight className="w-4 h-4" /> Ratio Eficiencia Positivo
            </div>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[2.5rem] p-10 bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <DollarSign className="w-40 h-40 text-accent" />
          </div>
          <Badge variant="secondary" className="mb-4 bg-accent/5 text-accent border-none text-[9px] px-3 uppercase font-bold tracking-widest">Beneficio</Badge>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ingreso Neto</p>
            <div className="text-7xl font-headline font-bold text-foreground tracking-tighter">
              {stats.profit.toLocaleString()}<span className="text-accent">€</span>
            </div>
            <p className="text-xs text-muted-foreground pt-4">Resultado tras deducir gastos.</p>
          </div>
        </Card>

        <Card className="md:col-span-2 border-none shadow-sm rounded-[2.5rem] p-10 bg-white">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-primary/5 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-headline font-bold text-foreground">Desglose de KPIs</h4>
              <p className="text-xs text-muted-foreground">Métricas clave de rendimiento financiero.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ingresos Brutos</p>
              <p className="text-3xl font-headline font-bold text-foreground">{stats.revenue.toLocaleString()}€</p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CPA (Costo por Lead)</p>
              <p className="text-3xl font-headline font-bold text-foreground">{stats.cpa.toFixed(1)}€</p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ratio LTV/CAC</p>
              <p className="text-3xl font-headline font-bold text-foreground">{(valuePerClient / (stats.cpa || 1)).toFixed(1)}x</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
