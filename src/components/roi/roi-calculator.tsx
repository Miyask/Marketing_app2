
"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, DollarSign, Target, Percent, ArrowUpRight, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export function RoiCalculator() {
  const [cost, setCost] = useState(1500);
  const [expectedClients, setExpectedClients] = useState(10);
  const [valuePerClient, setValuePerClient] = useState(500);

  const stats = useMemo(() => {
    const revenue = expectedClients * valuePerClient;
    const profit = revenue - cost;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;
    return { revenue, profit, roi };
  }, [cost, expectedClients, valuePerClient]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 border-none shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Parámetros de Campaña</CardTitle>
          <CardDescription>Ajusta los valores para predecir tus resultados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Inversión (AdSpend/Fee)</label>
              <span className="text-primary font-bold">{cost}€</span>
            </div>
            <Slider 
              value={[cost]} 
              onValueChange={(v) => setCost(v[0])} 
              max={10000} 
              step={100}
              className="py-4"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Nº Clientes Estimados</label>
              <span className="text-primary font-bold">{expectedClients}</span>
            </div>
            <Slider 
              value={[expectedClients]} 
              onValueChange={(v) => setExpectedClients(v[0])} 
              max={100} 
              step={1}
              className="py-4"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Ticket Medio (LTV)</label>
              <span className="text-primary font-bold">{valuePerClient}€</span>
            </div>
            <Slider 
              value={[valuePerClient]} 
              onValueChange={(v) => setValuePerClient(v[0])} 
              max={5000} 
              step={50}
              className="py-4"
            />
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ArrowUpRight className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/70 uppercase tracking-widest">ROI Estimado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-headline font-bold">{stats.roi.toFixed(0)}%</div>
            <div className="mt-4 flex items-center gap-1 bg-white/10 w-fit px-2 py-1 rounded text-xs font-semibold">
              <TrendingUp className="w-3 h-3" /> Supera la media del sector
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-accent text-accent-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-accent-foreground/70 uppercase tracking-widest">Beneficio Neto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-headline font-bold">{stats.profit.toLocaleString()}€</div>
            <p className="mt-2 text-sm">Tras descontar la inversión inicial.</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Desglose de Predicción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase">Ingresos Brutos</p>
                  <p className="text-xl font-headline font-bold">{stats.revenue.toLocaleString()}€</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase">CPA (Coste Adquisición)</p>
                  <p className="text-xl font-headline font-bold">{(cost / (expectedClients || 1)).toFixed(1)}€</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase">Eficiencia</p>
                  <p className="text-xl font-headline font-bold">Excelente</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
