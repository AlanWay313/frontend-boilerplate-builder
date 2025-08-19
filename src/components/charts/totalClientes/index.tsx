import useIntegrador from '@/hooks/use-integrador';
import { TotalClienteDash } from '@/services/totalclientes';
import { useState } from 'react';
// Componentes de exemplo - substitua pelos seus componentes reais
export const TotalClientes = () => {
    const [totalClientesNumber, setToalCLienteNumber] = useState(0)
    
      const integrador = useIntegrador();
    
      async function totalClientes(){
        const numberCliente = await TotalClienteDash(integrador)
      
    
    
        setToalCLienteNumber(Number(numberCliente.nulos) + Number(numberCliente.nao_nulos))
      }
    
    
    totalClientes()

   return (
     <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            </div>
            <div>
                <h3 className="font-semibold text-gray-800">Total de Clientes</h3>
                <p className="text-sm text-gray-500">Clientes cadastrados</p>
            </div>
        </div>
        <div className="text-3xl font-bold text-blue-600 mb-2">{totalClientesNumber}</div>
        {/* <div className="text-sm text-green-600 font-medium">+12% este mês</div> */}
    </div>
   )
};