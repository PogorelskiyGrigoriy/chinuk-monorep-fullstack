/**
 * @module EntitiesSchema
 * Domain models and DTOs reflecting the Chinook database structure.
 * Uses 'z.coerce' for dates to handle JSON serialization.
 */
import { z } from 'zod';

// --- Core Database Entities ---

/** @entity Artist */
export const ArtistSchema = z.object({
  artistId: z.number().int(),
  name: z.string().nullable(),
});
export type Artist = z.infer<typeof ArtistSchema>;

/** @entity Album */
export const AlbumSchema = z.object({
  albumId: z.number().int(),
  title: z.string().min(1),
  artistId: z.number().int(),
});
export type Album = z.infer<typeof AlbumSchema>;

/** @entity Genre */
export const GenreSchema = z.object({
  genreId: z.number().int(),
  name: z.string().nullable(),
});
export type Genre = z.infer<typeof GenreSchema>;

/** @entity Media Type */
export const MediaTypeSchema = z.object({
  mediaTypeId: z.number().int(),
  name: z.string().nullable(),
});
export type MediaType = z.infer<typeof MediaTypeSchema>;

/** @entity Track */
export const TrackSchema = z.object({
  trackId: z.number().int(),
  name: z.string().min(1),
  albumId: z.number().int().nullable(),
  mediaTypeId: z.number().int(),
  genreId: z.number().int().nullable(),
  composer: z.string().nullable(),
  milliseconds: z.number().int(),
  bytes: z.number().int().nullable(),
  unitPrice: z.number(),
});
export type Track = z.infer<typeof TrackSchema>;

/** @entity Employee (Sales Support/Staff) */
export const EmployeeSchema = z.object({
  employeeId: z.number().int(),
  lastName: z.string().min(1),
  firstName: z.string().min(1),
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

/** @entity Customer */
export const CustomerSchema = z.object({
  customerId: z.number().int(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  company: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  postalCode: z.string().nullable(),
  phone: z.string().nullable(),
  fax: z.string().nullable(),
  email: z.string().nullable(), 
  supportRepId: z.number().int().nullable(),
});
export type Customer = z.infer<typeof CustomerSchema>;

/** @entity Invoice */
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

/** @entity Playlist */
export const PlaylistSchema = z.object({
  playlistId: z.number().int(),
  name: z.string().nullable(),
});
export type Playlist = z.infer<typeof PlaylistSchema>;

// --- Data Transfer Objects (DTOs) for UI views ---

/** * Extended track info for detailed tables (Requirements 1.1, 1.2, 1.3).
 * Flattens relationships with Genre and MediaType.
 */
export const TrackDetailSchema = z.object({
  trackId: z.number().int(),
  name: z.string().nullable(),
  genreName: z.string().nullable(),
  mediaTypeName: z.string().nullable(),
});
export type TrackDetail = z.infer<typeof TrackDetailSchema>;

/** * Album DTO including the Artist name for UI display (Requirement 1.2).
 */
export const AlbumWithArtistSchema = AlbumSchema.extend({
  artistName: z.string().nullable(),
});
export type AlbumWithArtist = z.infer<typeof AlbumWithArtistSchema>;