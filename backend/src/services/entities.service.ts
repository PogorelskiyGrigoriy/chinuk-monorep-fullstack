/**
 * @module EntitiesService
 * Interface definitions for core domain services.
 */
import type { 
  Customer, 
  Invoice, 
  Employee, 
  Playlist, 
  TrackDetail, 
  AlbumWithArtist,
  Pagination,
  PaginatedResponse
} from "@project/shared";

export interface CustomersService {
  /** * Retrieves a paginated list of customers.
   * Required for Requirement 1.1 
   */
  getAll(params: Pagination): Promise<PaginatedResponse<Customer>>;
  
  getById(id: number): Promise<Customer | null>;
  getCustomerInvoices(customerId: number): Promise<Invoice[]>;
  getSalesAgent(customerId: number): Promise<Employee>;
}

export interface MusicService {
  /** * Retrieves a paginated list of albums with artist information.
   * Required for Requirement 1.2 
   */
  getAlbums(params: Pagination): Promise<PaginatedResponse<AlbumWithArtist>>;
  
  /** Retrieves all tracks belonging to a specific album. */
  getAlbumTracks(albumId: number): Promise<TrackDetail[]>;

  /** * Retrieves a paginated list of all available playlists.
   * Required for Requirement 1.3 
   */
  getPlaylists(params: Pagination): Promise<PaginatedResponse<Playlist>>;
  
  getPlaylistTracks(playlistId: number): Promise<TrackDetail[]>;

  getInvoiceTracks(invoiceId: number): Promise<TrackDetail[]>;
}