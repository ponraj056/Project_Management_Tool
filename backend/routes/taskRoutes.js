const express = require('express');
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    updateTaskStatus,
    assignTask,
    deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Task routes under project
router
    .route('/projects/:projectId/tasks')
    .get(protect, getTasks)
    .post(protect, createTask);

// Individual task routes
router
    .route('/:id')
    .get(protect, getTask)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

router.patch('/:id/status', protect, updateTaskStatus);
router.patch('/:id/assign', protect, assignTask);

module.exports = router;
