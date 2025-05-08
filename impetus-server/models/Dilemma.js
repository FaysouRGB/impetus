import { Schema, model } from "mongoose";

const dilemmaSchema = new Schema({
  title: String,
  requiredPlayers: Number,
  question: String,
  choices: [String],
  outcomes: [
    {
      counts: [Number],
      scores: [Number],
    },
  ],
});

export default model("Dilemma", dilemmaSchema);
