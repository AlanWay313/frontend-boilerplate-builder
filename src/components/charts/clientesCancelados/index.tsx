import VerCancelados from "@/components/vercancelados";
import useIntegrador from "@/hooks/use-integrador";
import { ClientesCanceladosApi } from "@/services/clientesCancelados";
import React from "react";

export const ClientesCancelados = () => {
    
         const [cancelados, setCancelados]: any = React.useState(0)
          const integrador: any = useIntegrador();


           async function Cancelados(){
              const clientesCancelados = await ClientesCanceladosApi(integrador)
              setCancelados(clientesCancelados.length)
            }
          
            React.useEffect(() => {
              Cancelados()
            }, [])
    return (
           <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                </svg>
            </div>
            <div>
                <h3 className="font-semibold text-gray-800 flex  items-center gap-2">Clientes Cancelados <VerCancelados /></h3>
                <p className="text-sm text-gray-500">Cancelamentos</p>
            </div>
        </div>
        <div className="text-3xl font-bold text-red-600 mb-2">{cancelados}</div>
        {/* <div className="text-sm text-red-600 font-medium">+8% este mês</div> */}
    </div>
    )
}