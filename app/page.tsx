"use client"

import { useState } from "react"
import { LoginView } from "@/components/views/login-view"
import { DashboardView } from "@/components/views/dashboard-view"
import { TransactionsView } from "@/components/views/transactions-view"
import { UsersView } from "@/components/views/users-view"
import { SettingsView } from "@/components/views/settings-view"
import { AppLayout } from "@/components/layout/app-layout"

export type ViewType = "login" | "dashboard" | "transactions" | "users" | "settings"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("login")

  if (currentView === "login") {
    return <LoginView onLogin={() => setCurrentView("dashboard")} />
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />
      case "transactions":
        return <TransactionsView />
      case "users":
        return <UsersView />
      case "settings":
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <AppLayout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      onLogout={() => setCurrentView("login")}
    >
      {renderView()}
    </AppLayout>
  )
}
