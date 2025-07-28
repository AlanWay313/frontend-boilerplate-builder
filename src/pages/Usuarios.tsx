import { CriarUsuarios } from "@/components/criarusuarios";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useIntegrador from "@/hooks/use-integrador";
import api from "@/services/api";

import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,

    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeletarUsuario } from "@/components/deletarusuario";
import { TitlePage } from "@/components/title";
export function Usuarios() {
  const [data, setData] = useState([]);
  const integra: any = useIntegrador();

  async function listarUsuarios() {
    try {
      const result = await api.get(
        "https://hub.sysprov.com.br/integraoletv/src/services/ListarUsuarios.php",
        {
          headers: {
            idintegra: integra(),
          },
        }
      );

      if (result) {
        setData(result.data.data);
      }
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
    }
  }

  useEffect(() => {
    listarUsuarios();
  }, []);

  return (
    <div>
      <TitlePage title="Usuários"/>

      <div className="p-3">
        <CriarUsuarios listarUsuarios={listarUsuarios} />
        <Table>
          <TableCaption>Lista de usuários</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead className="text-right">Ativo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell className="text-right">
                  {user.isActive === 1 ? "Sim" : "Não"}
                </TableCell>

                <TableCell className="text-right">
                <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent hover:bg-transparent p-0">  <EllipsisVertical className="text-black"/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-6">
        <DropdownMenuLabel>Ações usuários</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Editar
            <DropdownMenuShortcut><Pencil /></DropdownMenuShortcut>
          </DropdownMenuItem>
     
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DeletarUsuario idUser={user.id} listarUsuarios={listarUsuarios}/>
            <DropdownMenuShortcut><Trash /></DropdownMenuShortcut>
          </DropdownMenuItem>
        
        </DropdownMenuGroup>
  
        <DropdownMenuSeparator />
        
     
      </DropdownMenuContent>
    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
