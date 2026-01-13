import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import {
    FiArrowLeft,
    FiPlus,
    FiBarChart2,
    FiTrash2,
    FiEdit,
} from 'react-icons/fi';

const ProjectView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            const [projectRes, tasksRes] = await Promise.all([
                projectsAPI.getById(id),
                tasksAPI.getByProject(id),
            ]);

            setProject(projectRes.data.data);
            setTasks(tasksRes.data.data);
        } catch (error) {
            console.error('Error fetching project:', error);
            navigate('/projects');
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeTask = tasks.find((t) => t._id === active.id);
        const overColumn = over.id;

        // Check if dropped on a different column
        const statusMap = {
            'column-todo': 'Todo',
            'column-in-progress': 'In Progress',
            'column-done': 'Done',
        };

        const newStatus = statusMap[overColumn];

        if (newStatus && activeTask.status !== newStatus) {
            try {
                await tasksAPI.updateStatus(activeTask._id, newStatus);
                setTasks(
                    tasks.map((t) => (t._id === activeTask._id ? { ...t, status: newStatus } : t))
                );
            } catch (error) {
                console.error('Error updating task status:', error);
            }
        }

        setActiveId(null);
    };

    const handleDeleteProject = async () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectsAPI.delete(id);
                navigate('/projects');
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!project) return null;

    const activeTask = tasks.find((t) => t._id === activeId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <button
                        onClick={() => navigate('/projects')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <FiArrowLeft />
                        Back to Projects
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                    <p className="text-gray-600 mt-2">{project.description}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <span>{project.members?.length + 1 || 1} members</span>
                        <span>•</span>
                        <span>{tasks.length} tasks</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(`/projects/${id}/analytics`)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <FiBarChart2 />
                        Analytics
                    </button>
                    <button onClick={() => setShowTaskModal(true)} className="btn-primary flex items-center gap-2">
                        <FiPlus />
                        New Task
                    </button>
                    <button
                        onClick={handleDeleteProject}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Project"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KanbanColumn
                        id="column-todo"
                        title="To Do"
                        tasks={getTasksByStatus('Todo')}
                        onRefresh={fetchProjectData}
                    />
                    <KanbanColumn
                        id="column-in-progress"
                        title="In Progress"
                        tasks={getTasksByStatus('In Progress')}
                        onRefresh={fetchProjectData}
                    />
                    <KanbanColumn
                        id="column-done"
                        title="Done"
                        tasks={getTasksByStatus('Done')}
                        onRefresh={fetchProjectData}
                    />
                </div>

                <DragOverlay>
                    {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
                </DragOverlay>
            </DndContext>

            {/* Task Modal */}
            {showTaskModal && (
                <TaskModal
                    projectId={id}
                    onClose={() => setShowTaskModal(false)}
                    onSuccess={fetchProjectData}
                />
            )}
        </div>
    );
};

export default ProjectView;
