// lib/rbac/permissions.ts
import { Role } from "@prisma/client";

export type Permission =
  // View permissions
  | "view:dashboard"
  | "view:news"
  | "view:scientific-works"
  | "view:gallery"
  | "view:members"
  | "view:users"
  | "view:settings"
  | "view:masters"
  | "view:reports"
  | "view:help"

  // News permissions
  | "create:news"
  | "edit:own-news" // Edit berita sendiri
  | "edit:any-news" // Edit berita siapapun
  | "delete:own-news" // Hapus berita sendiri
  | "delete:any-news" // Hapus berita siapapun
  | "publish:news" // Publish berita

  // Scientific works permissions
  | "create:scientific-works"
  | "edit:own-works"
  | "edit:any-works"
  | "delete:own-works"
  | "delete:any-works";

export const rolePermissions: Record<Role, Permission[]> = {
  SUPERADMIN: [
    "view:dashboard",
    "view:news",
    "view:scientific-works",
    "view:gallery",
    "view:members",
    "view:users",
    "view:settings",
    "view:masters",
    "view:reports",
    "view:help",
    "create:news",
    "edit:own-news",
    "edit:any-news", // ✅ Bisa edit berita siapapun
    "delete:own-news",
    "delete:any-news", // ✅ Bisa hapus berita siapapun
    "publish:news",
    "create:scientific-works",
    "edit:own-works",
    "edit:any-works",
    "delete:own-works",
    "delete:any-works",
  ],

  ADMIN: [
    "view:dashboard",
    "view:news",
    "view:scientific-works",
    "view:gallery",
    "view:members",
    "view:users",
    "view:masters",
    "view:reports",
    "view:help",
    "create:news",
    "edit:own-news",
    "edit:any-news", // ✅ Bisa edit berita siapapun
    "delete:own-news",
    "delete:any-news", // ✅ Bisa hapus berita siapapun
    "publish:news",
    "create:scientific-works",
    "edit:own-works",
    "edit:any-works",
    "delete:own-works",
    "delete:any-works",
  ],

  PENULIS_BERITA: [
    "view:dashboard",
    "view:news",
    "view:scientific-works",
    "view:masters",
    "view:reports",
    "view:help",
    "create:news",
    "edit:own-news", // ✅ Hanya bisa edit berita sendiri
    "delete:own-news", // ✅ Hanya bisa hapus berita sendiri
    "create:scientific-works",
    "edit:own-works",
  ],

  ANGGOTA: [
    "view:dashboard",
    "view:news", // ✅ Hanya lihat, tidak bisa edit/hapus
    "view:scientific-works",
    "view:gallery",
    "view:members",
    "view:help",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: Role,
  permissions: Permission[],
): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

// ✅ Helper untuk check ownership-based permission
export function canEditNews(
  userRole: Role,
  userId: string,
  newsAuthorId: string,
): boolean {
  // Superadmin & Admin bisa edit semua
  if (hasPermission(userRole, "edit:any-news")) {
    return true;
  }

  // Penulis bisa edit berita sendiri
  if (hasPermission(userRole, "edit:own-news") && userId === newsAuthorId) {
    return true;
  }

  return false;
}

export function canDeleteNews(
  userRole: Role,
  userId: string,
  newsAuthorId: string,
): boolean {
  // Superadmin & Admin bisa hapus semua
  if (hasPermission(userRole, "delete:any-news")) {
    return true;
  }

  // Penulis bisa hapus berita sendiri
  if (hasPermission(userRole, "delete:own-news") && userId === newsAuthorId) {
    return true;
  }

  return false;
}