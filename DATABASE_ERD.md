# 🗺️ Database Entity Relationship Diagram (ERD)

## **Visual Database Design - Project Management Tool**

---

## 📊 **COMPLETE ERD**

### **Main Entity Relationship Diagram**

```
                    ┌─────────────────────────────────────┐
                    │           USER COLLECTION           │
                    │  ┌─────────────────────────────┐   │
                    │  │ _id: ObjectId (PK)          │   │
                    │  │ name: String (50 chars)     │   │
                    │  │ email: String (unique)      │   │
                    │  │ password: String (hashed)   │   │
                    │  │ role: Enum [Admin, Member]  │   │
                    │  │ createdAt: Date            │   │
                    │  │ updatedAt: Date            │   │
                    │  └─────────────────────────────┘   │
                    └──────────┬──────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         owner  │       members│       createdBy│
          (1:M) │         (M:M)│          (1:M)│
                │              │              │
                ▼              ▼              ▼
    ┌───────────────────┐              ┌──────────────────────┐
    │PROJECT COLLECTION │              │   TASK COLLECTION    │
    │ ┌───────────────┐ │              │  ┌────────────────┐  │
    │ │ _id: PK       │ │◄─────────────┤  │ _id: PK        │  │
    │ │ name: String  │ │   project    │  │ title: String  │  │
    │ │ description:  │ │    (1:M)     │  │ description:   │  │
    │ │    String     │ │              │  │    String      │  │
    │ │ owner: FK     │ │              │  │ status: Enum   │  │
    │ │   → User._id  │ │              │  │ priority: Enum │  │
    │ │ members: []   │ │              │  │ dueDate: Date  │  │
    │ │   → User._id  │ │              │  │ assignedTo: FK │  │
    │ │ createdAt     │ │              │  │   → User._id   │  │
    │ │ updatedAt     │ │              │  │ project: FK    │──┘
    │ └───────────────┘ │              │  │   → Project._id│
    └───────────────────┘              │  │ createdBy: FK  │
                                       │  │   → User._id   │
                                       │  │ createdAt      │
                                       │  │ updatedAt      │
                                       │  └────────┬───────┘
                                       └───────────┼────────┘
                                                   │
                                            task   │ (1:M)
                                                   │
                                                   ▼
                                       ┌───────────────────────┐
                                       │  COMMENT COLLECTION   │
                                       │  ┌─────────────────┐  │
                                       │  │ _id: PK         │  │
                                       │  │ task: FK        │  │
                                       │  │   → Task._id    │  │
                                       │  │ user: FK        │  │
                                       │  │   → User._id    │  │
                                       │  │ message: String │  │
                                       │  │ createdAt       │  │
                                       │  │ updatedAt       │  │
                                       │  └─────────────────┘  │
                                       └───────────────────────┘
```

---

## 🔗 **RELATIONSHIP TYPES**

### **1. USER → PROJECT (Owner)**
```
Type: One-to-Many
Direction: User → Project
Cardinality: 1:M

┌──────────┐         ┌───────────┐
│   USER   │ 1     M │  PROJECT  │
│   _id    ├─────────┤   owner   │
└──────────┘  owns   └───────────┘

Implementation:
  Project.owner → User._id (ObjectId reference)

Meaning:
  - One user can own many projects
  - Each project has exactly one owner
```

### **2. USER ↔ PROJECT (Members)**
```
Type: Many-to-Many
Direction: Bidirectional
Cardinality: M:M

┌──────────┐         ┌───────────┐
│   USER   │ M     M │  PROJECT  │
│   _id    │◄───────►│  members[]│
└──────────┘ member  └───────────┘
             of

Implementation:
  Project.members[] → [User._id, User._id, ...] (Array of ObjectIds)

Meaning:
  - Users can be members of multiple projects
  - Projects can have multiple members
```

### **3. PROJECT → TASK**
```
Type: One-to-Many
Direction: Project → Task
Cardinality: 1:M

┌───────────┐         ┌──────────┐
│  PROJECT  │ 1     M │   TASK   │
│   _id     ├─────────┤  project │
└───────────┘ contains└──────────┘

Implementation:
  Task.project → Project._id (ObjectId reference)

Meaning:
  - One project contains many tasks
  - Each task belongs to one project
```

### **4. USER → TASK (Creator)**
```
Type: One-to-Many
Direction: User → Task
Cardinality: 1:M

┌──────────┐         ┌──────────┐
│   USER   │ 1     M │   TASK   │
│   _id    ├─────────┤ createdBy│
└──────────┘ creates └──────────┘

Implementation:
  Task.createdBy → User._id (ObjectId reference)

Meaning:
  - One user can create many tasks
  - Each task has one creator
```

