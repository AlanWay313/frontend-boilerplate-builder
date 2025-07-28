'use client'


import { AtivoInativos } from "../charts/ativosInativos";
import { ClientesCancelados } from "../charts/clientesCancelados";
import { TotalClientes } from "../charts/totalClientes";


export function Dashboard(){


 

    return (
       <div className="flex flex-col gap-2">
        <div className="grid grid-cols-4 w-full gap-2 ">
       
        <TotalClientes />
        <ClientesCancelados />

        <AtivoInativos />
       
        </div>

        <div className="w-full">
         
        </div>


   

       </div>
    )
}