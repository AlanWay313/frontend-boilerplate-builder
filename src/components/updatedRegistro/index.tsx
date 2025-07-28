import api from "@/services/api"



export async function UpdatedRegistro({ protocolo, status_sincronismo, id}: any){


            const dataUpdated = {
                protocolo: protocolo,
                status_sincronismo: status_sincronismo,
                id: id
            }
        try {
            const result = await api.post("/entrega/atualizar-registro.php", dataUpdated)

            if(result){
              return result.data;

                
            }

            console.log("falha")
        } catch (error) {
            console.log(error)
        }
  

}