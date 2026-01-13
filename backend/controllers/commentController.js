const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { asyncHandler } = require('../utils/helpers');

// @desc    Get all comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
const getComments = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.taskId);

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
            message: 'Not authorized to access this task',
        });
    }

    const comments = await Comment.find({ task: req.params.taskId })
        .populate('user', 'name email')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: comments.length,
        data: comments,
    });
});

// @desc    Create new comment
// @route   POST /api/tasks/:taskId/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.taskId);

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
            message: 'Not authorized to comment on this task',
        });
    }

    const { message } = req.body;

    const comment = await Comment.create({
        task: req.params.taskId,
        user: req.user.id,
        message,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
        'user',
        'name email'
    );

    res.status(201).json({
        success: true,
        data: populatedComment,
    });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found',
        });
    }

    // Check if user is the comment owner
    if (comment.user.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this comment',
        });
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).populate('user', 'name email');

    res.status(200).json({
        success: true,
        data: comment,
    });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found',
        });
    }

    // Check if user is the comment owner
    if (comment.user.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this comment',
        });
    }

    await comment.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

module.exports = {
    getComments,
    createComment,
    updateComment,
    deleteComment,
};
