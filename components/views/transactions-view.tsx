"use client";

import { useState, useMemo } from "react";
import type { CatalogItem, ItemCategory, Supplier } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  PackageX,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth"; // <-- Importamos o hook

interface ItemNota {
  id: number;
  catalogItemId: number | "new" | null;
  descricao: string;
  tipo: ItemCategory;
  quantidade: number;
  valorUnitario: number;
}

// ========== MOCK DATA: Array de transações realistas ==========
interface Transaction {
  id: number;
  data: string;
  mes: string;
  ano: string;
  fornecedor: string;
  itens: {
    descricao: string;
    tipo: "medicacao" | "frete";
    quantidade: number;
    valorUnitario: number;
  }[];
  valorTotal: number;
  notaFiscal: string;
}

// ========== MOCK DATA: Array de transações realistas ==========

interface Transaction {
  id: number;

  data: string;

  mes: string;

  ano: string;

  fornecedor: string;

  itens: {
    descricao: string;

    tipo: "medicacao" | "frete";

    quantidade: number;

    valorUnitario: number;
  }[];

  valorTotal: number;

  notaFiscal: string;
}

const mockTransactions: Transaction[] = [
  // ABRIL 2026

  {
    id: 1,

    data: "28/04/2026",

    mes: "04",

    ano: "2026",

    fornecedor: "Formédica",

    itens: [
      {
        descricao: "Tirzepatida 40mg",

        tipo: "medicacao",

        quantidade: 10,

        valorUnitario: 850,
      },

      {
        descricao: "Gestrinona 85mg",

        tipo: "medicacao",

        quantidade: 5,

        valorUnitario: 320,
      },

      { descricao: "Frete", tipo: "frete", quantidade: 1, valorUnitario: 150 },
    ],

    valorTotal: 10750,

    notaFiscal: "NF-2026-041",
  },

  {
    id: 2,

    data: "25/04/2026",

    mes: "04",

    ano: "2026",

    fornecedor: "BIOS",

    itens: [
      {
        descricao: "hcg 5.000 ui",

        tipo: "medicacao",

        quantidade: 20,

        valorUnitario: 180,
      },

      {
        descricao: "Tirzepatida 40mg",

        tipo: "medicacao",

        quantidade: 8,

        valorUnitario: 850,
      },
    ],

    valorTotal: 10400,

    notaFiscal: "NF-2026-042",
  },

  {
    id: 3,

    data: "20/04/2026",

    mes: "04",

    ano: "2026",

    fornecedor: "Flukka",

    itens: [
      {
        descricao: "Gestrinona 85mg",

        tipo: "medicacao",

        quantidade: 15,

        valorUnitario: 320,
      },

      { descricao: "Frete", tipo: "frete", quantidade: 1, valorUnitario: 250 },
    ],

    valorTotal: 5050,

    notaFiscal: "NF-2026-043",
  },

  {
    id: 4,

    data: "15/04/2026",

    mes: "04",

    ano: "2026",

    fornecedor: "Essentia",

    itens: [
      {
        descricao: "Tirzepatida 40mg",

        tipo: "medicacao",

        quantidade: 5,

        valorUnitario: 850,
      },
    ],

    valorTotal: 4250,

    notaFiscal: "NF-2026-044",
  },

  {
    id: 5,

    data: "10/04/2026",

    mes: "04",

    ano: "2026",

    fornecedor: "Formédica",

    itens: [
      {
        descricao: "hcg 5.000 ui",

        tipo: "medicacao",

        quantidade: 50,

        valorUnitario: 180,
      },

      { descricao: "Frete", tipo: "frete", quantidade: 1, valorUnitario: 320 },
    ],

    valorTotal: 9320,

    notaFiscal: "NF-2026-045",
  },

  // MARÇO 2026

  {
    id: 6,

    data: "28/03/2026",

    mes: "03",

    ano: "2026",

    fornecedor: "BIOS",

    itens: [
      {
        descricao: "Tirzepatida 40mg",

        tipo: "medicacao",

        quantidade: 12,

        valorUnitario: 850,
      },

      { descricao: "Frete", tipo: "frete", quantidade: 1, valorUnitario: 180 },
    ],

    valorTotal: 10380,

    notaFiscal: "NF-2026-031",
  },

  {
    id: 7,

    data: "22/03/2026",

    mes: "03",

    ano: "2026",

    fornecedor: "Formédica",

    itens: [
      {
        descricao: "Gestrinona 85mg",

        tipo: "medicacao",

        quantidade: 20,

        valorUnitario: 320,
      },
    ],

    valorTotal: 6400,

    notaFiscal: "NF-2026-032",
  },

  {
    id: 8,

    data: "15/03/2026",

    mes: "03",

    ano: "2026",

    fornecedor: "Essentia",

    itens: [
      {
        descricao: "hcg 5.000 ui",

        tipo: "medicacao",

        quantidade: 30,

        valorUnitario: 180,
      },

      { descricao: "Frete", tipo: "frete", quantidade: 1, valorUnitario: 250 },
    ],

    valorTotal: 5650,

    notaFiscal: "NF-2026-033",
  },

  {
    id: 9,

    data: "08/03/2026",

    mes: "03",

    ano: "2026",

    fornecedor: "Flukka",

    itens: [
      {
        descricao: "Tirzepatida 40mg",

        tipo: "medicacao",

        quantidade: 3,

        valorUnitario: 850,
      },
    ],

    valorTotal: 2550,

    notaFiscal: "NF-2026-034",
  },

  // FEVEREIRO 2026

  {
    id: 10,

    data: "26/02/2026",

    mes: "02",

    ano: "2026",

    fornecedor: "Formédica",

    itens: [
      {
        descricao: "Tirzepatida 40mg",

        tipo: "medicacao",

        quantidade: 10,

        valorUnitario: 850,
      },

      {
        descricao: "Gestrinona 85mg",

        tipo: "medicacao",

        quantidade: 8,

        valorUnitario: 320,
      },

      { descricao: "Frete", tipo: "frete", quantidade: 1, valorUnitario: 280 },
    ],

    valorTotal: 11340,

    notaFiscal: "NF-2026-021",
  },

  {
    id: 11,

    data: "20/02/2026",

    mes: "02",

    ano: "2026",

    fornecedor: "BIOS",

    itens: [
      {
        descricao: "hcg 5.000 ui",

        tipo: "medicacao",

        quantidade: 40,

        valorUnitario: 180,
      },
    ],

    valorTotal: 7200,

    notaFiscal: "NF-2026-022",
  },

  {
    id: 12,

    data: "14/02/2026",

    mes: "02",

    ano: "2026",

    fornecedor: "Essentia",

    itens: [
      {
        descricao: "Gestrinona 85mg",

        tipo: "medicacao",

        quantidade: 6,

        valorUnitario: 320,
      },

      { descricao: "Frete", tipo: "frete", quantidade: 1, valorUnitario: 150 },
    ],

    valorTotal: 2070,

    notaFiscal: "NF-2026-023",
  },

  {
    id: 13,

    data: "05/02/2026",

    mes: "02",

    ano: "2026",

    fornecedor: "Flukka",

    itens: [
      {
        descricao: "Tirzepatida 40mg",

        tipo: "medicacao",

        quantidade: 2,

        valorUnitario: 850,
      },
    ],

    valorTotal: 1700,

    notaFiscal: "NF-2026-024",
  },

  // JANEIRO 2026

  {
    id: 14,

    data: "30/01/2026",

    mes: "01",

    ano: "2026",

    fornecedor: "BIOS",

    itens: [
      {
        descricao: "Tirzepatida 40mg",

        tipo: "medicacao",

        quantidade: 6,

        valorUnitario: 850,
      },

      {
        descricao: "hcg 5.000 ui",

        tipo: "medicacao",

        quantidade: 25,

        valorUnitario: 180,
      },

      { descricao: "Frete", tipo: "frete", quantidade: 1, valorUnitario: 200 },
    ],

    valorTotal: 9800,

    notaFiscal: "NF-2026-011",
  },

  {
    id: 15,

    data: "22/01/2026",

    mes: "01",

    ano: "2026",

    fornecedor: "Formédica",

    itens: [
      {
        descricao: "Gestrinona 85mg",

        tipo: "medicacao",

        quantidade: 12,

        valorUnitario: 320,
      },
    ],

    valorTotal: 3840,

    notaFiscal: "NF-2026-012",
  },

  {
    id: 16,

    data: "15/01/2026",

    mes: "01",

    ano: "2026",

    fornecedor: "Essentia",

    itens: [
      {
        descricao: "Tirzepatida 40mg",

        tipo: "medicacao",

        quantidade: 4,

        valorUnitario: 850,
      },

      { descricao: "Frete", tipo: "frete", quantidade: 1, valorUnitario: 180 },
    ],

    valorTotal: 3580,

    notaFiscal: "NF-2026-013",
  },

  {
    id: 17,

    data: "08/01/2026",

    mes: "01",

    ano: "2026",

    fornecedor: "Flukka",

    itens: [
      {
        descricao: "hcg 5.000 ui",

        tipo: "medicacao",

        quantidade: 15,

        valorUnitario: 180,
      },
    ],

    valorTotal: 2700,

    notaFiscal: "NF-2026-014",
  },
];

