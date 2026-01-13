# API Testing Guide

Complete API testing examples for the Project Management Tool.

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register User (Admin)
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "Admin"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "Admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Register User (Member)
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "john123",
  "role": "Member"
}
```

### 3. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 4. Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📁 Project Endpoints

### 1. Create Project
```http
POST /api/projects
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "E-Commerce Website",
  "description": "Build a modern e-commerce platform with React and Node.js",
  "members": []
}
```

### 2. Get All Projects
```http
GET /api/projects
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Get Single Project
```http
GET /api/projects/{PROJECT_ID}
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Update Project
```http
PUT /api/projects/{PROJECT_ID}
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "E-Commerce Website v2",
  "description": "Updated description with new features",
  "members": ["USER_ID_1", "USER_ID_2"]
}
```

### 5. Delete Project
```http
DELETE /api/projects/{PROJECT_ID}
Authorization: Bearer YOUR_TOKEN_HERE
```

### 6. Get Project Analytics
```http
GET /api/projects/{PROJECT_ID}/analytics
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalTasks": 10,
    "completedTasks": 5,
    "pendingTasks": 5,
    "completionRate": "50.00%",
    "tasksByStatus": [
      { "_id": "Todo", "count": 3 },
      { "_id": "In Progress", "count": 2 },
      { "_id": "Done", "count": 5 }
    ],
    "tasksByPriority": [
      { "_id": "Low", "count": 2 },
      { "_id": "Medium", "count": 4 },
      { "_id": "High", "count": 3 },
      { "_id": "Critical", "count": 1 }
    ]
  }
}
```

---

## ✅ Task Endpoints

### 1. Create Task
```http
POST /api/tasks/projects/{PROJECT_ID}/tasks
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Design Database Schema",
  "description": "Create MongoDB schema for users, products, and orders",
  "status": "Todo",
  "priority": "High",
  "dueDate": "2024-02-15",
  "assignedTo": "USER_ID"
}
```

### 2. Get All Tasks in Project
```http
GET /api/tasks/projects/{PROJECT_ID}/tasks
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Get Single Task
```http
GET /api/tasks/{TASK_ID}
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Update Task
```http
PUT /api/tasks/{TASK_ID}
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Design Database Schema - Updated",
  "description": "Create MongoDB schema with indexing strategy",
  "priority": "Critical"
}
```

### 5. Update Task Status
```http
PATCH /api/tasks/{TASK_ID}/status
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "status": "In Progress"
}
```

**Valid Status Values:**
- `Todo`
- `In Progress`
- `Done`

### 6. Assign Task to User
```http
PATCH /api/tasks/{TASK_ID}/assign
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "userId": "USER_ID"
}
```

**To unassign a task:**
```json
{
  "userId": null
}
```

### 7. Delete Task
```http
DELETE /api/tasks/{TASK_ID}
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 💬 Comment Endpoints

### 1. Create Comment
```http
POST /api/comments/tasks/{TASK_ID}/comments
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "message": "I've started working on this. Should be done by EOD."
}
```

### 2. Get All Comments for Task
```http
GET /api/comments/tasks/{TASK_ID}/comments
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Update Comment
```http
PUT /api/comments/{COMMENT_ID}
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "message": "Updated: Will need one more day to complete this properly."
}
```

### 4. Delete Comment
```http
DELETE /api/comments/{COMMENT_ID}
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🏥 Health Check

### Server Health
```http
GET /api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-13T07:59:00.000Z"
}
```

---

## 📝 Complete Testing Flow

### Step 1: Register Users
1. Register an Admin user
2. Register 2-3 Member users
3. Save all tokens

### Step 2: Create Projects
1. Create a project as the Admin
2. Note the project ID

### Step 3: Add Members to Project
1. Update the project to add member user IDs to the members array

### Step 4: Create Tasks
1. Create 5-10 tasks with different priorities and statuses
2. Assign some tasks to different users

### Step 5: Add Comments
1. Add comments to various tasks from different users

### Step 6: Update Task Status
1. Move tasks through the workflow: Todo → In Progress → Done

### Step 7: Check Analytics
1. Get project analytics to see completion rates

---

## 🔧 Testing Tools

### Using cURL
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"admin123","role":"Admin"}'

# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Create project (replace TOKEN)
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Test Project","description":"A test project"}'
```

### Using Postman
1. Import this document as a collection
2. Set up environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: Your JWT token
3. Use `{{base_url}}` and `{{token}}` in requests

### Using VS Code REST Client
Create a file `test.http` and use the VS Code REST Client extension.

---

## ⚠️ Common Errors

### 401 Unauthorized
- Token is missing or invalid
- Token has expired (default: 7 days)
- Solution: Login again to get a new token

### 403 Forbidden
- You don't have permission for this action
- Example: Non-owner trying to delete a project

### 404 Not Found
- Resource doesn't exist
- Check if the ID is correct

### 400 Bad Request
- Validation error
- Missing required fields
- Invalid data format

---

## 📊 Priority Levels
- `Low`
- `Medium`
- `High`
- `Critical`

## 📋 Task Statuses
- `Todo`
- `In Progress`
- `Done`

## 👥 User Roles
- `Admin` - Full access
- `Member` - Standard access

---

**Happy Testing! 🚀**
