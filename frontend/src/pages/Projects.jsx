import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { FiPlus, FiFolder, FiUsers, FiCalendar, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.data.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await projectsAPI.create(formData);
            setShowModal(false);
            setFormData({ name: '', description: '' });
            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
        } finally {
            setSubmitting(false);
        }
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
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-600 mt-1">Manage all your projects in one place</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <FiPlus />
                    New Project
                </button>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="card text-center py-12">
                    <FiFolder className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first project</p>
                    <button onClick={() => setShowModal(true)} className="btn-primary">
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link
                            key={project._id}
                            to={`/projects/${project._id}`}
                            className="card hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                                    <FiFolder className="text-primary-600" size={24} />
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                {project.name}
                            </h3>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {project.description}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <FiUsers size={16} />
                                    <span>{project.members?.length + 1 || 1} members</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FiCalendar size={16} />
                                    <span>{format(new Date(project.createdAt), 'MMM d')}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="input-field"
                                    placeholder="E-Commerce Website"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    required
                                    rows={4}
                                    className="input-field resize-none"
                                    placeholder="Describe your project..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 btn-primary disabled:opacity-50"
                                >
                                    {submitting ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
