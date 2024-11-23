import { v4 as uuidv4 } from "uuid";
import { TOKEN } from "../app.constants";

const defaultData = [
  {
    id: 1732284285655,
    title: "Домашние дела",
    completedTasks: 1,
    allTasks: 2,
    created: "22.11.2024",
    tasks: [
      {
        id: 1732284285655,
        title: "Собрать паутину",
        created: "22.11.2024",
        completed: false,
      },
      {
        id: 1732284285656,
        title: "Купить продуктов",
        created: "19.11.2024",
        completed: true,
      },
    ],
  },
];

export const AuthService = {
  async authenticate(
    username: string,
    email: string,
    password: string,
    type: string
  ) {
    if (type === "register") {
      const res = await fetch("http://localhost:3001/users?email=" + email);
      const users = await res.json();

      if (users.length > 0) {
        throw new Error("Пользователь с таким email уже существует");
      }

      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        password,
        token: uuidv4(),
        projects: defaultData,
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
      localStorage.setItem("isAuth", "true");

      return;
    }

    if (type === "login") {
      const res = await fetch("http://localhost:3001/users?email=" + email);
      const users = await res.json();

      const user = users.find(
        (user: any) => user.password === password && user.email === email
      );

      if (!user) {
        throw new Error("Неверный email или пароль");
      }

      localStorage.setItem(TOKEN, user.token);
      localStorage.setItem("user", JSON.stringify({ id: user.id }));
      localStorage.setItem("isAuth", "true");

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
