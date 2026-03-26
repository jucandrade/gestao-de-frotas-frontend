export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  cpf?: string;
  mobile?: string;
  profileId: string;
  profile?: { id: string; name: string };
}

export interface UserPayload {
  name: string;
  email: string;
  cpf?: string;
  mobile?: string;
  password?: string;
  profileId: string;
}
