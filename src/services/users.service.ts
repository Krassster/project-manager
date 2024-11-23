export const getUser = async (userId: number) => {
  try {
    const res = await fetch("http://localhost:3001/users");
    if (!res.ok) {
      throw new Error("Ошибка загрузки проекта");
    }
    const data = await res.json();
    const user = data.find((user: any) => user.id === userId);
    if (user) {
      return user;
    }
    return [];
  } catch (error) {
    console.error(error);
  }
};

export const updateUserProjects = async (
  updatedProjects: Project[],
  userId: number
) => {
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
