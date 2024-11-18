import { v4 as uuidv4 } from "uuid";
import { TOKEN } from "../app.constants";

export const AuthService = {
  authenticate(email, password, type) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (type === "register") {
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        throw new Error("Пользователь с таким email уже существует.");
      }

      const token = uuidv4();
      users.push({ email, password, token });
      localStorage.setItem("users", JSON.stringify(users));

      localStorage.setItem(TOKEN, token);

      return;
    }

    if (type === "login") {
      const user = users.find(
        (user) => user.email === email && user.password === password
      );
      if (!user) {
        throw new Error("Неверный email или пароль.");
      }
      localStorage.setItem("isAuth", "true");
    }
  },

  logout: () => {
    localStorage.removeItem("isAuth");
  },

  isAuthenticated: () => {
    return localStorage.getItem("isAuth") === "true";
  },
};