const meses = [
  { value: "01", label: "Janeiro" },

  { value: "02", label: "Fevereiro" },

  { value: "03", label: "Março" },

  { value: "04", label: "Abril" },

  { value: "05", label: "Maio" },

  { value: "06", label: "Junho" },

  { value: "07", label: "Julho" },

  { value: "08", label: "Agosto" },

  { value: "09", label: "Setembro" },

  { value: "10", label: "Outubro" },

  { value: "11", label: "Novembro" },

  { value: "12", label: "Dezembro" },
];

const anos = ["2025", "2026", "2027"];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

interface TransactionsViewProps {
  suppliers: Supplier[];
  catalogItems: CatalogItem[];
  onAddSupplier: (nome: string) => Supplier | null;
  onAddCatalogItem: (
    nome: string,
    categoria: ItemCategory,
  ) => CatalogItem | null;
}

const categoryLabel: Record<ItemCategory, string> = {
  medicacao: "Medicação",
  insumo: "Insumo",
  taxa_frete: "Taxa/Frete",
};

export function TransactionsView({
  suppliers,
  catalogItems,
  onAddSupplier,
  onAddCatalogItem,
}: TransactionsViewProps) {
  // <-- Verificamos a permissão de escrita
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("transactions:write");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataCompra, setDataCompra] = useState("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [novoFornecedorNome, setNovoFornecedorNome] = useState("");

  // Estados para seleção temporária
  const [mesSelecionado, setMesSelecionado] = useState("04");
  const [anoSelecionado, setAnoSelecionado] = useState("2026");

  // Estado para o filtro aplicado (só atualiza ao clicar no botão)
  const [appliedFilter, setAppliedFilter] = useState({
    mes: "04",
    ano: "2026",
  });

  const [itens, setItens] = useState<ItemNota[]>([
    {
      id: 1,
      catalogItemId: null,
      descricao: "",
      tipo: "medicacao",
      quantidade: 1,
      valorUnitario: 0,
    },
  ]);

  const mesNome =
    meses.find((m) => m.value === appliedFilter.mes)?.label || "Abril";

  // Filtra transações com base no filtro aplicado
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(
      (t) => t.mes === appliedFilter.mes && t.ano === appliedFilter.ano,
    );
  }, [appliedFilter]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const addItem = () => {
    setItens([
      ...itens,
      {
        id: Date.now(),
        catalogItemId: null,
        descricao: "",
        tipo: "medicacao",
        quantidade: 1,
        valorUnitario: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    if (itens.length > 1) {
      setItens(itens.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: number,
    field: keyof ItemNota,
    value: string | number | null,
  ) => {
    setItens(
      itens.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleCatalogItemSelect = (id: number, value: string) => {
    if (value === "new") {
      setItens((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                catalogItemId: "new",
                descricao: "",
                tipo: "medicacao",
              }
            : item,
        ),
      );
      return;
    }

    const selected = catalogItems.find(
      (catalogItem) => String(catalogItem.id) === value,
    );
    if (!selected) return;

    setItens((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              catalogItemId: selected.id,
              descricao: selected.nome,
              tipo: selected.categoria,
            }
          : item,
      ),
    );
  };

  const salvarNovoFornecedor = () => {
    const created = onAddSupplier(novoFornecedorNome);
    if (created) {
      setSupplierId(String(created.id));
      setNovoFornecedorNome("");
    }
  };

  const salvarNovoCatalogo = (id: number) => {
    const item = itens.find((entry) => entry.id === id);
    if (!item || !item.descricao.trim()) return;

    const created = onAddCatalogItem(item.descricao, item.tipo);
    if (!created) return;

    setItens((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, catalogItemId: created.id } : entry,
      ),
    );
  };

  const calcularTotal = () => {
    return itens.reduce(
      (acc, item) => acc + item.quantidade * item.valorUnitario,
      0,
    );
  };

  const handleSave = () => {
    setIsDialogOpen(false);
    setDataCompra("");
    setSupplierId("");
    setNovoFornecedorNome("");
    setItens([
      {
        id: 1,
        catalogItemId: null,
        descricao: "",
        tipo: "medicacao",
        quantidade: 1,
        valorUnitario: 0,
      },
    ]);
  };

  const handleFiltrar = () => {
    setAppliedFilter({ mes: mesSelecionado, ano: anoSelecionado });
    setCurrentPage(1);
  };

  const temFrete = (transaction: Transaction) => {
    return transaction.itens.some((item) => item.tipo === "frete");
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Barra de Filtros */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Lançamentos</h2>
          <p className="text-sm text-slate-500">
            Gerencie as compras e despesas da clínica
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid grid-cols-1 gap-2 sm:flex">
            <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
              <SelectTrigger className="w-full border-slate-200 bg-white text-slate-700 sm:w-36">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {meses.map((mes) => (
                  <SelectItem key={mes.value} value={mes.value}>
                    {mes.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
              <SelectTrigger className="w-full border-slate-200 bg-white text-slate-700 sm:w-28">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {anos.map((ano) => (
                  <SelectItem key={ano} value={ano}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleFiltrar}
            className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto"
          >
            <Filter className="mr-2 size-4" />
            Filtrar
          </Button>

          {/* <-- Escondemos o botão e o modal se o usuário não tiver permissão --> */}
          {canWrite && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 sm:w-auto"
                >
                  <Plus className="mr-2 size-4" />
                  Novo Lançamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-slate-900">
                    Registrar Nova Compra
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Preencha os dados da nota fiscal e adicione os itens
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Linha 1: Data e Fornecedor */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="data" className="text-slate-700">
                        Data da Compra
                      </Label>
                      <Input
                        id="data"
                        type="date"
                        value={dataCompra}
                        onChange={(e) => setDataCompra(e.target.value)}
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fornecedor" className="text-slate-700">
                        Fornecedor
                      </Label>
                      <Select value={supplierId} onValueChange={setSupplierId}>
                        <SelectTrigger className="w-full border-slate-200">
                          <SelectValue placeholder="Selecione o fornecedor" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem
                              key={supplier.id}
                              value={String(supplier.id)}
                            >
                              {supplier.nome}
                            </SelectItem>
                          ))}
                          <SelectItem value="new">
                            + Cadastrar novo fornecedor
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {supplierId === "new" && (
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                          <Input
                            placeholder="Nome do novo fornecedor"
                            value={novoFornecedorNome}
                            onChange={(e) =>
                              setNovoFornecedorNome(e.target.value)
                            }
                            className="border-slate-200"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={salvarNovoFornecedor}
                            className="border-slate-200"
                          >
                            Salvar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Itens da Nota */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-700">Itens da Nota</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addItem}
                        className="border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        <Plus className="mr-1 size-3" />
                        Adicionar Item
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {itens.map((item, index) => (
                        <Card
                          key={item.id}
                          className="border-slate-200 bg-slate-50"
                        >
                          <CardContent className="p-4">
                            <div className="grid gap-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600">
                                  Item {index + 1}
                                </span>
                                {itens.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeItem(item.id)}
                                    className="size-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <Select
                                  value={
                                    item.catalogItemId
                                      ? String(item.catalogItemId)
                                      : ""
                                  }
                                  onValueChange={(value) =>
                                    handleCatalogItemSelect(item.id, value)
                                  }
                                >
                                  <SelectTrigger className="border-slate-200 bg-white">
                                    <SelectValue placeholder="Selecione item/insumo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {catalogItems.map((catalogItem) => (
                                      <SelectItem
                                        key={catalogItem.id}
                                        value={String(catalogItem.id)}
                                      >
                                        {catalogItem.nome}
                                      </SelectItem>
                                    ))}
                                    <SelectItem value="new">
                                      + Cadastrar novo item
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {item.catalogItemId === "new" ? (
                                  <Input
                                    placeholder="Nome do novo item"
                                    value={item.descricao}
                                    onChange={(e) =>
                                      updateItem(
                                        item.id,
                                        "descricao",
                                        e.target.value,
                                      )
                                    }
                                    className="border-slate-200 bg-white"
                                  />
                                ) : (
                                  <Input
                                    placeholder="Descrição do produto"
                                    value={item.descricao}
                                    onChange={(e) =>
                                      updateItem(
                                        item.id,
                                        "descricao",
                                        e.target.value,
                                      )
                                    }
                                    className="border-slate-200 bg-white"
                                  />
                                )}
                              </div>
                              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                <Select
                                  value={item.tipo}
                                  onValueChange={(value: ItemCategory) =>
                                    updateItem(item.id, "tipo", value)
                                  }
                                >
                                  <SelectTrigger className="border-slate-200 bg-white">
                                    <SelectValue placeholder="Categoria" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="medicacao">
                                      Medicação
                                    </SelectItem>
                                    <SelectItem value="insumo">
                                      Insumo
                                    </SelectItem>
                                    <SelectItem value="taxa_frete">
                                      Taxa/Frete
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {item.catalogItemId === "new" && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => salvarNovoCatalogo(item.id)}
                                    className="border-slate-200"
                                  >
                                    Salvar no cadastro
                                  </Button>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                Categoria: {categoryLabel[item.tipo]}
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label className="text-xs text-slate-500">
                                    Quantidade
                                  </Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.quantidade}
                                    onChange={(e) =>
                                      updateItem(
                                        item.id,
                                        "quantidade",
                                        parseInt(e.target.value) || 0,
                                      )
                                    }
                                    className="border-slate-200 bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-slate-500">
                                    Valor Unitário
                                  </Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.valorUnitario}
                                    onChange={(e) =>
                                      updateItem(
                                        item.id,
                                        "valorUnitario",
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    className="border-slate-200 bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-center sm:text-left">
                    <span className="text-sm text-slate-500">
                      Valor Total:{" "}
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      {formatCurrency(calcularTotal())}
                    </span>
                  </div>
                  <Button
                    onClick={handleSave}
                    className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto"
                  >
                    Salvar Lançamento
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Tabela de Transações */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Histórico de Lançamentos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Exibindo registros de {mesNome}/{appliedFilter.ano}
          </p>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-600">Data</TableHead>
                  <TableHead className="text-slate-600">Nota Fiscal</TableHead>
                  <TableHead className="text-slate-600">Fornecedor</TableHead>
                  <TableHead className="text-slate-600">Itens</TableHead>
                  <TableHead className="text-slate-600">Status</TableHead>
                  <TableHead className="text-right text-slate-600">
                    Valor Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="border-slate-100">
                      <TableCell className="text-slate-900">
                        {transaction.data}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-600">
                        {transaction.notaFiscal}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50 text-slate-700"
                        >
                          {transaction.fornecedor}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {transaction.itens.length}
                      </TableCell>
                      <TableCell>
                        {temFrete(transaction) ? (
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                            Com Frete
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100">
                            Sem Frete
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">
                        {formatCurrency(transaction.valorTotal)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <PackageX className="mb-3 size-12" />
                        <p className="text-sm font-medium">
                          Nenhum lançamento encontrado para este período
                        </p>
                        <p className="text-xs">
                          Tente selecionar outro mês ou ano
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {filteredTransactions.length > 0 && (
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredTransactions.length,
                )}{" "}
                de {filteredTransactions.length} registros
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-200"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="border-slate-200"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
