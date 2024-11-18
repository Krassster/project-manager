import { Link, useNavigate } from "react-router-dom";

// import { useAuth } from "../../../hooks/useAuth";

import styles from "./Menu.module.scss";
import { menu } from "./menu.data";

export const Menu = ({ isShow, setIsShow }) => {
  //   const { setIsAuth } = useAuth();

  const navigate = useNavigate();

  const logoutHandler = () => {
    // setIsAuth(false);
    setIsShow(false);

    navigate("/auth");
  };

  return (
    <nav className={`${styles.menu} ${isShow ? styles.show : ""}`}>
      <ul>
        {menu.map((item, index) => (
          <li key={`_menu_${index}`}>
            <Link to={item.link}>{item.title}</Link>
          </li>
        ))}
        <li>
          <button onClick={logoutHandler}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};
