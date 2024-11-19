const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskControllers.js");

router.patch("/updateOrder", taskController.updateOrder);
router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTask);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;