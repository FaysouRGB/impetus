const express = require("express");
const router = express.Router();
const Dilemma = require("../models/Dilemma");
const User = require("../models/User").default;
const Game = require("../models/Game");

router.post("/:dilemmaId/join", async (req, res) => {
  const { dilemmaId } = req.params;
  const dilemma = await Dilemma.findById(dilemmaId);
  if (!dilemma) {
    return res.status(404).json({ message: "Dilemma not found" });
  }

  const userId = req.user.discordId;
  const { choice } = req.body;
  const choiceIndex = dilemma.choices.indexOf(choice);
  if (choiceIndex === -1) {
    return res.status(400).json({ message: "Invalid choice" });
  }

  let game = await Game.findOne({
    dilemmaId,
    resolved: false,
    "players.playerId": { $ne: userId },
  });

  if (!game) {
    game = await Game.create({
      dilemmaId,
      players: [{ playerId: userId, choice: choiceIndex }],
      createdAt: new Date(),
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
});

router.get("/me", async (req, res) => {
  const userId = req.user.discordId;
  const games = await Game.find({ "players.playerId": userId });
  res.json(games);
});

module.exports = router;
