import { useState, useEffect } from 'react';
import { tasksAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiX, FiClock, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi';
import { format } from 'date-fns';

const TaskDetailModal = ({ task, onClose, onRefresh }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [task._id]);

    const fetchComments = async () => {
        try {
            const response = await commentsAPI.getByTask(task._id);
            setComments(response.data.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await commentsAPI.create(task._id, newComment);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await tasksAPI.updateStatus(task._id, newStatus);
            onRefresh();
            onClose();
        } catch (error) {
            console.error('Error updating status:', error);
        }
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

    const getStatusBadge = (status) => {
        const badges = {
            Todo: 'badge badge-todo',
            'In Progress': 'badge badge-in-progress',
            Done: 'badge badge-done',
        };
        return badges[status] || 'badge';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
                            <div className="flex items-center gap-2">
                                <span className={getStatusBadge(task.status)}>{task.status}</span>
                                <span className={getPriorityBadge(task.priority)}>{task.priority}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <FiX size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700">{task.description}</p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Due Date</h3>
                            <div className="flex items-center gap-2 text-gray-700">
                                <FiClock />
                                <span>{format(new Date(task.dueDate), 'MMMM d, yyyy')}</span>
                            </div>
                        </div>

                        {task.assignedTo && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Assigned To</h3>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FiUser />
                                    <span>{task.assignedTo.name || 'Assigned'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Actions */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Change Status</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleStatusChange('Todo')}
                                disabled={task.status === 'Todo'}
                                className="btn-secondary text-sm disabled:opacity-50"
                            >
                                To Do
                            </button>
                            <button
                                onClick={() => handleStatusChange('In Progress')}
                                disabled={task.status === 'In Progress'}
                                className="btn-secondary text-sm disabled:opacity-50"
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => handleStatusChange('Done')}
                                disabled={task.status === 'Done'}
                                className="btn-secondary text-sm disabled:opacity-50"
                            >
                                Done
                            </button>
                        </div>
                    </div>

                    {/* Comments */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FiMessageSquare />
                            Comments ({comments.length})
                        </h3>

                        {/* Comment Form */}
                        <form onSubmit={handleAddComment} className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="input-field flex-1"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !newComment.trim()}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    <FiSend />
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-3">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No comments yet</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment._id} className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm text-gray-900">
                                                {comment.user?.name || 'Unknown User'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
