import { useContext, useEffect, useState } from "react";
import { ClockAlert, HandCoins, Handshake, LayoutDashboard, SlidersHorizontal, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { IoIosArrowBack } from "react-icons/io";

import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";


import { AuthContext } from "@/contexts/Auth";

export default function Sidebar() {
  const { logout }: any = useContext(AuthContext);


  const authData: any = localStorage.getItem("auth");
  const userData: any = JSON.parse(authData)


  const documento = userData?.documento || userData?.data.email;
  const name = userData?.data.name || "Usuário";
  const email = userData?.email || documento;
  const isAdmin = userData && userData.data ? Number(userData.data.isAdmin) : 0;

  const itemnav = [
    { 
      icon: <LayoutDashboard />, name: "Dashboard", link: "/" 
    },
    { 
      icon: <Handshake />, name: "Clientes", link: "/clientes" 
    },
    { 
      icon: <ClockAlert />, name: "Logs", link: "/logs" 
    },

    isAdmin &&
   {
    
      icon: <HandCoins />, name: "Financeiro", link: "/financeiro" 
    
   },
   isAdmin &&
    { 
      icon: <SlidersHorizontal />, name: "Configurações", link: "/configuracoes" 
    },
    isAdmin && { 
      icon: <UsersRound />, name: "Usuários", link: "/usuarios" 
    },
  ].filter(Boolean);

  const [activeItem, setActiveItem] = useState<string | null>(null);


  useEffect(() => {
    const savedItem = localStorage.getItem("activeMenuItem");
    if (savedItem) setActiveItem(savedItem);
  }, []);


  const handleItemClick = (link: string) => {
    setActiveItem(link);
    localStorage.setItem("activeMenuItem", link);
  };

  return (
    <Card className="w-[270px] h-screen p-4 shadow-lg flex flex-col bg-[#1b1b1b] text-white fixed">
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        
        <h3 className="text-lg font-semibold tracking-wide">NetCom - Sysprov</h3>
        <button className="p-2 rounded-lg hover:bg-gray-700 transition">
          <IoIosArrowBack size={24} />
        </button>
      </div>

      <nav className="mt-10">
        <ul className="flex flex-col gap-4">
          {itemnav.map((item: any) => (
            <Link to={item.link} key={item.name}>
              <li
                onClick={() => handleItemClick(item.link)}
                className={`cursor-pointer flex items-center gap-2 p-2 rounded ${
                  activeItem === item.link
                    ? "bg-blue-800 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`}
              >
                {item.icon}
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      {/* Rodapé com informações do usuário */}
      <div className="mt-auto flex items-center justify-between gap-3 p-4 border-t border-gray-700">
    <div className="flex gap-2">
    <div className="min-w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold">
          {String(name).charAt(0)}

          
        </div>
        <div>
            <h3 className="text-sm font-medium">{name}</h3>
            <p className="text-xs text-gray-400">{email}</p>
          </div>
    </div>
        <div className="flex flex-row items-center justify-between">
        
          <DropdownMenu>
            <DropdownMenuTrigger className="flex justify-end items-end">
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel onClick={logout} className="cursor-pointer">
                Sair
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
