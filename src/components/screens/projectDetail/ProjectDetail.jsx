import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import {
  getUserProjects,
  updateUserProject,
  updateUserProjects,
} from "../../../services/users.service";

import Loader from "../../ui/Loader";
import Modal from "../../ui/modal/Modal";
import styles from "./ProjectDetails.module.scss";
import { useAuth } from "../../../hooks/useAuth";

const ProjectDetail = () => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", created: "" });
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const {
    user: { id: userId },
  } = useAuth();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const userProjects = await getUserProjects(userId);
      setProjects(userProjects);
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const { projectIndex } = location.state || {};
    if (projects.length > 0 && projectIndex >= 0) {
      setProject(projects[projectIndex]);
    }
  }, [projects, location]);

  const handleUpdateProjects = (updatedProject) => {
    const updProjects = projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    setProjects(updProjects);
    updateUserProjects(updProjects, userId);
  };

  const handleEditClick = (index, field, value) => {
    setEditingIndex(index);
    setEditValues({ ...editValues, [field]: value });
  };

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (index) => {
    updateTask(index, editValues);
    setEditingIndex(null);
  };

  const toggleCompleted = (taskId) => {
    const updatedTasks = project.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    const updatedProject = { ...project, tasks: updatedTasks };
    console.log(updatedProject);
    handleUpdateProjects(updatedProject);
  };

  const addTask = (newTask) => {
    const updatedTasks = [...project.tasks, newTask];
    const updatedProject = { ...project, tasks: updatedTasks };
    handleUpdateProjects(updatedProject);
  };

  const updateTask = (taskId, updatedTask) => {
    const updatedTasks = project.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    );
    const updatedProject = { ...project, tasks: updatedTasks };
    handleUpdateProjects(updatedProject);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = project.tasks.filter((task) => task.id !== taskId);
    const updatedProject = { ...project, tasks: updatedTasks };
    handleUpdateProjects(updatedProject);
  };

  return (
    <>
      {isLoading || !project ? (
        <Loader />
      ) : (
        <div className="container">
          <h1>{project.title}</h1>
          <table>
            <thead>
              <tr>
                <th>Описание</th>
                <th>Дата создания</th>
                <th>Выполнено</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {project.tasks?.map((task, index) => (
                <tr
                  key={task.title}
                  className={task.completed ? styles.strikethrough : ""}>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editValues.title}
                        className={styles.editTableInput}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        onBlur={() => handleBlur(index)}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() =>
                          handleEditClick(task.id, "title", task.title)
                        }>
                        {task.title}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        className={styles.editTableInput}
                        value={editValues.created}
                        onChange={(e) =>
                          handleInputChange("created", e.target.value)
                        }
                        onBlur={() => handleBlur(task.id)}
                      />
                    ) : (
                      <span
                        onClick={() =>
                          handleEditClick(task.id, "created", task.created)
                        }>
                        {task.created}
                      </span>
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      style={{ cursor: "pointer" }}
                      checked={task.completed}
                      onChange={() => toggleCompleted(task.id)}
                    />
                  </td>
                  <td>
                    <MdDelete
                      style={{
                        color: "#44abb8",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => deleteTask(task.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={openModal}>Добавить новую задачу</button>
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            addTask={addTask}
            title="задачу"
            type="task"
          />
        </div>
      )}
    </>
  );
};

export default ProjectDetail;
