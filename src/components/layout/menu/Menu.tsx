import { useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { GoProjectRoadmap } from "react-icons/go";
import { RiLogoutBoxLine } from "react-icons/ri";

import { AuthService } from "../../../services/auth.services";

import styles from "./Menu.module.scss";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleNavigateClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.menu_left}>
        <CgProfile
          className={`${styles.icon_img} ${
            isActive("/profile") ? styles.icon_active : ""
          }`}
          size={"35px"}
          onClick={() => handleNavigateClick("/profile")}
        />
        <GoProjectRoadmap
          className={`${styles.icon_img} ${
            isActive("/projects") ? styles.icon_active : ""
          }`}
          size={"35px"}
          onClick={() => handleNavigateClick("/projects")}
        />
      </div>
      <div className="menu_right">
        <RiLogoutBoxLine
          className={styles.icon_img}
          onClick={() => {
            AuthService.logout();
            handleNavigateClick("/");
          }}
          size={"35px"}
        />
      </div>
    </div>
  );
};

export default Menu;
