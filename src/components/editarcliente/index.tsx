import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Pen } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Loading from 'react-loading';
export default function EditarCliente({ data }: any) {
    const [id] = useState(data.id); // Não é necessário alterar o ID
    const [nome, setNome] = useState(data.nome);
    const [cpfCnpj, setCpfCnpj] = useState(data.cpf_cnpj);
    const [email, setEmail] = useState(data.email);
    const [telefoneDDD, setTelefoneDDD] = useState(data.telefone_ddd);
    const [telefoneNumero, setTelefoneNumero] = useState(data.telefone_numero);
    const [enderecoCEP, setEnderecoCEP] = useState(data.endereco_cep);
    const [enderecoLogradouro, setEnderecoLogradouro] = useState(data.endereco_logradouro);
    const [enderecoNumero, setEnderecoNumero] = useState(data.endereco_numero);
    const [enderecoBairro, setEnderecoBairro] = useState(data.endereco_bairro);
    const [data_nascimento, setDataNascimento] = useState(data.data_nascimento);
    const [loading, setLoading] = useState<any>(false)
    const [close, setClose] = useState<any>()
    


    const { toast }: any = useToast();
 
    const handleEdit = async () => {

        const data = {
            id, // Passando o ID aqui
            nome,
            cpf_cnpj: cpfCnpj,
            email,
            telefone_ddd: telefoneDDD,
            telefone_numero: telefoneNumero,
            endereco_cep: enderecoCEP,
            endereco_logradouro: enderecoLogradouro,
            endereco_numero: enderecoNumero,
            endereco_bairro: enderecoBairro,
            cobranca_logradouro: enderecoLogradouro,
            cobranca_numero: enderecoNumero,
            cobranca_bairro: enderecoBairro,
            data_nascimento: data_nascimento
        }
        try {

            setLoading(true)
            const response = await axios.put(`https://hub.sysprov.com.br/integraoletv/src/models/EditarClienteOle.php`, data);


            setClose(false);

           

            

            toast({
                title: "Editar Cliente",
                description:  response.data.message
            })
           
            setLoading(false)
             
        } catch (error) {
            console.error("Erro ao editar cliente:", error);
        }
    };

    return (
        <div>
            <Dialog open={close}>
                <DialogTrigger className="flex items-center gap-2 p-2 justify-center rounded border w-full mt-2">
                    <Pen /> EDITAR
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="mb-10 flex flex-col gap-2">
                            <DialogTitle>Editar {data.nome}</DialogTitle>
                            <hr />
                        </div>
                        <DialogDescription className="flex flex-col gap-4 mt-10">
                            <div hidden>
                                <label htmlFor="">ID</label>
                                <Input value={id} readOnly /> {/* ID não deve ser editável */}
                            </div>

                            
                            <div>
                                <label htmlFor="">Nome</label>
                                <Input value={nome} onChange={(e) => setNome(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="">CPF/CNPJ</label>
                                <Input value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="">E-mail</label>
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="">Data de nascimento</label>
                                <Input value={data_nascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="">DDD</label>
                                <Input value={telefoneDDD} onChange={(e) => setTelefoneDDD(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="">Telefone</label>
                                <Input value={telefoneNumero} onChange={(e) => setTelefoneNumero(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="">CEP</label>
                                <Input value={enderecoCEP} onChange={(e) => setEnderecoCEP(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="">Endereço</label>
                                <Input value={enderecoLogradouro} onChange={(e) => setEnderecoLogradouro(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="">Número</label>
                                <Input value={enderecoNumero} onChange={(e) => setEnderecoNumero(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="">Bairro</label>
                                <Input value={enderecoBairro} onChange={(e) => setEnderecoBairro(e.target.value)} />
                            </div>
                            <div className="w-full">
                                <Button className="w-full cursor-pointer bg-blue-800 text-white" variant="outline" onClick={handleEdit}>
                                    {loading === true ? <Loading type="spin" color="#000" width={20} height={20} /> : "Editar"}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
