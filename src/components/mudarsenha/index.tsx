import { toast } from "@/hooks/use-toast";
import api from "@/services/api";
import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

interface AlterarSenhaModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AlterarSenhaModal({ userId, isOpen, onClose }: AlterarSenhaModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
       await api.put("/src/services/AlterarSenha.php", {
        id: userId,
        password: password,
      });

      toast({
        title: "Alterar senha",
        description: `sua senha foi alterada com sucesso!`,
      });
    
      setPassword("");
      setSuccess(true); // Mostra tela de sucesso
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao alterar senha.";

       toast({
        title: "Alterar senha",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setPassword("");
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        {/* Botão X para fechar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tela de Sucesso */}
        {success ? (
          <div className="text-center py-4">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-green-600">Senha Alterada!</h2>
            <p className="text-gray-600 mb-6">Sua senha foi alterada com sucesso.</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Concluído
            </button>
          </div>
        ) : (
          /* Formulário de Alteração */
          <>
            <h2 className="text-xl font-semibold mb-4">Alterar minha senha</h2>

            <form onSubmit={handleSubmit}>
              <label className="block mb-2 font-medium">Nova senha</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}