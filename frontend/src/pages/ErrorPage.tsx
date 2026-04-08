/**
 * @page Error
 * Обработчик ошибок роутинга (404, 403 и системные сбои).
 */
import { useRouteError, Link } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError() as any;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
      <h1 className="text-6xl font-black text-indigo-200 mb-4">Упс!</h1>
      <p className="text-xl text-gray-600 mb-8">
        {error.statusText || error.message || "Что-то пошло не так."}
      </p>
      <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition">
        Вернуться на главную
      </Link>
    </div>
  );
};