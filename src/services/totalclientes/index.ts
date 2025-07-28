import useIntegrador from "@/hooks/use-integrador";

import api from "../api";



export async function TotalClienteDash(){
    const integra: any = useIntegrador();



    try {

        const result = await api.get(
            "https://hub.sysprov.com.br/integraoletv/src/services/ClientecomContratos.php",
            {
              params: {
                idIntegra: integra() || "",
              },
            }
          );


          return result.data.data[0];
          


      
    } catch (error) {
        console.log(error)
    }
}