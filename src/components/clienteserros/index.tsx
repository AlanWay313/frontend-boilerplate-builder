import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Eye, X } from "lucide-react";
import useIntegrador from "@/hooks/use-integrador";
import { useEffect, useState, useMemo } from "react";
import { Button } from "../ui/button";
import LogIndividual from "../logindividual";
import ReintegrarCliente from "../reintegrarcliente";
import { Skeleton } from "../ui/skeleton";
import api from "@/services/api";

export default function ClientesErros() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const integra: any = useIntegrador();

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const result = await api.get("/src/clientes/listarclientes.php", {
        params: {
          idIntegra: integra,
        },
      });

      const todosClientes = result.data.data;

      // Filtro mais robusto
      const clientesComErro = todosClientes.filter(
        (cliente: any) =>
          !cliente.ole_contract_number || cliente.ole_contract_number.trim() === ""
      );

      setData(clientesComErro);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (integra) {
      fetchClientes();
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

  const handleLogOpen = (cliente: any) => {
    setSelectedCliente(cliente);
    setIsLogOpen(true);
  };

  const handleLogClose = () => {
    setIsLogOpen(false);
    setSelectedCliente(null);
  };

  const limparBusca = () => {
    setBusca("");
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex items-center text-[12px] gap-2">
          <Eye /> Visualizar Clientes com Falha
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Clientes com Falha</DialogTitle>
            <DialogDescription>
              Aqui estão os clientes com falha, verifique os logs para mais detalhes!
            </DialogDescription>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 border rounded bg-red-50">
                <h3 className="font-bold text-red-600 text-sm">
                  Total com Falha
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

          {/* Lista com scroll */}
          <div className="max-h-[400px] overflow-y-auto mt-4">
            {loading ? (
              <ul className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                  >
                    <div className="flex flex-col space-y-2 flex-1">
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-4 w-[140px]" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-[80px]" />
                      <Skeleton className="h-8 w-[100px]" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : clientesFiltrados.length > 0 ? (
              <ul className="space-y-2">
                {clientesFiltrados.map((cliente, index) => (
                  <li
                    key={cliente.id || index}
                    className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-gray-900">
                        {cliente.nome}
                      </span>
                      <span className="text-sm text-gray-600 font-mono">
                        {cliente.cpf_cnpj}
                      </span>
                      {cliente.email && (
                        <span className="text-xs text-gray-500">
                          {cliente.email}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4 min-w-[140px]">
                      <Button
                        onClick={() => handleLogOpen(cliente)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 w-full justify-start"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Log
                      </Button>
                      <div className="w-full">
                        <ReintegrarCliente nome={cliente.nome} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {data.length === 0 ? (
                  <div>
                    <p className="text-lg font-medium">🎉 Parabéns!</p>
                    <p className="text-sm">Nenhum cliente com falha encontrado.</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium">Nenhum resultado encontrado</p>
                    <p className="text-sm">
                      Nenhum cliente corresponde à busca "{busca}"
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={limparBusca}
                      className="mt-2"
                    >
                      Limpar busca
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rodapé com informações */}
          {!loading && data.length > 0 && (
            <div className="mt-4 pt-3 border-t bg-gray-50 -mx-6 px-6 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>
                  {clientesFiltrados.length === data.length 
                    ? `${data.length} clientes com falha`
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

      {/* Modal de Log Individual */}
      <LogIndividual
        open={isLogOpen}
        onClose={handleLogClose}
        cliente={selectedCliente}
      />
    </div>
  );
}