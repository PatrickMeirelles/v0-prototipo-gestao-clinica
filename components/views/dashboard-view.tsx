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
import { Input } from "@/components/ui/input";
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
  Search,
  Users,
  Ticket,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

// ========== MOCK DATA: Transações e Atendimentos ==========
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

interface Atendimento {
  id: number;
  data: string;
  mes: string;
  ano: string;
  paciente: string;
  valor: number;
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
    ],
    valorTotal: 11060,
    notaFiscal: "NF-2026-021",
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
    ],
    valorTotal: 5100,
    notaFiscal: "NF-2026-011",
  },
];

const mockAtendimentos: Atendimento[] = [
  {
    id: 1,
    data: "05/04/2026",
    mes: "04",
    ano: "2026",
    paciente: "Ana Paula",
    valor: 500,
  },
  {
    id: 2,
    data: "10/04/2026",
    mes: "04",
    ano: "2026",
    paciente: "Carlos Eduardo",
    valor: 450,
  },
  {
    id: 3,
    data: "15/04/2026",
    mes: "04",
    ano: "2026",
    paciente: "Ana Paula",
    valor: 300,
  },
  {
    id: 4,
    data: "20/04/2026",
    mes: "04",
    ano: "2026",
    paciente: "Fernanda Costa",
    valor: 600,
  },
  {
    id: 5,
    data: "02/03/2026",
    mes: "03",
    ano: "2026",
    paciente: "Roberto Alves",
    valor: 400,
  },
  {
    id: 6,
    data: "12/03/2026",
    mes: "03",
    ano: "2026",
    paciente: "Ana Paula",
    valor: 500,
  },
  {
    id: 7,
    data: "25/03/2026",
    mes: "03",
    ano: "2026",
    paciente: "Julia Santos",
    valor: 450,
  },
  {
    id: 8,
    data: "10/02/2026",
    mes: "02",
    ano: "2026",
    paciente: "Carlos Eduardo",
    valor: 450,
  },
  {
    id: 9,
    data: "18/02/2026",
    mes: "02",
    ano: "2026",
    paciente: "Marcos Lima",
    valor: 350,
  },
  {
    id: 10,
    data: "05/01/2026",
    mes: "01",
    ano: "2026",
    paciente: "Fernanda Costa",
    valor: 600,
  },
  {
    id: 11,
    data: "20/01/2026",
    mes: "01",
    ano: "2026",
    paciente: "Ana Paula",
    valor: 500,
  },
  {
    id: 12,
    data: "15/05/2026",
    mes: "05",
    ano: "2026",
    paciente: "Julia Santos",
    valor: 450,
  },
  {
    id: 13,
    data: "22/05/2026",
    mes: "05",
    ano: "2026",
    paciente: "Ana Paula",
    valor: 500,
  },
];

