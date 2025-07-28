import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/Auth";
import { Carrousel } from "@/components/carrousel";


export default function Login() {
  const [email, setEmail] = useState("");
  const [userpass, setUserpass] = useState("");

  
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <p>Erro ao carregar o contexto de autenticação.</p>;
  }

  const { singin }: any = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await singin({ email, password: userpass });
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-full h-screen flex-1 justify-center items-center text-center flex flex-col">
        <div className="w-[400px] flex items-start mb-10">
          <h3 className="text-3xl font-poppins">SysProv - Netcom</h3>
        </div>

        <form onSubmit={handleSubmit} className="w-[400px] flex flex-col gap-4">
          <div className="flex flex-col text-start gap-2">
            <label htmlFor="email" className="font-poppins">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              className="p-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col text-start gap-2">
            <label htmlFor="userpass" className="font-poppins">Senha</label>
            <input
              type="password"
              id="userpass"
              name="userpass"
              className="p-2 border rounded-lg"
              value={userpass}
              onChange={(e) => setUserpass(e.target.value)}
            />
          </div>

          <div className="w-full">
            <Button type="submit" className="w-full bg-blue-950 hover:bg-blue-800 p-6">
              Entrar
            </Button>
          </div>
        </form>

        <div className="w-[400px] items-start flex mt-8 flex-col gap-2">
        {/*  <img src={netcom} alt="logo_empresa" /> */}
          <h3 className="text-slate-400">©sysprov - desenvolvimentos</h3>
        </div>
      </div>

      <div className="w-full h-full flex-1 p-4">
        <div className="w-full h-full rounded-lg overflow-hidden">
          <Carrousel />
        </div>
      </div>
    </div>
  );
}
