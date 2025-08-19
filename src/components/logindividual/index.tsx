import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Search, X, Filter } from "lucide-react";
import useIntegrador from "@/hooks/use-integrador";

import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "../ui/skeleton";
import api from "@/services/api";

// Interface para tipagem dos logs
interface LogEntry {
  id: string;
  acao: string;
  codeLog: string;
  created_at: string;
  id_cliente: string;
}

export default function LogIndividual({ open, onClose, cliente }: any) {
  const [data, setData] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para filtros
  const [filtroCliente, setFiltroCliente] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  const integra: any = useIntegrador();

  useEffect(() => {
    async function handleLogs() {
      setLoading(true);
      try {
        const result = await api.get(
          "src/services/LogsDistintosClientes.php",
          {
            params: { idIntegra: integra },
          }
        );

        // Filtra os logs com base no CPF do cliente
        const logsFiltrados = result.data.data.filter(
          (log: LogEntry) => log.id_cliente === cliente?.cpf_cnpj
        );

        setData(logsFiltrados);
      } catch (error) {
        console.log("Erro ao buscar logs:", error);
      } finally {
        setLoading(false);
      }
    }

    if (open && cliente) {
      handleLogs();
    }
  }, [open, cliente, integra]);

  // Função auxiliar para criar data local sem problemas de fuso horário
  const criarDataLocal = (dataString: string, isEndOfDay = false) => {
    if (!dataString) return null;
    
    const [ano, mes, dia] = dataString.split('-').map(Number);
    
    const data = isEndOfDay 
      ? new Date(ano, mes - 1, dia, 23, 59, 59, 999)
      : new Date(ano, mes - 1, dia, 0, 0, 0, 0);
    
    // Debug temporário - remover depois
    console.log(`criarDataLocal(${dataString}, ${isEndOfDay}):`, {
      input: dataString,
      parsed: { ano, mes, dia },
      result: data.toLocaleString('pt-BR'),
      iso: data.toISOString()
    });
    
    return data;
  };

  // Função auxiliar para formatar data para exibição
  const formatarDataParaExibicao = (dataString: string) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    const resultado = `${dia}/${mes}/${ano}`;
    
    // Debug temporário - remover depois
    console.log(`formatarDataParaExibicao(${dataString}):`, resultado);
    
    return resultado;
  };

  // Função para filtrar os dados
  const dadosFiltrados = useMemo(() => {
    return data.filter((log) => {
      // Filtro por cliente (busca na ação ou código do log)
      const passaFiltroCliente = !filtroCliente || 
        log.acao.toLowerCase().includes(filtroCliente.toLowerCase()) ||
        log.codeLog.toLowerCase().includes(filtroCliente.toLowerCase());

      // Filtro por data - usando função auxiliar
      const dataLog = new Date(log.created_at);
      
      let passaFiltroData = true;
      
      if (dataInicio) {
        const dataInicioObj = criarDataLocal(dataInicio, false);
        if (dataInicioObj) {
          passaFiltroData = passaFiltroData && dataLog >= dataInicioObj;
        }
      }
      
      if (dataFim) {
        const dataFimObj = criarDataLocal(dataFim, true);
        if (dataFimObj) {
          passaFiltroData = passaFiltroData && dataLog <= dataFimObj;
        }
      }

      return passaFiltroCliente && passaFiltroData;
    });
  }, [data, filtroCliente, dataInicio, dataFim]);

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setFiltroCliente("");
    setDataInicio("");
    setDataFim("");
  };

  // Verifica se há filtros ativos
  const temFiltrosAtivos = filtroCliente || dataInicio || dataFim;

  // Reset dos filtros quando o modal fecha
  useEffect(() => {
    if (!open) {
      limparFiltros();
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[600px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Logs para {cliente?.nome}</SheetTitle>
              <SheetDescription>
                Logs detalhados para o cliente {cliente?.nome}
                {dadosFiltrados.length !== data.length && (
                  <span className="text-blue-600 font-medium">
                    {" "}({dadosFiltrados.length} de {data.length} registros)
                  </span>
                )}
              </SheetDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="ml-2"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </SheetHeader>

        {/* Área de Filtros */}
        {mostrarFiltros && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Filtros</h3>
              {temFiltrosAtivos && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limparFiltros}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              )}
            </div>

            {/* Filtro por cliente/ação */}
            <div className="space-y-2">
              <Label htmlFor="filtro-cliente" className="text-sm">
                Buscar por ação ou código
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="filtro-cliente"
                  placeholder="Digite para buscar..."
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtros de data */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data-inicio" className="text-sm">
                  Data início
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="data-inicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-fim" className="text-sm">
                  Data fim
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="data-fim"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Informações dos filtros ativos */}
            {temFiltrosAtivos && (
              <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border">
                <strong>Filtros ativos:</strong>
                {filtroCliente && <span className="ml-2">Busca: "{filtroCliente}"</span>}
                {dataInicio && (
                  <span className="ml-2">
                    De: {formatarDataParaExibicao(dataInicio)}
                  </span>
                )}
                {dataFim && (
                  <span className="ml-2">
                    Até: {formatarDataParaExibicao(dataFim)}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="max-h-[70vh] overflow-y-auto mt-4">
          {loading ? (
            // Exibe Skeleton enquanto carrega os dados
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="space-y-3 p-4 border rounded">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[50%]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {dadosFiltrados.length > 0 ? (
                dadosFiltrados.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Ação:</span>
                        <p className="font-medium">{log.acao}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Código:</span>
                        <p className="font-mono text-blue-600">{log.codeLog}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-600">Data:</span>
                        <p>{new Date(log.created_at).toLocaleString("pt-BR")}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {data.length === 0 ? (
                    <div>
                      <p className="text-lg font-medium">Nenhum log encontrado</p>
                      <p className="text-sm">Este cliente ainda não possui logs registrados.</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">Nenhum resultado encontrado</p>
                      <p className="text-sm">Tente ajustar os filtros para ver mais resultados.</p>
                      {temFiltrosAtivos && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={limparFiltros}
                          className="mt-2"
                        >
                          Limpar filtros
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé com estatísticas */}
        {!loading && data.length > 0 && (
          <div className="mt-4 pt-4 border-t bg-gray-50 -mx-6 px-6 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span>
                {dadosFiltrados.length === data.length 
                  ? `${data.length} registros totais`
                  : `${dadosFiltrados.length} de ${data.length} registros`
                }
              </span>
              {dadosFiltrados.length > 0 && (
                <span className="text-xs">
                  Último registro: {new Date(dadosFiltrados[0]?.created_at).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}