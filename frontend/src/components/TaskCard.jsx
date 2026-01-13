import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiClock, FiUser, FiMessageSquare, FiEdit, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import { tasksAPI } from '../services/api';
import TaskDetailModal from './TaskDetailModal';

const TaskCard = ({ task, isDragging, onRefresh }) => {
    const [showDetail, setShowDetail] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: task._id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getPriorityColor = (priority) => {
        const colors = {
            Low: 'border-l-gray-400',
            Medium: 'border-l-yellow-400',
            High: 'border-l-orange-400',
            Critical: 'border-l-red-500',
        };
        return colors[priority] || 'border-l-gray-400';
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            Low: 'badge badge-low',
            Medium: 'badge badge-medium',
            High: 'badge badge-high',
            Critical: 'badge badge-critical',
        };
        return badges[priority] || 'badge';
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await tasksAPI.delete(task._id);
                if (onRefresh) onRefresh();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                onClick={() => setShowDetail(true)}
                className={`bg-white border-l-4 ${getPriorityColor(
                    task.priority
                )} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
            >
                <div className="flex items-start justify-between mb-2">
                    <h4
                        {...listeners}
                        className="font-medium text-gray-900 text-sm line-clamp-2 cursor-move"
                    >
                        {task.title}
                    </h4>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(e);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Delete task"
                    >
                        <FiTrash2 size={14} />
                    </button>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>

                <div className="flex items-center justify-between text-xs">
                    <span className={getPriorityBadge(task.priority)}>{task.priority}</span>

                    <div className="flex items-center gap-3 text-gray-500">
                        {task.assignedTo && (
                            <div className="flex items-center gap-1" title="Assigned to">
                                <FiUser size={12} />
                            </div>
                        )}
                        <div className="flex items-center gap-1" title="Due date">
                            <FiClock size={12} />
                            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {showDetail && (
                <TaskDetailModal task={task} onClose={() => setShowDetail(false)} onRefresh={onRefresh} />
            )}
        </>
    );
};

export default TaskCard;
