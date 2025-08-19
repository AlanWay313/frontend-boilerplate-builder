import useIntegrador from "@/hooks/use-integrador";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

import { useState } from "react";
import Loading from 'react-loading';
export default function ReintegrarCliente({ nome }: any) {

    const [loading, setLoading] = useState<any>(false)
    const user: any = JSON.parse(localStorage.getItem("access") as any);
    const integrador: any = useIntegrador();

  const { toast }: any = useToast();


    async function Reintegra() {

        setLoading(true)
        try {
            
            const formData = new FormData();
            // Adiciona os parâmetros
            formData.append("idIntegra", integrador);
            formData.append("nome_cliente", String(nome));
            // Adiciona os cabeçalhos como parâmetros do FormData
            formData.append("Username", String(user.user));
            formData.append("Token", String(user.token));
            formData.append("Password", String(user.pass));

            const response = await api.post("/src/services/ReintegrarCliente.php", formData, {
                headers: {
                    "Content-Type": "multipart/form-data" // Define o tipo de conteúdo como multipart/form-data
                }
            });




            

            if(!response.data.message){
                 toast({
                    title: "REINTEGRAR",
                    description: "Reintegração realizada com sucesso, verifique o log para mais detalhes!"
                })

                setLoading(false)

                return;
            }
            
            
            toast({
                title: "REINTEGRAR",
                description: response.data.message
            })

            setLoading(false)




            
        } catch (error) {

            toast({
                title: "REINTEGRAR",
                description: "Falha ao reintegrar"
            })
            console.log(error);
            setLoading(false)
        }
    }

    return (
        <div className="cursor-pointer" onClick={Reintegra}>
            <p className="p-1 mt-2 border w-full flex items-center justify-center">
            {loading === true ? <Loading type="spin" color="#000" width={20} height={20} /> : "REINTEGRAR"}
            </p>
        </div>
    );
}
