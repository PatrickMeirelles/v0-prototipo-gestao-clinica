import { useState, useEffect } from "react";

export interface Permission {
  id: number;
  slug: string;
  name: string;
  module: string;
}

export interface ApiUser {
  id: number;
  name?: string; // Adicionamos 'name' que é o padrão mais comum em APIs
  nome?: string; // Mantemos 'nome' como fallback
  email: string;
  nivel: "Admin" | "Operação" | string;
  permissions: number[];
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const response = await fetch("/api/permissions/get");
      const json = await response.json();

      if (json.success) {
        setPermissions(json.data);
      }
    } catch (error) {
      console.error("Erro ao buscar permissões", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = async (userId: number, permissionId: number) => {
    try {
      const response = await fetch(
        `/api/permissions/toggle/${userId}/${permissionId}`,
        {
          method: "POST",
        },
      );

      return response.ok;
    } catch (error) {
      console.error("Erro ao alternar permissão", error);
      return false;
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    loading,
    togglePermission,
  };
}
