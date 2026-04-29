"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  TrendingUp,
  TrendingDown,
  Building2,
  FileText,
  Filter,
  PackageX,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

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

export function DashboardView() {
  const isMobile = useIsMobile();

  // Estados para seleção temporária
  const [mesSelecionado, setMesSelecionado] = useState("04");
  const [anoSelecionado, setAnoSelecionado] = useState("2026");

  // Estado para o filtro aplicado (só atualiza ao clicar no botão)
  const [appliedFilter, setAppliedFilter] = useState({
    mes: "04",
    ano: "2026",
  });

  const mesNome =
    meses.find((m) => m.value === appliedFilter.mes)?.label || "Abril";

  // Filtra transações com base no filtro aplicado
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(
      (t) => t.mes === appliedFilter.mes && t.ano === appliedFilter.ano,
    );
  }, [appliedFilter]);

  // Cálculo do gasto total
  const gastoTotal = useMemo(() => {
    return filteredTransactions.reduce(
      (acc: any, t: { valorTotal: any }) => acc + t.valorTotal,
      0,
    );
  }, [filteredTransactions]);

  // Cálculo do maior fornecedor
  const maiorFornecedor = useMemo(() => {
    if (filteredTransactions.length === 0) return { nome: "-", percentual: 0 };

    const gastosPorFornecedor: Record<string, number> = {};
    filteredTransactions.forEach(
      (t: { fornecedor: string | number; valorTotal: number }) => {
        gastosPorFornecedor[t.fornecedor] =
          (gastosPorFornecedor[t.fornecedor] || 0) + t.valorTotal;
      },
    );

    let maior = { nome: "", valor: 0 };
    Object.entries(gastosPorFornecedor).forEach(([nome, valor]) => {
      if (valor > maior.valor) {
        maior = { nome, valor };
      }
    });

    const percentual =
      gastoTotal > 0 ? Math.round((maior.valor / gastoTotal) * 100) : 0;
    return { nome: maior.nome, percentual };
  }, [filteredTransactions, gastoTotal]);

  // Cálculo da variação em relação ao mês anterior
  const variacao = useMemo(() => {
    const mesAnterior =
      appliedFilter.mes === "01"
        ? "12"
        : String(parseInt(appliedFilter.mes) - 1).padStart(2, "0");
    const anoAnterior =
      appliedFilter.mes === "01"
        ? String(parseInt(appliedFilter.ano) - 1)
        : appliedFilter.ano;

    const transacoesAnterior = mockTransactions.filter(
      (t) => t.mes === mesAnterior && t.ano === anoAnterior,
    );
    const gastoAnterior = transacoesAnterior.reduce(
      (acc, t) => acc + t.valorTotal,
      0,
    );

    if (gastoAnterior === 0) return 0;
    return Math.round(((gastoTotal - gastoAnterior) / gastoAnterior) * 100);
  }, [appliedFilter, gastoTotal]);

  // Dados para o gráfico de pizza (medicações vs fretes)
  const categoryData = useMemo(() => {
    let totalMedicacao = 0;
    let totalFrete = 0;

    filteredTransactions.forEach((t: { itens: any[] }) => {
      t.itens.forEach(
        (item: { quantidade: number; valorUnitario: number; tipo: string }) => {
          const valorItem = item.quantidade * item.valorUnitario;
          if (item.tipo === "medicacao") {
            totalMedicacao += valorItem;
          } else {
            totalFrete += valorItem;
          }
        },
      );
    });

    const total = totalMedicacao + totalFrete;
    if (total === 0) return [];

    return [
      {
        name: "Medicações",
        value: Math.round((totalMedicacao / total) * 100),
        color: "#0d9488",
      },
      {
        name: "Fretes",
        value: Math.round((totalFrete / total) * 100),
        color: "#f97316",
      },
    ];
  }, [filteredTransactions]);

  // Dados para o gráfico de barras (últimos 6 meses)
  const monthlyData = useMemo(() => {
    const data: { month: string; valor: number }[] = [];
    const nomesAbreviados = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    for (let i = 5; i >= 0; i--) {
      let mesNum = parseInt(appliedFilter.mes) - i;
      let anoNum = parseInt(appliedFilter.ano);

      while (mesNum <= 0) {
        mesNum += 12;
        anoNum -= 1;
      }

      const mesStr = String(mesNum).padStart(2, "0");
      const anoStr = String(anoNum);

      const transacoesMes = mockTransactions.filter(
        (t) => t.mes === mesStr && t.ano === anoStr,
      );
      const valorMes = transacoesMes.reduce((acc, t) => acc + t.valorTotal, 0);

      data.push({
        month: nomesAbreviados[mesNum - 1],
        valor: valorMes,
      });
    }

    return data;
  }, [appliedFilter]);

  const handleFiltrar = () => {
    setAppliedFilter({ mes: mesSelecionado, ano: anoSelecionado });
  };

  const hasData = filteredTransactions.length > 0;

  return (
    <div className="min-w-0 space-y-6">
      {/* Barra de Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Visão Geral</h2>

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
        </div>
      </div>

      {/* Cards Superiores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Gasto Total
            </CardTitle>
            {variacao >= 0 ? (
              <TrendingUp className="size-4 text-emerald-500" />
            ) : (
              <TrendingDown className="size-4 text-rose-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {hasData ? formatCurrency(gastoTotal) : "R$ 0,00"}
            </div>
            {hasData && variacao !== 0 && (
              <p
                className={`text-xs ${variacao >= 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {variacao >= 0 ? "+" : ""}
                {variacao}% em relação ao mês anterior
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Referente a {mesNome}/{appliedFilter.ano}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Maior Fornecedor
            </CardTitle>
            <Building2 className="size-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {hasData ? maiorFornecedor.nome : "-"}
            </div>
            {hasData && (
              <p className="text-xs text-slate-500">
                Responsável por {maiorFornecedor.percentual}% dos gastos
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Referente a {mesNome}/{appliedFilter.ano}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total de Transações
            </CardTitle>
            <FileText className="size-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {filteredTransactions.length}
            </div>
            <p className="text-xs text-slate-500">Lançamentos registrados</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Referente a {mesNome}/{appliedFilter.ano}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Gráfico de Barras */}
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Histórico de Despesas
            </CardTitle>
            <CardDescription className="text-slate-500">
              Últimos 6 meses (até {mesNome}/{appliedFilter.ano})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "h-64" : "h-[300px]"}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value: number) =>
                      `${(value / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Valor",
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="valor" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza */}
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Divisão por Categoria
            </CardTitle>
            <CardDescription className="text-slate-500">
              Medicações vs Fretes em {mesNome}/{appliedFilter.ano}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "h-64" : "h-[300px]"}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 40 : 60}
                      outerRadius={isMobile ? 72 : 100}
                      paddingAngle={5}
                      dataKey="value"
                      label={
                        isMobile ? undefined : ({ name, value }) => `${name}: ${value}%`
                      }
                      labelLine={false}
                    >
                      {categoryData.map((entry: { color: any }, index: any) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Percentual"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={isMobile ? 24 : 36}
                      formatter={(value: any) => (
                        <span className="text-slate-600">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                  <PackageX className="mb-2 size-12" />
                  <p className="text-sm">Sem dados para este período</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Transações Recentes */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Transações Recentes
          </CardTitle>
          <CardDescription className="text-slate-500">
            Lançamentos de {mesNome}/{appliedFilter.ano}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-600">Data</TableHead>
                  <TableHead className="text-slate-600">Fornecedor</TableHead>
                  <TableHead className="text-slate-600">Qtd Itens</TableHead>
                  <TableHead className="text-right text-slate-600">
                    Valor Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions
                    .slice(0, 5)
                    .map(
                      (transaction: {
                        id: any;
                        data: any;
                        fornecedor: any;
                        itens: string | any[];
                        valorTotal: number;
                      }) => (
                        <TableRow
                          key={transaction.id}
                          className="border-slate-100"
                        >
                          <TableCell className="text-slate-900">
                            {transaction.data}
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
                          <TableCell className="text-right font-medium text-emerald-600">
                            {formatCurrency(transaction.valorTotal)}
                          </TableCell>
                        </TableRow>
                      ),
                    )
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <PackageX className="mb-2 size-8" />
                        <p className="text-sm">
                          Nenhum lançamento encontrado para este período
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
