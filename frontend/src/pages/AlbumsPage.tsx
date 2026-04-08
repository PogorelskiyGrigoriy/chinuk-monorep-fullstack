/**
 * @page Albums
 * ТЗ 1.2: Таблица альбомов для USER и SUPER_USER.
 */
export const AlbumsPage = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Музыкальные альбомы</h2>
      
      {/* Согласно ТЗ 1.2.1, здесь должна быть таблица:
        - Название альбома, Имя артиста
        - Кнопка "Details" -> Показывает список треков (ТЗ 1.1.1.2.1.1)
      */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400">
        [Здесь будет таблица альбомов и артистов]
      </div>
    </div>
  );
};