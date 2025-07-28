import { AuthContext } from "@/contexts/Auth";
import { useContext } from "react";

export default function useIntegrador() {
  const { Integrador }: any = useContext(AuthContext); 

  return Integrador; 
}
