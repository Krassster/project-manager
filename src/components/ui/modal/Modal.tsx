import { useEffect, useRef, useState } from "react";
import styles from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: Function;
  addTask?: (task: any) => void;
  addProject?: (project: any) => void;
  title: string;
  type: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  addTask,
  addProject,
  title,
  type,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const getCurrentDate = () => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddData = () => {
    if (inputValue.trim()) {
      if (type === "task" && addTask) {
        addTask({
          id: Date.now(),
          title: inputValue,
          created: getCurrentDate(),
          completed: false,
        });
      } else if (type === "project" && addProject) {
        addProject({
          id: Date.now(),
          title: inputValue,
          completedTasks: 1,
          allTasks: 2,
          created: getCurrentDate(),
          tasks: [
            {
              id: Date.now(),
              title: "Твоя первая задача в этом проекте",
              created: getCurrentDate(),
              completed: false,
            },
            {
              id: Date.now() + 1,
              title: "Задача которую ты уже выполнил",
              created: getCurrentDate(),
              completed: true,
            },
          ],
        });
      }
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2 className={styles.modalTitle}>Добавить {title}</h2>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Введите название"
          className={styles.modalInput}
        />
        <div className={styles.modalButtons}>
          <button
            className={styles.modalButtonOpen}
            onClick={() => {
              handleAddData();
              setInputValue("");
              onClose();
            }}>
            Добавить
          </button>
          <button
            className={styles.modalButtonClose}
            onClick={() => {
              setInputValue("");
              onClose();
            }}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
