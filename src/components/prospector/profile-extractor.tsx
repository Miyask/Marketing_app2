
"use client";

import React, { useState } from "react";
import { Globe, User, Mail, Phone, Share2, Search, Loader2, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProfileExtractor() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleExtract = () => {
    if (!url) return;
    setIsScanning(true);
    // Mocking the extraction process
    setTimeout(() => {
      setResult({
        businessName: "EcoSolutions SL",
        owner: "Marta Rodríguez",
        email: "contacto@ecosolutions.es",
        phone: "+34 600 123 456",
        industry: "Energías Renovables",
        social: ["LinkedIn", "Instagram", "Facebook"],
        competitors: ["SolarPower Inc", "GreenFuture SL"]
      });
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 border-none shadow-sm h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Analizar URL</CardTitle>
          <CardDescription>Escanea un sitio web para extraer datos públicos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">URL del Negocio</label>
            <div className="flex gap-2">
              <Input 
                placeholder="https://ejemplo.com" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
          </div>
          <Button 
            className="w-full bg-primary text-primary-foreground" 
            onClick={handleExtract}
            disabled={isScanning || !url}
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
            {isScanning ? "Escaneando..." : "Extraer Perfil"}
          </Button>
          <p className="text-[10px] text-muted-foreground text-center">
            Este proceso utiliza búsqueda MCP y scrapping ético de datos públicos.
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border-none shadow-sm min-h-[400px] flex flex-col items-center justify-center bg-card">
        {!result && !isScanning && (
          <div className="text-center p-8">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="text-muted-foreground w-8 h-8" />
            </div>
            <h3 className="font-headline text-lg font-semibold">Esperando resultados</h3>
            <p className="text-sm text-muted-foreground max-w-[300px] mx-auto">
              Ingresa una URL a la izquierda para comenzar el análisis del propietario y competencia.
            </p>
          </div>
        )}

        {isScanning && (
          <div className="text-center p-8 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <div className="space-y-1">
              <p className="font-headline font-semibold">Identificando propietario...</p>
              <p className="text-sm text-muted-foreground">Buscando en registros DNS, LinkedIn y Whois.</p>
            </div>
          </div>
        )}

        {result && !isScanning && (
          <div className="w-full p-6 animate-fade-in space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {result.businessName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold">{result.businessName}</h3>
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">{result.industry}</Badge>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-accent text-accent-foreground hover:bg-accent/10">Guardar como Lead</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/20 flex items-center gap-3">
                <div className="bg-white p-2 rounded-md shadow-sm text-blue-500"><User className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Propietario / CEO</p>
                  <p className="text-sm font-semibold">{result.owner}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 flex items-center gap-3">
                <div className="bg-white p-2 rounded-md shadow-sm text-red-500"><Mail className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Email Corporativo</p>
                  <p className="text-sm font-semibold">{result.email}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 flex items-center gap-3">
                <div className="bg-white p-2 rounded-md shadow-sm text-green-500"><Phone className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Teléfono</p>
                  <p className="text-sm font-semibold">{result.phone}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 flex items-center gap-3">
                <div className="bg-white p-2 rounded-md shadow-sm text-purple-500"><Share2 className="w-4 h-4" /></div>
                <div className="flex flex-wrap gap-1">
                  {result.social.map((s: string) => (
                    <Badge key={s} variant="secondary" className="text-[9px] h-4">{s}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-headline font-semibold text-sm">Competencia Directa Detectada</h4>
              <div className="flex flex-wrap gap-2">
                {result.competitors.map((c: string) => (
                  <Badge key={c} variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">{c}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
