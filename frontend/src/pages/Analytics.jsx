import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { FiArrowLeft, FiTrendingUp, FiCheckCircle, FiClock } from 'react-icons/fi';
import GanttChart from '../components/GanttChart';

const Analytics = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [id]);

    const fetchAnalytics = async () => {
        try {
            const [projectRes, analyticsRes, tasksRes] = await Promise.all([
                projectsAPI.getById(id),
                projectsAPI.getAnalytics(id),
                tasksAPI.getByProject(id),
            ]);

            setProject(projectRes.data.data);
            setAnalytics(analyticsRes.data.data);
            setTasks(tasksRes.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!analytics) return null;

    // Prepare data for charts
    const statusData = analytics.tasksByStatus.map((item) => ({
        name: item._id,
        value: item.count,
    }));

    const priorityData = analytics.tasksByPriority.map((item) => ({
        name: item._id,
        count: item.count,
    }));

    const STATUS_COLORS = {
        Todo: '#9CA3AF',
        'In Progress': '#3B82F6',
        Done: '#10B981',
    };

    const PRIORITY_COLORS = {
        Low: '#6B7280',
        Medium: '#F59E0B',
        High: '#F97316',
        Critical: '#EF4444',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate(`/projects/${id}`)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <FiArrowLeft />
                    Back to Project
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Project Analytics</h1>
                <p className="text-gray-600 mt-1">{project?.name}</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                            <p className="text-3xl font-bold text-gray-900">{analytics.totalTasks}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <FiTrendingUp className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Completed</p>
                            <p className="text-3xl font-bold text-green-600">{analytics.completedTasks}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <FiCheckCircle className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Pending</p>
                            <p className="text-3xl font-bold text-orange-600">{analytics.pendingTasks}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <FiClock className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                            <p className="text-3xl font-bold text-primary-600">{analytics.completionRate}</p>
                        </div>
                        <div className="p-3 bg-primary-100 rounded-full">
                            <FiTrendingUp className="text-primary-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tasks by Status */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Tasks by Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Tasks by Priority */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Tasks by Priority</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={priorityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]}>
                                {priorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gantt Chart */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Timeline (Gantt Chart)</h2>
                <GanttChart tasks={tasks} />
            </div>
        </div>
    );
};

export default Analytics;
