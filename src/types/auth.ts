export type UserRole =
  | "system_admin"
  | "fleet_admin"
  | "management"
  | "employee";

export type UserStatus =
  | "active"
  | "inactive"
  | "suspended";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  roles: UserRole[];
  permissions: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token_type: "Bearer";
  access_token: string;
  expires_in: number;
  user: AuthUser;
}

export interface ApiSession {
  id: number;
  name: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_current: boolean;
}
