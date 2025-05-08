import { Router } from "express";
import { getAGameDilemma, getDilemmas, playDilemmaById as playDilemmaById } from "../controllers/dilemmasController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authenticate, getDilemmas);

router.get("/:dilemmaId", authenticate, getAGameDilemma);

router.get("/:dilemmaId/:choiceIndex", authenticate, playDilemmaById);

export default router;
