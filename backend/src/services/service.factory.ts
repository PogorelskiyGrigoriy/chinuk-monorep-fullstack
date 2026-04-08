/**
 * @module ServiceFactory
 * Централизованный поставщик сервисов для Chinook Explorer.
 * Управляет синглтонами и переключением между БД и In-Memory.
 */
import { ENV } from '../config/env.js';
import logger from '../utils/pino-logger.js';

// Интерфейсы (те, что мы создали без префикса I)
import { 
  CustomersService, 
  MusicService, 
  AuthService 
} from './entities.service.js';
import { type AuditService } from './audit.service.js'; // Предположим, интерфейс аудита готов

// Реализации (Knex / Supabase)
import { CustomersKnexService } from './implementations/knex/customers-knex.service.js';
// Сюда добавишь MusicKnexService и AuthKnexService, когда напишешь их
// import { MusicKnexService } from './implementations/knex/music-knex.service.js';
// import { AuthKnexService } from './implementations/knex/auth-knex.service.js';

// Реализации (In-Memory)
import { InMemoryAuditService } from './implementations/audit-in-memory.service.js';

export class ServiceFactory {
  private static customersInstance: CustomersService | null = null;
  private static musicInstance: MusicService | null = null;
  private static authInstance: AuthService | null = null;
  private static auditInstance: AuditService | null = null;

  /**
   * Возвращает сервис Аудита (Accounting layer).
   * Согласно твоему требованию: всегда IN_MEMORY.
   */
  static getAuditService(): AuditService {
    if (this.auditInstance) return this.auditInstance;

    try {
      logger.info('Initializing Audit service (In-Memory)');
      this.auditInstance = new InMemoryAuditService();
      return this.auditInstance;
    } catch (error) {
      logger.fatal({ err: error }, 'Failed to initialize AuditService');
      throw error;
    }
  }

  /**
   * Возвращает сервис для работы с клиентами.
   */
  static getCustomersService(): CustomersService {
    if (this.customersInstance) return this.customersInstance;

    const dbType = ENV.DB_TYPE;
    try {
      if (dbType === 'SUPABASE') {
        logger.info({ dbType }, 'Initializing Customers provider (Knex/Supabase)');
        this.customersInstance = new CustomersKnexService();
      } else {
        // Оставляем возможность для тестов или будущего расширения
        throw new Error(`${dbType} implementation for Customers is not ready yet.`);
      }
      return this.customersInstance;
    } catch (error) {
      logger.fatal({ err: error, dbType }, 'Failed to initialize CustomersService');
      throw error;
    }
  }

  /**
   * Возвращает сервис для работы с музыкой (Альбомы, Плейлисты, Треки).
   */
  static getMusicService(): MusicService {
    if (this.musicInstance) return this.musicInstance;

    const dbType = ENV.DB_TYPE;
    try {
      if (dbType === 'SUPABASE') {
        logger.info({ dbType }, 'Initializing Music provider (Knex/Supabase)');
        // Пока мы не создали MusicKnexService, здесь может быть ошибка компиляции
        // this.musicInstance = new MusicKnexService(); 
        throw new Error('MusicKnexService not implemented yet');
      }
      throw new Error(`${dbType} implementation for Music is not ready yet.`);
    } catch (error) {
      logger.fatal({ err: error, dbType }, 'Failed to initialize MusicService');
      throw error;
    }
  }

  /**
   * Возвращает сервис аутентификации.
   */
  static getAuthService(): AuthService {
    if (this.authInstance) return this.authInstance;

    const dbType = ENV.DB_TYPE;
    try {
      if (dbType === 'SUPABASE') {
        logger.info({ dbType }, 'Initializing Auth provider (Knex/Supabase)');
        // this.authInstance = new AuthKnexService();
        throw new Error('AuthKnexService not implemented yet');
      }
      throw new Error(`${dbType} implementation for Auth is not ready yet.`);
    } catch (error) {
      logger.fatal({ err: error, dbType }, 'Failed to initialize AuthService');
      throw error;
    }
  }

  /**
   * Сброс всех сервисов (полезно для тестов).
   */
  static resetServices(): void {
    logger.warn('All ServiceFactory instances have been reset');
    this.customersInstance = null;
    this.musicInstance = null;
    this.authInstance = null;
    this.auditInstance = null;
  }
}