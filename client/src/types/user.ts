export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdDate: string;
}

export interface UserCreateInput {
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export interface UserUpdateInput extends UserCreateInput {
  id: string;
}

export interface UsersResponse {
  users: User[];
  totalCount: number;
}

export interface UserFilters {
  name?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}