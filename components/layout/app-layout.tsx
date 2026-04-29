"use client"

import type { ViewType } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Settings, 
  LogOut,
  Stethoscope,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

interface AppLayoutProps {
  children: React.ReactNode
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onLogout: () => void
}

const menuItems: { view: ViewType; label: string; icon: React.ReactNode }[] = [
  { view: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
  { view: "transactions", label: "Lançamentos", icon: <Receipt className="size-4" /> },
  { view: "users", label: "Usuários/Acessos", icon: <Users className="size-4" /> },
  { view: "settings", label: "Configurações", icon: <Settings className="size-4" /> },
]

const viewTitles: Record<ViewType, string> = {
  login: "Login",
  dashboard: "Dashboard",
  transactions: "Lançamentos",
  users: "Usuários e Acessos",
  settings: "Configurações",
}

export function AppLayout({ children, currentView, onNavigate, onLogout }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavigate = (view: ViewType) => {
    onNavigate(view)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-teal-600 text-white">
            <Stethoscope className="size-4" />
          </div>
          <span className="font-semibold text-slate-900">Gestão Clínica</span>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.view}>
                <Button
                  variant={currentView === item.view ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    currentView === item.view 
                      ? "bg-teal-50 text-teal-700 hover:bg-teal-100" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  onClick={() => handleNavigate(item.view)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={onLogout}
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-200 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-600 text-white">
              <Stethoscope className="size-4" />
            </div>
            <span className="font-semibold text-slate-900">Gestão Clínica</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.view}>
                <Button
                  variant={currentView === item.view ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    currentView === item.view 
                      ? "bg-teal-50 text-teal-700 hover:bg-teal-100" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  onClick={() => handleNavigate(item.view)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={onLogout}
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <h1 className="text-lg font-semibold text-slate-900">
              {viewTitles[currentView]}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">Sara Raquel</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
            <Avatar className="size-9">
              <AvatarFallback className="bg-teal-100 text-teal-700">SR</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
