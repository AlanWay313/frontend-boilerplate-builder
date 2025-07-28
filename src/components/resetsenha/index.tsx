import axios from "axios"
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

export default function ResetSenha({ contratoCliente, emailCliente }: any) {
  const [openModal, setOpenModal] = useState(false) // Inicializa como falso
  const { toast }: any = useToast()

  // Função para resetar a senha, chamada após confirmação
  const handleResetSenha = async () => {
    try {
      const result: any = await axios.get(
        "https://hub.sysprov.com.br/integraoletv/src/models/ResetarSenhaCliente.php",
        {
          params: {
            contratoCliente: contratoCliente,
            emailCliente: emailCliente,
          },
        }
      )

     if(!result){
      toast({
        title: "Resetar senha do usuário",
        description: "Ocorreu um erro ao resetar a senha!",
      })

      return;
     }

     if(result.data === null){
      toast({
        title: "Resetar senha do usuário",
        description: "Ocorreu um erro ao resetar a senha!",
      })

      return;
     }
      toast({
        title: "Resetar senha do usuário",
        description: result.data.message,
      })
    } catch (error) {
      console.log(error)
    }
  }

  // Função para abrir o modal
  const handleOpenModal = () => {
    setOpenModal(true)
  }

  // Função para quando o usuário confirmar "Sim"
  const handleConfirmReset = () => {
    setOpenModal(false) // Fecha o modal
    handleResetSenha() // Realiza o reset da senha
  }

  return (
    <div>
      {/* Modal de confirmação */}
      <AlertDialog open={openModal} onOpenChange={setOpenModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja resetar a senha do cliente?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ao resetar a senha, o cliente receberá instruções no e-mail
              cadastrado. Deseja prosseguir?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenModal(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset}>
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Botão para iniciar o processo de reset */}
      <Button onClick={handleOpenModal}>RESETAR SENHA</Button>
    </div>
  )
}
