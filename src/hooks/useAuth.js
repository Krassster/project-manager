import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvide";

export const useAuth = () => useContext(AuthContext);
