"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Settings, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function SettingsView() {
  const { user } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!user) return;
    setNome(user.name);
    setEmail(user.email);
  }, [user]);

  const [notificacoesFechamento, setNotificacoesFechamento] = useState(true);
  const [notificacoesNovoLancamento, setNotificacoesNovoLancamento] =
    useState(false);
  const [relatorioSemanal, setRelatorioSemanal] = useState(true);

  const [codeSent, setCodeSent] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [code, setCode] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const handleRequestPasswordChange = async () => {
    setRequestingCode(true);
    setPasswordMessage(null);

    try {
      const response = await fetch("/api/auth/request-password-change", {
        method: "POST",
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPasswordMessage(
          payload?.message ?? "Não foi possível enviar o código.",
        );
        setCodeSent(false);
        return;
      }

      setCodeSent(true);
      setPasswordMessage(
        "Código enviado para seu e-mail. Informe o código para continuar.",
      );
    } finally {
      setRequestingCode(false);
    }
  };

  const handleChangePassword = async () => {
    setChangingPassword(true);
    setPasswordMessage(null);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim(),
          oldPassword,
          newPassword,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPasswordMessage(
          payload?.message ?? "Não foi possível alterar a senha.",
        );
        return;
      }

      setPasswordMessage("Senha alterada com sucesso.");
      setCodeSent(false);
      setCode("");
      setOldPassword("");
      setNewPassword("");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Configurações</h2>
        <p className="text-sm text-slate-500">
          Gerencie seu perfil e preferências do sistema
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="perfil" className="w-full min-w-0">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-slate-100 p-2 sm:grid-cols-3 sm:gap-0 sm:p-1 lg:w-auto lg:grid-cols-none lg:inline-flex">
          <TabsTrigger
            value="perfil"
            className="gap-2 data-[state=active]:bg-white"
          >
            <User className="hidden size-4 sm:block" />
            Perfil
          </TabsTrigger>
          <TabsTrigger
            value="sistema"
            className="gap-2 data-[state=active]:bg-white"
          >
            <Settings className="hidden size-4 sm:block" />
            Sistema
          </TabsTrigger>
          <TabsTrigger
            value="ajuda"
            className="gap-2 data-[state=active]:bg-white"
          >
            <HelpCircle className="hidden size-4 sm:block" />
            Ajuda
          </TabsTrigger>
        </TabsList>

        {/* Aba Perfil */}
        <TabsContent value="perfil" className="mt-6">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">
                Informações do Perfil
              </CardTitle>
              <CardDescription className="text-slate-500">
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-slate-700">Nome</Label>

                  <div className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50 text-slate-900">
                    {nome}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">E-mail</Label>

                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900">
                    {email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">
                Trocar senha
              </CardTitle>
              <CardDescription className="text-slate-500">
                Enviaremos um código para seu e-mail e, com ele, você confirma a
                nova senha.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!codeSent ? (
                <Button
                  className="bg-teal-600 text-white hover:bg-teal-700"
                  onClick={handleRequestPasswordChange}
                  disabled={requestingCode || !user}
                >
                  {requestingCode
                    ? "Enviando código..."
                    : "Enviar código ao e-mail"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-slate-700">
                        Código
                      </Label>
                      <Input
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword" className="text-slate-700">
                        Senha antiga
                      </Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-700">
                      Senha nova
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-slate-200"
                    />
                  </div>

                  {passwordMessage ? (
                    <p
                      className={`text-sm font-medium ${
                        passwordMessage.toLowerCase().includes("sucesso")
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {passwordMessage}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Use o código enviado ao seu e-mail para concluir.
                    </p>
                  )}

                  <Button
                    className="bg-teal-600 text-white hover:bg-teal-700"
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                  >
                    {changingPassword
                      ? "Alterando..."
                      : "Confirmar e trocar senha"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Sistema */}
        <TabsContent value="sistema" className="mt-6">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">
                Preferências do Sistema
              </CardTitle>
              <CardDescription className="text-slate-500">
                Configure as notificações e comportamentos do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-900">
                    Notificações por e-mail no fechamento do mês
                  </Label>
                  <p className="text-sm text-slate-500">
                    Receba um resumo mensal das despesas por e-mail
                  </p>
                </div>
                <Switch
                  checked={notificacoesFechamento}
                  onCheckedChange={setNotificacoesFechamento}
                  className="data-[state=checked]:bg-teal-600"
                />
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-900">
                      Alertas de novos lançamentos
                    </Label>
                    <p className="text-sm text-slate-500">
                      Receba notificações quando novos lançamentos forem
                      registrados
                    </p>
                  </div>
                  <Switch
                    checked={notificacoesNovoLancamento}
                    onCheckedChange={setNotificacoesNovoLancamento}
                    className="data-[state=checked]:bg-teal-600"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-900">
                      Relatório semanal automático
                    </Label>
                    <p className="text-sm text-slate-500">
                      Gere automaticamente um relatório toda segunda-feira
                    </p>
                  </div>
                  <Switch
                    checked={relatorioSemanal}
                    onCheckedChange={setRelatorioSemanal}
                    className="data-[state=checked]:bg-teal-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Ajuda */}
        <TabsContent value="ajuda" className="mt-6">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">
                Perguntas Frequentes
              </CardTitle>
              <CardDescription className="text-slate-500">
                Dúvidas comuns sobre o uso do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-slate-200">
                  <AccordionTrigger className="text-left text-slate-900 hover:text-teal-600 hover:no-underline">
                    Como lançar uma taxa de entrega separada da medicação?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    Ao criar um novo lançamento, você pode adicionar múltiplos
                    itens na mesma nota fiscal. Para cada item, selecione o tipo
                    correspondente: &quot;Medicação&quot;, &quot;Insumo&quot; ou
                    &quot;Frete/Taxa&quot;. Desta forma, o sistema separa
                    automaticamente os gastos por categoria e você pode
                    visualizar o quanto está sendo gasto apenas com fretes no
                    dashboard.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-slate-200">
                  <AccordionTrigger className="text-left text-slate-900 hover:text-teal-600 hover:no-underline">
                    Como visualizar os gastos por fornecedor?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    No Dashboard, você encontra um resumo com o maior fornecedor
                    do mês. Para uma análise mais detalhada, acesse a aba
                    &quot;Lançamentos&quot; onde você pode filtrar e ordenar os
                    registros por fornecedor. Em breve, teremos um relatório
                    específico de gastos por fornecedor.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-slate-200">
                  <AccordionTrigger className="text-left text-slate-900 hover:text-teal-600 hover:no-underline">
                    Posso exportar os dados para planilha?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    Sim! Em cada tela de listagem, você encontrará um botão de
                    exportação que permite baixar os dados em formato CSV ou
                    Excel. Esta funcionalidade está disponível para
                    administradores e permite exportar todos os dados ou apenas
                    o período selecionado.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
