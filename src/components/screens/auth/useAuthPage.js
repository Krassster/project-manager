import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { AuthService } from "../../../services/auth.services";

export const useAuthPage = () => {
  const [type, setType] = useState("register");
  const [authError, setAuthError] = useState(null);
  const [regisError, setRegisError] = useState(null);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
  } = useForm({
    mode: "onChange",
  });

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
    reset: resetRegister,
  } = useForm({
    mode: "onChange",
  });

  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/projects");
    }
  }, [isAuth, navigate]);

  const handleAuthentication = async ({ email, password }) => {
    setIsLoading(true);
    try {
      await AuthService.authenticate(email, password, type);
      setIsAuth(true);
      resetLogin();
      resetRegister();
    } catch (error) {
      if (type === "login") {
        setAuthError(error.message);
      }
      if (type === "register") {
        setRegisError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    handleAuthentication(data);
  };

  return {
    registerRegister,
    registerLogin,
    handleSubmitLogin,
    handleSubmitRegister,
    errorsRegister,
    onSubmit,
    setType,
    isLoading,
    authError,
    regisError,
  };
};
