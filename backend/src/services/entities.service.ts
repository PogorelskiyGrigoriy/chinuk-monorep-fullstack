/**
 * @module EntitiesService
 * Interface definitions for core domain services.
 * Follows the repository pattern to decouple business logic from data access.
 */
import type { 
  Customer, 
  Invoice, 
  Employee, 
  Playlist, 
  TrackDetail, 
  AlbumWithArtist
} from "@project/shared";

/**
 * Service for managing customers and their billing relations.
 * Corresponds to Requirements 1.1.
 */
export interface CustomersService {
  /** Retrieves a list of all customers for the main table view. */
  getAll(): Promise<Customer[]>;
  
  /** Retrieves detailed data for a specific customer. */
  getById(id: number): Promise<Customer | null>;

  /** Retrieves all invoices associated with a specific customer. */
  getCustomerInvoices(customerId: number): Promise<Invoice[]>;

  /** Retrieves the support representative (employee) assigned to a customer. */
  getSalesAgent(customerId: number): Promise<Employee>;
}

/**
 * Service for the music catalog management.
 * Corresponds to Requirements 1.2 and 1.3.
 */
export interface MusicService {
  // --- Albums ---
  /** Retrieves all albums including artist information. */
  getAlbums(): Promise<AlbumWithArtist[]>;
  
  /** Retrieves all tracks belonging to a specific album. */
  getAlbumTracks(albumId: number): Promise<TrackDetail[]>;

  // --- Playlists ---
  /** Retrieves a list of all available playlists. */
  getPlaylists(): Promise<Playlist[]>;
  
  /** Retrieves all tracks included in a specific playlist. */
  getPlaylistTracks(playlistId: number): Promise<TrackDetail[]>;

  // --- Invoices ---
  /** Retrieves track details for all items within a specific invoice. */
  getInvoiceTracks(invoiceId: number): Promise<TrackDetail[]>;
}