const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a task title'],
            trim: true,
            maxlength: [100, 'Task title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a task description'],
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
        },
        status: {
            type: String,
            enum: ['Todo', 'In Progress', 'Done'],
            default: 'Todo',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
        },
        dueDate: {
            type: Date,
            required: [true, 'Please provide a due date'],
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('Task', taskSchema);
