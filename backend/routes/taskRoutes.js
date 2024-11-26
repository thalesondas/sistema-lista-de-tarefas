const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskControllers.js");

router.patch("/updateOrder", taskController.updateOrder);
router.post("/updateOrderDragAndDrop", taskController.updateOrderDragAndDrop);
router.get("/tasks", taskController.getAllTasks);
router.post("/tasks", taskController.createTask);
router.patch("/tasks/:_id", taskController.updateTask);
router.delete("/tasks/:_id", taskController.deleteTask);

module.exports = router;