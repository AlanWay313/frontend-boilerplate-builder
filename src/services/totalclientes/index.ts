

import api from "../api";



export async function TotalClienteDash(integrador: any){
    



    try {

        const result = await api.get(
            "/src/services/ClientecomContratos.php",
            {
              params: {
                idIntegra: integrador || "",
              },
            }
          );


          return result.data.data[0];
          


      
    } catch (error) {
        console.log(error)
    }
}