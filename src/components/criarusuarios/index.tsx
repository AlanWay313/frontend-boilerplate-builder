import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useIntegrador from "@/hooks/use-integrador";
import api from "@/services/api";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CriarUsuariosProps = {
  listarUsuarios: () => void; // Tipagem correta da função
};

export function CriarUsuarios({ listarUsuarios }: CriarUsuariosProps) {
  const integra: any = useIntegrador();
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar o modal
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  async function criarUsuario() {
    try {
      const dataUser = {
        name,
        email,
        username,
        password,
        isActive: isActive === 'true' ? true : false,
        isAdmin: isAdmin === 'true' ? true : false,
      };

      await api.post(
        "https://hub.sysprov.com.br/integraoletv/src/services/CriarNovoUsuario.php",
        dataUser,
        {
          params: {
            integraId: integra(),
          },
        }
      );

      listarUsuarios(); // Atualizar a lista de usuários

      // Limpar os campos
      setName("");
      setEmail("");
      setUserName("");
      setPassword("");
      setIsActive("");
      setIsAdmin("");

      // Fechar o modal
      setIsOpen(false);
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Criar novo usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar usuário</DialogTitle>
          <DialogDescription>Crie um novo usuário</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div>
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              type="password"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={setIsActive} value={isActive}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status do usuário</SelectLabel>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="isAdmin">Admin?</Label>
            <Select onValueChange={setIsAdmin} value={isAdmin}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Nível de usuário</SelectLabel>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={criarUsuario}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
