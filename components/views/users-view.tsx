"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePermissions, type ApiUser } from "@/hooks/use-permissions";
import { useAuth } from "@/hooks/use-auth";

export function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const { permissions, togglePermission } = usePermissions();
  const { user: currentUser, hasPermission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const canWriteUsers = hasPermission("users:write");

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/users");
        const payload = await res.json();

        let rawUsers = [];

        if (payload && Array.isArray(payload.data)) {
          rawUsers = payload.data;
        } else if (Array.isArray(payload)) {
          rawUsers = payload;
        }

        let fetchedUsers = rawUsers.map((u: any) => ({
          ...u,
          permissions: Array.isArray(u.permissions)
            ? u.permissions.map((p: any) => p.permission_id || p)
            : [],
        }));

        // Lógica de filtro atualizada:
        if (currentUser?.isMaster) {
          // Se for Master, remove apenas a si mesmo da visualização
          fetchedUsers = fetchedUsers.filter(
            (u: any) => u.email !== currentUser.email,
          );
        } else {
          // Se não for Master, remove TODOS os usuários que são master da lista
          fetchedUsers = fetchedUsers.filter((u: any) => !u.is_master);
        }

        setUsers(fetchedUsers);
      } catch (e) {
        console.error("Falha ao carregar usuários:", e);
      } finally {
        setIsLoading(false);
      }
    }

    if (currentUser) {
      loadUsers();
    }
  }, [currentUser]);

  const handleTogglePermission = async (
    userId: number,
    permissionId: number,
  ) => {
    if (!canWriteUsers) return;

    const success = await togglePermission(userId, permissionId);

    if (success) {
      setUsers((prev) =>
        prev.map((user) => {
          if (user.id === userId) {
            const currentPermissions = Array.isArray(user.permissions)
              ? user.permissions
              : [];
            const hasAccess = currentPermissions.includes(permissionId);

            return {
              ...user,
              permissions: hasAccess
                ? currentPermissions.filter((id: number) => id !== permissionId)
                : [...currentPermissions, permissionId],
            };
          }
          return user;
        }),
      );
    }
  };

  const getIniciais = (nomeCompleto?: string) => {
    if (!nomeCompleto || typeof nomeCompleto !== "string") return "??";
    return nomeCompleto
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Controle de Usuários
        </h2>
        <p className="text-sm text-slate-500">
          Gerencie os acessos e permissões dos usuários
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Usuários Cadastrados
          </CardTitle>
          <CardDescription>
            Lista de todos os usuários com acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-600">Usuário</TableHead>
                  <TableHead className="text-slate-600">E-mail</TableHead>
                  <TableHead className="text-slate-600">Nível</TableHead>
                  <TableHead className="text-slate-600">Permissões</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => {
                    const userName =
                      user.name || user.nome || "Usuário sem nome";

                    const userPermissions = Array.isArray(user.permissions)
                      ? user.permissions
                      : [];

                    const userNivel = user.is_master ? "Master" : "Operação";

                    return (
                      <TableRow key={user.id} className="border-slate-100">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarFallback
                                className={
                                  user.is_master
                                    ? "bg-teal-100 text-teal-700"
                                    : "bg-slate-100 text-slate-600"
                                }
                              >
                                {getIniciais(userName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-slate-900">
                              {userName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.is_master
                                ? "border-teal-200 bg-teal-50 text-teal-700"
                                : "border-slate-200 bg-slate-50 text-slate-600"
                            }
                          >
                            {userNivel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.is_master ? (
                            <Badge className="bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-50">
                              Acesso Total (Master)
                            </Badge>
                          ) : canWriteUsers ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                              {permissions.map((permission) => {
                                const hasAccess = userPermissions.includes(
                                  permission.id,
                                );

                                return (
                                  <div
                                    key={permission.id}
                                    className="flex items-start gap-3 min-w-[200px]"
                                  >
                                    <Switch
                                      checked={hasAccess}
                                      onCheckedChange={() =>
                                        handleTogglePermission(
                                          user.id,
                                          permission.id,
                                        )
                                      }
                                      className="data-[state=checked]:bg-teal-600 mt-1 shrink-0"
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium text-slate-700">
                                        {permission.name}
                                      </span>
                                      <span className="text-xs text-slate-400">
                                        {permission.module}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 py-1 max-w-[450px]">
                              {permissions.filter((permission) =>
                                userPermissions.includes(permission.id),
                              ).length > 0 ? (
                                permissions
                                  .filter((permission) =>
                                    userPermissions.includes(permission.id),
                                  )
                                  .map((permission) => (
                                    <Badge
                                      key={permission.id}
                                      variant="secondary"
                                      className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-normal"
                                    >
                                      {permission.name}
                                    </Badge>
                                  ))
                              ) : (
                                <span className="text-xs text-slate-400 italic">
                                  Nenhuma permissão atribuída
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-slate-500"
                    >
                      {isLoading
                        ? "Carregando usuários..."
                        : "Nenhum usuário encontrado."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Sobre os Níveis de Acesso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge className="mt-0.5 bg-teal-100 text-teal-700 hover:bg-teal-100">
              Master
            </Badge>
            <p className="text-sm text-slate-600">
              Acesso total ao sistema, incluindo configurações, gerenciamento de
              usuários e visualização de todos os relatórios e dashboards.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="mt-0.5 bg-slate-100 text-slate-600 hover:bg-slate-100">
              Operação
            </Badge>
            <p className="text-sm text-slate-600">
              Acesso limitado a lançamentos e operações do dia a dia. O acesso
              pode ser configurado individualmente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
