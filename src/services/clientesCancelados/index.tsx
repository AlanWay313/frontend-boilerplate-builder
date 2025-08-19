
import api from "../api";


export async function ClientesCanceladosApi(integrador: any){
   
   
    try {

        const result = await api.get(
            "/src/clientes/listarclientes.php",
            { params: { idIntegra: integrador } }
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