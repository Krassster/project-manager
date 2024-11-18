import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import "./ProjectList.module.scss";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Modal from "../../ui/modal/Modal";
import styles from "./ProjectList.module.scss";

const defaultData = [
  {
    title: "First",
    completeTask: 3,
    allTask: 5,
    created: "1.02.2024",
    tasks: [
      {
        title: "Выполнить план по тз",
        created: "21.11.2024",
        completed: true,
      },
      {
        title: "Сделать реконструкцию функции",
        created: "17.11.2024",
        completed: false,
      },
      {
        title: "Добавить фильтры для проектов",
        created: "11.11.2024",
        completed: true,
      },
    ],
  },
  {
    title: "Second",
    completeTask: 2,
    allTask: 4,
    created: "1.02.2024",
    tasks: [
      {
        title: "Выполнить план по тз",
        created: "21.11.2024",
        completed: true,
      },
      {
        title: "Сделать реконструкцию функции",
        created: "17.11.2024",
        completed: false,
      },
      {
        title: "Добавить фильтры для проектов",
        created: "11.11.2024",
        completed: true,
      },
    ],
  },
  {
    title: "Third",
    completeTask: 5,
    allTask: 5,
    created: "1.02.2024",
    tasks: [
      {
        title: "Выполнить план по тз",
        created: "21.11.2024",
        completed: true,
      },
      {
        title: "Сделать реконструкцию функции",
        created: "17.11.2024",
        completed: false,
      },
      {
        title: "Добавить фильтры для проектов",
        created: "11.11.2024",
        completed: true,
      },
    ],
  },
];

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projects"));
    if (savedProjects) {
      setProjects(savedProjects);
    } else {
      setProjects(defaultData);
      localStorage.setItem("projects", JSON.stringify(defaultData));
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }, [projects]);

  const addProject = (newProject) => {
    const updatedProject = [...projects, newProject];
    setProjects(updatedProject);
  };

  const deleteProject = (index) => {
    setProjects((prevItems) =>
      prevItems.filter((item) => item !== prevItems[index])
    );
  };

  const handleProjectClick = (index) => {
    navigate(`/project/${index}`, { state: { projectIndex: index } });
  };

  return (
    <div className="container">
      <h1>Мои проекты</h1>
      <div className={styles.project}>
        <ul>
          {projects.map((project, index) => (
            <li key={project.title} onClick={() => handleProjectClick(index)}>
              <div>{project.title}</div>
              <div>
                {project.completeTask}/{project.allTask}
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
