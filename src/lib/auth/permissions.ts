import type { AuthUser, UserRole } from "@/types/auth";

export function hasRole(
  user: AuthUser,
  role: UserRole
): boolean {
  return user.roles.includes(role);
}

export function hasPermission(
  user: AuthUser,
  permission: string
): boolean {
  return user.permissions.includes(permission);
}

export function isSystemAdmin(user: AuthUser): boolean {
  return hasRole(user, "system_admin");
}

export function canManageUsers(user: AuthUser): boolean {
  return hasPermission(user, "users.view");
}
