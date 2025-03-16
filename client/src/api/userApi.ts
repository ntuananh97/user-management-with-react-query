import axios from 'axios';
import { User, UserCreateInput, UserUpdateInput, UsersResponse, UserFilters } from '../types/user';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchUsers = async (filters: UserFilters): Promise<UsersResponse> => {
  const { page, pageSize, name, sortBy, sortOrder } = filters;
  const response = await api.get('/users', {
    params: {
      page,
      pageSize,
      name,
      sortBy,
      sortOrder,
    },
  });
  return response.data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: UserCreateInput): Promise<User> => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (userData: UserUpdateInput): Promise<User> => {
  const response = await api.put(`/users/${userData.id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};