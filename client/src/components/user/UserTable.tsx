import { useEffect, useState } from 'react';
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useUsers, useDeleteUser } from '@/hooks/useUserQueries';
import { UserFilters } from '@/types/user';
import dayjs from 'dayjs';
import { useDebounce } from '@/hooks/useDebounce';
  
interface UserTableProps {
  onUpdate: (userId: string) => void;
  onCreateNew: () => void;
}

export function UserTable({ onUpdate, onCreateNew }: UserTableProps) {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    pageSize: 10,
    sortBy: 'createdDate',
    sortOrder: 'desc',
  });
  
  const [nameFilter, setNameFilter] = useState('');
  const debouncedNameFilter = useDebounce(nameFilter, 500);
  
  // Cập nhật filters khi nameFilter thay đổi
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      name: debouncedNameFilter || undefined,
    }));
  }, [debouncedNameFilter]);
  
  
  const { data, isLoading, isError } = useUsers({
    ...filters,
    name: debouncedNameFilter || undefined,
  });
  console.log(" UserTable ~ data:", data)
  
  const deleteUserMutation = useDeleteUser();
  
  const handleSort = (column: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };
  
  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading users</div>;
  
  const users = data?.users || [];
  const totalPages = Math.ceil((data?.totalCount || 0) / filters.pageSize);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button onClick={onCreateNew}>Create New User</Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('createdDate')}
            >
              <div className="flex items-center">
                Created Date
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  {dayjs(user.createdDate).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onUpdate(user.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => filters.page > 1 && handlePageChange(filters.page - 1)}
                className={filters.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={filters.page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => filters.page < totalPages && handlePageChange(filters.page + 1)}
                className={filters.page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}