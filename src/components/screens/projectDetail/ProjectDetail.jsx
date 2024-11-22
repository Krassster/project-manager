import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { getUser, updateUserProjects } from "../../../services/users.service";

import Loader from "../../ui/Loader";
import Modal from "../../ui/modal/Modal";
import Menu from "../../layout/menu/Menu";
import { useAuth } from "../../../hooks/useAuth";

import styles from "./ProjectDetails.module.scss";

const ProjectDetail = () => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const inputRef = useRef(null);
  const location = useLocation();
  const {
    user: { id: userId },
  } = useAuth();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const user = await getUser(userId);
      setProjects(user.projects);
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

  const calcTaskStats = (tasks) => {
    const allTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;

    return { allTasks, completedTasks };
  };

  const handleUpdateProjects = (updatedProject) => {
    const taskStats = calcTaskStats(updatedProject.tasks);
    const updStatsProject = { ...updatedProject, ...taskStats };

    const updProjects = projects.map((project) =>
      project.id === updStatsProject.id ? updStatsProject : project
    );
    setProjects(updProjects);
    updateUserProjects(updProjects, userId);
  };

  const toggleCompleted = (taskId) => {
    const updatedTasks = project.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    const updatedProject = { ...project, tasks: updatedTasks };
    handleUpdateProjects(updatedProject);
  };

  const editTaskTitle = (taskId, newTitle) => {
    const updatedTasks = project.tasks.map((task) =>
      task.id === taskId ? { ...task, title: newTitle } : task
    );
    const updatedProject = { ...project, tasks: updatedTasks };
    handleUpdateProjects(updatedProject);
  };

  const handleBlur = () => {
    if (editedTitle !== "") {
      editTaskTitle(editingTaskId, editedTitle);
      setEditingTaskId(null);
      setEditedTitle("");
    }
  };

  const handleFocus = (taskId, title) => {
    setEditingTaskId(taskId);
    setEditedTitle(title);
  };

  const addTask = (newTask) => {
    const updatedTasks = [...project.tasks, newTask];
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
          <Menu />
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
              {project.tasks?.map((task) => (
                <tr
                  key={task.title}
                  className={task.completed ? styles.strikethrough : ""}>
                  <td>
                    {editingTaskId === task.id ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleBlur}
                        autoFocus
                        className={styles.editTableInput}
                      />
                    ) : (
                      <span onClick={() => handleFocus(task.id, task.title)}>
                        {task.title}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ cursor: "default" }}>{task.created}</span>
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
          <div>
            <button onClick={openModal}>Добавить новую задачу</button>
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              addTask={addTask}
              title="задачу"
              type="task"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;
