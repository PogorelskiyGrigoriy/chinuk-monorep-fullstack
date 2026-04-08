/**
 * @module ServiceFactory
 * Centralized initialization and dependency injection (DI) container.
 * Orchestrates the creation of all application services and manages their dependencies.
 */
import { 
  type AuthService, 
  type AuditService, 
  type UserService 
} from '@project/shared';
import { CustomersService, MusicService } from './entities.service.js';

// Implementation imports
import { InMemoryAuditService } from './implementations/in-memory/audit-in-memory.service.js';
import { InMemoryUserService } from './implementations/in-memory/user-in-memory.service.js';
import { InMemoryAuthService } from './implementations/in-memory/auth-in-memory.service.js';
import { CustomersKnexService } from './implementations/knex/customers-knex.service.js';
import { MusicKnexService } from './implementations/knex/music-knex.service.js';
import logger from '../utils/pino-logger.js';

/**
 * ServiceFactory class.
 * Acts as a Singleton container for shared service instances.
 */
class ServiceFactory {
  public readonly audit: AuditService;
  public readonly user: UserService;
  public readonly auth: AuthService;
  public readonly customers: CustomersService;
  public readonly music: MusicService;

  constructor() {
    // 1. Initialize core infrastructure services
    this.audit = new InMemoryAuditService();
    this.user = new InMemoryUserService();

    // 2. Dependency Injection: AuthService requires UserService for identity lookups
    this.auth = new InMemoryAuthService(this.user);

    // 3. Initialize data-domain services (Database-backed)
    this.customers = new CustomersKnexService();
    this.music = new MusicKnexService();

    logger.info('ServiceFactory: All services initialized and dependencies injected');
  }
}

/**
 * Export a single instance of the factory (Singleton pattern).
 * This ensures all controllers share the same service state.
 */
export const services = new ServiceFactory();