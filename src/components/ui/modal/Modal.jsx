import { useEffect, useRef, useState } from "react";
import styles from "./Modal.module.scss";

const Modal = ({ isOpen, onClose, addTask, addProject, title, type }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();
  const getCurrentDate = () => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddData = () => {
    if (inputValue.trim()) {
      if (type === "task") {
        addTask({
          title: inputValue,
          created: getCurrentDate(),
          completed: false,
        });
      } else if (type === "project") {
        addProject({
          title: inputValue,
          completeTask: "0",
          allTask: "1",
          created: getCurrentDate(),
          tasks: [
            {
              title: "Твоя первая задача",
              created: getCurrentDate(),
              completed: false,
            },
            {
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
