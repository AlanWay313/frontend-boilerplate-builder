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
import api from "@/services/api"

export default function ResetSenha({ contratoCliente, emailCliente }: any) {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false) // estado do loading
  const { toast }: any = useToast()

  const handleResetSenha = async () => {
    try {
      setLoading(true)

      const result: any = await api.get("/src/models/ResetarSenhaCliente.php", {
        params: {
          contratoCliente: contratoCliente,
          emailCliente: emailCliente,
        },
      })

      console.log(result)

      if (!result || !result.data) {
        toast({
          title: "Resetar senha do usuário",
          description: "Ocorreu um erro ao resetar a senha!",
          variant: "destructive",
        })
        return
      }

      // pega msg ou message dependendo de qual vier
      const mensagem = result.data.msg || result.data.message || "Operação concluída."

      toast({
        title: "Resetar senha do usuário",
        description: mensagem,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro no servidor",
        description: "Não foi possível resetar a senha. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleConfirmReset = () => {
    setOpenModal(false)
    handleResetSenha()
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
              Ao resetar a senha, o cliente receberá instruções no e-mail cadastrado. Deseja prosseguir?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenModal(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset} disabled={loading}>
              {loading ? "Enviando..." : "Sim"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Botão para iniciar o processo de reset */}
      <Button onClick={handleOpenModal} disabled={loading}>
        {loading ? "Processando..." : "RESETAR SENHA"}
      </Button>
    </div>
  )
}
