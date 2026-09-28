export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  expiresAt: string;
}
