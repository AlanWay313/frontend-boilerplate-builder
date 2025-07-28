import { TabelaDeClientes } from "@/components/tabelaclientes";
import { TitlePage } from "@/components/title";



export function Clientes(){


    return (
        <div>
            <TitlePage title="Clientes"/>

            <TabelaDeClientes />
        </div>
    )
}