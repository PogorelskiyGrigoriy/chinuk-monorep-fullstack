/**
 * @module InMemoryAuthService
 * Identity service implementation using JWT and Bcrypt.
 */
import jwt from "jsonwebtoken";
import { compare } from "bcrypt-ts";
import {
  type AuthService,
  type UserService,
  type LoginData,
  type AuthResponse,
  type User,
  type JwtPayload
} from "@project/shared";
import { ENV } from "../../../config/env.js";
import { UnauthorizedError } from "../../../utils/app-errors.js";

export class InMemoryAuthService implements AuthService {
  constructor(private userService: UserService) { }

  /**
   * Validates credentials and generates a session token.
   */
  async login(credentials: LoginData): Promise<AuthResponse> {
    const { email, password } = credentials;
    const userWithPass = await this.userService.findByEmail(email);

    // Verify user existence and password hash match
    const isPasswordValid = userWithPass
      ? await compare(password, userWithPass.passwordHash)
      : false;

    if (!userWithPass || !isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const payload: JwtPayload = {
      employeeId: userWithPass.employeeId,
      email: userWithPass.email,
      role: userWithPass.role
    };

    const token = jwt.sign(
      payload,
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );

    const { passwordHash, ...user } = userWithPass;

    return { user, token };
  }

  /**
   * Verifies a token and retrieves the associated user profile.
   */
  async verifySession(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
      const user = await this.userService.getById(decoded.employeeId);

      if (!user) {
        throw new UnauthorizedError("Account no longer exists");
      }

      return user;
    } catch {
      throw new UnauthorizedError("Invalid or expired session");
    }
  }

  async logout(_employeeId: number): Promise<void> {
    // Reserved for future token blacklisting implementation
    return Promise.resolve();
  }
}