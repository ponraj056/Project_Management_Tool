# 🗄️ MongoDB Database Architecture - Project Management Tool

## **Database Schema Design & Implementation**

---

## 📑 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Collections](#collections)
3. [Schema Definitions](#schema-definitions)
4. [Relationships](#relationships)
5. [Indexing Strategy](#indexing-strategy)
6. [Sample Documents](#sample-documents)
7. [Query Optimization](#query-optimization)
8. [Best Practices](#best-practices)

---

## 📊 **OVERVIEW**

### **Database Name**
```
project-management-tool
```

### **Collections (4 Total)**
```
✅ users      - User accounts and authentication
✅ projects   - Project information and metadata
✅ tasks      - Task details and tracking
✅ comments   - Task discussion and collaboration
```

### **Design Philosophy**
- **Normalized** - Separate collections for each entity
- **Referenced** - ObjectId references between collections
- **Indexed** - Strategic indexes for performance
- **Validated** - Schema validation for data integrity
- **Timestamped** - Automatic createdAt/updatedAt tracking

---

## 🗂️ **COLLECTIONS**

### **1. Users Collection**
**Purpose:** Store user accounts and authentication data

**Fields:**
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password (bcrypt)
- `role` - User role (Admin/Member)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

**Key Features:**
- Unique email constraint
- Password hashing before save
- Email format validation
- Role-based access control

---

### **2. Projects Collection**
**Purpose:** Store project information and team membership

**Fields:**
- `name` - Project name
- `description` - Project description
- `owner` - Reference to User (ObjectId)
- `members` - Array of User references (ObjectId[])
- `createdAt` - Project creation timestamp
- `updatedAt` - Last update timestamp

**Key Features:**
- Owner tracking
- Team member management
- Virtual tasks relationship
- Cascade delete support

---

### **3. Tasks Collection**
**Purpose:** Store task details and tracking information

**Fields:**
- `title` - Task title
- `description` - Task description
- `status` - Task status (Todo/In Progress/Done)
- `priority` - Priority level (Low/Medium/High/Critical)
- `dueDate` - Task deadline
- `assignedTo` - Reference to User (ObjectId, nullable)
- `project` - Reference to Project (ObjectId)
- `createdBy` - Reference to User (ObjectId)
- `createdAt` - Task creation timestamp
- `updatedAt` - Last update timestamp

**Key Features:**
- Status and priority enums
- Assignment tracking
- Project association
- Compound indexes for filtering

---

### **4. Comments Collection**
**Purpose:** Store task discussions and collaboration

**Fields:**
- `task` - Reference to Task (ObjectId)
- `user` - Reference to User (ObjectId)
- `message` - Comment text
- `createdAt` - Comment creation timestamp
- `updatedAt` - Last update timestamp

**Key Features:**
- Task association
- User tracking
- Chronological ordering
- Message length validation

---

## 📋 **SCHEMA DEFINITIONS**

### **1. User Schema**

```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,  // Don't include by default in queries
    },
    role: {
      type: String,
      enum: ['Admin', 'Member'],
      default: 'Member',
    },
  },
  {
    timestamps: true,  // Auto-adds createdAt and updatedAt
  }
);

// Pre-save hook: Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: Compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**Indexes:**
```javascript
// Automatic unique index on email
db.users.createIndex({ email: 1 }, { unique: true })
```

---

### **2. Project Schema**

```javascript
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
      maxlength: [100, 'Project name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field: Get all tasks for this project
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
});
```

**Indexes:**
```javascript
// Index on owner for fast owner-based queries
db.projects.createIndex({ owner: 1 })

// Index on members for team filtering
db.projects.createIndex({ members: 1 })
```

---

### **3. Task Schema**

```javascript
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [100, 'Task title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a task description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Done'],
      default: 'Todo',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for filtering tasks by project and status
taskSchema.index({ project: 1, status: 1 });

// Index on assignedTo for user-specific queries
taskSchema.index({ assignedTo: 1 });
```

**Indexes:**
```javascript
// Compound index for project + status queries
db.tasks.createIndex({ project: 1, status: 1 })

// Index on assignedTo for user task queries
db.tasks.createIndex({ assignedTo: 1 })

// Index on project for all project tasks
db.tasks.createIndex({ project: 1 })
```

---

### **4. Comment Schema**

```javascript
const commentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a comment message'],
      trim: true,
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for task comments sorted by time
commentSchema.index({ task: 1, createdAt: -1 });
```

**Indexes:**
```javascript
// Compound index for task + timestamp sorting
db.comments.createIndex({ task: 1, createdAt: -1 })
```

---

## 🔗 **RELATIONSHIPS**

### **Entity Relationship Diagram**

```
┌─────────────┐
│    USER     │
│  _id (PK)   │
└──────┬──────┘
       │
       │ 1:M (owner)
       ├─────────────────┐
       │                 │
       │ M:M (members)   │ 1:M (createdBy)
       │                 │
       ▼                 ▼
┌─────────────┐    ┌─────────────┐
│   PROJECT   │    │    TASK     │
│  _id (PK)   │    │  _id (PK)   │
│  owner (FK) │◄───┤  project(FK)│
│  members[]  │ 1:M│  assignedTo │
└─────────────┘    └──────┬──────┘
                          │
                          │ 1:M
                          │
                          ▼
                   ┌─────────────┐
                   │   COMMENT   │
                   │  _id (PK)   │
                   │  task (FK)  │
                   │  user (FK)  │
                   └─────────────┘
```

### **Relationship Explanations**

#### **1. User → Project (Owner)**
```
Relationship: One-to-Many
Type: Referenced
Field: Project.owner → User._id

Description:
- One user can own multiple projects
- Each project has exactly one owner
- Owner has full control over the project
```

#### **2. User ↔ Project (Members)**
```
Relationship: Many-to-Many
Type: Referenced (Array)
Field: Project.members[] → User._id[]

Description:
- Users can be members of multiple projects
- Projects can have multiple members
- Stored as array of ObjectIds in Project
```

#### **3. Project → Task**
```
Relationship: One-to-Many
Type: Referenced + Virtual
Field: Task.project → Project._id
Virtual: Project.tasks → [Task]

Description:
- One project contains multiple tasks
- Each task belongs to one project
- Virtual populate for easy task access
```

#### **4. User → Task (Creator)**
```
Relationship: One-to-Many
Type: Referenced
Field: Task.createdBy → User._id

Description:
- One user can create multiple tasks
- Each task tracks its creator
- For audit and ownership tracking
```

#### **5. User → Task (Assignment)**
```
Relationship: One-to-Many (Optional)
Type: Referenced
Field: Task.assignedTo → User._id (nullable)

Description:
- Tasks can be assigned to users
- Users can have multiple assigned tasks
- Assignment is optional (nullable)
```

#### **6. Task → Comment**
```
Relationship: One-to-Many
Type: Referenced
Field: Comment.task → Task._id

Description:
- One task can have multiple comments
- Each comment belongs to one task
- Used for task discussions
```

#### **7. User → Comment**
```
Relationship: One-to-Many
Type: Referenced
Field: Comment.user → User._id

Description:
- One user can write multiple comments
- Each comment has one author
- Tracks comment ownership
```

---

## 🔍 **INDEXING STRATEGY**

### **Performance Indexes**

#### **1. Users Collection**
```javascript
// Unique index on email (automatic)
{ email: 1 } - UNIQUE

Purpose: Fast login queries, prevent duplicates
Query: db.users.find({ email: "user@example.com" })
Impact: O(1) lookup instead of O(n) collection scan
```

#### **2. Projects Collection**
```javascript
// Index on owner
{ owner: 1 }

Purpose: Fast "my projects" queries
Query: db.projects.find({ owner: userId })
Impact: Reduces query time for user's projects

// Index on members
{ members: 1 }

Purpose: Find projects where user is a member
Query: db.projects.find({ members: userId })
Impact: Efficient member-based filtering
```

#### **3. Tasks Collection**
```javascript
// Compound index on project + status
{ project: 1, status: 1 }

Purpose: Filter tasks by project and status
Query: db.tasks.find({ project: projectId, status: "Done" })
Impact: Optimized for Kanban board queries
Use Case: Get all "In Progress" tasks for a project

// Index on assignedTo
{ assignedTo: 1 }

Purpose: Find tasks assigned to specific user
Query: db.tasks.find({ assignedTo: userId })
Impact: Fast user task queries

// Index on project
{ project: 1 }

Purpose: Get all tasks for a project
Query: db.tasks.find({ project: projectId })
Impact: Essential for project view
```

#### **4. Comments Collection**
```javascript
// Compound index on task + createdAt (descending)
{ task: 1, createdAt: -1 }

Purpose: Get comments sorted by time
Query: db.comments.find({ task: taskId }).sort({ createdAt: -1 })
Impact: Pre-sorted results, no sort operation needed
Use Case: Display recent comments first
```

### **Index Strategy Summary**

| Collection | Index | Type | Purpose |
|------------|-------|------|---------|
| users | email | Unique | Login, prevent duplicates |
| projects | owner | Single | Owner queries |
| projects | members | Single | Member filtering |
| tasks | project + status | Compound | Kanban filtering |
| tasks | assignedTo | Single | User tasks |
| tasks | project | Single | Project tasks |
| comments | task + createdAt | Compound | Sorted comments |

---

## 📄 **SAMPLE DOCUMENTS**

### **1. User Document**

```javascript
{
  "_id": ObjectId("65a1234567890abcdef12345"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$abcdefghijklmnopqrstuvwxyz123456789",  // Hashed
  "role": "Admin",
  "createdAt": ISODate("2024-01-13T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-13T10:30:00.000Z"),
  "__v": 0
}
```

**Explanation:**
- `_id`: Unique MongoDB ObjectId
- `password`: Hashed with bcrypt (never stored plain)
- `role`: Enum value (Admin or Member)
- `timestamps`: Automatically managed by Mongoose

---

### **2. Project Document**

```javascript
{
  "_id": ObjectId("65a2234567890abcdef23456"),
  "name": "E-Commerce Website",
  "description": "Build a modern e-commerce platform with React and Node.js",
  "owner": ObjectId("65a1234567890abcdef12345"),  // Reference to User
  "members": [
    ObjectId("65a1234567890abcdef12346"),  // Team member 1
    ObjectId("65a1234567890abcdef12347")   // Team member 2
  ],
  "createdAt": ISODate("2024-01-13T11:00:00.000Z"),
  "updatedAt": ISODate("2024-01-13T11:00:00.000Z"),
  "__v": 0
}
```

**Explanation:**
- `owner`: ObjectId reference to the user who created the project
- `members`: Array of ObjectId references to team members
- References are populated when queried with `.populate()`

**Populated Document:**
```javascript
{
  "_id": ObjectId("65a2234567890abcdef23456"),
  "name": "E-Commerce Website",
  "description": "Build a modern e-commerce platform",
  "owner": {
    "_id": ObjectId("65a1234567890abcdef12345"),
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Admin"
  },
  "members": [
    {
      "_id": ObjectId("65a1234567890abcdef12346"),
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ],
  "createdAt": ISODate("2024-01-13T11:00:00.000Z"),
  "updatedAt": ISODate("2024-01-13T11:00:00.000Z")
}
```

---

### **3. Task Document**

```javascript
{
  "_id": ObjectId("65a3234567890abcdef34567"),
  "title": "Design Homepage Mockup",
  "description": "Create high-fidelity mockup for the homepage with all sections",
  "status": "In Progress",
  "priority": "High",
  "dueDate": ISODate("2024-01-20T00:00:00.000Z"),
  "assignedTo": ObjectId("65a1234567890abcdef12346"),  // Reference to User
  "project": ObjectId("65a2234567890abcdef23456"),     // Reference to Project
  "createdBy": ObjectId("65a1234567890abcdef12345"),   // Reference to User
  "createdAt": ISODate("2024-01-13T12:00:00.000Z"),
  "updatedAt": ISODate("2024-01-14T09:30:00.000Z"),
  "__v": 0
}
```

**Explanation:**
- `status`: Enum value (Todo, In Progress, Done)
- `priority`: Enum value (Low, Medium, High, Critical)
- `assignedTo`: Can be null if unassigned
- `project`: Required reference to parent project
- `createdBy`: Tracks who created the task

**Populated Document:**
```javascript
{
  "_id": ObjectId("65a3234567890abcdef34567"),
  "title": "Design Homepage Mockup",
  "description": "Create high-fidelity mockup for the homepage",
  "status": "In Progress",
  "priority": "High",
  "dueDate": ISODate("2024-01-20T00:00:00.000Z"),
  "assignedTo": {
    "_id": ObjectId("65a1234567890abcdef12346"),
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "project": {
    "_id": ObjectId("65a2234567890abcdef23456"),
    "name": "E-Commerce Website"
  },
  "createdBy": {
    "_id": ObjectId("65a1234567890abcdef12345"),
    "name": "John Doe"
  },
  "createdAt": ISODate("2024-01-13T12:00:00.000Z"),
  "updatedAt": ISODate("2024-01-14T09:30:00.000Z")
}
```

---

### **4. Comment Document**

```javascript
{
  "_id": ObjectId("65a4234567890abcdef45678"),
  "task": ObjectId("65a3234567890abcdef34567"),  // Reference to Task
  "user": ObjectId("65a1234567890abcdef12345"),  // Reference to User
  "message": "Started working on this. Will have first draft by EOD.",
  "createdAt": ISODate("2024-01-14T10:00:00.000Z"),
  "updatedAt": ISODate("2024-01-14T10:00:00.000Z"),
  "__v": 0
}
```

**Explanation:**
- `task`: Reference to the task being commented on
- `user`: Reference to the comment author
- `message`: Comment text (max 500 characters)

**Populated Document:**
```javascript
{
  "_id": ObjectId("65a4234567890abcdef45678"),
  "task": ObjectId("65a3234567890abcdef34567"),
  "user": {
    "_id": ObjectId("65a1234567890abcdef12345"),
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Started working on this. Will have first draft by EOD.",
  "createdAt": ISODate("2024-01-14T10:00:00.000Z"),
  "updatedAt": ISODate("2024-01-14T10:00:00.000Z")
}
```

---

## ⚡ **QUERY OPTIMIZATION**

### **Efficient Query Examples**

#### **1. Get User's Projects**
```javascript
// With index on owner
db.projects.find({ owner: userId })

// Index used: { owner: 1 }
// Time complexity: O(log n)
```

#### **2. Get Project Tasks by Status**
```javascript
// With compound index
db.tasks.find({ 
  project: projectId, 
  status: "In Progress" 
})

// Index used: { project: 1, status: 1 }
// Time complexity: O(log n)
```

#### **3. Get Task Comments (Sorted)**
```javascript
// With compound index
db.comments.find({ task: taskId })
  .sort({ createdAt: -1 })

// Index used: { task: 1, createdAt: -1 }
// No additional sort needed (pre-sorted by index)
```

#### **4. Get User's Assigned Tasks**
```javascript
// With index on assignedTo
db.tasks.find({ assignedTo: userId })

// Index used: { assignedTo: 1 }
// Time complexity: O(log n)
```

### **Population Best Practices**

```javascript
// Good: Populate only needed fields
Task.find({ project: projectId })
  .populate('assignedTo', 'name email')
  .populate('createdBy', 'name');

// Bad: Over-populating
Task.find({ project: projectId })
  .populate('assignedTo')  // Gets all user data
  .populate('createdBy')
  .populate('project');    // Unnecessary circular reference
```

---

## ✅ **BEST PRACTICES**

### **1. Data Validation**
```javascript
// Always validate at schema level
✅ Required fields marked
✅ String length limits
✅ Enum validation
✅ Email format validation
✅ Reference validation
```

### **2. Indexing**
```javascript
// Strategic indexing
✅ Index frequently queried fields
✅ Compound indexes for multi-field queries
✅ Unique indexes for constraints
❌ Don't over-index (slows writes)
```

### **3. References**
```javascript
// Use references appropriately
✅ Referenced relationships (users, projects)
✅ Populate when needed
✅ Select specific fields when populating
❌ Don't embed large documents
```

### **4. Timestamps**
```javascript
// Always enable timestamps
✅ Automatic createdAt
✅ Automatic updatedAt
✅ Track data changes
✅ Audit trail
```

### **5. Security**
```javascript
// Security considerations
✅ Hash passwords (never store plain)
✅ Exclude password from queries (select: false)
✅ Validate user input
✅ Sanitize data
```

---

## 📊 **DATABASE STATISTICS**

### **Collection Sizes (Estimated)**

```javascript
// After 1000 users, 5000 tasks
users:     ~100 KB  (100 bytes per user)
projects:  ~500 KB  (500 bytes per project)
tasks:     ~5 MB    (1 KB per task)
comments:  ~2 MB    (200 bytes per comment)

Total:     ~8 MB (for moderate use)
```

### **Index Overhead**

```javascript
// Index storage overhead
users:     ~10 KB  (email index)
projects:  ~20 KB  (owner + members indexes)
tasks:     ~100 KB (3 indexes)
comments:  ~50 KB  (1 compound index)

Total:     ~180 KB (< 3% overhead)
```

---

## 🎯 **SCHEMA LOCATIONS**

The actual schema files are located at:

```
src/models/User.js       - User schema
src/models/Project.js    - Project schema
src/models/Task.js       - Task schema
src/models/Comment.js    - Comment schema
```

---

## 🚀 **TESTING QUERIES**

### **MongoDB Compass Queries**

```javascript
// 1. Find all projects for a user
db.projects.find({ 
  $or: [
    { owner: ObjectId("USER_ID") },
    { members: ObjectId("USER_ID") }
  ]
})

// 2. Get project analytics
db.tasks.aggregate([
  { $match: { project: ObjectId("PROJECT_ID") } },
  { $group: {
      _id: "$status",
      count: { $sum: 1 }
  }}
])

// 3. Find overdue tasks
db.tasks.find({
  dueDate: { $lt: new Date() },
  status: { $ne: "Done" }
})

// 4. Get user's task count
db.tasks.countDocuments({ assignedTo: ObjectId("USER_ID") })
```

---

## 📚 **SUMMARY**

### **Design Highlights**

✅ **Normalized Structure** - Clear separation of concerns  
✅ **Efficient References** - ObjectId relationships  
✅ **Strategic Indexing** - Optimized for common queries  
✅ **Data Validation** - Schema-level constraints  
✅ **Timestamp Tracking** - Automatic audit trail  
✅ **Scalable Design** - Ready for growth  

### **Performance Features**

✅ **Compound Indexes** - Multi-field query optimization  
✅ **Selective Population** - Only fetch needed data  
✅ **Virtual Fields** - Computed relationships  
✅ **Password Hashing** - Security best practices  

---

**🎊 Your MongoDB database is professionally architected and production-ready!**

---

_Database Architecture by Senior Database Architect_  
_MongoDB 🍃 + Mongoose + Strategic Indexing_
