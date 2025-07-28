import {  useToast } from "@/hooks/use-toast";
import axios from "axios";
import { createContext } from "react";



interface DataLogin {
    email: string,
    password: string
}

export const AuthContext = createContext({});




export default function AuthProvider({ children }: any){


     const { toast } = useToast();

    const singin = async ({ email, password }: DataLogin) => {
        try {
            const dataLogin: DataLogin = {
                email: email,
                password: password
            }

            const result = await axios.post("https://hub.sysprov.com.br/integraoletv/src/services/AutenticarUsuario.php", dataLogin);
             if(result.data.success === false){
                return toast({
                    title: "Realizar login",
                    description: result.data.message
                })
             }

             toast({
                title: "Realizar login",
                description: result.data.message
            })

            localStorage.setItem("auth", JSON.stringify(result.data));
            localStorage.setItem("activeMenuItem", "dashboard");

             document.location.href = "/";
            
        } catch (error) {
            console.log(error)
        }
    }


    const Integrador = () => {
        const isLogged: any = localStorage.getItem("auth");

        if(isLogged){
            const dadosCOnvertidos = JSON.parse(isLogged)

    

            return dadosCOnvertidos.data.integrador;
        }
    }

 


    const logout = () => {

        localStorage.removeItem("auth");
        localStorage.removeItem("activeMenuItem");
        document.location.href = "login";
    }


  
    const isLogged = () => {

        const isLogged: any = localStorage.getItem("auth");

        if(isLogged){
            const dadosCOnvertidos = JSON.parse(isLogged)

    

            return dadosCOnvertidos.success;
        }
        

    }



    return (
        <AuthContext.Provider value={{ singin, isLogged, logout, Integrador }}>
            {children}
        </AuthContext.Provider>
    )
}