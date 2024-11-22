import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Modal from "../../ui/modal/Modal";
import styles from "./ProjectList.module.scss";
import { getUser, updateUserProjects } from "../../../services/users.service";
import "./ProjectList.module.scss";
import { useAuth } from "../../../hooks/useAuth";
import Menu from "../../layout/menu/Menu";
import Loader from "../../ui/Loader";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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
  }, [userId]);

  const addProject = (newProject) => {
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    updateUserProjects(updatedProjects, userId);
  };

  const deleteProject = (index) => {
    setProjects((prevItems) =>
      prevItems.filter((item) => item !== prevItems[index])
    );
    updateUserProjects(projects, userId);
  };

  const handleProjectClick = (index) => {
    navigate(`/project/${index}`, { state: { projectIndex: index } });
  };

  return (
    <div className="container">
      <Menu />
      <h1>Мои проекты</h1>
      {isLoading || !projects ? (
        <Loader />
      ) : (
        <div className={styles.project}>
          <ul>
            {projects.map((project, index) => (
              <li key={project.title} onClick={() => handleProjectClick(index)}>
                <div>{project.title}</div>
                <div>
                  {project.completedTasks}/{project.allTasks}
                </div>
                <div>{project.created}</div>
                <MdDelete
                  style={{ color: "#44abb8" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(index);
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
