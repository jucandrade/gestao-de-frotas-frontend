export interface MenuPermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Permissions {
  companies?: MenuPermission;
  customers?: MenuPermission;
  vehicles?: MenuPermission;
  users?: MenuPermission;
  userProfiles?: MenuPermission;
}

export interface UserProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
  permissions: Permissions;
}

export interface UserProfilePayload {
  name: string;
  description?: string;
  permissions: Permissions;
}

export const DEFAULT_PERMISSIONS: Permissions = {
  companies: { view: false, create: false, edit: false, delete: false },
  customers: { view: false, create: false, edit: false, delete: false },
  vehicles: { view: false, create: false, edit: false, delete: false },
  users: { view: false, create: false, edit: false, delete: false },
  userProfiles: { view: false, create: false, edit: false, delete: false },
};

export const MENU_LABELS: Record<keyof Permissions, string> = {
  companies: "Empresas",
  customers: "Clientes",
  vehicles: "Veículos",
  users: "Usuários",
  userProfiles: "Perfil do Usuário",
};

export const PERMISSION_LABELS: Record<keyof MenuPermission, string> = {
  view: "Visualizar",
  create: "Criar",
  edit: "Editar",
  delete: "Excluir",
};
