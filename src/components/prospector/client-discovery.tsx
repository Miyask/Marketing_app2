
"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Filter, Download, Star, ExternalLink, Loader2, Sparkles, Info, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { discoverClients, type DiscoverClientsOutput } from "@/ai/flows/discover-clients-flow";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { hasDefaultGoogleKey } from "@/ai/check-default-key";

export function ClientDiscovery() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DiscoverClientsOutput | null>(null);
  const [isSavingId, setIsSavingId] = useState<number | null>(null);
  const [hasServerKey, setHasServerKey] = useState(false);
  const [params, setParams] = useState({
    sector: "Clínicas Estéticas",
    location: "Valencia"
  });

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(userRef);

  useEffect(() => {
    hasDefaultGoogleKey().then(setHasServerKey);
  }, []);

  const handleSearch = async () => {
    const aiSettings = profile?.aiSettings;
    const modelId = aiSettings?.modelId || 'googleai/gemini-2.5-flash';
    
    let hasKey = false;
    if (modelId.startsWith('googleai/') && (aiSettings?.googleApiKey || hasServerKey)) hasKey = true;
    else if (modelId.startsWith('openai/') && aiSettings?.openaiApiKey) hasKey = true;
    else if (modelId.startsWith('openrouter/') && aiSettings?.openrouterApiKey) hasKey = true;
    
    if (!hasKey) {
      toast({ 
        title: "API Key requerida", 
        description: "Configura tu API Key correspondiente en Ajustes de IA para activar el buscador inteligente.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const data = await discoverClients({
        ...params,
        userConfig: {
          modelId: aiSettings?.modelId || 'googleai/gemini-2.5-flash',
          googleApiKey: aiSettings?.googleApiKey,
          openaiApiKey: aiSettings?.openaiApiKey,
          openrouterApiKey: aiSettings?.openrouterApiKey,
        }
      });
      setResults(data);
      toast({ title: "Escaneo completado", description: `He encontrado ${data.leads.length} oportunidades clave.` });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo realizar la búsqueda. Revisa tu clave.", variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveToPipeline = (lead: any, index: number) => {
    if (!db || !user?.uid) return;
    setIsSavingId(index);
    
    const businessProfilesRef = collection(db, "users", user.uid, "businessProfiles");
    const leadId = Math.random().toString(36).substring(7);

    addDocumentNonBlocking(businessProfilesRef, {
      id: leadId,
      userId: user.uid,
      name: lead.name,
      url: "",
      ownerName: "Por identificar",
      email: "",
      phone: "",
      addressCity: lead.location,
      addressCountry: "España",
      industry: lead.sector,
      leadStatus: lead.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiInsights: {
        description: lead.description,
        suggestedAction: lead.suggestedAction,
        rating: lead.rating
      }
    });

    toast({ title: "Prospecto Guardado", description: `${lead.name} añadido a tu pipeline de ventas.` });
    setIsSavingId(null);
  };

  return (
    <div className="space-y-8">
      <Card className="glass-card border-none shadow-xl overflow-hidden bg-white rounded-[2rem]">
        <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
        <CardContent className="pt-8 p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-5 space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <Briefcase className="w-3 h-3 text-primary" /> Sector Industrial
              </label>
              <Input 
                value={params.sector}
                onChange={(e) => setParams({...params, sector: e.target.value})}
                placeholder="Ej: Inmobiliarias, Dentistas..." 
                className="bg-secondary/50 border-border h-12 text-foreground focus:ring-primary transition-colors rounded-xl" 
              />
            </div>
            <div className="md:col-span-4 space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <MapPin className="w-3 h-3 text-accent" /> Zona Geográfica
              </label>
              <Input 
                value={params.location}
                onChange={(e) => setParams({...params, location: e.target.value})}
                placeholder="Ciudad o Barrio" 
                className="bg-secondary/50 border-border h-12 text-foreground focus:ring-primary transition-colors rounded-xl" 
              />
            </div>
            <div className="md:col-span-3">
              <Button 
                onClick={handleSearch} 
                disabled={isSearching} 
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-xl glow-primary h-12 font-bold rounded-xl"
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
          <Card className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Análisis de Mercado AI</h4>
                <p className="text-muted-foreground leading-relaxed text-sm italic">"{results.marketOverview}"</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20 p-8">
              <div>
                <CardTitle className="text-xl font-headline font-bold text-foreground">Prospectos Identificados</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">Inteligencia competitiva generada por {profile?.aiSettings?.modelId?.split('/').pop()}.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-white border-border text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-muted rounded-xl"><Download className="w-3 h-3 mr-2" /> Exportar</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow className="border-border">
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase py-6 px-8">Negocio</TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase">Zona</TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase">Reputación</TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase">Estatus IA</TableHead>
                    <TableHead className="text-right text-[10px] font-bold text-muted-foreground uppercase px-8">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.leads.map((lead, index) => (
                    <TableRow key={index} className="border-border hover:bg-muted/30 transition-colors group">
                      <TableCell className="py-6 px-8">
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">{lead.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{lead.sector}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{lead.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-foreground">{lead.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-[9px] font-bold uppercase tracking-tighter ${
                            lead.status === "Lead Caliente" 
                              ? "border-accent text-accent-foreground bg-accent/10" 
                              : "border-border text-muted-foreground bg-muted/50"
                          }`}
                        >
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                                  <Info className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white border-border p-5 max-w-[280px] rounded-2xl shadow-2xl">
                                <div className="space-y-3">
                                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Oportunidad Estratégica</p>
                                  <p className="text-xs leading-relaxed text-foreground italic">"{lead.description}"</p>
                                  <div className="pt-3 border-t border-border">
                                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Primer Paso</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">{lead.suggestedAction}</p>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:bg-primary/10 rounded-xl"
                            onClick={() => handleSaveToPipeline(lead, index)}
                            disabled={isSavingId === index}
                          >
                            {isSavingId === index ? <Loader2 className="w-3 h-3 animate-spin" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                            Añadir
                          </Button>
                        </div>
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
        <div className="flex flex-col items-center justify-center py-24 opacity-30 text-center">
          <div className="bg-muted p-8 rounded-full mb-6">
            <Search className="w-16 h-16 text-primary" />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">Listo para escanear el mercado</p>
        </div>
      )}
    </div>
  );
}
