"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { TrendingUp, TrendingDown, Building2, FileText, Filter } from "lucide-react"
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
  Legend
} from "recharts"

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
]

const anos = ["2025", "2026", "2027"]

// Dados simulados por período
const dadosPorPeriodo: Record<string, {
  despesaTotal: number
  variacao: number
  maiorFornecedor: string
  percentualFornecedor: number
  totalLancamentos: number
  monthlyData: { month: string; valor: number }[]
  categoryData: { name: string; value: number; color: string }[]
  recentTransactions: { id: number; data: string; fornecedor: string; itens: number; valor: number }[]
}> = {
  "04-2026": {
    despesaTotal: 87878.20,
    variacao: 12,
    maiorFornecedor: "Formédica",
    percentualFornecedor: 60,
    totalLancamentos: 45,
    monthlyData: [
      { month: "Nov", valor: 45000 },
      { month: "Dez", valor: 52000 },
      { month: "Jan", valor: 48000 },
      { month: "Fev", valor: 61000 },
      { month: "Mar", valor: 55000 },
      { month: "Abr", valor: 87878 },
    ],
    categoryData: [
      { name: "Medicação", value: 85, color: "#0d9488" },
      { name: "Insumos", value: 10, color: "#64748b" },
      { name: "Fretes/Taxas", value: 5, color: "#f97316" },
    ],
    recentTransactions: [
      { id: 1, data: "28/04/2026", fornecedor: "BIOS", itens: 12, valor: 15450.00 },
      { id: 2, data: "26/04/2026", fornecedor: "Flukka", itens: 8, valor: 8200.00 },
      { id: 3, data: "24/04/2026", fornecedor: "Essentia", itens: 5, valor: 4350.00 },
    ],
  },
  "03-2026": {
    despesaTotal: 55000.00,
    variacao: -8,
    maiorFornecedor: "BIOS",
    percentualFornecedor: 45,
    totalLancamentos: 38,
    monthlyData: [
      { month: "Out", valor: 42000 },
      { month: "Nov", valor: 45000 },
      { month: "Dez", valor: 52000 },
      { month: "Jan", valor: 48000 },
      { month: "Fev", valor: 61000 },
      { month: "Mar", valor: 55000 },
    ],
    categoryData: [
      { name: "Medicação", value: 70, color: "#0d9488" },
      { name: "Insumos", value: 20, color: "#64748b" },
      { name: "Fretes/Taxas", value: 10, color: "#f97316" },
    ],
    recentTransactions: [
      { id: 1, data: "30/03/2026", fornecedor: "BIOS", itens: 10, valor: 12300.00 },
      { id: 2, data: "25/03/2026", fornecedor: "Formédica", itens: 6, valor: 9800.00 },
      { id: 3, data: "20/03/2026", fornecedor: "Essentia", itens: 4, valor: 3200.00 },
    ],
  },
  "02-2026": {
    despesaTotal: 61000.00,
    variacao: 27,
    maiorFornecedor: "Formédica",
    percentualFornecedor: 55,
    totalLancamentos: 42,
    monthlyData: [
      { month: "Set", valor: 38000 },
      { month: "Out", valor: 42000 },
      { month: "Nov", valor: 45000 },
      { month: "Dez", valor: 52000 },
      { month: "Jan", valor: 48000 },
      { month: "Fev", valor: 61000 },
    ],
    categoryData: [
      { name: "Medicação", value: 75, color: "#0d9488" },
      { name: "Insumos", value: 15, color: "#64748b" },
      { name: "Fretes/Taxas", value: 10, color: "#f97316" },
    ],
    recentTransactions: [
      { id: 1, data: "28/02/2026", fornecedor: "Formédica", itens: 15, valor: 18500.00 },
      { id: 2, data: "22/02/2026", fornecedor: "BIOS", itens: 7, valor: 7200.00 },
      { id: 3, data: "15/02/2026", fornecedor: "Flukka", itens: 9, valor: 5800.00 },
    ],
  },
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function DashboardView() {
  const [mesSelecionado, setMesSelecionado] = useState("04")
  const [anoSelecionado, setAnoSelecionado] = useState("2026")

  const periodoAtual = `${mesSelecionado}-${anoSelecionado}`
  const mesNome = meses.find(m => m.value === mesSelecionado)?.label || "Abril"

  const dados = useMemo(() => {
    return dadosPorPeriodo[periodoAtual] || dadosPorPeriodo["04-2026"]
  }, [periodoAtual])

  const handleFiltrar = () => {
    // O filtro já é reativo via useMemo, mas o botão pode ser usado para feedback visual
  }

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Visão Geral</h2>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
              <SelectTrigger className="w-[130px] border-slate-200 bg-white text-slate-700">
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
              <SelectTrigger className="w-[100px] border-slate-200 bg-white text-slate-700">
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
            variant="outline" 
            onClick={handleFiltrar}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
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
              Despesa Total (Mês)
            </CardTitle>
            {dados.variacao >= 0 ? (
              <TrendingUp className="size-4 text-emerald-500" />
            ) : (
              <TrendingDown className="size-4 text-rose-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(dados.despesaTotal)}
            </div>
            <p className={`text-xs ${dados.variacao >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {dados.variacao >= 0 ? "+" : ""}{dados.variacao}% em relação ao mês passado
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Referente a {mesNome}/{anoSelecionado}
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
            <div className="text-2xl font-bold text-slate-900">{dados.maiorFornecedor}</div>
            <p className="text-xs text-slate-500">
              Responsável por {dados.percentualFornecedor}% dos gastos
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Referente a {mesNome}/{anoSelecionado}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total de Lançamentos
            </CardTitle>
            <FileText className="size-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{dados.totalLancamentos}</div>
            <p className="text-xs text-slate-500">Lançamentos este mês</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Referente a {mesNome}/{anoSelecionado}
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
              Últimos 6 meses (até {mesNome}/{anoSelecionado})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados.monthlyData}>
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
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), "Valor"]}
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
                  />
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
              Distribuição de gastos em {mesNome}/{anoSelecionado}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dados.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {dados.categoryData.map((entry, index) => (
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
                    height={36}
                    formatter={(value) => <span className="text-slate-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
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
            Últimos lançamentos de {mesNome}/{anoSelecionado}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="text-slate-600">Data</TableHead>
                <TableHead className="text-slate-600">Fornecedor</TableHead>
                <TableHead className="text-slate-600">Qtd de Itens</TableHead>
                <TableHead className="text-right text-slate-600">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.recentTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-slate-100">
                  <TableCell className="text-slate-900">{transaction.data}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                      {transaction.fornecedor}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{transaction.itens}</TableCell>
                  <TableCell className="text-right font-medium text-emerald-600">
                    {formatCurrency(transaction.valor)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
