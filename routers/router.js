import express from "express";
import { login, register ,changePassword } from "../controllers/user.controllers.js";
import { protect, authorization } from "../middleware/userAuthMiddleware.js";
import {
  getAllTasks,
  createTask,
  deleteTask,
  updateTask,
  changeRole,
  completedTask,
} from "../controllers/task.controllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/myProfile", protect, (req, res) => {
  res.status(200).json({ data: req.user });
});

router.put("/changePassword", protect, changePassword);
router.get("/getAllTasks", protect, getAllTasks);
router.post("/createTask", protect, authorization("admin"), createTask);
router.delete("/deleteTask/:id", protect, authorization("admin"), deleteTask);
router.put("/updateTask/:id", protect, authorization("admin"), updateTask);
router.put(
  "/completedTask/:id",
  protect,
  authorization("admin", "manager", "employee", "teamlead"),
  completedTask
);
router.put("/changeRole/:id", protect, changeRole);

export default router;
