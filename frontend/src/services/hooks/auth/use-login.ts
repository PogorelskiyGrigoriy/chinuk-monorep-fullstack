import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.implementation";
import { type LoginData } from "@project/shared";
import { ROUTES } from "@/config/navigation";

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    // 1. Сама функция запроса
    mutationFn: (data: LoginData) => authService.login(data),
    
    // 2. Действия при успешном входе
    onSuccess: (response) => {
      // Сохраняем пользователя и токен в Zustand (и localStorage)
      setAuth(response.user, response.token);
      
      // Возвращаем пользователя на страницу, с которой его "выкинуло", или на главную
      const origin = location.state?.from?.pathname || ROUTES.HOME;
      navigate(origin, { replace: true });
    },
  });

  // Пропсы mutation.isPending, mutation.error и т.д. теперь управляются библиотекой
  return { 
    mutate: mutation.mutate, 
    isPending: mutation.isPending, 
    isError: mutation.isError, 
    error: mutation.error, 
    reset: mutation.reset 
  };
};