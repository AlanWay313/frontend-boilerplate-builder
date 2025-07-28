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
import api from "@/services/api";
import { useState } from "react";



export function CadastrarUsuario({ atualizarLista }: { atualizarLista: () => void }) {
  const [name, setName] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [ativo, setAtivo]: any = useState(true);
  const [password, setPassword] = useState("");

  async function CriarUser() {
    const data = {
      name: name,
      username: "",
      documento: documento,
      email: email,
      userpass: password,
      active: ativo === true,
    };

    try {
      const result = await api.post("/usuarios/criar-usuario.php", data);

      if (!result.data) {
        alert("Falha ao criar usuário!");
        return;
      }

      alert(result.data.message);
      setName("")
      setEmail("")
      setPassword("")
      setDocumento("")
      
      await atualizarLista()
      console.log(result.data);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("Erro ao criar usuário. Tente novamente.");
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger className="border p-2 rounded-lg bg-green-700 text-white">
          NOVO USUÁRIO
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar novo usuário</DialogTitle>
            <DialogDescription>
              Altere as informações do usuário abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full flex flex-col gap-2">
            <div>
              <label htmlFor="NAME">Nome</label>
              <Input
                id="NAME"
                name="NAME"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div>
              <label htmlFor="documento">Documento</label>
              <Input
                id="documento"
                name="documento"
                placeholder="sem pontuação"
                onChange={(e) => setDocumento(e.target.value)}
                value={documento}
                maxLength={11}
              />
            </div>

            <div>
              <label htmlFor="senha">Senha</label>
              <Input
                id="senha"
                type="password"
                name="senha"
                placeholder="Senha"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <div>
              <label htmlFor="ACTIVE">STATUS</label>
              <select
                id="ACTIVE"
                name="ACTIVE"
                className="w-full p-2 border rounded-lg"
                onChange={(e) => setAtivo(e.target.value)}
                value={ativo}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>

            <div className="mt-4">
              <Button className="w-full bg-green-600 hover:bg-green-600" onClick={CriarUser}>
                Criar Usuário
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
