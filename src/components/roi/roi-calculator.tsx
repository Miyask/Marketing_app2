"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, DollarSign, Target, Percent, ArrowUpRight, BarChart3, Info, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function RoiCalculator() {
  const [cost, setCost] = useState(2500);
  const [expectedClients, setExpectedClients] = useState(15);
  const [valuePerClient, setValuePerClient] = useState(1200);

  const stats = useMemo(() => {
    const revenue = expectedClients * valuePerClient;
    const profit = revenue - cost;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;
    const cpa = cost / (expectedClients || 1);
    return { revenue, profit, roi, cpa };
  }, [cost, expectedClients, valuePerClient]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      <Card className="xl:col-span-4 glass-card border-none rounded-[2rem] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-accent" />
        <CardHeader className="p-8">
          <CardTitle className="text-2xl font-headline font-bold text-white flex items-center gap-3">
            <Wallet className="w-6 h-6 text-primary" /> Parámetros
          </CardTitle>
          <CardDescription className="text-muted-foreground">Ajusta los valores para simular el impacto económico de tu estrategia.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                Presupuesto Campaña <TooltipProvider><Tooltip><TooltipTrigger><Info className="w-3 h-3"/></TooltipTrigger><TooltipContent>Inversión total incluyendo AdSpend y gestión.</TooltipContent></Tooltip></TooltipProvider>
              </label>
              <span className="text-xl font-headline font-bold text-white">{cost.toLocaleString()}€</span>
            </div>
            <Slider 
              value={[cost]} 
              onValueChange={(v) => setCost(v[0])} 
              max={20000} 
              step={100}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Volumen de Conversión</label>
              <span className="text-xl font-headline font-bold text-white">{expectedClients} Leads</span>
            </div>
            <Slider 
              value={[expectedClients]} 
              onValueChange={(v) => setExpectedClients(v[0])} 
              max={200} 
              step={1}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">LTV (Life Time Value)</label>
              <span className="text-xl font-headline font-bold text-white">{valuePerClient.toLocaleString()}€</span>
            </div>
            <Slider 
              value={[valuePerClient]} 
              onValueChange={(v) => setValuePerClient(v[0])} 
              max={10000} 
              step={100}
              className="py-4"
            />
          </div>
        </CardContent>
      </Card>

      <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card border-none rounded-[2.5rem] p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-40 h-40 text-primary" />
          </div>
          <CardHeader className="p-0 mb-6">
            <Badge variant="outline" className="w-fit text-[9px] border-primary/20 text-primary uppercase tracking-widest bg-primary/5">Eficiencia de Inversión</Badge>
          </CardHeader>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ROI Proyectado</p>
            <div className="text-7xl font-headline font-bold text-white tracking-tighter">
              {stats.roi.toFixed(0)}<span className="text-primary">%</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs pt-4">
              <ArrowUpRight className="w-4 h-4" /> Rendimiento Superior al Sector
            </div>
          </div>
        </Card>

        <Card className="glass-card border-none rounded-[2.5rem] p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="w-40 h-40 text-accent" />
          </div>
          <CardHeader className="p-0 mb-6">
            <Badge variant="outline" className="w-fit text-[9px] border-accent/20 text-accent uppercase tracking-widest bg-accent/5">Rentabilidad Neta</Badge>
          </CardHeader>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Beneficio Estimado</p>
            <div className="text-7xl font-headline font-bold text-white tracking-tighter">
              {stats.profit.toLocaleString()}<span className="text-accent">€</span>
            </div>
            <p className="text-xs text-muted-foreground pt-4">Deducido tras inversión publicitaria.</p>
          </div>
        </Card>

        <Card className="md:col-span-2 glass-card border-none rounded-[2.5rem] p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary/20 p-3 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl font-headline font-bold text-white">KPI Breakdown</h4>
              <p className="text-xs text-muted-foreground">Desglose de métricas clave de rendimiento.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-400">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Revenue Bruto</p>
              </div>
              <p className="text-3xl font-headline font-bold text-white">{stats.revenue.toLocaleString()}€</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-orange-400">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest">CPA Objetivo</p>
              </div>
              <p className="text-3xl font-headline font-bold text-white">{stats.cpa.toFixed(1)}€</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest">LTV/CAC Ratio</p>
              </div>
              <p className="text-3xl font-headline font-bold text-white">{(valuePerClient / (stats.cpa || 1)).toFixed(1)}x</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
