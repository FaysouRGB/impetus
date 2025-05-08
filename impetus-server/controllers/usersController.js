import User from "../models/User.js";

export const getProfile = (req, res) => {
  const discordId = req.user.discordId;
  User.findOne({ discordId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        discordId: user.discordId,
        username: user.username,
        avatar: user.avatar,
        score: user.score,
        createdAt: user.createdAt,
      });
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
};

export const getLeaderboard = (req, res) => {
  User.find()
    .sort({ score: -1 })
    .limit(5)
    .then((users) => {
      const leaderboard = users.map((user) => ({
        username: user.username,
        avatar: user.avatar,
        score: user.score,
      }));
      res.json(leaderboard);
    })
    .catch((error) => {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Internal server error" });
    });
};
