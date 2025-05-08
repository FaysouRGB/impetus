import Dilemma from "../models/Dilemma.js";
import Game from "../models/Game.js";
import User from "../models/User.js";

export const getDilemmas = async (req, res) => {
  try {
    const dilemmas = await Dilemma.find();

    const userId = req.user.discordId;
    const unresolvedGames = await Game.find({
      resolved: false,
      "players.playerId": userId,
    });

    const unresolvedDilemmaIds = unresolvedGames.map((game) => game.dilemmaId);

    const updatedDilemmas = dilemmas.map((dilemma) => {
      const unresolvedPending = unresolvedDilemmaIds.includes(dilemma._id.toString());
      return {
        ...dilemma.toObject(),
        unresolvedPending,
      };
    });

    res.status(200).json(updatedDilemmas);
  } catch (error) {
    console.error("Error fetching dilemmas:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAGameDilemma = async (req, res) => {
  const { dilemmaId } = req.params;
  const userId = req.user.discordId;
  let existingGame = await Game.findOne({
    dilemmaId,
    resolved: false,
    "players.playerId": { $ne: userId },
  }).sort({ createdAt: 1 });
  return res.status(200).json(existingGame);
};

export const playDilemmaById = async (req, res) => {
  const { dilemmaId, choiceIndex } = req.params;
  const dilemma = await Dilemma.findById(dilemmaId);
  if (!dilemma) {
    return res.status(404).json({ message: "Dilemma not found" });
  }

  if (!dilemma.choices[choiceIndex]) {
    return res.status(400).json({ message: "Invalid choice" });
  }

  const existingGame = await Game.findOne({
    dilemmaId,
    resolved: false,
    "players.playerId": req.user.discordId,
  });
  if (existingGame) {
    return res.status(400).json({ message: "You have an unresolved dilemma of this type pending" });
  }

  const userId = req.user.discordId;
  let game = await Game.findOne({
    dilemmaId,
    resolved: false,
    "players.playerId": { $ne: userId },
  }).sort({ createdAt: 1 });

  if (!game) {
    game = await Game.create({
      dilemmaId,
      players: [{ playerId: userId, choice: choiceIndex }],
    });
  } else {
    game.players.push({ playerId: userId, choice: choiceIndex });
  }

  if (game.players.length === dilemma.requiredPlayers) {
    game.resolved = true;

    const counts = dilemma.choices.map((_, i) => game.players.filter((p) => p.choice === i).length);

    const matchedOutcome = dilemma.outcomes.find((o) => o.counts.every((v, i) => v === counts[i]));

    const scores = matchedOutcome.scores;

    game.scores = game.players.map((player, index) => ({
      playerId: player.playerId,
      score: scores[index],
    }));

    for (const entry of game.scores) {
      await User.findOneAndUpdate({ discordId: entry.playerId }, { $inc: { score: entry.score } });
    }

    await game.save();
    return res.json({
      message: "Game resolved",
      game,
    });
  }

  await game.save();
  return res.json({
    message: "Game unresolved",
    game,
  });
};
