const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {createTask,getTasks,getTaskById,updateTask,deleteTask,} = require("../controllers/task");
const router = express.Router();

// All routes protected
router.post("/", authMiddleware(), createTask);
router.get("/", getTasks);
router.get("/:id", authMiddleware(), getTaskById);
router.put("/:id", authMiddleware(), updateTask);
router.delete("/:id", authMiddleware(), deleteTask);

module.exports = router;
