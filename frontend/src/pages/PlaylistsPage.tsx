/**
 * @page Playlists
 * ТЗ 1.3: Таблица плейлистов для USER и SUPER_USER.
 */
export const PlaylistsPage = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Плейлисты</h2>
      
      {/* Согласно ТЗ 1.3.1, здесь должна быть таблица:
        - ID плейлиста, Название
        - Кнопка "Details" -> Показывает список треков (ТЗ 1.1.1.2.1.1)
      */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400">
        [Здесь будет таблица плейлистов]
      </div>
    </div>
  );
};