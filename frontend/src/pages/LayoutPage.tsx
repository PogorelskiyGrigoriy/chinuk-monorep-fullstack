/**
 * @module MainLayout
 * Основной каркас приложения. Содержит навигацию и кнопку выхода.
 */
import { Outlet, Link, useNavigate } from "react-router-dom";

export const MainLayout = () => {
  const navigate = useNavigate();
  
  // TODO: Получать реальную роль из AuthContext
  const user = { role: 'SUPER_USER' }; 

  const handleLogout = () => {
    // ТЗ 2.4: Логика выхода (удаление токена, лог в аудит) и редирект на логин
    console.log("Выход из системы...");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Шапка с навигацией */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <h1 className="text-xl font-bold text-indigo-600">Chinook Explorer</h1>
          
          {/* ТЗ 2.5: Навигация на основе ролей */}
          {(user.role === 'SALE' || user.role === 'SUPER_USER') && (
            <Link to="/customers" className="text-gray-600 hover:text-indigo-500">Клиенты</Link>
          )}
          {(user.role === 'USER' || user.role === 'SUPER_USER') && (
            <>
              <Link to="/albums" className="text-gray-600 hover:text-indigo-500">Альбомы</Link>
              <Link to="/playlists" className="text-gray-600 hover:text-indigo-500">Плейлисты</Link>
            </>
          )}
          {user.role === 'SUPER_USER' && (
            <Link to="/audit" className="text-red-500 font-medium">Логи аудита</Link>
          )}
        </div>

        <button 
          onClick={handleLogout}
          className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Выйти
        </button>
      </nav>

      {/* Контент страницы */}
      <main className="flex-1 p-8">
        <Outlet /> {/* Здесь будут рендериться конкретные страницы */}
      </main>
    </div>
  );
};