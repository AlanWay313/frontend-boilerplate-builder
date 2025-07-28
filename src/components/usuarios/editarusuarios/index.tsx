import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api";
import { useEffect, useState } from "react";

interface IUser {
  id: string;
  NAME: string;
  email: string;
  documento: string;
  ACTIVE: string | boolean;
  
}



export function EditarUsuarios(props: { item: IUser, atualizar: any }) {
  const [userData, setUserData] = useState<IUser>({ ...props.item });

  useEffect(() => {
    setUserData({ ...props.item }); // Sincroniza o estado ao abrir o modal com outro usuário
  }, [props.item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      ACTIVE: value === "true", // Converte para booleano
    }));
  };

  const handleSubmit = async () => {
    console.log("Dados enviados:", userData);
    try {
      const result = await api.post("/usuarios/editar-usuario.php", {
        id: userData.id,
        name: userData.NAME, // Corrigido para `name`, como esperado pelo backend
        email: userData.email,
        documento: userData.documento,
        active: userData.ACTIVE ? 1 : 0, // Convertendo para `1` ou `0`
      });

      props.atualizar()
      toast({ title: "Editar usuário", description: result.data.message });
    
    } catch (error: any) {
      toast({ title: "Editar usuário", description: error.message });
   
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Editar</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuário {props.item.NAME}</DialogTitle>
            <DialogDescription>Altere as informações do usuário abaixo.</DialogDescription>
          </DialogHeader>

          <div className="w-full flex flex-col gap-2">
            <div>
              <label htmlFor="NAME">Nome</label>
              <Input
                id="NAME"
                name="NAME"
                value={userData.NAME}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="documento">Documento</label>
              <Input
                id="documento"
                name="documento"
                value={userData.documento}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="ACTIVE">STATUS</label>
              <select
                id="ACTIVE"
                name="ACTIVE"
                value={userData.ACTIVE ? "true" : "false"}
                onChange={handleSelectChange}
                className="w-full p-2 border rounded"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>

            <div>
              <Button onClick={handleSubmit}>Salvar Alterações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
