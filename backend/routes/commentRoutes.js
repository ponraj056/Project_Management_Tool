const express = require('express');
const {
    getComments,
    createComment,
    updateComment,
    deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Comment routes under task
router
    .route('/tasks/:taskId/comments')
    .get(protect, getComments)
    .post(protect, createComment);

// Individual comment routes
router
    .route('/:id')
    .put(protect, updateComment)
    .delete(protect, deleteComment);

module.exports = router;
