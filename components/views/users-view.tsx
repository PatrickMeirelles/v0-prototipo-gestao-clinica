"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface User {
  id: number
  nome: string
  email: string
  nivel: "Admin" | "Operação"
  iniciais: string
  acessoDashboard: boolean
}

const initialUsers: User[] = [
  { 
    id: 1, 
    nome: "Sara Raquel", 
    email: "sara.raquel@clinica.com", 
    nivel: "Admin", 
    iniciais: "SR",
    acessoDashboard: true 
  },
  { 
    id: 2, 
    nome: "Patrick", 
    email: "patrick@clinica.com", 
    nivel: "Admin", 
    iniciais: "PA",
    acessoDashboard: true 
  },
  { 
    id: 3, 
    nome: "Recepcionista", 
    email: "recepcao@clinica.com", 
    nivel: "Operação", 
    iniciais: "RC",
    acessoDashboard: false 
  },
]

export function UsersView() {
  const [users, setUsers] = useState<User[]>(initialUsers)

  const toggleDashboardAccess = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, acessoDashboard: !user.acessoDashboard }
        : user
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Controle de Usuários</h2>
        <p className="text-sm text-slate-500">
          Gerencie os acessos e permissões dos usuários do sistema
        </p>
      </div>

      {/* Tabela de Usuários */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Usuários Cadastrados
          </CardTitle>
          <CardDescription className="text-slate-500">
            Lista de todos os usuários com acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="text-slate-600">Usuário</TableHead>
                <TableHead className="text-slate-600">E-mail</TableHead>
                <TableHead className="text-slate-600">Nível</TableHead>
                <TableHead className="text-slate-600">Acesso ao Dashboard</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-slate-100">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback 
                          className={
                            user.nivel === "Admin" 
                              ? "bg-teal-100 text-teal-700" 
                              : "bg-slate-100 text-slate-600"
                          }
                        >
                          {user.iniciais}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-900">{user.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        user.nivel === "Admin"
                          ? "border-teal-200 bg-teal-50 text-teal-700"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }
                    >
                      {user.nivel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.acessoDashboard}
                        onCheckedChange={() => toggleDashboardAccess(user.id)}
                        className="data-[state=checked]:bg-teal-600"
                      />
                      <span className="text-sm text-slate-500">
                        {user.acessoDashboard ? "Habilitado" : "Desabilitado"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Card de Informações */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Sobre os Níveis de Acesso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge className="mt-0.5 bg-teal-100 text-teal-700 hover:bg-teal-100">
              Admin
            </Badge>
            <p className="text-sm text-slate-600">
              Acesso total ao sistema, incluindo configurações, gerenciamento de usuários 
              e visualização de todos os relatórios e dashboards.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="mt-0.5 bg-slate-100 text-slate-600 hover:bg-slate-100">
              Operação
            </Badge>
            <p className="text-sm text-slate-600">
              Acesso limitado a lançamentos e operações do dia a dia. 
              O acesso ao dashboard pode ser configurado individualmente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
