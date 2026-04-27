"use client";

import React, { useState } from "react";
import { Search, MapPin, Briefcase, Filter, Download, Star, ExternalLink, Loader2, Sparkles, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { discoverClients, type DiscoverClientsOutput } from "@/ai/flows/discover-clients-flow";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ClientDiscovery() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DiscoverClientsOutput | null>(null);
  const [params, setParams] = useState({
    sector: "Clínicas Estéticas",
    location: "Valencia"
  });

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userRef);

  const handleSearch = async () => {
    if (!profile?.aiSettings?.apiKey) {
      toast({ 
        title: "API Key requerida", 
        description: "Configura tu API Key en Ajustes de IA para activar el buscador inteligente.",
        variant: "destructive"
      });
      return;
    }

    if (!params.sector || !params.location) {
      toast({ title: "Campos incompletos", description: "Indica sector y zona.", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    try {
      const data = await discoverClients({
        ...params,
        userConfig: profile.aiSettings
      });
      setResults(data);
      toast({ title: "Escaneo completado", description: `He encontrado ${data.leads.length} oportunidades clave.` });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo realizar la búsqueda. Revisa tu clave.", variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="glass-card border-none shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary to-accent" />
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-5 space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <Briefcase className="w-3 h-3 text-primary" /> Sector Industrial
              </label>
              <Input 
                value={params.sector}
                onChange={(e) => setParams({...params, sector: e.target.value})}
                placeholder="Ej: Inmobiliarias, Dentistas..." 
                className="bg-white/5 border-white/10 h-12 text-white" 
              />
            </div>
            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <MapPin className="w-3 h-3 text-accent" /> Zona Geográfica
              </label>
              <Input 
                value={params.location}
                onChange={(e) => setParams({...params, location: e.target.value})}
                placeholder="Ciudad o Barrio" 
                className="bg-white/5 border-white/10 h-12 text-white" 
              />
            </div>
            <div className="md:col-span-3">
              <Button 
                onClick={handleSearch} 
                disabled={isSearching} 
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-xl glow-primary h-12 font-bold"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                {isSearching ? "Escaneando..." : "Explorar Clientes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6 animate-fade-in">
          <Card className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Análisis de Mercado AI</h4>
                <p className="text-muted-foreground leading-relaxed text-sm italic">"{results.marketOverview}"</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card border-none shadow-2xl overflow-hidden rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/5 p-6">
              <div>
                <CardTitle className="text-xl font-headline font-bold text-white">Prospectos Identificados</CardTitle>
                <CardDescription className="text-muted-foreground/60 text-xs">Inteligencia competitiva generada por {profile?.aiSettings?.modelId?.split('/').pop()}.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white text-[10px] font-bold uppercase tracking-widest"><Download className="w-3 h-3 mr-2" /> Exportar</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5">
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase py-4">Negocio</TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase">Zona</TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase">Reputación</TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase">Estatus IA</TableHead>
                    <TableHead className="text-right text-[10px] font-bold text-muted-foreground uppercase">Inteligencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.leads.map((lead, index) => (
                    <TableRow key={index} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="py-4">
                        <div className="font-bold text-white group-hover:text-primary transition-colors">{lead.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{lead.sector}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{lead.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-white">{lead.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-[9px] font-bold uppercase tracking-tighter ${
                            lead.status === "Lead Caliente" 
                              ? "border-accent text-accent-foreground bg-accent/10" 
                              : "border-white/10 text-muted-foreground"
                          }`}
                        >
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                                <Info className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover border-white/10 p-4 max-w-[250px] rounded-xl shadow-2xl">
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-primary uppercase">Oportunidad</p>
                                <p className="text-xs leading-relaxed text-white">{lead.description}</p>
                                <div className="pt-2 border-t border-white/5">
                                  <p className="text-[10px] font-bold text-accent uppercase">Acción Sugerida</p>
                                  <p className="text-[10px] italic text-muted-foreground">{lead.suggestedAction}</p>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {!results && !isSearching && (
        <div className="flex flex-col items-center justify-center py-20 opacity-30">
          <Search className="w-16 h-16 mb-4 text-primary" />
          <p className="text-sm font-bold uppercase tracking-widest">Listo para escanear el mercado</p>
        </div>
      )}
    </div>
  );
}
