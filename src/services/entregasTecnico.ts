import api from "./api"



export async function EntregasTecnico(){

    try {
        const result = await api.get("/entrega/listar-entregas-tecnicos.php")

        return result.data.data
    } catch (error) {
        console.log(error)
    }
}