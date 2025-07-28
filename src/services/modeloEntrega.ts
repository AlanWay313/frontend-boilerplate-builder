import api from "./api"



export async function ModeloEntregaApi(){

    try {

        const result = await api.get("/entrega/listar-entregas.php");

        const filtrar = result.data.data

        const filtradosOnline = filtrar.filter((item: any) => item.endereco_completo === "")
        const filtradosOffline = filtrar.filter((item: any) => item.endereco_completo !== "")



        const ofeline = {
            online: filtradosOnline.length,
            offline: filtradosOffline.length
        }

       

        return ofeline

      
        

        
    } catch (error) {
        console.log(error)
    }
}