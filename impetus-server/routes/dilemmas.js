const express = require("express");
const router = express.Router();
const Dilemma = require("../models/Dilemma").default;

router.get("/", async (req, res) => {
  const dilemmas = await Dilemma.find();
  res.json(dilemmas);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const dilemma = await Dilemma.findById(id);
  if (!dilemma) {
    return res.status(404).json({ message: "Dilemma not found" });
  }
  res.json(dilemma);
});

module.exports = router;
