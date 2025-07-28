
import api from "./api";

async function tagPerClient(data: any) {
  const apiUrl = "/etiquetas/buscar-etiquetas.php";

  try {
    const result = await api.post(apiUrl, data);

    return result.data.etiquetas
  } catch (error) {
    console.error("Erro ao acessar o endpoint externo:", error);
    throw new Error("Erro ao acessar o endpoint externo");
  }
}

export default tagPerClient;
