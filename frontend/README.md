# ProjectFlow - Frontend

Modern React frontend for the Project Management Tool with drag-and-drop Kanban boards, analytics, and Gantt charts.

## 🚀 Features

### Authentication
- ✅ User login and registration
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Persistent sessions

### Project Management
- ✅ Create and manage projects
- ✅ Project overview dashboard
- ✅ Project deletion
- ✅ Member management

### Task Management
- ✅ Create, update, and delete tasks
- ✅ Drag-and-drop Kanban board
- ✅ Task status updates (Todo, In Progress, Done)
- ✅ Priority levels (Low, Medium, High, Critical)
- ✅ Due date tracking
- ✅ Task assignment
- ✅ Task comments

### Analytics & Visualization
- ✅ Project statistics
- ✅ Completion rate tracking
- ✅ Pie charts for task status
- ✅ Bar charts for task priority
- ✅ **Gantt chart timeline visualization**

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Clean, modern interface
- ✅ Tailwind CSS styling
- ✅ Loading states
- ✅ Error handling
- ✅ Smooth animations

## 📦 Tech Stack

- **React 18** - UI framework
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **@dnd-kit** - Drag and drop
- **Recharts** - Charts and graphs
- **date-fns** - Date utilities
- **React Icons** - Icon library
- **Vite** - Build tool

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── GanttChart.jsx        # Timeline visualization
│   │   ├── KanbanColumn.jsx      # Kanban board column
│   │   ├── Layout.jsx            # Main layout with sidebar
│   │   ├── ProtectedRoute.jsx    # Route guard
│   │   ├── TaskCard.jsx          # Draggable task card
│   │   ├── TaskDetailModal.jsx   # Task details & comments
│   │   └── TaskModal.jsx         # Create task modal
│   │
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication context
│   │
│   ├── pages/
│   │   ├── Analytics.jsx         # Analytics dashboard
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── Login.jsx             # Login page
│   │   ├── Projects.jsx          # Projects list
│   │   ├── ProjectView.jsx       # Project Kanban board
│   │   └── Register.jsx          # Registration page
│   │
│   ├── services/
│   │   └── api.js                # API service layer
│   │
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
│
├── index.html
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+ installed
- Backend server running on http://localhost:5000

### Steps

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:5173
```

## 🎯 Usage Guide

### First Time Setup
1. Register a new account (choose Admin or Member role)
2. Create your first project
3. Add tasks to the project
4. Start managing with the Kanban board!

### Creating a Project
1. Click "New Project" button
2. Enter project name and description
3. Submit to create

### Managing Tasks
1. Click "New Task" in project view
2. Fill in task details (title, description, priority, due date)
3. Drag tasks between columns to update status
4. Click task cards to view details and add comments

### Viewing Analytics
1. Open any project
2. Click "Analytics" button
3. View charts and Gantt timeline

## 🎨 Key Components

### Gantt Chart
Timeline visualization showing:
- Task deadlines on calendar
- Status (color-coded)
- Priority (height-coded)
- Today marker
- Overdue indicators

### Kanban Board
- Drag-and-drop interface
- Three status columns
- Visual feedback
- Auto-save on drop

### Task Detail Modal
- Full task information
- Comments section  
- Status change buttons
- Real-time updates

## 📱 Responsive Design

- **Mobile**: Hamburger menu, stacked cards
- **Tablet**: 2-column grids
- **Desktop**: Full sidebar, 3-column layouts

## 🔐 Authentication

- JWT tokens stored in localStorage
- Automatic token refresh
- Auto-logout on 401 errors
- Protected route guards

## 🎨 Customization

### Change Primary Color
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#your-color',
  },
}
```

### Update API URL
Edit `src/services/api.js`:
```javascript
const API_URL = 'your-api-url';
```

## 🚀 Performance

- Code splitting with React.lazy
- Optimistic UI updates
- Efficient re-renders
- Memoized calculations

## 📊 Analytics Features

- **Statistics**: Total, completed, pending tasks
- **Pie Chart**: Status distribution
- **Bar Chart**: Priority distribution
- **Gantt Chart**: Project timeline

## 🧪  Testing

1. Register test users
2. Create sample projects
3. Add tasks with various priorities
4. Test drag-and-drop
5. Add comments
6. Check analytics

## 🎯 Best Practices

- Modular component design
- Reusable utility functions
- Consistent naming conventions
- Error boundaries
- Loading states
- User feedback

## 📝 Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

---

**Built with React, Tailwind CSS, and Modern Web Technologies** 🚀
