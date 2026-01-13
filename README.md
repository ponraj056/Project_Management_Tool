# Project Management Tool - Backend API

A comprehensive project management tool backend built with Node.js, Express.js, MongoDB, and JWT Authentication.

## 🚀 Features

### Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (Admin, Member)
- Secure password hashing with bcrypt

### Core Functionality
- **Projects**: Create, read, update, delete projects
- **Tasks**: Full CRUD operations on tasks
- **Task Management**: 
  - Update task status (Todo, In Progress, Done)
  - Assign tasks to team members
  - Set priority levels (Low, Medium, High, Critical)
  - Set due dates
- **Comments**: Add comments to tasks for collaboration
- **Analytics**: 
  - Total tasks count
  - Completed tasks count
  - Pending tasks count
  - Completion rate
  - Tasks by status and priority

## 📁 Project Structure

```
project-management-tool/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Project.js           # Project model
│   │   ├── Task.js              # Task model
│   │   └── Comment.js           # Comment model
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── authorize.js         # Role-based authorization
│   │   └── errorHandler.js      # Error handling
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── projectController.js # Project logic
│   │   ├── taskController.js    # Task logic
│   │   └── commentController.js # Comment logic
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── projectRoutes.js     # Project endpoints
│   │   ├── taskRoutes.js        # Task endpoints
│   │   └── commentRoutes.js     # Comment endpoints
│   └── utils/
│       └── helpers.js           # Utility functions
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── server.js                    # Entry point
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
```bash
cd "d:\projects\Project Management Tool"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and update the values
```

4. **Start MongoDB**
Make sure MongoDB is running on your system.

5. **Run the server**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 📝 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/project-management-tool
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Projects
- `GET /api/projects` - Get all projects (Protected)
- `GET /api/projects/:id` - Get single project (Protected)
- `POST /api/projects` - Create project (Protected)
- `PUT /api/projects/:id` - Update project (Protected, Owner only)
- `DELETE /api/projects/:id` - Delete project (Protected, Owner only)
- `GET /api/projects/:id/analytics` - Get project analytics (Protected)

### Tasks
- `GET /api/tasks/projects/:projectId/tasks` - Get all tasks in a project (Protected)
- `GET /api/tasks/:id` - Get single task (Protected)
- `POST /api/tasks/projects/:projectId/tasks` - Create task (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `PATCH /api/tasks/:id/status` - Update task status (Protected)
- `PATCH /api/tasks/:id/assign` - Assign task to user (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)

### Comments
- `GET /api/comments/tasks/:taskId/comments` - Get all comments for a task (Protected)
- `POST /api/comments/tasks/:taskId/comments` - Create comment (Protected)
- `PUT /api/comments/:id` - Update comment (Protected, Owner only)
- `DELETE /api/comments/:id` - Delete comment (Protected, Owner only)

## 📋 Example Requests

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Member"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Project
```bash
POST /api/projects
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "New Website",
  "description": "Build a new corporate website",
  "members": ["userId1", "userId2"]
}
```

### Create Task
```bash
POST /api/tasks/projects/:projectId/tasks
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "title": "Design homepage",
  "description": "Create mockup for homepage",
  "status": "Todo",
  "priority": "High",
  "dueDate": "2024-12-31",
  "assignedTo": "userId"
}
```

### Update Task Status
```bash
PATCH /api/tasks/:id/status
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "status": "In Progress"
}
```

### Add Comment
```bash
POST /api/comments/tasks/:taskId/comments
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "message": "Great progress on this task!"
}
```

### Get Project Analytics
```bash
GET /api/projects/:id/analytics
Authorization: Bearer <your-token>
```

## 🔐 Authorization

- **Protected Routes**: Require valid JWT token in Authorization header
- **Role-Based Access**: 
  - Admin: Full access to all features
  - Member: Can create projects, tasks, and comments
- **Ownership**: 
  - Only project owners can update/delete projects
  - Only comment owners can update/delete their comments
  - Project members can create tasks and comments

## 🎯 Key Features

1. **Clean MVC Architecture**: Well-organized codebase following best practices
2. **RESTful API Design**: Intuitive and consistent endpoints
3. **Security**: 
   - Password hashing with bcrypt
   - JWT authentication
   - Role-based authorization
4. **Error Handling**: Centralized error handling middleware
5. **Validation**: Input validation using Mongoose schemas
6. **Performance**: Database indexing for optimized queries
7. **Scalability**: Modular structure for easy expansion

## 🧪 Testing

You can test the API using:
- **Postman**: Import the endpoints and test
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension

## 📊 Database Models

### User
- name, email, password (hashed), role
- Timestamps: createdAt, updatedAt

### Project
- name, description, owner, members[]
- Timestamps: createdAt, updatedAt

### Task
- title, description, status, priority, dueDate
- assignedTo, project, createdBy
- Timestamps: createdAt, updatedAt

### Comment
- task, user, message
- Timestamps: createdAt, updatedAt

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 👨‍💻 Development

Built with clean, maintainable code following industry best practices:
- Consistent naming conventions
- Comprehensive comments
- Error handling at every level
- Async/await for clean asynchronous code
- DRY principles

## 📄 License

ISC

---

**Happy Coding! 🎉**
