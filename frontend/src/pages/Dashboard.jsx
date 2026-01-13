import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import {
    FiFolder,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiPlus,
} from 'react-icons/fi';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
    });
    const [loading, setLoading] = useState(true);
    const [recentTasks, setRecentTasks] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const projectsRes = await projectsAPI.getAll();
            const projectsData = projectsRes.data.data;
            setProjects(projectsData);

            // Fetch all tasks from all projects
            let allTasks = [];
            for (const project of projectsData) {
                try {
                    const tasksRes = await tasksAPI.getByProject(project._id);
                    allTasks = [...allTasks, ...tasksRes.data.data];
                } catch (error) {
                    console.error(`Error fetching tasks for project ${project._id}:`, error);
                }
            }

            // Calculate stats
            const completedCount = allTasks.filter((t) => t.status === 'Done').length;
            const pendingCount = allTasks.filter(
                (t) => t.status === 'Todo' || t.status === 'In Progress'
            ).length;

            setStats({
                totalProjects: projectsData.length,
                totalTasks: allTasks.length,
                completedTasks: completedCount,
                pendingTasks: pendingCount,
            });

            // Get 5 most recent tasks
            const sortedTasks = allTasks
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);
            setRecentTasks(sortedTasks);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="card">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    const getStatusBadge = (status) => {
        const badges = {
            Todo: 'badge badge-todo',
            'In Progress': 'badge badge-in-progress',
            Done: 'badge badge-done',
        };
        return badges[status] || 'badge';
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's your project overview.</p>
                </div>
                <Link to="/projects" className="btn-primary flex items-center gap-2">
                    <FiPlus />
                    New Project
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={FiFolder}
                    label="Total Projects"
                    value={stats.totalProjects}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={FiCheckCircle}
                    label="Completed Tasks"
                    value={stats.completedTasks}
                    color="bg-green-500"
                />
                <StatCard
                    icon={FiClock}
                    label="Pending Tasks"
                    value={stats.pendingTasks}
                    color="bg-orange-500"
                />
                <StatCard
                    icon={FiAlertCircle}
                    label="Total Tasks"
                    value={stats.totalTasks}
                    color="bg-purple-500"
                />
            </div>

            {/* Recent Projects and Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Projects</h2>
                    {projects.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FiFolder className="mx-auto mb-2" size={40} />
                            <p>No projects yet. Create your first project!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {projects.slice(0, 5).map((project) => (
                                <Link
                                    key={project._id}
                                    to={`/projects/${project._id}`}
                                    className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                                >
                                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {project.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <span>{project.members?.length || 0} members</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Tasks */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tasks</h2>
                    {recentTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FiCheckCircle className="mx-auto mb-2" size={40} />
                            <p>No tasks yet. Start by creating a task!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                                {task.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={getStatusBadge(task.status)}>{task.status}</span>
                                        <span className={getPriorityBadge(task.priority)}>{task.priority}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
