const db = require('../data/db');

// Get all users with pagination, filtering and sorting
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, name, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Use the filterUsers helper from our in-memory database
    const result = db.filterUsers({ page, pageSize, name, sortBy, sortOrder });
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = db.findUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    // Validate required fields
    const { name, email, role, status } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    // Check if email already exists
    const emailExists = db.users.some(user => user.email === email);
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create new user
    const newUser = db.addUser({
      name,
      email,
      role: role || 'user',
      status: status || 'active'
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    if (!db.findUserById(id)) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user
    const updatedUser = db.updateUser(id, req.body);
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    if (!db.findUserById(id)) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    db.deleteUser(id);
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 