import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchUsers, fetchUserById, createUser, updateUser, deleteUser } from '../api/userApi';
import { UserCreateInput, UserUpdateInput, UserFilters } from '../types/user';

// Keys for React Query
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook cho danh sách users
export const useUsers = (filters: UserFilters) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
  });
};

// Hook cho chi tiết user
export const useUserDetail = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id, // Chỉ gọi khi có id
  });
};

// Hook cho create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserCreateInput) => createUser(data),
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      toast.error(`Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });
};

// Hook cho update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserUpdateInput) => updateUser(data),
    onSuccess: (data) => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
    },
    onError: (error) => {
      toast.error(`Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });
};

// Hook cho delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      toast.error(`Error deleting user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });
};