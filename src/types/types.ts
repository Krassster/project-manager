interface Task {
  id: number;
  title: string;
  created: string;
  completed: boolean;
}

interface Project {
  id: number;
  title: string;
  completedTasks: number;
  allTasks: number;
  created: string;
  tasks: Task[];
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  token: string;
  projects: Project[];
}

interface AuthFormData {
  username: string;
  email: string;
  password: string;
}
