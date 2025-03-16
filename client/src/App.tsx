import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { UserTable } from './components/user/UserTable';
import { UserCreateDialog } from './components/user/UserCreateDialog';
import { UserUpdateDialog } from './components/user/UserUpdateDialog';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// Khởi tạo QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const handleUpdateUser = (userId: string) => {
    setSelectedUserId(userId);
    setUpdateDialogOpen(true);
  };
  
  const handleCreateUser = () => {
    setCreateDialogOpen(true);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-500">Manage your users in one place</p>
        </div>
        
        <UserTable
          onUpdate={handleUpdateUser}
          onCreateNew={handleCreateUser}
        />
        
        <UserCreateDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
        
        {selectedUserId && (
          <UserUpdateDialog
            userId={selectedUserId}
            open={updateDialogOpen}
            onOpenChange={(open) => {
              setUpdateDialogOpen(open);
              if (!open) setSelectedUserId(null);
            }}
          />
        )}
      </div>
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;