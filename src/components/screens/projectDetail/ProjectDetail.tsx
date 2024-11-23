import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import styles from "./ProjectDetails.module.scss";
import { useAuth } from "hooks/useAuth";
import { getUser, updateUserProjects } from "services/users.service";
import Loader from "components/ui/Loader";
import Menu from "components/layout/menu/Menu";
import Modal from "components/ui/modal/Modal";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";

const ProjectDetail = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project>();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<number>(0);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [sortCompleted, setSortComplited] = useState<boolean>(true);
  const [sortDate, setSortDate] = useState<boolean>(true);

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
    const { projectId } = location.state || {};
    if (projects.length > 0 && projectId >= 0) {
      const project = projects.filter((project) => project.id === projectId);
      setProject(project[0]);
    }
  }, [projects, location]);

  const calcTaskStats = (tasks: Task[]) => {
    const allTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;

    return { allTasks, completedTasks };
  };

  const handleUpdateProjects = (updatedProject: Project) => {
    const taskStats = calcTaskStats(updatedProject.tasks);
    const updStatsProject = { ...updatedProject, ...taskStats };

    const updProjects = projects.map((project) =>
      project.id === updStatsProject.id ? updStatsProject : project
    );
    setProjects(updProjects);
    updateUserProjects(updProjects, userId);
  };

  const toggleCompleted = (taskId: number) => {
    if (project) {
      const updatedTasks = project.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      const updatedProject = { ...project, tasks: updatedTasks };
      handleUpdateProjects(updatedProject);
    }
  };

  const toggleSortCompleted = () => {
    if (project) {
      const sortOrder = sortCompleted ? 1 : -1;
      const sortedTasks = project.tasks.sort(
        (a, b) => sortOrder * (Number(a.completed) - Number(b.completed))
      );
      const updatedProject = { ...project, tasks: sortedTasks };
      handleUpdateProjects(updatedProject);
      setSortComplited(!sortCompleted);
    }
  };

  const toggleSortDate = () => {
    if (project) {
      const sortedTasks = project.tasks.sort((a, b) => {
        const dateA = parseDate(a.created);
        const dateB = parseDate(b.created);

        return sortDate ? dateA - dateB : dateB - dateA;
      });
      console.log(sortedTasks);

      const updatedProject = { ...project, tasks: sortedTasks };
      handleUpdateProjects(updatedProject);
      setSortDate(!sortDate);
    }
  };

  const parseDate = (dateString: string): number => {
    const [day, month, year] = dateString.split(".").map(Number);
    return new Date(year, month - 1, day).getTime();
  };

  const editTaskTitle = (taskId: number, newTitle: string) => {
    if (project) {
      const updatedTasks = project.tasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task
      );
      const updatedProject = { ...project, tasks: updatedTasks };
      handleUpdateProjects(updatedProject);
    }
  };

  const handleBlur = () => {
    if (editedTitle !== "") {
      editTaskTitle(editingTaskId, editedTitle);
      setEditingTaskId(0);
      setEditedTitle("");
    }
  };

  const handleFocus = (taskId: number, title: string) => {
    setEditingTaskId(taskId);
    setEditedTitle(title);
  };

  const addTask = (newTask: Task) => {
    if (project) {
      const updatedTasks = [...project.tasks, newTask];
      const updatedProject = { ...project, tasks: updatedTasks };
      handleUpdateProjects(updatedProject);
    }
  };

  const deleteTask = (taskId: number) => {
    if (project) {
      const updatedTasks = project.tasks.filter((task) => task.id !== taskId);
      const updatedProject = { ...project, tasks: updatedTasks };
      handleUpdateProjects(updatedProject);
    }
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
                <th onClick={toggleSortDate}>
                  Дата создания {sortDate ? <FaCaretUp /> : <FaCaretDown />}
                </th>
                <th onClick={toggleSortCompleted}>
                  Выполнено {sortCompleted ? <FaCaretUp /> : <FaCaretDown />}
                </th>
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
