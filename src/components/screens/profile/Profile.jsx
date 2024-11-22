import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { getUser } from "../../../services/users.service";
import Menu from "../../layout/menu/Menu";
import Loader from "../../ui/Loader";
import styles from "./Profile.module.scss";

const Profile = () => {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    user: { id: userId },
  } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const user = await getUser(userId);
      setUser(user);
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  const { username, email, projects } = user;

  const totalTasks = user.projects?.reduce(
    (acc, project) => acc + project.allTasks,
    0
  );
  const totalCompletedTasks = user.projects?.reduce(
    (acc, project) => acc + project.completedTasks,
    0
  );

  return (
    <div className="container">
      <Menu />
      <h1>Профиль</h1>
      {isLoading || !user ? (
        <Loader />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.profile}>
            <div>Имя: {username}</div>
            <div>Почта: {email}</div>
            <div>Количество проектов: {projects?.length}</div>
            <div>
              Количество задач: {totalCompletedTasks} /{totalTasks}{" "}
              (выполнено/всего)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
