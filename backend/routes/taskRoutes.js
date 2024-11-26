const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskControllers.js");

router.patch("/updateOrder", taskController.updateOrder);
router.post("/updateOrderDragAndDrop", taskController.updateOrderDragAndDrop);
router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTask);
router.patch("/:_id", taskController.updateTask);
router.delete("/:_id", taskController.deleteTask);

module.exports = router;