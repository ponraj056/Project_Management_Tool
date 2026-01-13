const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            required: [true, 'Please provide a comment message'],
            trim: true,
            maxlength: [500, 'Comment cannot be more than 500 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
commentSchema.index({ task: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
