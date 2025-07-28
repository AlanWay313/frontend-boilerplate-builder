

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { EllipsisVertical } from "lucide-react"
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
  

export default function EditarPerfil(){

    const [name, setName] = useState<any>("");
    const [email, setEmail] = useState<any>("");
    const user: any = JSON.parse(localStorage.getItem("auth") as any);
    

    useEffect(() => {
        setName(user.data.name);
        setEmail(user.data.email);
    }, [])

    

    return (
        <>
        <Dialog>
  <DialogTrigger><EllipsisVertical className="cursor-pointer"/></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>EDITAR PERFIL</DialogTitle>
      <DialogDescription className="flex flex-col gap-2">
        
       <div className="flex flex-col gap-4 mt-2">
         
      <div className="flex flex-col gap-2">
        <label htmlFor="nome">Nome</label>
      <Input type="text" value={name} onChange={(e) => setName(e.target.value)} id="nome"/>
      </div>
     

     <div className="flex flex-col gap-2">
        <label htmlFor="email">E-mail</label>
     <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id="email"/>
     </div>


     <div>

        <Button>Editar perfil</Button>
     </div>
       </div>
    

      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

        </>
    )
}