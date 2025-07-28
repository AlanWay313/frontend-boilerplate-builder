import api from "./api";



export async function qtdTecnicos(){



    try {

        const result = await api.get("/usuarios/ler-usuarios.php");

        const qtd = result.data.data.filter((item: any) => item.ACTIVE === 1);

        return qtd.length
        
    } catch (error) {
        console.log(error)
    }



}