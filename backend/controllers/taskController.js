const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const { asyncHandler } = require('../utils/helpers');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.projectId);

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

    const tasks = await Task.find({ project: req.params.projectId })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
    });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .populate('project', 'name');

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Task not found',
        });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project._id);
    const isOwnerOrMember =
        project.owner.toString() === req.user.id ||
        project.members.some((member) => member.toString() === req.user.id);

    if (!isOwnerOrMember) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access this task',
        });
    }

    res.status(200).json({
        success: true,
        data: task,
    });
});

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.projectId);

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
            message: 'Not authorized to create tasks in this project',
        });
    }

    const { title, description, status, priority, dueDate, assignedTo } =
        req.body;

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo: assignedTo || null,
        project: req.params.projectId,
        createdBy: req.user.id,
    });

    const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    res.status(201).json({
        success: true,
        data: populatedTask,
    });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    let task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Task not found',
        });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    const isOwnerOrMember =
        project.owner.toString() === req.user.id ||
        project.members.some((member) => member.toString() === req.user.id);

    if (!isOwnerOrMember) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this task',
        });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    res.status(200).json({
        success: true,
        data: task,
    });
});

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status || !['Todo', 'In Progress', 'Done'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid status (Todo, In Progress, Done)',
        });
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Task not found',
        });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    const isOwnerOrMember =
        project.owner.toString() === req.user.id ||
        project.members.some((member) => member.toString() === req.user.id);

    if (!isOwnerOrMember) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this task',
        });
    }

    task = await Task.findByIdAndUpdate(
        req.params.id,
        { status },
        {
            new: true,
            runValidators: true,
        }
    )
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    res.status(200).json({
        success: true,
        data: task,
    });
});

// @desc    Assign task to user
// @route   PATCH /api/tasks/:id/assign
// @access  Private
const assignTask = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Task not found',
        });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    const isOwnerOrMember =
        project.owner.toString() === req.user.id ||
        project.members.some((member) => member.toString() === req.user.id);

    if (!isOwnerOrMember) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to assign this task',
        });
    }

    // Check if userId is a member of the project
    if (userId) {
        const isProjectMember =
            project.owner.toString() === userId ||
            project.members.some((member) => member.toString() === userId);

        if (!isProjectMember) {
            return res.status(400).json({
                success: false,
                message: 'User is not a member of this project',
            });
        }
    }

    task = await Task.findByIdAndUpdate(
        req.params.id,
        { assignedTo: userId || null },
        {
            new: true,
            runValidators: true,
        }
    )
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    res.status(200).json({
        success: true,
        data: task,
    });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Task not found',
        });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    const isOwnerOrMember =
        project.owner.toString() === req.user.id ||
        project.members.some((member) => member.toString() === req.user.id);

    if (!isOwnerOrMember) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this task',
        });
    }

    // Delete all comments associated with the task
    await Comment.deleteMany({ task: req.params.id });

    await task.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    updateTaskStatus,
    assignTask,
    deleteTask,
};
