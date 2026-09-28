export type UserStatus = "active" | "invited" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: UserStatus;
  region: string;
  joinedAt: string;
  lastActiveAt: string;
  revenue: number;
  orders: number;
}

export interface UserQuery extends PageRequest {
  filters?: {
    role?: string;
    status?: string;
    department?: string;
  };
}

export interface UserSummary {
  total: number;
  active: number;
  invited: number;
  suspended: number;
  departments: string[];
}
