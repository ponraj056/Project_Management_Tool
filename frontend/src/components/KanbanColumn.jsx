import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const KanbanColumn = ({ id, title, tasks, onRefresh }) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    const getColumnColor = () => {
        if (title === 'To Do') return 'bg-gray-100';
        if (title === 'In Progress') return 'bg-blue-100';
        if (title === 'Done') return 'bg-green-100';
        return 'bg-gray-100';
    };

    const getCountColor = () => {
        if (title === 'To Do') return 'bg-gray-600';
        if (title === 'In Progress') return 'bg-blue-600';
        if (title === 'Done') return 'bg-green-600';
        return 'bg-gray-600';
    };

    return (
        <div
            ref={setNodeRef}
            className={`rounded-lg p-4 min-h-[500px] transition-colors ${isOver ? 'bg-primary-50 ring-2 ring-primary-300' : 'bg-gray-50'
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <span className={`${getCountColor()} text-white text-xs px-2 py-1 rounded-full`}>
                    {tasks.length}
                </span>
            </div>

            <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <TaskCard key={task._id} task={task} onRefresh={onRefresh} />
                    ))}
                </div>
            </SortableContext>

            {tasks.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                    <p className="text-sm">No tasks yet</p>
                </div>
            )}
        </div>
    );
};

export default KanbanColumn;
