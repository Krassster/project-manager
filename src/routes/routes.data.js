import Auth from "../components/screens/auth/Auth";
import Profile from "../components/screens/profile/Profile.tsx";
import ProjectDetail from "../components/screens/projectDetail/ProjectDetail.tsx";
import ProjectList from "../components/screens/projectList/ProjectList.tsx";

export const routes = [
  {
    path: "/",
    component: Auth,
    isAuth: false,
  },
  {
    path: "/profile",
    component: Profile,
    isAuth: true,
  },
  {
    path: "/projects",
    component: ProjectList,
    isAuth: true,
  },
  {
    path: "/project/:projectId",
    component: ProjectDetail,
    isAuth: true,
  },
];
