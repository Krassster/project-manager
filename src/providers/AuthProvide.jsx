import { createContext, useState } from "react";

import { TOKEN } from "../app.constants";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem(TOKEN));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
