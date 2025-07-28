import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ListarEtiquetas } from "../listaretiquetas";



interface EntregaProps {
    item: {
        nome_tecnico: string;
        endereco_completo: string;
        status_entrega: string;
        cpf: string;
        status_sincronismo: string
    };
}

export function DetalhesEntrega({ item }: EntregaProps) {
    return (
        <div>
            <Dialog>
                <DialogTrigger>detalhes</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalhes</DialogTitle>
                        <DialogDescription>
                            Técnico: {item?.nome_tecnico}
                        </DialogDescription>
                    </DialogHeader>

                    <div>
                        <h3>Endereço: {item.endereco_completo}</h3>
                        <h3>Status: {item.status_entrega}</h3>
                        <h3>Status sincronismo: {item.status_sincronismo}</h3>

                        <div className="mt-8">
                            <h3 className="p-2 bg-slate-100">Etiquetas:</h3>

                            <div>
                              

                                {item.status_sincronismo !== "sincronizado" && item.status_sincronismo !== null &&
                                <ListarEtiquetas documento={item.cpf} dataItens={item}/>

                                }
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
