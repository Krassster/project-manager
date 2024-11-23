import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { AuthService } from "../../../services/auth.services";

export const useAuthPage = () => {
  const [type, setType] = useState<string>("register");
  const [authError, setAuthError] = useState<string | null>(null);
  const [regisError, setRegisError] = useState<string | null>(null);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
  } = useForm<AuthFormData>({
    mode: "onChange",
  });

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
    reset: resetRegister,
  } = useForm<AuthFormData>({
    mode: "onChange",
  });

  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/projects");
    }
  }, [isAuth, navigate]);

  const handleAuthentication = async ({
    username,
    email,
    password,
  }: AuthFormData) => {
    setIsLoading(true);
    try {
      await AuthService.authenticate(username, email, password, type);
      setIsAuth(true);
      resetLogin();
      resetRegister();
    } catch (error: any) {
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

  const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
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
