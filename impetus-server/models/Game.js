import { Schema, model } from "mongoose";

const gameSchema = new Schema({
  dilemmaId: { type: String, required: true },
  players: [
    {
      playerId: { type: String, required: true },
      choice: { type: Number, required: true },
    },
  ],
  resolved: { type: Boolean, default: false },
  scores: [
    {
      playerId: String,
      score: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default model("Game", gameSchema);
