import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useIntegrador from "@/hooks/use-integrador";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import LogIndividual from "../logindividual";
import { Eye } from "lucide-react";
import ReintegrarCliente from "../reintegrarcliente";
import { Skeleton } from "../ui/skeleton";

export default function ClientesErros() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Estado para carregamento
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const integra: any = useIntegrador();

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        "https://hub.sysprov.com.br/integraoletv/src/clientes/listarclientes.php",
        {
          params: {
            idIntegra: integra(),
          },
        }
      );

      // Filtra apenas os clientes onde ole_contract_number é null
      const clientesComErro = result.data.data.filter(
        (cliente: any) => cliente.ole_contract_number === null
      );

      setData(clientesComErro);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [integra]);

  const handleLogOpen = (cliente: any) => {
    setSelectedCliente(cliente);
    setIsLogOpen(true);
  };

  const handleLogClose = () => {
    setIsLogOpen(false);
    setSelectedCliente(null);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex items-center text-[12px] gap-2">
          <Eye /> Visualizar Clientes com Falha
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clientes com Falha</DialogTitle>
            <DialogDescription>
              Aqui estão os clientes com falha, verifique os logs para mais
              detalhes!
            </DialogDescription>

            <div className="p-2 border rounded">
              <h3 className="font-bold text-red-400">
                Total {data.length > 0 ? data.length : "Carregando..."}
              </h3>
            </div>
          </DialogHeader>

          {/* Contêiner com scroll */}
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <ul className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <div className="flex flex-col space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                    <Skeleton className="h-8 w-[100px]" />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-4">
                {data.length > 0 ? (
                  data.map((cliente) => (
                    <li
                      key={cliente.id}
                      className="flex items-center justify-between py-2 border-b"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{cliente.nome}</span>
                        <span className="font-semibold">{cliente.cpf_cnpj}</span>
                      </div>
                      <div>
                        <Button
                          onClick={() => handleLogOpen(cliente)}
                          variant="ghost"
                        >
                          Ver Log
                        </Button>
                        <ReintegrarCliente nome={cliente.nome} />
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center py-4">
                    Nenhum cliente com falha encontrado.
                  </li>
                )}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Componente LogIndividual */}
      <LogIndividual
        open={isLogOpen}
        onClose={handleLogClose}
        cliente={selectedCliente}
      />
    </div>
  );
}