const meses = [
  { value: "todos", label: "Ano Todo" },
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

  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");

  // Estados para seleção temporária
  const [mesSelecionado, setMesSelecionado] = useState(currentMonth);
  const [anoSelecionado, setAnoSelecionado] = useState(currentYear);
  const [tableSearch, setTableSearch] = useState("");

  // Estado para o filtro aplicado
  const [appliedFilter, setAppliedFilter] = useState({
    mes: currentMonth,
    ano: currentYear,
  });

  const mesNome = meses.find((m) => m.value === appliedFilter.mes)?.label;
  const labelPeriodo =
    appliedFilter.mes === "todos"
      ? appliedFilter.ano
      : `${mesNome}/${appliedFilter.ano}`;

  // ================= FILTROS DE DADOS ================= //
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((t) => {
      const matchAno = t.ano === appliedFilter.ano;
      const matchMes =
        appliedFilter.mes === "todos" ? true : t.mes === appliedFilter.mes;
      return matchAno && matchMes;
    });
  }, [appliedFilter]);

  const filteredAtendimentos = useMemo(() => {
    return mockAtendimentos.filter((a) => {
      const matchAno = a.ano === appliedFilter.ano;
      const matchMes =
        appliedFilter.mes === "todos" ? true : a.mes === appliedFilter.mes;
      return matchAno && matchMes;
    });
  }, [appliedFilter]);

  // ================= CÁLCULOS DESPESAS ================= //
  const gastoTotal = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + t.valorTotal, 0);
  }, [filteredTransactions]);

  const maiorFornecedor = useMemo(() => {
    if (filteredTransactions.length === 0) return { nome: "-", percentual: 0 };
    const gastosPorFornecedor: Record<string, number> = {};
    filteredTransactions.forEach((t) => {
      gastosPorFornecedor[t.fornecedor] =
        (gastosPorFornecedor[t.fornecedor] || 0) + t.valorTotal;
    });
    let maior = { nome: "", valor: 0 };
    Object.entries(gastosPorFornecedor).forEach(([nome, valor]) => {
      if (valor > maior.valor) maior = { nome, valor };
    });
    const percentual =
      gastoTotal > 0 ? Math.round((maior.valor / gastoTotal) * 100) : 0;
    return { nome: maior.nome, percentual };
  }, [filteredTransactions, gastoTotal]);

  const variacao = useMemo(() => {
    let gastoAnterior = 0;
    if (appliedFilter.mes === "todos") {
      const anoAnterior = String(parseInt(appliedFilter.ano) - 1);
      const transacoesAnterior = mockTransactions.filter(
        (t) => t.ano === anoAnterior,
      );
      gastoAnterior = transacoesAnterior.reduce(
        (acc, t) => acc + t.valorTotal,
        0,
      );
    } else {
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
      gastoAnterior = transacoesAnterior.reduce(
        (acc, t) => acc + t.valorTotal,
        0,
      );
    }
    if (gastoAnterior === 0) return 0;
    return Math.round(((gastoTotal - gastoAnterior) / gastoAnterior) * 100);
  }, [appliedFilter, gastoTotal]);

  // ================= CÁLCULOS ATENDIMENTOS (NOVOS) ================= //
  const topPaciente = useMemo(() => {
    if (filteredAtendimentos.length === 0) return { nome: "-", count: 0 };
    const contagem: Record<string, number> = {};
    filteredAtendimentos.forEach((a) => {
      contagem[a.paciente] = (contagem[a.paciente] || 0) + 1;
    });
    let top = { nome: "-", count: 0 };
    Object.entries(contagem).forEach(([nome, count]) => {
      if (count > top.count) top = { nome, count };
    });
    return top;
  }, [filteredAtendimentos]);

  const ticketMedio = useMemo(() => {
    if (filteredAtendimentos.length === 0) return 0;
    const totalReceita = filteredAtendimentos.reduce(
      (acc, a) => acc + a.valor,
      0,
    );
    return totalReceita / filteredAtendimentos.length;
  }, [filteredAtendimentos]);

  // ================= DADOS GRÁFICOS ================= //
  const categoryData = useMemo(() => {
    let totalMedicacao = 0;
    let totalFrete = 0;
    filteredTransactions.forEach((t) => {
      t.itens.forEach((item) => {
        const valorItem = item.quantidade * item.valorUnitario;
        if (item.tipo === "medicacao") totalMedicacao += valorItem;
        else totalFrete += valorItem;
      });
    });
    const data = [
      { name: "Medicações", valor: totalMedicacao, color: "#0d9488" },
      { name: "Fretes", valor: totalFrete, color: "#f97316" },
    ];
    return data.filter((d) => d.valor > 0);
  }, [filteredTransactions]);

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

    if (appliedFilter.mes === "todos") {
      for (let i = 1; i <= 12; i++) {
        const mesStr = String(i).padStart(2, "0");
        const valorMes = filteredTransactions
          .filter((t) => t.mes === mesStr)
          .reduce((acc, t) => acc + t.valorTotal, 0);
        if (valorMes > 0)
          data.push({ month: nomesAbreviados[i - 1], valor: valorMes });
      }
    } else {
      for (let i = 5; i >= 0; i--) {
        let mesNum = parseInt(appliedFilter.mes) - i;
        let anoNum = parseInt(appliedFilter.ano);
        while (mesNum <= 0) {
          mesNum += 12;
          anoNum -= 1;
        }
        const mesStr = String(mesNum).padStart(2, "0");
        const anoStr = String(anoNum);
        const valorMes = mockTransactions
          .filter((t) => t.mes === mesStr && t.ano === anoStr)
          .reduce((acc, t) => acc + t.valorTotal, 0);

        if (valorMes > 0 || i === 0) {
          data.push({ month: nomesAbreviados[mesNum - 1], valor: valorMes });
        }
      }
    }
    return data;
  }, [appliedFilter, filteredTransactions]);

  const atendimentosAnoData = useMemo(() => {
    const data: { month: string; atendimentos: number }[] = [];
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

    // Este gráfico sempre mostra o ano todo, independente do mês filtrado
    for (let i = 1; i <= 12; i++) {
      const mesStr = String(i).padStart(2, "0");
      const atendimentosMes = mockAtendimentos.filter(
        (a) => a.ano === appliedFilter.ano && a.mes === mesStr,
      ).length;

      data.push({
        month: nomesAbreviados[i - 1],
        atendimentos: atendimentosMes,
      });
    }
    return data;
  }, [appliedFilter.ano]);

  // ================= TABELA ================= //
  const tableTransactions = useMemo(() => {
    if (!tableSearch) return filteredTransactions;
    const lower = tableSearch.toLowerCase();
    return filteredTransactions.filter((t) => {
      return (
        t.fornecedor.toLowerCase().includes(lower) ||
        t.valorTotal.toString().includes(lower) ||
        t.itens.some(
          (item) =>
            item.descricao.toLowerCase().includes(lower) ||
            item.tipo.toLowerCase().includes(lower),
        )
      );
    });
  }, [filteredTransactions, tableSearch]);

  const handleFiltrar = () => {
    setAppliedFilter({ mes: mesSelecionado, ano: anoSelecionado });
  };

  const hasData = filteredTransactions.length > 0;

  return (
    <div className="min-w-0 space-y-6 pb-12">
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

      {/* Cards Superiores (Despesas) */}
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
                {variacao}% em relação ao período anterior
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Referente a {labelPeriodo}
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
              Referente a {labelPeriodo}
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
              Referente a {labelPeriodo}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Despesas */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Histórico de Despesas
            </CardTitle>
            <CardDescription className="text-slate-500">
              {appliedFilter.mes === "todos"
                ? `Meses com lançamento em ${appliedFilter.ano}`
                : `Últimos meses (até ${labelPeriodo})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "h-64" : "h-[300px]"}>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Valor",
                      ]}
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="valor"
                      fill="#0d9488"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
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

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Gasto por Categoria
            </CardTitle>
            <CardDescription className="text-slate-500">
              Medicações vs Fretes em {labelPeriodo}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "h-64" : "h-[300px]"}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#64748b"
                      fontSize={13}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Valor Gasto",
                      ]}
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="valor" radius={[0, 4, 4, 0]} barSize={35}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
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

      {/* Cards Novos (Atendimentos e Pacientes) */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Paciente Mais Atendido
            </CardTitle>
            <Users className="size-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {filteredAtendimentos.length > 0 ? topPaciente.nome : "-"}
            </div>
            {filteredAtendimentos.length > 0 && (
              <p className="text-xs text-slate-500">
                {topPaciente.count}{" "}
                {topPaciente.count === 1 ? "atendimento" : "atendimentos"}{" "}
                registrados
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Referente a {labelPeriodo}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Ticket Médio da Clínica
            </CardTitle>
            <Ticket className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {filteredAtendimentos.length > 0
                ? formatCurrency(ticketMedio)
                : "R$ 0,00"}
            </div>
            {filteredAtendimentos.length > 0 && (
              <p className="text-xs text-slate-500">
                Média por atendimento realizado
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Referente a {labelPeriodo}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Novo Gráfico: Atendimentos ao longo do ano */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Atendimentos ao Longo do Ano
          </CardTitle>
          <CardDescription className="text-slate-500">
            Quantidade de pacientes atendidos por mês em {appliedFilter.ano}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={isMobile ? "h-64" : "h-[300px]"}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={atendimentosAnoData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [value, "Atendimentos"]}
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="atendimentos"
                  fill="#0d9488"
                  radius={[4, 4, 0, 0]}
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transações Recentes */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Transações Recentes
            </CardTitle>
            <CardDescription className="text-slate-500">
              Lançamentos de {labelPeriodo}
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 size-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por categoria, fornecedor ou valor..."
              className="w-full pl-9 bg-slate-50"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>
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
                {tableTransactions.length > 0 ? (
                  tableTransactions.slice(0, 15).map((transaction) => (
                    <TableRow key={transaction.id} className="border-slate-100">
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <PackageX className="mb-2 size-8" />
                        <p className="text-sm">
                          Nenhum lançamento encontrado para esta busca
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
