/**
 * @page Audit
 * Админская панель для просмотра логов.
 * Доступно только для SUPER_USER.
 */
export const AuditPage = () => {
  return (
    <div className="bg-gray-900 text-green-400 p-6 rounded-lg shadow-2xl font-mono">
      <h2 className="text-xl border-b border-green-800 pb-2 mb-4">Журнал безопасности [Accounting]</h2>
      
      {/* Отображает данные из /api/admin/logs.
        Должно показывать: Время, Email пользователя, Действие (AUTH/DATA_READ) и метаданные.
      */}
      <ul className="space-y-2 text-sm">
        <li>&gt; [2026-04-08 18:00] admin@chinook.com вошел в систему.</li>
        <li>&gt; [2026-04-08 18:05] admin@chinook.com запросил список клиентов.</li>
        <li className="animate-pulse">_</li>
      </ul>
    </div>
  );
};