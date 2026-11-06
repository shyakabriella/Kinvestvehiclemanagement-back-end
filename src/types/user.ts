import type { UserRole, UserStatus } from "./auth";

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  roles: UserRole[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedUsers {
  current_page: number;
  data: ManagedUser[];
  total: number;
  per_page: number;
  last_page: number;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: UserRole;
}
