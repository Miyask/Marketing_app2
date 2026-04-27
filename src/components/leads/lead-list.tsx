
"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone, ExternalLink, Calendar, Loader2, Database } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
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
    toast({ title: "Lead eliminado", description: "El prospecto ha sido borrado de tu pipeline." });
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Cargando Leads...</p>
    </div>
  );

  if (!leads || leads.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="bg-muted/30 p-6 rounded-3xl">
        <Database className="w-10 h-10 text-muted-foreground/30" />
      </div>
      <h3 className="text-xl font-headline font-bold text-foreground">Pipeline Vacío</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Utiliza el <strong>Market Discovery</strong> o el <strong>Extractor</strong> para añadir clientes potenciales.
      </p>
    </div>
  );

  const displayLeads = limit ? leads.slice(0, limit) : leads;

  return (
    <div className="rounded-md overflow-hidden">
      <Table>
        {!limit && (
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="w-[200px]">Empresa</TableHead>
              <TableHead>Contacto / Info</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead>Industria</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {displayLeads.map((lead) => (
            <TableRow key={lead.id} className="group hover:bg-muted/10 transition-colors">
              <TableCell>
                <div className="font-semibold text-foreground">{lead.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                   <ExternalLink className="w-2.5 h-2.5" /> {lead.url?.replace(/^https?:\/\//, '') || "Sin URL"}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium">{lead.ownerName || "Por contactar"}</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5" /> {lead.email || "No disponible"}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={
                    lead.leadStatus === "Lead Caliente" 
                      ? "bg-accent/10 text-accent-foreground border-accent/20" 
                      : lead.leadStatus === "Cerrado"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-muted/50 text-muted-foreground border-transparent"
                  }
                >
                  {lead.leadStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                <Badge variant="secondary" className="bg-white border-border text-[9px] px-2">{lead.industry || "General"}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Gestión de Lead</DropdownMenuLabel>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Contactar via Email
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Registrar Llamada
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-primary font-bold">Ver Análisis AI</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive font-bold" onClick={() => handleDelete(lead.id)}>Eliminar Lead</DropdownMenuItem>
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
