import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useIntegrador from "@/hooks/use-integrador";
import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function LogIndividual({ open, onClose, cliente }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Estado para o carregamento
  const integra: any = useIntegrador();

  useEffect(() => {
    async function handleLogs() {
      setLoading(true); // Ativa o loading
      try {
        const result = await axios.get(
          "https://hub.sysprov.com.br/integraoletv/src/services/LogsDistintosClientes.php",
          {
            params: { idIntegra: integra() },
          }
        );

        // Filtra os logs com base no CPF do cliente
        const logsFiltrados = result.data.data.filter(
          (log: any) => log.id_cliente === cliente?.cpf_cnpj // Altere "cpf_cnpj" se o nome da propriedade for diferente
        );

        setData(logsFiltrados);
      } catch (error) {
        console.log("Erro ao buscar logs:", error);
      } finally {
        setLoading(false); // Desativa o loading
      }
    }

    if (open && cliente) {
      handleLogs();
    }
  }, [open, cliente, integra]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Logs para {cliente?.nome}</SheetTitle>
          <SheetDescription>
            Aqui estão os detalhes do log para o cliente {cliente?.nome}.
          </SheetDescription>
        </SheetHeader>
        <div className="max-h-screen overflow-y-auto pb-96">
          {loading ? (
            // Exibe Skeleton enquanto carrega os dados
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[50%]" />
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-4">
              {data.length > 0 ? (
                data.map((log) => (
                  <li key={log.id} className="py-2 border-b">
                    <div>
                      <strong>Ação:</strong> {log.acao}
                    </div>
                    <div>
                      <strong>Código do Log:</strong> {log.codeLog}
                    </div>
                    <div>
                      <strong>Data:</strong>{" "}
                      {new Date(log.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center py-4">
                  Nenhum log encontrado para este cliente.
                </li>
              )}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
