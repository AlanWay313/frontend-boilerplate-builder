import api from "./api";
import { converterCoordenadasEmLote } from "./converterCordenadas";

export async function ListarCordenadas() {
    try {


        const result = await api.get("/entrega/listar-entregas.php");
;

        const coordenadas = result.data.data;

        if (!Array.isArray(coordenadas)) {
            throw new Error("❌ Os dados recebidos não são uma lista.");
        }

        // Criando lista de coordenadas formatadas corretamente
        const listaCoordenadas = coordenadas.map((item: any) => ({
            lat: parseFloat(item.latitude),
            lon: parseFloat(item.longitude)
        }));

     

        if (listaCoordenadas.length === 0) {
            throw new Error("⚠️ Nenhuma coordenada disponível para conversão.");
        }

        // Chamando função para converter coordenadas
        const resultado = await converterCoordenadasEmLote(listaCoordenadas);
 

        return resultado;
    } catch (error) {
        console.error("❌ Erro ao listar coordenadas:", error);
        return [];
    }
}
