const Project = require('../models/Project');
const Task = require('../models/Task');
const { asyncHandler } = require('../utils/helpers');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
    // Get projects where user is owner or member
    const projects = await Project.find({
        $or: [{ owner: req.user.id }, { members: req.user.id }],
    })
        .populate('owner', 'name email')
        .populate('members', 'name email')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
    });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('owner', 'name email')
        .populate('members', 'name email');

    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }

    // Check if user is owner or member
    const isOwnerOrMember =
        project.owner._id.toString() === req.user.id ||
        project.members.some((member) => member._id.toString() === req.user.id);

    if (!isOwnerOrMember) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access this project',
        });
    }

    res.status(200).json({
        success: true,
        data: project,
    });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    const { name, description, members } = req.body;

    const project = await Project.create({
        name,
        description,
        owner: req.user.id,
        members: members || [],
    });

    const populatedProject = await Project.findById(project._id)
        .populate('owner', 'name email')
        .populate('members', 'name email');

    res.status(201).json({
        success: true,
        data: populatedProject,
    });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
    let project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this project',
        });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .populate('owner', 'name email')
        .populate('members', 'name email');

    res.status(200).json({
        success: true,
        data: project,
    });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this project',
        });
    }

    // Delete all tasks associated with the project
    await Task.deleteMany({ project: req.params.id });

    await project.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

// @desc    Get project analytics
// @route   GET /api/projects/:id/analytics
// @access  Private
const getProjectAnalytics = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }

    // Check if user is owner or member
    const isOwnerOrMember =
        project.owner.toString() === req.user.id ||
        project.members.some((member) => member.toString() === req.user.id);

    if (!isOwnerOrMember) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access this project',
        });
    }

    // Get task statistics
    const totalTasks = await Task.countDocuments({ project: req.params.id });
    const completedTasks = await Task.countDocuments({
        project: req.params.id,
        status: 'Done',
    });
    const pendingTasks = await Task.countDocuments({
        project: req.params.id,
        status: { $in: ['Todo', 'In Progress'] },
    });

    // Get tasks by status
    const tasksByStatus = await Task.aggregate([
        { $match: { project: project._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Get tasks by priority
    const tasksByPriority = await Task.aggregate([
        { $match: { project: project._id } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
        success: true,
        data: {
            totalTasks,
            completedTasks,
            pendingTasks,
            completionRate:
                totalTasks > 0
                    ? ((completedTasks / totalTasks) * 100).toFixed(2) + '%'
                    : '0%',
            tasksByStatus,
            tasksByPriority,
        },
    });
});

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectAnalytics,
};