### **5. USER → TASK (Assignment)**
```
Type: One-to-Many (Optional)
Direction: User → Task
Cardinality: 1:M (nullable)

┌──────────┐         ┌──────────┐
│   USER   │ 1     M │   TASK   │
│   _id    ├─────────┤assignedTo│
└──────────┘assigned └──────────┘
           to

Implementation:
  Task.assignedTo → User._id (ObjectId reference, nullable)

Meaning:
  - Tasks can be assigned to users (optional)
  - Users can have multiple assigned tasks
```

### **6. TASK → COMMENT**
```
Type: One-to-Many
Direction: Task → Comment
Cardinality: 1:M

┌──────────┐         ┌──────────┐
│   TASK   │ 1     M │ COMMENT  │
│   _id    ├─────────┤   task   │
└──────────┘  has    └──────────┘

Implementation:
  Comment.task → Task._id (ObjectId reference)

Meaning:
  - One task can have many comments
  - Each comment belongs to one task
```

### **7. USER → COMMENT**
```
Type: One-to-Many
Direction: User → Comment
Cardinality: 1:M

┌──────────┐         ┌──────────┐
│   USER   │ 1     M │ COMMENT  │
│   _id    ├─────────┤   user   │
└──────────┘ writes  └──────────┘

Implementation:
  Comment.user → User._id (ObjectId reference)

Meaning:
  - One user can write many comments
  - Each comment has one author
```

---

## 📋 **CARDINALITY SUMMARY**

| Relationship | Type | From | To | Cardinality |
|-------------|------|------|-----|------------|
| User owns Projects | 1:M | User | Project | One user → Many projects |
| User member of Projects | M:M | User | Project | Many users ↔ Many projects |
| Project contains Tasks | 1:M | Project | Task | One project → Many tasks |
| User creates Tasks | 1:M | User | Task | One user → Many tasks |
| User assigned Tasks | 1:M | User | Task | One user → Many tasks (optional) |
| Task has Comments | 1:M | Task | Comment | One task → Many comments |
| User writes Comments | 1:M | User | Comment | One user → Many comments |

---

## 🎯 **DATA FLOW DIAGRAMS**

### **1. Create Project Flow**
```
┌──────────┐
│   USER   │
│  (John)  │
└────┬─────┘
     │ creates
     ▼
┌──────────────┐
│   PROJECT    │
│ E-Commerce   │
│ owner: John  │
│ members: []  │
└──────────────┘
```

### **2. Create Task Flow**
```
┌──────────┐        ┌──────────────┐
│   USER   │        │   PROJECT    │
│  (John)  │        │ E-Commerce   │
└────┬─────┘        └──────┬───────┘
     │                     │
     │ creates task in     │
     └─────────────────────┤
                           ▼
                    ┌──────────────┐
                    │     TASK     │
                    │ Design Page  │
                    │ project: ref │
                    │ createdBy: J │
                    │ assignedTo:- │
                    └──────────────┘
```

### **3. Assign Task Flow**
```
┌──────────┐        ┌──────────────┐        ┌──────────┐
│  USER 1  │        │     TASK     │        │  USER 2  │
│  (John)  │        │ Design Page  │        │  (Jane)  │
└────┬─────┘        └──────┬───────┘        └────▲─────┘
     │                     │                     │
     │ assigns to          │                     │
     └─────────────────────┼─────────────────────┘
                          │
                  assignedTo: Jane
```

### **4. Add Comment Flow**
```
┌──────────┐        ┌──────────────┐        ┌──────────┐
│   USER   │        │     TASK     │        │ COMMENT  │
│  (John)  │        │ Design Page  │        │ "Started"│
└────┬─────┘        └──────▲───────┘        └────▲─────┘
     │                     │                     │
     │ comments on         │                     │
     └─────────────────────┼─────────────────────┘
                          │
                   task: Design Page
                   user: John
```

---

## 🔍 **REFERENTIAL INTEGRITY**

### **Cascade Delete Rules**

```
DELETE User:
  - Projects owned → DELETE CASCADE
  - Tasks created → Update createdBy to null
  - Tasks assigned → Update assignedTo to null
  - Comments → DELETE CASCADE

DELETE Project:
  - Tasks in project → DELETE CASCADE
  - Comments on tasks → DELETE CASCADE

DELETE Task:
  - Comments on task → DELETE CASCADE

DELETE Comment:
  - No dependencies
```

