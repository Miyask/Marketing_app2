
"use client";

import React, { useState } from "react";
import { Search, MapPin, Briefcase, Filter, Download, Star, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function ClientDiscovery() {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setResults([
        { id: 1, name: "Clínica Dental Ponent", location: "Barcelona", sector: "Salud", rating: 4.8, status: "Sin Marketing" },
        { id: 2, name: "Cafetería El Faro", location: "Barcelona", sector: "Hostelería", rating: 3.5, status: "Lead Caliente" },
        { id: 3, name: "Taller Mecánico Rápido", location: "Madrid", sector: "Automoción", rating: 4.2, status: "Sin Web" },
        { id: 4, name: "Inmobiliaria Mediterráneo", location: "Valencia", sector: "Real Estate", rating: 4.5, status: "Lead Caliente" },
        { id: 5, name: "Consultoría FinanPro", location: "Barcelona", sector: "Finanzas", rating: 4.9, status: "Competidor" },
      ]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> SECTOR
              </label>
              <Input placeholder="Ej: Restaurantes, Dentistas..." className="bg-muted/30" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> LOCALIZACIÓN
              </label>
              <Input placeholder="Ciudad o Código Postal" className="bg-muted/30" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                <Filter className="w-3 h-3" /> FILTRO EXTRA
              </label>
              <Input placeholder="Palabras clave" className="bg-muted/30" />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                disabled={isSearching} 
                className="w-full bg-primary text-primary-foreground shadow-md shadow-primary/20 h-10"
              >
                {isSearching ? "Buscando..." : "Explorar Clientes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="border-none shadow-sm animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Prospectos Encontrados</CardTitle>
              <CardDescription>Mostrando {results.length} coincidencias cercanas.</CardDescription>
            </div>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Exportar CSV</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Negocio</TableHead>
                  <TableHead>Localización</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Estado IA</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-semibold">{row.name}</TableCell>
                    <TableCell className="text-muted-foreground">{row.location}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{row.sector}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-sm">{row.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          row.status === "Lead Caliente" 
                            ? "border-accent text-accent-foreground bg-accent/5" 
                            : "border-muted text-muted-foreground"
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:text-primary">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-primary">
                        <Briefcase className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
