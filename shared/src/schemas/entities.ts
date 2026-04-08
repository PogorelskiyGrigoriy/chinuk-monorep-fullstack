import { z } from 'zod';

// --- Artist ---
export const ArtistSchema = z.object({
  artistId: z.number().int(),
  name: z.string().nullable(),
});
export type Artist = z.infer<typeof ArtistSchema>;

// --- Album ---
export const AlbumSchema = z.object({
  albumId: z.number().int(),
  title: z.string(),
  artistId: z.number().int(),
});
export type Album = z.infer<typeof AlbumSchema>;

// --- Genre ---
export const GenreSchema = z.object({
  genreId: z.number().int(),
  name: z.string().nullable(),
});
export type Genre = z.infer<typeof GenreSchema>;

// --- Media Type ---
export const MediaTypeSchema = z.object({
  mediaTypeId: z.number().int(),
  name: z.string().nullable(),
});
export type MediaType = z.infer<typeof MediaTypeSchema>;

// --- Track ---
export const TrackSchema = z.object({
  trackId: z.number().int(),
  name: z.string(),
  albumId: z.number().int().nullable(),
  mediaTypeId: z.number().int(),
  genreId: z.number().int().nullable(),
  composer: z.string().nullable(),
  milliseconds: z.number().int(),
  bytes: z.number().int().nullable(),
  unitPrice: z.number(),
});
export type Track = z.infer<typeof TrackSchema>;

// --- Employee ---
export const EmployeeSchema = z.object({
  employeeId: z.number().int(),
  lastName: z.string(),
  firstName: z.string(),
  title: z.string().nullable(),
  reportsTo: z.number().int().nullable(),
  birthDate: z.coerce.date().nullable(),
  hireDate: z.coerce.date().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  postalCode: z.string().nullable(),
  phone: z.string().nullable(),
  fax: z.string().nullable(),
  email: z.string().email().nullable(),
});
export type Employee = z.infer<typeof EmployeeSchema>;

// --- Customer ---
export const CustomerSchema = z.object({
  customerId: z.number().int(),
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  postalCode: z.string().nullable(),
  phone: z.string().nullable(),
  fax: z.string().nullable(),
  email: z.string().email(),
  supportRepId: z.number().int().nullable(),
});
export type Customer = z.infer<typeof CustomerSchema>;

// --- Invoice ---
export const InvoiceSchema = z.object({
  invoiceId: z.number().int(),
  customerId: z.number().int(),
  invoiceDate: z.coerce.date(),
  billingAddress: z.string().nullable(),
  billingCity: z.string().nullable(),
  billingState: z.string().nullable(),
  billingCountry: z.string().nullable(),
  billingPostalCode: z.string().nullable(),
  total: z.number(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

// --- Invoice Line ---
export const InvoiceLineSchema = z.object({
  invoiceLineId: z.number().int(),
  invoiceId: z.number().int(),
  trackId: z.number().int(),
  unitPrice: z.number(),
  quantity: z.number().int(),
});
export type InvoiceLine = z.infer<typeof InvoiceLineSchema>;

// --- Playlist ---
export const PlaylistSchema = z.object({
  playlistId: z.number().int(),
  name: z.string().nullable(),
});
export type Playlist = z.infer<typeof PlaylistSchema>;

// --- Playlist Track ---
export const PlaylistTrackSchema = z.object({
  playlistId: z.number().int(),
  trackId: z.number().int(),
});
export type PlaylistTrack = z.infer<typeof PlaylistTrackSchema>;

/**
 * Сводная информация о треке для таблиц "Details" (ТЗ 1.1, 1.2, 1.3)
 * Объединяет данные из таблиц track, genre и media_type.
 */
export const TrackDetailSchema = z.object({
  trackId: z.number().int(),
  trackName: z.string(),
  genreName: z.string().nullable(),
  mediaTypeName: z.string().nullable(),
});

export type TrackDetail = z.infer<typeof TrackDetailSchema>;