"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stethoscope, DollarSign } from "lucide-react"

interface LoginViewProps {
  onLogin: () => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-slate-200">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex items-center justify-center gap-1">
            <div className="flex size-12 items-center justify-center rounded-xl bg-teal-600 text-white">
              <Stethoscope className="size-6" />
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-700 text-white">
              <DollarSign className="size-6" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Sistema de Gestão Clínica
            </CardTitle>
            <CardDescription className="text-slate-500">
              Faça login para continuar
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-slate-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-teal-600 text-white hover:bg-teal-700"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
