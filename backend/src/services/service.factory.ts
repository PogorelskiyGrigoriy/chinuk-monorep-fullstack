/**
 * @module ServiceFactory
 * Centralized initialization and dependency injection for all application services.
 */
import { ENV } from '../config/env.js';
import { 
  type AuthService, 
  type AuditService, 
  type UserService 
} from '@project/shared';
import { CustomersService, MusicService } from './entities.service.js';

// Импорт реализаций
import { InMemoryAuditService } from './implementations/in-memory/audit-in-memory.service.js';
import { InMemoryUserService } from './implementations/in-memory/user-in-memory.service.js';
import { InMemoryAuthService } from './implementations/in-memory/auth-in-memory.service.js';
import { CustomersKnexService } from './implementations/knex/customers-knex.service.js';

/**
 * Класс-контейнер для всех сервисов системы.
 */
class ServiceFactory {
  public readonly audit: AuditService;
  public readonly user: UserService;
  public readonly auth: AuthService;
  public readonly customers: CustomersService;
  // public readonly music: MusicService; // Добавим, когда напишем реализацию

  constructor() {
    // 1. Инициализируем базовые сервисы
    this.audit = new InMemoryAuditService();
    this.user = new InMemoryUserService();

    // 2. Инъекция зависимостей: AuthService нужен UserService для проверки паролей
    this.auth = new InMemoryAuthService(this.user);

    // 3. Выбор реализации для работы с данными Chinook
    // Даже если в ENV стоит выбор, сейчас у нас готова только Knex версия
    this.customers = new CustomersKnexService();
    
    // Здесь будет MusicService, когда мы его реализуем
    // this.music = new MusicKnexService();
  }
}

// Экспортируем единственный экземпляр фабрики (Singleton)
export const services = new ServiceFactory();