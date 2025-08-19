import ClientesErros from "@/components/clienteserros";
import useIntegrador from "@/hooks/use-integrador";
import { TotalClienteDash } from "@/services/totalclientes";
import { useState } from "react";

export const AtivoInativos = () => {
    
       const [totalClientesNumber, setToalCLienteNumber]: any = useState(0)
       const [nulos, setNulos] = useState(0);
       const [naoNulos, setNaoNulos] = useState(0)
       const integrador = useIntegrador()
     
       async function totalClientes(){
         const numberCliente = await TotalClienteDash(integrador)
       
         setToalCLienteNumber(Number(numberCliente.nulos) + Number(numberCliente.nao_nulos))
         setNulos(numberCliente.nulos);
         setNaoNulos(numberCliente.nao_nulos)
       }
     
     
     totalClientes()
    
    
     const percentual = totalClientesNumber > 0 ? (nulos / totalClientesNumber * 100) : 0

    return (
         <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h3 className="font-semibold text-gray-800">Ativos/Inativos </h3>
                <p className="text-sm text-gray-500">Status dos clientes</p>
            </div>
        </div>
        <div className="flex gap-4">
            <div>
                <div className="text-2xl font-bold text-green-600">{naoNulos}</div>
                <div className="text-xs text-gray-500">Ativos</div>
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-400">{nulos}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">Inativos <ClientesErros /></div>
                <div className="hidden"><p>{percentual}</p></div>

                
            </div>
        </div>
    </div>
    )
}