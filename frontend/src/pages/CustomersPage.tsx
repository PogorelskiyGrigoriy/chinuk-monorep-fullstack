/**
 * @page Customers
 * ТЗ 1.1: Таблица клиентов для SALE и SUPER_USER.
 */
export const CustomersPage = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Управление клиентами</h2>
      
      {/* Согласно ТЗ 1.1.1, здесь должна быть таблица:
        - Имя, Фамилия, Город, Страна, Email
        - Кнопка "Invoices" -> Открывает список счетов (ТЗ 1.1.1.2.1)
        - Кнопка "Sales Agent" -> Показывает данные агента (ТЗ 1.1.1.2.2)
      */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400">
        [Здесь будет таблица клиентов]
      </div>
    </div>
  );
};