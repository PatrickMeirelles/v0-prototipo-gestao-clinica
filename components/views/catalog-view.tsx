"use client";

import { useState } from "react";
import type { CatalogItem, ItemCategory, Supplier } from "@/app/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Save, Trash2, X } from "lucide-react";

interface CatalogViewProps {
  suppliers: Supplier[];
  catalogItems: CatalogItem[];
  onAddSupplier: (nome: string) => Supplier | null;
  onUpdateSupplier: (id: number, nome: string) => void;
  onDeleteSupplier: (id: number) => void;
  onAddCatalogItem: (
    nome: string,
    categoria: ItemCategory,
  ) => CatalogItem | null;
  onUpdateCatalogItem: (
    id: number,
    updates: { nome: string; categoria: ItemCategory },
  ) => void;
  onDeleteCatalogItem: (id: number) => void;
}

const categoriaLabel: Record<ItemCategory, string> = {
  medicacao: "Medicação",
  insumo: "Insumo",
  taxa_frete: "Taxa/Frete",
};

export function CatalogView({
  suppliers,
  catalogItems,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onAddCatalogItem,
  onUpdateCatalogItem,
  onDeleteCatalogItem,
}: CatalogViewProps) {
  const [novoFornecedor, setNovoFornecedor] = useState("");
  const [novoItem, setNovoItem] = useState("");
  const [novaCategoria, setNovaCategoria] = useState<ItemCategory>("medicacao");

  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(
    null,
  );
  const [editingSupplierName, setEditingSupplierName] = useState("");

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemName, setEditingItemName] = useState("");
  const [editingItemCategory, setEditingItemCategory] =
    useState<ItemCategory>("medicacao");

  const handleAddSupplier = () => {
    const created = onAddSupplier(novoFornecedor);
    if (created) setNovoFornecedor("");
  };

  const handleAddItem = () => {
    const created = onAddCatalogItem(novoItem, novaCategoria);
    if (created) {
      setNovoItem("");
      setNovaCategoria("medicacao");
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Cadastros</h2>
        <p className="text-sm text-slate-500">
          Gerencie fornecedores e itens/insumos para agilizar os lançamentos
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Fornecedores
            </CardTitle>
            <CardDescription className="text-slate-500">
              CRUD de fornecedores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Nome do fornecedor"
                value={novoFornecedor}
                onChange={(e) => setNovoFornecedor(e.target.value)}
                className="border-slate-200"
              />
              <Button
                onClick={handleAddSupplier}
                className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto"
              >
                Cadastrar
              </Button>
            </div>

            <div className="space-y-3 sm:hidden">
              {suppliers.map((supplier) => (
                <Card key={supplier.id} className="border-slate-200">
                  <CardContent className="space-y-3 p-3">
                    {editingSupplierId === supplier.id ? (
                      <Input
                        value={editingSupplierName}
                        onChange={(e) => setEditingSupplierName(e.target.value)}
                        className="h-9 border-slate-200"
                      />
                    ) : (
                      <p className="font-medium text-slate-900">
                        {supplier.nome}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {editingSupplierId === supplier.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              onUpdateSupplier(
                                supplier.id,
                                editingSupplierName,
                              );
                              setEditingSupplierId(null);
                            }}
                            className="border-slate-200"
                          >
                            <Save className="mr-1 size-4" />
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSupplierId(null)}
                            className="border-slate-200"
                          >
                            <X className="mr-1 size-4" />
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingSupplierId(supplier.id);
                              setEditingSupplierName(supplier.nome);
                            }}
                            className="border-slate-200"
                          >
                            <Pencil className="mr-1 size-4" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteSupplier(supplier.id)}
                            className="border-rose-200 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="mr-1 size-4" />
                            Excluir
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="hidden w-full overflow-x-auto sm:block">
              <Table className="min-w-[420px]">
                <TableHeader>
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="border-slate-100">
                      <TableCell>
                        {editingSupplierId === supplier.id ? (
                          <Input
                            value={editingSupplierName}
                            onChange={(e) =>
                              setEditingSupplierName(e.target.value)
                            }
                            className="h-8 border-slate-200"
                          />
                        ) : (
                          <span className="break-words text-slate-900">
                            {supplier.nome}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {editingSupplierId === supplier.id ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  onUpdateSupplier(
                                    supplier.id,
                                    editingSupplierName,
                                  );
                                  setEditingSupplierId(null);
                                }}
                                className="border-slate-200"
                              >
                                <Save className="mr-1 size-4" />
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingSupplierId(null)}
                                className="border-slate-200"
                              >
                                <X className="mr-1 size-4" />
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingSupplierId(supplier.id);
                                  setEditingSupplierName(supplier.nome);
                                }}
                                className="border-slate-200"
                              >
                                <Pencil className="mr-1 size-4" />
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDeleteSupplier(supplier.id)}
                                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="mr-1 size-4" />
                                Excluir
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Itens / Insumos
            </CardTitle>
            <CardDescription className="text-slate-500">
              CRUD de itens por categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-[1fr_170px_auto]">
              <Input
                placeholder="Nome do item/insumo"
                value={novoItem}
                onChange={(e) => setNovoItem(e.target.value)}
                className="border-slate-200"
              />
              <Select
                value={novaCategoria}
                onValueChange={(value: ItemCategory) => setNovaCategoria(value)}
              >
                <SelectTrigger className="w-full border-slate-200">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicacao">Medicação</SelectItem>
                  <SelectItem value="insumo">Insumo</SelectItem>
                  <SelectItem value="taxa_frete">Taxa/Frete</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddItem}
                className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto"
              >
                Cadastrar
              </Button>
            </div>

            <div className="space-y-3 sm:hidden">
              {catalogItems.map((item) => (
                <Card key={item.id} className="border-slate-200">
                  <CardContent className="space-y-3 p-3">
                    {editingItemId === item.id ? (
                      <>
                        <Input
                          value={editingItemName}
                          onChange={(e) => setEditingItemName(e.target.value)}
                          className="h-9 border-slate-200"
                        />
                        <Select
                          value={editingItemCategory}
                          onValueChange={(value: ItemCategory) =>
                            setEditingItemCategory(value)
                          }
                        >
                          <SelectTrigger className="h-9 w-full border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medicacao">Medicação</SelectItem>
                            <SelectItem value="insumo">Insumo</SelectItem>
                            <SelectItem value="taxa_frete">
                              Taxa/Frete
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <>
                        <p className="break-words font-medium text-slate-900">
                          {item.nome}
                        </p>
                        <Badge
                          variant="outline"
                          className="w-fit border-slate-200 bg-slate-50 text-slate-700"
                        >
                          {categoriaLabel[item.categoria]}
                        </Badge>
                      </>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {editingItemId === item.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              onUpdateCatalogItem(item.id, {
                                nome: editingItemName,
                                categoria: editingItemCategory,
                              });
                              setEditingItemId(null);
                            }}
                            className="border-slate-200"
                          >
                            <Save className="mr-1 size-4" />
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItemId(null)}
                            className="border-slate-200"
                          >
                            <X className="mr-1 size-4" />
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingItemId(item.id);
                              setEditingItemName(item.nome);
                              setEditingItemCategory(item.categoria);
                            }}
                            className="border-slate-200"
                          >
                            <Pencil className="mr-1 size-4" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteCatalogItem(item.id)}
                            className="border-rose-200 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="mr-1 size-4" />
                            Excluir
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="hidden w-full overflow-x-auto sm:block">
              <Table className="min-w-[560px]">
                <TableHeader>
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogItems.map((item) => (
                    <TableRow key={item.id} className="border-slate-100">
                      <TableCell>
                        {editingItemId === item.id ? (
                          <Input
                            value={editingItemName}
                            onChange={(e) => setEditingItemName(e.target.value)}
                            className="h-8 border-slate-200"
                          />
                        ) : (
                          <span className="break-words text-slate-900">
                            {item.nome}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItemId === item.id ? (
                          <Select
                            value={editingItemCategory}
                            onValueChange={(value: ItemCategory) =>
                              setEditingItemCategory(value)
                            }
                          >
                            <SelectTrigger className="h-8 w-[150px] border-slate-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="medicacao">
                                Medicação
                              </SelectItem>
                              <SelectItem value="insumo">Insumo</SelectItem>
                              <SelectItem value="taxa_frete">
                                Taxa/Frete
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-slate-200 bg-slate-50 text-slate-700"
                          >
                            {categoriaLabel[item.categoria]}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {editingItemId === item.id ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  onUpdateCatalogItem(item.id, {
                                    nome: editingItemName,
                                    categoria: editingItemCategory,
                                  });
                                  setEditingItemId(null);
                                }}
                                className="border-slate-200"
                              >
                                <Save className="mr-1 size-4" />
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingItemId(null)}
                                className="border-slate-200"
                              >
                                <X className="mr-1 size-4" />
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingItemId(item.id);
                                  setEditingItemName(item.nome);
                                  setEditingItemCategory(item.categoria);
                                }}
                                className="border-slate-200"
                              >
                                <Pencil className="mr-1 size-4" />
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDeleteCatalogItem(item.id)}
                                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="mr-1 size-4" />
                                Excluir
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
