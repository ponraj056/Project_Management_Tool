import { useMemo } from 'react';
import { format, differenceInDays, startOfDay, addDays } from 'date-fns';

const GanttChart = ({ tasks }) => {
    const ganttData = useMemo(() => {
        if (tasks.length === 0) return null;

        // Find min and max dates
        const dates = tasks.map((task) => new Date(task.dueDate));
        const today = startOfDay(new Date());
        const minDate = new Date(Math.min(...dates.map((d) => d.getTime()), today.getTime()));
        const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

        const totalDays = differenceInDays(maxDate, minDate) + 1;
        const dayColumns = Math.min(totalDays, 30); // Limit to 30 days for display

        return {
            minDate,
            maxDate,
            totalDays,
            dayColumns,
            today,
        };
    }, [tasks]);

    if (!ganttData || tasks.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No tasks available for timeline visualization</p>
            </div>
        );
    }

    const { minDate, maxDate, dayColumns, today } = ganttData;

    const getTaskPosition = (task) => {
        const dueDate = new Date(task.dueDate);
        const taskDays = differenceInDays(dueDate, minDate);
        const totalSpan = differenceInDays(maxDate, minDate);
        const position = (taskDays / totalSpan) * 100;

        return Math.min(Math.max(position, 0), 100);
    };

    const getDayHeaders = () => {
        const headers = [];
        const step = Math.ceil(differenceInDays(maxDate, minDate) / dayColumns);

        for (let i = 0; i <= dayColumns; i++) {
            const date = addDays(minDate, i * step);
            if (date <= maxDate) {
                headers.push(date);
            }
        }

        return headers;
    };

    const getStatusColor = (status) => {
        const colors = {
            Todo: 'bg-gray-400',
            'In Progress': 'bg-blue-500',
            Done: 'bg-green-500',
        };
        return colors[status] || 'bg-gray-400';
    };

    const getPriorityHeight = (priority) => {
        const heights = {
            Low: 'h-2',
            Medium: 'h-3',
            High: 'h-4',
            Critical: 'h-5',
        };
        return heights[priority] || 'h-3';
    };

    const dayHeaders = getDayHeaders();

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[800px]">
                {/* Timeline Header */}
                <div className="flex border-b border-gray-300 mb-4 pb-2">
                    <div className="w-48 flex-shrink-0 font-semibold text-sm text-gray-700">Task</div>
                    <div className="flex-1 flex">
                        {dayHeaders.map((date, index) => (
                            <div
                                key={index}
                                className="flex-1 text-center text-xs text-gray-600 px-1"
                                style={{ minWidth: '60px' }}
                            >
                                <div className="font-medium">{format(date, 'MMM d')}</div>
                                <div className="text-gray-400">{format(date, 'EEE')}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tasks Timeline */}
                <div className="space-y-3">
                    {tasks
                        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                        .map((task) => {
                            const position = getTaskPosition(task);
                            const isPast = new Date(task.dueDate) < today;

                            return (
                                <div key={task._id} className="flex items-center group">
                                    {/* Task Name */}
                                    <div className="w-48 flex-shrink-0 pr-4">
                                        <div className="text-sm font-medium text-gray-900 truncate" title={task.title}>
                                            {task.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                        </div>
                                    </div>

                                    {/* Timeline Bar */}
                                    <div className="flex-1 relative h-8 bg-gray-100 rounded">
                                        {/* Today Marker */}
                                        {differenceInDays(today, minDate) >= 0 &&
                                            differenceInDays(today, minDate) <= differenceInDays(maxDate, minDate) && (
                                                <div
                                                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                                                    style={{
                                                        left: `${(differenceInDays(today, minDate) /
                                                                differenceInDays(maxDate, minDate)) *
                                                            100
                                                            }%`,
                                                    }}
                                                >
                                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                                                </div>
                                            )}

                                        {/* Task Bar */}
                                        <div
                                            className={`absolute top-1/2 transform -translate-y-1/2 ${getStatusColor(
                                                task.status
                                            )} ${getPriorityHeight(
                                                task.priority
                                            )} rounded-full transition-all group-hover:opacity-80 ${isPast && task.status !== 'Done' ? 'opacity-50' : ''
                                                }`}
                                            style={{
                                                left: `${position}%`,
                                                width: '3%',
                                                minWidth: '8px',
                                            }}
                                            title={`${task.title} - ${task.status} (${task.priority})`}
                                        ></div>

                                        {/* Task Indicator Dot */}
                                        <div
                                            className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 ${getStatusColor(
                                                task.status
                                            )} rounded-full border-2 border-white shadow-sm`}
                                            style={{
                                                left: `${position}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-6 text-xs text-gray-600">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Status:</span>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-3 bg-gray-400 rounded"></div>
                                <span>To Do</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-3 bg-blue-500 rounded"></div>
                                <span>In Progress</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-3 bg-green-500 rounded"></div>
                                <span>Done</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Priority:</span>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-2 bg-gray-400 rounded"></div>
                                <span>Low</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-3 bg-gray-400 rounded"></div>
                                <span>Medium</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                <span>High</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-5 bg-gray-400 rounded"></div>
                                <span>Critical</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-0.5 h-6 bg-red-500"></div>
                            <span>Today</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
