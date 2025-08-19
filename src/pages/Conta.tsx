import { useState } from "react";
import { User, Shield, Mail, Key } from "lucide-react";
import useUserId from "@/hooks/use-user";

import userDataData from "@/hooks/use-usersall";
import { AlterarSenhaModal } from "@/components/mudarsenha";





const userData = userDataData();
export default function Conta() {
  const [showModal, setShowModal] = useState(false);
  const idUser = useUserId();


  const handleChangePassword = () => {
    setShowModal(true);
  };




  return (
    <div className=" mx-auto p-6 space-y-6">
      {/* Header da Página */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Minha Conta</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e configurações de segurança</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Perfil */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Informações do Perfil</h2>
           {/*    <button
                onClick={handleEditProfile}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
              >
                <Settings className="w-4 h-4 mr-2" />
                Editar
              </button> */}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{userData.name}</h3>
                <p className="text-gray-500">Conta {userData.accountType}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                </div>
              </div>
              
           {/*    <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Membro desde</p>
                  <p className="text-sm text-gray-600">{userData.joinDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Último acesso</p>
                  <p className="text-sm text-gray-600">{userData.lastLogin}</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Painel de Ações */}
        <div className="space-y-4">
          {/* Segurança */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Segurança</h3>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleChangePassword}
                className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Key className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Alterar Senha</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-800">Conta verificada</span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Configurações Rápidas */}
          
        </div>
      </div>

      {/* Modal de Alteração de Senha */}
      <AlterarSenhaModal
        userId={idUser}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}