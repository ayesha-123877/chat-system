import express from "express";
import { getUsers, searchUsers, getUserById } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected with verifyToken middleware
router.get("/", verifyToken, getUsers);           // Get all users
router.get("/search", verifyToken, searchUsers);  // Search users
router.get("/:id", verifyToken, getUserById);     // Get single user

export default router;