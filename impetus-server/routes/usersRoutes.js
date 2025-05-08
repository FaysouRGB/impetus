import { Router } from "express";
import { getProfile, getLeaderboard } from "../controllers/usersController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/profile", authenticate, getProfile);

router.get("/leaderboard", getLeaderboard);

export default router;
