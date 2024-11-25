import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { useAuth } from "hooks/useAuth";
import { getUser } from "services/users.service";
import Loader from "components/ui/Loader";
import Menu from "components/layout/menu/Menu";

const Profile = () => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalTasks, setTotalTasks] = useState<number>();
  const [totalCompletedTasks, setTotalCompletedTasks] = useState<number>();

  const {
    user: { id: userId },
  } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const user = await getUser(userId);
      setTotalTasks(
        user?.projects.reduce(
          (acc: number, project: Project) => acc + project.allTasks,
          0
        )
      );
      setTotalCompletedTasks(
        user?.projects.reduce(
          (acc: number, project: Project) => acc + project.completedTasks,
          0
        )
      );
      setUser(user);
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="container">
      <Menu />
      <h1>Профиль</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.profile}>
            <div>
              <b>Имя:</b> {user?.username}
            </div>
            <div>
              <b>Почта:</b> {user?.email}
            </div>
            <div>
              <b>Количество проектов:</b> {user?.projects.length}
            </div>
            <div>
              <b>Количество задач:</b> {totalCompletedTasks} /{totalTasks}
              (выполнено/всего)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
