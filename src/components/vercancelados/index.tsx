import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import useIntegrador from "@/hooks/use-integrador";
import axios from "axios";
import { Eye } from "lucide-react"
import { useEffect, useState } from "react";
  

export default function VerCancelados(){

    const [data, setData] = useState<any[]>([]);
    const integra: any = useIntegrador();
  
    useEffect(() => {
      async function handleClientes() {
        try {
          const result = await axios.get(
            "https://hub.sysprov.com.br/integraoletv/src/clientes/listarclientes.php",
            { params: { idIntegra: integra() } }
          );
          // Filtra apenas os clientes cancelados
          const clientesCancelados = result.data.data.filter(
            (cliente: any) => cliente.voalle_contract_status === "Cancelado"
          );
          setData(clientesCancelados);
        } catch (error) {
          console.log(error);
        }
      }
  
      handleClientes();
    }, [integra]);

    return (
        <div>
        <Dialog>
        <DialogTrigger>{data.length <= 0 ? "" : <Eye />}</DialogTrigger>
        <DialogContent >
            <DialogHeader>
            <DialogTitle>Clientes Cancelados</DialogTitle>
            <DialogDescription>
                
                <div className="h-[420px] overflow-auto">
                    {data.map((item: any, index) => (
                        <div key={index} className="flex flex-col border-b mt-8">
                          <h3>{item.nome}</h3>
                          <h3>{item.cpf_cnpj}</h3>
                        </div>
                    ))}
                </div>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>


        </div>
    )

}