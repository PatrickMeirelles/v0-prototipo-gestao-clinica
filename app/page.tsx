"use client";

import { useEffect, useMemo, useState } from "react";
import { LoginView } from "@/components/views/login-view";
import { DashboardView } from "@/components/views/dashboard-view";
import { TransactionsView } from "@/components/views/transactions-view";
import { UsersView } from "@/components/views/users-view";
import { SettingsView } from "@/components/views/settings-view";
import { CatalogView } from "@/components/views/catalog-view";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/hooks/use-auth";

export type ItemCategory = "medicacao" | "insumo" | "taxa_frete";

export interface Supplier {
  id: number;
  nome: string;
}

export interface CatalogItem {
  id: number;
  nome: string;
  categoria: ItemCategory;
}

export type ViewType =
  | "login"
  | "dashboard"
  | "transactions"
  | "catalog"
  | "users"
  | "settings";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    error,
  } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, nome: "BIOS" },
    { id: 2, nome: "Formédica" },
    { id: 3, nome: "Flukka" },
    { id: 4, nome: "Essentia" },
  ]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([
    { id: 1, nome: "Gestrinona 85mg", categoria: "medicacao" },
    { id: 2, nome: "Testosterona 50mg", categoria: "medicacao" },
    { id: 3, nome: "Tirzepatida 40mg/4ml", categoria: "medicacao" },
    { id: 4, nome: "TIRZE 60MG", categoria: "medicacao" },
    { id: 5, nome: "hcg 5.000 ui", categoria: "medicacao" },
    { id: 6, nome: "GH CRISCY", categoria: "medicacao" },
    { id: 7, nome: "OMNOTROPE", categoria: "medicacao" },
    { id: 8, nome: "Vitamina DK", categoria: "insumo" },
    {
      id: 9,
      nome: "PROT 2 EV - N-ACETIL CISTEINA E DEMAIS ATIVOS",
      categoria: "insumo",
    },
    {
      id: 10,
      nome: "PROT 3 EV - ALANIL GLUTAMINA E DEMAIS ATIVOS",
      categoria: "insumo",
    },
    {
      id: 11,
      nome: "PROT 1 EV - SORO 1 - ESTEATOSE E ANTIINFLAMATÓRIO",
      categoria: "insumo",
    },
    {
      id: 12,
      nome: "PROT 1 EV - SORO 2 - ESTEATOSE E ANTIINFLAMATÓRIO",
      categoria: "insumo",
    },
    { id: 13, nome: "Taxa de entrega", categoria: "taxa_frete" },
    { id: 14, nome: "Frete", categoria: "taxa_frete" },
  ]);

  const addSupplier = (nome: string) => {
    const trimmed = nome.trim();
    if (!trimmed) return null;

    const existing = suppliers.find(
      (supplier) => supplier.nome.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) return existing;

    const newSupplier = { id: Date.now(), nome: trimmed };
    setSuppliers((prev) => [...prev, newSupplier]);
    return newSupplier;
  };

  const updateSupplier = (id: number, nome: string) => {
    const trimmed = nome.trim();
    if (!trimmed) return;
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id ? { ...supplier, nome: trimmed } : supplier,
      ),
    );
  };

  const deleteSupplier = (id: number) => {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  };

  const addCatalogItem = (nome: string, categoria: ItemCategory) => {
    const trimmed = nome.trim();
    if (!trimmed) return null;

    const existing = catalogItems.find(
      (item) => item.nome.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) return existing;

    const newItem = { id: Date.now(), nome: trimmed, categoria };
    setCatalogItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateCatalogItem = (
    id: number,
    updates: { nome: string; categoria: ItemCategory },
  ) => {
    const trimmed = updates.nome.trim();
    if (!trimmed) return;
    setCatalogItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, nome: trimmed, categoria: updates.categoria }
          : item,
      ),
    );
  };

  const deleteCatalogItem = (id: number) => {
    setCatalogItems((prev) => prev.filter((item) => item.id !== id));
  };

  const canAccessView = useMemo(
    () => (view: ViewType) => {
      if (view === "login") return true;
      if (!isAuthenticated) return false;

      return (
        hasPermission("*") ||
        hasPermission(view) ||
        hasPermission(`${view}:read`) ||
        hasPermission(`${view}:*`)
      );
    },
    [hasPermission, isAuthenticated],
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!canAccessView(currentView)) {
      const viewsAllowed: ViewType[] = [
        "dashboard",
        "transactions",
        "catalog",
        "users",
        "settings",
      ];

      const firstAllowedView = viewsAllowed.find((view) => canAccessView(view));

      if (firstAllowedView) {
        setCurrentView(firstAllowedView);
      }
    }
  }, [canAccessView, currentView, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Carregando sessão...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginView
        error={error}
        isLoading={isSubmittingLogin}
        onLogin={async ({ email, password }) => {
          setIsSubmittingLogin(true);
          try {
            await login({ email, password });
            setCurrentView("dashboard");
          } finally {
            setIsSubmittingLogin(false);
          }
        }}
      />
    );
  }

  const renderView = () => {
    if (!canAccessView(currentView)) {
      return (
        <div className="flex h-[50vh] flex-col items-center justify-center text-slate-500">
          <h2 className="text-xl font-semibold text-slate-900">
            Acesso Negado
          </h2>
          <p className="mt-2 text-sm">
            Você não tem permissão para visualizar esta tela.
          </p>
        </div>
      );
    }

    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "transactions":
        return (
          <TransactionsView
            suppliers={suppliers}
            catalogItems={catalogItems}
            onAddSupplier={addSupplier}
            onAddCatalogItem={addCatalogItem}
          />
        );
      case "catalog":
        return (
          <CatalogView
            suppliers={suppliers}
            catalogItems={catalogItems}
            onAddSupplier={addSupplier}
            onUpdateSupplier={updateSupplier}
            onDeleteSupplier={deleteSupplier}
            onAddCatalogItem={addCatalogItem}
            onUpdateCatalogItem={updateCatalogItem}
            onDeleteCatalogItem={deleteCatalogItem}
          />
        );
      case "users":
        return <UsersView />;
      case "settings":
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <AppLayout
      currentView={currentView}
      onNavigate={setCurrentView}
      onLogout={async () => {
        await logout();
      }}
      currentUser={user}
      canAccessView={canAccessView}
    >
      {renderView()}
    </AppLayout>
  );
}
