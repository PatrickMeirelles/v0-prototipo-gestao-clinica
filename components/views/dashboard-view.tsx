"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { TrendingUp, Building2, FileText } from "lucide-react"
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

const monthlyData = [
  { month: "Jan", valor: 45000 },
  { month: "Fev", valor: 52000 },
  { month: "Mar", valor: 48000 },
  { month: "Abr", valor: 61000 },
  { month: "Mai", valor: 55000 },
  { month: "Jun", valor: 87878 },
]

const categoryData = [
  { name: "Medicação", value: 85, color: "#0d9488" },
  { name: "Insumos", value: 10, color: "#64748b" },
  { name: "Fretes/Taxas", value: 5, color: "#f97316" },
]

const recentTransactions = [
  { id: 1, data: "28/04/2026", fornecedor: "BIOS", itens: 12, valor: 15450.00 },
  { id: 2, data: "26/04/2026", fornecedor: "Flukka", itens: 8, valor: 8200.00 },
  { id: 3, data: "24/04/2026", fornecedor: "Essentia", itens: 5, valor: 4350.00 },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Cards Superiores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Despesa Total (Mês)
            </CardTitle>
            <TrendingUp className="size-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">R$ 87.878,20</div>
            <p className="text-xs text-emerald-600">+12% em relação ao mês passado</p>
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
            <div className="text-2xl font-bold text-slate-900">Formédica</div>
            <p className="text-xs text-slate-500">Responsável por 60% dos gastos</p>
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
            <div className="text-2xl font-bold text-slate-900">45</div>
            <p className="text-xs text-slate-500">Lançamentos este mês</p>
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
              Últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
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
              Distribuição de gastos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
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
            Últimos lançamentos registrados
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
              {recentTransactions.map((transaction) => (
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
