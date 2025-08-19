import { useContext, useEffect, useState } from "react";
import { ClockAlert, Handshake, LayoutDashboard, UsersRound, User } from "lucide-react";
import { Link } from "react-router-dom";


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

  const authData: any = localStorage.getItem("auth_user");
  const userData: any = JSON.parse(authData);

  const documento = userData?.documento || userData?.email;
  const name = userData?.name || "Usuário";
  const email = userData?.email || documento;
  const isAdmin = userData && userData ? Number(userData.isAdmin) : 0;

  const itemnav = [
    { 
      icon: <LayoutDashboard size={18} />, name: "Dashboard", link: "/", shortcut: ""
    },
    { 
      icon: <Handshake size={18} />, name: "Clientes", link: "/clientes", shortcut: ""
    },
    { 
      icon: <ClockAlert size={18} />, name: "Logs", link: "/logs", shortcut: ""
    },

    /* isAdmin && {
      icon: <HandCoins size={18} />, name: "Financeiro", link: "/financeiro", shortcut: "⌘4"
    } */,

    isAdmin && { 
      icon: <UsersRound size={18} />, name: "Usuários", link: "/usuarios", shortcut: ""
    },

    { 
      icon: <User size={18} />, name: "Minha conta", link: "/conta", shortcut: ""
    },

       /*  isAdmin && { 
      icon: <SlidersHorizontal size={18} />, name: "Configurações", link: "/configuracoes", shortcut: "⌘5"
    }, */
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
    <div className="w-[280px] h-screen bg-white border-r border-gray-200 flex flex-col fixed shadow-sm">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Frionline</h3>
            <span className="text-xs text-gray-500">Sysprov</span>
          </div>
        </div>

        {/* Search Bar */}
      
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {itemnav.map((item: any) => (
            <Link to={item.link} key={item.name}>
              <li
                onClick={() => handleItemClick(item.link)}
                className={`group cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeItem === item.link
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${
                    activeItem === item.link ? "text-blue-600" : "text-gray-500"
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">{item.shortcut}</span>
              </li>
            </Link>
          ))}
        </ul>

        {/* Shared Section */}
    {/*     <div className="mt-8">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Compartilhado</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <ul className="space-y-1 mt-2">
            <li className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">Documentos</span>
            </li>
          </ul>
        </div> */}

        {/* Projects Section */}
    {/*     <div className="mt-6">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Projetos</span>
          </div>
          <ul className="space-y-1 mt-2">
            <li className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">Sistema</span>
            </li>
            <li className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm font-medium">Relatórios</span>
            </li>
            <li className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-sm font-medium">Backup</span>
            </li>
          </ul>
        </div> */}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-gray-100">
        {/* Settings and Help */}
    {/*     <div className="px-3 py-3 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
            <Settings size={18} className="text-gray-500" />
            <span className="text-sm font-medium">Configurações</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
            <HelpCircle size={18} className="text-gray-500" />
            <span className="text-sm font-medium">Ajuda</span>
          </div>
        </div> */}

        {/* User Profile */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {String(name).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{name}</h4>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                <EllipsisVertical size={16} className="text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuLabel className="text-gray-700">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuLabel 
                  onClick={logout} 
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  Sair
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}