
"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone, ExternalLink, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LeadListProps {
  limit?: number;
}

export function LeadList({ limit }: LeadListProps) {
  const allLeads = [
    { id: "L001", name: "Innova Solar SL", contact: "Carlos Menéndez", email: "c.menendez@innovasolar.es", phone: "912 345 678", status: "Caliente", source: "Extractor URL", date: "Hoy, 10:30" },
    { id: "L002", name: "Restaurante Gaia", contact: "Elena Torres", email: "info@gaiabcn.com", phone: "934 567 890", status: "Frío", source: "Búsqueda Local", date: "Ayer" },
    { id: "L003", name: "Tech Solutions Ltd", contact: "Mark Wilson", email: "m.wilson@techsol.co.uk", phone: "+44 20 7946 0958", status: "En Negociación", source: "Scrapping", date: "15 Oct" },
    { id: "L004", name: "Moda Eco S.A.", contact: "Ana Beltrán", email: "beltran@modaeco.es", phone: "915 234 567", status: "Caliente", source: "Extractor URL", date: "14 Oct" },
    { id: "L005", name: "Gimnasio FitLife", contact: "Sergio Ramos", email: "admin@fitlife.es", phone: "932 112 233", status: "Cerrado", source: "Búsqueda Local", date: "12 Oct" },
    { id: "L006", name: "Consultores ABC", contact: "Laura Gil", email: "lgil@abc.es", phone: "911 223 344", status: "Frío", source: "Scrapping", date: "10 Oct" },
  ];

  const leads = limit ? allLeads.slice(0, limit) : allLeads;

  return (
    <div className="rounded-md overflow-hidden">
      <Table>
        {!limit && (
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="w-[200px]">Empresa</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="group hover:bg-muted/10 transition-colors">
              <TableCell>
                <div className="font-semibold">{lead.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono">{lead.id}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{lead.contact}</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5" /> {lead.email}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={
                    lead.status === "Caliente" 
                      ? "bg-accent/10 text-accent-foreground border-accent/20" 
                      : lead.status === "Cerrado"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-muted/50 text-muted-foreground border-transparent"
                  }
                >
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> {lead.source}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {lead.date}
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
                    <DropdownMenuLabel>Opciones de Lead</DropdownMenuLabel>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Enviar Email
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Llamar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-primary font-medium">Ver Estrategia AI</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Eliminar Lead</DropdownMenuItem>
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
