import { Router } from "express";
import { discordAuth, discordCallback, getMe, getPlayerById, getPlayerHistoryById } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/discord", discordAuth);
router.get("/discord/callback", discordAuth, discordCallback);
router.get("/me", authenticate, getMe);
router.get("/:playerId", getPlayerById);
router.get("/:playerId/history", getPlayerHistoryById);

export default router;
