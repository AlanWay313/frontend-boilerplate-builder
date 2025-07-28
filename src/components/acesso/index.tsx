
import { AuthContext } from "@/contexts/Auth";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { useContext, useState } from "react";
import back from "@/assets/129016.jpg";


export default function Acesso(){

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

 

    const { singin }: any = useContext(AuthContext);

    
    const handleLogin = async (e: any) => {
        
        e.preventDefault();

        await singin({ email: email, password: password})
        
       

    }

    return (
        <div className="flex w-full h-screen overflow-hidden">
       
        <Card className="flex flex-col gap-4 w-[1250px] h-screen p-[120px]">
           
           <form className="flex flex-col gap-4 mt-20">
           <div className="flex flex-col gap-4 mb-10">
                <h3 className="text-3xl font-bold">INTEGRA OLÉ SYSPROV</h3>
                <p>Facil, rápido e simples. Integrando seu ERP com a Olé Tv</p>
            </div>
          <div>
            <label htmlFor="">E-mail</label>
            <Input type="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
          </div>

          <div>
            <label htmlFor="">Senha</label>
            <Input type="password" onChange={(s) => setPassword(s.target.value)} value={password}/>
          </div>

          <div className="w-full mt-10">
            <Button onClick={(e) => handleLogin(e)} className="flex w-full p-6 bg-blue-800 hover:bg-blue-900">Acessar agora</Button>
          </div>
           </form>

        </Card>


        <Card className={`w-full h-screen  rounded-lg bg-black relative`}>
         <img src={back} alt="bg" className="w-full h-screen object-cover" />
         <div className="bg-black/60 w-full h-screen top-0 z-10 absolute">

         </div>
        </Card>


        </div>
    )
}