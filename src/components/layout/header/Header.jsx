import { CgProfile } from "react-icons/cg";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

// import { useAuth } from '../../../hooks/useAuth'

import Hamburger from "../hamburger/Hamburger";

import styles from "./Header.module.scss";

const Header = ({ backLink = "/" }) => {
  const isAuth = true;
  // const { isAuth } = useAuth()
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {isAuth && (
        <>
          {pathname === "/" && isAuth ? (
            <button
              onClick={() => {
                navigate("/profile");
              }}>
              <CgProfile color="#fff" fontSize={45} />
            </button>
          ) : (
            <button
              onClick={() => {
                navigate(isAuth ? backLink : "/auth");
              }}>
              <FaArrowLeft color="#fff" fontSize={35} />
            </button>
          )}
          <Hamburger />
        </>
      )}
    </header>
  );
};

export default Header;
