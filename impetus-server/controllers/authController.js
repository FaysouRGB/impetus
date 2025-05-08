import passport from "passport";
import { generateToken } from "../utils/authUtils.js";
import User from "../models/User.js";
import Game from "../models/Game.js";
import { FRONTEND_URL } from "../config/config.js";

export const discordAuth = passport.authenticate("discord", { session: false });

export const discordCallback = (req, res) => res.redirect(`${FRONTEND_URL}?token=${generateToken(req.user)}`);

export const getMe = (req, res) =>
  res.json({
    discordId: req.user.discordId,
  });

export const getPlayerById = async (req, res) => {
  const { playerId } = req.params;
  try {
    const player = await User.findOne({ discordId: playerId });
    if (!player) {
      console.error("Player not found:", playerId);
      return res.status(404).json({ message: "Player not found" });
    }
    console.log("Player found:", player);
    return res.status(200).json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlayerHistoryById = async (req, res) => {
  const { playerId } = req.params;
  try {
    const player = await User.findOne({ discordId: playerId });
    if (!player) {
      console.error("Player not found:", playerId);
      return res.status(404).json({ message: "Player not found" });
    }

    // fetch all matches played by the player
    const matches = await Game.find({ "players.playerId": playerId }).sort({ createdAt: -1 });
    return res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching player history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
