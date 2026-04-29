"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash2, ChevronLeft, ChevronRight, Filter } from "lucide-react"

interface ItemNota {
  id: number
  descricao: string
  tipo: string
  quantidade: number
  valorUnitario: number
}

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
const transacoesPorPeriodo: Record<string, {
  id: number
  data: string
  fornecedor: string
  itens: number
  valorTotal: number
  temFrete: boolean
  notaFiscal: string
}[]> = {
  "04-2026": [
    { id: 1, data: "28/04/2026", fornecedor: "Formédica", itens: 15, valorTotal: 25450.00, temFrete: true, notaFiscal: "NF-2026-041" },
    { id: 2, data: "27/04/2026", fornecedor: "BIOS", itens: 12, valorTotal: 15450.00, temFrete: false, notaFiscal: "NF-2026-042" },
    { id: 3, data: "26/04/2026", fornecedor: "Flukka", itens: 8, valorTotal: 8200.00, temFrete: true, notaFiscal: "NF-2026-043" },
    { id: 4, data: "25/04/2026", fornecedor: "Essentia", itens: 5, valorTotal: 4350.00, temFrete: false, notaFiscal: "NF-2026-044" },
    { id: 5, data: "24/04/2026", fornecedor: "Formédica", itens: 20, valorTotal: 32100.00, temFrete: true, notaFiscal: "NF-2026-045" },
    { id: 6, data: "23/04/2026", fornecedor: "BIOS", itens: 6, valorTotal: 7800.00, temFrete: false, notaFiscal: "NF-2026-046" },
  ],
  "03-2026": [
    { id: 1, data: "30/03/2026", fornecedor: "BIOS", itens: 10, valorTotal: 12300.00, temFrete: true, notaFiscal: "NF-2026-031" },
    { id: 2, data: "28/03/2026", fornecedor: "Formédica", itens: 18, valorTotal: 22100.00, temFrete: false, notaFiscal: "NF-2026-032" },
    { id: 3, data: "25/03/2026", fornecedor: "Essentia", itens: 6, valorTotal: 5800.00, temFrete: true, notaFiscal: "NF-2026-033" },
    { id: 4, data: "20/03/2026", fornecedor: "Flukka", itens: 4, valorTotal: 3200.00, temFrete: false, notaFiscal: "NF-2026-034" },
    { id: 5, data: "15/03/2026", fornecedor: "Formédica", itens: 12, valorTotal: 14500.00, temFrete: true, notaFiscal: "NF-2026-035" },
  ],
  "02-2026": [
    { id: 1, data: "28/02/2026", fornecedor: "Formédica", itens: 15, valorTotal: 18500.00, temFrete: true, notaFiscal: "NF-2026-021" },
    { id: 2, data: "25/02/2026", fornecedor: "BIOS", itens: 7, valorTotal: 7200.00, temFrete: false, notaFiscal: "NF-2026-022" },
    { id: 3, data: "22/02/2026", fornecedor: "Flukka", itens: 9, valorTotal: 5800.00, temFrete: true, notaFiscal: "NF-2026-023" },
    { id: 4, data: "18/02/2026", fornecedor: "Essentia", itens: 11, valorTotal: 9200.00, temFrete: false, notaFiscal: "NF-2026-024" },
    { id: 5, data: "12/02/2026", fornecedor: "BIOS", itens: 8, valorTotal: 6500.00, temFrete: true, notaFiscal: "NF-2026-025" },
    { id: 6, data: "08/02/2026", fornecedor: "Formédica", itens: 14, valorTotal: 16800.00, temFrete: false, notaFiscal: "NF-2026-026" },
    { id: 7, data: "03/02/2026", fornecedor: "Flukka", itens: 5, valorTotal: 4100.00, temFrete: true, notaFiscal: "NF-2026-027" },
  ],
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function TransactionsView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [dataCompra, setDataCompra] = useState("")
  const [fornecedor, setFornecedor] = useState("")
  const [mesSelecionado, setMesSelecionado] = useState("04")
  const [anoSelecionado, setAnoSelecionado] = useState("2026")
  const [itens, setItens] = useState<ItemNota[]>([
    { id: 1, descricao: "", tipo: "", quantidade: 1, valorUnitario: 0 }
  ])

  const periodoAtual = `${mesSelecionado}-${anoSelecionado}`
  const mesNome = meses.find(m => m.value === mesSelecionado)?.label || "Abril"

  const transacoesFiltradas = useMemo(() => {
    return transacoesPorPeriodo[periodoAtual] || transacoesPorPeriodo["04-2026"]
  }, [periodoAtual])

  const itemsPerPage = 5
  const totalPages = Math.ceil(transacoesFiltradas.length / itemsPerPage)
  const paginatedTransactions = transacoesFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page when filter changes
  useMemo(() => {
    setCurrentPage(1)
  }, [periodoAtual])

  const addItem = () => {
    setItens([
      ...itens,
      { id: Date.now(), descricao: "", tipo: "", quantidade: 1, valorUnitario: 0 }
    ])
  }

  const removeItem = (id: number) => {
    if (itens.length > 1) {
      setItens(itens.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: number, field: keyof ItemNota, value: string | number) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const calcularTotal = () => {
    return itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0)
  }

  const handleSave = () => {
    setIsDialogOpen(false)
    setDataCompra("")
    setFornecedor("")
    setItens([{ id: 1, descricao: "", tipo: "", quantidade: 1, valorUnitario: 0 }])
  }

  const handleFiltrar = () => {
    // O filtro já é reativo via useMemo
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Lançamentos</h2>
          <p className="text-sm text-slate-500">Gerencie as compras e despesas da clínica</p>
        </div>

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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 text-white hover:bg-teal-700">
                <Plus className="mr-2 size-4" />
                Novo Lançamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-slate-900">Registrar Nova Compra</DialogTitle>
                <DialogDescription className="text-slate-500">
                  Preencha os dados da nota fiscal e adicione os itens
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Linha 1: Data e Fornecedor */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="data" className="text-slate-700">Data da Compra</Label>
                    <Input
                      id="data"
                      type="date"
                      value={dataCompra}
                      onChange={(e) => setDataCompra(e.target.value)}
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fornecedor" className="text-slate-700">Fornecedor</Label>
                    <Select value={fornecedor} onValueChange={setFornecedor}>
                      <SelectTrigger className="w-full border-slate-200">
                        <SelectValue placeholder="Selecione o fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formedica">Formédica</SelectItem>
                        <SelectItem value="bios">BIOS</SelectItem>
                        <SelectItem value="flukka">Flukka</SelectItem>
                        <SelectItem value="essentia">Essentia</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Card key={item.id} className="border-slate-200 bg-slate-50">
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
                              <Input
                                placeholder="Descrição do produto"
                                value={item.descricao}
                                onChange={(e) => updateItem(item.id, "descricao", e.target.value)}
                                className="border-slate-200 bg-white"
                              />
                              <Select 
                                value={item.tipo} 
                                onValueChange={(value) => updateItem(item.id, "tipo", value)}
                              >
                                <SelectTrigger className="border-slate-200 bg-white">
                                  <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="medicacao">Medicação</SelectItem>
                                  <SelectItem value="insumo">Insumo</SelectItem>
                                  <SelectItem value="frete">Frete/Taxa</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Quantidade</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantidade}
                                  onChange={(e) => updateItem(item.id, "quantidade", parseInt(e.target.value) || 0)}
                                  className="border-slate-200 bg-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Valor Unitário</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.valorUnitario}
                                  onChange={(e) => updateItem(item.id, "valorUnitario", parseFloat(e.target.value) || 0)}
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
                  <span className="text-sm text-slate-500">Valor Total: </span>
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
        </div>
      </div>

      {/* Tabela de Transações */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Histórico de Lançamentos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Exibindo registros de {mesNome}/{anoSelecionado}
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="text-slate-600">Data</TableHead>
                <TableHead className="text-slate-600">Nota Fiscal</TableHead>
                <TableHead className="text-slate-600">Fornecedor</TableHead>
                <TableHead className="text-slate-600">Itens</TableHead>
                <TableHead className="text-slate-600">Status</TableHead>
                <TableHead className="text-right text-slate-600">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-slate-100">
                    <TableCell className="text-slate-900">{transaction.data}</TableCell>
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
                    <TableCell className="text-slate-600">{transaction.itens}</TableCell>
                    <TableCell>
                      {transaction.temFrete ? (
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
                  <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                    Nenhum lançamento encontrado para {mesNome}/{anoSelecionado}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Paginação */}
          {transacoesFiltradas.length > 0 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, transacoesFiltradas.length)} de{" "}
                {transacoesFiltradas.length} registros
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-200"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
  )
}
