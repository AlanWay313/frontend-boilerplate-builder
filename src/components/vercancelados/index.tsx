import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, X, Users } from "lucide-react";
import useIntegrador from "@/hooks/use-integrador";
import api from "@/services/api";

import { useEffect, useState, useMemo } from "react";

export default function VerCancelados() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState("");
  const integra: any = useIntegrador();

  useEffect(() => {
    async function handleClientes() {
      setLoading(true);
      try {
        const result = await api.get("/src/clientes/listarclientes.php", {
          params: { idIntegra: integra },
        });

        // Filtra cancelados independente de caixa ou espaços
        const clientesCancelados = result.data.data.filter(
          (cliente: any) =>
            cliente.voalle_contract_status &&
            cliente.voalle_contract_status.trim().toLowerCase() === "cancelado"
        );

        setData(clientesCancelados);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (integra) {
      handleClientes();
    }
  }, [integra]);

  // Filtro de busca por nome ou CPF
  const clientesFiltrados = useMemo(() => {
    if (!busca.trim()) {
      return data;
    }

    const termoBusca = busca.toLowerCase().trim();
    
    return data.filter((cliente) =>
      cliente.nome?.toLowerCase().includes(termoBusca) ||
      cliente.cpf_cnpj?.toLowerCase().includes(termoBusca)
    );
  }, [data, busca]);

  const limparBusca = () => {
    setBusca("");
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="p-2 hover:bg-gray-100 rounded transition-colors">
          <Eye className="h-4 w-4" />
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-600" />
              Clientes Cancelados
            </DialogTitle>
            <DialogDescription>
              Lista de todos os clientes com contratos cancelados no sistema.
            </DialogDescription>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 border rounded bg-red-50">
                <h3 className="font-bold text-red-600 text-sm">
                  Total Cancelados
                </h3>
                <p className="text-2xl font-bold text-red-700">
                  {loading ? "..." : data.length}
                </p>
              </div>
              <div className="p-3 border rounded bg-blue-50">
                <h3 className="font-bold text-blue-600 text-sm">
                  Resultados da Busca
                </h3>
                <p className="text-2xl font-bold text-blue-700">
                  {loading ? "..." : clientesFiltrados.length}
                </p>
              </div>
            </div>

            {/* Campo de busca */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou CPF/CNPJ..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 pr-10"
                disabled={loading}
              />
              {busca && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limparBusca}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Indicador de busca ativa */}
            {busca && (
              <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded border">
                <span className="font-medium">Busca ativa:</span> "{busca}"
                {clientesFiltrados.length !== data.length && (
                  <span className="ml-2">
                    ({clientesFiltrados.length} de {data.length} resultados)
                  </span>
                )}
              </div>
            )}
          </DialogHeader>

          {/* Lista de clientes */}
          <div className="h-[420px] overflow-auto mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Carregando clientes cancelados...</p>
                </div>
              </div>
            ) : clientesFiltrados.length > 0 ? (
              <div className="space-y-3">
                {clientesFiltrados.map((item: any, index: number) => (
                  <div 
                    key={index} 
                    className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {item.nome}
                        </h3>
                        <p className="text-gray-600 font-mono text-sm mt-1">
                          {item.cpf_cnpj}
                        </p>
                        {item.email && (
                          <p className="text-gray-500 text-xs mt-1">
                            {item.email}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end text-right">
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                          CANCELADO
                        </span>
                        {item.ole_contract_number && (
                          <span className="text-xs text-gray-500 mt-1">
                            Contrato: {item.ole_contract_number}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Informações adicionais se disponíveis */}
                    {(item.contato || item.endereco_logradouro) && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          {item.contato && (
                            <div>
                              <span className="font-medium">Contato:</span> {item.contato}
                            </div>
                          )}
                          {item.endereco_logradouro && (
                            <div>
                              <span className="font-medium">Endereço:</span> {item.endereco_logradouro}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  {data.length === 0 ? (
                    <div>
                      <div className="text-6xl mb-4">🎉</div>
                      <p className="text-lg font-medium mb-2">Excelente!</p>
                      <p className="text-sm">Nenhum contrato cancelado encontrado.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-lg font-medium mb-2">Nenhum resultado encontrado</p>
                      <p className="text-sm mb-4">
                        Nenhum cliente corresponde à busca "{busca}"
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={limparBusca}
                      >
                        Limpar busca
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rodapé com informações */}
          {!loading && data.length > 0 && (
            <div className="mt-4 pt-3 border-t bg-gray-50 -mx-6 px-6 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>
                  {clientesFiltrados.length === data.length 
                    ? `${data.length} clientes cancelados`
                    : `${clientesFiltrados.length} de ${data.length} clientes`
                  }
                </span>
                {busca && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={limparBusca}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}