import { Banknote } from "lucide-react";



export default function TaxaImplantacao(){

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2"><Banknote /> Taxa de Integração</h3>
            
            <h3 className="text-2xl font-semibold">R$ 1.000</h3>
            </div>


            <div className="p-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2"><strong className="text-white p-[4px] rounded-full w-[150px] flex items-center justify-center bg-green-800">Pago</strong></h3>
                <h3>1X</h3>
            </div>
        </div>
    )
}