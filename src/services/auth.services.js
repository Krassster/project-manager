import { v4 as uuidv4 } from "uuid";
import { TOKEN } from "../app.constants";

export const AuthService = {
  async authenticate(email, password, type) {
    if (type === "register") {
      const res = await fetch("http://localhost:3001/users?email=" + email);
      const users = await res.json();

      if (users.length > 0) {
        throw new Error("Пользователь с таким email уже существует");
      }

      const newUser = {
        id: Date.now(),
        email,
        password,
        token: uuidv4(),
        projects: [],
      };

      const createRes = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!createRes.ok) {
        throw new Error("Ошибка при создании пользователя");
      }

      const createUser = await createRes.json();

      localStorage.setItem(TOKEN, createUser.token);
      localStorage.setItem("user", JSON.stringify({ id: createUser.id }));
      localStorage.setItem("isAuth", true);

      return;
    }

    if (type === "login") {
      const res = await fetch("http://localhost:3001/users?email=" + email);
      const users = await res.json();

      const user = users.find(
        (user) => user.password === password && user.email === email
      );

      if (!user) {
        throw new Error("Неверный email или пароль");
      }

      localStorage.setItem(TOKEN, user.token);
      localStorage.setItem("user", JSON.stringify({ id: user.id }));
      localStorage.setItem("isAuth", true);

      return;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuth");
  },

  isAuthenticated: () => {
    return localStorage.getItem("isAuth") === "true";
  },
};