### **Implementation**

```javascript
// Example: Delete project with cascade
async function deleteProject(projectId) {
  // 1. Delete all tasks in project
  await Task.deleteMany({ project: projectId });
  
  // 2. Delete all comments for those tasks
  const tasks = await Task.find({ project: projectId });
  const taskIds = tasks.map(t => t._id);
  await Comment.deleteMany({ task: { $in: taskIds } });
  
  // 3. Delete the project
  await Project.findByIdAndDelete(projectId);
}
```

---

## 📊 **INDEX VISUALIZATION**

### **Users Collection Indexes**
```
Email Index (Unique):
[email] → [_id]

"john@example.com" → ObjectId("...")
"jane@example.com" → ObjectId("...")
```

### **Tasks Collection Indexes**
```
Compound Index (project + status):
[project, status] → [_id]

[Project A, "Todo"]        → [Task1, Task2]
[Project A, "In Progress"] → [Task3]
[Project A, "Done"]        → [Task4, Task5]
[Project B, "Todo"]        → [Task6]
```

### **Comments Collection Indexes**
```
Compound Index (task + createdAt):
[task, createdAt DESC] → [_id]

[Task1, 2024-01-14] → Comment3
[Task1, 2024-01-13] → Comment2
[Task1, 2024-01-12] → Comment1
```

---

## 🎯 **QUERY PATTERNS**

### **1. Get User's Projects**
```
Input:  userId
Path:   User → Projects
Query:  Find where (owner = userId) OR (userId in members)
Output: [Project1, Project2, ...]
```

### **2. Get Project Tasks**
```
Input:  projectId
Path:   Project → Tasks
Query:  Find where (project = projectId)
Output: [Task1, Task2, ...]
```

### **3. Get Task Comments**
```
Input:  taskId
Path:   Task → Comments
Query:  Find where (task = taskId) ORDER BY createdAt DESC
Output: [Comment1, Comment2, ...]
```

### **4. Get User's Assigned Tasks**
```
Input:  userId  
Path:   User → Tasks
Query:  Find where (assignedTo = userId)
Output: [Task1, Task2, ...]
```

---

## ✅ **CONSTRAINTS & VALIDATION**

### **Uniqueness Constraints**
```
users.email        - UNIQUE
All _id fields     - UNIQUE (automatic)
```

### **Required Fields**
```
User:
  ✅ name, email, password, role

Project:
  ✅ name, description, owner

Task:
  ✅ title, description, status, priority, dueDate, project, createdBy

Comment:
  ✅ task, user, message
```

### **Enum Validations**
```
User.role:
  - Admin
  - Member

Task.status:
  - Todo
  - In Progress
  - Done

Task.priority:
  - Low
  - Medium
  - High
  - Critical
```

---

## 📐 **SCHEMA SIZE ESTIMATION**

### **Average Document Sizes**

```
User:        ~100 bytes
  - _id: 12 bytes
  - name: ~20 bytes
  - email: ~25 bytes
  - password: ~60 bytes (hashed)
  - role: ~6 bytes
  - timestamps: ~16 bytes

Project:     ~500 bytes
  - _id: 12 bytes
  - name: ~50 bytes
  - description: ~200 bytes
  - owner: 12 bytes
  - members: ~100 bytes (5 members avg)
  - timestamps: ~16 bytes

Task:        ~1 KB
  - _id: 12 bytes
  - title: ~50 bytes
  - description: ~500 bytes
  - status: ~12 bytes
  - priority: ~8 bytes
  - dueDate: 8 bytes
  - assignedTo: 12 bytes
  - project: 12 bytes
  - createdBy: 12 bytes
  - timestamps: ~16 bytes

Comment:     ~200 bytes
  - _id: 12 bytes
  - task: 12 bytes
  - user: 12 bytes
  - message: ~100 bytes
  - timestamps: ~16 bytes
```

---

## 🎓 **SUMMARY**

### **Database Design Highlights**

✅ **Normalized Structure** - Each entity in separate collection  
✅ **Referenced Relationships** - ObjectId references for relations  
✅ **Compound Indexes** - Optimized for common query patterns  
✅ **Data Validation** - Schema-level constraints  
✅ **Cascade Deletion** - Referential integrity  
✅ **Timestamp Tracking** - Audit trail  

### **Relationship Count**
```
Total Relationships: 7
  - One-to-Many: 5
  - Many-to-Many: 1
  - Optional: 1
```

---

**🎊 Your database design is professionally architected!**

_See DATABASE_ARCHITECTURE.md for complete implementation details._
