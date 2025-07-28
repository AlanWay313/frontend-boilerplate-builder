import axios from "axios";

export async function converterCoordenadasEmLote(listaCordenadas: { lat: number, lon: number }[]) {
    console.log("🔄 Iniciando conversão de coordenadas...");
    const resultados = [];

    for (const { lat, lon } of listaCordenadas) {
        try {
          

            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );

            const data = response.data;
            console.log("🔎 Resposta do OpenStreetMap:", data);

            const cidade = data.address?.city || data.address?.town || data.address?.village || "Cidade não encontrada";

            resultados.push({
                latitude: lat,
                longitude: lon,
                endereco: data.display_name,
                cidade: cidade
            });

          

   
        } catch (error: any) {
            console.error("❌ Erro ao buscar coordenadas:", error.message);
        }
    }

    console.log("✅ Conversão finalizada!");
    return resultados;
}
