export type WorkspaceRole = "client" | "owner" | "admin" | "sysadmin";

type UserWithRoles = {
  role?: string | null;
  roles?: Array<{ name?: string | null }>;
} | null;

const workspaceRoles: WorkspaceRole[] = ["sysadmin", "admin", "owner", "client"];

const clientWorkspacePaths = new Set([
  "/espace",
  "/espace/notifications",
]);

function normalizeRole(value?: string | null): WorkspaceRole | null {
  const role = value?.trim().toLowerCase();

  if (role === "propriétaire" || role === "proprietaire") {
    return "owner";
  }

  return workspaceRoles.find((item) => item === role) ?? null;
}

export function getWorkspaceRole(user: UserWithRoles): WorkspaceRole {
  const relationRoles = user?.roles
    ?.map((role) => normalizeRole(role.name))
    .filter((role): role is WorkspaceRole => role !== null) ?? [];

  for (const role of workspaceRoles) {
    if (relationRoles.includes(role)) {
      return role;
    }
  }

  return normalizeRole(user?.role) ?? "client";
}

export function isOwnerWorkspaceRole(role: WorkspaceRole) {
  return role === "owner" || role === "admin" || role === "sysadmin";
}

export function isAdminWorkspaceRole(role: WorkspaceRole) {
  return role === "admin" || role === "sysadmin";
}

export function canAccessWorkspacePath(role: WorkspaceRole, pathname: string) {
  if (pathname === "/espace/materiel" || pathname.startsWith("/espace/materiel/")) {
    return isAdminWorkspaceRole(role);
  }

  return isOwnerWorkspaceRole(role) || clientWorkspacePaths.has(pathname);
}
