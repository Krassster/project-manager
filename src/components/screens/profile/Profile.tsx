import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { useAuth } from "hooks/useAuth";
import { getUser } from "services/users.service";
import Loader from "components/ui/Loader";
import Menu from "components/layout/menu/Menu";

const Profile = () => {
  const [user, setUser] = useState<User>();
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

  if (!user) {
    return <Loader />;
  }

  const { username, email, projects } = user;

  const totalTasks = projects.reduce(
    (acc, project) => acc + project.allTasks,
    0
  );
  const totalCompletedTasks = projects.reduce(
    (acc, project) => acc + project.completedTasks,
    0
  );

  return (
    <div className="container">
      <Menu />
      <h1>Профиль</h1>
      <div className={styles.wrapper}>
        <div className={styles.profile}>
          <div>
            <b>Имя:</b> {username}
          </div>
          <div>
            <b>Почта:</b> {email}
          </div>
          <div>
            <b>Количество проектов:</b> {projects.length}
          </div>
          <div>
            <b>Количество задач:</b> {totalCompletedTasks} /{totalTasks}
            (выполнено/всего)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
