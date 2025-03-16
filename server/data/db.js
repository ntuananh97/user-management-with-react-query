const { v4: uuidv4 } = require('uuid');

// Initial users data
let users = [
  {
    id: uuidv4(),
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2023-01-15T08:30:00Z'),
    updatedAt: new Date('2023-01-15T08:30:00Z')
  },
  {
    id: uuidv4(),
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2023-02-20T10:15:00Z'),
    updatedAt: new Date('2023-02-20T10:15:00Z')
  },
  {
    id: uuidv4(),
    name: ' Johnson',
    email: 'bob@example.com',
    role: 'editor',
    status: 'inactive',
    createdAt: new Date('2023-03-10T14:45:00Z'),
    updatedAt: new Date('2023-03-10T14:45:00Z')
  },
  {
    id: uuidv4(),
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'user',
    status: 'pending',
    createdAt: new Date('2023-04-05T09:20:00Z'),
    updatedAt: new Date('2023-04-05T09:20:00Z')
  },
  {
    id: uuidv4(),
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2023-05-12T16:30:00Z'),
    updatedAt: new Date('2023-05-12T16:30:00Z')
  }
];

module.exports = {
  users,
  // Helper function to find a user by ID
  findUserById: (id) => {
    return users.find(user => user.id === id);
  },
  // Helper function to add a new user
  addUser: (userData) => {
    const newUser = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(newUser);
    return newUser;
  },
  // Helper function to update a user
  updateUser: (id, userData) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    const updatedUser = {
      ...users[index],
      ...userData,
      id, // Ensure ID doesn't change
      updatedAt: new Date()
    };
    
    users[index] = updatedUser;
    return updatedUser;
  },
  // Helper function to delete a user
  deleteUser: (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    users.splice(index, 1);
    return true;
  },
  // Helper function to filter and paginate users
  filterUsers: (filters) => {
    const { page = 1, pageSize = 10, name, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
    
    // Filter by name if provided
    let filteredUsers = [...users];
    if (name) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    // Sort users
    filteredUsers.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
    
    // Calculate pagination
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      users: paginatedUsers,
      pagination: {
        total: filteredUsers.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(filteredUsers.length / parseInt(pageSize))
      }
    };
  }
}; 