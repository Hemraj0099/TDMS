const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Task = require('../models/taskModel');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Setup file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Assign new task (Only Admin can do this)
router.post('/assign', authMiddleware, upload.single('document'), async (req, res) => {
    const { title, description, assignedTo } = req.body;
    const document = req.file ? req.file.filename : null;

    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only admin can assign tasks." });
        }

        const task = new Task({
            title,
            description,
            assignedTo,
            document,
            history: [
                {
                    action: "Task Assigned",
                    by: decoded.email,
                    timestamp: new Date()
                }
            ]
        });

        await task.save();
        res.status(201).json({ message: "Task assigned successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Get tasks (Admin ➔ all tasks, User ➔ only own tasks)
router.get('/get', authMiddleware, async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let tasks;

        if (decoded.role === "admin") {
            tasks = await Task.find();
        } else {
            tasks = await Task.find({ assignedTo: decoded.email });
        }

        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Complete a task (User can complete their task)
router.put('/complete/:id', authMiddleware, async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await Task.findByIdAndUpdate(
            req.params.id,
            {
                status: "Completed",
                $push: {
                    history: {
                        action: "Task Completed",
                        by: decoded.email,
                        timestamp: new Date()
                    }
                }
            }
        );

        res.status(200).json({ message: "Task marked as completed" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Add history entry manually (for custom updates: document requested, rejected, etc.)
router.post('/history/:taskId', authMiddleware, async (req, res) => {
    try {
        const { action } = req.body;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const historyEntry = {
            action,
            by: decoded.email,
            timestamp: new Date()
        };

        await Task.findByIdAndUpdate(req.params.taskId, {
            $push: { history: historyEntry }
        });

        res.status(200).json({ message: "History updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get history of a task
router.get('/history/:taskId', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        res.json(task.history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
