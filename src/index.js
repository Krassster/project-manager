import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./routes/Routes";

import "./assets/styles/index.scss";
import AuthProvider from "./providers/AuthProvide";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
);
