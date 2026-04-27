
"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone, ExternalLink, Calendar, Loader2, Database, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

interface LeadListProps {
  limit?: number;
}

export function LeadList({ limit }: LeadListProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const businessProfilesQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, "users", user.uid, "businessProfiles");
  }, [db, user?.uid]);

  const { data: leads, isLoading } = useCollection(businessProfilesQuery);

  const handleDelete = (leadId: string) => {
    if (!db || !user?.uid) return;
    const docRef = doc(db, "users", user.uid, "businessProfiles", leadId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Prospecto Eliminado", description: "El registro ha sido borrado del pipeline." });
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Accediendo a la base de datos...</p>
    </div>
  );

  if (!leads || leads.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="bg-primary/5 p-10 rounded-[2.5rem] animate-float">
        <Database className="w-12 h-12 text-primary/20" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-headline font-bold text-foreground">Pipeline Vacío</h3>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Usa el <strong>Discovery</strong> o el <strong>Scouting</strong> para poblar tu CRM de inteligencia estratégica.
        </p>
      </div>
    </div>
  );

  const sortedLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const displayLeads = limit ? sortedLeads.slice(0, limit) : sortedLeads;

  return (
    <div className="rounded-[2.5rem] overflow-hidden border border-border/40 shadow-sm bg-white">
      <Table>
        {!limit && (
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40">
              <TableHead className="py-6 px-8 text-[10px] font-bold uppercase tracking-widest">Empresa / Web</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Propietario / Contacto</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Estatus AI</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Industria</TableHead>
              <TableHead className="text-right px-8 text-[10px] font-bold uppercase tracking-widest">Gestión</TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {displayLeads.map((lead) => (
            <TableRow key={lead.id} className="group hover:bg-muted/10 transition-colors border-border/40">
              <TableCell className="py-6 px-8">
                <div className="font-bold text-foreground text-md">{lead.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono mt-1 flex items-center gap-1.5 opacity-60">
                   <ExternalLink className="w-2.5 h-2.5" /> {lead.url?.replace(/^https?:\/\//, '') || "Sin URL"}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><User className="w-3.5 h-3.5" /></div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{lead.ownerName || "Por identificar"}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-2.5 h-2.5" /> {lead.email || "No disponible"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={
                    lead.leadStatus === "Lead Caliente" 
                      ? "bg-accent/10 text-accent border-accent/20 px-3 py-1 text-[9px] font-bold uppercase tracking-tighter" 
                      : "bg-muted/50 text-muted-foreground border-transparent px-3 py-1 text-[9px] font-bold uppercase tracking-tighter"
                  }
                >
                  {lead.leadStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-white border-border/60 text-[9px] px-3 py-1 font-bold uppercase tracking-widest text-muted-foreground">{lead.industry || "General"}</Badge>
              </TableCell>
              <TableCell className="text-right px-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl">
                    <DropdownMenuLabel className="px-4 py-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Acciones de Ventas</DropdownMenuLabel>
                    <DropdownMenuItem className="rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer">
                      <Mail className="w-4 h-4 text-primary" /> Redactar Email AI
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer">
                      <Phone className="w-4 h-4 text-emerald-500" /> Llamar ahora
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-xl px-4 py-3 text-primary font-bold cursor-pointer">
                      Ver Auditoría AI
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl px-4 py-3 text-destructive font-bold cursor-pointer" onClick={() => handleDelete(lead.id)}>
                      Eliminar Registro
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
