import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import DashboardPage from "./pages/Dashboard";
import Login from "./pages/Login";



import { Clientes } from "./pages/Clientes";
import { Logs } from "./pages/Logs";
import Financeiro  from "./pages/Financeiro";
import { Configuracoes } from "./pages/Configuracoes";
import { Usuarios } from "./pages/Usuarios";
import { useEffect, useState } from "react";


// Função para verificar se o usuário é admin
const getIsAdmin = () => {
  const authData = localStorage.getItem("auth");
  if (authData) {
    const user = JSON.parse(authData);
    return Number(user?.data?.isAdmin) || false;
  }
  return false;
};

// Função para verificar se o usuário está logado
const isLogged = () => {
  const authData = localStorage.getItem("auth");
  if (authData) {
    const dadosConvertidos = JSON.parse(authData);
    return dadosConvertidos.success;
  }
  return false;
};

// Componente que verifica se o usuário está logado antes de renderizar a rota
const PrivateRoute = ({ element }: any) => {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = isLogged();
    setAuth(authStatus);
  }, []);

  if (auth === null) {
    return <div>Loading...</div>;
  }

  return auth ? element : <Navigate to="/login" />;
};



// Componente para rotas que requerem que o usuário seja admin
const AdminRoute = ({ element }: any) => {
  const [isAdmin, setIsAdmin] = useState<any>(null);

  useEffect(() => {
    const adminStatus = getIsAdmin();
    setIsAdmin(adminStatus);
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>; // Exibe um loading enquanto verifica o status de admin
  }

  if (!isLogged()) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/home" />;
  }

  return element;
};

export const routes = createBrowserRouter([
  {
    path: "/",
    element: isLogged() ? <App /> : <Navigate to="/login" />,
    children: [
      { path: "/", element: <PrivateRoute element={<DashboardPage />} /> },
      { path: "clientes", element: <PrivateRoute element={<Clientes />} /> },
      { path: "logs", element: <PrivateRoute element={<Logs />} /> },
      { path: "financeiro", element: <AdminRoute element={<Financeiro />} /> },
      { path: "configuracoes", element: <AdminRoute element={<Configuracoes />} /> },
      { path: "usuarios", element: <AdminRoute element={<Usuarios />} /> },
      
    ],
  },
  {
    path: "/login",
    element: isLogged() ? <Navigate to="/dashboard" /> : <Login />,
  }
  
]);
