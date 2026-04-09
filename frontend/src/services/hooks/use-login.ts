import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.implementation";
import { type LoginData } from "@project/shared";

export const useLogin = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<any>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (data: LoginData) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.token);
      
      // Возвращаем пользователя туда, откуда он пришел, или на главную
      const origin = location.state?.from?.pathname || "/";
      navigate(origin, { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate: login, isPending, isError: !!error, error, reset: () => setError(null) };
};