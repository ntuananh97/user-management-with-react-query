# User Management API

A RESTful API for user management built with Node.js and Express using an in-memory database.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3001
```

3. Start the server:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

## In-Memory Database

This API uses an in-memory database that is initialized with sample user data. The data will be reset when the server restarts.

## API Endpoints

### Users

- `GET /users` - Get all users with pagination, filtering and sorting
  - Query parameters:
    - `page` (default: 1)
    - `pageSize` (default: 10)
    - `name` (optional, for filtering)
    - `sortBy` (default: 'createdAt')
    - `sortOrder` (default: 'desc')

- `GET /users/:id` - Get user by ID

- `POST /users` - Create new user
  - Request body:
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "role": "user",
      "status": "active"
    }
    ```

- `PUT /users/:id` - Update user
  - Request body: Same as POST with fields to update

- `DELETE /users/:id` - Delete user 