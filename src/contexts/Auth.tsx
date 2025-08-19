import { createContext, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";


interface DataLogin {
  email: string;
  password: string;
}

interface AuthContextProps {
  signin: (data: DataLogin) => Promise<void>;
  logout: () => void;
  isLogged: () => boolean;
  getIntegrador: () => string | null;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  const signin = useCallback(async ({ email, password }: DataLogin) => {
    try {
      const result = await api.post("/src/services/AutenticarUsuario.php", { email, password });

      if (!result.data.success) {
        toast({
          title: "Erro no login",
          description: result.data.message,
          variant: "destructive",
        });
        return;
      }

      const { user, accessToken, refreshToken, access } = result.data.data;

      toast({
        title: "Login realizado",
        description: `Bem-vindo ${user.name}`,
      });

      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("activeMenuItem", "dashboard");
      localStorage.setItem("access", JSON.stringify(access));

      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Erro no servidor",
        description: "Não foi possível realizar o login. Tente novamente.",
        variant: "destructive",
      });
      console.error(error);
    }
  }, [toast]);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("activeMenuItem");
    window.location.href = "/login";
  }, []);

  const isLogged = useCallback(() => {
    const token = localStorage.getItem("access_token");
    return !!token;
  }, []);

  const getIntegrador = useCallback(() => {
    const user = localStorage.getItem("auth_user");
    if (!user) return null;
    const parsed = JSON.parse(user);
    return parsed.integrador || null;
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem("access_token");
  }, []);

  return (
    <AuthContext.Provider value={{ signin, logout, isLogged, getIntegrador, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}
