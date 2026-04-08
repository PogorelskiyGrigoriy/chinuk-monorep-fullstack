import type { 
  Customer, 
  Invoice, 
  Employee, 
  Album, 
  Playlist, 
  TrackDetail, 
  AlbumWithArtist
} from "@project/shared";

/**
 * Сервис для работы с клиентами и их связями (ТЗ 1.1)
 */
export interface CustomersService {
  /** Получить всех клиентов для таблицы */
  getAll(): Promise<Customer[]>;
  
  /** Получить данные конкретного клиента */
  getById(id: number): Promise<Customer | null>;

  /** Получить все счета (invoices) конкретного клиента */
  getCustomerInvoices(customerId: number): Promise<Invoice[]>;

  /** Получить данные агента по продажам для клиента */
  getSalesAgent(customerId: number): Promise<Employee>;
}

/**
 * Сервис для музыкального каталога (ТЗ 1.2 и 1.3)
 */
export interface MusicService {
  // --- Альбомы ---
  /** Получить список всех альбомов (с именами артистов) */
  getAlbums(): Promise<AlbumWithArtist[]>;
  
  /** Получить треки конкретного альбома */
  getAlbumTracks(albumId: number): Promise<TrackDetail[]>;

  // --- Плейлисты ---
  /** Получить список всех плейлистов */
  getPlaylists(): Promise<Playlist[]>;
  
  /** Получить треки конкретного плейлиста */
  getPlaylistTracks(playlistId: number): Promise<TrackDetail[]>;

  // --- Инвойсы ---
  /** Получить треки, входящие в конкретный счет */
  getInvoiceTracks(invoiceId: number): Promise<TrackDetail[]>;
}