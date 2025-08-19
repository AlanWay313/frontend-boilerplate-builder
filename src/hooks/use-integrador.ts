import { AuthContext } from "@/contexts/Auth";
import { useContext } from "react";

export default function useIntegrador() {
  const { getIntegrador } = useContext(AuthContext);
  return getIntegrador(); // chama a função
}
