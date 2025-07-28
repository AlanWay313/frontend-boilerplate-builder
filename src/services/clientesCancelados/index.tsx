import useIntegrador from "@/hooks/use-integrador";
import api from "../api";


export async function ClientesCanceladosApi(){
    const integra: any = useIntegrador();

    try {

        const result = await api.get(
            "https://hub.sysprov.com.br/integraoletv/src/clientes/listarclientes.php",
            { params: { idIntegra: integra() } }
          );
          // Filtra apenas os clientes cancelados
          const clientesCancelados = result.data.data.filter(
            (cliente: any) => cliente.voalle_contract_status === "Cancelado"
          );


          return clientesCancelados;
        
    } catch (error) {
        console.log(error)
    }
}