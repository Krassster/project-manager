import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

import { useAuth } from "hooks/useAuth";
import { getUser, updateUserProjects } from "services/users.service";

import Menu from "components/layout/menu/Menu";
import Loader from "components/ui/Loader";
import Modal from "components/ui/modal/Modal";

import styles from "./ProjectList.module.scss";

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const {
    user: { id: userId },
  } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const user = await getUser(userId);
      setProjects(user.projects);
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  const addProject = (newProject: Project) => {
    console.log(userId);
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    updateUserProjects(updatedProjects, userId);
  };

  const deleteProject = (projectId: number) => {
    setProjects((prevItems) =>
      prevItems.filter((item) => item !== prevItems[projectId])
    );
    updateUserProjects(projects, userId);
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`, { state: { projectId } });
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="container">
      <Menu />
      <h1>Мои проекты</h1>
      {isLoading || !projects ? (
        <Loader />
      ) : (
        <div className={styles.project}>
          <ul>
            {projects.map((project) => (
              <li
                key={project.title}
                onClick={() => handleProjectClick(project.id)}>
                <div>{project.title}</div>
                <div>
                  {project.completedTasks}/{project.allTasks}
                </div>
                <div>{project.created}</div>
                <MdDelete
                  style={{ color: "#44abb8" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(project.id);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={openModal}>Добавить новый проект</button>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        addProject={addProject}
        title="проект"
        type="project"
      />
    </div>
  );
};

export default ProjectList;
