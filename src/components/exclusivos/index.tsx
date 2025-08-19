import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MaskedInput from 'react-text-mask'; // Importa o MaskedInput
import api from "@/services/api";

export default function Exclusivos() {
    const [nome, setNome] = useState<string>("");
    const [documento, setDocumento] = useState<string>("");
    const [tipoDocumento, setTipoDocumento] = useState<string>("CPF"); // Adiciona estado para o tipo de documento
    const [idIntegra, setIdIntegra] = useState<string>("");
    const [close, setClose] = useState<boolean>(false);

    const user: any = JSON.parse(localStorage.getItem("auth") as any);
    const { toast } = useToast();

    useEffect(() => {
        setIdIntegra(user.data.integrador);
    }, []);

    const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
        setDocumento(value); // Armazena apenas os números
    };

    // Define a máscara com base no tipo de documento selecionado
    const getMask = () => {
        return tipoDocumento === "CPF"
            ? [/[1-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/]
            : [/[1-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];
    };

    const handleSetCustomer = async () => {
        const data = {
            nome: nome,
            documento: documento
        };

        try {
            const result = await api.post("/src/services/WhiteList.php", data, {
                params: {
                    idIntegra: idIntegra
                }
            });

            toast({
                title: "Cadastro",
                description: result.data.message
            });

            // Limpar os campos e fechar o modal após o sucesso
            setNome("");
            setDocumento("");
            setTipoDocumento("CPF"); // Reseta para CPF após o sucesso
            setClose(false);

        } catch (error: any) {
            toast({
                title: "Cadastro",
                description: error.message
            });
            console.log(error);
        }
    };

    return (
        <div>
            <Card className="w-[350px] h-[280px] p-4 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold">Adicionar clientes especiais</h3>
                    <p className="text-[12px] mt-2">Clientes especiais não sofrerão alterações, quando houver mudanças no contrato do cliente dentro do ERP</p>
                </div>

                <div>
                    <Dialog open={close} onOpenChange={setClose}>
                        <DialogTrigger className="bg-zinc-400 p-2 rounded text-white hover:bg-gray-700">Adicionar</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>CLIENTE ESPECIAL</DialogTitle>
                                <DialogDescription className="mt-4">
                                    Adicione um cliente especial à lista.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 flex flex-col gap-4">

                                <div className="flex flex-col">
                                    <label htmlFor="">Nome</label>
                                    <Input onChange={(e) => setNome(e.target.value)} value={nome} />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="">Tipo de Documento</label>
                                    <select 
                                        value={tipoDocumento}
                                        onChange={(e) => setTipoDocumento(e.target.value)} 
                                        className="p-2 border-2 rounded"
                                    >
                                        <option value="CPF">CPF</option>
                                        <option value="CNPJ">CNPJ</option>
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="">Documento</label>
                                    <MaskedInput
                                        className="p-2 border-2 rounded"
                                        mask={getMask()} // Aplica a máscara dinâmica
                                        placeholder={`Digite ${tipoDocumento}`} // Ajusta o placeholder
                                        value={documento} // Permite a digitação completa
                                        onChange={handleDocumentoChange}
                                    />
                                </div>

                                <div>
                                    <Button onClick={handleSetCustomer}>Cadastrar cliente</Button>
                                </div>

                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </Card>
        </div>
    );
}
