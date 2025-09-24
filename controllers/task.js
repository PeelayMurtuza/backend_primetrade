const Task = require("../models/task");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({
      title,
      description,
      user: req.user.id, // from JWT middleware
    });
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all tasks (admin sees all, user sees own)
exports.getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find().populate("user", "email role");
    } else {
      tasks = await Task.find({ user: req.user.id });
    }
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("user", "email role");
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    if (req.user.role !== "admin" && task.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    if (req.user.role !== "admin" && task.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { title, description, completed } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    // Handle populated or unpopulated user
    const taskUserId =
      task.user && task.user._id ? task.user._id.toString() : task.user.toString();

    if (req.user.role !== "admin" && taskUserId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await Task.findByIdAndDelete(task._id);

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


