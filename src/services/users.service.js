export const getUserProjects = async (userId) => {
  try {
    const res = await fetch("http://localhost:3001/users");
    if (!res.ok) {
      throw new Error("Ошибка загрузки проекта");
    }
    const data = await res.json();
    const user = data.find((user) => user.id === userId);
    if (user) {
      return user.projects;
    }
    return [];
  } catch (error) {
    console.error(error);
  }
};

// export const updateUserProjects = async (userId, projects) => {
//   try {
//     const res = await fetch(`http://localhost:3001/users?userId=${userId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!res.ok) {
//       throw new Error("Ошибка при получении пользовательских данных");
//     }
//     const users = await res.json();
//     const user = users.find((user) => user.userId === userId);
//     if (user) {
//       const updateRes = await fetch(`http://localhost:3001/users/${user.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ projects }),
//       });
//       await updateRes.json();
//     }
//   } catch (error) {
//     console.error("Ошибка при обновлении данных:", error);
//   }
// };

export const updateUserProjects = async (updatedProjects, userId) => {
  try {
    const updateRes = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projects: updatedProjects }),
    });
    await updateRes.json();
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
  }
};
